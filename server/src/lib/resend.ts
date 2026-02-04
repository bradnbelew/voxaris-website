import { Resend } from 'resend';
import { logger } from './logger';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// ============================================================================
// TYPES
// ============================================================================

export interface MedSpaCallSummaryData {
  to: string;
  practiceName?: string;
  visitorName?: string;
  visitorPhone?: string;
  visitorEmail?: string;
  duration: number; // in seconds
  summary: string;
  sentiment?: 'positive' | 'neutral' | 'negative' | string;
  sentimentScore?: number; // 0-100
  bookingRequested: boolean;
  preferredDay?: string;
  preferredTime?: string;
  concerns: string[];
  conversationId: string;
  timestamp: Date;
  dashboardUrl?: string;
}

// ============================================================================
// EMAIL TEMPLATES
// ============================================================================

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs} sec`;
  if (secs === 0) return `${mins} min`;
  return `${mins} min ${secs} sec`;
}

function getSentimentEmoji(sentiment?: string, score?: number): string {
  if (score !== undefined) {
    if (score >= 70) return '🟢';
    if (score >= 40) return '🟡';
    return '🔴';
  }
  if (sentiment === 'positive') return '🟢';
  if (sentiment === 'neutral') return '🟡';
  if (sentiment === 'negative') return '🔴';
  return '⚪';
}

function getSentimentLabel(sentiment?: string, score?: number): string {
  if (score !== undefined) {
    if (score >= 70) return 'Positive';
    if (score >= 40) return 'Neutral';
    return 'Needs Follow-up';
  }
  if (sentiment === 'positive') return 'Positive';
  if (sentiment === 'neutral') return 'Neutral';
  if (sentiment === 'negative') return 'Needs Follow-up';
  return 'Unknown';
}

function generateMedSpaEmailTemplate(data: MedSpaCallSummaryData): string {
  const sentimentEmoji = getSentimentEmoji(data.sentiment, data.sentimentScore);
  const sentimentLabel = getSentimentLabel(data.sentiment, data.sentimentScore);
  const formattedDuration = formatDuration(data.duration);
  const formattedTime = data.timestamp.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/New_York'
  });

  const concernsList = data.concerns.length > 0
    ? data.concerns.map(c => `<li style="margin-bottom: 4px;">${c}</li>`).join('')
    : '<li style="color: #6b7280;">No specific concerns mentioned</li>';

  const bookingSection = data.bookingRequested
    ? `
      <div style="background: #dcfce7; border: 1px solid #86efac; border-radius: 8px; padding: 16px; margin-top: 20px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
          <span style="font-size: 20px;">✅</span>
          <span style="font-weight: 600; color: #166534;">Booking Requested!</span>
        </div>
        ${data.visitorName ? `<p style="margin: 4px 0; color: #15803d;"><strong>Name:</strong> ${data.visitorName}</p>` : ''}
        ${data.visitorPhone ? `<p style="margin: 4px 0; color: #15803d;"><strong>Phone:</strong> ${data.visitorPhone}</p>` : ''}
        ${data.visitorEmail ? `<p style="margin: 4px 0; color: #15803d;"><strong>Email:</strong> ${data.visitorEmail}</p>` : ''}
        ${data.preferredDay ? `<p style="margin: 4px 0; color: #15803d;"><strong>Preferred:</strong> ${data.preferredDay}${data.preferredTime ? ` (${data.preferredTime})` : ''}</p>` : ''}
      </div>
    `
    : `
      <div style="background: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 16px; margin-top: 20px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 20px;">⏳</span>
          <span style="font-weight: 600; color: #92400e;">No Booking Yet</span>
        </div>
        <p style="margin: 8px 0 0 0; color: #a16207; font-size: 14px;">
          Visitor did not book during this session. Consider a follow-up.
        </p>
      </div>
    `;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Video Consultation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">

          <!-- Header with Logo -->
          <tr>
            <td style="background: linear-gradient(135deg, #172554 0%, #1e3a8a 100%); padding: 32px; text-align: center;">
              <!-- Voxaris Logo -->
              <div style="margin-bottom: 16px;">
                <img src="https://voxaris.io/voxaris-logo-white.png" alt="Voxaris" style="height: 32px; width: auto;" onerror="this.style.display='none'"/>
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 600; letter-spacing: -0.5px;">
                New Video Consultation
              </h1>
              <p style="margin: 8px 0 0 0; color: #93c5fd; font-size: 14px;">
                ${formattedTime} EST
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px;">

              <!-- Quick Stats -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td width="33%" style="text-align: center; padding: 16px; background: #f8fafc; border-radius: 8px;">
                    <div style="font-size: 24px; font-weight: 700; color: #172554;">${formattedDuration}</div>
                    <div style="font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Duration</div>
                  </td>
                  <td width="10"></td>
                  <td width="33%" style="text-align: center; padding: 16px; background: #f8fafc; border-radius: 8px;">
                    <div style="font-size: 24px;">${sentimentEmoji}</div>
                    <div style="font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">${sentimentLabel}</div>
                  </td>
                  <td width="10"></td>
                  <td width="33%" style="text-align: center; padding: 16px; background: #f8fafc; border-radius: 8px;">
                    <div style="font-size: 24px; font-weight: 700; color: #172554;">${data.concerns.length}</div>
                    <div style="font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Concerns</div>
                  </td>
                </tr>
              </table>

              <!-- Summary -->
              <div style="margin-bottom: 24px;">
                <h2 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #172554;">
                  📝 AI Summary
                </h2>
                <p style="margin: 0; color: #374151; line-height: 1.6; background: #f8fafc; padding: 16px; border-radius: 8px; border-left: 4px solid #172554;">
                  ${data.summary || 'No summary available for this conversation.'}
                </p>
              </div>

              <!-- Concerns -->
              <div style="margin-bottom: 24px;">
                <h2 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #172554;">
                  💭 Areas of Interest
                </h2>
                <ul style="margin: 0; padding: 0 0 0 20px; color: #374151; line-height: 1.8;">
                  ${concernsList}
                </ul>
              </div>

              <!-- Booking Status -->
              ${bookingSection}

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #172554; padding: 24px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align: center;">
                    <!-- Voxaris Logo in Footer -->
                    <img src="https://voxaris.io/voxaris-logo-white.png" alt="Voxaris" style="height: 24px; width: auto; margin-bottom: 12px;" onerror="this.style.display='none'"/>
                    <p style="margin: 0 0 4px 0; font-size: 11px; color: #94a3b8;">
                      AI-Powered Video Consultations
                    </p>
                    <p style="margin: 0 0 12px 0; font-size: 11px; color: #64748b;">
                      ID: ${data.conversationId}
                    </p>
                    ${data.dashboardUrl ? `
                    <a href="${data.dashboardUrl}" style="display: inline-block; background: #ffffff; color: #172554; padding: 10px 24px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 600;">
                      View Full Details
                    </a>
                    ` : ''}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// ============================================================================
// EMAIL SENDING FUNCTIONS
// ============================================================================

export async function sendMedSpaCallSummary(data: MedSpaCallSummaryData): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    if (!process.env.RESEND_API_KEY) {
      logger.warn('⚠️ RESEND_API_KEY not configured. Email not sent.');
      return { success: false, error: 'RESEND_API_KEY not configured' };
    }

    const subject = data.bookingRequested
      ? `✅ New Booking Request${data.visitorName ? ` from ${data.visitorName}` : ''}`
      : `🎥 New Video Consultation${data.visitorName ? ` - ${data.visitorName}` : ''}`;

    const { data: result, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Voxaris <notifications@voxaris.io>',
      to: data.to,
      subject,
      html: generateMedSpaEmailTemplate(data)
    });

    if (error) {
      logger.error('❌ Failed to send email via Resend:', error);
      return { success: false, error: error.message };
    }

    logger.info(`✅ Email sent successfully: ${result?.id}`);
    return { success: true, messageId: result?.id };

  } catch (error: any) {
    logger.error('❌ Error sending email:', error);
    return { success: false, error: error.message };
  }
}

// ============================================================================
// ROOFING LEAD EMAIL
// ============================================================================

export interface RoofingLeadEmailData {
  to: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  propertyAddress?: string;
  roofIssue?: string;
  stormDamage?: boolean;
  insuranceClaimFiled?: boolean;
  wantsInsuranceHelp?: boolean;
  isHomeowner?: boolean;
  urgencyLevel?: string;
  appointmentScheduled?: boolean;
  appointmentDate?: string;
  officeLocation?: string;
  callOutcome?: string;
  callSummary?: string;
  leadQuality?: string;
  recordingUrl?: string;
  callId: string;
  timestamp: Date;
}

function getLeadQualityEmoji(quality?: string): string {
  if (!quality) return '⚪';
  const q = quality.toLowerCase();
  if (q === 'hot' || q === 'high') return '🔥';
  if (q === 'warm' || q === 'medium') return '🟡';
  if (q === 'cold' || q === 'low') return '🔵';
  return '⚪';
}

function getUrgencyColor(urgency?: string): { bg: string; border: string; text: string } {
  if (!urgency) return { bg: '#f3f4f6', border: '#d1d5db', text: '#374151' };
  const u = urgency.toLowerCase();
  if (u === 'high' || u === 'urgent' || u === 'emergency') {
    return { bg: '#fef2f2', border: '#fecaca', text: '#991b1b' };
  }
  if (u === 'medium' || u === 'normal') {
    return { bg: '#fefce8', border: '#fef08a', text: '#854d0e' };
  }
  return { bg: '#f0fdf4', border: '#bbf7d0', text: '#166534' };
}

function generateRoofingEmailTemplate(data: RoofingLeadEmailData): string {
  const formattedTime = data.timestamp.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/New_York'
  });

  const leadEmoji = getLeadQualityEmoji(data.leadQuality);
  const urgencyColors = getUrgencyColor(data.urgencyLevel);

  const appointmentSection = data.appointmentScheduled
    ? `
      <div style="background: #dcfce7; border: 1px solid #86efac; border-radius: 8px; padding: 16px; margin-top: 20px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <span style="font-size: 20px;">✅</span>
          <span style="font-weight: 600; color: #166534;">Appointment Scheduled!</span>
        </div>
        ${data.appointmentDate ? `<p style="margin: 4px 0; color: #15803d;"><strong>Date:</strong> ${data.appointmentDate}</p>` : ''}
        ${data.officeLocation ? `<p style="margin: 4px 0; color: #15803d;"><strong>Office:</strong> ${data.officeLocation}</p>` : ''}
      </div>
    `
    : `
      <div style="background: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 16px; margin-top: 20px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 20px;">⏳</span>
          <span style="font-weight: 600; color: #92400e;">No Appointment Yet</span>
        </div>
        <p style="margin: 8px 0 0 0; color: #a16207; font-size: 14px;">
          ${data.callOutcome || 'Consider a follow-up call.'}
        </p>
      </div>
    `;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Roofing Lead</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 32px; text-align: center;">
              <div style="font-size: 32px; margin-bottom: 8px;">🏠</div>
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                New Roofing Lead
              </h1>
              <p style="margin: 8px 0 0 0; color: #bfdbfe; font-size: 14px;">
                ${formattedTime} EST
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px;">

              <!-- Customer Info -->
              <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <h2 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #1e40af;">
                  👤 Customer Information
                </h2>
                ${data.customerName ? `<p style="margin: 8px 0; color: #374151;"><strong>Name:</strong> ${data.customerName}</p>` : ''}
                ${data.customerPhone ? `<p style="margin: 8px 0; color: #374151;"><strong>Phone:</strong> <a href="tel:${data.customerPhone}" style="color: #2563eb;">${data.customerPhone}</a></p>` : ''}
                ${data.customerEmail ? `<p style="margin: 8px 0; color: #374151;"><strong>Email:</strong> <a href="mailto:${data.customerEmail}" style="color: #2563eb;">${data.customerEmail}</a></p>` : ''}
                ${data.propertyAddress ? `<p style="margin: 8px 0; color: #374151;"><strong>Address:</strong> ${data.propertyAddress}</p>` : ''}
                ${data.isHomeowner !== undefined ? `<p style="margin: 8px 0; color: #374151;"><strong>Homeowner:</strong> ${data.isHomeowner ? 'Yes' : 'No'}</p>` : ''}
              </div>

              <!-- Roof Details -->
              <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <h2 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #1e40af;">
                  🔧 Roof Details
                </h2>
                ${data.roofIssue ? `<p style="margin: 8px 0; color: #374151;"><strong>Issue:</strong> ${data.roofIssue}</p>` : ''}
                <p style="margin: 8px 0; color: #374151;"><strong>Storm Damage:</strong> ${data.stormDamage ? '⚠️ Yes' : 'No'}</p>
                <p style="margin: 8px 0; color: #374151;"><strong>Insurance Claim Filed:</strong> ${data.insuranceClaimFiled ? 'Yes' : 'No'}</p>
                ${data.wantsInsuranceHelp ? `<p style="margin: 8px 0; color: #374151;"><strong>Wants Insurance Help:</strong> ✅ Yes</p>` : ''}
              </div>

              <!-- Lead Quality -->
              <div style="background: ${urgencyColors.bg}; border: 1px solid ${urgencyColors.border}; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <h2 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: ${urgencyColors.text};">
                  📊 Lead Quality
                </h2>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="50%">
                      <p style="margin: 4px 0; color: ${urgencyColors.text};"><strong>Quality:</strong> ${leadEmoji} ${data.leadQuality || 'Unknown'}</p>
                    </td>
                    <td width="50%">
                      <p style="margin: 4px 0; color: ${urgencyColors.text};"><strong>Urgency:</strong> ${data.urgencyLevel || 'Normal'}</p>
                    </td>
                  </tr>
                </table>
                ${data.callOutcome ? `<p style="margin: 12px 0 0 0; color: ${urgencyColors.text};"><strong>Outcome:</strong> ${data.callOutcome}</p>` : ''}
              </div>

              <!-- Call Summary -->
              ${data.callSummary ? `
              <div style="margin-bottom: 24px;">
                <h2 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #1e40af;">
                  📝 Call Summary
                </h2>
                <p style="margin: 0; color: #374151; line-height: 1.6; background: #f8fafc; padding: 16px; border-radius: 8px; border-left: 4px solid #1e40af;">
                  ${data.callSummary}
                </p>
              </div>
              ` : ''}

              <!-- Appointment Status -->
              ${appointmentSection}

              <!-- Recording Link -->
              ${data.recordingUrl ? `
              <div style="margin-top: 24px; text-align: center;">
                <a href="${data.recordingUrl}" style="display: inline-block; background: #1e40af; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                  🎧 Listen to Recording
                </a>
              </div>
              ` : ''}

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #1e3a5f; padding: 24px 32px; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #93c5fd; font-weight: 600;">
                Roofing Pros USA
              </p>
              <p style="margin: 0; font-size: 11px; color: #64748b;">
                Call ID: ${data.callId}
              </p>
              <p style="margin: 8px 0 0 0; font-size: 11px; color: #64748b;">
                Powered by Voxaris AI
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export async function sendRoofingLeadEmail(data: RoofingLeadEmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    if (!process.env.RESEND_API_KEY) {
      logger.warn('⚠️ RESEND_API_KEY not configured. Email not sent.');
      return { success: false, error: 'RESEND_API_KEY not configured' };
    }

    const appointmentEmoji = data.appointmentScheduled ? '✅' : '📞';
    const qualityEmoji = getLeadQualityEmoji(data.leadQuality);

    const subject = `${appointmentEmoji} ${qualityEmoji} New Lead${data.customerName ? `: ${data.customerName}` : ''}${data.appointmentScheduled ? ' - APPOINTMENT BOOKED' : ''}`;

    const { data: result, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Roofing Pros USA <notifications@voxaris.io>',
      to: data.to,
      subject,
      html: generateRoofingEmailTemplate(data)
    });

    if (error) {
      logger.error('❌ Failed to send roofing lead email:', error);
      return { success: false, error: error.message };
    }

    logger.info(`✅ Roofing lead email sent: ${result?.id}`);
    return { success: true, messageId: result?.id };

  } catch (error: any) {
    logger.error('❌ Error sending roofing lead email:', error);
    return { success: false, error: error.message };
  }
}

// Export for testing
export { generateMedSpaEmailTemplate, generateRoofingEmailTemplate };
