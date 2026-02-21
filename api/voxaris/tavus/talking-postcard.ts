import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * POST /api/voxaris/tavus/talking-postcard
 *
 * Vercel serverless function that:
 * 1. Pushes lead to GoHighLevel (non-blocking)
 * 2. Creates a Tavus CVI session with dynamic context from form data
 * 3. Returns the conversation URL for the frontend to redirect to
 */

// ── Config ──
const TAVUS_API_KEY = process.env.TAVUS_API_KEY || '';
const PERSONA_ID = process.env.VOXARIS_TAVUS_PERSONA_ID || 'p5827f44cc74';
const REPLICA_ID = process.env.VOXARIS_TAVUS_REPLICA_ID || 'r5dc7c7d0bcb';

const GHL_TOKEN = process.env.GHL_ACCESS_TOKEN || '';
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID || '';

// Tavus has two domains — try both for resilience
const TAVUS_URLS = ['https://tavusapi.com', 'https://api.tavus.io'];

// ── GHL helper (inline, zero external deps) ──
async function pushToGHL(dealership: string, gmName: string, highlight: string) {
  if (!GHL_TOKEN || !GHL_LOCATION_ID) {
    console.warn('⚠️ GHL credentials not set, skipping CRM push');
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
        name: gmName || dealership,
        tags: ['talking-postcard', 'demo-requested', 'voxaris-lead'],
        customFields: [
          { key: 'source', field_value: 'Talking Postcard Landing Page' },
          { key: 'dealership_name', field_value: dealership },
          { key: 'gm_name', field_value: gmName || '' },
          { key: 'inventory_highlight', field_value: highlight },
          { key: 'demo_requested_at', field_value: new Date().toISOString() },
        ],
        locationId: GHL_LOCATION_ID,
      }),
    });

    if (contactRes.ok) {
      const data = await contactRes.json();
      const contactId = data?.contact?.id;
      if (contactId) {
        await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}/notes`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            body:
              `## Talking Postcard Demo Requested\n\n` +
              `**Dealership:** ${dealership}\n` +
              `**Name:** ${gmName || 'Not provided'}\n` +
              `**Highlight/Pain Point:** ${highlight}\n` +
              `**Requested at:** ${new Date().toLocaleString('en-US')}\n` +
              `**Source:** voxaris.io/talking-postcard`,
            userId: null,
          }),
        }).catch(() => {});
      }
      console.log(`✅ GHL contact: ${contactId}`);
    }
  } catch (err: any) {
    console.warn(`⚠️ GHL push failed: ${err.message}`);
  }
}

// ── Tavus helper with domain fallback ──
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
        console.log(`✅ Tavus session via ${baseUrl}: ${data.conversation_id}`);
        return { success: true, data };
      }

      const errText = await resp.text();
      console.warn(`⚠️ Tavus ${baseUrl} returned ${resp.status}: ${errText}`);
      // If it's a 4xx, don't retry — the request itself is bad
      if (resp.status >= 400 && resp.status < 500) {
        return { success: false, error: errText, status: resp.status, url: baseUrl };
      }
      // 5xx — try next URL
    } catch (err: any) {
      console.warn(`⚠️ Tavus ${baseUrl} network error: ${err.message}`);
      // Network error — try next URL
    }
  }

  return { success: false, error: 'All Tavus endpoints failed' };
}

// ── Main handler ──
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  const { dealership, gm_name, highlight } = req.body || {};

  if (!dealership || !highlight) {
    return res.status(400).json({ success: false, error: 'Missing required fields: dealership, highlight' });
  }

  if (!TAVUS_API_KEY) {
    return res.status(500).json({ success: false, error: 'Tavus API not configured' });
  }

  console.log(`📮 Talking Postcard demo: ${dealership} (${gm_name || 'no name'})`);

  // 1. Push lead to GHL (fire-and-forget)
  pushToGHL(dealership, gm_name || '', highlight).catch(() => {});

  // 2. Build dynamic context
  const dynamicContext = [
    `This is a Talking Postcard demo for ${dealership}.`,
    gm_name ? `The person watching is ${gm_name}, a decision-maker at the dealership.` : '',
    `Their biggest concern or inventory highlight: "${highlight}".`,
    `Tailor your conversation to this dealership. Reference their name and their specific highlight/pain point.`,
    `Your goal: Show them the power of AI agents for their dealership, then offer to book a strategy call with Ethan.`,
  ]
    .filter(Boolean)
    .join(' ');

  const customGreeting = gm_name
    ? `Hey ${gm_name}! I'm Maria from Voxaris. I just got your info from ${dealership} — love that you're looking into AI agents. So tell me, what's the biggest challenge you're facing with leads right now?`
    : `Hey there! I'm Maria from Voxaris. I see you're with ${dealership} — that's awesome. I'd love to show you how our AI agents can help. What's the biggest challenge you're facing with leads right now?`;

  // 3. Create Tavus session (with domain fallback)
  const result = await createTavusSession({
    replica_id: REPLICA_ID,
    persona_id: PERSONA_ID,
    conversation_name: `Talking Postcard - ${dealership} - ${new Date().toISOString()}`,
    conversational_context: dynamicContext,
    custom_greeting: customGreeting,
    properties: {
      max_call_duration: 900,
      participant_left_timeout: 30,
      participant_absent_timeout: 120,
      enable_recording: true,
      enable_transcription: true,
      language: 'english',
    },
    metadata: {
      dealership,
      gm_name: gm_name || '',
      highlight,
      source: 'talking-postcard',
      created_at: new Date().toISOString(),
    },
  });

  if (!result.success) {
    return res.status(500).json({
      success: false,
      error: 'Failed to create video session',
      debug: result,
    });
  }

  return res.status(200).json({
    success: true,
    conversation_id: result.data.conversation_id,
    conversation_url: result.data.conversation_url,
  });
}
