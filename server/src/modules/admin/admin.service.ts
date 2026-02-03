import { supabase } from '../../lib/supabase';
import { logger } from '../../lib/logger';
import { SecretsManager } from '../../lib/secrets';
import { TavusAPI, RetellAPI, getGHLClient } from '../../lib/apiClients';
import { getQueues, QUEUE_NAMES } from '../../queues';
import { getCacheConnection } from '../../lib/redis';
import axios from 'axios';

/**
 * Admin Service
 *
 * Handles dealer management operations:
 * - Creating new dealers with full integration setup
 * - Listing dealers with health status
 * - Retrieving dealer details with stats
 */

// ============================================
// TYPES
// ============================================

export interface CreateDealerInput {
  name: string;
  ghl_api_key: string;
  ghl_location_id: string;
  phone?: string;
  email?: string;
  system_prompt?: string;
}

export interface CreateDealerResult {
  dealer_id: string;
  tavus_persona_id: string | null;
  retell_agent_id: string | null;
  dashboard_url: string;
}

export interface DealerListItem {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  created_at: string;
  tavus_persona_id: string | null;
  retell_agent_id: string | null;
  last_webhook_at: string | null;
  total_conversations: number;
}

export interface DealerDetails {
  dealer: {
    id: string;
    name: string;
    business_name: string;
    status: 'active' | 'inactive';
    tavus_persona_id: string | null;
    retell_agent_id: string | null;
    ghl_location_id: string | null;
    system_prompt: string | null;
    created_at: string;
    updated_at: string;
  };
  stats: {
    conversations_today: number;
    conversations_this_month: number;
    appointments_booked: number;
    avg_sentiment_score: number | null;
  };
}

// ============================================
// DEFAULT SYSTEM PROMPT
// ============================================

const DEFAULT_SYSTEM_PROMPT = `
You are a friendly and professional AI sales representative.

ROLE & CONTEXT:
- You work for {{DEALER_NAME}}
- Your goal is to help customers and schedule appointments
- Be helpful, concise, and professional

TONE & STYLE:
- Warm but professional
- Keep responses concise (under 3 sentences when possible)
- Use the customer's name when you know it

GUARDRAILS:
- Never provide specific pricing (always say "let's discuss in person")
- Never make promises about trade-in values
- If asked about competitors, redirect to your dealership's strengths

BEHAVIORAL GUIDELINES:
- Match the customer's pace and energy
- If they seem busy, be brief
- If they have questions, be thorough
- Always try to set an appointment
`;

// ============================================
// CREATE DEALER
// ============================================

export async function createDealer(
  input: CreateDealerInput,
  correlationId: string
): Promise<CreateDealerResult> {
  logger.info('Creating new dealer', {
    correlationId,
    dealerName: input.name,
  });

  // Step 1: Generate system prompt
  const systemPrompt = input.system_prompt ||
    DEFAULT_SYSTEM_PROMPT.replace('{{DEALER_NAME}}', input.name);

  // Step 2: Create Tavus persona
  let tavusPersonaId: string | null = null;
  try {
    const persona = await TavusAPI.createPersona({
      name: `${input.name} Video Agent`,
      systemPrompt,
    });
    tavusPersonaId = persona?.persona_id || null;
    logger.info('Tavus persona created', {
      correlationId,
      personaId: tavusPersonaId,
    });
  } catch (error: any) {
    logger.error('Failed to create Tavus persona', {
      correlationId,
      error: error.message,
    });
    // Continue - Tavus is optional
  }

  // Step 3: Create Retell agent
  let retellAgentId: string | null = null;
  try {
    const webhookUrl = `${process.env.API_BASE_URL || 'https://api.voxaris.com'}/api/webhooks/retell`;
    const agent = await RetellAPI.createAgent({
      name: `${input.name} Voice Agent`,
      systemPrompt,
      webhookUrl,
    });
    retellAgentId = agent?.agent_id || null;
    logger.info('Retell agent created', {
      correlationId,
      agentId: retellAgentId,
    });
  } catch (error: any) {
    logger.error('Failed to create Retell agent', {
      correlationId,
      error: error.message,
    });
    // Continue - Retell is optional
  }

  // Step 4: Insert dealer into clients table
  const { data: dealer, error: dealerError } = await supabase
    .from('clients')
    .insert({
      business_name: input.name,
      tavus_persona_id: tavusPersonaId,
      retell_agent_id: retellAgentId,
      system_prompt: systemPrompt,
      ghl_location_id: input.ghl_location_id,
      objection_map: {},
      active: true,
    })
    .select('id')
    .single();

  if (dealerError || !dealer) {
    logger.error('Failed to insert dealer', {
      correlationId,
      error: dealerError?.message,
    });
    throw new Error(`Failed to create dealer: ${dealerError?.message}`);
  }

  const dealerId = dealer.id;
  logger.info('Dealer record created', { correlationId, dealerId });

  // Step 5: Encrypt and store GHL credentials
  try {
    const encryptedKey = SecretsManager.encrypt(input.ghl_api_key);

    const { error: integrationError } = await supabase
      .from('dealer_integrations')
      .insert({
        dealer_id: dealerId,
        integration_type: 'ghl',
        api_key_encrypted: encryptedKey,
        metadata: {
          location_id: input.ghl_location_id,
          phone: input.phone,
          email: input.email,
        },
      });

    if (integrationError) {
      logger.error('Failed to store GHL credentials', {
        correlationId,
        error: integrationError.message,
      });
      // Don't throw - dealer is created, just missing GHL integration
    } else {
      logger.info('GHL credentials encrypted and stored', {
        correlationId,
        dealerId,
      });
    }
  } catch (encryptError: any) {
    logger.error('Failed to encrypt GHL credentials', {
      correlationId,
      error: encryptError.message,
    });
    // Don't throw - dealer is created
  }

  const dashboardUrl = `https://app.voxaris.com/dealer/${dealerId}`;

  logger.info('Dealer creation complete', {
    correlationId,
    dealerId,
    tavusPersonaId,
    retellAgentId,
  });

  return {
    dealer_id: dealerId,
    tavus_persona_id: tavusPersonaId,
    retell_agent_id: retellAgentId,
    dashboard_url: dashboardUrl,
  };
}

// ============================================
// LIST DEALERS
// ============================================

export async function listDealers(
  options: {
    status?: 'active' | 'inactive';
    limit?: number;
    offset?: number;
  },
  correlationId: string
): Promise<{ dealers: DealerListItem[]; total: number }> {
  logger.debug('Listing dealers', { correlationId, options });

  let query = supabase
    .from('clients')
    .select('*', { count: 'exact' });

  // Filter by status
  if (options.status === 'active') {
    query = query.eq('active', true);
  } else if (options.status === 'inactive') {
    query = query.eq('active', false);
  }

  // Pagination
  const limit = options.limit || 50;
  const offset = options.offset || 0;
  query = query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  const { data: clients, error, count } = await query;

  if (error) {
    logger.error('Failed to list dealers', {
      correlationId,
      error: error.message,
    });
    throw new Error(`Failed to list dealers: ${error.message}`);
  }

  // Get conversation counts for each dealer
  const dealerIds = (clients || []).map(c => c.id);

  const { data: conversationCounts } = await supabase
    .from('calls')
    .select('client_id')
    .in('client_id', dealerIds);

  // Count conversations per dealer
  const countMap: Record<string, number> = {};
  (conversationCounts || []).forEach(c => {
    countMap[c.client_id] = (countMap[c.client_id] || 0) + 1;
  });

  // Get last webhook timestamp for each dealer
  const { data: lastWebhooks } = await supabase
    .from('calls')
    .select('client_id, created_at')
    .in('client_id', dealerIds)
    .order('created_at', { ascending: false });

  const lastWebhookMap: Record<string, string> = {};
  (lastWebhooks || []).forEach(w => {
    if (!lastWebhookMap[w.client_id]) {
      lastWebhookMap[w.client_id] = w.created_at;
    }
  });

  const dealers: DealerListItem[] = (clients || []).map(client => ({
    id: client.id,
    name: client.business_name,
    status: client.active ? 'active' : 'inactive',
    created_at: client.created_at,
    tavus_persona_id: client.tavus_persona_id,
    retell_agent_id: client.retell_agent_id,
    last_webhook_at: lastWebhookMap[client.id] || null,
    total_conversations: countMap[client.id] || 0,
  }));

  logger.debug('Dealers listed', {
    correlationId,
    count: dealers.length,
    total: count,
  });

  return {
    dealers,
    total: count || 0,
  };
}

// ============================================
// GET DEALER BY ID
// ============================================

export async function getDealerById(
  dealerId: string,
  correlationId: string
): Promise<DealerDetails | null> {
  logger.debug('Getting dealer details', { correlationId, dealerId });

  // Get dealer
  const { data: client, error: clientError } = await supabase
    .from('clients')
    .select('*')
    .eq('id', dealerId)
    .single();

  if (clientError || !client) {
    if (clientError?.code === 'PGRST116') {
      return null; // Not found
    }
    logger.error('Failed to get dealer', {
      correlationId,
      error: clientError?.message,
    });
    throw new Error(`Failed to get dealer: ${clientError?.message}`);
  }

  // Get stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  // Conversations today
  const { count: conversationsToday } = await supabase
    .from('calls')
    .select('*', { count: 'exact', head: true })
    .eq('client_id', dealerId)
    .gte('created_at', today.toISOString());

  // Conversations this month
  const { count: conversationsThisMonth } = await supabase
    .from('calls')
    .select('*', { count: 'exact', head: true })
    .eq('client_id', dealerId)
    .gte('created_at', startOfMonth.toISOString());

  // Appointments booked
  const { count: appointmentsBooked } = await supabase
    .from('calls')
    .select('*', { count: 'exact', head: true })
    .eq('client_id', dealerId)
    .eq('outcome', 'appointment_booked');

  // Average sentiment
  const { data: sentimentData } = await supabase
    .from('calls')
    .select('sentiment_score')
    .eq('client_id', dealerId)
    .not('sentiment_score', 'is', null);

  let avgSentiment: number | null = null;
  if (sentimentData && sentimentData.length > 0) {
    const sum = sentimentData.reduce((acc, row) => acc + (row.sentiment_score || 0), 0);
    avgSentiment = Math.round(sum / sentimentData.length);
  }

  // Get GHL location ID from integration
  const { data: integration } = await supabase
    .from('dealer_integrations')
    .select('metadata')
    .eq('dealer_id', dealerId)
    .eq('integration_type', 'ghl')
    .single();

  const result: DealerDetails = {
    dealer: {
      id: client.id,
      name: client.business_name,
      business_name: client.business_name,
      status: client.active ? 'active' : 'inactive',
      tavus_persona_id: client.tavus_persona_id,
      retell_agent_id: client.retell_agent_id,
      ghl_location_id: integration?.metadata?.location_id || client.ghl_location_id,
      system_prompt: client.system_prompt,
      created_at: client.created_at,
      updated_at: client.updated_at || client.created_at,
    },
    stats: {
      conversations_today: conversationsToday || 0,
      conversations_this_month: conversationsThisMonth || 0,
      appointments_booked: appointmentsBooked || 0,
      avg_sentiment_score: avgSentiment,
    },
  };

  logger.debug('Dealer details retrieved', {
    correlationId,
    dealerId,
    conversationsThisMonth,
  });

  return result;
}

// ============================================
// UPDATE DEALER
// ============================================

export async function updateDealer(
  dealerId: string,
  updates: {
    name?: string;
    system_prompt?: string;
    active?: boolean;
  },
  correlationId: string
): Promise<boolean> {
  logger.info('Updating dealer', { correlationId, dealerId, updates });

  const updateData: any = {
    updated_at: new Date().toISOString(),
  };

  if (updates.name) {
    updateData.business_name = updates.name;
  }
  if (updates.system_prompt) {
    updateData.system_prompt = updates.system_prompt;
  }
  if (typeof updates.active === 'boolean') {
    updateData.active = updates.active;
  }

  const { error } = await supabase
    .from('clients')
    .update(updateData)
    .eq('id', dealerId);

  if (error) {
    logger.error('Failed to update dealer', {
      correlationId,
      error: error.message,
    });
    throw new Error(`Failed to update dealer: ${error.message}`);
  }

  // If system prompt updated, also update Tavus persona
  if (updates.system_prompt) {
    const { data: client } = await supabase
      .from('clients')
      .select('tavus_persona_id')
      .eq('id', dealerId)
      .single();

    if (client?.tavus_persona_id) {
      try {
        await TavusAPI.updatePersona(client.tavus_persona_id, {
          systemPrompt: updates.system_prompt,
        });
        logger.info('Tavus persona updated', {
          correlationId,
          personaId: client.tavus_persona_id,
        });
      } catch (error: any) {
        logger.warn('Failed to update Tavus persona', {
          correlationId,
          error: error.message,
        });
      }
    }
  }

  logger.info('Dealer updated', { correlationId, dealerId });
  return true;
}

// ============================================
// PHASE 2: SYSTEM HEALTH
// ============================================

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down';
  timestamp: string;
  queues: {
    [key: string]: {
      waiting: number;
      active: number;
      completed: number;
      failed: number;
    };
  };
  redis: {
    status: 'connected' | 'disconnected';
    memory_used_mb: number | null;
  };
  database: {
    status: 'connected' | 'error';
    response_time_ms: number;
  };
  uptime_seconds: number;
}

const startTime = Date.now();

export async function getSystemHealth(correlationId: string): Promise<SystemHealth> {
  logger.debug('Getting system health', { correlationId });

  const result: SystemHealth = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    queues: {},
    redis: { status: 'disconnected', memory_used_mb: null },
    database: { status: 'error', response_time_ms: 0 },
    uptime_seconds: Math.floor((Date.now() - startTime) / 1000),
  };

  // Check queues
  try {
    const { tavusQueue, retellQueue, ghlQueue } = getQueues();

    if (tavusQueue && retellQueue && ghlQueue) {
      const [tavusCounts, retellCounts, ghlCounts] = await Promise.all([
        tavusQueue.getJobCounts('wait', 'active', 'completed', 'failed'),
        retellQueue.getJobCounts('wait', 'active', 'completed', 'failed'),
        ghlQueue.getJobCounts('wait', 'active', 'completed', 'failed'),
      ]);

      result.queues[QUEUE_NAMES.TAVUS_WEBHOOKS] = {
        waiting: tavusCounts.wait || 0,
        active: tavusCounts.active || 0,
        completed: tavusCounts.completed || 0,
        failed: tavusCounts.failed || 0,
      };

      result.queues[QUEUE_NAMES.RETELL_WEBHOOKS] = {
        waiting: retellCounts.wait || 0,
        active: retellCounts.active || 0,
        completed: retellCounts.completed || 0,
        failed: retellCounts.failed || 0,
      };

      result.queues[QUEUE_NAMES.GHL_SYNC] = {
        waiting: ghlCounts.wait || 0,
        active: ghlCounts.active || 0,
        completed: ghlCounts.completed || 0,
        failed: ghlCounts.failed || 0,
      };

      result.redis.status = 'connected';

      // Check for degraded status (high queue depth or many failures)
      const totalFailed = (tavusCounts.failed || 0) + (retellCounts.failed || 0) + (ghlCounts.failed || 0);
      const totalWaiting = (tavusCounts.wait || 0) + (retellCounts.wait || 0) + (ghlCounts.wait || 0);

      if (totalFailed > 50 || totalWaiting > 100) {
        result.status = 'degraded';
      }
    }
  } catch (error: any) {
    logger.warn('Queue health check failed', { correlationId, error: error.message });
    result.status = 'degraded';
  }

  // Check Redis memory
  try {
    const redis = getCacheConnection();
    if (redis) {
      const info = await redis.info('memory');
      const memMatch = info.match(/used_memory:(\d+)/);
      if (memMatch) {
        result.redis.memory_used_mb = Math.round(parseInt(memMatch[1]) / 1024 / 1024 * 100) / 100;
      }
      result.redis.status = 'connected';
    }
  } catch (error: any) {
    logger.warn('Redis health check failed', { correlationId, error: error.message });
  }

  // Check database
  try {
    const dbStart = Date.now();
    const { error } = await supabase.from('clients').select('id').limit(1);
    result.database.response_time_ms = Date.now() - dbStart;
    result.database.status = error ? 'error' : 'connected';

    if (error) {
      result.status = 'degraded';
    }
  } catch (error: any) {
    logger.warn('Database health check failed', { correlationId, error: error.message });
    result.status = 'down';
    result.database.status = 'error';
  }

  // Final status determination
  if (result.database.status === 'error' && result.redis.status === 'disconnected') {
    result.status = 'down';
  }

  return result;
}

// ============================================
// PHASE 2: INTEGRATION TESTING
// ============================================

export interface IntegrationTestResult {
  tavus: { status: 'ok' | 'error'; response_time_ms: number; persona_name?: string; error?: string };
  retell: { status: 'ok' | 'error'; response_time_ms: number; agent_name?: string; error?: string };
  ghl: { status: 'ok' | 'error'; response_time_ms: number; error?: string };
}

export async function testDealerIntegrations(
  dealerId: string,
  correlationId: string
): Promise<IntegrationTestResult> {
  logger.info('Testing dealer integrations', { correlationId, dealerId });

  // Get dealer
  const { data: client } = await supabase
    .from('clients')
    .select('tavus_persona_id, retell_agent_id')
    .eq('id', dealerId)
    .single();

  if (!client) {
    throw new Error('Dealer not found');
  }

  const result: IntegrationTestResult = {
    tavus: { status: 'error', response_time_ms: 0, error: 'Not configured' },
    retell: { status: 'error', response_time_ms: 0, error: 'Not configured' },
    ghl: { status: 'error', response_time_ms: 0, error: 'Not configured' },
  };

  // Test Tavus
  if (client.tavus_persona_id) {
    try {
      const start = Date.now();
      const response = await axios.get(
        `https://tavusapi.com/v2/personas/${client.tavus_persona_id}`,
        {
          headers: {
            'x-api-key': process.env.TAVUS_API_KEY || '',
          },
          timeout: 10000,
        }
      );
      result.tavus = {
        status: 'ok',
        response_time_ms: Date.now() - start,
        persona_name: response.data?.persona_name,
      };
    } catch (error: any) {
      result.tavus = {
        status: 'error',
        response_time_ms: Date.now(),
        error: error.response?.data?.message || error.message,
      };
    }
  }

  // Test Retell
  if (client.retell_agent_id) {
    try {
      const start = Date.now();
      const response = await axios.get(
        `https://api.retellai.com/get-agent/${client.retell_agent_id}`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.RETELL_API_KEY || ''}`,
          },
          timeout: 10000,
        }
      );
      result.retell = {
        status: 'ok',
        response_time_ms: Date.now() - start,
        agent_name: response.data?.agent_name,
      };
    } catch (error: any) {
      result.retell = {
        status: 'error',
        response_time_ms: Date.now(),
        error: error.response?.data?.message || error.message,
      };
    }
  }

  // Test GHL
  try {
    const start = Date.now();
    const ghlClient = await getGHLClient(dealerId);

    if (ghlClient) {
      // Try to find a contact (just to test the API)
      await ghlClient.findContact('test@example.com');
      result.ghl = {
        status: 'ok',
        response_time_ms: Date.now() - start,
      };
    }
  } catch (error: any) {
    result.ghl = {
      status: 'error',
      response_time_ms: Date.now(),
      error: error.response?.data?.message || error.message,
    };
  }

  logger.info('Integration tests complete', { correlationId, dealerId, result });
  return result;
}

// ============================================
// PHASE 2: DEAD LETTER QUEUE
// ============================================

export interface DLQJob {
  id: string;
  queue: string;
  dealer_id: string | null;
  dealer_name: string | null;
  type: string;
  data: any;
  error: string;
  attempts: number;
  failed_at: string;
  can_retry: boolean;
}

export interface DLQResult {
  jobs: DLQJob[];
  counts: {
    [key: string]: number;
    total: number;
  };
}

export async function getFailedJobs(
  options: {
    limit?: number;
    offset?: number;
    queue?: string;
  },
  correlationId: string
): Promise<DLQResult> {
  logger.debug('Getting failed jobs', { correlationId, options });

  const limit = options.limit || 50;
  const offset = options.offset || 0;
  const queueFilter = options.queue || 'all';

  const { tavusQueue, retellQueue, ghlQueue } = getQueues();
  const jobs: DLQJob[] = [];
  const counts: Record<string, number> = {};

  const queuesToCheck = [
    { queue: tavusQueue, name: QUEUE_NAMES.TAVUS_WEBHOOKS },
    { queue: retellQueue, name: QUEUE_NAMES.RETELL_WEBHOOKS },
    { queue: ghlQueue, name: QUEUE_NAMES.GHL_SYNC },
  ].filter(q => queueFilter === 'all' || q.name === queueFilter);

  // Get failed job counts
  for (const { queue, name } of queuesToCheck) {
    if (!queue) continue;
    try {
      const failedCount = await queue.getFailedCount();
      counts[name] = failedCount;
    } catch (error) {
      counts[name] = 0;
    }
  }
  counts.total = Object.values(counts).reduce((a, b) => a + b, 0);

  // Get failed jobs
  for (const { queue, name } of queuesToCheck) {
    if (!queue) continue;

    try {
      const failedJobs = await queue.getFailed(offset, limit);

      for (const job of failedJobs) {
        // Extract dealer_id from job data
        let dealerId: string | null = null;
        let dealerName: string | null = null;

        if (job.data?.event?.metadata?.dealer_id) {
          dealerId = job.data.event.metadata.dealer_id;
        } else if (job.data?.dealer_id) {
          dealerId = job.data.dealer_id;
        }

        // Look up dealer name
        if (dealerId) {
          const { data: dealer } = await supabase
            .from('clients')
            .select('business_name')
            .eq('id', dealerId)
            .single();
          dealerName = dealer?.business_name || null;
        }

        // Determine if job can be retried (transient errors are retryable)
        const isTransient = job.failedReason?.includes('timeout') ||
          job.failedReason?.includes('ECONNREFUSED') ||
          job.failedReason?.includes('rate limit') ||
          job.failedReason?.includes('5');

        jobs.push({
          id: job.id || '',
          queue: name,
          dealer_id: dealerId,
          dealer_name: dealerName,
          type: job.data?.type || 'unknown',
          data: job.data,
          error: job.failedReason || 'Unknown error',
          attempts: job.attemptsMade || 0,
          failed_at: job.finishedOn ? new Date(job.finishedOn).toISOString() : '',
          can_retry: isTransient,
        });
      }
    } catch (error: any) {
      logger.warn(`Failed to get DLQ jobs from ${name}`, { error: error.message });
    }
  }

  // Sort by failed_at descending
  jobs.sort((a, b) => new Date(b.failed_at).getTime() - new Date(a.failed_at).getTime());

  return { jobs: jobs.slice(0, limit), counts };
}

export async function retryFailedJobs(
  jobIds: string[],
  correlationId: string
): Promise<{ retried: string[]; failed: string[]; errors: Record<string, string> }> {
  logger.info('Retrying failed jobs', { correlationId, jobIds });

  const result = {
    retried: [] as string[],
    failed: [] as string[],
    errors: {} as Record<string, string>,
  };

  const { tavusQueue, retellQueue, ghlQueue } = getQueues();
  const allQueues = [
    { queue: tavusQueue, name: QUEUE_NAMES.TAVUS_WEBHOOKS },
    { queue: retellQueue, name: QUEUE_NAMES.RETELL_WEBHOOKS },
    { queue: ghlQueue, name: QUEUE_NAMES.GHL_SYNC },
  ];

  for (const jobId of jobIds) {
    let found = false;

    for (const { queue, name } of allQueues) {
      if (!queue) continue;

      try {
        const job = await queue.getJob(jobId);
        if (job) {
          found = true;
          await job.retry();
          result.retried.push(jobId);
          logger.info(`Job ${jobId} retried from ${name}`, { correlationId });
          break;
        }
      } catch (error: any) {
        // Job might be in a different queue or already processed
      }
    }

    if (!found) {
      result.failed.push(jobId);
      result.errors[jobId] = 'Job not found or already processed';
    }
  }

  return result;
}

// ============================================
// PHASE 2: METRICS AGGREGATION
// ============================================

export interface MetricsResult {
  period: { start: string; end: string };
  conversations: {
    total: number;
    by_platform: { tavus: number; retell: number };
    by_outcome: Record<string, number>;
  };
  dealers: {
    active: number;
    top_by_conversations: Array<{ dealer_id: string; name: string; count: number }>;
  };
  performance: {
    avg_duration_seconds: number | null;
    avg_sentiment_score: number | null;
    appointment_rate_percent: number;
  };
}

export async function getAggregatedMetrics(
  startDate: string,
  endDate: string,
  correlationId: string
): Promise<MetricsResult> {
  logger.debug('Getting aggregated metrics', { correlationId, startDate, endDate });

  // Get all calls in date range
  const { data: calls, error } = await supabase
    .from('calls')
    .select('client_id, platform, outcome, duration_seconds, sentiment_score')
    .gte('created_at', startDate)
    .lte('created_at', endDate);

  if (error) {
    throw new Error(`Failed to fetch metrics: ${error.message}`);
  }

  // Aggregate by platform
  const byPlatform = { tavus: 0, retell: 0 };
  const byOutcome: Record<string, number> = {};
  const byDealer: Record<string, number> = {};
  let totalDuration = 0;
  let durationCount = 0;
  let totalSentiment = 0;
  let sentimentCount = 0;
  let appointmentsBooked = 0;

  (calls || []).forEach(call => {
    // Platform counts
    if (call.platform === 'tavus') byPlatform.tavus++;
    if (call.platform === 'retell') byPlatform.retell++;

    // Outcome counts
    if (call.outcome) {
      byOutcome[call.outcome] = (byOutcome[call.outcome] || 0) + 1;
      if (call.outcome === 'appointment_booked') {
        appointmentsBooked++;
      }
    }

    // Dealer counts
    if (call.client_id) {
      byDealer[call.client_id] = (byDealer[call.client_id] || 0) + 1;
    }

    // Duration
    if (call.duration_seconds) {
      totalDuration += call.duration_seconds;
      durationCount++;
    }

    // Sentiment
    if (call.sentiment_score !== null) {
      totalSentiment += call.sentiment_score;
      sentimentCount++;
    }
  });

  // Get dealer names for top dealers
  const topDealerIds = Object.entries(byDealer)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([id]) => id);

  const { data: dealers } = await supabase
    .from('clients')
    .select('id, business_name')
    .in('id', topDealerIds);

  const dealerNameMap: Record<string, string> = {};
  (dealers || []).forEach(d => {
    dealerNameMap[d.id] = d.business_name;
  });

  const topByConversations = topDealerIds.map(id => ({
    dealer_id: id,
    name: dealerNameMap[id] || 'Unknown',
    count: byDealer[id],
  }));

  // Get active dealer count
  const { count: activeCount } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })
    .eq('active', true);

  const total = (calls || []).length;

  return {
    period: { start: startDate, end: endDate },
    conversations: {
      total,
      by_platform: byPlatform,
      by_outcome: byOutcome,
    },
    dealers: {
      active: activeCount || 0,
      top_by_conversations: topByConversations,
    },
    performance: {
      avg_duration_seconds: durationCount > 0 ? Math.round(totalDuration / durationCount) : null,
      avg_sentiment_score: sentimentCount > 0 ? Math.round(totalSentiment / sentimentCount) : null,
      appointment_rate_percent: total > 0 ? Math.round((appointmentsBooked / total) * 100 * 10) / 10 : 0,
    },
  };
}
