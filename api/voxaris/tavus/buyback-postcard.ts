import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * POST /api/voxaris/tavus/buyback-postcard
 *
 * Creates a Tavus CVI session for the buyback postcard demo.
 * Accepts customer PURL data (first name, vehicle, etc.) and
 * returns a conversation_url for the Daily video embed.
 */

const TAVUS_API_KEY = process.env.TAVUS_API_KEY || '';
const PERSONA_ID = 'p12baf16e19a'; // Ashley - Orlando Motors Buyback
const REPLICA_ID = 'raf6459c9b82'; // Maria replica

const TAVUS_URLS = ['https://tavusapi.com', 'https://api.tavus.io'];

const CALLBACK_BASE = (process.env.CALLBACK_BASE_URL || 'https://www.voxaris.io').trim();

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

  const customGreeting = `Hey ${name}! Oh awesome, you scanned the mailer! I'm Maria with Orlando Motors. So we sent you that VIP offer on your ${v} — those are super popular right now. Do you still have it?`;

  const conversationalContext = [
    `You are speaking with ${name}${lastName ? ` ${lastName}` : ''}.`,
    vehicle ? `They own a ${vehicle}. Reference this vehicle specifically to show personalization.` : '',
    `Campaign type: VIP buyback. This customer scanned a QR code on their personalized VIP buyback mailer.`,
    phone ? `Customer phone on file: ${phone}.` : '',
    `Your goal: Greet them warmly, confirm they still have the vehicle, build value around the current market for their car, and book a no-pressure 15-minute VIP appraisal at Orlando Motors.`,
    `VIP offer expires Friday — create natural urgency without being pushy.`,
    `Dealership hours: Mon-Sat 9AM-8PM, Sun 11AM-6PM.`,
    `Address: 7820 International Drive, Orlando, FL 32819. Ask for the VIP desk.`,
  ].filter(Boolean).join(' ');

  const result = await createTavusSession({
    replica_id: REPLICA_ID,
    persona_id: PERSONA_ID,
    conversation_name: `buyback-postcard--${name}--${Date.now()}`,
    conversational_context: conversationalContext,
    custom_greeting: customGreeting,
    callback_url: `${CALLBACK_BASE}/api/voxaris/tavus/buyback-webhook`,
    properties: {
      max_call_duration: 600,
      participant_left_timeout: 30,
      participant_absent_timeout: 120,
      enable_recording: true,
      enable_transcription: true,
      language: 'english',
    },
  });

  if (!result.success) {
    return res.status(500).json({
      success: false,
      error: 'Failed to create video session',
    });
  }

  return res.status(200).json({
    success: true,
    conversation_id: result.data.conversation_id,
    conversation_url: result.data.conversation_url,
  });
}
