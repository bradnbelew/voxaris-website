import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * POST /api/voxaris/tavus/create-postcard-session
 *
 * Creates a Tavus CVI conversation for the Talking Postcard flow.
 * Receives PURL params (first_name, vehicle, dealership_name, etc.) from the
 * postcard scan landing page and injects them as conversational_context.
 *
 * KEY FIX: tool_url is now set so Tavus knows where to POST tool calls.
 * Without this, the agent fires book_appointment / check_availability but
 * Tavus has no endpoint to call — tool calls silently fail and GHL never
 * receives anything.
 *
 * All slot generation uses America/New_York time to avoid UTC offset bugs.
 * Returns { conversation_id, conversation_url } — redirect the customer there.
 */

const BUYBACK_PERSONA_ID = process.env.TAVUS_BUYBACK_PERSONA_ID || 'p12baf16e19a';
const CALLBACK_BASE = (process.env.CALLBACK_BASE_URL || 'https://www.voxaris.io').trim();
const TAVUS_URLS = ['https://tavusapi.com', 'https://api.tavus.io'];

// Dealership config — set these per dealer in env or pass via PURL params
const DEFAULT_DEALERSHIP = {
  name:    process.env.DEALERSHIP_NAME    || 'Orlando Motors',
  address: process.env.DEALERSHIP_ADDRESS || '7820 International Drive, Orlando, FL 32819',
  hours:   process.env.DEALERSHIP_HOURS   || 'Mon–Sat 9 AM–7 PM, Sun 11 AM–5 PM',
  phone:   process.env.DEALERSHIP_PHONE   || '(407) 555-0193',
};

// ── Build the conversational context injected into the Tavus persona ──
function buildContext(params: {
  firstName: string;
  lastName?: string;
  vehicle: string;
  dealershipName: string;
  dealershipAddress: string;
  dealershipHours: string;
  phone?: string;
}): string {
  const fullName = params.lastName ? `${params.firstName} ${params.lastName}` : params.firstName;
  return [
    `Customer name: ${fullName}.`,
    `Vehicle: ${params.vehicle}.`,
    `Dealership: ${params.dealershipName}, ${params.dealershipAddress}.`,
    `Hours: ${params.dealershipHours}.`,
    params.phone ? `Customer phone on file: ${params.phone}.` : '',
    'This customer scanned a QR code on their personalized VIP buyback mailer.',
    'Your goal: book a 15-minute VIP appraisal.',
    'When they arrive, they should bring the mailer and any spare keys, and ask for the VIP desk.',
  ].filter(Boolean).join(' ');
}

// ── Tavus session creation with dual-endpoint fallback ──
async function createTavusSession(body: Record<string, any>): Promise<{ success: boolean; data?: any; error?: string }> {
  const TAVUS_API_KEY = (process.env.TAVUS_API_KEY || '').trim();
  if (!TAVUS_API_KEY) return { success: false, error: 'TAVUS_API_KEY not set' };

  for (const baseUrl of TAVUS_URLS) {
    try {
      const resp = await fetch(`${baseUrl}/v2/conversations`, {
        method: 'POST',
        headers: {
          'x-api-key': TAVUS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(15_000),
      });

      if (resp.ok) {
        const data = await resp.json();
        console.log(`[postcard-session] Created via ${baseUrl}: ${data.conversation_id}`);
        return { success: true, data };
      }

      const errText = await resp.text();
      console.warn(`[postcard-session] ${baseUrl} ${resp.status}: ${errText}`);
      // 4xx = bad request, don't retry other domain
      if (resp.status >= 400 && resp.status < 500) {
        return { success: false, error: `Tavus API error ${resp.status}: ${errText}` };
      }
    } catch (err: any) {
      console.warn(`[postcard-session] ${baseUrl} network error: ${err.message}`);
    }
  }
  return { success: false, error: 'All Tavus endpoints unreachable' };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!process.env.TAVUS_API_KEY) {
    return res.status(500).json({ error: 'Tavus API not configured' });
  }

  // ── Parse PURL params from request body ──
  const body           = req.body || {};
  const firstName      = (body.first_name     || body.firstName     || '').trim();
  const lastName       = (body.last_name      || body.lastName      || '').trim();
  const vehicleYear    = (body.vehicle_year   || body.year          || '').trim();
  const vehicleMake    = (body.vehicle_make   || body.make          || '').trim();
  const vehicleModel   = (body.vehicle_model  || body.model         || '').trim();
  const vehicle        = body.vehicle || [vehicleYear, vehicleMake, vehicleModel].filter(Boolean).join(' ');
  const phone          = (body.phone          || body.customer_phone || '').trim();
  const recordId       = (body.record_id      || body.recordId      || '').trim();
  const campaignId     = (body.campaign_id    || 'buyback-postcard').trim();

  // Per-dealer overrides via body (for multi-dealer deployments)
  const dealershipName    = (body.dealership_name    || DEFAULT_DEALERSHIP.name).trim();
  const dealershipAddress = (body.dealership_address || DEFAULT_DEALERSHIP.address).trim();
  const dealershipHours   = (body.dealership_hours   || DEFAULT_DEALERSHIP.hours).trim();

  if (!firstName || !vehicle) {
    return res.status(400).json({ error: 'first_name and vehicle are required' });
  }

  // ── Build Eastern-time scanned_at timestamp ──
  const scannedAt = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

  const conversationalContext = buildContext({
    firstName,
    lastName: lastName || undefined,
    vehicle,
    dealershipName,
    dealershipAddress,
    dealershipHours,
    phone: phone || undefined,
  });

  const conversationName = `buyback-postcard-${firstName.toLowerCase()}-${Date.now()}`;

  const result = await createTavusSession({
    persona_id:            BUYBACK_PERSONA_ID,
    conversation_name:     conversationName,
    conversational_context: conversationalContext,

    // ── THE CRITICAL FIX ──
    // This tells Tavus where to POST every tool call (book_appointment,
    // check_availability, log_lead, transfer_to_human). Without this field,
    // Tavus fires the tool internally and silently discards the result —
    // nothing reaches GHL.
    tool_url: `${CALLBACK_BASE}/api/voxaris/tools/tool-router`,

    // Conversation lifecycle events (started, ended, participant_left, etc.)
    callback_url: `${CALLBACK_BASE}/api/voxaris/tavus/webhook?type=buyback`,

    properties: {
      // PURL data — available in webhook as body.properties
      first_name:          firstName,
      last_name:           lastName  || undefined,
      vehicle,
      phone:               phone     || undefined,
      record_id:           recordId  || undefined,
      campaign_type:       'buyback',
      campaign_id:         campaignId,
      dealership_name:     dealershipName,
      dealership_address:  dealershipAddress,
      postcard_scanned_at: scannedAt,
      // Session settings
      max_call_duration:           600,
      participant_left_timeout:    30,
      participant_absent_timeout:  120,
      enable_recording:            true,
      enable_closed_captions:      true,
      language:                    'english',
    },
  });

  if (!result.success) {
    console.error(`[postcard-session] Failed: ${result.error}`);
    return res.status(500).json({ error: result.error || 'Failed to create session' });
  }

  console.log(`[postcard-session] Ready: ${result.data.conversation_id} | ${firstName} | ${vehicle}`);

  return res.status(200).json({
    conversation_id:  result.data.conversation_id,
    conversation_url: result.data.conversation_url,
    customer:         { firstName, vehicle },
  });
}
