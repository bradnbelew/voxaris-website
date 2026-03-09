import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * POST /api/book-appointment
 *
 * Creates a real Outlook calendar event for AI-booked appointments.
 * Uses Microsoft Graph API with OAuth2 client credentials.
 *
 * Required env vars:
 *   OUTLOOK_TENANT_ID    — Azure AD tenant ID
 *   OUTLOOK_CLIENT_ID    — Azure AD app registration client ID
 *   OUTLOOK_CLIENT_SECRET — Azure AD app registration client secret
 *   OUTLOOK_USER_EMAIL   — Calendar owner (ethan@voxaris.io)
 *   RESEND_API_KEY       — For fallback email notifications
 *
 * Azure AD app needs: Calendars.ReadWrite application permission (not delegated)
 */

interface AppointmentPayload {
  lead_name: string;
  phone: string;
  email?: string;
  company: string;
  appointment_date: string; // ISO 8601 datetime
  timezone?: string;
  source?: string;
  notes?: string;
  agent_path?: string;
  transcript_summary?: string;
}

async function getAccessToken(): Promise<string> {
  const tenantId = process.env.OUTLOOK_TENANT_ID;
  const clientId = process.env.OUTLOOK_CLIENT_ID;
  const clientSecret = process.env.OUTLOOK_CLIENT_SECRET;

  if (!tenantId || !clientId || !clientSecret) {
    throw new Error('Missing Outlook OAuth credentials (OUTLOOK_TENANT_ID, OUTLOOK_CLIENT_ID, OUTLOOK_CLIENT_SECRET)');
  }

  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
    scope: 'https://graph.microsoft.com/.default',
  });

  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Token request failed: ${res.status} ${errText}`);
  }

  const data = await res.json();
  return data.access_token;
}

async function createCalendarEvent(accessToken: string, payload: AppointmentPayload): Promise<{ id: string; webLink: string }> {
  const userEmail = process.env.OUTLOOK_USER_EMAIL || 'ethan@voxaris.io';
  const tz = payload.timezone || 'America/New_York';

  // Parse the appointment date and create a 30-minute event
  const startDate = new Date(payload.appointment_date);
  const endDate = new Date(startDate.getTime() + 30 * 60 * 1000);

  const notesLines = [
    `Lead: ${payload.lead_name}`,
    `Phone: ${payload.phone}`,
    payload.email ? `Email: ${payload.email}` : null,
    `Company: ${payload.company}`,
    `Source: ${payload.source || 'V·TEAMS inbound call'}`,
    payload.agent_path ? `Agent Path: ${payload.agent_path}` : null,
    payload.notes ? `\nNotes: ${payload.notes}` : null,
    payload.transcript_summary ? `\nTranscript Summary:\n${payload.transcript_summary}` : null,
  ].filter(Boolean).join('\n');

  const event = {
    subject: `V·TEAMS Appointment — ${payload.lead_name} — ${payload.company}`,
    body: {
      contentType: 'Text',
      content: notesLines,
    },
    start: {
      dateTime: startDate.toISOString(),
      timeZone: tz,
    },
    end: {
      dateTime: endDate.toISOString(),
      timeZone: tz,
    },
    isReminderOn: true,
    reminderMinutesBeforeStart: 15,
  };

  const graphUrl = `https://graph.microsoft.com/v1.0/users/${userEmail}/events`;

  const res = await fetch(graphUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Calendar event creation failed: ${res.status} ${errText}`);
  }

  const data = await res.json();
  return { id: data.id, webLink: data.webLink };
}

async function sendFallbackEmail(payload: AppointmentPayload, error: string): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.error('[book-appointment] CRITICAL: Cannot send fallback email — RESEND_API_KEY not set');
    return;
  }

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
        subject: `BOOKING FAILED — ${payload.lead_name} — ${payload.company} — MANUAL ACTION NEEDED`,
        html: `
          <h2 style="color:#dc2626;margin:0 0 16px;">Outlook Booking Failed — Manual Action Required</h2>
          <p style="color:#666;">V·TEAMS attempted to book an appointment but the Outlook calendar event creation failed. The lead data is preserved below.</p>
          <table style="border-collapse:collapse;width:100%;max-width:500px;margin-top:16px;">
            <tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#666;width:160px;"><strong>Lead Name</strong></td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${payload.lead_name}</td></tr>
            <tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#666;"><strong>Phone</strong></td><td style="padding:8px 12px;border-bottom:1px solid #eee;"><a href="tel:${payload.phone}">${payload.phone}</a></td></tr>
            ${payload.email ? `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#666;"><strong>Email</strong></td><td style="padding:8px 12px;border-bottom:1px solid #eee;"><a href="mailto:${payload.email}">${payload.email}</a></td></tr>` : ''}
            <tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#666;"><strong>Company</strong></td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${payload.company}</td></tr>
            <tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#666;"><strong>Requested Time</strong></td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${payload.appointment_date}</td></tr>
            <tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#666;"><strong>Timezone</strong></td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${payload.timezone || 'America/New_York'}</td></tr>
            ${payload.agent_path ? `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#666;"><strong>Agent Path</strong></td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${payload.agent_path}</td></tr>` : ''}
            ${payload.notes ? `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#666;"><strong>Notes</strong></td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${payload.notes}</td></tr>` : ''}
          </table>
          <p style="margin-top:16px;padding:12px;background:#fef2f2;border:1px solid #fecaca;border-radius:8px;color:#991b1b;font-size:13px;">
            <strong>Error:</strong> ${error}
          </p>
          <p style="margin-top:16px;color:#999;font-size:12px;">Please create this calendar event manually and contact the lead.</p>
        `,
      }),
    });
    console.log('[book-appointment] Fallback email sent to ethan@voxaris.io');
  } catch (emailErr) {
    console.error('[book-appointment] CRITICAL: Fallback email also failed:', emailErr);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const payload: AppointmentPayload = req.body;

  if (!payload.lead_name || !payload.phone || !payload.company || !payload.appointment_date) {
    return res.status(400).json({
      error: 'Missing required fields: lead_name, phone, company, appointment_date',
    });
  }

  // Always log the attempt
  console.log('[book-appointment] ATTEMPT:', JSON.stringify(payload));

  // Check if Outlook credentials are configured
  if (!process.env.OUTLOOK_TENANT_ID || !process.env.OUTLOOK_CLIENT_ID || !process.env.OUTLOOK_CLIENT_SECRET) {
    console.error('[book-appointment] Outlook credentials not configured. Sending fallback email.');
    await sendFallbackEmail(payload, 'Outlook OAuth credentials not configured (OUTLOOK_TENANT_ID, OUTLOOK_CLIENT_ID, OUTLOOK_CLIENT_SECRET)');
    return res.status(200).json({
      ok: false,
      booked: false,
      fallback: 'email_sent',
      message: 'Outlook not configured. Fallback email sent to Ethan.',
    });
  }

  try {
    const accessToken = await getAccessToken();
    const event = await createCalendarEvent(accessToken, payload);

    console.log('[book-appointment] SUCCESS: Event created', event.id);

    return res.status(200).json({
      ok: true,
      booked: true,
      event_id: event.id,
      event_link: event.webLink,
    });
  } catch (err: any) {
    const errorMessage = err?.message || 'Unknown error during calendar event creation';
    console.error('[book-appointment] FAILED:', errorMessage);

    // Trigger fallback email immediately
    await sendFallbackEmail(payload, errorMessage);

    return res.status(200).json({
      ok: false,
      booked: false,
      fallback: 'email_sent',
      message: 'Calendar event creation failed. Fallback email sent to Ethan with full lead details.',
      error: errorMessage,
    });
  }
}
