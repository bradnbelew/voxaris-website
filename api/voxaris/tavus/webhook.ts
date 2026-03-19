import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * POST /api/voxaris/tavus/webhook?type=buyback|business-card
 *
 * Unified Tavus webhook handler. Routes to the correct tool handler
 * based on the `type` query param or conversation name prefix.
 * Merges buyback-webhook.ts and business-card-webhook.ts into one function.
 */

// ── Imports from consolidated handlers ──

// Cal.com
const CAL_API_KEY = process.env.CAL_COM_API_KEY || '';
const CAL_EVENT_TYPE_ID = process.env.CAL_COM_EVENT_TYPE_ID || '';
const CAL_API_VERSION = '2024-09-04';
const CAL_HEADERS = {
  Authorization: `Bearer ${CAL_API_KEY}`,
  'cal-api-version': CAL_API_VERSION,
  'Content-Type': 'application/json',
  'User-Agent': 'Voxaris/1.0',
};

// Sendblue
const SB_KEY = process.env.SENDBLUE_API_KEY || '';
const SB_SECRET = process.env.SENDBLUE_API_SECRET || '';

// GHL
const GHL_TOKEN = process.env.GHL_ACCESS_TOKEN || '';
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID || '';
const GHL_HEADERS_BASE = {
  Authorization: `Bearer ${GHL_TOKEN}`,
  Version: '2021-07-28',
  'Content-Type': 'application/json',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = req.body || {};
  const conversationId = body.conversation_id || body.properties?.conversation_id || body.cid || '';
  const toolName = body.tool_name || body.function_name || body.name || '';
  const toolArgs = body.tool_args || body.tool_input || body.arguments || body.args || {};
  const eventType = body.event_type || body.type || 'unknown';
  const convName = body.conversation_name || '';

  // Determine which handler based on query param or conversation name
  const webhookType = (req.query.type as string) ||
    (convName.startsWith('buyback-postcard') ? 'buyback' :
     convName.startsWith('Business Card') ? 'business-card' : 'unknown');

  console.log(`Tavus webhook [${webhookType}]: event=${eventType} tool=${toolName} cid=${conversationId}`);

  // Tool call handling
  if (toolName) {
    let result: Record<string, any>;
    if (webhookType === 'business-card') {
      result = await handleBusinessCardTool(toolName, toolArgs, conversationId);
    } else {
      result = await handleBuybackTool(toolName, toolArgs, conversationId);
    }
    return res.status(200).json({ ok: true, result: JSON.stringify(result) });
  }

  // Non-tool events
  console.log(`Tavus event [${webhookType}]: ${eventType}`, JSON.stringify(body).slice(0, 500));
  return res.status(200).json({ ok: true });
}

// ═══════════════════════════════════════════════════
// BUYBACK POSTCARD TOOLS
// ═══════════════════════════════════════════════════

async function handleBuybackTool(toolName: string, toolArgs: Record<string, any>, cid: string): Promise<Record<string, any>> {
  switch (toolName) {
    case 'check_availability':
      return getBuybackAvailability(toolArgs);

    case 'book_appointment': {
      console.log('Buyback appointment:', JSON.stringify(toolArgs));
      ghlPush({
        firstName: toolArgs.customer_first_name,
        lastName: toolArgs.customer_last_name,
        phone: toolArgs.customer_phone,
        email: toolArgs.customer_email,
        tags: ['buyback-postcard', 'appointment-booked', 'vip-appraisal'],
        note: `## VIP Appraisal Appointment Booked\n\n**Type:** ${toolArgs.appointment_type || 'Appraisal'}\n**Time:** ${toolArgs.slot_start_iso || 'TBD'}\n**Vehicle:** ${toolArgs.vehicle || 'N/A'}\n**Conversation:** ${cid}\n**Booked:** ${new Date().toLocaleString('en-US')}`,
      }).catch(() => {});
      // Send confirmation text via Sendblue
      if (toolArgs.customer_phone) {
        const dt = toolArgs.slot_start_iso ? new Date(toolArgs.slot_start_iso) : null;
        const timeStr = dt ? dt.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'America/New_York' }) + ' at ' + dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York' }) : 'your scheduled time';
        sendblueText(toolArgs.customer_phone, `Hi ${toolArgs.customer_first_name || 'there'}! Your VIP appraisal at Orlando Motors is confirmed for ${timeStr}. Bring your vehicle and any spare keys. See you soon! - Orlando Motors`).catch(() => {});
      }
      return { success: true, message: `Appointment confirmed for ${toolArgs.customer_first_name}. Tell the customer they are all set and we look forward to seeing them at Orlando Motors. Remind them to bring the mailer and ask for the VIP desk.` };
    }

    case 'log_lead': {
      console.log('Buyback lead:', JSON.stringify(toolArgs));
      ghlPush({
        firstName: toolArgs.first_name,
        lastName: toolArgs.last_name,
        phone: toolArgs.phone,
        email: toolArgs.email,
        tags: ['buyback-postcard', 'lead-captured'],
        note: `## Lead Captured via Buyback Postcard\n\n**Interest:** ${toolArgs.interest || 'Vehicle buyback'}\n**Notes:** ${toolArgs.notes || 'None'}\n**Conversation:** ${cid}`,
      }).catch(() => {});
      return { success: true, message: 'Contact info saved.' };
    }

    case 'transfer_to_human':
      return { success: true, message: 'Let the customer know they can reach Orlando Motors directly at (407) 555-0193.', phone: '(407) 555-0193' };

    default:
      return { success: false, error: `Unknown tool: ${toolName}` };
  }
}

function getBuybackAvailability(toolInput: Record<string, any>): Record<string, any> {
  const now = new Date();
  const slots: Array<{ start: string; human_readable: string }> = [];

  for (let d = 1; d <= 7 && slots.length < 6; d++) {
    const date = new Date(now);
    date.setDate(date.getDate() + d);
    const day = date.getDay();
    if (day === 0) continue;
    if (day === 6) {
      slots.push({ start: fmtSlot(date, 10, 0), human_readable: `${fmtDay(date)} at 10:00 AM` });
      continue;
    }
    const times = toolInput.preferred_time_of_day === 'morning' ? [[9, 30], [10, 0]]
      : toolInput.preferred_time_of_day === 'afternoon' ? [[14, 0], [15, 30]]
      : [[10, 0], [14, 0]];
    for (const [h, m] of times) {
      slots.push({ start: fmtSlot(date, h!, m!), human_readable: `${fmtDay(date)} at ${fmtTime(h!, m!)}` });
    }
  }

  return { ok: true, appointment_type: toolInput.appointment_type || 'appraisal', duration_minutes: 15, slots: slots.slice(0, 4), guidance: 'Present 2-3 options. Let the customer pick.' };
}

// ═══════════════════════════════════════════════════
// BUSINESS CARD TOOLS (Cal.com)
// ═══════════════════════════════════════════════════

async function handleBusinessCardTool(toolName: string, toolArgs: Record<string, any>, cid: string): Promise<Record<string, any>> {
  switch (toolName) {
    case 'check_availability':
      return await checkCalAvailability(toolArgs);

    case 'book_strategy_call':
      return await bookCalAppointment(toolArgs, cid);

    case 'log_interested_lead': {
      ghlPush({
        firstName: (toolArgs.name || '').split(' ')[0],
        lastName: (toolArgs.name || '').split(' ').slice(1).join(' '),
        email: toolArgs.email,
        phone: toolArgs.phone,
        tags: ['business-card-scan', 'interested-lead', 'voxaris-lead'],
        note: `## Interested Lead from Business Card\n\n**Interest:** ${toolArgs.interest || 'General'}\n**Notes:** ${toolArgs.notes || 'None'}\n**Conversation:** ${cid}`,
      }).catch(() => {});
      return { success: true, message: 'Contact info saved. The team will follow up.' };
    }

    default:
      return { success: false, error: `Unknown tool: ${toolName}` };
  }
}

async function checkCalAvailability(toolArgs: Record<string, any>): Promise<Record<string, any>> {
  if (!CAL_API_KEY || !CAL_EVENT_TYPE_ID) return getStaticBusinessSlots(toolArgs);

  try {
    const now = new Date();
    const start = now.toISOString().split('T')[0];
    const endDate = new Date(now); endDate.setDate(endDate.getDate() + 7);
    const end = endDate.toISOString().split('T')[0];

    const resp = await fetch(
      `https://api.cal.com/v2/slots?eventTypeId=${CAL_EVENT_TYPE_ID}&start=${start}&end=${end}&timeZone=America/New_York`,
      { headers: CAL_HEADERS, signal: AbortSignal.timeout(10_000) }
    );

    if (!resp.ok) return getStaticBusinessSlots(toolArgs);

    const data = await resp.json();
    const allSlots: Array<{ start: string; human_readable: string }> = [];
    for (const [, daySlots] of Object.entries(data?.data || {})) {
      for (const slot of daySlots as Array<{ start: string }>) {
        const dt = new Date(slot.start);
        allSlots.push({
          start: slot.start,
          human_readable: `${dt.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', timeZone: 'America/New_York' })} at ${dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York' })}`,
        });
      }
    }

    const pref = toolArgs.preferred_time_of_day;
    let filtered = allSlots;
    if (pref === 'morning') filtered = allSlots.filter(s => { const h = new Date(s.start).getUTCHours(); return h >= 13 && h < 17; });
    else if (pref === 'afternoon') filtered = allSlots.filter(s => { const h = new Date(s.start).getUTCHours(); return h >= 17 && h < 22; });

    return { ok: true, source: 'cal.com', slots: (filtered.length > 0 ? filtered : allSlots).slice(0, 4), guidance: 'Present 2-3 options naturally.' };
  } catch {
    return getStaticBusinessSlots(toolArgs);
  }
}

async function bookCalAppointment(toolArgs: Record<string, any>, cid: string): Promise<Record<string, any>> {
  const { slot_start_iso, name, email, phone, notes } = toolArgs;
  if (!slot_start_iso || !name || !email) return { success: false, message: 'I need your name and email to confirm the booking. Could you share those?' };

  if (CAL_API_KEY && CAL_EVENT_TYPE_ID) {
    try {
      const resp = await fetch('https://api.cal.com/v2/bookings', {
        method: 'POST', headers: CAL_HEADERS,
        body: JSON.stringify({
          eventTypeId: parseInt(CAL_EVENT_TYPE_ID),
          start: slot_start_iso,
          attendee: { name, email, timeZone: 'America/New_York', language: 'en' },
          metadata: { phone: phone || '', notes: notes || '', source: 'business-card-qr', conversation_id: cid },
        }),
        signal: AbortSignal.timeout(10_000),
      });
      if (resp.ok) {
        const booking = (await resp.json())?.data;
        ghlPush({ firstName: name.split(' ')[0], lastName: name.split(' ').slice(1).join(' '), email, phone, tags: ['business-card-scan', 'strategy-call-booked', 'voxaris-lead'], note: `## Strategy Call Booked\n\n**Time:** ${slot_start_iso}\n**Booking:** ${booking?.uid || 'N/A'}\n**Conversation:** ${cid}` }).catch(() => {});
        const dt = new Date(slot_start_iso);
        const readable = dt.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'America/New_York' }) + ' at ' + dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York' });
        // Send confirmation text if phone provided
        if (phone) {
          sendblueText(phone, `Hi ${name.split(' ')[0]}! Your Voxaris strategy call is confirmed for ${readable}. You'll get a calendar invite at ${email}. Looking forward to it! - Voxaris Team`).catch(() => {});
        }
        return { success: true, message: `Strategy call confirmed for ${name} on ${readable}. A confirmation email will be sent to ${email}. Tell them you are excited for them to meet the team!`, booking_id: booking?.uid };
      }
    } catch {}
  }

  ghlPush({ firstName: name.split(' ')[0], lastName: name.split(' ').slice(1).join(' '), email, phone, tags: ['business-card-scan', 'booking-requested', 'voxaris-lead'], note: `## Strategy Call Requested\n\n**Time:** ${slot_start_iso}\n**Conversation:** ${cid}\n**Note:** Needs manual confirmation.` }).catch(() => {});
  return { success: true, message: `Booking request logged for ${name}. The team will send a confirmation email to ${email} shortly.` };
}

function getStaticBusinessSlots(toolArgs: Record<string, any>): Record<string, any> {
  const now = new Date();
  const slots: Array<{ start: string; human_readable: string }> = [];
  for (let d = 1; d <= 7 && slots.length < 6; d++) {
    const date = new Date(now); date.setDate(date.getDate() + d);
    const day = date.getDay();
    if (day === 0 || day === 6) continue;
    const times = toolArgs.preferred_time_of_day === 'morning' ? [[10, 0], [11, 0]] : toolArgs.preferred_time_of_day === 'afternoon' ? [[14, 0], [15, 30]] : [[10, 0], [14, 0]];
    for (const [h, m] of times) {
      const d2 = new Date(date); d2.setHours(h!, m!, 0, 0);
      slots.push({ start: d2.toISOString(), human_readable: `${fmtDay(d2)} at ${fmtTime(h!, m!)}` });
    }
  }
  return { ok: true, source: 'static', slots: slots.slice(0, 4), guidance: 'Present 2-3 options naturally.' };
}

// ═══════════════════════════════════════════════════
// SHARED HELPERS
// ═══════════════════════════════════════════════════

async function ghlPush(params: { firstName?: string; lastName?: string; email?: string; phone?: string; tags?: string[]; note?: string }) {
  if (!GHL_TOKEN || !GHL_LOCATION_ID) return;
  try {
    const contactRes = await fetch('https://services.leadconnectorhq.com/contacts/', {
      method: 'POST', headers: GHL_HEADERS_BASE,
      body: JSON.stringify({ firstName: params.firstName || undefined, lastName: params.lastName || undefined, email: params.email || undefined, phone: params.phone || undefined, tags: params.tags, source: 'Voxaris AI Agent', locationId: GHL_LOCATION_ID }),
    });
    if (contactRes.ok) {
      const cid = (await contactRes.json())?.contact?.id;
      if (cid && params.note) {
        await fetch(`https://services.leadconnectorhq.com/contacts/${cid}/notes`, { method: 'POST', headers: GHL_HEADERS_BASE, body: JSON.stringify({ body: params.note, userId: null }) });
      }
    }
  } catch {}
}

function fmtSlot(date: Date, h: number, m: number): string { const d = new Date(date); d.setHours(h, m, 0, 0); return d.toISOString(); }
function fmtDay(date: Date): string { return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }); }
function fmtTime(h: number, m: number): string { const p = h >= 12 ? 'PM' : 'AM'; return `${h > 12 ? h - 12 : h}:${m.toString().padStart(2, '0')} ${p}`; }

// ── Sendblue: Send iMessage/SMS ──
async function sendblueText(number: string, content: string): Promise<void> {
  if (!SB_KEY || !SB_SECRET) return;
  const fromNumber = process.env.SENDBLUE_FROM_NUMBER || '+13053369541';
  try {
    const resp = await fetch('https://api.sendblue.co/api/send-message', {
      method: 'POST',
      headers: { 'sb-api-key-id': SB_KEY, 'sb-api-secret-key': SB_SECRET, 'Content-Type': 'application/json' },
      body: JSON.stringify({ number, content, from_number: fromNumber }),
      signal: AbortSignal.timeout(10_000),
    });
    const data = await resp.json();
    console.log(`Sendblue text to ${number}: ${data.status || 'sent'}`);
  } catch (err: any) {
    console.warn(`Sendblue failed: ${err.message}`);
  }
}
