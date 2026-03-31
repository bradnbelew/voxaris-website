import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, firstName, lastName, email, phone, company, rooftops, locations, businessType, message, smsConsent, submitted_at, page_source } = req.body || {};

  // Support both old form (firstName/lastName) and new form (name)
  const fullName = name || `${firstName || ''} ${lastName || ''}`.trim();

  if (!fullName || !phone || !company) {
    return res.status(400).json({ error: 'Missing required fields: name, phone, company' });
  }

  const submittedAt = submitted_at || new Date().toISOString();
  const source = page_source || req.headers.referer || 'unknown';
  const bType = businessType || rooftops ? `${businessType || 'dealership'} (${rooftops || '?'} rooftops)` : businessType || 'not specified';

  // Log to Vercel function logs for backup — always
  console.log('[book-demo] LEAD:', JSON.stringify({ fullName, email, phone, company, businessType: bType, message, submittedAt, source }));

  // ── Create GoHighLevel Contact ──────────────────────────────
  const ghlToken = process.env.GHL_ACCESS_TOKEN;
  const ghlLocationId = process.env.GHL_LOCATION_ID;
  if (ghlToken && ghlLocationId) {
    try {
      const nameParts = fullName.split(' ');
      const ghlBody: Record<string, unknown> = {
        firstName: nameParts[0] || fullName,
        lastName: nameParts.slice(1).join(' ') || '',
        phone,
        companyName: company,
        source: 'Website - Book Demo',
        tags: ['website-demo-request'],
        locationId: ghlLocationId,
      };
      if (email) ghlBody.email = email;

      const ghlRes = await fetch('https://services.leadconnectorhq.com/contacts/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ghlToken}`,
          'Version': '2021-07-28',
        },
        body: JSON.stringify(ghlBody),
      });

      if (ghlRes.ok) {
        const ghlData = await ghlRes.json();
        console.log('[book-demo] GHL contact created:', ghlData?.contact?.id);
      } else {
        const ghlErr = await ghlRes.text();
        console.error('[book-demo] GHL contact creation failed:', ghlRes.status, ghlErr);
      }
    } catch (ghlErr) {
      console.error('[book-demo] GHL error:', ghlErr);
    }
  } else {
    console.warn('[book-demo] GHL_ACCESS_TOKEN or GHL_LOCATION_ID not set — skipping GHL contact creation');
  }

  // Send notification email via Resend
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.error('[book-demo] CRITICAL: RESEND_API_KEY is not set. Lead will not be emailed.');
    // Still return success to the user — lead is logged, but flag it
    return res.status(200).json({ ok: true, submittedAt, warning: 'Email delivery not configured' });
  }

  try {
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: 'Voxaris <noreply@voxaris.io>',
        to: 'ethan@voxaris.io',
        subject: `New Voxaris lead — ${fullName} — ${company} — ${bType}`,
        html: `
          <h2 style="margin:0 0 16px;color:#1a1a1a;">New Lead — ${company}</h2>
          <table style="border-collapse:collapse;width:100%;max-width:500px;">
            <tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#666;width:140px;"><strong>Name</strong></td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${fullName}</td></tr>
            <tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#666;"><strong>Phone</strong></td><td style="padding:8px 12px;border-bottom:1px solid #eee;"><a href="tel:${phone}">${phone}</a></td></tr>
            ${email ? `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#666;"><strong>Email</strong></td><td style="padding:8px 12px;border-bottom:1px solid #eee;"><a href="mailto:${email}">${email}</a></td></tr>` : ''}
            <tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#666;"><strong>Company</strong></td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${company}</td></tr>
            <tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#666;"><strong>Business Type</strong></td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${bType}</td></tr>
            ${message ? `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#666;"><strong>Message</strong></td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${message}</td></tr>` : ''}
            <tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#666;"><strong>Page</strong></td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${source}</td></tr>
            <tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#666;"><strong>Submitted</strong></td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${submittedAt}</td></tr>
            <tr><td style="padding:8px 12px;color:#666;"><strong>Source</strong></td><td style="padding:8px 12px;">website-form</td></tr>
          </table>
          <p style="margin-top:20px;color:#999;font-size:12px;">This lead was submitted via the Voxaris website. Respond quickly.</p>
        `,
      }),
    });

    if (!emailRes.ok) {
      const errBody = await emailRes.text();
      console.error('[book-demo] Resend email failed:', emailRes.status, errBody);
      // Lead is still logged — return success but note the issue
      return res.status(200).json({ ok: true, submittedAt, warning: 'Email delivery may have failed' });
    }

    console.log('[book-demo] Email sent successfully to ethan@voxaris.io');
    return res.status(200).json({ ok: true, submittedAt });
  } catch (err) {
    console.error('[book-demo] Resend email error:', err);
    return res.status(200).json({ ok: true, submittedAt, warning: 'Email delivery error' });
  }
}
