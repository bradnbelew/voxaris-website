import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * POST /api/voxaris/tools/book-appointment
 *
 * Tavus CVI tool handler — called when the AI agent books an appointment.
 * 1. Creates GHL contact with tags (fire-and-forget)
 * 2. Books on GHL calendar 7UjfYF1nnbxPID4qINbH (same as check-availability)
 * 3. Creates a task on the contact with appointment details
 * 4. Adds a note with full context
 * 5. Sends iMessage notification via Sendblue
 * 6. Fires GHL webhook
 * 7. Returns Tavus tool result immediately
 */

// GHL credentials
const GHL_TOKEN = process.env.GHL_ACCESS_TOKEN || '';
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID || '';
const GHL_CALENDAR_ID = process.env.GHL_CALENDAR_ID || '7UjfYF1nnbxPID4qINbH';

// Sendblue (notifications)
const SB_KEY = process.env.SENDBLUE_API_KEY || '';
const SB_SECRET = process.env.SENDBLUE_API_SECRET || '';
const SB_FROM = process.env.SENDBLUE_FROM_NUMBER || '';
const NOTIFY_NUMBERS = process.env.LEAD_NOTIFY_NUMBERS || '';

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/euXH15G0pqPgr497kAL2/webhook-trigger/6730dcb6-748c-4323-a525-65b972384f7a';
const GHL_HEADERS = {
  Authorization: `Bearer ${GHL_TOKEN}`,
  Version: '2021-07-28',
  'Content-Type': 'application/json',
};

// ── Fire GHL inbound webhook (master workflow trigger) ──
async function fireGhlWebhook(payload: Record<string, any>): Promise<void> {
  try {
    await fetch(GHL_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, timestamp: new Date().toISOString(), location_id: GHL_LOCATION_ID }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch {}
}

interface BookAppointmentProps {
  customer_name: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_phone: string;
  customer_email: string;
  vehicle: string;
  appointment_date: string;
  slot_start_iso: string;
  appointment_type: string;
  notes: string;
  response_to_user: string;
}

// ── Clean and validate phone number ──
function cleanPhone(raw: string): string {
  if (!raw) return '';
  // Strip everything except digits and leading +
  let digits = raw.replace(/[^\d+]/g, '');
  // Remove trailing extra digits (STT sometimes appends garbage)
  // US numbers are 10 digits (or 11 with leading 1, or 12 with +1)
  if (digits.startsWith('+1') && digits.length > 12) digits = digits.substring(0, 12);
  else if (digits.startsWith('1') && digits.length > 11) digits = digits.substring(0, 11);
  else if (digits.length > 10 && !digits.startsWith('+') && !digits.startsWith('1')) digits = digits.substring(0, 10);
  // Format as +1XXXXXXXXXX if 10 digits
  if (digits.length === 10 && !digits.startsWith('+')) digits = '+1' + digits;
  else if (digits.length === 11 && digits.startsWith('1')) digits = '+' + digits;
  console.log(`[book-appointment] Phone cleaned: "${raw}" → "${digits}"`);
  return digits;
}

// ── Strip emotion/XML tags from response text ──
function cleanResponse(text: string): string {
  return (text || '').replace(/<[^>]*>/g, '').trim();
}

// ── Parse natural language date into an ISO start/end for calendar booking ──
function parseAppointmentTime(requested: string): { startTime: string; endTime: string } {
  const now = new Date();
  let target = new Date(now);
  let hour = 10; // default 10 AM

  const lower = (requested || '').toLowerCase().trim();

  // Parse day
  if (lower.includes('tomorrow')) {
    target.setDate(target.getDate() + 1);
  } else if (lower.includes('today')) {
    // keep today
  } else {
    const dayMap: Record<string, number> = {
      sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
      thursday: 4, friday: 5, saturday: 6,
    };
    for (const [dayName, dayNum] of Object.entries(dayMap)) {
      if (lower.includes(dayName)) {
        const currentDay = target.getDay();
        let daysAhead = dayNum - currentDay;
        if (daysAhead <= 0) daysAhead += 7;
        target.setDate(target.getDate() + daysAhead);
        break;
      }
    }
    // Try raw date parse as fallback
    const parsed = new Date(requested);
    if (!isNaN(parsed.getTime()) && parsed.getFullYear() >= 2024) {
      target = parsed;
    }
  }

  // Parse time of day
  const timeMatch = lower.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
  if (timeMatch) {
    hour = parseInt(timeMatch[1]!, 10);
    const isPM = timeMatch[3]!.toLowerCase() === 'pm';
    if (isPM && hour !== 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;
    const minutes = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
    target.setHours(hour, minutes, 0, 0);
  } else if (lower.includes('morning')) {
    target.setHours(9, 0, 0, 0);
  } else if (lower.includes('afternoon')) {
    target.setHours(14, 0, 0, 0);
  } else if (lower.includes('evening')) {
    target.setHours(17, 0, 0, 0);
  } else {
    target.setHours(10, 0, 0, 0);
  }

  const startTime = target.toISOString();
  const end = new Date(target);
  end.setMinutes(end.getMinutes() + 30); // 30-minute appointment
  const endTime = end.toISOString();

  return { startTime, endTime };
}

// ── GHL: create contact, calendar appointment, task, and note (fire-and-forget) ──
async function pushBookingToGHL(props: BookAppointmentProps, conversationId: string): Promise<void> {
  if (!GHL_TOKEN || !GHL_LOCATION_ID) {
    console.warn('[book-appointment] GHL credentials not set, skipping CRM push');
    return;
  }

  try {
    // 1. Create contact
    const contactRes = await fetch(`${GHL_BASE}/contacts/`, {
      method: 'POST',
      headers: GHL_HEADERS,
      body: JSON.stringify({
        firstName: props.customer_first_name || props.customer_name?.split(' ')[0] || undefined,
        lastName: props.customer_last_name || props.customer_name?.split(' ').slice(1).join(' ') || undefined,
        phone: props.customer_phone || undefined,
        email: props.customer_email || undefined,
        tags: ['vip-appraisal', 'talking-postcard', 'booked'],
        source: 'Talking Postcard - Appointment Booked',
        locationId: GHL_LOCATION_ID,
      }),
    });

    if (!contactRes.ok) {
      const errText = await contactRes.text();
      console.warn(`[book-appointment] GHL contact creation failed ${contactRes.status}: ${errText}`);
      return;
    }

    const data = await contactRes.json();
    const contactId = data?.contact?.id;
    console.log(`[book-appointment] GHL contact created: ${contactId}`);

    if (!contactId) return;

    // 2. Book on GHL calendar (same calendar as check-availability)
    const { startTime, endTime } = parseAppointmentTime(props.appointment_date);
    await fetch(`${GHL_BASE}/calendars/events/appointments`, {
      method: 'POST',
      headers: GHL_HEADERS,
      body: JSON.stringify({
        calendarId: GHL_CALENDAR_ID,
        locationId: GHL_LOCATION_ID,
        contactId,
        startTime,
        endTime,
        title: `VIP Appraisal: ${props.customer_name} — ${props.vehicle}`,
        appointmentStatus: 'confirmed',
        address: '7820 International Drive, Orlando, FL 32819',
        notes:
          `${props.appointment_type || 'VIP appraisal'}\n` +
          `Vehicle: ${props.vehicle || 'Not specified'}\n` +
          `Notes: ${props.notes || 'None'}\n` +
          `Booked via: Talking Postcard AI (Conv: ${conversationId})`,
      }),
    }).then(async (apptRes) => {
      if (apptRes.ok) {
        const apptData = await apptRes.json();
        console.log(`[book-appointment] GHL calendar appointment created: ${apptData?.id || 'created'}`);
      } else {
        const errText = await apptRes.text();
        console.warn(`[book-appointment] GHL calendar booking failed ${apptRes.status}: ${errText}`);
      }
    }).catch((err) => console.warn(`[book-appointment] GHL calendar booking failed: ${err.message}`));

    // 3. Create task on the contact (backup tracking)
    const dueDate = new Date(startTime);

    await fetch(`${GHL_BASE}/contacts/${contactId}/tasks`, {
      method: 'POST',
      headers: GHL_HEADERS,
      body: JSON.stringify({
        title: `VIP Appraisal: ${props.customer_name} — ${props.vehicle}`,
        body:
          `Appointment: ${props.appointment_type || 'VIP appraisal'}\n` +
          `Requested time: ${props.appointment_date || 'Not specified'}\n` +
          `Vehicle: ${props.vehicle || 'Not specified'}\n` +
          `Notes: ${props.notes || 'None'}\n` +
          `Conversation ID: ${conversationId}`,
        dueDate: dueDate.toISOString(),
        completed: false,
      }),
    }).catch((err) => console.warn(`[book-appointment] GHL task creation failed: ${err.message}`));

    // 4. Add note with full context
    await fetch(`${GHL_BASE}/contacts/${contactId}/notes`, {
      method: 'POST',
      headers: GHL_HEADERS,
      body: JSON.stringify({
        body:
          `## Appointment Booked via Talking Postcard\n\n` +
          `**Customer:** ${props.customer_name || 'Unknown'}\n` +
          `**Phone:** ${props.customer_phone || 'Not provided'}\n` +
          `**Email:** ${props.customer_email || 'Not provided'}\n` +
          `**Vehicle:** ${props.vehicle || 'Not specified'}\n` +
          `**Appointment Type:** ${props.appointment_type || 'VIP appraisal'}\n` +
          `**Requested Time:** ${props.appointment_date || 'Not specified'}\n` +
          `**Notes:** ${props.notes || 'None'}\n` +
          `**Conversation ID:** ${conversationId}\n` +
          `**Booked at:** ${new Date().toLocaleString('en-US')}`,
        userId: null,
      }),
    }).catch((err) => console.warn(`[book-appointment] GHL note failed: ${err.message}`));
  } catch (err: any) {
    console.warn(`[book-appointment] GHL push failed: ${err.message}`);
  }
}

// ── Send iMessage notification ──
async function notifyTeam(message: string): Promise<void> {
  if (!SB_KEY || !SB_SECRET || !NOTIFY_NUMBERS) return;

  const numbers = NOTIFY_NUMBERS.split(',').map((n) => n.trim()).filter(Boolean);

  for (const number of numbers) {
    try {
      await fetch('https://api.sendblue.co/api/send-message', {
        method: 'POST',
        headers: {
          'sb-api-key-id': SB_KEY,
          'sb-api-secret-key': SB_SECRET,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          number,
          content: message,
          from_number: SB_FROM || undefined,
        }),
        signal: AbortSignal.timeout(10_000),
      });
    } catch {}
  }
}

// ── Main handler ──
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { tool_call_id, conversation_id, properties } = req.body || {};

    console.log(`[book-appointment] Tool call received — tool_call_id=${tool_call_id}, conversation_id=${conversation_id}`);

    const props = (properties || {}) as BookAppointmentProps;

    // Handle both name formats: customer_name OR customer_first_name + customer_last_name
    const firstName = props.customer_first_name || props.customer_name?.split(' ')[0] || '';
    const lastName = props.customer_last_name || props.customer_name?.split(' ').slice(1).join(' ') || '';
    const name = `${firstName} ${lastName}`.trim() || 'Unknown';

    // Clean phone number (STT often garbles digit sequences)
    const phone = cleanPhone(props.customer_phone);

    const vehicle = props.vehicle || 'vehicle';
    // Prefer slot_start_iso if available, fall back to appointment_date
    const time = props.slot_start_iso || props.appointment_date || 'TBD';

    // Normalize props with cleaned data for downstream functions
    const cleanedProps: BookAppointmentProps = {
      ...props,
      customer_name: name,
      customer_first_name: firstName,
      customer_last_name: lastName,
      customer_phone: phone,
      appointment_date: time,
    };

    console.log(`[book-appointment] Cleaned: name="${name}" phone="${phone}" vehicle="${vehicle}" time="${time}"`);

    // Fire-and-forget: push to GHL + notify team + webhook
    pushBookingToGHL(cleanedProps, conversation_id || '').catch(() => {});
    notifyTeam(`📅 Appointment booked: ${name} — ${vehicle} — ${time}`).catch(() => {});
    fireGhlWebhook({
      event_type: 'appointment_booked',
      customer_name: name,
      customer_phone: phone,
      customer_email: props.customer_email || '',
      vehicle,
      appointment_date: time,
      appointment_type: props.appointment_type || 'VIP appraisal',
      notes: props.notes || '',
      conversation_id: conversation_id || '',
      source: 'tavus_tool_call',
      tags: ['vip-appraisal', 'talking-postcard', 'booked'],
    }).catch(() => {});

    // Return clean result (strip any XML/emotion tags)
    const resultMsg = cleanResponse(props.response_to_user) ||
      `Appointment confirmed for ${firstName || 'you'}. Tell the customer they are all set and we look forward to seeing them at Orlando Motors. Remind them to bring the mailer and ask for the VIP desk.`;

    return res.status(200).json({
      tool_call_id: tool_call_id || '',
      result: resultMsg,
    });
  } catch (err: any) {
    console.error(`[book-appointment] Handler error: ${err.message}`);
    return res.status(200).json({
      tool_call_id: req.body?.tool_call_id || '',
      result: 'I got the details — our team will confirm the appointment shortly.',
    });
  }
}
