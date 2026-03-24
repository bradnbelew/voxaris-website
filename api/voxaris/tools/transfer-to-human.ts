import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * POST /api/voxaris/tools/transfer-to-human
 *
 * Tavus CVI tool handler — called when the customer asks to speak to a real person.
 * 1. Creates GHL contact with transfer tags (fire-and-forget)
 * 2. Adds a note with transfer context
 * 3. Sends urgent iMessage notification via Sendblue
 * 4. Returns Tavus tool result immediately
 */

// GHL credentials
const GHL_TOKEN = process.env.GHL_ACCESS_TOKEN || '';
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID || '';

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

interface TransferProps {
  customer_name: string;
  customer_phone: string;
  reason: string;
  urgency: string; // "high" | "normal"
}

// ── GHL: create contact + note (fire-and-forget) ──
async function pushTransferToGHL(props: TransferProps, conversationId: string): Promise<void> {
  if (!GHL_TOKEN || !GHL_LOCATION_ID) {
    console.warn('[transfer-to-human] GHL credentials not set, skipping CRM push');
    return;
  }

  try {
    // 1. Create contact
    const contactRes = await fetch(`${GHL_BASE}/contacts/`, {
      method: 'POST',
      headers: GHL_HEADERS,
      body: JSON.stringify({
        firstName: props.customer_name?.split(' ')[0] || undefined,
        lastName: props.customer_name?.split(' ').slice(1).join(' ') || undefined,
        phone: props.customer_phone || undefined,
        tags: ['transfer-requested', 'talking-postcard', 'needs-human'],
        source: 'Talking Postcard - Transfer Requested',
        locationId: GHL_LOCATION_ID,
      }),
    });

    if (!contactRes.ok) {
      const errText = await contactRes.text();
      console.warn(`[transfer-to-human] GHL contact creation failed ${contactRes.status}: ${errText}`);
      return;
    }

    const data = await contactRes.json();
    const contactId = data?.contact?.id;
    console.log(`[transfer-to-human] GHL contact created: ${contactId}`);

    if (!contactId) return;

    // 2. Add note with transfer context
    await fetch(`${GHL_BASE}/contacts/${contactId}/notes`, {
      method: 'POST',
      headers: GHL_HEADERS,
      body: JSON.stringify({
        body:
          `## Transfer to Human Requested\n\n` +
          `**Customer:** ${props.customer_name || 'Unknown'}\n` +
          `**Phone:** ${props.customer_phone || 'Not provided'}\n` +
          `**Reason:** ${props.reason || 'Not specified'}\n` +
          `**Urgency:** ${props.urgency || 'normal'}\n` +
          `**Conversation ID:** ${conversationId}\n` +
          `**Requested at:** ${new Date().toLocaleString('en-US')}`,
        userId: null,
      }),
    }).catch((err) => console.warn(`[transfer-to-human] GHL note failed: ${err.message}`));
  } catch (err: any) {
    console.warn(`[transfer-to-human] GHL push failed: ${err.message}`);
  }
}

// ── Send urgent iMessage notification ──
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

    console.log(`[transfer-to-human] Tool call received — tool_call_id=${tool_call_id}, conversation_id=${conversation_id}`);

    const props = (properties || {}) as TransferProps;
    const name = props.customer_name || 'Unknown';
    const phone = props.customer_phone || 'N/A';
    const reason = props.reason || 'Not specified';
    const urgency = props.urgency || 'normal';

    const urgencyPrefix = urgency === 'high' ? '🚨 URGENT ' : '';

    // Fire-and-forget: push to GHL + notify team + webhook
    pushTransferToGHL(props, conversation_id || '').catch(() => {});
    notifyTeam(
      `${urgencyPrefix}TRANSFER REQUEST: ${name} — ${phone} — Reason: ${reason} — Conv: ${conversation_id || 'N/A'}`
    ).catch(() => {});
    fireGhlWebhook({
      event_type: 'transfer_requested',
      customer_name: name,
      customer_phone: phone,
      reason,
      urgency,
      conversation_id: conversation_id || '',
      source: 'tavus_tool_call',
      tags: ['transfer-requested', 'talking-postcard', 'needs-human'],
    }).catch(() => {});

    // Return immediately to Tavus
    return res.status(200).json({
      tool_call_id: tool_call_id || '',
      result: "Got it! Someone from our team will call you within 5 minutes.",
    });
  } catch (err: any) {
    console.error(`[transfer-to-human] Handler error: ${err.message}`);
    return res.status(200).json({
      tool_call_id: req.body?.tool_call_id || '',
      result: "No problem — I'm connecting you with our team now. They'll reach out shortly.",
    });
  }
}
