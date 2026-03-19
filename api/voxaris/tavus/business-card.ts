import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * POST /api/voxaris/tavus/business-card
 *
 * Creates a personalized Tavus CVI session for business card funnels.
 * Each persona gets a unique greeting and conversational context.
 * Pushes lead to GHL on session creation.
 *
 * Body: { persona: "ethan" | "mike" }
 * Returns: { success, conversation_url, conversation_id }
 */

const TAVUS_API_KEY = (process.env.TAVUS_API_KEY || '').trim();
const PERSONA_ID = (process.env.VOXARIS_TAVUS_PERSONA_ID || 'p01ba15e825b').trim();
const REPLICA_ID = (process.env.VOXARIS_TAVUS_REPLICA_ID || 'raf6459c9b82').trim();
const CALLBACK_BASE = (process.env.CALLBACK_BASE_URL || 'https://www.voxaris.io').trim();

const TAVUS_URLS = ['https://tavusapi.com', 'https://api.tavus.io'];

// GHL credentials
const GHL_TOKEN = process.env.GHL_ACCESS_TOKEN || '';
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID || '';

// ── Persona configs ──
interface PersonaConfig {
  name: string;
  title: string;
  greeting: string;
  context: string;
}

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

// ── GHL push (fire-and-forget) ──
async function pushToGHL(persona: PersonaConfig, conversationId: string) {
  if (!GHL_TOKEN || !GHL_LOCATION_ID) return;

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
        tags: ['business-card-scan', 'voxaris-lead', `card-${persona.name.split(' ')[0]?.toLowerCase()}`],
        source: `Business Card QR - ${persona.name}`,
        customFields: [
          { key: 'source', field_value: `Business Card - ${persona.name}` },
          { key: 'conversation_id', field_value: conversationId },
          { key: 'scanned_at', field_value: new Date().toISOString() },
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
              `## Business Card QR Scan\n\n` +
              `**Card Owner:** ${persona.name} (${persona.title})\n` +
              `**Conversation ID:** ${conversationId}\n` +
              `**Scanned at:** ${new Date().toLocaleString('en-US')}\n` +
              `**Source:** voxaris.io/${persona.name.split(' ')[0]?.toLowerCase()}`,
            userId: null,
          }),
        }).catch(() => {});
      }
      console.log(`GHL contact from business card: ${contactId}`);
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  const { persona } = req.body || {};
  const config = PERSONAS[persona];

  if (!config) {
    return res.status(400).json({ success: false, error: `Unknown persona: ${persona}` });
  }

  if (!TAVUS_API_KEY) {
    return res.status(500).json({ success: false, error: 'Tavus API not configured' });
  }

  console.log(`Business card session: ${config.name} (${persona})`);

  const result = await createTavusSession({
    replica_id: REPLICA_ID,
    persona_id: PERSONA_ID,
    conversation_name: `Business Card - ${config.name} - ${new Date().toISOString()}`,
    conversational_context: config.context,
    custom_greeting: config.greeting,
    callback_url: `${CALLBACK_BASE}/api/voxaris/tavus/execute`,
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
  pushToGHL(config, result.data.conversation_id).catch(() => {});

  return res.status(200).json({
    success: true,
    conversation_id: result.data.conversation_id,
    conversation_url: result.data.conversation_url,
    persona: config.name,
  });
}
