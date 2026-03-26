import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * POST /api/voxaris/tavus/sessions
 *
 * Consolidated Tavus CVI session creator. Routes by `type` in request body.
 * Replaces the previous separate endpoints:
 *   - /api/voxaris/tavus/business-card
 *   - /api/voxaris/tavus/buyback-postcard
 *   - /api/voxaris/tavus/talking-postcard
 *
 * Body: { type: "business-card" | "buyback" | "talking-postcard", ...params }
 */

// ── Shared config ──
const TAVUS_API_KEY = (process.env.TAVUS_API_KEY || '').trim();
const CALLBACK_BASE = (process.env.CALLBACK_BASE_URL || 'https://www.voxaris.io').trim();
const TAVUS_URLS = ['https://tavusapi.com', 'https://api.tavus.io'];

// GHL credentials
const GHL_TOKEN = process.env.GHL_ACCESS_TOKEN || '';
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID || '';

// Sendblue (notifications)
const SB_KEY = process.env.SENDBLUE_API_KEY || '';
const SB_SECRET = process.env.SENDBLUE_API_SECRET || '';
const SB_FROM = process.env.SENDBLUE_BUYBACK_FROM || process.env.SENDBLUE_FROM_NUMBER || '+13214744152';
const NOTIFY_NUMBER = process.env.LEAD_NOTIFY_NUMBERS || '+14078195809';
const GHL_WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/euXH15G0pqPgr497kAL2/webhook-trigger/6730dcb6-748c-4323-a525-65b972384f7a';

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
        signal: AbortSignal.timeout(15_000),
      });

      if (resp.ok) {
        const data = await resp.json();
        console.log(`Tavus session via ${baseUrl}: ${data.conversation_id}`);
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

// ── GHL: Create contact + note ──
async function pushToGHL(payload: {
  tags: string[];
  source: string;
  customFields: Array<{ key: string; field_value: string }>;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  noteBody: string;
}): Promise<string | null> {
  if (!GHL_TOKEN || !GHL_LOCATION_ID) {
    console.warn('GHL credentials not set, skipping CRM push');
    return null;
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
        firstName: payload.firstName || undefined,
        lastName: payload.lastName || undefined,
        name: (!payload.firstName && !payload.lastName) ? payload.source : undefined,
        phone: payload.phone || undefined,
        email: payload.email || undefined,
        tags: payload.tags,
        source: payload.source,
        customFields: payload.customFields,
        locationId: GHL_LOCATION_ID,
      }),
    });

    if (contactRes.ok) {
      const data = await contactRes.json();
      const contactId = data?.contact?.id;
      console.log(`GHL contact created: ${contactId}`);

      if (contactId && payload.noteBody) {
        await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}/notes`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ body: payload.noteBody, userId: null }),
        }).catch(() => {});
      }
      return contactId;
    } else {
      const errText = await contactRes.text();
      console.warn(`GHL contact creation failed ${contactRes.status}: ${errText}`);
    }
  } catch (err: any) {
    console.warn(`GHL push failed: ${err.message}`);
  }
  return null;
}

// ── Send iMessage notification ──
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

// ── Fire GHL inbound webhook ──
async function fireGhlWebhook(payload: Record<string, any>): Promise<void> {
  try {
    const days = parseInt(process.env.CAMPAIGN_DURATION_DAYS || '7', 10);
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + days);
    expiry.setHours(23, 59, 59, 0);

    await fetch(GHL_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        campaign_expiry: payload.campaign_expiry || expiry.toISOString(),
        timestamp: new Date().toISOString(),
        location_id: GHL_LOCATION_ID,
      }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch {}
}

// ═══════════════════════════════════════════════════════════════════════
// SESSION TYPE: business-card
// ═══════════════════════════════════════════════════════════════════════

interface PersonaConfig {
  name: string;
  title: string;
  greeting: string;
  context: string;
}

const BUSINESS_CARD_PERSONA_ID = (process.env.VOXARIS_TAVUS_PERSONA_ID || 'p01ba15e825b').trim();
const BUSINESS_CARD_REPLICA_ID = (process.env.VOXARIS_TAVUS_REPLICA_ID || 'raf6459c9b82').trim();

const PERSONAS: Record<string, PersonaConfig> = {
  ethan: {
    name: 'Ethan Stopperich',
    title: 'Founder & CEO',
    greeting:
      `Hey there! I see you scanned the QR code on Ethan's business card — great to have you here! ` +
      `I'm Maria, one of the conversational video AI agents here at Voxaris, and I help people like you learn more about what we do. ` +
      `So tell me, which one of our products are you most curious about?`,
    context:
      `This visitor scanned a QR code from Ethan Stopperich's business card. Ethan is the founder and CEO of Voxaris. ` +
      `After your greeting, wait for them to tell you which product they want to hear about. Go with the flow of whatever they say. ` +
      `The most popular product people ask about is the Talking Postcard — lead with that if they mention direct mail, mailers, postcards, or automotive. ` +
      `Talking Postcard: Voxaris puts a QR code on a direct mail piece. When scanned, a video AI agent (like you) greets the customer by name, knows the vehicle they drive, and schedules them for a free VIP appointment. The most common campaign type is buyback database mailers for auto dealerships. ` +
      `If interested in learning more or moving forward, offer to book a strategy call with Ethan at voxaris.io/book-demo.`,
  },
  mike: {
    name: 'Mike Stopperich',
    title: 'Sales',
    greeting:
      `Hey! I see you scanned the QR code on Mike's business card — great to meet you! ` +
      `I'm Maria, one of the conversational video AI agents here at Voxaris, and I help people like you learn more about what we do. ` +
      `So tell me, which one of our products are you most curious about?`,
    context:
      `This visitor scanned a QR code from Mike Stopperich's business card. Mike is a sales representative at Voxaris. ` +
      `After your greeting, wait for them to tell you which product they want to hear about. Go with the flow of whatever they say. ` +
      `The most popular product people ask about is the Talking Postcard — lead with that if they mention direct mail, mailers, postcards, or automotive. ` +
      `Talking Postcard: Voxaris puts a QR code on a direct mail piece. When scanned, a video AI agent (like you) greets the customer by name, knows the vehicle they drive, and schedules them for a free VIP appointment. The most common campaign type is buyback database mailers for auto dealerships. ` +
      `If interested in learning more or moving forward, offer to book a call with Mike or the Voxaris team at voxaris.io/book-demo.`,
  },
};

async function handleBusinessCard(req: VercelRequest, res: VercelResponse) {
  const { persona } = req.body || {};
  const config = PERSONAS[persona];

  if (!config) {
    return res.status(400).json({ success: false, error: `Unknown persona: ${persona}` });
  }

  console.log(`Business card session: ${config.name} (${persona})`);

  const result = await createTavusSession({
    replica_id: BUSINESS_CARD_REPLICA_ID,
    persona_id: BUSINESS_CARD_PERSONA_ID,
    conversation_name: `Business Card - ${config.name} - ${new Date().toISOString()}`,
    conversational_context: config.context,
    custom_greeting: config.greeting,
    callback_url: `${CALLBACK_BASE}/api/voxaris/tavus/webhook?type=business-card`,
    properties: {
      max_call_duration: 600,
      participant_left_timeout: 20,
      participant_absent_timeout: 90,
      enable_recording: true,
      enable_closed_captions: true,
      language: 'english',
    },
  });

  if (!result.success) {
    return res.status(500).json({ success: false, error: 'Failed to create session' });
  }

  // Push to GHL (fire-and-forget)
  pushToGHL({
    tags: ['business-card-scan', 'voxaris-lead', `card-${config.name.split(' ')[0]?.toLowerCase()}`],
    source: `Business Card QR - ${config.name}`,
    customFields: [
      { key: 'source', field_value: `Business Card - ${config.name}` },
      { key: 'conversation_id', field_value: result.data.conversation_id },
      { key: 'scanned_at', field_value: new Date().toISOString() },
    ],
    noteBody:
      `## Business Card QR Scan\n\n` +
      `**Card Owner:** ${config.name} (${config.title})\n` +
      `**Conversation ID:** ${result.data.conversation_id}\n` +
      `**Scanned at:** ${new Date().toLocaleString('en-US')}\n` +
      `**Source:** voxaris.io/${config.name.split(' ')[0]?.toLowerCase()}`,
  }).catch(() => {});

  return res.status(200).json({
    success: true,
    conversation_id: result.data.conversation_id,
    conversation_url: result.data.conversation_url,
    persona: config.name,
  });
}

// ═══════════════════════════════════════════════════════════════════════
// SESSION TYPE: buyback
// ═══════════════════════════════════════════════════════════════════════

const BUYBACK_PERSONA_ID = 'p12baf16e19a';
const BUYBACK_REPLICA_ID = 'raf6459c9b82';

async function handleBuyback(req: VercelRequest, res: VercelResponse) {
  const { firstName, lastName, vehicle, campaignType, recordId, phone, email } = req.body || {};
  const name = firstName || 'there';
  const v = vehicle || 'your vehicle';

  const greetings = [
    `Hey ${name}! Oh awesome, you scanned the mailer! I'm Maria with Orlando Motors. So we sent you that VIP offer on your ${v} — those are super popular right now. Do you still have it?`,
    `Hey ${name}! Great to see you. I'm Maria over at Orlando Motors. I see you got our VIP mailer about your ${v} — those are in really high demand. You still driving it?`,
    `Hi ${name}! Thanks for checking out the mailer. I'm Maria at Orlando Motors. We put together that VIP offer specifically for your ${v} because the market for them is really strong right now. Still have it?`,
  ];
  const customGreeting = greetings[Math.floor(Math.random() * greetings.length)]!;

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

  const result = await createTavusSession({
    replica_id: BUYBACK_REPLICA_ID,
    persona_id: BUYBACK_PERSONA_ID,
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
    return res.status(500).json({ success: false, error: 'Failed to create video session' });
  }

  // Push to GHL (fire-and-forget)
  pushToGHL({
    firstName: firstName || '',
    lastName: lastName || '',
    phone: phone || '',
    email: email || '',
    tags: ['buyback-postcard', 'vip-mailer', 'talking-postcard', 'voxaris-lead'],
    source: 'Buyback Postcard QR Scan',
    customFields: [
      { key: 'contact.vehicle_full', field_value: vehicle || '' },
      { key: 'contact.campaign_type', field_value: campaignType || 'buyback' },
      { key: 'contact.record_id', field_value: recordId || '' },
      { key: 'contact.conversation_id', field_value: result.data.conversation_id },
      { key: 'contact.postcard_scanned_at', field_value: new Date().toISOString() },
    ],
    noteBody:
      `## Buyback Postcard QR Scan\n\n` +
      `**Customer:** ${firstName || 'Unknown'} ${lastName || ''}\n` +
      `**Vehicle:** ${vehicle || 'Not specified'}\n` +
      `**Phone:** ${phone || 'Not provided'}\n` +
      `**Email:** ${email || 'Not provided'}\n` +
      `**Campaign:** VIP Buyback (${campaignType || 'buyback'})\n` +
      `**Record ID:** ${recordId || 'N/A'}\n` +
      `**Conversation ID:** ${result.data.conversation_id}\n` +
      `**Scanned at:** ${new Date().toLocaleString('en-US')}\n` +
      `**Source:** Orlando Motors Buyback Postcard Demo`,
  }).catch(() => {});

  // Fire GHL inbound webhook
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

  // Notify owner
  notifyOwner(`📬 New postcard scan: ${name}${lastName ? ` ${lastName}` : ''} — ${v}`).catch(() => {});

  return res.status(200).json({
    success: true,
    conversation_id: result.data.conversation_id,
    conversation_url: result.data.conversation_url,
  });
}

// ═══════════════════════════════════════════════════════════════════════
// SESSION TYPE: talking-postcard
// ═══════════════════════════════════════════════════════════════════════

const TALKING_PERSONA_ID = process.env.VOXARIS_TAVUS_PERSONA_ID || 'p5827f44cc74';
const TALKING_REPLICA_ID = process.env.VOXARIS_TAVUS_REPLICA_ID || 'r5dc7c7d0bcb';

async function handleTalkingPostcard(req: VercelRequest, res: VercelResponse) {
  const { dealership, gm_name, highlight } = req.body || {};

  if (!dealership || !highlight) {
    return res.status(400).json({ success: false, error: 'Missing required fields: dealership, highlight' });
  }

  console.log(`Talking Postcard demo: ${dealership} (${gm_name || 'no name'})`);

  // Push lead to GHL (fire-and-forget)
  pushToGHL({
    tags: ['talking-postcard', 'demo-requested', 'voxaris-lead'],
    source: 'Talking Postcard Landing Page',
    customFields: [
      { key: 'source', field_value: 'Talking Postcard Landing Page' },
      { key: 'dealership_name', field_value: dealership },
      { key: 'gm_name', field_value: gm_name || '' },
      { key: 'inventory_highlight', field_value: highlight },
      { key: 'demo_requested_at', field_value: new Date().toISOString() },
    ],
    noteBody:
      `## Talking Postcard Demo Requested\n\n` +
      `**Dealership:** ${dealership}\n` +
      `**Name:** ${gm_name || 'Not provided'}\n` +
      `**Highlight/Pain Point:** ${highlight}\n` +
      `**Requested at:** ${new Date().toLocaleString('en-US')}\n` +
      `**Source:** voxaris.io/talking-postcard`,
  }).catch(() => {});

  const dynamicContext = [
    `This is a Talking Postcard demo for ${dealership}.`,
    gm_name ? `The person watching is ${gm_name}, a decision-maker at the dealership.` : '',
    `Their biggest concern or inventory highlight: "${highlight}".`,
    `Tailor your conversation to this dealership. Reference their name and their specific highlight/pain point.`,
    `Your goal: Show them the power of AI agents for their dealership, then offer to book a strategy call with Ethan.`,
  ].filter(Boolean).join(' ');

  const customGreeting = gm_name
    ? `Hey ${gm_name}! I'm Maria from Voxaris. I just got your info from ${dealership} — love that you're looking into AI agents. So tell me, what's the biggest challenge you're facing with leads right now?`
    : `Hey there! I'm Maria from Voxaris. I see you're with ${dealership} — that's awesome. I'd love to show you how our AI agents can help. What's the biggest challenge you're facing with leads right now?`;

  const result = await createTavusSession({
    replica_id: TALKING_REPLICA_ID,
    persona_id: TALKING_PERSONA_ID,
    conversation_name: `Talking Postcard - ${dealership} - ${new Date().toISOString()}`,
    conversational_context: dynamicContext,
    custom_greeting: customGreeting,
    properties: {
      max_call_duration: 900,
      participant_left_timeout: 30,
      participant_absent_timeout: 120,
      enable_recording: true,
      enable_closed_captions: true,
      language: 'english',
    },
  });

  if (!result.success) {
    return res.status(500).json({ success: false, error: 'Failed to create video session', debug: result });
  }

  return res.status(200).json({
    success: true,
    conversation_id: result.data.conversation_id,
    conversation_url: result.data.conversation_url,
  });
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN HANDLER — routes by `type` in body
// ═══════════════════════════════════════════════════════════════════════

const HANDLERS: Record<string, (req: VercelRequest, res: VercelResponse) => Promise<any>> = {
  'business-card': handleBusinessCard,
  'buyback': handleBuyback,
  'talking-postcard': handleTalkingPostcard,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  if (!TAVUS_API_KEY) {
    return res.status(500).json({ success: false, error: 'Tavus API not configured' });
  }

  const { type } = req.body || {};
  const handler = HANDLERS[type];

  if (!handler) {
    return res.status(400).json({
      success: false,
      error: `Unknown session type: ${type}. Valid types: ${Object.keys(HANDLERS).join(', ')}`,
    });
  }

  return handler(req, res);
}
