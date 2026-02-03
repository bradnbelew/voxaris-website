import { Job, Processor } from 'bullmq';
import { ghl } from '../lib/ghl';
import { logger } from '../lib/logger';
import { supabase } from '../lib/supabase';
import { clientsService } from '../modules/clients/clients.service';
import { TavusWebhookJob, addGHLJob } from './index';

/**
 * Tavus Webhook Processor
 *
 * Handles events from Tavus video conversations:
 * - conversation.ended: Log to DB, sync to GHL
 * - perception_analysis: Future use (facial expression, sentiment)
 * - transcription_ready: Future use (transcript processing)
 */
export const tavusProcessor: Processor<TavusWebhookJob> = async (job: Job<TavusWebhookJob>) => {
  const { type, event, queryParams } = job.data;
  const startTime = Date.now();

  logger.info(`🎥 Processing Tavus job: ${type}`, {
    jobId: job.id,
    conversationId: event.conversation_id
  });

  try {
    switch (type) {
      case 'conversation.ended':
        await processConversationEnded(event, queryParams);
        break;

      case 'perception_analysis':
        // Future: Handle real-time perception data
        logger.info('📊 Perception analysis received (not processed yet)');
        break;

      case 'transcription_ready':
        // Future: Handle transcript for analysis
        logger.info('📝 Transcription ready (not processed yet)');
        break;

      default:
        logger.warn(`Unknown Tavus event type: ${type}`);
    }

    const duration = Date.now() - startTime;
    logger.info(`✅ Tavus job completed in ${duration}ms`, { jobId: job.id });

  } catch (error: any) {
    logger.error(`❌ Tavus job failed: ${error.message}`, {
      jobId: job.id,
      error: error.stack
    });
    throw error; // Rethrow to trigger retry
  }
};

/**
 * Process conversation.ended event
 */
async function processConversationEnded(
  event: any,
  queryParams?: Record<string, string>
): Promise<void> {
  const {
    conversation_id,
    duration_seconds,
    summary,
    sentiment,
    metadata,
    persona_id
  } = event;

  // Step 1: Log to Supabase
  const client = await clientsService.getClientByTavusPersonaId(persona_id);

  if (client) {
    const { error: dbError } = await supabase.from('calls').insert({
      call_id: conversation_id,
      client_id: client.id,
      platform: 'tavus',
      direction: 'outbound',
      started_at: new Date(Date.now() - (duration_seconds * 1000)).toISOString(),
      ended_at: new Date().toISOString(),
      duration_seconds: duration_seconds,
      summary: summary,
      sentiment_score: sentiment ? Math.round(sentiment.score * 100) : null,
      outcome: 'video_completed',
      metadata: event,
      flagged: false
    });

    if (dbError) {
      logger.error('❌ Failed to log Tavus call to DB:', dbError);
    } else {
      logger.info('✅ Tavus call logged to Supabase');
    }
  } else {
    logger.warn(`⚠️ Client not found for Tavus Persona: ${persona_id}`);
  }

  // Step 2: Resolve Contact ID
  let contactId = metadata?.contact_id || queryParams?.contact_id;

  if (!contactId) {
    const email = queryParams?.email;
    const phone = queryParams?.phone;

    if (email || phone) {
      logger.info(`🔍 Looking up contact by ${email ? 'email' : 'phone'}...`);
      const found = await ghl.findContact(email || phone || '');
      if (found?.id) {
        contactId = found.id;
        logger.info(`✅ Found contact via lookup: ${contactId}`);
      }
    }
  }

  if (!contactId) {
    logger.warn('⚠️ No contact ID resolved for Tavus conversation');
    return;
  }

  // Step 3: Queue GHL sync jobs (instead of direct calls)
  // This adds resilience if GHL is slow or rate limited

  await addGHLJob({
    type: 'update_contact',
    contactId,
    data: {
      customFields: {
        ai_conversation_type: 'Video (Tavus)',
        ai_conversation_id: conversation_id,
        ai_conversation_summary: summary,
        sentiment_score: sentiment ? Math.round(sentiment.score * 100) : undefined
      }
    },
    source: 'tavus'
  });

  if (summary) {
    await addGHLJob({
      type: 'add_note',
      contactId,
      data: {
        content: `## AI Video Summary\n${summary}`
      },
      source: 'tavus'
    });
  }

  logger.info(`✅ GHL sync jobs queued for contact: ${contactId}`);
}
