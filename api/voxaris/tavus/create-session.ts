import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * POST /api/voxaris/tavus/create-session
 *
 * Creates a Tavus CVI conversation for the FloatingMaria widget.
 * Pushes visitor event to GHL.
 * Returns { conversation_url } for embedding in a Daily iframe.
 */

const PERSONA_ID = process.env.TAVUS_PERSONA_ID || 'p40793780aaa';
const CALLBACK_BASE = (process.env.CALLBACK_BASE_URL || 'https://www.voxaris.io').trim();
const TAVUS_URLS = ['https://tavusapi.com', 'https://api.tavus.io'];

// GHL credentials
const GHL_TOKEN = process.env.GHL_ACCESS_TOKEN || '';
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID || '';

// ── GHL push (fire-and-forget) ──
async function pushToGHL(conversationId: string, source: string) {
  if (!GHL_TOKEN || !GHL_LOCATION_ID) return;

  try {
    const contactRes = await fetch('https://services.leadconnectorhq.com/contacts/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GHL_TOKEN}`,
        Version: '2021-07-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tags: ['website-visitor', 'maria-conversation', 'voxaris-lead'],
        source: 'Voxaris Website - Maria Widget',
        customFields: [
          { key: 'source', field_value: source },
          { key: 'conversation_id', field_value: conversationId },
          { key: 'started_at', field_value: new Date().toISOString() },
        ],
        locationId: GHL_LOCATION_ID,
      }),
    });

    if (contactRes.ok) {
      const data = await contactRes.json();
      console.log(`GHL contact from Maria widget: ${data?.contact?.id}`);
    }
  } catch (err: any) {
    console.warn(`GHL push failed: ${err.message}`);
  }
}

// ── Tavus session creation with domain fallback ──
async function createTavusSession(body: Record<string, any>): Promise<any> {
  const TAVUS_API_KEY = (process.env.TAVUS_API_KEY || '').trim();

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
        return { success: false, error: errText };
      }
    } catch (err: any) {
      console.warn(`Tavus ${baseUrl} network error: ${err.message}`);
    }
  }
  return { success: false, error: 'All Tavus endpoints failed' };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const TAVUS_API_KEY = process.env.TAVUS_API_KEY;
  if (!TAVUS_API_KEY) {
    return res.status(500).json({ error: 'Tavus API not configured' });
  }

  const result = await createTavusSession({
    persona_id: PERSONA_ID,
    conversation_name: `voxaris-site-${Date.now()}`,
    callback_url: `${CALLBACK_BASE}/api/voxaris/tavus/execute`,
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
    return res.status(500).json({ error: 'Failed to create session' });
  }

  // Push to GHL (fire-and-forget)
  pushToGHL(result.data.conversation_id, 'voxaris.io - Maria Widget').catch(() => {});

  return res.status(200).json({
    conversation_id: result.data.conversation_id,
    conversation_url: result.data.conversation_url,
  });
}
