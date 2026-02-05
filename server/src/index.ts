import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
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
import estimaiteRoutes from './modules/estimaite/estimaite.controller';
import { initializeQueues } from './queues';
import { initializeFollowupQueue, closeFollowupQueue } from './queues/roofing-followup.processor';
import { warmClientCache } from './lib/cache';
import { logger } from './lib/logger';

// Load env vars
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
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
app.use('/api', retellLLMRoutes); // Retell Custom LLM at /api/retell-llm
app.use('/api/analytics', analyticsRoutes); // V-Suite Analytics at /api/analytics/ingest
app.use('/api/webhooks', webhookRoutes); // Unified Webhooks (Tavus, Retell, GHL)
app.use('/api/landing', landingRoutes);   // QR Scan API
app.use('/api/analytics', dashboardRoutes); // V-Suite Dashboard API
app.use('/api/analytics', medspaRoutes); // Med Spa Analytics API
app.use('/api/provisioning', spawnRoutes); // VoxOS Factory (Spawn)
app.use('/api/admin', adminRoutes); // Admin API (dealer management)
app.use('/api/roofing', roofingRoutes); // Roofing Pros USA API
app.use('/api/estimaite', estimaiteRoutes); // EstimAIte - AI Estimate Generation

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.1.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
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
