import { Worker } from 'bullmq';
import express from 'express';
import dotenv from 'dotenv';
import { getQueueConnection, closeRedisConnections } from '../lib/redis';
import { logger } from '../lib/logger';
import { QUEUE_NAMES, closeQueues } from '../queues';
import { tavusProcessor } from '../queues/tavus.processor';
import { retellProcessor } from '../queues/retell.processor';
import { ghlProcessor } from '../queues/ghl.processor';

dotenv.config();

const WORKER_PORT = process.env.WORKER_PORT || 3001;

/**
 * Worker Process Entry Point
 *
 * This runs as a SEPARATE process from the API server.
 * - Consumes jobs from Redis queues
 * - Processes webhooks with retry logic
 * - Exposes health check for monitoring
 */
async function startWorkers() {
  const connection = getQueueConnection();

  if (!connection) {
    logger.error('❌ Cannot start workers without Redis connection');
    process.exit(1);
  }

  logger.info('🚀 Starting BullMQ Workers...');

  // Create workers for each queue with their respective processors
  const tavusWorker = new Worker(
    QUEUE_NAMES.TAVUS_WEBHOOKS,
    tavusProcessor,
    {
      connection,
      concurrency: 5, // Process 5 Tavus jobs in parallel
      limiter: {
        max: 10, // Max 10 jobs per...
        duration: 1000, // ...1 second (rate limiting)
      },
    }
  );

  const retellWorker = new Worker(
    QUEUE_NAMES.RETELL_WEBHOOKS,
    retellProcessor,
    {
      connection,
      concurrency: 10, // Retell can handle more parallel
      limiter: {
        max: 20,
        duration: 1000,
      },
    }
  );

  const ghlWorker = new Worker(
    QUEUE_NAMES.GHL_SYNC,
    ghlProcessor,
    {
      connection,
      concurrency: 3, // GHL has strict rate limits
      limiter: {
        max: 5, // Only 5 GHL calls per second
        duration: 1000,
      },
    }
  );

  // Track worker metrics
  const metrics = {
    tavus: { completed: 0, failed: 0, active: 0 },
    retell: { completed: 0, failed: 0, active: 0 },
    ghl: { completed: 0, failed: 0, active: 0 },
  };

  // Set up event listeners for each worker
  const setupWorkerEvents = (worker: Worker, name: keyof typeof metrics) => {
    worker.on('completed', (job) => {
      metrics[name].completed++;
      logger.info(`✅ ${name} job completed: ${job.id}`);
    });

    worker.on('failed', (job, error) => {
      metrics[name].failed++;
      logger.error(`❌ ${name} job failed: ${job?.id}`, { error: error.message });
    });

    worker.on('active', (job) => {
      metrics[name].active++;
      logger.debug(`⚙️ ${name} job active: ${job.id}`);
    });

    worker.on('stalled', (jobId) => {
      logger.warn(`⚠️ ${name} job stalled: ${jobId}`);
    });

    worker.on('error', (error) => {
      logger.error(`❌ ${name} worker error:`, { error: error.message });
    });
  };

  setupWorkerEvents(tavusWorker, 'tavus');
  setupWorkerEvents(retellWorker, 'retell');
  setupWorkerEvents(ghlWorker, 'ghl');

  logger.info('✅ All workers started');

  // Health check server for monitoring
  const healthApp = express();

  healthApp.get('/health', async (req, res) => {
    try {
      // Get queue counts
      const [tavusQueue, retellQueue, ghlQueue] = await Promise.all([
        tavusWorker.client.then(c => c.llen(`bull:${QUEUE_NAMES.TAVUS_WEBHOOKS}:wait`)),
        retellWorker.client.then(c => c.llen(`bull:${QUEUE_NAMES.RETELL_WEBHOOKS}:wait`)),
        ghlWorker.client.then(c => c.llen(`bull:${QUEUE_NAMES.GHL_SYNC}:wait`)),
      ]);

      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        workers: {
          tavus: {
            running: tavusWorker.isRunning(),
            ...metrics.tavus,
            waiting: tavusQueue,
          },
          retell: {
            running: retellWorker.isRunning(),
            ...metrics.retell,
            waiting: retellQueue,
          },
          ghl: {
            running: ghlWorker.isRunning(),
            ...metrics.ghl,
            waiting: ghlQueue,
          },
        },
      });
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        error: error.message,
      });
    }
  });

  // DLQ inspection endpoint
  healthApp.get('/dlq', async (req, res) => {
    try {
      const client = await tavusWorker.client;
      const [tavusFailed, retellFailed, ghlFailed] = await Promise.all([
        client.llen(`bull:${QUEUE_NAMES.TAVUS_WEBHOOKS}:failed`),
        client.llen(`bull:${QUEUE_NAMES.RETELL_WEBHOOKS}:failed`),
        client.llen(`bull:${QUEUE_NAMES.GHL_SYNC}:failed`),
      ]);

      res.json({
        dlq: {
          tavus: tavusFailed,
          retell: retellFailed,
          ghl: ghlFailed,
          total: tavusFailed + retellFailed + ghlFailed,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  healthApp.listen(WORKER_PORT, () => {
    logger.info(`📊 Worker health check running on port ${WORKER_PORT}`);
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    logger.info(`${signal} received. Starting graceful shutdown...`);

    // Stop accepting new jobs
    await tavusWorker.close();
    await retellWorker.close();
    await ghlWorker.close();
    logger.info('✅ Workers stopped accepting jobs');

    // Wait for in-flight jobs (max 30 seconds)
    await new Promise(resolve => setTimeout(resolve, 30000));

    // Close Redis connections
    await closeRedisConnections();
    await closeQueues();

    logger.info('✅ Graceful shutdown complete');
    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

// Start the workers
startWorkers().catch((error) => {
  logger.error('❌ Failed to start workers:', error);
  process.exit(1);
});
