import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * /api/voxaris/tavus/execute
 *
 * Handles Tavus CVI tool call callbacks and action polling.
 *
 * POST — Tavus sends tool call results here (callback_url)
 *   Body: { conversation_id, tool_name, tool_args, ... }
 *   Queues DOM actions for the FloatingMaria widget to pick up.
 *
 * GET  — FloatingMaria widget polls for queued actions
 *   Query: ?cid=<conversation_id>
 *   Returns: { actions: [...] } and clears the queue.
 *
 * Note: Uses in-process Map for action queue. Works reliably on Vercel
 * when traffic is low (same instance handles POST and GET). For production
 * scale, replace with Vercel KV or Upstash Redis.
 */

// In-process action queue (persists within a single serverless instance)
const actionQueue = new Map<string, Array<Record<string, unknown>>>();

// Auto-expire entries after 5 minutes to prevent memory leaks
const EXPIRY_MS = 5 * 60_000;
const timestamps = new Map<string, number>();

function cleanExpired() {
  const now = Date.now();
  for (const [cid, ts] of timestamps) {
    if (now - ts > EXPIRY_MS) {
      actionQueue.delete(cid);
      timestamps.delete(cid);
    }
  }
}

// Map Tavus tool calls to DOM actions the widget understands
function toolCallToAction(toolName: string, toolArgs: Record<string, unknown>): Record<string, unknown> | null {
  switch (toolName) {
    case 'scroll_to_section':
      return {
        action: 'scroll_to_section',
        selector: toolArgs.selector || toolArgs.section,
        section: toolArgs.section,
      };
    case 'highlight_feature':
      return {
        action: 'highlight_feature',
        feature: toolArgs.feature,
      };
    case 'click_element':
      return {
        action: 'click_element',
        selector: toolArgs.selector,
      };
    case 'fill_field':
      return {
        action: 'fill_field',
        selector: toolArgs.selector,
        value: toolArgs.value,
      };
    case 'navigate_to_page':
      return {
        action: 'navigate_to_page',
        route: toolArgs.route || toolArgs.url || toolArgs.page,
      };
    case 'select_option':
      return {
        action: 'select_option',
        selector: toolArgs.selector,
        value: toolArgs.value,
      };
    default:
      // Pass through unknown tools as-is
      return { action: toolName, ...toolArgs };
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  cleanExpired();

  // ── GET: Widget polls for queued actions ──────────────────────────────
  if (req.method === 'GET') {
    const cid = (req.query.cid as string) || '';
    if (!cid) return res.status(200).json({ actions: [] });

    const actions = actionQueue.get(cid) || [];
    // Clear after returning
    if (actions.length > 0) {
      actionQueue.delete(cid);
    }
    return res.status(200).json({ actions });
  }

  // ── POST: Tavus sends tool call callback ──────────────────────────────
  if (req.method === 'POST') {
    const body = req.body || {};

    // Tavus sends different payload formats depending on the event type
    const conversationId =
      body.conversation_id ||
      body.properties?.conversation_id ||
      body.cid ||
      '';

    // Extract tool call info
    const toolName = body.tool_name || body.function_name || body.name || '';
    const toolArgs = body.tool_args || body.arguments || body.args || {};

    if (!conversationId) {
      console.log('[execute] POST without conversation_id:', JSON.stringify(body).slice(0, 500));
      return res.status(200).json({ ok: true, message: 'No conversation_id' });
    }

    if (toolName) {
      const action = toolCallToAction(toolName, toolArgs);
      if (action) {
        const queue = actionQueue.get(conversationId) || [];
        queue.push(action);
        actionQueue.set(conversationId, queue);
        timestamps.set(conversationId, Date.now());
        console.log(`[execute] Queued action for ${conversationId}: ${toolName}`);
      }
    }

    // Return tool result to Tavus
    return res.status(200).json({
      ok: true,
      result: `Action ${toolName} executed successfully`,
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
