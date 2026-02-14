/**
 * Queue Definitions for Roofing Pros USA
 *
 * Three queues:
 * 1. retell-webhooks - Process Retell call events
 * 2. tavus-webhooks - Process Tavus video session events
 * 3. ghl-sync - Sync data to GoHighLevel CRM
 */

import { Queue, Job } from 'bullmq';
import { getQueueConnection } from '../lib/redis';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface RetellWebhookJobData {
  event_type: "call_started" | "call_ended" | "call_analyzed";
  call_id: string;
  agent_id?: string;
  from_number?: string;
  to_number?: string;
  direction?: "inbound" | "outbound";
  duration_ms?: number;
  recording_url?: string;
  transcript?: string;
  call_analysis?: Record<string, unknown>;
  custom_analysis_data?: Record<string, unknown>;
  received_at: string;
}

export interface TavusWebhookJobData {
  event_type: "conversation.started" | "conversation.ended" | "conversation.tool_call";
  conversation_id: string;
  persona_id?: string;
  trainee_name?: string;
  topic?: string;
  duration_ms?: number;
  transcript?: string;
  received_at: string;
}

export interface GHLSyncJobData {
  action: "create_contact_and_appointment" | "create_contact" | "flag_for_review" | "update_pipeline";
  contact_data?: {
    name?: string;
    first_name?: string;
    last_name?: string;
    phone: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  appointment_data?: {
    date: string;
    time: "morning" | "afternoon";
    address?: string;
  };
  call_data?: {
    call_id: string;
    call_summary?: string;
    recording_url?: string;
    sentiment?: string;
  };
  lead_id?: string;
  pipeline_stage?: string;
  tags?: string[];
  received_at: string;
}

// ==========================================
// QUEUE NAMES
// ==========================================

export const QUEUE_NAMES = {
  RETELL_WEBHOOKS: "retell-webhooks",
  TAVUS_WEBHOOKS: "tavus-webhooks",
  GHL_SYNC: "ghl-sync",
} as const;

// ==========================================
// QUEUE INSTANCES (BullMQ)
// ==========================================

let retellQueue: Queue | null = null;
let tavusQueue: Queue | null = null;
let ghlQueue: Queue | null = null;

// Default job options per playbook spec
const defaultJobOptions = {
  attempts: 3,
  backoff: {
    type: 'exponential' as const,
    delay: 1000,
  },
  removeOnComplete: {
    count: 1000,
    age: 24 * 3600,
  },
  removeOnFail: {
    count: 5000,
    age: 7 * 24 * 3600,
  },
};

// GHL gets more retries due to rate limits
const ghlJobOptions = {
  ...defaultJobOptions,
  attempts: 5,
  backoff: {
    type: 'exponential' as const,
    delay: 2000,
  },
};

/**
 * Initialize all queues
 */
export function initializeQueues() {
  const connection = getQueueConnection();

  if (!connection) {
    console.warn('⚠️ Redis not available. Running in synchronous mode (no queues).');
    return { retellQueue: null, tavusQueue: null, ghlQueue: null };
  }

  retellQueue = new Queue(QUEUE_NAMES.RETELL_WEBHOOKS, {
    connection,
    defaultJobOptions,
  });

  tavusQueue = new Queue(QUEUE_NAMES.TAVUS_WEBHOOKS, {
    connection,
    defaultJobOptions,
  });

  ghlQueue = new Queue(QUEUE_NAMES.GHL_SYNC, {
    connection,
    defaultJobOptions: ghlJobOptions,
  });

  console.log('✅ BullMQ Queues Initialized (retell, tavus, ghl)');

  return { retellQueue, tavusQueue, ghlQueue };
}

/**
 * Get queue instances (initializes if needed)
 */
export function getQueues() {
  if (!retellQueue || !tavusQueue || !ghlQueue) {
    return initializeQueues();
  }
  return { retellQueue, tavusQueue, ghlQueue };
}

// ==========================================
// QUEUE OPERATIONS
// ==========================================

/**
 * Add a Retell webhook job to the queue
 */
export async function addRetellJob(
  callId: string,
  eventType: string,
  data: RetellWebhookJobData
): Promise<Job | null> {
  const { retellQueue } = getQueues();
  if (!retellQueue) {
    console.warn('⚠️ Retell queue not available. Processing synchronously.');
    return null;
  }

  const jobId = `retell-${callId}-${eventType}-${Date.now()}`;
  const job = await retellQueue.add(eventType, data, { jobId });
  console.log(`📥 Queued Retell job: ${jobId}`);
  return job;
}

/**
 * Add a Tavus webhook job to the queue
 */
export async function addTavusJob(
  conversationId: string,
  eventType: string,
  data: TavusWebhookJobData
): Promise<Job | null> {
  const { tavusQueue } = getQueues();
  if (!tavusQueue) {
    console.warn('⚠️ Tavus queue not available. Processing synchronously.');
    return null;
  }

  const jobId = `tavus-${conversationId}-${eventType}-${Date.now()}`;
  const job = await tavusQueue.add(eventType, data, { jobId });
  console.log(`📥 Queued Tavus job: ${jobId}`);
  return job;
}

/**
 * Add a GHL sync job to the queue
 */
export async function addGHLSyncJob(
  action: GHLSyncJobData["action"],
  data: GHLSyncJobData
): Promise<Job | null> {
  const { ghlQueue } = getQueues();
  if (!ghlQueue) {
    console.warn('⚠️ GHL queue not available. Sync will not happen.');
    return null;
  }

  // Priority: send_sms = 1, update_contact = 2, others = 3
  const priorityMap: Record<string, number> = {
    create_contact_and_appointment: 1,
    create_contact: 2,
    update_pipeline: 3,
    flag_for_review: 4,
  };
  const priority = priorityMap[action] || 3;

  const jobId = `ghl-${action}-${Date.now()}`;
  const job = await ghlQueue.add(action, data, { jobId, priority });
  console.log(`📥 Queued GHL sync job: ${jobId}`);
  return job;
}

/**
 * Get queue statistics for monitoring
 */
export async function getAllQueueStats(): Promise<{
  retell: { waiting: number; active: number; completed: number; failed: number };
  tavus: { waiting: number; active: number; completed: number; failed: number };
  ghl: { waiting: number; active: number; completed: number; failed: number };
}> {
  const { retellQueue, tavusQueue, ghlQueue } = getQueues();

  const getStats = async (queue: Queue | null) => {
    if (!queue) return { waiting: 0, active: 0, completed: 0, failed: 0 };
    const [waiting, active, completed, failed] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
    ]);
    return { waiting, active, completed, failed };
  };

  const [retell, tavus, ghl] = await Promise.all([
    getStats(retellQueue),
    getStats(tavusQueue),
    getStats(ghlQueue),
  ]);

  return { retell, tavus, ghl };
}

/**
 * Get a specific job by ID
 */
export async function getJob(queueName: string, jobId: string): Promise<Job | null> {
  const { retellQueue, tavusQueue, ghlQueue } = getQueues();

  const queueMap: Record<string, Queue | null> = {
    [QUEUE_NAMES.RETELL_WEBHOOKS]: retellQueue,
    [QUEUE_NAMES.TAVUS_WEBHOOKS]: tavusQueue,
    [QUEUE_NAMES.GHL_SYNC]: ghlQueue,
  };

  const queue = queueMap[queueName];
  if (!queue) return null;

  const job = await queue.getJob(jobId);
  return job ?? null;
}

/**
 * Close all queues gracefully
 */
export async function closeQueues(): Promise<void> {
  const queues = [retellQueue, tavusQueue, ghlQueue].filter(Boolean) as Queue[];
  await Promise.all(queues.map(q => q.close()));
  retellQueue = null;
  tavusQueue = null;
  ghlQueue = null;
  console.log('✅ All queues closed');
}
