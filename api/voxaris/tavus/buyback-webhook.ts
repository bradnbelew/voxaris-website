import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * POST /api/voxaris/tavus/buyback-webhook
 *
 * Handles Tavus webhook events for buyback postcard conversations.
 * Processes tool calls and pushes data to GoHighLevel.
 */

// GHL credentials
const GHL_TOKEN = process.env.GHL_ACCESS_TOKEN || '';
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID || '';

const GHL_HEADERS = {
  Authorization: `Bearer ${GHL_TOKEN}`,
  Version: '2021-07-28',
  'Content-Type': 'application/json',
};

// ── GHL helpers ──

async function ghlAddNote(contactSearch: string, note: string) {
  if (!GHL_TOKEN || !GHL_LOCATION_ID) return;

  try {
    // Search for contact by conversation_id custom field or phone
    const searchRes = await fetch(
      `https://services.leadconnectorhq.com/contacts/search/duplicate?` +
        `locationId=${GHL_LOCATION_ID}&` +
        (contactSearch.includes('@')
          ? `email=${encodeURIComponent(contactSearch)}`
          : `phone=${encodeURIComponent(contactSearch)}`),
      { method: 'GET', headers: GHL_HEADERS }
    );

    if (searchRes.ok) {
      const data = await searchRes.json();
      const contactId = data?.contact?.id;
      if (contactId) {
        await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}/notes`, {
          method: 'POST',
          headers: GHL_HEADERS,
          body: JSON.stringify({ body: note, userId: null }),
        });
        console.log(`GHL note added to ${contactId}`);
      }
    }
  } catch (err: any) {
    console.warn(`GHL note failed: ${err.message}`);
  }
}

async function ghlAddTag(phone: string, tags: string[]) {
  if (!GHL_TOKEN || !GHL_LOCATION_ID || !phone) return;

  try {
    const searchRes = await fetch(
      `https://services.leadconnectorhq.com/contacts/search/duplicate?` +
        `locationId=${GHL_LOCATION_ID}&phone=${encodeURIComponent(phone)}`,
      { method: 'GET', headers: GHL_HEADERS }
    );

    if (searchRes.ok) {
      const data = await searchRes.json();
      const contactId = data?.contact?.id;
      if (contactId) {
        await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}`, {
          method: 'PUT',
          headers: GHL_HEADERS,
          body: JSON.stringify({ tags }),
        });
        console.log(`GHL tags added to ${contactId}: ${tags.join(', ')}`);
      }
    }
  } catch (err: any) {
    console.warn(`GHL tag failed: ${err.message}`);
  }
}

async function ghlCreateOrUpdateContact(params: {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  tags?: string[];
  note?: string;
}) {
  if (!GHL_TOKEN || !GHL_LOCATION_ID) return;

  try {
    const contactRes = await fetch('https://services.leadconnectorhq.com/contacts/', {
      method: 'POST',
      headers: GHL_HEADERS,
      body: JSON.stringify({
        firstName: params.firstName || undefined,
        lastName: params.lastName || undefined,
        phone: params.phone || undefined,
        email: params.email || undefined,
        tags: params.tags || ['buyback-postcard'],
        source: 'Buyback Postcard AI Agent',
        locationId: GHL_LOCATION_ID,
      }),
    });

    if (contactRes.ok) {
      const data = await contactRes.json();
      const contactId = data?.contact?.id;
      console.log(`GHL contact upserted: ${contactId}`);

      if (contactId && params.note) {
        await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}/notes`, {
          method: 'POST',
          headers: GHL_HEADERS,
          body: JSON.stringify({ body: params.note, userId: null }),
        });
      }
      return contactId;
    }
  } catch (err: any) {
    console.warn(`GHL contact upsert failed: ${err.message}`);
  }
  return null;
}

// ── Main handler ──

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = req.body || {};

  // Tavus sends conversation_id in multiple places
  const conversationId =
    body.conversation_id ||
    body.properties?.conversation_id ||
    body.cid ||
    '';

  // Tavus tool call fields
  const toolName = body.tool_name || body.function_name || body.name || '';
  const toolArgs = body.tool_args || body.tool_input || body.arguments || body.args || {};
  const eventType = body.event_type || body.type || 'unknown';

  console.log(`Buyback webhook: event=${eventType} tool=${toolName} cid=${conversationId}`);

  // If a tool name is present, handle the tool call
  if (toolName) {
    const result = await handleToolCall(toolName, toolArgs, conversationId);
    return res.status(200).json({ ok: true, result: JSON.stringify(result) });
  }

  // Non-tool events
  switch (eventType) {
    case 'conversation.ended':
    case 'conversation_ended': {
      const duration = body.duration_seconds || body.properties?.duration_seconds || 0;
      console.log(`Buyback conversation ended: ${conversationId}, duration: ${duration}s`);
      break;
    }

    case 'conversation.started':
    case 'conversation_started':
    case 'conversation.utterance':
    case 'utterance':
      console.log(`Buyback event: ${eventType}`, JSON.stringify(body).slice(0, 500));
      break;

    default:
      console.log(`Buyback unknown event: ${eventType}`, JSON.stringify(body).slice(0, 300));
  }

  return res.status(200).json({ ok: true });
}

// ── Tool call handler ──

async function handleToolCall(
  toolName: string,
  toolArgs: Record<string, any>,
  conversationId: string
): Promise<Record<string, any>> {
  switch (toolName) {
    case 'check_availability': {
      return getStaticAvailability(toolArgs);
    }

    case 'book_appointment': {
      console.log('Appointment booked:', JSON.stringify(toolArgs));

      // Push appointment to GHL (fire-and-forget)
      ghlCreateOrUpdateContact({
        firstName: toolArgs.customer_first_name,
        lastName: toolArgs.customer_last_name,
        phone: toolArgs.customer_phone,
        email: toolArgs.customer_email,
        tags: ['buyback-postcard', 'appointment-booked', 'vip-appraisal'],
        note:
          `## VIP Appraisal Appointment Booked\n\n` +
          `**Type:** ${toolArgs.appointment_type || 'Appraisal'}\n` +
          `**Time:** ${toolArgs.slot_start_iso || 'TBD'}\n` +
          `**Vehicle:** ${toolArgs.vehicle || 'Not specified'}\n` +
          `**Notes:** ${toolArgs.notes || 'None'}\n` +
          `**Conversation ID:** ${conversationId}\n` +
          `**Booked via:** Talking Postcard AI Agent\n` +
          `**Booked at:** ${new Date().toLocaleString('en-US')}`,
      }).catch(() => {});

      return {
        success: true,
        message: `Appointment confirmed for ${toolArgs.customer_first_name}. Tell the customer they are all set and we look forward to seeing them at Orlando Motors. Remind them to bring the mailer and ask for the VIP desk.`,
      };
    }

    case 'log_lead': {
      console.log('Lead logged:', JSON.stringify(toolArgs));

      // Push lead to GHL (fire-and-forget)
      ghlCreateOrUpdateContact({
        firstName: toolArgs.first_name,
        lastName: toolArgs.last_name,
        phone: toolArgs.phone,
        email: toolArgs.email,
        tags: ['buyback-postcard', 'lead-captured'],
        note:
          `## Lead Captured via Buyback Postcard\n\n` +
          `**Interest:** ${toolArgs.interest || 'Vehicle buyback'}\n` +
          `**Notes:** ${toolArgs.notes || 'None'}\n` +
          `**Conversation ID:** ${conversationId}\n` +
          `**Captured at:** ${new Date().toLocaleString('en-US')}`,
      }).catch(() => {});

      return { success: true, message: 'Contact info saved.' };
    }

    case 'transfer_to_human': {
      // Log transfer request to GHL
      if (GHL_TOKEN && GHL_LOCATION_ID) {
        // We don't have the contact's phone here, so just log it
        console.log(`Transfer requested: ${toolArgs.reason} (${toolArgs.department})`);
      }

      return {
        success: true,
        message: 'Let the customer know they can reach Orlando Motors directly at (407) 555-0193. Ask if there is anything else you can help with first.',
        phone: '(407) 555-0193',
      };
    }

    default:
      return { success: false, error: `Unknown tool: ${toolName}` };
  }
}

// ── Static availability generator ──

function getStaticAvailability(toolInput: Record<string, any>): Record<string, any> {
  const now = new Date();
  const slots = [];

  for (let d = 1; d <= 7 && slots.length < 6; d++) {
    const date = new Date(now);
    date.setDate(date.getDate() + d);
    const day = date.getDay();

    if (day === 0) continue; // Skip Sunday for appraisals
    if (day === 6) {
      slots.push({
        start: formatSlot(date, 10, 0),
        end: formatSlot(date, 10, 30),
        human_readable: `${formatDay(date)} at 10:00 AM`,
      });
      continue;
    }

    const times =
      toolInput.preferred_time_of_day === 'morning'
        ? [[9, 30], [10, 0]]
        : toolInput.preferred_time_of_day === 'afternoon'
          ? [[14, 0], [15, 30]]
          : [[10, 0], [14, 0]];

    for (const [h, m] of times) {
      slots.push({
        start: formatSlot(date, h!, m!),
        end: formatSlot(date, h!, m! + 30),
        human_readable: `${formatDay(date)} at ${formatTime(h!, m!)}`,
      });
    }
  }

  return {
    ok: true,
    appointment_type: toolInput.appointment_type || 'appraisal',
    duration_minutes: 15,
    slots: slots.slice(0, 4),
    guidance: 'Present 2-3 of these options. Let the customer pick. Do not list all of them.',
  };
}

function formatSlot(date: Date, hours: number, minutes: number): string {
  const d = new Date(date);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
}

function formatDay(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}

function formatTime(h: number, m: number): string {
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h > 12 ? h - 12 : h;
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
}
