import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * POST /api/voxaris/tavus/buyback-postcard
 *
 * Creates a Tavus CVI session for the buyback postcard demo.
 * 1. Pushes lead to GoHighLevel (non-blocking)
 * 2. Creates a Tavus CVI session with buyback context
 * 3. Returns the conversation_url for the Daily video embed
 */

const TAVUS_API_KEY = process.env.TAVUS_API_KEY || '';
const PERSONA_ID = 'p12baf16e19a'; // Julia Home - Orlando Motors VIP Buyback
const REPLICA_ID = 'raf6459c9b82'; // Default replica

const TAVUS_URLS = ['https://tavusapi.com', 'https://api.tavus.io'];

const CALLBACK_BASE = (process.env.CALLBACK_BASE_URL || 'https://www.voxaris.io').trim();

// GHL credentials
const GHL_TOKEN = process.env.GHL_ACCESS_TOKEN || '';
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID || '';

// Sendblue (notifications)
const SB_KEY = process.env.SENDBLUE_API_KEY || '';
const SB_SECRET = process.env.SENDBLUE_API_SECRET || '';
const SB_FROM = process.env.SENDBLUE_BUYBACK_FROM || process.env.SENDBLUE_FROM_NUMBER || '+13214744152';
const NOTIFY_NUMBER = process.env.LEAD_NOTIFY_NUMBERS || '+14078195809';
const GHL_WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/euXH15G0pqPgr497kAL2/webhook-trigger/6730dcb6-748c-4323-a525-65b972384f7a';

function getCampaignExpiry(): string {
  const days = parseInt(process.env.CAMPAIGN_DURATION_DAYS || '7', 10);
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + days);
  expiry.setHours(23, 59, 59, 0);
  return expiry.toISOString();
}

async function fireGhlWebhook(payload: Record<string, any>): Promise<void> {
  try {
    await fetch(GHL_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, campaign_expiry: payload.campaign_expiry || getCampaignExpiry(), timestamp: new Date().toISOString(), location_id: GHL_LOCATION_ID }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch {}
}

// ── GHL: Create contact + note on conversation start ──
async function pushToGHL(params: {
  firstName: string;
  lastName: string;
  vehicle: string;
  phone: string;
  email: string;
  campaignType: string;
  recordId: string;
  conversationId: string;
}) {
  if (!GHL_TOKEN || !GHL_LOCATION_ID) {
    console.warn('GHL credentials not set, skipping CRM push');
    return;
  }

  const headers = {
    Authorization: `Bearer ${GHL_TOKEN}`,
    Version: '2021-07-28',
    'Content-Type': 'application/json',
  };

  try {
    const contactRes = await fetch('https://services.leadconnectorhq.com/contacts/', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        firstName: params.firstName || undefined,
        lastName: params.lastName || undefined,
        phone: params.phone || undefined,
        email: params.email || undefined,
        tags: ['buyback-postcard', 'vip-mailer', 'talking-postcard', 'voxaris-lead'],
        source: 'Buyback Postcard QR Scan',
        customFields: [
          { key: 'contact.vehicle_full', field_value: params.vehicle || '' },
          { key: 'contact.campaign_type', field_value: params.campaignType || 'buyback' },
          { key: 'contact.record_id', field_value: params.recordId || '' },
          { key: 'contact.conversation_id', field_value: params.conversationId },
          { key: 'contact.postcard_scanned_at', field_value: new Date().toISOString() },
        ],
        locationId: GHL_LOCATION_ID,
      }),
    });

    if (contactRes.ok) {
      const data = await contactRes.json();
      const contactId = data?.contact?.id;
      console.log(`GHL contact created: ${contactId}`);

      if (contactId) {
        // Add note with full context
        await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}/notes`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            body:
              `## Buyback Postcard QR Scan\n\n` +
              `**Customer:** ${params.firstName || 'Unknown'} ${params.lastName || ''}\n` +
              `**Vehicle:** ${params.vehicle || 'Not specified'}\n` +
              `**Phone:** ${params.phone || 'Not provided'}\n` +
              `**Email:** ${params.email || 'Not provided'}\n` +
              `**Campaign:** VIP Buyback (${params.campaignType})\n` +
              `**Record ID:** ${params.recordId || 'N/A'}\n` +
              `**Conversation ID:** ${params.conversationId}\n` +
              `**Scanned at:** ${new Date().toLocaleString('en-US')}\n` +
              `**Source:** Orlando Motors Buyback Postcard Demo`,
            userId: null,
          }),
        }).catch(() => {});
      }
    } else {
      const errText = await contactRes.text();
      console.warn(`GHL contact creation failed ${contactRes.status}: ${errText}`);
    }
  } catch (err: any) {
    console.warn(`GHL push failed: ${err.message}`);
  }
}

// ── Tavus session creation with domain fallback ──
async function createTavusSession(body: Record<string, any>): Promise<any> {
  for (const baseUrl of TAVUS_URLS) {
    try {
      const resp = await fetch(`${baseUrl}/v2/conversations`, {
        method: 'POST',
        headers: {
          'x-api-key': TAVUS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (resp.ok) {
        const data = await resp.json();
        console.log(`Tavus buyback session via ${baseUrl}: ${data.conversation_id}`);
        return { success: true, data };
      }

      const errText = await resp.text();
      console.warn(`Tavus ${baseUrl} returned ${resp.status}: ${errText}`);
      if (resp.status >= 400 && resp.status < 500) {
        return { success: false, error: errText, status: resp.status };
      }
    } catch (err: any) {
      console.warn(`Tavus ${baseUrl} network error: ${err.message}`);
    }
  }
  return { success: false, error: 'All Tavus endpoints failed' };
}

// ── Main handler ──
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  if (!TAVUS_API_KEY) {
    return res.status(500).json({ success: false, error: 'Tavus API not configured' });
  }

  const { firstName, lastName, vehicle, campaignType, recordId, phone, email } = req.body || {};
  const name = firstName || 'there';
  const v = vehicle || 'your vehicle';

  // Rotate greetings to avoid repetitive patterns (per Tavus prompting guide)
  const greetings = [
    `Hey ${name}! Oh awesome, you scanned the mailer! I'm Maria with Orlando Motors. So we sent you that VIP offer on your ${v} — those are super popular right now. Do you still have it?`,
    `Hey ${name}! Great to see you. I'm Maria over at Orlando Motors. I see you got our VIP mailer about your ${v} — those are in really high demand. You still driving it?`,
    `Hi ${name}! Thanks for checking out the mailer. I'm Maria at Orlando Motors. We put together that VIP offer specifically for your ${v} because the market for them is really strong right now. Still have it?`,
  ];
  const customGreeting = greetings[Math.floor(Math.random() * greetings.length)]!;

  // Conversational context follows Tavus Prompting Playbook: factual context only,
  // no behavioral instructions (those live in the system prompt layer).
  const conversationalContext = [
    `You are speaking with ${name}${lastName ? ` ${lastName}` : ''}.`,
    vehicle ? `They own a ${vehicle}.` : '',
    `This customer scanned a QR code on their personalized VIP buyback mailer.`,
    phone ? `Customer phone on file: ${phone}.` : '',
    `Dealership: Orlando Motors. Address: 7820 International Drive, Orlando, FL 32819.`,
    `Hours: Mon-Sat 9AM-8PM, Sun 11AM-6PM.`,
    `The VIP offer referenced on the mailer has a limited window.`,
    `When they arrive: bring the mailer and any spare keys, ask for the VIP desk.`,
  ].filter(Boolean).join(' ');

  // 1. Create Tavus session
  const result = await createTavusSession({
    replica_id: REPLICA_ID,
    persona_id: PERSONA_ID,
    conversation_name: `buyback-postcard--${name}--${Date.now()}`,
    conversational_context: conversationalContext,
    custom_greeting: customGreeting,
    callback_url: `${CALLBACK_BASE}/api/voxaris/tavus/webhook?type=buyback`,
    properties: {
      max_call_duration: 600,
      participant_left_timeout: 30,
      participant_absent_timeout: 120,
      enable_recording: true,
      enable_closed_captions: true,
      language: 'english',
    },
  });

  if (!result.success) {
    return res.status(500).json({
      success: false,
      error: 'Failed to create video session',
    });
  }

  // 2. Push to GHL REST API (fire-and-forget)
  pushToGHL({
    firstName: firstName || '',
    lastName: lastName || '',
    vehicle: vehicle || '',
    phone: phone || '',
    email: email || '',
    campaignType: campaignType || 'buyback',
    recordId: recordId || '',
    conversationId: result.data.conversation_id,
  }).catch(() => {});

  // 3. Fire GHL inbound webhook (master workflow trigger)
  fireGhlWebhook({
    event_type: 'postcard_scanned',
    first_name: firstName || '',
    last_name: lastName || '',
    phone: phone || '',
    email: email || '',
    vehicle: vehicle || '',
    source: 'tavus_video',
    direction: 'tavus_video',
    conversation_id: result.data.conversation_id,
    tags: ['buyback-postcard', 'vip-mailer', 'talking-postcard', 'postcard-scanned'],
  }).catch(() => {});

  // 4. Notify Ethan via iMessage
  notifyOwner(`📬 New postcard scan: ${name}${lastName ? ` ${lastName}` : ''} — ${v}`).catch(() => {});

  return res.status(200).json({
    success: true,
    conversation_id: result.data.conversation_id,
    conversation_url: result.data.conversation_url,
  });
}

// ── Send iMessage notification to owner ──
async function notifyOwner(message: string): Promise<void> {
  if (!SB_KEY || !SB_SECRET) return;
  try {
    await fetch('https://api.sendblue.co/api/send-message', {
      method: 'POST',
      headers: { 'sb-api-key-id': SB_KEY, 'sb-api-secret-key': SB_SECRET, 'Content-Type': 'application/json' },
      body: JSON.stringify({ number: NOTIFY_NUMBER, content: message, from_number: SB_FROM }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch {}
}
