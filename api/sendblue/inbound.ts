import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * POST /api/sendblue/inbound
 *
 * Sendblue inbound webhook — receives iMessages/SMS, processes with
 * Claude AI, and auto-replies. Set this URL in your Sendblue dashboard
 * under Settings → Webhooks → Inbound Message URL.
 *
 * Flow: Customer texts → Sendblue webhook → Claude processes → Sendblue reply
 */

const SB_KEY = process.env.SENDBLUE_API_KEY || '';
const SB_SECRET = process.env.SENDBLUE_API_SECRET || '';
const SB_FROM = process.env.SENDBLUE_FROM_NUMBER || '+13053369541';
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY || '';

// GHL for contact lookup/creation
const GHL_TOKEN = process.env.GHL_ACCESS_TOKEN || '';
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID || '';

const SYSTEM_PROMPT = `You are Maria, the AI assistant for Voxaris. You respond to text messages from potential customers and existing leads. Keep messages SHORT — 1-3 sentences max. This is iMessage/SMS, not email.

Your goals:
- Answer questions about Voxaris products (Talking Postcards, AI video agents, voice agents)
- Help schedule strategy calls (direct them to voxaris.io/book-demo or offer to book for them)
- Be warm, helpful, and conversational — like texting a friend who knows AI really well
- If they want a demo, send them to voxaris.io/talking-postcard/buyback to see a live buyback demo

Key facts:
- Voxaris builds AI video and voice agents for businesses
- Talking Postcard: QR code on direct mail → live AI video agent greets customer by name → books appointments
- Most popular use case: vehicle buyback campaigns for auto dealerships
- Founded by Ethan Stopperich, based in Orlando FL
- Website: voxaris.io

Rules:
- Never discuss pricing over text — say "that depends on the campaign, hop on a quick call and we'll walk through it"
- Keep it casual and short — this is texting, not a sales deck
- Use natural language, contractions, casual tone
- If you don't know something, say so and offer to have Ethan follow up`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = req.body || {};

  // ── GHL webhook mode: ?action=send ──
  // Simple POST { number, content } to send an iMessage. No MCP wrapper needed.
  // GHL sends custom data nested under body or as top-level fields
  if (req.query.action === 'send') {
    console.log('Sendblue send body:', JSON.stringify(body).slice(0, 500));
    // Check body, query params, and every nested path GHL might use
    const q = req.query || {};
    const to = body.number || body.phone || body.to || body.contact?.phone || body.customData?.number || body.customData?.phone || (q.number as string) || (q.phone as string) || '';
    const msg = body.content || body.message || body.text || body.customData?.content || body.customData?.message || (q.content as string) || (q.message as string) || '';

    if (!to || !msg) {
      return res.status(400).json({ ok: false, error: 'Missing number and content' });
    }
    if (!SB_KEY || !SB_SECRET) {
      return res.status(500).json({ ok: false, error: 'Sendblue not configured' });
    }

    try {
      const sendRes = await fetch('https://api.sendblue.co/api/send-message', {
        method: 'POST',
        headers: { 'sb-api-key-id': SB_KEY, 'sb-api-secret-key': SB_SECRET, 'Content-Type': 'application/json', 'User-Agent': 'Voxaris/1.0' },
        body: JSON.stringify({ number: to, content: msg, from_number: SB_FROM }),
        signal: AbortSignal.timeout(10_000),
      });
      const text = await sendRes.text();
      let data: any;
      try { data = JSON.parse(text); } catch { data = { raw: text }; }
      console.log(`Sendblue send to ${to}: ${data.status || 'sent'}`);
      return res.status(200).json({ ok: true, status: data.status || 'sent' });
    } catch (err: any) {
      console.error(`Sendblue send failed: ${err.message}`);
      return res.status(500).json({ ok: false, error: err.message });
    }
  }

  // ── Normal inbound mode (Sendblue webhook) ──
  const from = body.number || body.from_number || '';
  const content = body.content || body.message || '';
  const mediaUrl = body.media_url || '';
  const isGroup = body.is_group || false;

  console.log(`Sendblue inbound from ${from}: "${content.slice(0, 100)}"`);

  // Ignore group messages and empty messages
  if (isGroup || (!content && !mediaUrl)) {
    return res.status(200).json({ ok: true, skipped: true });
  }

  // Log inbound to GHL (fire-and-forget)
  if (GHL_TOKEN && GHL_LOCATION_ID) {
    logInboundToGHL(from, content).catch(() => {});
  }

  // Generate AI response
  const reply = await generateReply(from, content);

  // Send reply via Sendblue
  if (reply && SB_KEY && SB_SECRET) {
    try {
      // Send typing indicator first for natural feel
      await fetch('https://api.sendblue.co/api/send-typing-indicator', {
        method: 'POST',
        headers: { 'sb-api-key-id': SB_KEY, 'sb-api-secret-key': SB_SECRET, 'Content-Type': 'application/json', 'User-Agent': 'Voxaris/1.0' },
        body: JSON.stringify({ number: from }),
      });

      // Brief pause for realism
      await new Promise(r => setTimeout(r, 1500));

      // Send the reply
      const sendRes = await fetch('https://api.sendblue.co/api/send-message', {
        method: 'POST',
        headers: { 'sb-api-key-id': SB_KEY, 'sb-api-secret-key': SB_SECRET, 'Content-Type': 'application/json', 'User-Agent': 'Voxaris/1.0' },
        body: JSON.stringify({ number: from, content: reply, from_number: SB_FROM }),
        signal: AbortSignal.timeout(10_000),
      });
      const sendData = await sendRes.json();
      console.log(`Sendblue reply to ${from}: ${sendData.status || 'sent'}`);
    } catch (err: any) {
      console.warn(`Sendblue reply failed: ${err.message}`);
    }
  }

  return res.status(200).json({ ok: true, replied: !!reply });
}

async function generateReply(from: string, message: string): Promise<string> {
  // Try Claude API first, fall back to a simple response
  if (ANTHROPIC_API_KEY && ANTHROPIC_API_KEY.startsWith('sk-ant-')) {
    try {
      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 200,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: `[Text from ${from}]: ${message}` }],
        }),
        signal: AbortSignal.timeout(10_000),
      });

      if (resp.ok) {
        const data = await resp.json();
        const text = data.content?.[0]?.text || '';
        if (text) return text;
      }
    } catch (err: any) {
      console.warn(`Claude API failed: ${err.message}`);
    }
  }

  // Try OpenAI as fallback
  if (ANTHROPIC_API_KEY && ANTHROPIC_API_KEY.startsWith('sk-')) {
    try {
      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${ANTHROPIC_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          max_tokens: 200,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: `[Text from ${from}]: ${message}` },
          ],
        }),
        signal: AbortSignal.timeout(10_000),
      });

      if (resp.ok) {
        const data = await resp.json();
        const text = data.choices?.[0]?.message?.content || '';
        if (text) return text;
      }
    } catch {}
  }

  // Fallback — no AI available, send a helpful response
  const lower = message.toLowerCase();
  if (lower.includes('demo') || lower.includes('see it') || lower.includes('show me')) {
    return "Hey! Check out a live demo here: voxaris.io/talking-postcard/buyback — you can talk to the AI agent right now. If you want to chat more, book a call at voxaris.io/book-demo";
  }
  if (lower.includes('price') || lower.includes('cost') || lower.includes('how much')) {
    return "Great question! Pricing depends on the campaign type and volume. Hop on a quick 15-min call and we'll walk through everything: voxaris.io/book-demo";
  }
  return "Hey! Thanks for reaching out. Check out what we do at voxaris.io — or if you want to chat, book a quick call at voxaris.io/book-demo";
}

async function logInboundToGHL(phone: string, message: string) {
  if (!GHL_TOKEN || !GHL_LOCATION_ID) return;
  try {
    const contactRes = await fetch('https://services.leadconnectorhq.com/contacts/', {
      method: 'POST',
      headers: { Authorization: `Bearer ${GHL_TOKEN}`, Version: '2021-07-28', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone,
        tags: ['sendblue-inbound', 'text-lead', 'voxaris-lead'],
        source: 'Sendblue iMessage',
        locationId: GHL_LOCATION_ID,
      }),
    });
    if (contactRes.ok) {
      const cid = (await contactRes.json())?.contact?.id;
      if (cid) {
        await fetch(`https://services.leadconnectorhq.com/contacts/${cid}/notes`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${GHL_TOKEN}`, Version: '2021-07-28', 'Content-Type': 'application/json' },
          body: JSON.stringify({ body: `## Inbound Text via Sendblue\n\n**Message:** ${message}\n**From:** ${phone}\n**Received:** ${new Date().toLocaleString('en-US')}`, userId: null }),
        });
      }
    }
  } catch {}
}
