import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * POST /api/retell/webhook
 *
 * Unified Retell post-call webhook for ALL Voxaris agents.
 * Deployed on voxaris.io via Vercel serverless.
 *
 * Flow:
 * 1. Retell fires webhook after every call ends
 * 2. Extract lead data (phone, transcript, summary, appointment status)
 * 3. Push lead to GoHighLevel CRM
 * 4. Send instant notification to Ethan's phone
 * 5. If appointment booked → send confirmation SMS to customer via GHL
 */

// ── Config (Vercel env vars) ──
const GHL_TOKEN = process.env.GHL_ACCESS_TOKEN || '';
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID || '';
const ETHAN_PHONE = process.env.ETHAN_PHONE || '+14077594100';
const NTFY_TOPIC = process.env.NTFY_TOPIC || 'voxaris-leads';
const WEBHOOK_SECRET = process.env.RETELL_WEBHOOK_SECRET || '';

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
    transcript_object?: Array<{
      role: string;
      content: string;
    }>;
  };
}

// ── GHL: Create/update contact ──
async function pushLeadToGHL(data: {
  phone: string;
  name?: string;
  agentName: string;
  summary: string;
  sentiment: string;
  appointmentBooked: boolean;
  recordingUrl?: string;
  callId: string;
  duration: number;
  direction: string;
}) {
  if (!GHL_TOKEN || !GHL_LOCATION_ID) {
    console.warn('⚠️ GHL credentials not set — skipping CRM push');
    return null;
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${GHL_TOKEN}`,
    Version: '2021-07-28',
    'Content-Type': 'application/json',
  };

  try {
    // 1. Search for existing contact by phone
    const searchRes = await fetch(
      `https://services.leadconnectorhq.com/contacts/search/duplicate?locationId=${GHL_LOCATION_ID}&phone=${encodeURIComponent(data.phone)}`,
      { headers }
    );

    let contactId: string | null = null;

    if (searchRes.ok) {
      const searchData = await searchRes.json();
      contactId = searchData?.contact?.id || null;
    }

    // 2. Create or update contact
    const tags = ['voxaris-ai-call', `agent:${data.agentName.toLowerCase().replace(/\s+/g, '-')}`];
    if (data.appointmentBooked) {
      tags.push('appointment-booked', 'hot-lead');
    }

    const contactBody: Record<string, any> = {
      phone: data.phone,
      tags,
      source: 'Voxaris AI Agent',
      locationId: GHL_LOCATION_ID,
      customFields: [
        { key: 'last_ai_call_date', field_value: new Date().toISOString() },
        { key: 'last_ai_agent', field_value: data.agentName },
        { key: 'last_call_sentiment', field_value: data.sentiment },
        { key: 'last_call_outcome', field_value: data.appointmentBooked ? 'Appointment Booked' : 'No Appointment' },
      ],
    };

    if (data.name) {
      contactBody.name = data.name;
    }

    let contactRes: Response;
    if (contactId) {
      // Update existing
      contactRes = await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(contactBody),
      });
    } else {
      // Create new
      contactRes = await fetch('https://services.leadconnectorhq.com/contacts/', {
        method: 'POST',
        headers,
        body: JSON.stringify(contactBody),
      });
    }

    if (contactRes.ok) {
      const contactData = await contactRes.json();
      contactId = contactData?.contact?.id || contactId;
      console.log(`✅ GHL contact ${contactId ? 'updated' : 'created'}: ${contactId}`);
    } else {
      const errText = await contactRes.text();
      console.warn(`⚠️ GHL contact upsert failed: ${contactRes.status} ${errText}`);
    }

    // 3. Add note with call details
    if (contactId) {
      const durationMin = Math.round(data.duration / 60);
      const noteBody =
        `## Voxaris AI Call Summary\n\n` +
        `**Agent:** ${data.agentName}\n` +
        `**Direction:** ${data.direction}\n` +
        `**Duration:** ${durationMin} min\n` +
        `**Sentiment:** ${data.sentiment}\n` +
        `**Outcome:** ${data.appointmentBooked ? '✅ APPOINTMENT BOOKED' : 'No appointment'}\n` +
        `**Call ID:** ${data.callId}\n` +
        (data.recordingUrl ? `**Recording:** ${data.recordingUrl}\n` : '') +
        `\n---\n\n` +
        `**Summary:**\n${data.summary || 'No summary available'}`;

      await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}/notes`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ body: noteBody, userId: null }),
      }).catch((err) => console.warn(`⚠️ GHL note failed: ${err.message}`));
    }

    return contactId;
  } catch (err: any) {
    console.warn(`⚠️ GHL push error: ${err.message}`);
    return null;
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

  // ntfy.sh — free, instant push notifications
  // Ethan: install ntfy app and subscribe to "voxaris-leads" topic
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

// ── GHL: Send SMS to customer ──
async function sendSmsViaGHL(contactId: string, message: string) {
  if (!GHL_TOKEN) {
    console.warn('⚠️ GHL token not set — skipping SMS');
    return false;
  }

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
      console.log(`📱 SMS sent to contact ${contactId}`);
      return true;
    } else {
      const errText = await res.text();
      console.warn(`⚠️ GHL SMS failed: ${res.status} ${errText}`);
      return false;
    }
  } catch (err: any) {
    console.warn(`⚠️ GHL SMS error: ${err.message}`);
    return false;
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
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Retell-Signature');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Quick ack — Retell expects fast response
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

  // Fire both GHL push and notification in parallel
  const [ghlContactId] = await Promise.all([
    pushLeadToGHL({
      phone: customerPhone,
      agentName,
      summary,
      sentiment,
      appointmentBooked,
      recordingUrl: call.recording_url,
      callId: call.call_id,
      duration,
      direction,
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
  if (appointmentBooked && ghlContactId && customerPhone) {
    const businessName = agentName.includes('-')
      ? agentName.split('-').slice(1).join('-').trim()
      : agentName;

    const smsMessage =
      `Hi! This is a confirmation from ${businessName}. ` +
      `Your appointment has been noted and our team will follow up shortly. ` +
      `If you need to reschedule, just reply to this text. Thank you!`;

    smsSent = await sendSmsViaGHL(ghlContactId, smsMessage);
  }

  return res.status(200).json({
    received: true,
    processed: true,
    agent: agentName,
    appointment_booked: appointmentBooked,
    ghl_contact_id: ghlContactId,
    sms_sent: smsSent,
    duration_seconds: duration,
  });
}
