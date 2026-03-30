import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * POST /api/voxaris/leads/facebook-buyback
 *
 * Receives a Facebook Lead Ad lead (via GHL webhook) and returns a
 * personalized PURL that launches the Tavus buyback video agent
 * with the prospect's name, vehicle, and campaign data pre-filled.
 *
 * GHL workflow calls this endpoint, gets the PURL back, then sends
 * it to the lead via SMS, email, or Messenger.
 *
 * Request body (from GHL):
 *   firstName, lastName, phone, email, vehicle,
 *   campaignType, adName, adSetName, formName
 *
 * Response:
 *   { success: true, purl: "https://...", lead: { ... } }
 */

const GHL_TOKEN = process.env.GHL_ACCESS_TOKEN || '';
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID || '';
const GHL_WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/euXH15G0pqPgr497kAL2/webhook-trigger/6730dcb6-748c-4323-a525-65b972384f7a';

const BASE_URL = (process.env.CALLBACK_BASE_URL || 'https://www.voxaris.io').trim();

// ── Build the personalized URL ──
function buildPURL(params: {
  firstName: string;
  lastName: string;
  vehicle: string;
  phone: string;
  email: string;
  campaignType: string;
  recordId: string;
}): string {
  const query = new URLSearchParams();
  if (params.firstName) query.set('fn', params.firstName);
  if (params.lastName) query.set('ln', params.lastName);
  if (params.vehicle) query.set('v', params.vehicle);
  if (params.phone) query.set('ph', params.phone);
  if (params.email) query.set('em', params.email);
  query.set('ct', params.campaignType || 'buyback');
  query.set('rid', params.recordId);
  query.set('src', 'fb'); // track that this came from Facebook

  return `${BASE_URL}/talking-postcard/buyback?${query.toString()}`;
}

// ── Push lead to GHL CRM ──
async function pushToGHL(params: {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  vehicle: string;
  campaignType: string;
  adName: string;
  purl: string;
  recordId: string;
}): Promise<string | null> {
  if (!GHL_TOKEN || !GHL_LOCATION_ID) return null;

  const headers = {
    Authorization: `Bearer ${GHL_TOKEN}`,
    Version: '2021-07-28',
    'Content-Type': 'application/json',
  };

  try {
    const contactRes = await fetch('https://services.leadconnectorhq.com/contacts/', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        firstName: params.firstName || undefined,
        lastName: params.lastName || undefined,
        phone: params.phone || undefined,
        email: params.email || undefined,
        tags: ['facebook-lead', 'buyback-postcard', 'vip-mailer', 'voxaris-lead', 'fb-ad-lead'],
        source: `Facebook Ad: ${params.adName || 'Buyback Campaign'}`,
        customFields: [
          { key: 'contact.vehicle_full', field_value: params.vehicle || '' },
          { key: 'contact.campaign_type', field_value: params.campaignType || 'buyback' },
          { key: 'contact.record_id', field_value: params.recordId },
          { key: 'contact.purl', field_value: params.purl },
          { key: 'contact.lead_source', field_value: 'facebook_ad' },
          { key: 'contact.fb_ad_name', field_value: params.adName || '' },
          { key: 'contact.lead_captured_at', field_value: new Date().toISOString() },
        ],
        locationId: GHL_LOCATION_ID,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (contactRes.ok) {
      const data = await contactRes.json();
      const contactId = data?.contact?.id;
      console.log(`[fb-buyback] GHL contact created: ${contactId}`);

      // Add note with full context
      if (contactId) {
        await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}/notes`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            body:
              `## Facebook Ad Lead — Buyback Campaign\n\n` +
              `**Name:** ${params.firstName || ''} ${params.lastName || ''}\n` +
              `**Phone:** ${params.phone || 'Not provided'}\n` +
              `**Email:** ${params.email || 'Not provided'}\n` +
              `**Vehicle:** ${params.vehicle || 'Not specified'}\n` +
              `**Ad:** ${params.adName || 'Unknown'}\n` +
              `**PURL:** ${params.purl}\n` +
              `**Captured:** ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} ET`,
            userId: null,
          }),
          signal: AbortSignal.timeout(10_000),
        }).catch(() => {});
      }

      return contactId || null;
    } else {
      const errText = await contactRes.text();
      console.warn(`[fb-buyback] GHL contact creation failed ${contactRes.status}: ${errText}`);
      return null;
    }
  } catch (err: any) {
    console.warn(`[fb-buyback] GHL push failed: ${err.message}`);
    return null;
  }
}

// ── Fire GHL master workflow webhook ──
async function fireGhlWebhook(payload: Record<string, any>): Promise<void> {
  try {
    await fetch(GHL_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        timestamp: new Date().toISOString(),
        location_id: GHL_LOCATION_ID,
      }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch {}
}

// ── Main handler ──
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  try {
    const {
      firstName = '',
      lastName = '',
      phone = '',
      email = '',
      vehicle = '',
      campaignType = 'buyback',
      adName = '',
      adSetName = '',
      formName = '',
    } = req.body || {};

    // Generate a unique record ID for tracking
    const recordId = `FB-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

    console.log(`[fb-buyback] New lead: ${firstName} ${lastName} — ${vehicle} — ad: ${adName}`);

    // 1. Build personalized URL
    const purl = buildPURL({
      firstName,
      lastName,
      vehicle,
      phone,
      email,
      campaignType,
      recordId,
    });

    // 2. Push to GHL (fire-and-forget but capture contactId)
    const ghlContactId = await pushToGHL({
      firstName,
      lastName,
      phone,
      email,
      vehicle,
      campaignType,
      adName,
      purl,
      recordId,
    });

    // 3. Fire GHL inbound webhook for workflow automation
    fireGhlWebhook({
      event_type: 'facebook_lead_received',
      first_name: firstName,
      last_name: lastName,
      phone,
      email,
      vehicle,
      campaign_type: campaignType,
      ad_name: adName,
      ad_set_name: adSetName,
      form_name: formName,
      purl,
      record_id: recordId,
      contact_id: ghlContactId || '',
      source: 'facebook_ad',
      tags: ['facebook-lead', 'buyback-postcard', 'vip-mailer', 'fb-ad-lead'],
    }).catch(() => {});

    // 4. Return the PURL so GHL can send it via SMS/email/Messenger
    return res.status(200).json({
      success: true,
      purl,
      record_id: recordId,
      contact_id: ghlContactId || null,
      lead: {
        firstName,
        lastName,
        phone,
        email,
        vehicle,
        campaignType,
      },
      // SMS template ready for GHL to use
      sms_template: `Hey ${firstName || 'there'}! 🎉 Your VIP appraisal for your ${vehicle || 'vehicle'} is ready. Tap to meet Maria from Orlando Motors: ${purl}`,
    });
  } catch (err: any) {
    console.error(`[fb-buyback] Handler error: ${err.message}`);
    return res.status(500).json({
      success: false,
      error: 'Failed to process lead',
    });
  }
}
