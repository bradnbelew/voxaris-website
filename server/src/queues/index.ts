import { Queue, QueueOptions } from 'bullmq';
import { getQueueConnection } from '../lib/redis';
import { logger } from '../lib/logger';

// Queue configuration with rate limiting and retry policies
const defaultJobOptions = {
  attempts: 3,
  backoff: {
    type: 'exponential' as const,
    delay: 1000, // Start with 1s, then 2s, 4s
  },
  removeOnComplete: {
    count: 1000, // Keep last 1000 completed jobs for debugging
    age: 24 * 3600, // Or jobs older than 24 hours
  },
  removeOnFail: {
    count: 5000, // Keep more failed jobs for analysis
    age: 7 * 24 * 3600, // Keep for a week
  },
};

// Queue names as constants to avoid typos
export const QUEUE_NAMES = {
  TAVUS_WEBHOOKS: 'tavus-webhooks',
  RETELL_WEBHOOKS: 'retell-webhooks',
  GHL_SYNC: 'ghl-sync',
} as const;

// Initialize queues only if Redis is available
let tavusQueue: Queue | null = null;
let retellQueue: Queue | null = null;
let ghlQueue: Queue | null = null;

export const initializeQueues = () => {
  const connection = getQueueConnection();

  if (!connection) {
    logger.warn('⚠️ Redis not available. Running in synchronous mode (no queues).');
    return { tavusQueue: null, retellQueue: null, ghlQueue: null };
  }

  const queueOptions: QueueOptions = {
    connection,
    defaultJobOptions,
  };

  tavusQueue = new Queue(QUEUE_NAMES.TAVUS_WEBHOOKS, queueOptions);
  retellQueue = new Queue(QUEUE_NAMES.RETELL_WEBHOOKS, queueOptions);
  ghlQueue = new Queue(QUEUE_NAMES.GHL_SYNC, {
    ...queueOptions,
    defaultJobOptions: {
      ...defaultJobOptions,
      attempts: 5, // GHL gets more retries due to rate limits
      backoff: {
        type: 'exponential' as const,
        delay: 2000, // Start with 2s delay for GHL
      },
    },
  });

  logger.info('✅ BullMQ Queues Initialized');

  return { tavusQueue, retellQueue, ghlQueue };
};

// Getters for accessing queues
export const getQueues = () => {
  if (!tavusQueue || !retellQueue || !ghlQueue) {
    return initializeQueues();
  }
  return { tavusQueue, retellQueue, ghlQueue };
};

// Job types for type safety
export interface TavusWebhookJob {
  type: 'conversation.ended' | 'perception_analysis' | 'transcription_ready';
  event: any;
  receivedAt: string;
  queryParams?: Record<string, string>;
}

export interface RetellWebhookJob {
  type: 'call_analyzed';
  event: any;
  receivedAt: string;
}

export interface GHLSyncJob {
  type: 'update_contact' | 'add_note' | 'send_sms';
  contactId: string;
  data: any;
  source: 'tavus' | 'retell';
}

// Helper functions to add jobs with proper typing
export const addTavusJob = async (job: TavusWebhookJob) => {
  const { tavusQueue } = getQueues();
  if (!tavusQueue) {
    logger.warn('⚠️ Tavus queue not available. Job will be processed synchronously.');
    return null;
  }

  return tavusQueue.add(job.type, job, {
    jobId: `tavus-${job.event.conversation_id || Date.now()}`,
  });
};

export const addRetellJob = async (job: RetellWebhookJob) => {
  const { retellQueue } = getQueues();
  if (!retellQueue) {
    logger.warn('⚠️ Retell queue not available. Job will be processed synchronously.');
    return null;
  }

  return retellQueue.add(job.type, job, {
    jobId: `retell-${job.event.call_id || Date.now()}`,
  });
};

export const addGHLJob = async (job: GHLSyncJob) => {
  const { ghlQueue } = getQueues();
  if (!ghlQueue) {
    logger.warn('⚠️ GHL queue not available. Job will be processed synchronously.');
    return null;
  }

  // Use lower priority for non-critical operations like notes
  const priority = job.type === 'send_sms' ? 1 : job.type === 'update_contact' ? 2 : 3;

  return ghlQueue.add(job.type, job, {
    priority,
    jobId: `ghl-${job.type}-${job.contactId}-${Date.now()}`,
  });
};

// Graceful shutdown
export const closeQueues = async () => {
  const queues = [tavusQueue, retellQueue, ghlQueue].filter(Boolean) as Queue[];
  await Promise.all(queues.map(q => q.close()));
  logger.info('✅ All queues closed');
};
