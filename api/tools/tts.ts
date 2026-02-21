import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * POST /api/tools/tts
 *
 * Generates audio via Cartesia TTS API.
 * Body: { text: string, voice_id?: string, filename?: string }
 * Returns: audio/mpeg binary
 */

const CARTESIA_API_KEY = process.env.CARTESIA_API_KEY || '';
const DEFAULT_VOICE_ID = process.env.CARTESIA_VOICE_ID || 'f9836c6e-a0bd-460e-9d3c-f7299fa60f94';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { text, voice_id } = req.body || {};

  if (!text) return res.status(400).json({ error: 'Missing text field' });
  if (!CARTESIA_API_KEY) return res.status(500).json({ error: 'Cartesia API not configured' });

  try {
    const ttsRes = await fetch('https://api.cartesia.ai/tts/bytes', {
      method: 'POST',
      headers: {
        'X-API-Key': CARTESIA_API_KEY,
        'Cartesia-Version': '2024-06-10',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model_id: 'sonic-2',
        transcript: text,
        voice: {
          mode: 'id',
          id: voice_id || DEFAULT_VOICE_ID,
        },
        output_format: {
          container: 'mp3',
          encoding: 'mp3',
          sample_rate: 44100,
        },
      }),
    });

    if (!ttsRes.ok) {
      const errText = await ttsRes.text();
      return res.status(ttsRes.status).json({ error: errText });
    }

    const audioBuffer = await ttsRes.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', audioBuffer.byteLength.toString());
    return res.send(Buffer.from(audioBuffer));
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
