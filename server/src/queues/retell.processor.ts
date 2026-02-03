import { Job, Processor } from 'bullmq';
import { ghl } from '../lib/ghl';
import { logger } from '../lib/logger';
import { supabase } from '../lib/supabase';
import { clientsService } from '../modules/clients/clients.service';
import { RetellWebhookJob, addGHLJob } from './index';

/**
 * Retell Webhook Processor
 *
 * Handles events from Retell voice calls:
 * - call_analyzed: Full post-call analysis with transcript, sentiment, outcome
 */
export const retellProcessor: Processor<RetellWebhookJob> = async (job: Job<RetellWebhookJob>) => {
  const { type, event } = job.data;
  const startTime = Date.now();

  logger.info(`📞 Processing Retell job: ${type}`, {
    jobId: job.id,
    callId: event.call_id
  });

  try {
    switch (type) {
      case 'call_analyzed':
        await processCallAnalyzed(event);
        break;

      default:
        logger.warn(`Unknown Retell event type: ${type}`);
    }

    const duration = Date.now() - startTime;
    logger.info(`✅ Retell job completed in ${duration}ms`, { jobId: job.id });

  } catch (error: any) {
    logger.error(`❌ Retell job failed: ${error.message}`, {
      jobId: job.id,
      error: error.stack
    });
    throw error; // Rethrow to trigger retry
  }
};

/**
 * Process call_analyzed event
 */
async function processCallAnalyzed(event: any): Promise<void> {
  const {
    call_id,
    duration_seconds,
    post_call_analysis,
    recording_url,
    agent_id
  } = event;

  // Step 1: Log to Supabase
  const client = await clientsService.getClientByRetellAgentId(agent_id);

  if (client) {
    const { error: dbError } = await supabase.from('calls').insert({
      call_id: call_id,
      client_id: client.id,
      platform: 'retell',
      direction: event.call?.direction || 'inbound',
      started_at: new Date(event.call?.start_timestamp || Date.now()).toISOString(),
      ended_at: new Date(event.call?.end_timestamp || Date.now()).toISOString(),
      duration_seconds: duration_seconds,
      transcript: post_call_analysis?.transcript,
      summary: post_call_analysis?.call_summary,
      outcome: post_call_analysis?.call_outcome,
      sentiment_score: post_call_analysis?.sentiment_score,
      metadata: event,
      flagged: duration_seconds < 10 // Auto-flag short calls
    });

    if (dbError) {
      logger.error('❌ Failed to log Retell call to DB:', dbError);
    } else {
      logger.info('✅ Retell call logged to Supabase');
    }
  } else {
    logger.warn(`⚠️ Client not found for Retell Agent: ${agent_id}`);
  }

  // Step 2: Resolve Contact ID
  let contactId = event.call?.metadata?.contact_id || event.metadata?.contact_id;

  if (!contactId) {
    logger.info('⚠️ No contact ID in metadata. Attempting phone lookup...');
    const call = event.call || event;
    const direction = call.direction || 'inbound';
    const customerNumber = direction === 'outbound' ? call.to_number : call.from_number;

    if (customerNumber) {
      const found = await ghl.findContact(customerNumber);
      if (found?.id) {
        contactId = found.id;
        logger.info(`✅ Found contact via phone lookup (${direction}): ${contactId}`);
      }
    }
  }

  if (!contactId) {
    logger.warn('⚠️ Failed to resolve contact ID for Retell call');
    return;
  }

  // Step 3: Queue GHL sync jobs
  const customFields: Record<string, any> = {
    ai_conversation_type: 'Voice (Retell)',
    ai_conversation_id: call_id,
    ai_conversation_duration: duration_seconds,
    ai_recording_url: recording_url,
  };

  if (post_call_analysis) {
    Object.assign(customFields, {
      ai_conversation_outcome: post_call_analysis.call_outcome,
      ai_conversation_summary: post_call_analysis.call_summary,
      customer_intent: post_call_analysis.customer_intent,
      primary_objection: post_call_analysis.primary_objection,
      lead_quality: post_call_analysis.lead_quality,
      appointment_booked: post_call_analysis.appointment_booked ? 'Yes' : 'No',
      sentiment_score: post_call_analysis.sentiment_score
    });
  }

  // Queue contact update
  await addGHLJob({
    type: 'update_contact',
    contactId,
    data: { customFields },
    source: 'retell'
  });

  // Queue note
  if (post_call_analysis) {
    await addGHLJob({
      type: 'add_note',
      contactId,
      data: {
        content: `## AI Voice Conversation\n\n` +
          `**Outcome:** ${post_call_analysis.call_outcome}\n` +
          `**Summary:** ${post_call_analysis.call_summary}\n` +
          `**Recording:** ${recording_url}`
      },
      source: 'retell'
    });
  }

  // Step 4: Handle appointment booking
  if (post_call_analysis?.appointment_booked) {
    logger.info('📅 Appointment detected! Queuing follow-up actions.');

    // Update tags
    await addGHLJob({
      type: 'update_contact',
      contactId,
      data: {
        tags: ['appointment_booked', 'needs_scheduling_review']
      },
      source: 'retell'
    });

    // Send confirmation SMS
    await addGHLJob({
      type: 'send_sms',
      contactId,
      data: {
        message: "Thanks! Maria here. I've noted your request for an appointment. I'll text you shortly to confirm the exact slot."
      },
      source: 'retell'
    });
  }

  logger.info(`✅ GHL sync jobs queued for contact: ${contactId}`);
}
