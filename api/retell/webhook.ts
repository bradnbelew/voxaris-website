import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../lib/supabase';

/**
 * POST /api/retell/webhook
 *
 * Unified Retell post-call webhook for ALL Voxaris agents.
 * Deployed on voxaris.io via Vercel serverless.
 *
 * Flow:
 * 1. Retell fires webhook after every call ends
 * 2. Extract lead data (phone, transcript, summary, appointment status)
 * 3. Upsert contact + log call in Supabase (our own DB)
 * 4. Send instant notification to Ethan's phone via ntfy
 * 5. If appointment booked → send confirmation SMS via Twilio
 */

// ── Config ──
const NTFY_TOPIC = process.env.NTFY_TOPIC || 'voxaris-leads';
const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID || '';
const TWILIO_AUTH = process.env.TWILIO_AUTH_TOKEN || '';
const TWILIO_FROM = process.env.TWILIO_PHONE_NUMBER || '';

// ── Types ──
interface RetellCallEvent {
  event: string;
  call: {
    call_id: string;
    agent_id: string;
    call_status: string;
    start_timestamp: number;
    end_timestamp: number;
    duration_ms?: number;
    from_number?: string;
    to_number?: string;
    direction?: string;
    recording_url?: string;
    public_log_url?: string;
    disconnection_reason?: string;
    call_analysis?: {
      call_summary?: string;
      user_sentiment?: string;
      call_successful?: boolean;
      custom_analysis_data?: Record<string, string>;
      in_voicemail?: boolean;
    };
    metadata?: Record<string, any>;
    transcript?: string;
    transcript_object?: Array<{ role: string; content: string }>;
  };
}

// ── Supabase: Upsert contact + log call ──
async function saveToDatabase(data: {
  phone: string;
  agentId: string;
  agentName: string;
  direction: string;
  duration: number;
  summary: string;
  sentiment: string;
  appointmentBooked: boolean;
  recordingUrl?: string;
  callId: string;
  callStatus: string;
  disconnectionReason?: string;
  transcript?: string;
}) {
  try {
    // 1. Upsert contact by phone
    const tags = ['voxaris-ai-call', `agent:${data.agentName.toLowerCase().replace(/\s+/g, '-')}`];
    if (data.appointmentBooked) tags.push('appointment-booked', 'hot-lead');

    const { data: contact, error: contactErr } = await supabase
      .from('contacts')
      .upsert(
        {
          phone: data.phone,
          agent_name: data.agentName,
          tags,
          appointment_booked: data.appointmentBooked || undefined,
          last_call_at: new Date().toISOString(),
          last_sentiment: data.sentiment,
        },
        { onConflict: 'phone' }
      )
      .select('id')
      .single();

    if (contactErr) {
      console.warn(`⚠️ Contact upsert error: ${contactErr.message}`);
    }

    const contactId = contact?.id || null;

    // 2. Log the call
    const { error: callErr } = await supabase.from('calls').insert({
      retell_call_id: data.callId,
      contact_id: contactId,
      agent_id: data.agentId,
      agent_name: data.agentName,
      direction: data.direction,
      duration_seconds: data.duration,
      summary: data.summary,
      sentiment: data.sentiment,
      appointment_booked: data.appointmentBooked,
      recording_url: data.recordingUrl,
      transcript: data.transcript,
      call_status: data.callStatus,
      disconnection_reason: data.disconnectionReason,
    });

    if (callErr) {
      console.warn(`⚠️ Call insert error: ${callErr.message}`);
    }

    console.log(`✅ Saved to DB: contact=${contactId} call=${data.callId}`);
    return contactId;
  } catch (err: any) {
    console.warn(`⚠️ DB save error: ${err.message}`);
    return null;
  }
}

// ── Twilio: Send SMS ──
async function sendSms(to: string, message: string, contactId?: string | null, agentName?: string) {
  if (!TWILIO_SID || !TWILIO_AUTH || !TWILIO_FROM) {
    console.warn('⚠️ Twilio credentials not set — skipping SMS');
    return false;
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
      const smsData = await res.json();
      console.log(`📱 SMS sent: ${smsData.sid}`);

      // Log to sms_log
      await supabase.from('sms_log').insert({
        contact_id: contactId,
        phone: to,
        message,
        direction: 'outbound',
        status: 'sent',
        twilio_sid: smsData.sid,
        trigger_type: 'post_call',
        agent_name: agentName,
      }).then(({ error }) => {
        if (error) console.warn(`⚠️ SMS log error: ${error.message}`);
      });

      return true;
    } else {
      const errText = await res.text();
      console.warn(`⚠️ Twilio SMS failed: ${res.status} ${errText}`);
      return false;
    }
  } catch (err: any) {
    console.warn(`⚠️ SMS error: ${err.message}`);
    return false;
  }
}

// ── Notification: Push to Ethan's phone via ntfy.sh ──
async function notifyEthan(data: {
  agentName: string;
  phone: string;
  summary: string;
  appointmentBooked: boolean;
  sentiment: string;
  duration: number;
}) {
  const durationMin = Math.round(data.duration / 60);
  const emoji = data.appointmentBooked ? '🔥' : '📞';
  const title = data.appointmentBooked
    ? `${emoji} APPOINTMENT BOOKED — ${data.agentName}`
    : `${emoji} Call Ended — ${data.agentName}`;

  const body = [
    `Phone: ${data.phone}`,
    `Duration: ${durationMin}m | Sentiment: ${data.sentiment}`,
    data.appointmentBooked ? '⚡ APPOINTMENT BOOKED' : 'No appointment',
    ``,
    data.summary ? data.summary.slice(0, 300) : 'No summary',
  ].join('\n');

  try {
    await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
      method: 'POST',
      headers: {
        Title: title,
        Priority: data.appointmentBooked ? 'urgent' : 'default',
        Tags: data.appointmentBooked ? 'fire,calendar' : 'phone',
      },
      body,
    });
    console.log(`📱 ntfy notification sent: ${title}`);
  } catch (err: any) {
    console.warn(`⚠️ ntfy notification failed: ${err.message}`);
  }
}

// ── Agent name resolver ──
const AGENT_NAMES: Record<string, string> = {
  agent_0bf4698527ae66e7ccaaad2b2e: 'USAA V-SENSE Inbound',
  agent_a34129591f0e7e19abeadd264f: 'USAA V-SENSE Outbound',
  agent_81fc38192732d4eecca3bd9c6e: 'Maria - Coral Bay Inbound',
  agent_20ae76a25bf13c04a2c8b2efd2: 'Maria - Coral Bay Outbound',
  agent_696226322fb18bfca2e43d5111: 'Maria - Voxaris Sales Demo',
  agent_aab4d2ceb18a893763451ffcaf: 'Aria - Orlando Art of Surgery',
  agent_b8dbc0ff6a0186474e73020500: 'Riley - Suncoast Sports',
  agent_277b76faaff90b8488df9c5073: 'Riley - Suncoast Outbound',
  agent_83e716b69e9a025d6ade2b19f3: 'Sarah - Roofing Inbound',
  agent_a69305c2fdf8246dadcae8284e: 'Sarah - Roofing Outbound',
};

// ── Main handler ──
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Retell-Signature');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const event = req.body as RetellCallEvent;

  if (!event?.event || !event?.call) {
    return res.status(400).json({ error: 'Invalid webhook payload' });
  }

  console.log(`📨 Retell webhook: ${event.event} | call_id=${event.call.call_id} | agent=${event.call.agent_id}`);

  // Only process call_ended and call_analyzed events
  if (event.event !== 'call_ended' && event.event !== 'call_analyzed') {
    return res.status(200).json({ received: true, skipped: event.event });
  }

  const call = event.call;
  const analysis = call.call_analysis || {};
  const agentName = AGENT_NAMES[call.agent_id] || `Agent ${call.agent_id?.slice(-8)}`;
  const direction = call.direction || (call.from_number ? 'inbound' : 'unknown');
  const customerPhone = direction === 'inbound' ? (call.from_number || '') : (call.to_number || '');
  const duration = call.duration_ms ? Math.round(call.duration_ms / 1000) : 0;
  const summary = analysis.call_summary || '';
  const sentiment = analysis.user_sentiment || 'neutral';

  // Determine if appointment was booked
  const appointmentBooked =
    analysis.call_successful === true ||
    analysis.custom_analysis_data?.appointment_booked === 'true' ||
    analysis.custom_analysis_data?.appointment_booked === 'yes' ||
    /appointment|booked|scheduled|confirmed/i.test(summary);

  // Skip voicemail
  if (analysis.in_voicemail) {
    console.log(`📭 Voicemail detected, skipping: ${call.call_id}`);
    return res.status(200).json({ received: true, skipped: 'voicemail' });
  }

  // Skip very short calls (< 10 seconds)
  if (duration < 10) {
    console.log(`⏱️ Short call (${duration}s), skipping: ${call.call_id}`);
    return res.status(200).json({ received: true, skipped: 'too_short' });
  }

  // Fire DB save and notification in parallel
  const [contactId] = await Promise.all([
    saveToDatabase({
      phone: customerPhone,
      agentId: call.agent_id,
      agentName,
      direction,
      duration,
      summary,
      sentiment,
      appointmentBooked,
      recordingUrl: call.recording_url,
      callId: call.call_id,
      callStatus: call.call_status,
      disconnectionReason: call.disconnection_reason,
      transcript: call.transcript,
    }),
    notifyEthan({
      agentName,
      phone: customerPhone,
      summary,
      appointmentBooked,
      sentiment,
      duration,
    }),
  ]);

  // Send confirmation SMS if appointment was booked
  let smsSent = false;
  if (appointmentBooked && customerPhone) {
    const businessName = agentName.includes('-')
      ? agentName.split('-').slice(1).join('-').trim()
      : agentName;

    const smsMessage =
      `Hi! This is a confirmation from ${businessName}. ` +
      `Your appointment has been noted and our team will follow up shortly. ` +
      `If you need to reschedule, just reply to this text. Thank you!`;

    smsSent = await sendSms(customerPhone, smsMessage, contactId, agentName);
  }

  return res.status(200).json({
    received: true,
    processed: true,
    agent: agentName,
    appointment_booked: appointmentBooked,
    contact_id: contactId,
    sms_sent: smsSent,
    duration_seconds: duration,
  });
}
