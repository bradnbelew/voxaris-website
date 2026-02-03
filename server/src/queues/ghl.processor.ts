import { Job, Processor } from 'bullmq';
import { ghl } from '../lib/ghl';
import { logger } from '../lib/logger';
import { GHLSyncJob } from './index';

/**
 * GHL Sync Processor
 *
 * Handles all GoHighLevel CRM operations:
 * - update_contact: Update contact fields and tags
 * - add_note: Add activity notes to contact
 * - send_sms: Send SMS via GHL
 *
 * This processor has extra retries and backoff because GHL has strict rate limits.
 */
export const ghlProcessor: Processor<GHLSyncJob> = async (job: Job<GHLSyncJob>) => {
  const { type, contactId, data, source } = job.data;
  const startTime = Date.now();

  logger.info(`🔄 Processing GHL job: ${type}`, {
    jobId: job.id,
    contactId,
    source,
    attempt: job.attemptsMade + 1
  });

  try {
    switch (type) {
      case 'update_contact':
        await processUpdateContact(contactId, data);
        break;

      case 'add_note':
        await processAddNote(contactId, data);
        break;

      case 'send_sms':
        await processSendSMS(contactId, data);
        break;

      default:
        logger.warn(`Unknown GHL job type: ${type}`);
    }

    const duration = Date.now() - startTime;
    logger.info(`✅ GHL job completed in ${duration}ms`, {
      jobId: job.id,
      type,
      contactId
    });

  } catch (error: any) {
    // Check if it's a rate limit error (429) or server error (5xx)
    const statusCode = error.response?.status;

    if (statusCode === 429) {
      logger.warn(`⏳ GHL rate limited. Will retry job: ${job.id}`);
      // BullMQ will automatically retry with exponential backoff
      throw error;
    }

    if (statusCode >= 500) {
      logger.warn(`🔥 GHL server error (${statusCode}). Will retry job: ${job.id}`);
      throw error;
    }

    // For client errors (4xx), log and don't retry
    if (statusCode >= 400 && statusCode < 500) {
      logger.error(`❌ GHL client error (${statusCode}): ${error.message}`, {
        jobId: job.id,
        contactId,
        response: error.response?.data
      });
      // Don't throw - let job complete without retry for client errors
      return;
    }

    logger.error(`❌ GHL job failed: ${error.message}`, {
      jobId: job.id,
      error: error.stack
    });
    throw error;
  }
};

/**
 * Update contact fields and/or tags
 */
async function processUpdateContact(
  contactId: string,
  data: { customFields?: Record<string, any>; tags?: string[] }
): Promise<void> {
  const updatePayload: any = { id: contactId };

  if (data.customFields) {
    updatePayload.customFields = data.customFields;
  }

  if (data.tags) {
    updatePayload.tags = data.tags;
  }

  const result = await ghl.createOrUpdateContact(updatePayload);

  if (!result) {
    throw new Error(`Failed to update contact: ${contactId}`);
  }

  logger.info(`✅ Contact updated: ${contactId}`);
}

/**
 * Add a note to contact
 */
async function processAddNote(
  contactId: string,
  data: { content: string }
): Promise<void> {
  await ghl.addNote(contactId, data.content);
  logger.info(`✅ Note added to contact: ${contactId}`);
}

/**
 * Send SMS via GHL
 */
async function processSendSMS(
  contactId: string,
  data: { message: string }
): Promise<void> {
  await ghl.sendSMS(contactId, data.message);
  logger.info(`✅ SMS sent to contact: ${contactId}`);
}
