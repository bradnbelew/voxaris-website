import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../lib/supabase';

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
 * Returns Retell-compatible tool response.
 */

const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID || '';
const TWILIO_AUTH = process.env.TWILIO_AUTH_TOKEN || '';
const TWILIO_FROM = process.env.TWILIO_PHONE_NUMBER || '';

// ── Agent booking URLs ──
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

// ── Twilio: Send SMS ──
async function sendViaTwilio(to: string, message: string): Promise<{ ok: boolean; sid?: string }> {
  if (!TWILIO_SID || !TWILIO_AUTH || !TWILIO_FROM) {
    console.warn('⚠️ Twilio credentials not set');
    return { ok: false };
  }

  try {
    const params = new URLSearchParams({
      To: to,
      From: TWILIO_FROM,
      Body: message,
    });

    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          Authorization: 'Basic ' + Buffer.from(`${TWILIO_SID}:${TWILIO_AUTH}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      }
    );

    if (res.ok) {
      const data = await res.json();
      console.log(`📱 Mid-call SMS sent: ${data.sid}`);
      return { ok: true, sid: data.sid };
    } else {
      const errText = await res.text();
      console.warn(`⚠️ Twilio SMS failed: ${res.status} ${errText}`);
      return { ok: false };
    }
  } catch (err: any) {
    console.warn(`⚠️ Twilio error: ${err.message}`);
    return { ok: false };
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

  // Build message — if not provided, use default with booking link
  let smsText = message;
  if (!smsText) {
    const bookingUrl = BOOKING_URLS[agent_id] || 'https://voxaris.io/book-demo';
    smsText = `Thanks for chatting with us! Here's the link to book your appointment: ${bookingUrl}`;
  }

  // Send via Twilio
  const { ok, sid } = await sendViaTwilio(phone, smsText);

  if (ok) {
    // Log to DB — find contact by phone, log SMS
    const { data: contact } = await supabase
      .from('contacts')
      .select('id')
      .eq('phone', phone)
      .maybeSingle();

    await supabase.from('sms_log').insert({
      contact_id: contact?.id || null,
      phone,
      message: smsText,
      direction: 'outbound',
      status: 'sent',
      twilio_sid: sid,
      trigger_type: 'mid_call',
      agent_name: agent_id,
    }).then(({ error }) => {
      if (error) console.warn(`⚠️ SMS log error: ${error.message}`);
    });

    return res.status(200).json({
      result: `I've just sent a text to your phone with that information. You should receive it in a moment.`,
    });
  }

  return res.status(200).json({
    result: 'I apologize, I wasn\'t able to send the text right now. Let me give you the information verbally instead.',
  });
}
