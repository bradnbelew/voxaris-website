import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * POST /api/vteams/webhook
 *
 * Handles Vapi tool-call webhooks for V·TEAMS squad agents.
 * Routes to appropriate handlers based on the tool function name.
 */

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body || {};

  // Vapi sends different message types — we only handle tool-calls
  if (message?.type === 'tool-calls') {
    const toolCalls = message.toolCalls || [];
    const results = [];

    for (const toolCall of toolCalls) {
      const { name, arguments: args } = toolCall.function || {};
      console.log(`[vteams-webhook] Tool call: ${name}`, JSON.stringify(args));

      try {
        let result: any;

        switch (name) {
          case 'create_or_update_contact':
            result = await handleCreateContact(args);
            break;
          case 'book_appointment':
            result = await handleBookAppointment(args);
            break;
          case 'escalate_to_human':
            result = await handleEscalation(args);
            break;
          case 'save_call_summary':
            result = await handleSaveCallSummary(args);
            break;
          default:
            result = { success: false, error: `Unknown tool: ${name}` };
        }

        results.push({
          toolCallId: toolCall.id,
          result: JSON.stringify(result),
        });
      } catch (err: any) {
        console.error(`[vteams-webhook] Tool ${name} failed:`, err.message);
        results.push({
          toolCallId: toolCall.id,
          result: JSON.stringify({ success: false, error: err.message }),
        });
      }
    }

    return res.status(200).json({ results });
  }

  // Log other message types for debugging
  if (message?.type) {
    console.log(`[vteams-webhook] Message type: ${message.type}`);
  }

  return res.status(200).json({ ok: true });
}

// ── Tool Handlers ────────────────────────────────────────────

async function handleCreateContact(args: any) {
  console.log('[vteams] Creating/updating contact:', args.caller_name, args.phone_number);

  // Log to Vercel for backup
  const contactData = {
    name: args.caller_name,
    phone: args.phone_number,
    email: args.email,
    company: args.company,
    source: 'inbound_call',
    created_at: new Date().toISOString(),
  };

  // TODO: Integrate with DealerSocket / VinSolutions / GoHighLevel CRM
  // For now, log and send notification email
  console.log('[vteams] Contact data:', JSON.stringify(contactData));

  return { success: true, message: `Contact ${args.caller_name} created/updated`, contact: contactData };
}

async function handleBookAppointment(args: any) {
  console.log('[vteams] Booking appointment for:', args.caller_name, 'at', args.appointment_date);

  // Call the book-appointment API to create a real Outlook event
  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://voxaris.io';

  try {
    const bookingRes = await fetch(`${baseUrl}/api/book-appointment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lead_name: args.caller_name,
        phone: args.phone_number,
        email: args.email,
        company: args.company || 'Unknown',
        appointment_date: args.appointment_date,
        source: 'V·TEAMS inbound call',
        notes: args.notes,
        agent_path: 'receptionist > qualifier > closer',
      }),
    });

    const result = await bookingRes.json();

    if (result.booked) {
      return {
        success: true,
        message: `Appointment booked for ${args.caller_name} at ${args.appointment_date}. Confirmation will be sent.`,
        event_id: result.event_id,
      };
    } else {
      return {
        success: true,
        message: `I've captured all the details and our team will confirm your appointment shortly. A notification has been sent.`,
        fallback: result.fallback,
      };
    }
  } catch (err: any) {
    console.error('[vteams] Booking API call failed:', err.message);

    // Send fallback email directly
    await sendFallbackNotification(args);

    return {
      success: true,
      message: 'I want to make sure we get this right. Let me have someone from our team reach out to confirm your appointment within the hour.',
    };
  }
}

async function handleEscalation(args: any) {
  console.log('[vteams] Escalating to human:', args.reason);

  // Notify Ethan immediately
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
          subject: `V·TEAMS Escalation — ${args.caller_name || 'Unknown'} needs human help`,
          html: `
            <h2 style="color:#d97706;">V·TEAMS Call Escalated</h2>
            <p><strong>Reason:</strong> ${args.reason}</p>
            <p><strong>Caller:</strong> ${args.caller_name || 'Unknown'}</p>
            <p><strong>Phone:</strong> ${args.phone_number ? `<a href="tel:${args.phone_number}">${args.phone_number}</a>` : 'Not captured'}</p>
            <p><strong>Context:</strong> ${args.context_summary || 'No summary available'}</p>
            <p><strong>Time:</strong> ${new Date().toISOString()}</p>
            <p style="color:#999;font-size:12px;">This caller was routed from V·TEAMS and needs human follow-up.</p>
          `,
        }),
      });
    } catch (e) {
      console.error('[vteams] Escalation email failed:', e);
    }
  }

  return {
    success: true,
    message: 'Escalation logged. A team member will be notified immediately.',
  };
}

async function handleSaveCallSummary(args: any) {
  console.log('[vteams] Saving call summary:', args.disposition);

  const summaryData = {
    caller_name: args.caller_name,
    phone: args.phone_number,
    intent: args.intent,
    disposition: args.disposition,
    squad_path: args.squad_path,
    summary: args.summary,
    appointment_time: args.appointment_time,
    unanswered_questions: args.unanswered_questions,
    saved_at: new Date().toISOString(),
  };

  console.log('[vteams] Call summary:', JSON.stringify(summaryData));

  // Send summary email for every completed call
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
          subject: `V·TEAMS Call — ${args.caller_name || 'Unknown'} — ${args.disposition}`,
          html: `
            <h2>V·TEAMS Call Summary</h2>
            <table style="border-collapse:collapse;width:100%;max-width:500px;">
              <tr><td style="padding:6px 12px;border-bottom:1px solid #eee;color:#666;"><strong>Caller</strong></td><td style="padding:6px 12px;border-bottom:1px solid #eee;">${args.caller_name || 'Unknown'}</td></tr>
              <tr><td style="padding:6px 12px;border-bottom:1px solid #eee;color:#666;"><strong>Disposition</strong></td><td style="padding:6px 12px;border-bottom:1px solid #eee;">${args.disposition}</td></tr>
              <tr><td style="padding:6px 12px;border-bottom:1px solid #eee;color:#666;"><strong>Squad Path</strong></td><td style="padding:6px 12px;border-bottom:1px solid #eee;">${args.squad_path || 'N/A'}</td></tr>
              ${args.appointment_time ? `<tr><td style="padding:6px 12px;border-bottom:1px solid #eee;color:#666;"><strong>Appointment</strong></td><td style="padding:6px 12px;border-bottom:1px solid #eee;">${args.appointment_time}</td></tr>` : ''}
              ${args.unanswered_questions ? `<tr><td style="padding:6px 12px;border-bottom:1px solid #eee;color:#666;"><strong>Unanswered</strong></td><td style="padding:6px 12px;border-bottom:1px solid #eee;">${args.unanswered_questions}</td></tr>` : ''}
            </table>
            <h3 style="margin-top:16px;">Summary</h3>
            <p style="background:#f8f8f8;padding:12px;border-radius:8px;font-size:14px;">${args.summary || 'No summary provided'}</p>
          `,
        }),
      });
    } catch (e) {
      console.error('[vteams] Summary email failed:', e);
    }
  }

  return { success: true, message: 'Call summary saved.' };
}

async function sendFallbackNotification(args: any) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;

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
        subject: `V·TEAMS Booking Fallback — ${args.caller_name || 'Unknown'} — MANUAL ACTION`,
        html: `
          <h2 style="color:#dc2626;">Booking System Fallback</h2>
          <p>V·TEAMS was unable to create a calendar event. Please book manually.</p>
          <p><strong>Caller:</strong> ${args.caller_name}</p>
          <p><strong>Phone:</strong> ${args.phone_number}</p>
          <p><strong>Requested Time:</strong> ${args.appointment_date}</p>
          <p><strong>Notes:</strong> ${args.notes || 'None'}</p>
        `,
      }),
    });
  } catch (e) {
    console.error('[vteams] Fallback notification failed:', e);
  }
}
