import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * GET + POST /api/facebook/leadgen
 *
 * Facebook Lead Ads webhook. When someone fills out a lead form
 * on your Facebook page, Meta POSTs here with the lead ID.
 * We fetch the lead details, text you via Sendblue, and push to GHL.
 *
 * Setup in Meta:
 * 1. Go to developers.facebook.com → Your App → Webhooks
 * 2. Subscribe to "Page" → "leadgen" field
 * 3. Webhook URL: https://www.voxaris.io/api/facebook/leadgen
 * 4. Verify Token: voxaris-leadgen-2026
 * 5. Subscribe your page to the app's webhook
 */

const FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN || 'voxaris-leadgen-2026';
const FB_PAGE_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN || '';
const FB_GRAPH_VERSION = 'v21.0';

// Sendblue
const SB_KEY = process.env.SENDBLUE_API_KEY || '';
const SB_SECRET = process.env.SENDBLUE_API_SECRET || '';
const SB_FROM = process.env.SENDBLUE_FROM_NUMBER || '+13053369541';
// Notify both Ethan and Mike on new leads
const NOTIFY_NUMBERS = (process.env.LEAD_NOTIFY_NUMBERS || '+14078195809').split(',').map(n => n.trim());

// GHL
const GHL_TOKEN = process.env.GHL_ACCESS_TOKEN || '';
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID || '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // GET = Meta webhook verification challenge
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === FB_VERIFY_TOKEN) {
      console.log('Facebook webhook verified');
      return res.status(200).send(challenge);
    }
    return res.status(403).json({ error: 'Verification failed' });
  }

  // POST = Lead form submission OR PURL generation
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // ── Route: ?action=buyback-purl → Generate personalized PURL for buyback demo ──
  if (req.query.action === 'buyback-purl') {
    return handleBuybackPurl(req, res);
  }

  const body = req.body;
  console.log('Facebook leadgen webhook:', JSON.stringify(body).slice(0, 500));

  // Meta sends: { object: "page", entry: [{ id, time, changes: [{ field: "leadgen", value: { ... } }] }] }
  if (body?.object !== 'page') {
    return res.status(200).json({ ok: true, skipped: true });
  }

  const entries = body.entry || [];
  for (const entry of entries) {
    const changes = entry.changes || [];
    for (const change of changes) {
      if (change.field !== 'leadgen') continue;

      const leadgenId = change.value?.leadgen_id;
      const formId = change.value?.form_id;
      const pageId = change.value?.page_id || entry.id;

      if (!leadgenId) continue;

      console.log(`New lead: ${leadgenId} from form ${formId} on page ${pageId}`);

      // Fetch lead details from Graph API
      const lead = await fetchLeadDetails(leadgenId);
      if (!lead) {
        console.warn(`Could not fetch lead ${leadgenId}`);
        continue;
      }

      // Extract fields
      const fields: Record<string, string> = {};
      for (const fd of lead.field_data || []) {
        fields[fd.name] = fd.values?.[0] || '';
      }

      const name = fields.full_name || `${fields.first_name || ''} ${fields.last_name || ''}`.trim() || 'Unknown';
      const email = fields.email || '';
      const phone = fields.phone_number || fields.phone || '';
      const company = fields.company_name || fields.company || '';

      console.log(`Lead: ${name} | ${email} | ${phone} | ${company}`);

      // 1. Send Sendblue iMessage notification to Ethan
      sendNotification(name, email, phone, company, formId).catch(() => {});

      // 2. Send welcome iMessage to the lead (if they provided a phone number)
      if (phone) {
        sendWelcomeMessage(phone, name).catch(() => {});
      }

      // 3. Push to GHL
      pushToGHL(name, email, phone, company, leadgenId).catch(() => {});
    }
  }

  // Always return 200 to Meta (they retry on non-200)
  return res.status(200).json({ ok: true });
}

async function fetchLeadDetails(leadgenId: string): Promise<any> {
  if (!FB_PAGE_TOKEN) {
    console.warn('FB_PAGE_ACCESS_TOKEN not set — cannot fetch lead details');
    return null;
  }

  try {
    const resp = await fetch(
      `https://graph.facebook.com/${FB_GRAPH_VERSION}/${leadgenId}?access_token=${FB_PAGE_TOKEN}`,
      { signal: AbortSignal.timeout(10_000), headers: { 'User-Agent': 'Voxaris/1.0' } }
    );
    if (!resp.ok) {
      const err = await resp.text();
      console.warn(`FB Graph ${resp.status}: ${err.slice(0, 200)}`);
      return null;
    }
    return resp.json();
  } catch (err: any) {
    console.warn(`FB Graph error: ${err.message}`);
    return null;
  }
}

async function sendNotification(name: string, email: string, phone: string, company: string, formId: string) {
  if (!SB_KEY || !SB_SECRET || NOTIFY_NUMBERS.length === 0) return;

  const msg = [
    `New Facebook Lead:`,
    `Name: ${name}`,
    email ? `Email: ${email}` : '',
    phone ? `Phone: ${phone}` : '',
    company ? `Company: ${company}` : '',
    `Form: ${formId || 'unknown'}`,
  ].filter(Boolean).join('\n');

  // Text both Ethan and Mike
  for (const number of NOTIFY_NUMBERS) {
    try {
      await fetch('https://api.sendblue.co/api/send-message', {
        method: 'POST',
        headers: {
          'sb-api-key-id': SB_KEY,
          'sb-api-secret-key': SB_SECRET,
          'Content-Type': 'application/json',
          'User-Agent': 'Voxaris/1.0',
        },
        body: JSON.stringify({ number, content: msg, from_number: SB_FROM }),
        signal: AbortSignal.timeout(10_000),
      });
      console.log(`Lead notification sent to ${number}`);
    } catch (err: any) {
      console.warn(`Notification to ${number} failed: ${err.message}`);
    }
  }
}

async function sendWelcomeMessage(phone: string, name: string) {
  if (!SB_KEY || !SB_SECRET) return;

  const firstName = name.split(' ')[0] || 'there';
  const msg = `Hey ${firstName}! Thanks for reaching out through our page. I'm Maria from Voxaris — we build AI video agents that book appointments and handle leads 24/7. Want to see a quick demo? Check it out here: voxaris.io/talking-postcard/buyback`;

  try {
    await fetch('https://api.sendblue.co/api/send-message', {
      method: 'POST',
      headers: {
        'sb-api-key-id': SB_KEY,
        'sb-api-secret-key': SB_SECRET,
        'Content-Type': 'application/json',
        'User-Agent': 'Voxaris/1.0',
      },
      body: JSON.stringify({ number: phone, content: msg, from_number: SB_FROM }),
      signal: AbortSignal.timeout(10_000),
    });
    console.log(`Welcome iMessage sent to ${phone}`);
  } catch (err: any) {
    console.warn(`Welcome message failed: ${err.message}`);
  }
}

// ── Buyback PURL Generator ──
// Called via POST /api/facebook/leadgen?action=buyback-purl
// GHL workflow calls this with lead data, gets back a personalized link
const BASE_URL = (process.env.CALLBACK_BASE_URL || 'https://www.voxaris.io').trim();
const GHL_WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/euXH15G0pqPgr497kAL2/webhook-trigger/6730dcb6-748c-4323-a525-65b972384f7a';

async function handleBuybackPurl(req: VercelRequest, res: VercelResponse) {
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

  const recordId = `FB-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

  console.log(`[buyback-purl] New lead: ${firstName} ${lastName} — ${vehicle} — ad: ${adName}`);

  // Build personalized URL
  const query = new URLSearchParams();
  if (firstName) query.set('fn', firstName);
  if (lastName) query.set('ln', lastName);
  if (vehicle) query.set('v', vehicle);
  if (phone) query.set('ph', phone);
  if (email) query.set('em', email);
  query.set('ct', campaignType || 'buyback');
  query.set('rid', recordId);
  query.set('src', 'fb');
  const purl = `${BASE_URL}/talking-postcard/buyback?${query.toString()}`;

  // Push to GHL with PURL and facebook-lead tags
  if (GHL_TOKEN && GHL_LOCATION_ID) {
    const ghlHeaders = {
      Authorization: `Bearer ${GHL_TOKEN}`,
      Version: '2021-07-28',
      'Content-Type': 'application/json',
    };

    try {
      const contactRes = await fetch('https://services.leadconnectorhq.com/contacts/', {
        method: 'POST',
        headers: ghlHeaders,
        body: JSON.stringify({
          firstName: firstName || undefined,
          lastName: lastName || undefined,
          phone: phone || undefined,
          email: email || undefined,
          tags: ['facebook-lead', 'buyback-postcard', 'vip-mailer', 'fb-ad-lead'],
          source: `Facebook Ad: ${adName || 'Buyback Campaign'}`,
          customFields: [
            { key: 'contact.vehicle_full', field_value: vehicle || '' },
            { key: 'contact.campaign_type', field_value: campaignType || 'buyback' },
            { key: 'contact.record_id', field_value: recordId },
            { key: 'contact.purl', field_value: purl },
            { key: 'contact.lead_source', field_value: 'facebook_ad' },
            { key: 'contact.fb_ad_name', field_value: adName || '' },
            { key: 'contact.lead_captured_at', field_value: new Date().toISOString() },
          ],
          locationId: GHL_LOCATION_ID,
        }),
        signal: AbortSignal.timeout(10_000),
      });

      if (contactRes.ok) {
        const cid = (await contactRes.json())?.contact?.id;
        console.log(`[buyback-purl] GHL contact: ${cid}`);

        if (cid) {
          // Add note
          await fetch(`https://services.leadconnectorhq.com/contacts/${cid}/notes`, {
            method: 'POST',
            headers: ghlHeaders,
            body: JSON.stringify({
              body: `## Facebook Ad Lead — Buyback Campaign\n\n**Name:** ${firstName} ${lastName}\n**Phone:** ${phone || 'N/A'}\n**Email:** ${email || 'N/A'}\n**Vehicle:** ${vehicle || 'N/A'}\n**Ad:** ${adName || 'Unknown'}\n**PURL:** ${purl}\n**Captured:** ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} ET`,
              userId: null,
            }),
            signal: AbortSignal.timeout(10_000),
          }).catch(() => {});
        }
      }
    } catch (err: any) {
      console.warn(`[buyback-purl] GHL push failed: ${err.message}`);
    }
  }

  // Fire GHL master workflow webhook
  try {
    await fetch(GHL_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: 'facebook_lead_received',
        first_name: firstName,
        last_name: lastName,
        phone, email, vehicle,
        campaign_type: campaignType,
        ad_name: adName,
        ad_set_name: adSetName,
        form_name: formName,
        purl, record_id: recordId,
        source: 'facebook_ad',
        tags: ['facebook-lead', 'buyback-postcard', 'vip-mailer', 'fb-ad-lead'],
        timestamp: new Date().toISOString(),
        location_id: GHL_LOCATION_ID,
      }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch {}

  return res.status(200).json({
    success: true,
    purl,
    record_id: recordId,
    lead: { firstName, lastName, phone, email, vehicle, campaignType },
    // Ready-to-use SMS template for GHL workflow
    sms_template: `Hey ${firstName || 'there'}! Your VIP appraisal for your ${vehicle || 'vehicle'} is ready. Tap to meet Maria from Orlando Motors: ${purl}`,
  });
}

async function pushToGHL(name: string, email: string, phone: string, company: string, leadgenId: string) {
  if (!GHL_TOKEN || !GHL_LOCATION_ID) return;

  const nameParts = name.split(' ');
  try {
    const contactRes = await fetch('https://services.leadconnectorhq.com/contacts/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GHL_TOKEN}`,
        Version: '2021-07-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: nameParts[0] || undefined,
        lastName: nameParts.slice(1).join(' ') || undefined,
        email: email || undefined,
        phone: phone || undefined,
        companyName: company || undefined,
        tags: ['facebook-lead', 'meta-form', 'voxaris-lead'],
        source: 'Facebook Lead Ad',
        locationId: GHL_LOCATION_ID,
      }),
    });

    if (contactRes.ok) {
      const cid = (await contactRes.json())?.contact?.id;
      if (cid) {
        await fetch(`https://services.leadconnectorhq.com/contacts/${cid}/notes`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${GHL_TOKEN}`,
            Version: '2021-07-28',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            body: `## Facebook Lead Ad Submission\n\n**Name:** ${name}\n**Email:** ${email || 'N/A'}\n**Phone:** ${phone || 'N/A'}\n**Company:** ${company || 'N/A'}\n**Lead ID:** ${leadgenId}\n**Received:** ${new Date().toLocaleString('en-US')}`,
            userId: null,
          }),
        });
      }
      console.log(`GHL contact from FB lead: ${cid}`);
    }
  } catch (err: any) {
    console.warn(`GHL push failed: ${err.message}`);
  }
}
