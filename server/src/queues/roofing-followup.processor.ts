/**
 * Roofing Follow-up Queue Processor
 *
 * Handles automated follow-up call cadence:
 * - Attempt 1: Immediate (after form submission)
 * - Attempt 2: 15 minutes later
 * - Attempt 3: 2 hours later
 * - Attempt 4: Next day
 * - Attempt 5: Day 3
 * - Attempt 6: Day 7
 */

import { Queue, Worker, Job, QueueOptions } from 'bullmq';
import { getQueueConnection } from '../lib/redis';
import { logger } from '../lib/logger';
import { retell } from '../lib/retell';
import { mem0 } from '../lib/mem0';
import { supabase } from '../lib/supabase';

export const ROOFING_FOLLOWUP_QUEUE = 'roofing-followup';

// Follow-up cadence configuration (in milliseconds)
export const FOLLOWUP_CADENCE = {
  ATTEMPT_1: 0,                          // Immediate
  ATTEMPT_2: 15 * 60 * 1000,             // 15 minutes
  ATTEMPT_3: 2 * 60 * 60 * 1000,         // 2 hours
  ATTEMPT_4: 24 * 60 * 60 * 1000,        // 1 day (24 hours)
  ATTEMPT_5: 3 * 24 * 60 * 60 * 1000,    // 3 days
  ATTEMPT_6: 7 * 24 * 60 * 60 * 1000,    // 7 days
};

export interface FollowupJob {
  phone: string;
  customerName: string;
  email?: string;
  address?: string;
  roofIssue?: string;
  source: string;
  attemptNumber: number;
  maxAttempts: number;
  originalLeadId?: string;
  previousCallIds: string[];
  lastCallStatus?: string;
  memoryContext?: string;
}

let followupQueue: Queue | null = null;
let followupWorker: Worker | null = null;

/**
 * Initialize the follow-up queue and worker
 */
export const initializeFollowupQueue = () => {
  const connection = getQueueConnection();

  if (!connection) {
    logger.warn('⚠️ Redis not available. Follow-up queue will not be initialized.');
    return null;
  }

  const queueOptions: QueueOptions = {
    connection,
    defaultJobOptions: {
      attempts: 1, // We handle our own retry logic via scheduling
      removeOnComplete: {
        count: 500,
        age: 7 * 24 * 3600, // Keep for a week
      },
      removeOnFail: {
        count: 1000,
        age: 30 * 24 * 3600, // Keep failed for a month
      },
    },
  };

  followupQueue = new Queue(ROOFING_FOLLOWUP_QUEUE, queueOptions);

  // Initialize worker
  followupWorker = new Worker(
    ROOFING_FOLLOWUP_QUEUE,
    async (job: Job<FollowupJob>) => {
      return processFollowupJob(job);
    },
    {
      connection,
      concurrency: 5, // Process 5 follow-up calls at a time
      limiter: {
        max: 10,
        duration: 60000, // Max 10 calls per minute
      },
    }
  );

  followupWorker.on('completed', (job, result) => {
    logger.info(`✅ Follow-up job completed: ${job.id}`, result);
  });

  followupWorker.on('failed', (job, err) => {
    logger.error(`❌ Follow-up job failed: ${job?.id}`, err.message);
  });

  logger.info('✅ Roofing Follow-up Queue Initialized');

  return followupQueue;
};

/**
 * Process a follow-up job
 */
async function processFollowupJob(job: Job<FollowupJob>): Promise<{
  success: boolean;
  callId?: string;
  nextAttemptScheduled?: boolean;
  error?: string;
}> {
  const data = job.data;

  logger.info(`📞 Processing follow-up attempt ${data.attemptNumber}/${data.maxAttempts} for ${data.phone}`);

  try {
    // Check if customer has already scheduled an appointment
    const shouldSkip = await checkIfShouldSkipFollowup(data);
    if (shouldSkip.skip) {
      logger.info(`⏭️ Skipping follow-up for ${data.phone}: ${shouldSkip.reason}`);
      return { success: true, nextAttemptScheduled: false };
    }

    // Get memory context if not already provided
    let memoryContext = data.memoryContext || '';
    if (!memoryContext) {
      const memories = await mem0.getByPhone(data.phone);
      if (memories.success && memories.memories?.length) {
        memoryContext = mem0.formatMemoriesForAgent(memories.memories);
      }
    }

    // Make the outbound call
    const callResult = await retell.createOutboundCall({
      fromNumber: process.env.ROOFING_OUTBOUND_PHONE || '+14072891565',
      toNumber: data.phone,
      agentId: process.env.ROOFING_OUTBOUND_AGENT_ID || process.env.ROOFING_RETELL_AGENT_ID || '',
      dynamicVariables: {
        customer_name: data.customerName,
        follow_up_attempt: String(data.attemptNumber),
        memory_context: memoryContext,
        property_address: data.address || '',
        roof_issue: data.roofIssue || ''
      },
      metadata: {
        source: data.source,
        attemptNumber: data.attemptNumber,
        originalLeadId: data.originalLeadId,
        isFollowUp: true
      }
    });

    if (callResult.success && callResult.callId) {
      // Track this call attempt
      const updatedCallIds = [...data.previousCallIds, callResult.callId];

      // Log to Supabase
      await logFollowupAttempt({
        phone: data.phone,
        callId: callResult.callId,
        attemptNumber: data.attemptNumber,
        status: 'initiated',
        originalLeadId: data.originalLeadId
      });

      // Schedule next follow-up if not at max attempts
      if (data.attemptNumber < data.maxAttempts) {
        const nextScheduled = await scheduleNextFollowup({
          ...data,
          attemptNumber: data.attemptNumber + 1,
          previousCallIds: updatedCallIds,
          lastCallStatus: 'pending'
        });

        return {
          success: true,
          callId: callResult.callId,
          nextAttemptScheduled: nextScheduled
        };
      }

      return { success: true, callId: callResult.callId, nextAttemptScheduled: false };
    }

    // Call failed to initiate
    logger.error(`❌ Failed to initiate follow-up call: ${callResult.error}`);

    // Still schedule next attempt
    if (data.attemptNumber < data.maxAttempts) {
      await scheduleNextFollowup({
        ...data,
        attemptNumber: data.attemptNumber + 1,
        lastCallStatus: 'failed_to_initiate'
      });
    }

    return { success: false, error: callResult.error, nextAttemptScheduled: true };

  } catch (error: any) {
    logger.error(`❌ Follow-up processing error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Check if we should skip the follow-up (customer already scheduled, opted out, etc.)
 */
async function checkIfShouldSkipFollowup(data: FollowupJob): Promise<{
  skip: boolean;
  reason?: string;
}> {
  try {
    // Check if there's a recent lead with an appointment scheduled
    const { data: recentLeads } = await supabase
      .from('roofing_leads')
      .select('appointment_scheduled, call_outcome')
      .eq('customer_phone', data.phone)
      .order('created_at', { ascending: false })
      .limit(1);

    if (recentLeads && recentLeads.length > 0) {
      const lead = recentLeads[0];

      if (lead.appointment_scheduled) {
        return { skip: true, reason: 'Appointment already scheduled' };
      }

      if (lead.call_outcome === 'not_interested' || lead.call_outcome === 'do_not_call') {
        return { skip: true, reason: 'Customer opted out' };
      }
    }

    return { skip: false };

  } catch (error: any) {
    logger.warn(`⚠️ Error checking follow-up skip status: ${error.message}`);
    return { skip: false }; // Continue with follow-up if check fails
  }
}

/**
 * Schedule the next follow-up attempt
 */
async function scheduleNextFollowup(data: FollowupJob): Promise<boolean> {
  if (!followupQueue) {
    logger.warn('⚠️ Follow-up queue not available');
    return false;
  }

  const delayMap: Record<number, number> = {
    2: FOLLOWUP_CADENCE.ATTEMPT_2,
    3: FOLLOWUP_CADENCE.ATTEMPT_3,
    4: FOLLOWUP_CADENCE.ATTEMPT_4,
    5: FOLLOWUP_CADENCE.ATTEMPT_5,
    6: FOLLOWUP_CADENCE.ATTEMPT_6,
  };

  const delay = delayMap[data.attemptNumber] || FOLLOWUP_CADENCE.ATTEMPT_2;

  try {
    await followupQueue.add(
      `followup-${data.attemptNumber}`,
      data,
      {
        delay,
        jobId: `followup-${data.phone}-attempt-${data.attemptNumber}-${Date.now()}`,
        priority: data.attemptNumber, // Earlier attempts have higher priority
      }
    );

    logger.info(`📅 Scheduled follow-up attempt ${data.attemptNumber} for ${data.phone} in ${delay / 60000} minutes`);
    return true;

  } catch (error: any) {
    logger.error(`❌ Failed to schedule follow-up: ${error.message}`);
    return false;
  }
}

/**
 * Log follow-up attempt to database
 */
async function logFollowupAttempt(params: {
  phone: string;
  callId: string;
  attemptNumber: number;
  status: string;
  originalLeadId?: string;
}): Promise<void> {
  try {
    await supabase.from('roofing_followup_attempts').insert({
      phone: params.phone,
      call_id: params.callId,
      attempt_number: params.attemptNumber,
      status: params.status,
      original_lead_id: params.originalLeadId,
      created_at: new Date().toISOString()
    });
  } catch (error: any) {
    // Table might not exist yet, just log
    logger.warn(`⚠️ Could not log follow-up attempt: ${error.message}`);
  }
}

/**
 * Start the follow-up sequence for a new lead
 */
export async function startFollowupSequence(params: {
  phone: string;
  customerName: string;
  email?: string;
  address?: string;
  roofIssue?: string;
  source: string;
  leadId?: string;
}): Promise<{ success: boolean; error?: string }> {
  if (!followupQueue) {
    const initialized = initializeFollowupQueue();
    if (!initialized) {
      // Fall back to immediate call without queue
      logger.warn('⚠️ Queue not available, making immediate call only');
      const callResult = await retell.createOutboundCall({
        fromNumber: process.env.ROOFING_OUTBOUND_PHONE || '+14072891565',
        toNumber: params.phone,
        agentId: process.env.ROOFING_OUTBOUND_AGENT_ID || '',
        dynamicVariables: {
          customer_name: params.customerName,
          follow_up_attempt: '1',
          property_address: params.address || '',
          roof_issue: params.roofIssue || ''
        }
      });
      return callResult;
    }
  }

  try {
    const jobData: FollowupJob = {
      phone: params.phone,
      customerName: params.customerName,
      email: params.email,
      address: params.address,
      roofIssue: params.roofIssue,
      source: params.source,
      attemptNumber: 1,
      maxAttempts: 6,
      originalLeadId: params.leadId,
      previousCallIds: []
    };

    // Schedule immediate first attempt
    await followupQueue!.add(
      'followup-1',
      jobData,
      {
        delay: 0, // Immediate
        jobId: `followup-${params.phone}-attempt-1-${Date.now()}`,
        priority: 1,
      }
    );

    logger.info(`🚀 Started follow-up sequence for ${params.phone}`);
    return { success: true };

  } catch (error: any) {
    logger.error(`❌ Failed to start follow-up sequence: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Cancel all pending follow-ups for a phone number
 * (Call this when customer schedules appointment)
 */
export async function cancelFollowupsForPhone(phone: string): Promise<void> {
  if (!followupQueue) return;

  try {
    // Get all delayed jobs
    const delayedJobs = await followupQueue.getDelayed();

    for (const job of delayedJobs) {
      if (job.data.phone === phone) {
        await job.remove();
        logger.info(`🗑️ Cancelled pending follow-up for ${phone}: ${job.id}`);
      }
    }

  } catch (error: any) {
    logger.error(`❌ Error cancelling follow-ups: ${error.message}`);
  }
}

/**
 * Get queue
 */
export const getFollowupQueue = () => followupQueue;

/**
 * Graceful shutdown
 */
export const closeFollowupQueue = async () => {
  if (followupWorker) {
    await followupWorker.close();
  }
  if (followupQueue) {
    await followupQueue.close();
  }
  logger.info('✅ Follow-up queue closed');
};
