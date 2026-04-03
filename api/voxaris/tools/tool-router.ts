import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * POST /api/voxaris/tools/tool-router
 *
 * Single Tavus tool_url endpoint. Tavus posts ALL tool calls here.
 * This router reads the tool_name field and delegates to the correct logic.
 *
 * Tools handled:
 *   book_appointment   — creates GHL contact + calendar event + note + task + webhook
 *   check_availability — queries GHL calendar for open slots (falls back to dealership hours)
 *   log_lead           — creates GHL contact with 'interested' tags, no appointment booked
 *   transfer_to_human  — creates GHL contact, fires urgent Sendblue notification
 *
 * Every handler MUST return { tool_call_id, result } within Tavus's 10s timeout.
 * All GHL / Sendblue calls are fire-and-forget so we never block that response.
 */

// ── Credentials ──────────────────────────────────────────────────────────────
const GHL_TOKEN        = process.env.GHL_ACCESS_TOKEN || '';
const GHL_LOCATION_ID  = process.env.GHL_LOCATION_ID  || '';
const GHL_CALENDAR_ID  = process.env.GHL_CALENDAR_ID  || '7UjfYF1nnbxPID4qINbH';
const GHL_WEBHOOK_URL  = 'https://services.leadconnectorhq.com/hooks/euXH15G0pqPgr497kAL2/webhook-trigger/6730dcb6-748c-4323-a525-65b972384f7a';
const GHL_BASE         = 'https://services.leadconnectorhq.com';
const GHL_HEADERS      = {
  Authorization: `Bearer ${GHL_TOKEN}`,
  Version: '2021-07-28',
  'Content-Type': 'application/json',
};

const SB_KEY           = process.env.SENDBLUE_API_KEY    || '';
const SB_SECRET        = process.env.SENDBLUE_API_SECRET || '';
const SB_FROM          = process.env.SENDBLUE_FROM_NUMBER || '';
const NOTIFY_NUMBERS   = process.env.LEAD_NOTIFY_NUMBERS  || '';

// ── Shared helpers ────────────────────────────────────────────────────────────

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
        body: JSON.stringify({ number, content: message, from_number: SB_FROM || undefined }),
        signal: AbortSignal.timeout(10_000),
      });
    } catch {}
  }
}

function cleanPhone(raw: string): string {
  if (!raw) return '';
  let digits = raw.replace(/[^\d+]/g, '');
  if (digits.startsWith('+1') && digits.length > 12) digits = digits.substring(0, 12);
  else if (digits.startsWith('1') && digits.length > 11) digits = digits.substring(0, 11);
  else if (digits.length > 10 && !digits.startsWith('+') && !digits.startsWith('1')) digits = digits.substring(0, 10);
  if (digits.length === 10 && !digits.startsWith('+')) digits = '+1' + digits;
  else if (digits.length === 11 && digits.startsWith('1')) digits = '+' + digits;
  return digits;
}

async function createGhlContact(fields: {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  tags: string[];
  source: string;
}): Promise<string | null> {
  if (!GHL_TOKEN || !GHL_LOCATION_ID) {
    console.warn('[tool-router] GHL credentials missing — skipping contact creation');
    return null;
  }
  try {
    const res = await fetch(`${GHL_BASE}/contacts/`, {
      method: 'POST',
      headers: GHL_HEADERS,
      body: JSON.stringify({
        firstName: fields.firstName || undefined,
        lastName: fields.lastName || undefined,
        phone: fields.phone || undefined,
        email: fields.email || undefined,
        tags: fields.tags,
        source: fields.source,
        locationId: GHL_LOCATION_ID,
      }),
      signal: AbortSignal.timeout(12_000),
    });
    if (!res.ok) {
      const err = await res.text();
      console.warn(`[tool-router] GHL contact creation failed ${res.status}: ${err}`);
      return null;
    }
    const data = await res.json();
    const id = data?.contact?.id || null;
    console.log(`[tool-router] GHL contact created: ${id}`);
    return id;
  } catch (err: any) {
    console.warn(`[tool-router] GHL contact error: ${err.message}`);
    return null;
  }
}

// ── Date/time helpers (all ET) ────────────────────────────────────────────────

function todayET(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}

function nowET(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
}

function parseAppointmentTime(requested: string): { startTime: string; endTime: string } {
  const now = new Date();
  let target = new Date(now);
  const lower = (requested || '').toLowerCase().trim();

  if (lower.includes('tomorrow')) {
    target.setDate(target.getDate() + 1);
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
    const parsed = new Date(requested);
    if (!isNaN(parsed.getTime()) && parsed.getFullYear() >= 2024) target = parsed;
  }

  const timeMatch = lower.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
  let hour = 10;
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
  end.setMinutes(end.getMinutes() + 30);
  return { startTime, endTime: end.toISOString() };
}

function parseDateRange(requested: string): { startDate: string; endDate: string } {
  const today = todayET();
  let target = new Date(today + 'T12:00:00');
  const lower = (requested || '').toLowerCase().trim();

  if (lower === 'today') {
    const end = new Date(target);
    end.setDate(end.getDate() + 1);
    return { startDate: today, endDate: end.toLocaleDateString('en-CA', { timeZone: 'America/New_York' }) };
  } else if (lower === 'tomorrow') {
    target.setDate(target.getDate() + 1);
  } else if (['monday','tuesday','wednesday','thursday','friday','saturday','sunday'].includes(lower)) {
    const dayMap: Record<string, number> = { sunday:0,monday:1,tuesday:2,wednesday:3,thursday:4,friday:5,saturday:6 };
    const targetDay = dayMap[lower]!;
    const currentDay = target.getDay();
    let daysAhead = targetDay - currentDay;
    if (daysAhead <= 0) daysAhead += 7;
    target.setDate(target.getDate() + daysAhead);
  } else if (lower.includes('this week')) {
    const end = new Date(target);
    end.setDate(end.getDate() + (7 - end.getDay()));
    return { startDate: today, endDate: end.toLocaleDateString('en-CA', { timeZone: 'America/New_York' }) };
  } else if (lower.includes('next week')) {
    const start = new Date(target);
    start.setDate(start.getDate() + ((8 - start.getDay()) % 7 || 7));
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return {
      startDate: start.toLocaleDateString('en-CA', { timeZone: 'America/New_York' }),
      endDate:   end.toLocaleDateString('en-CA',   { timeZone: 'America/New_York' }),
    };
  } else {
    const parsed = new Date(requested);
    if (!isNaN(parsed.getTime()) && parsed.getFullYear() >= 2024) target = parsed;
    else target.setDate(target.getDate() + 1);
  }

  const dateStr = target.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
  return { startDate: dateStr, endDate: dateStr };
}

function buildDefaultSlots(startDate: string, endDate: string): string[] {
  const slots: string[] = [];
  const start = new Date(startDate + 'T12:00:00');
  const end   = new Date(endDate   + 'T12:00:00');
  const now   = nowET();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  const todayStr = todayET();

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dow = d.getDay();
    const dateStr = d.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
    const isToday = dateStr === todayStr;
    const dayName = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'America/New_York' });
    const candidates = dow === 0
      ? [{ label: `${dayName} at 11:00 AM`, hour: 11 }, { label: `${dayName} at 2:00 PM`, hour: 14 }]
      : [{ label: `${dayName} at 10:00 AM`, hour: 10 }, { label: `${dayName} at 2:00 PM`, hour: 14 }];

    for (const c of candidates) {
      if (isToday && (c.hour <= currentHour || (c.hour === currentHour + 1 && currentMinutes > 30))) continue;
      slots.push(c.label);
    }
    if (slots.length >= 2) break;
  }
  return slots.slice(0, 2);
}

async function getAvailableSlots(startDate: string, endDate: string): Promise<string[]> {
  if (!GHL_TOKEN || !GHL_LOCATION_ID || !GHL_CALENDAR_ID) {
    return buildDefaultSlots(startDate, endDate);
  }
  try {
    const params = new URLSearchParams({
      calendarId: GHL_CALENDAR_ID,
      startDate: `${startDate}T00:00:00Z`,
      endDate:   `${endDate}T23:59:59Z`,
      timezone:  'America/New_York',
    });
    const resp = await fetch(`${GHL_BASE}/calendars/${GHL_CALENDAR_ID}/free-slots?${params}`, {
      headers: GHL_HEADERS,
      signal: AbortSignal.timeout(10_000),
    });
    if (!resp.ok) return buildDefaultSlots(startDate, endDate);

    const data = await resp.json();
    const slotsByDate = data?.slots || data || {};
    const morning: string[] = [];
    const afternoon: string[] = [];

    for (const slots of Object.values(slotsByDate)) {
      if (!Array.isArray(slots)) continue;
      for (const slot of slots) {
        const time = slot.startTime || slot;
        if (typeof time !== 'string') continue;
        try {
          const dt = new Date(time);
          const label = dt.toLocaleString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric',
            hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York',
          });
          const h = dt.toLocaleString('en-US', { hour: 'numeric', hour12: false, timeZone: 'America/New_York' });
          (parseInt(h, 10) < 12 ? morning : afternoon).push(label);
        } catch {}
      }
    }

    const result: string[] = [];
    if (morning.length > 0)   result.push(morning[0]!);
    if (afternoon.length > 0) result.push(afternoon[0]!);
    if (result.length === 0 && (morning.length + afternoon.length) > 0) {
      result.push((morning[0] || afternoon[0])!);
    }
    return result.length > 0 ? result : buildDefaultSlots(startDate, endDate);
  } catch {
    return buildDefaultSlots(startDate, endDate);
  }
}

// ── Tool handlers ─────────────────────────────────────────────────────────────

async function handleBookAppointment(
  props: Record<string, any>,
  conversationId: string,
  toolCallId: string,
): Promise<string> {
  const firstName = (props.customer_first_name || props.customer_name?.split(' ')[0] || '').trim();
  const lastName  = (props.customer_last_name  || props.customer_name?.split(' ').slice(1).join(' ') || '').trim();
  const name      = `${firstName} ${lastName}`.trim() || 'Unknown';
  const phone     = cleanPhone(props.customer_phone || '');
  const email     = (props.customer_email || '').trim();
  const vehicle   = (props.vehicle || 'vehicle').trim();
  const time      = (props.slot_start_iso || props.appointment_date || 'TBD').trim();
  const apptType  = (props.appointment_type || 'appraisal').trim();
  const notes     = (props.notes || '').trim();

  console.log(`[tool-router][book_appointment] name="${name}" phone="${phone}" vehicle="${vehicle}" time="${time}"`);

  // Fire-and-forget all GHL calls
  (async () => {
    const contactId = await createGhlContact({
      firstName, lastName, phone: phone || undefined, email: email || undefined,
      tags: ['vip-appraisal', 'talking-postcard', 'booked'],
      source: 'Talking Postcard - Appointment Booked',
    });

    if (!contactId) return;

    const { startTime, endTime } = parseAppointmentTime(time);

    // Calendar appointment
    await fetch(`${GHL_BASE}/calendars/events/appointments`, {
      method: 'POST',
      headers: GHL_HEADERS,
      body: JSON.stringify({
        calendarId: GHL_CALENDAR_ID,
        locationId: GHL_LOCATION_ID,
        contactId,
        startTime,
        endTime,
        title: `VIP Appraisal: ${name} — ${vehicle}`,
        appointmentStatus: 'confirmed',
        address: '7820 International Drive, Orlando, FL 32819',
        notes: `${apptType}\nVehicle: ${vehicle}\nNotes: ${notes}\nBooked via: Talking Postcard AI (Conv: ${conversationId})`,
      }),
      signal: AbortSignal.timeout(12_000),
    }).then(async (r) => {
      if (r.ok) {
        const d = await r.json();
        console.log(`[tool-router][book_appointment] GHL calendar event created: ${d?.id}`);
      } else {
        const e = await r.text();
        console.warn(`[tool-router][book_appointment] Calendar booking failed ${r.status}: ${e}`);
      }
    }).catch((e) => console.warn(`[tool-router][book_appointment] Calendar error: ${e.message}`));

    // Task
    await fetch(`${GHL_BASE}/contacts/${contactId}/tasks`, {
      method: 'POST',
      headers: GHL_HEADERS,
      body: JSON.stringify({
        title: `VIP Appraisal: ${name} — ${vehicle}`,
        body: `Appointment: ${apptType}\nRequested: ${time}\nVehicle: ${vehicle}\nNotes: ${notes}\nConv: ${conversationId}`,
        dueDate: new Date(startTime).toISOString(),
        completed: false,
      }),
      signal: AbortSignal.timeout(12_000),
    }).catch((e) => console.warn(`[tool-router][book_appointment] Task error: ${e.message}`));

    // Note
    await fetch(`${GHL_BASE}/contacts/${contactId}/notes`, {
      method: 'POST',
      headers: GHL_HEADERS,
      body: JSON.stringify({
        body:
          `## Appointment Booked via Talking Postcard\n\n` +
          `**Customer:** ${name}\n**Phone:** ${phone || 'Not provided'}\n**Email:** ${email || 'Not provided'}\n` +
          `**Vehicle:** ${vehicle}\n**Type:** ${apptType}\n**Requested Time:** ${time}\n` +
          `**Notes:** ${notes || 'None'}\n**Conv ID:** ${conversationId}\n**Booked at:** ${new Date().toLocaleString('en-US')}`,
        userId: null,
      }),
      signal: AbortSignal.timeout(12_000),
    }).catch((e) => console.warn(`[tool-router][book_appointment] Note error: ${e.message}`));
  })().catch(() => {});

  // Notifications (fire-and-forget)
  notifyTeam(`📅 APPOINTMENT BOOKED: ${name} — ${vehicle} — ${time}`).catch(() => {});
  fireGhlWebhook({
    event_type: 'appointment_booked',
    customer_name: name, customer_phone: phone, customer_email: email,
    vehicle, appointment_date: time, appointment_type: apptType,
    notes, conversation_id: conversationId, source: 'tavus_tool_call',
    tags: ['vip-appraisal', 'talking-postcard', 'booked'],
  }).catch(() => {});

  return `Appointment confirmed for ${firstName || 'the customer'} on ${time}. Tell them to bring their mailer and any spare keys, and ask for the VIP desk when they arrive.`;
}

async function handleCheckAvailability(
  props: Record<string, any>,
  conversationId: string,
): Promise<string> {
  const preferredDays  = (props.preferred_days as string[]) || [];
  const timePref       = (props.preferred_time_of_day || props.time_preference || 'no_preference') as string;
  const requested      = preferredDays[0] || props.requested_date || 'tomorrow';

  console.log(`[tool-router][check_availability] preferred_days=${JSON.stringify(preferredDays)} time_pref=${timePref}`);

  const { startDate, endDate } = parseDateRange(requested);
  const slots = await getAvailableSlots(startDate, endDate);

  fireGhlWebhook({
    event_type: 'availability_checked',
    requested_date: requested, time_preference: timePref,
    slots_found: slots.length, conversation_id: conversationId, source: 'tavus_tool_call',
  }).catch(() => {});

  if (slots.length === 0) {
    return `Nothing open for ${requested}. Ask the customer what day works better for them.`;
  } else if (slots.length === 1) {
    return `One slot open: ${slots[0]}. Offer this to the customer.`;
  }
  return `Two times available: ${slots[0]} or ${slots[1]}. Offer both and let the customer pick. If neither works, ask what day and time is better.`;
}

async function handleLogLead(
  props: Record<string, any>,
  conversationId: string,
): Promise<string> {
  const firstName = (props.first_name || '').trim();
  const lastName  = (props.last_name  || '').trim();
  const phone     = cleanPhone(props.phone || '');
  const email     = (props.email || '').trim();
  const vehicle   = (props.vehicle || 'vehicle').trim();
  const interest  = (props.interest || '').trim();
  const followUp  = (props.follow_up_preference || '').trim();
  const notes     = (props.notes || '').trim();

  console.log(`[tool-router][log_lead] name="${firstName} ${lastName}" vehicle="${vehicle}" interest="${interest}"`);

  (async () => {
    const contactId = await createGhlContact({
      firstName, lastName, phone: phone || undefined, email: email || undefined,
      tags: ['talking-postcard', 'interested', 'no-appointment'],
      source: 'Talking Postcard - Lead Logged',
    });
    if (!contactId) return;

    await fetch(`${GHL_BASE}/contacts/${contactId}/notes`, {
      method: 'POST',
      headers: GHL_HEADERS,
      body: JSON.stringify({
        body:
          `## Lead Logged via Talking Postcard\n\n` +
          `**Customer:** ${firstName} ${lastName}\n**Phone:** ${phone || 'Not provided'}\n**Email:** ${email || 'Not provided'}\n` +
          `**Vehicle:** ${vehicle}\n**Interest:** ${interest}\n**Follow-up preference:** ${followUp || 'None stated'}\n` +
          `**Notes:** ${notes || 'None'}\n**Conv ID:** ${conversationId}\n**Logged at:** ${new Date().toLocaleString('en-US')}`,
        userId: null,
      }),
      signal: AbortSignal.timeout(12_000),
    }).catch((e) => console.warn(`[tool-router][log_lead] Note error: ${e.message}`));
  })().catch(() => {});

  notifyTeam(`🔔 NEW LEAD: ${firstName} ${lastName} — ${vehicle} — ${interest}${followUp ? ` — Follow up: ${followUp}` : ''}`).catch(() => {});
  fireGhlWebhook({
    event_type: 'lead_logged',
    first_name: firstName, last_name: lastName, phone, email,
    vehicle, interest, follow_up_preference: followUp, notes,
    conversation_id: conversationId, source: 'tavus_tool_call',
    tags: ['talking-postcard', 'interested', 'no-appointment'],
  }).catch(() => {});

  return `Got it — I've noted that ${firstName || 'the customer'} is interested. Someone from the team will follow up${followUp ? ` ${followUp}` : ' soon'}.`;
}

async function handleTransferToHuman(
  props: Record<string, any>,
  conversationId: string,
): Promise<string> {
  const reason    = (props.reason || 'Not specified').trim();
  const firstName = (props.customer_first_name || props.customer_name?.split(' ')[0] || '').trim();
  const lastName  = (props.customer_last_name  || props.customer_name?.split(' ').slice(1).join(' ') || '').trim();
  const name      = `${firstName} ${lastName}`.trim() || 'Unknown';
  const phone     = cleanPhone(props.customer_phone || '');

  console.log(`[tool-router][transfer_to_human] name="${name}" reason="${reason}"`);

  (async () => {
    const contactId = await createGhlContact({
      firstName, lastName, phone: phone || undefined,
      tags: ['transfer-requested', 'talking-postcard', 'needs-human'],
      source: 'Talking Postcard - Transfer Requested',
    });
    if (!contactId) return;

    await fetch(`${GHL_BASE}/contacts/${contactId}/notes`, {
      method: 'POST',
      headers: GHL_HEADERS,
      body: JSON.stringify({
        body:
          `## Transfer to Human Requested\n\n` +
          `**Customer:** ${name}\n**Phone:** ${phone || 'Not provided'}\n` +
          `**Reason:** ${reason}\n**Conv ID:** ${conversationId}\n**Requested at:** ${new Date().toLocaleString('en-US')}`,
        userId: null,
      }),
      signal: AbortSignal.timeout(12_000),
    }).catch((e) => console.warn(`[tool-router][transfer_to_human] Note error: ${e.message}`));
  })().catch(() => {});

  notifyTeam(`🚨 TRANSFER REQUEST: ${name} — ${phone || 'no phone'} — Reason: ${reason}`).catch(() => {});
  fireGhlWebhook({
    event_type: 'transfer_requested',
    customer_name: name, customer_phone: phone, reason,
    conversation_id: conversationId, source: 'tavus_tool_call',
    tags: ['transfer-requested', 'talking-postcard', 'needs-human'],
  }).catch(() => {});

  return "Great — I'm connecting you with someone from the team now. They'll reach out to you shortly.";
}

// ── Main handler ──────────────────────────────────────────────────────────────

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body           = req.body || {};
    const toolCallId     = body.tool_call_id     || '';
    const conversationId = body.conversation_id  || '';
    const toolName       = (body.tool_name || body.name || body.function_name || '').toLowerCase().trim();
    // Tavus may nest properties inside body.properties OR flatten them at body root
    const props: Record<string, any> = (
      body.properties && typeof body.properties === 'object' ? body.properties :
      body.arguments  && typeof body.arguments  === 'object' ? body.arguments  :
      body.args       && typeof body.args        === 'object' ? body.args       :
      body
    );

    console.log(`[tool-router] Received tool_name="${toolName}" conversation_id="${conversationId}" tool_call_id="${toolCallId}"`);

    let result: string;

    switch (toolName) {
      case 'book_appointment':
        result = await handleBookAppointment(props, conversationId, toolCallId);
        break;
      case 'check_availability':
        result = await handleCheckAvailability(props, conversationId);
        break;
      case 'log_lead':
        result = await handleLogLead(props, conversationId);
        break;
      case 'transfer_to_human':
        result = await handleTransferToHuman(props, conversationId);
        break;
      default:
        console.warn(`[tool-router] Unknown tool name: "${toolName}"`);
        result = 'Action completed.';
    }

    return res.status(200).json({ tool_call_id: toolCallId, result });
  } catch (err: any) {
    console.error(`[tool-router] Unhandled error: ${err.message}`);
    return res.status(200).json({
      tool_call_id: req.body?.tool_call_id || '',
      result: 'Got it — our team has been notified and will follow up shortly.',
    });
  }
}
