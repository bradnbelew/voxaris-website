import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstName, lastName, email, phone, company, businessType, message } = req.body || {};

  if (!firstName || !lastName || !email || !phone || !company || !businessType) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const submittedAt = new Date().toISOString();

  // Log to Vercel function logs for backup
  console.log('[book-demo]', JSON.stringify({ firstName, lastName, email, phone, company, businessType, message, submittedAt }));

  // Send notification email via Resend if configured
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: 'Voxaris <noreply@voxaris.io>',
          to: 'ethan@voxaris.io',
          subject: `New Demo Request: ${company}`,
          html: `<h2>New Demo Request</h2>
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Company:</strong> ${company}</p>
            <p><strong>Business Type:</strong> ${businessType}</p>
            <p><strong>Message:</strong> ${message || 'N/A'}</p>
            <p><strong>Submitted:</strong> ${submittedAt}</p>`,
        }),
      });
    } catch (err) {
      console.error('[book-demo] Resend email failed:', err);
    }
  }

  return res.status(200).json({ ok: true, submittedAt });
}
