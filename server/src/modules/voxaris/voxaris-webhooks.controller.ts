/**
 * Voxaris Webhooks Controller
 *
 * The funnel: catches all Retell voice and Tavus video events,
 * syncs everything to GoHighLevel CRM.
 *
 * Also handles inbound GHL webhooks → trigger Retell outbound calls.
 *
 * Endpoints:
 * - POST /api/voxaris/webhooks/retell  → Retell call events → GHL sync
 * - POST /api/voxaris/webhooks/tavus   → Tavus video events → GHL sync
 * - POST /api/voxaris/webhooks/ghl     → GHL webhook → trigger outbound call
 */

import { Router, Request, Response } from 'express';
import { ghl } from '../../lib/ghl';
import { retell } from '../../lib/retell';
import { supabase } from '../../lib/supabase';
import { logger } from '../../lib/logger';

const router = Router();

// Config
const VOXARIS_GHL_WEBHOOK_SECRET = process.env.VOXARIS_GHL_WEBHOOK_SECRET;
const VOXARIS_OUTBOUND_AGENT_ID = process.env.VOXARIS_OUTBOUND_AGENT_ID;
const VOXARIS_OUTBOUND_NUMBER = process.env.VOXARIS_OUTBOUND_NUMBER;

// ============================================================================
// RETELL WEBHOOKS (Voice Calls → GHL)
// ============================================================================

/**
 * POST /api/voxaris/webhooks/retell
 *
 * Receives Retell call events (call_analyzed, call_ended, etc.)
 * and syncs the data to GoHighLevel.
 *
 * Flow: Retell webhook → log to Supabase → create/update GHL contact → add GHL note
 */
router.post('/retell', async (req: Request, res: Response) => {
  try {
    const event = req.body;

    // Only process call_analyzed events (post-call data with transcript/summary)
    if (event.event !== 'call_analyzed') {
      logger.debug(`Voxaris: Ignoring Retell event: ${event.event}`);
      return res.json({ ignored: true, event: event.event });
    }

    logger.info(`📞 Voxaris Retell webhook: ${event.call_id}`);

    // Process synchronously (Voxaris demo has low volume)
    await processRetellCallAnalyzed(event);

    return res.status(202).json({
      received: true,
      status: 'processed',
    });

  } catch (error: any) {
    logger.error(`❌ Voxaris Retell webhook error: ${error.message}`);
    // Return 200 so Retell doesn't retry
    res.status(200).json({ error: error.message });
  }
});

/**
 * Process a Retell call_analyzed event.
 * Logs to Supabase, resolves contact, syncs to GHL.
 */
async function processRetellCallAnalyzed(event: any): Promise<void> {
  const {
    call_id,
    call,
    duration_seconds,
    recording_url,
    post_call_analysis,
    transcript,
  } = event;

  const direction = call?.direction || event.metadata?.type || 'inbound';
  const customerPhone = direction === 'outbound' ? call?.to_number : call?.from_number;
  const metadata = call?.metadata || event.metadata || {};

  // 1. Log to Supabase
  try {
    await supabase.from('calls').insert({
      call_id,
      client_id: 'voxaris-demo',
      platform: 'retell',
      direction,
      started_at: call?.start_timestamp
        ? new Date(call.start_timestamp).toISOString()
        : new Date().toISOString(),
      ended_at: call?.end_timestamp
        ? new Date(call.end_timestamp).toISOString()
        : new Date().toISOString(),
      duration_seconds,
      transcript: transcript || post_call_analysis?.transcript,
      summary: post_call_analysis?.call_summary,
      outcome: post_call_analysis?.call_outcome,
      sentiment_score: post_call_analysis?.sentiment_score,
      metadata: event,
      flagged: duration_seconds < 10,
    });
  } catch (dbError: any) {
    logger.warn(`⚠️ Failed to log Voxaris call to Supabase: ${dbError.message}`);
  }

  // 2. Resolve or create GHL contact
  if (!customerPhone) {
    logger.warn(`⚠️ No customer phone for Voxaris call ${call_id}`);
    return;
  }

  // Determine tags based on source
  const tags = ['voxaris-demo'];
  if (direction === 'outbound') tags.push('outbound-call');
  else tags.push('inbound-call');

  if (metadata.source === 'ghl-webhook') tags.push('ghl-triggered');
  if (post_call_analysis?.call_outcome?.toLowerCase().includes('booked') ||
      post_call_analysis?.call_outcome?.toLowerCase().includes('scheduled')) {
    tags.push('meeting-booked');
  }

  // Extract name from post-call analysis or metadata
  const customerName = post_call_analysis?.customer_name
    || metadata.customer_name
    || metadata.firstName
    || '';
  const customerEmail = post_call_analysis?.customer_email || '';
  const company = post_call_analysis?.company_name
    || metadata.company
    || metadata.company_name
    || '';

  try {
    const contact = await ghl.createOrUpdateContact({
      name: customerName || undefined,
      phone: customerPhone,
      email: customerEmail || undefined,
      tags,
      customFields: {
        ai_conversation_type: `Voice (Retell) - ${direction}`,
        ai_conversation_id: call_id,
        ai_conversation_duration: `${duration_seconds}s`,
        ai_conversation_outcome: post_call_analysis?.call_outcome || 'completed',
        ai_conversation_summary: post_call_analysis?.call_summary || '',
        ai_recording_url: recording_url || '',
        source: metadata.source === 'ghl-webhook'
          ? 'GHL Webhook → AI Outbound'
          : 'Voxaris Demo Page',
        company: company,
      },
    });

    // 3. Add note with call details
    if (contact?.id) {
      const noteContent = [
        `## Voxaris AI Call`,
        ``,
        `**Direction:** ${direction}`,
        `**Duration:** ${duration_seconds}s`,
        `**Outcome:** ${post_call_analysis?.call_outcome || 'completed'}`,
        post_call_analysis?.call_summary
          ? `**Summary:** ${post_call_analysis.call_summary}`
          : '',
        recording_url ? `**Recording:** ${recording_url}` : '',
        company ? `**Company:** ${company}` : '',
        metadata.source === 'ghl-webhook'
          ? `**Triggered by:** GHL Webhook`
          : `**Source:** Voxaris Demo Page`,
      ].filter(Boolean).join('\n');

      await ghl.addNote(contact.id, noteContent);

      logger.info(`✅ Voxaris call synced to GHL: ${contact.id} (${tags.join(', ')})`);
    }

  } catch (ghlError: any) {
    logger.error(`❌ Voxaris GHL sync failed for call ${call_id}: ${ghlError.message}`);
  }
}

// ============================================================================
// TAVUS WEBHOOKS (Video Conversations → GHL)
// ============================================================================

/**
 * POST /api/voxaris/webhooks/tavus
 *
 * Receives Tavus conversation events and syncs to GoHighLevel.
 *
 * Flow: Tavus webhook → log to Supabase → create/update GHL contact → add GHL note
 */
router.post('/tavus', async (req: Request, res: Response) => {
  try {
    const event = req.body;

    logger.info(`🎥 Voxaris Tavus webhook: ${event.event}`);

    // Process conversation.ended events
    if (event.event === 'conversation.ended') {
      await processTavusConversationEnded(event, req.query);
    } else {
      logger.debug(`Voxaris: Ignoring Tavus event: ${event.event}`);
    }

    return res.status(202).json({
      received: true,
      status: 'processed',
    });

  } catch (error: any) {
    logger.error(`❌ Voxaris Tavus webhook error: ${error.message}`);
    res.status(200).json({ error: error.message });
  }
});

/**
 * Process a Tavus conversation.ended event.
 */
async function processTavusConversationEnded(event: any, queryParams: any): Promise<void> {
  const {
    conversation_id,
    duration_seconds,
    summary,
    sentiment,
    metadata,
    transcript,
  } = event;

  // 1. Log to Supabase
  try {
    await supabase.from('calls').insert({
      call_id: conversation_id,
      client_id: 'voxaris-demo',
      platform: 'tavus',
      direction: 'inbound', // Video is always visitor-initiated
      started_at: new Date(Date.now() - (duration_seconds || 0) * 1000).toISOString(),
      ended_at: new Date().toISOString(),
      duration_seconds,
      summary,
      transcript,
      sentiment_score: sentiment ? Math.round(sentiment.score * 100) : null,
      outcome: 'video_completed',
      metadata: event,
      flagged: false,
    });
  } catch (dbError: any) {
    logger.warn(`⚠️ Failed to log Voxaris video to Supabase: ${dbError.message}`);
  }

  // 2. Resolve contact (from query params, metadata, or tool-call data)
  const contactPhone = queryParams?.phone || metadata?.phone;
  const contactEmail = queryParams?.email || metadata?.email;
  const contactName = metadata?.customer_name || '';

  if (!contactPhone && !contactEmail) {
    logger.info(`ℹ️ No contact info for Voxaris video ${conversation_id} — skipping GHL sync`);
    return;
  }

  try {
    const contact = await ghl.createOrUpdateContact({
      name: contactName || undefined,
      phone: contactPhone,
      email: contactEmail,
      tags: ['voxaris-demo', 'video-chat'],
      customFields: {
        ai_conversation_type: 'Video (Tavus)',
        ai_conversation_id: conversation_id,
        ai_conversation_duration: `${duration_seconds}s`,
        ai_conversation_summary: summary || '',
        source: 'Voxaris Demo - Video Chat',
      },
    });

    if (contact?.id && summary) {
      await ghl.addNote(
        contact.id,
        `## Voxaris AI Video Chat\n\n` +
        `**Duration:** ${duration_seconds}s\n` +
        `**Summary:** ${summary}\n` +
        `**Source:** Voxaris Demo Page`,
      );

      logger.info(`✅ Voxaris video synced to GHL: ${contact.id}`);
    }

  } catch (ghlError: any) {
    logger.error(`❌ Voxaris GHL sync failed for video ${conversation_id}: ${ghlError.message}`);
  }
}

// ============================================================================
// GHL INBOUND WEBHOOK → TRIGGER OUTBOUND CALL
// ============================================================================

/**
 * POST /api/voxaris/webhooks/ghl
 *
 * Receives webhooks from GoHighLevel and triggers a Retell outbound call.
 * This is the automation funnel: new lead in GHL → Maria calls them automatically.
 *
 * Setup in GHL:
 * - Settings → Webhooks → Add Webhook
 * - URL: https://[server]/api/voxaris/webhooks/ghl?secret=YOUR_SECRET
 * - Triggers: Contact Created, Tag Added, Pipeline Stage Changed
 *
 * GHL sends payloads like:
 * {
 *   type: "ContactCreate" | "ContactTagUpdate" | "OpportunityStageUpdate",
 *   locationId: "...",
 *   id: "contact-id",
 *   firstName: "...",
 *   lastName: "...",
 *   phone: "...",
 *   email: "...",
 *   companyName: "...",
 *   tags: ["tag1", "tag2"],
 *   customFields: [{ id: "...", value: "..." }],
 *   ...
 * }
 */
router.post('/ghl', async (req: Request, res: Response) => {
  try {
    // Validate webhook secret
    const secret = req.query.secret as string;
    if (VOXARIS_GHL_WEBHOOK_SECRET && secret !== VOXARIS_GHL_WEBHOOK_SECRET) {
      logger.warn('⚠️ Voxaris GHL webhook: invalid secret');
      return res.status(401).json({ error: 'Invalid webhook secret' });
    }

    const payload = req.body;
    const eventType = payload.type || payload.event;

    logger.info(`📩 Voxaris GHL webhook: ${eventType}`);

    // Extract contact data from GHL payload
    // GHL can send contact data at top level or nested under "contact"
    const contact = payload.contact || payload;
    const contactId = payload.id || payload.contactId || contact.id;
    const firstName = contact.firstName || contact.first_name || '';
    const lastName = contact.lastName || contact.last_name || '';
    const phone = contact.phone || '';
    const email = contact.email || '';
    const companyName = contact.companyName || contact.company_name || '';
    const tags = contact.tags || [];

    // Must have a phone number to trigger a call
    if (!phone) {
      logger.info(`ℹ️ Voxaris GHL webhook: no phone number, skipping outbound call`);
      return res.json({
        success: false,
        reason: 'no_phone',
        message: 'Contact has no phone number — cannot trigger outbound call',
      });
    }

    // Check if outbound agent is configured
    if (!VOXARIS_OUTBOUND_AGENT_ID || !VOXARIS_OUTBOUND_NUMBER) {
      logger.error('❌ VOXARIS_OUTBOUND_AGENT_ID or VOXARIS_OUTBOUND_NUMBER not configured');
      return res.status(500).json({
        success: false,
        error: 'Outbound agent not configured',
      });
    }

    // Build dynamic variables for the Retell agent
    const customerName = firstName || 'there';
    const introContext = buildIntroContext(eventType, tags);

    logger.info(`📞 Triggering Voxaris outbound call: ${customerName} (${companyName || 'N/A'}) → ${phone}`);

    const callResult = await retell.createOutboundCall({
      fromNumber: VOXARIS_OUTBOUND_NUMBER,
      toNumber: normalizePhone(phone),
      agentId: VOXARIS_OUTBOUND_AGENT_ID,
      dynamicVariables: {
        customer_name: customerName,
        company_name: companyName,
        intro_context: introContext,
      },
      metadata: {
        source: 'ghl-webhook',
        ghl_contact_id: contactId,
        ghl_event_type: eventType,
        ghl_tags: tags,
        company: companyName,
        firstName,
        lastName,
      },
    });

    // Log the attempt
    try {
      await supabase.from('call_logs').insert({
        phone: normalizePhone(phone),
        call_id: callResult.callId,
        direction: 'outbound',
        client_id: 'voxaris-demo',
        status: callResult.success ? 'initiated' : 'failed',
        metadata: {
          source: 'ghl-webhook',
          ghl_contact_id: contactId,
          ghl_event_type: eventType,
          error: callResult.error,
        },
        created_at: new Date().toISOString(),
      });
    } catch (dbError: any) {
      logger.warn(`⚠️ Failed to log GHL-triggered call: ${dbError.message}`);
    }

    // Add note to GHL contact
    if (callResult.success && contactId) {
      try {
        await ghl.addNote(
          contactId,
          `## AI Outbound Call Triggered\n\n` +
          `**Triggered by:** GHL Webhook (${eventType})\n` +
          `**Call ID:** ${callResult.callId}\n` +
          `**Agent:** Maria (Voxaris AI)\n` +
          `**Time:** ${new Date().toLocaleString('en-US')}`,
        );
      } catch (noteError: any) {
        logger.warn(`⚠️ Failed to add GHL note: ${noteError.message}`);
      }
    }

    if (callResult.success) {
      logger.info(`✅ GHL-triggered outbound call initiated: ${callResult.callId}`);
      return res.json({
        success: true,
        call_id: callResult.callId,
      });
    }

    logger.error(`❌ GHL-triggered outbound call failed: ${callResult.error}`);
    return res.status(500).json({
      success: false,
      error: callResult.error || 'Failed to trigger call',
    });

  } catch (error: any) {
    logger.error(`❌ Voxaris GHL webhook error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Build intro context for the outbound call based on GHL event type and tags.
 */
function buildIntroContext(eventType: string, tags: string[]): string {
  // Check tags first for specific scenarios
  const tagSet = new Set(tags.map((t: string) => t.toLowerCase()));

  if (tagSet.has('demo-request') || tagSet.has('demo_request')) {
    return 'calling because you requested a demo of our AI platform';
  }
  if (tagSet.has('website-lead') || tagSet.has('website_lead')) {
    return 'calling to follow up on your visit to our website';
  }
  if (tagSet.has('referral')) {
    return 'calling because someone recommended you check out Voxaris';
  }

  // Fall back to event type
  switch (eventType) {
    case 'ContactCreate':
      return 'calling to introduce you to Voxaris AI';
    case 'ContactTagUpdate':
      return 'calling to follow up with you';
    case 'OpportunityStageUpdate':
      return 'calling to continue our conversation about Voxaris';
    default:
      return 'calling from Voxaris AI to see how we can help your business';
  }
}

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  if (phone.startsWith('+')) return phone;
  return `+${digits}`;
}

export default router;
