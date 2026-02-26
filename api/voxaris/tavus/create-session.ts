import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * POST /api/voxaris/tavus/create-session
 *
 * Creates a Tavus CVI conversation for the FloatingMaria widget.
 * Returns { conversation_url } for embedding in a Daily iframe.
 */

const TAVUS_API_KEY = process.env.TAVUS_API_KEY || '7f3c93c88c4a44c79f5d969b56bdbd75';
const PERSONA_ID = process.env.TAVUS_PERSONA_ID || 'p40793780aaa';
const ORCHESTRATOR_URL = process.env.ORCHESTRATOR_URL || 'https://voxaris-orchestrator.vercel.app';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!TAVUS_API_KEY) {
    return res.status(500).json({ error: 'Tavus API not configured' });
  }

  try {
    const resp = await fetch('https://tavusapi.com/v2/conversations', {
      method: 'POST',
      headers: {
        'x-api-key': TAVUS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        persona_id: PERSONA_ID,
        conversation_name: `voxaris-site-${Date.now()}`,
        callback_url: `${ORCHESTRATOR_URL}/api/execute`,
        properties: {
          max_call_duration: 900,
          participant_left_timeout: 30,
          participant_absent_timeout: 120,
          enable_recording: true,
          enable_transcription: true,
          language: 'english',
        },
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      console.error(`Tavus API ${resp.status}: ${errText}`);
      return res.status(500).json({ error: 'Failed to create session', detail: errText });
    }

    const data = await resp.json();
    return res.status(200).json({
      conversation_id: data.conversation_id,
      conversation_url: data.conversation_url,
    });
  } catch (err: any) {
    console.error(`Tavus error: ${err.message}`);
    return res.status(500).json({ error: err.message });
  }
}
