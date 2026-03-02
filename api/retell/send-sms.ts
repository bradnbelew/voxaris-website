import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * POST /api/retell/send-sms
 *
 * Retell custom function tool — agents call this mid-conversation
 * to send an SMS to the customer they're talking to.
 *
 * Use cases:
 *  - "Let me text you a link to our booking page"
 *  - "I'll send you a confirmation text right now"
 *  - "Let me text you our address"
 *
 * Called by Retell's tool execution with:
 *   { phone: "+1...", message: "..." }
 *
 * Returns Retell-compatible tool response.
 */

const GHL_TOKEN = process.env.GHL_ACCESS_TOKEN || '';
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID || '';

// ── Agent booking URLs (agent_id → URL) ──
const BOOKING_URLS: Record<string, string> = {
  agent_0bf4698527ae66e7ccaaad2b2e: 'https://voxaris.io/book-demo',
  agent_a34129591f0e7e19abeadd264f: 'https://voxaris.io/book-demo',
  agent_81fc38192732d4eecca3bd9c6e: 'https://voxaris.io/book-demo',
  agent_20ae76a25bf13c04a2c8b2efd2: 'https://voxaris.io/book-demo',
  agent_696226322fb18bfca2e43d5111: 'https://voxaris.io/book-demo',
  agent_aab4d2ceb18a893763451ffcaf: 'https://voxaris.io/book-demo',
  agent_b8dbc0ff6a0186474e73020500: 'https://voxaris.io/book-demo',
  agent_277b76faaff90b8488df9c5073: 'https://voxaris.io/book-demo',
  agent_83e716b69e9a025d6ade2b19f3: 'https://voxaris.io/book-demo',
  agent_a69305c2fdf8246dadcae8284e: 'https://voxaris.io/book-demo',
};

async function findOrCreateGHLContact(phone: string): Promise<string | null> {
  if (!GHL_TOKEN || !GHL_LOCATION_ID) return null;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${GHL_TOKEN}`,
    Version: '2021-07-28',
    'Content-Type': 'application/json',
  };

  try {
    // Search for existing contact
    const searchRes = await fetch(
      `https://services.leadconnectorhq.com/contacts/search/duplicate?locationId=${GHL_LOCATION_ID}&phone=${encodeURIComponent(phone)}`,
      { headers }
    );

    if (searchRes.ok) {
      const data = await searchRes.json();
      if (data?.contact?.id) return data.contact.id;
      console.log(`GHL search result (no id): ${JSON.stringify(data).slice(0, 200)}`);
    } else {
      console.warn(`GHL search failed: ${searchRes.status} ${await searchRes.text().catch(() => '')}`);
    }

    // Create new contact
    const createRes = await fetch('https://services.leadconnectorhq.com/contacts/', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        phone,
        tags: ['voxaris-ai-call', 'sms-sent'],
        source: 'Voxaris AI Agent',
        locationId: GHL_LOCATION_ID,
      }),
    });

    if (createRes.ok) {
      const data = await createRes.json();
      console.log(`GHL contact created: ${JSON.stringify(data).slice(0, 200)}`);
      return data?.contact?.id || null;
    }

    const createErr = await createRes.text().catch(() => '');
    console.warn(`GHL contact create failed: ${createRes.status} ${createErr}`);
    return null;
  } catch (err: any) {
    console.warn(`⚠️ GHL contact lookup failed: ${err.message}`);
    return null;
  }
}

async function sendSms(contactId: string, message: string): Promise<boolean> {
  try {
    const res = await fetch('https://services.leadconnectorhq.com/conversations/messages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GHL_TOKEN}`,
        Version: '2021-07-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'SMS',
        contactId,
        message,
      }),
    });

    if (res.ok) {
      console.log(`📱 Mid-call SMS sent to contact ${contactId}`);
      return true;
    } else {
      const errText = await res.text();
      console.warn(`⚠️ SMS send failed: ${res.status} ${errText}`);
      return false;
    }
  } catch (err: any) {
    console.warn(`⚠️ SMS send error: ${err.message}`);
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { phone, message, agent_id } = req.body || {};

  if (!phone) {
    return res.status(200).json({
      result: 'I need the customer phone number to send a text. Could you confirm their number?',
    });
  }

  // Build the message — if not provided, use a default with booking link
  let smsText = message;
  if (!smsText) {
    const bookingUrl = BOOKING_URLS[agent_id] || 'https://voxaris.io/book-demo';
    smsText = `Thanks for chatting with us! Here's the link to book your appointment: ${bookingUrl}`;
  }

  // Find or create GHL contact, then send SMS
  const contactId = await findOrCreateGHLContact(phone);

  if (!contactId) {
    console.warn(`⚠️ Could not find/create GHL contact for ${phone}`);
    return res.status(200).json({
      result: 'I apologize, I wasn\'t able to send the text right now. Let me give you the information verbally instead.',
    });
  }

  const sent = await sendSms(contactId, smsText);

  if (sent) {
    return res.status(200).json({
      result: `I've just sent a text to your phone with that information. You should receive it in a moment.`,
    });
  } else {
    return res.status(200).json({
      result: 'I apologize, I wasn\'t able to send the text right now. Let me give you the information verbally instead.',
    });
  }
}
