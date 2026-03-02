import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * POST /api/voxaris/tavus/business-card
 *
 * Creates a personalized Tavus CVI session for business card funnels.
 * Each persona gets a unique greeting and conversational context.
 *
 * Body: { persona: "ethan" | "mike" }
 * Returns: { success, conversation_url, conversation_id }
 */

const TAVUS_API_KEY = process.env.TAVUS_API_KEY || '';
const PERSONA_ID = process.env.VOXARIS_TAVUS_PERSONA_ID || 'p01ba15e825b';
const REPLICA_ID = process.env.VOXARIS_TAVUS_REPLICA_ID || 'raf6459c9b82';

const TAVUS_URLS = ['https://tavusapi.com', 'https://api.tavus.io'];

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
      `Hey there! I'm Maria, the AI agent from Voxaris. I see you got Ethan's card — he's our founder. ` +
      `I'm actually a live demo of what we build. I can see you, hear you, and have a real conversation. ` +
      `So tell me — what caught your eye about Voxaris? Or if you're just curious, I can walk you through what we do.`,
    context:
      `This person scanned a QR code from Ethan Stopperich's business card. Ethan is the founder and CEO of Voxaris. ` +
      `Voxaris builds photorealistic AI video agents that live on websites — they greet visitors, answer questions, qualify leads, and book appointments 24/7. ` +
      `You ARE one of these agents. You're Maria, a live demo running on voxaris.io. ` +
      `Your goal: Have a natural conversation, show the visitor what Voxaris AI agents can do (by being one), and if they're interested, offer to book a strategy call with Ethan. ` +
      `Be warm, confident, and conversational. Don't be pushy. If they ask technical questions, answer them. If they want to see more, tell them to explore voxaris.io.`,
  },
  mike: {
    name: 'Mike Stopperich',
    title: 'Sales',
    greeting:
      `Hey! I'm Maria, the AI agent from Voxaris. I see you got Mike's card — great to meet you! ` +
      `I'm actually a live demo of our product. I'm a real AI video agent that can see and hear you. ` +
      `Mike wanted me to show you firsthand what we build. So — what would you like to know? Or I can give you the quick rundown.`,
    context:
      `This person scanned a QR code from Mike Stopperich's business card. Mike is a sales representative at Voxaris. ` +
      `Voxaris builds photorealistic AI video agents that live on websites — they greet visitors, answer questions, qualify leads, and book appointments 24/7. ` +
      `You ARE one of these agents. You're Maria, a live demo running on voxaris.io. ` +
      `Your goal: Have a natural conversation, show the visitor what Voxaris AI agents can do (by being one), and if they're interested, offer to book a call with Mike or the Voxaris team. ` +
      `Be warm, confident, and conversational. Don't be pushy. If they ask technical questions, answer them. If they want to see more, tell them to explore voxaris.io. ` +
      `Position this as: Mike sent you their way so they could experience the product firsthand.`,
  },
};

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
        console.log(`✅ Tavus session via ${baseUrl}: ${data.conversation_id}`);
        return { success: true, data };
      }

      const errText = await resp.text();
      console.warn(`⚠️ Tavus ${baseUrl} returned ${resp.status}: ${errText}`);
      if (resp.status >= 400 && resp.status < 500) {
        return { success: false, error: errText, status: resp.status };
      }
    } catch (err: any) {
      console.warn(`⚠️ Tavus ${baseUrl} network error: ${err.message}`);
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

  console.log(`🪪 Business card session: ${config.name} (${persona})`);

  const result = await createTavusSession({
    replica_id: REPLICA_ID,
    persona_id: PERSONA_ID,
    conversation_name: `Business Card - ${config.name} - ${new Date().toISOString()}`,
    conversational_context: config.context,
    custom_greeting: config.greeting,
    properties: {
      max_call_duration: 900,
      participant_left_timeout: 30,
      participant_absent_timeout: 120,
      enable_recording: true,
      enable_transcription: true,
      language: 'english',
    },
  });

  if (!result.success) {
    return res.status(500).json({ success: false, error: 'Failed to create session', debug: result });
  }

  return res.status(200).json({
    success: true,
    conversation_id: result.data.conversation_id,
    conversation_url: result.data.conversation_url,
    persona: config.name,
  });
}
