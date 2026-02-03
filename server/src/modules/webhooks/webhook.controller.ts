import { Router, Request, Response } from 'express';
import { ghl } from '../../lib/ghl';
import { logger } from '../../lib/logger';
import { addTavusJob, addRetellJob, TavusWebhookJob, RetellWebhookJob } from '../../queues';
import { validateTavusWebhook, validateRetellWebhook } from '../../middleware/webhookAuth';
import OpenAI from 'openai';

const router = Router();

/**
 * WEBHOOK CONTROLLER
 *
 * Handles incoming webhooks from Tavus, Retell, and GHL.
 *
 * SCALING PATTERN:
 * 1. Validate signature (security)
 * 2. Quick acknowledgment (202 Accepted)
 * 3. Queue for background processing
 *
 * This prevents webhook timeouts and enables:
 * - Retry logic for failed processing
 * - Rate limiting for external APIs
 * - Parallel processing of multiple webhooks
 */

// ==========================================
// RETELL WEBHOOKS (Voice)
// ==========================================

/**
 * Retell Voice Call Webhook
 *
 * Events handled:
 * - call_analyzed: Post-call analysis with transcript, sentiment, outcome
 *
 * FLOW:
 * 1. Validate signature (if configured)
 * 2. Check if event type is relevant
 * 3. Queue job for background processing
 * 4. Return 202 immediately
 */
router.post('/retell',
  // Uncomment when RETELL_WEBHOOK_SECRET is configured:
  // validateRetellWebhook,
  async (req: Request, res: Response) => {
    try {
      const event = req.body;

      // Only process call_analyzed events
      if (event.event !== 'call_analyzed') {
        logger.debug(`Ignoring Retell event: ${event.event}`);
        return res.json({ ignored: true, event: event.event });
      }

      logger.info(`📞 Retell webhook received: ${event.call_id}`);

      // Create job for queue
      const job: RetellWebhookJob = {
        type: 'call_analyzed',
        event: event,
        receivedAt: new Date().toISOString(),
      };

      // Queue for background processing
      const queuedJob = await addRetellJob(job);

      if (queuedJob) {
        // Job queued successfully - return immediately
        return res.status(202).json({
          received: true,
          jobId: queuedJob.id,
          status: 'queued',
        });
      } else {
        // Queue not available - fall back to legacy sync processing
        logger.warn('⚠️ Queue not available. Processing Retell webhook synchronously.');
        await processRetellSync(event);
        return res.json({ success: true, mode: 'sync' });
      }

    } catch (error: any) {
      logger.error('❌ Retell Webhook Error:', error);
      res.status(500).json({ error: error.message });
    }
  }
);

// ==========================================
// TAVUS WEBHOOKS (Video)
// ==========================================

/**
 * Tavus Video Conversation Webhook
 *
 * Events handled:
 * - conversation.ended: Video call completed
 * - perception_analysis: Real-time perception data
 * - transcription_ready: Transcript available
 *
 * FLOW:
 * 1. Validate signature (if configured)
 * 2. Determine event type
 * 3. Queue job with query params (for contact resolution)
 * 4. Return 202 immediately
 */
router.post('/tavus',
  // Uncomment when TAVUS_WEBHOOK_SECRET is configured:
  // validateTavusWebhook,
  async (req: Request, res: Response) => {
    try {
      const event = req.body;
      logger.info(`🎥 Tavus webhook received: ${event.event}`);

      // Determine event type
      let eventType: TavusWebhookJob['type'];
      if (event.event === 'conversation.ended') {
        eventType = 'conversation.ended';
      } else if (event.event === 'perception_analysis' || event.event === 'application.perception_analysis') {
        eventType = 'perception_analysis';
      } else if (event.event === 'transcription_ready' || event.event === 'application.transcription_ready') {
        eventType = 'transcription_ready';
      } else {
        logger.debug(`Ignoring Tavus event: ${event.event}`);
        return res.json({ ignored: true, event: event.event });
      }

      // Create job with query params (used for contact resolution)
      const job: TavusWebhookJob = {
        type: eventType,
        event: event,
        receivedAt: new Date().toISOString(),
        queryParams: {
          contact_id: req.query.contact_id as string,
          email: req.query.email as string,
          phone: req.query.phone as string,
        },
      };

      // Queue for background processing
      const queuedJob = await addTavusJob(job);

      if (queuedJob) {
        return res.status(202).json({
          received: true,
          jobId: queuedJob.id,
          status: 'queued',
        });
      } else {
        // Fallback to sync processing
        logger.warn('⚠️ Queue not available. Processing Tavus webhook synchronously.');
        await processTavusSync(event, req.query);
        return res.json({ success: true, mode: 'sync' });
      }

    } catch (error: any) {
      logger.error('❌ Tavus Webhook Error:', error);
      res.status(500).json({ error: error.message });
    }
  }
);

// ==========================================
// GHL INBOUND WEBHOOKS (SMS Bot)
// ==========================================

/**
 * GHL Inbound Message Webhook
 *
 * Handles SMS messages from customers.
 * This one stays synchronous because customers expect
 * immediate responses to texts.
 */
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SMS_SYSTEM_PROMPT = `
You are Maria, a Senior Acquisition Manager at Hill Nissan.
You are chatting via SMS with a customer who received a "Payment Swap" mailer.
GOAL: Get them to come to the showroom for a 10-minute appraisal.
TONE: Professional, warm, concise (SMS style). Max 160 chars per text usually.
KNOWLEDGE:
- Offer: Up to $5,000 over KBB value.
- Address: 123 Hill Nissan Dr.
- Hours: 9am-8pm.
RULES:
- If they ask for price, say "I need to see it in person to give the max offer, but the mailer typically unlocks $3k-$5k over market."
- If they want to book, ask: "Does 2:15 or 4:45 work better for you?"
- If they agree to a time, say "Great, I'll lock that in."
`;

router.post('/ghl', async (req: Request, res: Response) => {
  try {
    const { type, contactId, message } = req.body;

    logger.info(`📩 GHL Event: ${type}`);

    if (type !== 'InboundMessage' || !message?.body) {
      return res.json({ ignored: true });
    }

    if (message.direction === 'outbound') {
      return res.json({ ignored: true });
    }

    logger.info(`💬 Incoming SMS from ${contactId}: "${message.body}"`);

    // Generate AI Response (sync - need immediate reply)
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SMS_SYSTEM_PROMPT },
        { role: 'user', content: message.body },
      ],
      max_tokens: 150,
    });

    const aiReply = completion.choices[0].message.content || 'Hey, this is Maria. Can you stop by today?';

    // Send Reply via GHL
    await ghl.sendSMS(contactId, aiReply);

    res.json({ success: true });

  } catch (error: any) {
    logger.error('❌ SMS Bot Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// LEGACY SYNC PROCESSING (Fallback)
// ==========================================

/**
 * Fallback sync processing when queue is unavailable
 * Mirrors the original synchronous behavior
 */
import { supabase } from '../../lib/supabase';
import { clientsService } from '../clients/clients.service';

async function processRetellSync(event: any): Promise<void> {
  const { call_id, duration_seconds, post_call_analysis, recording_url, agent_id } = event;

  // Log to DB
  const client = await clientsService.getClientByRetellAgentId(agent_id);
  if (client) {
    await supabase.from('calls').insert({
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
      flagged: duration_seconds < 10,
    });
  }

  // Resolve contact
  let contactId = event.call?.metadata?.contact_id || event.metadata?.contact_id;
  if (!contactId) {
    const call = event.call || event;
    const direction = call.direction || 'inbound';
    const customerNumber = direction === 'outbound' ? call.to_number : call.from_number;
    if (customerNumber) {
      const found = await ghl.findContact(customerNumber);
      contactId = found?.id;
    }
  }

  if (!contactId) return;

  // Sync to GHL
  await ghl.createOrUpdateContact({
    id: contactId,
    customFields: {
      ai_conversation_type: 'Voice (Retell)',
      ai_conversation_id: call_id,
      ai_conversation_duration: duration_seconds,
      ai_conversation_outcome: post_call_analysis?.call_outcome,
      ai_conversation_summary: post_call_analysis?.call_summary,
      ai_recording_url: recording_url,
    },
  });

  if (post_call_analysis) {
    await ghl.addNote(contactId,
      `## AI Voice Conversation\n\n` +
      `**Outcome:** ${post_call_analysis.call_outcome}\n` +
      `**Summary:** ${post_call_analysis.call_summary}\n` +
      `**Recording:** ${recording_url}`
    );
  }
}

async function processTavusSync(event: any, queryParams: any): Promise<void> {
  if (event.event !== 'conversation.ended') return;

  const { conversation_id, duration_seconds, summary, sentiment, metadata, persona_id } = event;

  // Log to DB
  const client = await clientsService.getClientByTavusPersonaId(persona_id);
  if (client) {
    await supabase.from('calls').insert({
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
      flagged: false,
    });
  }

  // Resolve contact
  let contactId = metadata?.contact_id || queryParams?.contact_id;
  if (!contactId) {
    const email = queryParams?.email;
    const phone = queryParams?.phone;
    if (email || phone) {
      const found = await ghl.findContact(email || phone);
      contactId = found?.id;
    }
  }

  if (!contactId) return;

  // Sync to GHL
  await ghl.createOrUpdateContact({
    id: contactId,
    customFields: {
      ai_conversation_type: 'Video (Tavus)',
      ai_conversation_id: conversation_id,
      ai_conversation_summary: summary,
      sentiment_score: sentiment ? Math.round(sentiment.score * 100) : undefined,
    },
  });

  if (summary) {
    await ghl.addNote(contactId, `## AI Video Summary\n${summary}`);
  }
}

export default router;
