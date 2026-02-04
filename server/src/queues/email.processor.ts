import { Job, Processor } from 'bullmq';
import { sendMedSpaCallSummary, MedSpaCallSummaryData } from '../lib/resend';
import { logger } from '../lib/logger';
import { EmailJob } from './index';

/**
 * Email Processor
 *
 * Handles email sending jobs:
 * - medspa_call_summary: Post-call summary for med spa owners
 * - booking_confirmation: Confirmation when booking is made
 * - follow_up: Follow-up reminders
 */
export const emailProcessor: Processor<EmailJob> = async (job: Job<EmailJob>) => {
  const { type, to, data, source } = job.data;
  const startTime = Date.now();

  logger.info(`📧 Processing email job: ${type}`, {
    jobId: job.id,
    to,
    source
  });

  try {
    switch (type) {
      case 'medspa_call_summary':
        await processMedSpaCallSummary(to, data);
        break;

      case 'booking_confirmation':
        // Future: Send booking confirmation to visitor
        logger.info('📧 Booking confirmation (not implemented yet)');
        break;

      case 'follow_up':
        // Future: Send follow-up email
        logger.info('📧 Follow-up email (not implemented yet)');
        break;

      default:
        logger.warn(`Unknown email job type: ${type}`);
    }

    const duration = Date.now() - startTime;
    logger.info(`✅ Email job completed in ${duration}ms`, { jobId: job.id });

  } catch (error: any) {
    logger.error(`❌ Email job failed: ${error.message}`, {
      jobId: job.id,
      error: error.stack
    });
    throw error; // Rethrow to trigger retry
  }
};

/**
 * Process med spa call summary email
 */
async function processMedSpaCallSummary(to: string, data: any): Promise<void> {
  const emailData: MedSpaCallSummaryData = {
    to,
    practiceName: data.practiceName,
    visitorName: data.visitorName,
    visitorPhone: data.visitorPhone,
    visitorEmail: data.visitorEmail,
    duration: data.duration || 0,
    summary: data.summary || 'No summary available.',
    sentiment: data.sentiment,
    sentimentScore: data.sentimentScore,
    bookingRequested: data.bookingRequested || false,
    preferredDay: data.preferredDay,
    preferredTime: data.preferredTime,
    concerns: data.concerns || [],
    conversationId: data.conversationId,
    timestamp: new Date(data.timestamp || Date.now()),
    dashboardUrl: data.dashboardUrl
  };

  const result = await sendMedSpaCallSummary(emailData);

  if (!result.success) {
    throw new Error(`Failed to send email: ${result.error}`);
  }

  logger.info(`✅ Med spa call summary email sent to ${to}`, {
    messageId: result.messageId,
    conversationId: data.conversationId
  });
}
