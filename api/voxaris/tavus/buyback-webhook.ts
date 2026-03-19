import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * POST /api/voxaris/tavus/buyback-webhook
 *
 * Handles Tavus webhook events for buyback postcard conversations.
 * Processes tool calls (check_availability, book_appointment, log_lead, transfer_to_human).
 */

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = req.body || {};

  // Tavus sends conversation_id in multiple places depending on event type
  const conversationId =
    body.conversation_id ||
    body.properties?.conversation_id ||
    body.cid ||
    '';

  // Tavus sends tool calls with tool_name/function_name/name and tool_args/arguments/args
  const toolName = body.tool_name || body.function_name || body.name || '';
  const toolArgs = body.tool_args || body.tool_input || body.arguments || body.args || {};
  const eventType = body.event_type || body.type || 'unknown';

  console.log(`Buyback webhook: event=${eventType} tool=${toolName} cid=${conversationId}`);

  // If a tool name is present, this is a tool call — handle it regardless of event_type
  if (toolName) {
    const result = handleToolCall(toolName, toolArgs);
    return res.status(200).json({ ok: true, result: JSON.stringify(result) });
  }

  // Non-tool events (started, ended, utterance, etc.) — just acknowledge
  switch (eventType) {
    case 'conversation.started':
    case 'conversation_started':
    case 'conversation.ended':
    case 'conversation_ended':
    case 'conversation.utterance':
    case 'utterance':
      console.log(`Buyback event: ${eventType}`, JSON.stringify(body).slice(0, 500));
      break;

    default:
      console.log(`Buyback unknown event: ${eventType}`, JSON.stringify(body).slice(0, 300));
  }

  return res.status(200).json({ ok: true });
}

function handleToolCall(toolName: string, toolInput: Record<string, any>): Record<string, any> {
  switch (toolName) {
    case 'check_availability': {
      return getStaticAvailability(toolInput);
    }

    case 'book_appointment': {
      console.log('Appointment booked (demo):', JSON.stringify(toolInput));
      return {
        success: true,
        message: `Appointment confirmed for ${toolInput.customer_first_name}. Tell the customer they are all set and we look forward to seeing them at Orlando Motors.`,
      };
    }

    case 'log_lead': {
      console.log('Lead logged (demo):', JSON.stringify(toolInput));
      return { success: true, message: 'Contact info saved.' };
    }

    case 'transfer_to_human': {
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

function getStaticAvailability(toolInput: Record<string, any>): Record<string, any> {
  const now = new Date();
  const slots = [];

  for (let d = 1; d <= 7 && slots.length < 6; d++) {
    const date = new Date(now);
    date.setDate(date.getDate() + d);
    const day = date.getDay();

    if (day === 0) continue;
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
