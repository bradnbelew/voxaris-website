import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * POST /api/voxaris/tavus/business-card-webhook
 *
 * Handles Tavus tool call callbacks for business card agents.
 * Integrates with Cal.com for real-time booking.
 * Pushes leads to GHL.
 */

// Cal.com
const CAL_API_KEY = process.env.CAL_COM_API_KEY || '';
const CAL_EVENT_TYPE_ID = process.env.CAL_COM_EVENT_TYPE_ID || '';
const CAL_API_VERSION = '2024-09-04';

// GHL
const GHL_TOKEN = process.env.GHL_ACCESS_TOKEN || '';
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID || '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = req.body || {};

  const conversationId =
    body.conversation_id ||
    body.properties?.conversation_id ||
    body.cid ||
    '';

  const toolName = body.tool_name || body.function_name || body.name || '';
  const toolArgs = body.tool_args || body.tool_input || body.arguments || body.args || {};
  const eventType = body.event_type || body.type || 'unknown';

  console.log(`Business card webhook: event=${eventType} tool=${toolName} cid=${conversationId}`);

  // Tool call handling
  if (toolName) {
    const result = await handleToolCall(toolName, toolArgs, conversationId);
    return res.status(200).json({ ok: true, result: JSON.stringify(result) });
  }

  // Non-tool events
  console.log(`Business card event: ${eventType}`, JSON.stringify(body).slice(0, 500));
  return res.status(200).json({ ok: true });
}

async function handleToolCall(
  toolName: string,
  toolArgs: Record<string, any>,
  conversationId: string
): Promise<Record<string, any>> {
  switch (toolName) {
    case 'check_availability':
      return await checkCalAvailability(toolArgs);

    case 'book_strategy_call':
      return await bookCalAppointment(toolArgs, conversationId);

    case 'log_interested_lead':
      return await logLead(toolArgs, conversationId);

    default:
      return { success: false, error: `Unknown tool: ${toolName}` };
  }
}

// ── Cal.com: Check availability ──

async function checkCalAvailability(
  toolArgs: Record<string, any>
): Promise<Record<string, any>> {
  if (!CAL_API_KEY || !CAL_EVENT_TYPE_ID) {
    // Fallback to static slots if Cal.com not configured
    return getStaticAvailability(toolArgs);
  }

  try {
    const now = new Date();
    const start = now.toISOString().split('T')[0]; // today
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + 7);
    const end = endDate.toISOString().split('T')[0]; // 7 days out

    const url =
      `https://api.cal.com/v2/slots?` +
      `eventTypeId=${CAL_EVENT_TYPE_ID}&` +
      `start=${start}&` +
      `end=${end}&` +
      `timeZone=America/New_York`;

    const resp = await fetch(url, {
      headers: {
        Authorization: `Bearer ${CAL_API_KEY}`,
        'cal-api-version': CAL_API_VERSION,
      },
      signal: AbortSignal.timeout(10_000),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      console.warn(`Cal.com slots error ${resp.status}: ${errText}`);
      return getStaticAvailability(toolArgs);
    }

    const data = await resp.json();
    const allSlots: Array<{ start: string; human_readable: string }> = [];

    // Parse Cal.com response — data.data is { "2024-01-15": [{start: "..."}] }
    const slotsByDate = data?.data || {};
    for (const [dateStr, daySlots] of Object.entries(slotsByDate)) {
      const slots = daySlots as Array<{ start: string }>;
      for (const slot of slots) {
        const dt = new Date(slot.start);
        const dayName = dt.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
          timeZone: 'America/New_York',
        });
        const time = dt.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          timeZone: 'America/New_York',
        });
        allSlots.push({
          start: slot.start,
          human_readable: `${dayName} at ${time}`,
        });
      }
    }

    // Filter by preference
    const pref = toolArgs.preferred_time_of_day;
    let filtered = allSlots;
    if (pref === 'morning') {
      filtered = allSlots.filter((s) => {
        const h = new Date(s.start).getUTCHours();
        // Rough EST morning filter (9am-12pm EST = 14-17 UTC)
        return h >= 13 && h < 17;
      });
    } else if (pref === 'afternoon') {
      filtered = allSlots.filter((s) => {
        const h = new Date(s.start).getUTCHours();
        return h >= 17 && h < 22;
      });
    }

    // Return top 4 slots
    const topSlots = (filtered.length > 0 ? filtered : allSlots).slice(0, 4);

    return {
      ok: true,
      source: 'cal.com',
      slots: topSlots,
      guidance: 'Present 2-3 of these options naturally. Let them pick. Do not list all of them.',
    };
  } catch (err: any) {
    console.warn(`Cal.com availability error: ${err.message}`);
    return getStaticAvailability(toolArgs);
  }
}

// ── Cal.com: Book appointment ──

async function bookCalAppointment(
  toolArgs: Record<string, any>,
  conversationId: string
): Promise<Record<string, any>> {
  const { slot_start_iso, name, email, phone, notes } = toolArgs;

  if (!slot_start_iso || !name || !email) {
    return {
      success: false,
      message: 'I need your name and email to confirm the booking. Could you share those?',
    };
  }

  // Try Cal.com first
  if (CAL_API_KEY && CAL_EVENT_TYPE_ID) {
    try {
      const resp = await fetch('https://api.cal.com/v2/bookings', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${CAL_API_KEY}`,
          'Content-Type': 'application/json',
          'cal-api-version': CAL_API_VERSION,
        },
        body: JSON.stringify({
          eventTypeId: parseInt(CAL_EVENT_TYPE_ID),
          start: slot_start_iso,
          attendee: {
            name,
            email,
            timeZone: 'America/New_York',
            language: 'en',
          },
          metadata: {
            phone: phone || '',
            notes: notes || '',
            source: 'business-card-qr',
            conversation_id: conversationId,
          },
        }),
        signal: AbortSignal.timeout(10_000),
      });

      if (resp.ok) {
        const data = await resp.json();
        const booking = data?.data;
        console.log(`Cal.com booking created: ${booking?.uid}`);

        // Also push to GHL
        pushToGHL({
          name,
          email,
          phone,
          tags: ['business-card-scan', 'strategy-call-booked', 'voxaris-lead'],
          note:
            `## Strategy Call Booked via Business Card\n\n` +
            `**Time:** ${slot_start_iso}\n` +
            `**Booking ID:** ${booking?.uid || 'N/A'}\n` +
            `**Notes:** ${notes || 'None'}\n` +
            `**Conversation ID:** ${conversationId}\n` +
            `**Booked at:** ${new Date().toLocaleString('en-US')}`,
        }).catch(() => {});

        const dt = new Date(slot_start_iso);
        const readable = dt.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          timeZone: 'America/New_York',
        }) + ' at ' + dt.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          timeZone: 'America/New_York',
        });

        return {
          success: true,
          message: `Strategy call confirmed for ${name} on ${readable}. A confirmation email will be sent to ${email}. Tell them you are excited for them to meet the team!`,
          booking_id: booking?.uid,
        };
      }

      const errText = await resp.text();
      console.warn(`Cal.com booking error ${resp.status}: ${errText}`);
      // Fall through to fallback
    } catch (err: any) {
      console.warn(`Cal.com booking failed: ${err.message}`);
    }
  }

  // Fallback — still log to GHL even if Cal.com fails
  pushToGHL({
    name,
    email,
    phone,
    tags: ['business-card-scan', 'booking-requested', 'voxaris-lead'],
    note:
      `## Strategy Call Booking Requested\n\n` +
      `**Requested Time:** ${slot_start_iso}\n` +
      `**Notes:** ${notes || 'None'}\n` +
      `**Conversation ID:** ${conversationId}\n` +
      `**Note:** Cal.com booking could not be confirmed automatically. Follow up manually.\n` +
      `**Requested at:** ${new Date().toLocaleString('en-US')}`,
  }).catch(() => {});

  return {
    success: true,
    message: `I have logged the booking request for ${name}. The team will send a confirmation email to ${email} shortly. Let them know someone will follow up to confirm the time.`,
  };
}

// ── Log interested lead ──

async function logLead(
  toolArgs: Record<string, any>,
  conversationId: string
): Promise<Record<string, any>> {
  console.log('Lead logged:', JSON.stringify(toolArgs));

  pushToGHL({
    name: toolArgs.name,
    email: toolArgs.email,
    phone: toolArgs.phone,
    tags: ['business-card-scan', 'interested-lead', 'voxaris-lead'],
    note:
      `## Interested Lead from Business Card\n\n` +
      `**Interest:** ${toolArgs.interest || 'General'}\n` +
      `**Notes:** ${toolArgs.notes || 'None'}\n` +
      `**Conversation ID:** ${conversationId}\n` +
      `**Captured at:** ${new Date().toLocaleString('en-US')}`,
  }).catch(() => {});

  return { success: true, message: 'Contact info saved. The team will follow up.' };
}

// ── GHL helper ──

async function pushToGHL(params: {
  name?: string;
  email?: string;
  phone?: string;
  tags?: string[];
  note?: string;
}) {
  if (!GHL_TOKEN || !GHL_LOCATION_ID) return;

  const headers = {
    Authorization: `Bearer ${GHL_TOKEN}`,
    Version: '2021-07-28',
    'Content-Type': 'application/json',
  };

  try {
    const nameParts = (params.name || '').split(' ');
    const contactRes = await fetch('https://services.leadconnectorhq.com/contacts/', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        firstName: nameParts[0] || undefined,
        lastName: nameParts.slice(1).join(' ') || undefined,
        email: params.email || undefined,
        phone: params.phone || undefined,
        tags: params.tags || ['voxaris-lead'],
        source: 'Business Card QR - AI Agent',
        locationId: GHL_LOCATION_ID,
      }),
    });

    if (contactRes.ok) {
      const data = await contactRes.json();
      const contactId = data?.contact?.id;
      if (contactId && params.note) {
        await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}/notes`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ body: params.note, userId: null }),
        });
      }
      console.log(`GHL contact: ${contactId}`);
    }
  } catch (err: any) {
    console.warn(`GHL push failed: ${err.message}`);
  }
}

// ── Static availability fallback (when Cal.com not configured) ──

function getStaticAvailability(toolArgs: Record<string, any>): Record<string, any> {
  const now = new Date();
  const slots: Array<{ start: string; human_readable: string }> = [];

  for (let d = 1; d <= 7 && slots.length < 6; d++) {
    const date = new Date(now);
    date.setDate(date.getDate() + d);
    const day = date.getDay();

    if (day === 0 || day === 6) continue; // Weekdays only for strategy calls

    const times =
      toolArgs.preferred_time_of_day === 'morning'
        ? [[10, 0], [11, 0]]
        : toolArgs.preferred_time_of_day === 'afternoon'
          ? [[14, 0], [15, 30]]
          : [[10, 0], [14, 0]];

    for (const [h, m] of times) {
      const slotDate = new Date(date);
      slotDate.setHours(h!, m!, 0, 0);
      const dayName = slotDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      });
      const period = h! >= 12 ? 'PM' : 'AM';
      const hour = h! > 12 ? h! - 12 : h!;
      slots.push({
        start: slotDate.toISOString(),
        human_readable: `${dayName} at ${hour}:${m!.toString().padStart(2, '0')} ${period}`,
      });
    }
  }

  return {
    ok: true,
    source: CAL_API_KEY ? 'cal.com' : 'static',
    slots: slots.slice(0, 4),
    guidance: 'Present 2-3 of these options naturally. Let them pick. Do not list all of them.',
  };
}
