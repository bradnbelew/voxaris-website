/**
 * Slack Alerting for Roofing Pros USA
 * Sends real-time alerts for critical events and errors
 */

import { logger } from './logger';

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

type AlertLevel = 'critical' | 'warning' | 'info' | 'success';

interface SlackAlert {
  level: AlertLevel;
  title: string;
  message: string;
  fields?: { name: string; value: string; inline?: boolean }[];
  error?: Error;
}

const LEVEL_CONFIG = {
  critical: { emoji: '🔴', color: '#dc2626' },
  warning: { emoji: '🟠', color: '#f59e0b' },
  info: { emoji: '🔵', color: '#3b82f6' },
  success: { emoji: '🟢', color: '#10b981' },
};

/**
 * Send alert to Slack
 */
async function sendSlackAlert(alert: SlackAlert): Promise<void> {
  if (!SLACK_WEBHOOK_URL) {
    logger.warn('SLACK_WEBHOOK_URL not configured - alert not sent', { alert });
    return;
  }

  const config = LEVEL_CONFIG[alert.level];

  const payload = {
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `${config.emoji} ${alert.title}`,
          emoji: true,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: alert.message,
        },
      },
    ],
    attachments: [
      {
        color: config.color,
        fields: alert.fields?.map(f => ({
          title: f.name,
          value: f.value,
          short: f.inline ?? true,
        })) || [],
        footer: 'Roofing Pros USA AI Platform',
        ts: Math.floor(Date.now() / 1000).toString(),
      },
    ],
  };

  // Add error details if present
  if (alert.error) {
    payload.blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `\`\`\`${alert.error.message}\n${alert.error.stack?.slice(0, 500) || ''}\`\`\``,
      },
    });
  }

  try {
    const response = await fetch(SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      logger.error('Failed to send Slack alert', { status: response.status });
    }
  } catch (error) {
    logger.error('Error sending Slack alert', { error });
  }
}

// ============================================
// ROOFING-SPECIFIC ALERT FUNCTIONS
// ============================================

/**
 * Alert: Webhook processing failed
 */
export async function alertWebhookFailed(source: string, error: Error, context?: object): Promise<void> {
  await sendSlackAlert({
    level: 'critical',
    title: 'Webhook Processing Failed',
    message: `Failed to process ${source} webhook`,
    fields: [
      { name: 'Source', value: source },
      { name: 'Time', value: new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }) },
      ...(context ? [{ name: 'Context', value: JSON.stringify(context).slice(0, 200) }] : []),
    ],
    error,
  });
}

/**
 * Alert: CRM sync failed
 */
export async function alertCRMSyncFailed(phone: string, error: Error): Promise<void> {
  await sendSlackAlert({
    level: 'critical',
    title: 'CRM Sync Failed',
    message: `Failed to sync lead to JobNimbus`,
    fields: [
      { name: 'Phone', value: phone },
      { name: 'Time', value: new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }) },
    ],
    error,
  });
}

/**
 * Alert: Outbound call creation failed
 */
export async function alertCallCreationFailed(phone: string, error: Error): Promise<void> {
  await sendSlackAlert({
    level: 'critical',
    title: 'Outbound Call Failed',
    message: `Failed to create outbound call`,
    fields: [
      { name: 'Phone', value: phone },
      { name: 'Time', value: new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }) },
    ],
    error,
  });
}

/**
 * Alert: Follow-up sequence failed
 */
export async function alertFollowupFailed(phone: string, attempt: number, error: Error): Promise<void> {
  await sendSlackAlert({
    level: 'warning',
    title: 'Follow-up Sequence Failed',
    message: `Follow-up attempt ${attempt} failed`,
    fields: [
      { name: 'Phone', value: phone },
      { name: 'Attempt', value: `${attempt}/6` },
      { name: 'Time', value: new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }) },
    ],
    error,
  });
}

/**
 * Alert: Memory storage failed
 */
export async function alertMemoryFailed(phone: string, error: Error): Promise<void> {
  await sendSlackAlert({
    level: 'warning',
    title: 'Memory Storage Failed',
    message: `Failed to store/retrieve memory for caller`,
    fields: [
      { name: 'Phone', value: phone },
    ],
    error,
  });
}

/**
 * Alert: New hot lead (celebration!)
 */
export async function alertHotLead(name: string, phone: string, issue: string): Promise<void> {
  await sendSlackAlert({
    level: 'success',
    title: '🔥 New Hot Lead!',
    message: `A hot lead just came in!`,
    fields: [
      { name: 'Name', value: name },
      { name: 'Phone', value: phone },
      { name: 'Issue', value: issue },
      { name: 'Time', value: new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }) },
    ],
  });
}

/**
 * Alert: Appointment booked (celebration!)
 */
export async function alertAppointmentBooked(
  name: string,
  phone: string,
  date: string,
  office: string
): Promise<void> {
  await sendSlackAlert({
    level: 'success',
    title: '📅 Appointment Booked!',
    message: `New appointment scheduled via AI!`,
    fields: [
      { name: 'Customer', value: name },
      { name: 'Phone', value: phone },
      { name: 'Date', value: date },
      { name: 'Office', value: office },
    ],
  });
}

/**
 * Alert: System health issue
 */
export async function alertHealthIssue(service: string, status: string): Promise<void> {
  await sendSlackAlert({
    level: 'critical',
    title: 'System Health Issue',
    message: `A critical service is down or degraded`,
    fields: [
      { name: 'Service', value: service },
      { name: 'Status', value: status },
      { name: 'Time', value: new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }) },
    ],
  });
}

/**
 * Alert: Daily summary
 */
export async function alertDailySummary(stats: {
  totalLeads: number;
  hotLeads: number;
  appointments: number;
  conversionRate: number;
}): Promise<void> {
  await sendSlackAlert({
    level: 'info',
    title: '📊 Daily Summary',
    message: `Here's your daily performance summary`,
    fields: [
      { name: 'Total Leads', value: stats.totalLeads.toString() },
      { name: 'Hot Leads', value: stats.hotLeads.toString() },
      { name: 'Appointments', value: stats.appointments.toString() },
      { name: 'Conversion Rate', value: `${stats.conversionRate.toFixed(1)}%` },
    ],
  });
}

export default {
  sendSlackAlert,
  alertWebhookFailed,
  alertCRMSyncFailed,
  alertCallCreationFailed,
  alertFollowupFailed,
  alertMemoryFailed,
  alertHotLead,
  alertAppointmentBooked,
  alertHealthIssue,
  alertDailySummary,
};
