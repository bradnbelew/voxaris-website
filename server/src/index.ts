import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Load env vars early
dotenv.config();

// Initialize Sentry BEFORE other imports
import { initSentry, sentryRequestHandler, sentryErrorHandler, captureError } from './lib/sentry';
initSentry();

import voiceRoutes from './modules/voice/voice.controller';
import retellLLMRoutes from './modules/voice/retell-llm.controller';
import analyticsRoutes from './modules/analytics/analytics.controller';
import webhookRoutes from './modules/webhooks/webhook.controller';
import landingRoutes from './modules/landing/landing.controller';
import dashboardRoutes from './modules/analytics/dashboard.controller';
import medspaRoutes from './modules/analytics/medspa.controller';
import spawnRoutes from './modules/provisioning/spawn.controller';
import adminRoutes from './modules/admin/admin.controller';
import roofingRoutes from './modules/roofing/roofing.controller';
import n8nWorkflowRoutes from './modules/roofing/n8n-workflows.controller';
import calcomWebhookRoutes from './modules/roofing/calcom-webhooks.controller';
import tavusCviRoutes from './modules/roofing/tavus-cvi.controller';
import estimaiteRoutes from './modules/estimaite/estimaite.controller';
import voxarisRoutes from './modules/voxaris/voxaris.controller';
import voxarisTavusRoutes from './modules/voxaris/voxaris-tavus.controller';
import voxarisWebhookRoutes from './modules/voxaris/voxaris-webhooks.controller';
import { initializeQueues, getQueues } from './queues';
import { initializeFollowupQueue, closeFollowupQueue } from './queues/roofing-followup.processor';
import { warmClientCache } from './lib/cache';
import { logger } from './lib/logger';
import { getQueueConnection } from './lib/redis';
import { supabase } from './lib/supabase';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(sentryRequestHandler); // Sentry request tracking (must be first)
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.path !== '/api/health') { // Don't log health checks
      logger.debug(`${req.method} ${req.path}`, {
        status: res.statusCode,
        duration: `${duration}ms`,
      });
    }
  });
  next();
});

// Routes
app.use('/api/voice', voiceRoutes);
app.use('/api/retell', voiceRoutes);  // Also mount at /api/retell for web-call endpoint
app.use('/api', retellLLMRoutes); // Retell Custom LLM at /api/retell-llm
app.use('/api/analytics', analyticsRoutes); // V-Suite Analytics at /api/analytics/ingest
app.use('/api/webhooks', webhookRoutes); // Unified Webhooks (Tavus, Retell, GHL)
app.use('/api/landing', landingRoutes);   // QR Scan API
app.use('/api/analytics', dashboardRoutes); // V-Suite Dashboard API
app.use('/api/analytics', medspaRoutes); // Med Spa Analytics API
app.use('/api/provisioning', spawnRoutes); // VoxOS Factory (Spawn)
app.use('/api/admin', adminRoutes); // Admin API (dealer management)
app.use('/api/roofing', roofingRoutes); // Roofing Pros USA API
app.use('/api/roofing/n8n', n8nWorkflowRoutes); // n8n Workflow Integration
app.use('/api/roofing/webhooks/calcom', calcomWebhookRoutes); // Cal.com booking webhooks
app.use('/api/roofing/tavus', tavusCviRoutes); // Tavus CVI video chat
app.use('/api/estimaite', estimaiteRoutes); // EstimAIte - AI Estimate Generation
app.use('/api/voxaris', voxarisRoutes); // Voxaris Demo API (outbound call, web call, config)
app.use('/api/voxaris/tavus', voxarisTavusRoutes); // Voxaris Tavus CVI video chat
app.use('/api/voxaris/webhooks', voxarisWebhookRoutes); // Voxaris Webhooks (Retell, Tavus, GHL→outbound)

// Health Check (Enhanced per playbook)
const startTime = Date.now();

app.get('/api/health', async (req, res) => {
  try {
    const services: Record<string, 'ok' | 'degraded' | 'down'> = {
      redis: 'down',
      supabase: 'down',
      retell: 'ok', // Assume ok unless proven otherwise
      tavus: 'ok',
    };

    // Check Redis
    const redisConnection = getQueueConnection();
    if (redisConnection) {
      try {
        await redisConnection.ping();
        services.redis = 'ok';
      } catch {
        services.redis = 'down';
      }
    }

    // Check Supabase
    try {
      const { error } = await supabase.from('clients').select('id').limit(1);
      services.supabase = error ? 'degraded' : 'ok';
    } catch {
      services.supabase = 'down';
    }

    // Get queue stats
    let queueStats = { waiting: 0, active: 0, completed: 0, failed: 0 };
    try {
      const { retellQueue, tavusQueue, ghlQueue, emailQueue } = getQueues();
      const queues = [retellQueue, tavusQueue, ghlQueue, emailQueue].filter(Boolean);

      for (const queue of queues) {
        if (queue) {
          queueStats.waiting += await queue.getWaitingCount();
          queueStats.active += await queue.getActiveCount();
          queueStats.completed += await queue.getCompletedCount();
          queueStats.failed += await queue.getFailedCount();
        }
      }
    } catch {
      // Queue stats unavailable
    }

    // Determine overall status
    const hasDown = Object.values(services).includes('down');
    const hasDegraded = Object.values(services).includes('degraded');
    const overallStatus = hasDown ? 'degraded' : (hasDegraded ? 'degraded' : 'ok');

    const healthResponse = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: Math.round((Date.now() - startTime) / 1000),
      version: process.env.npm_package_version || '1.1.0',
      environment: process.env.NODE_ENV || 'development',
      services,
      queues: queueStats,
    };

    // Return 503 if degraded or down
    const statusCode = overallStatus === 'ok' ? 200 : 503;
    res.status(statusCode).json(healthResponse);

  } catch (error: any) {
    res.status(503).json({
      status: 'down',
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
});

// Sentry error handler (must be before other error handlers)
app.use(sentryErrorHandler);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Also capture to Sentry with context
  captureError(err, {
    path: req.path,
    method: req.method,
    body: req.body,
  });

  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
    code: 'INTERNAL_ERROR',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    code: 'NOT_FOUND',
  });
});

// Initialize on startup
async function startup() {
  logger.info('🚀 Starting Voxaris API Server...');

  // Initialize queue system
  try {
    initializeQueues();
    initializeFollowupQueue(); // Roofing follow-up queue
    logger.info('✅ Queue system initialized');
  } catch (error: any) {
    logger.warn('⚠️ Queue system initialization failed (running without queues)', {
      error: error.message,
    });
  }

  // Warm cache with active clients
  try {
    await warmClientCache();
  } catch (error: any) {
    logger.warn('⚠️ Cache warming failed', { error: error.message });
  }

  // Start server
  const server = app.listen(PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${PORT}`);
    logger.info(`📊 Admin API available at /api/admin`);
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    logger.info(`${signal} received. Starting graceful shutdown...`);

    server.close(() => {
      logger.info('✅ HTTP server closed');
    });

    // Close follow-up queue
    try {
      await closeFollowupQueue();
    } catch (error: any) {
      logger.warn('⚠️ Error closing follow-up queue:', error.message);
    }

    // Wait for in-flight requests (max 30 seconds)
    setTimeout(() => {
      logger.info('✅ Graceful shutdown complete');
      process.exit(0);
    }, 30000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

// Start the server
startup().catch((error) => {
  logger.error('❌ Failed to start server:', error);
  process.exit(1);
});
