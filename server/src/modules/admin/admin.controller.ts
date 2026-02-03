import { Router, Response } from 'express';
import { z } from 'zod';
import { logger } from '../../lib/logger';
import { AdminRequest, adminAuth } from './admin.middleware';
import {
  createDealer,
  listDealers,
  getDealerById,
  updateDealer,
  getSystemHealth,
  testDealerIntegrations,
  getFailedJobs,
  retryFailedJobs,
  getAggregatedMetrics,
} from './admin.service';

const router = Router();

// ============================================
// INPUT VALIDATION SCHEMAS
// ============================================

const CreateDealerSchema = z.object({
  name: z.string().min(2).max(100),
  ghl_api_key: z.string().min(10),
  ghl_location_id: z.string().min(5),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  system_prompt: z.string().max(10000).optional(),
});

const UpdateDealerSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  system_prompt: z.string().max(10000).optional(),
  active: z.boolean().optional(),
});

const ListDealersQuerySchema = z.object({
  status: z.enum(['active', 'inactive']).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  offset: z.coerce.number().min(0).optional(),
});

const DLQQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).optional(),
  offset: z.coerce.number().min(0).optional(),
  queue: z.enum(['all', 'tavus-webhooks', 'retell-webhooks', 'ghl-sync']).optional(),
});

const RetryJobsSchema = z.object({
  job_ids: z.array(z.string()).min(1).max(100),
});

const MetricsQuerySchema = z.object({
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

// ============================================
// ROUTES
// ============================================

/**
 * POST /api/admin/dealers
 *
 * Create a new dealer with full integration setup:
 * - Creates Tavus persona
 * - Creates Retell agent
 * - Encrypts and stores GHL credentials
 * - Returns dealer_id and integration IDs
 */
router.post('/dealers', adminAuth, async (req: AdminRequest, res: Response) => {
  const correlationId = req.correlationId || 'unknown';

  try {
    // Validate input
    const parseResult = CreateDealerSchema.safeParse(req.body);
    if (!parseResult.success) {
      logger.warn('Invalid create dealer input', {
        correlationId,
        errors: parseResult.error.errors,
      });
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        code: 'VALIDATION_ERROR',
        details: parseResult.error.errors,
      });
    }

    const input = parseResult.data;

    // Create dealer
    const result = await createDealer(input, correlationId);

    logger.info('Dealer created via admin API', {
      correlationId,
      dealerId: result.dealer_id,
    });

    return res.status(201).json({
      success: true,
      data: result,
    });

  } catch (error: any) {
    logger.error('Failed to create dealer', {
      correlationId,
      error: error.message,
      stack: error.stack,
    });

    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to create dealer',
      code: 'CREATE_DEALER_FAILED',
    });
  }
});

/**
 * GET /api/admin/dealers
 *
 * List all dealers with basic stats.
 * Query params:
 * - status: 'active' | 'inactive' (optional)
 * - limit: number (default 50, max 100)
 * - offset: number (default 0)
 */
router.get('/dealers', adminAuth, async (req: AdminRequest, res: Response) => {
  const correlationId = req.correlationId || 'unknown';

  try {
    // Validate query params
    const parseResult = ListDealersQuerySchema.safeParse(req.query);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
        code: 'VALIDATION_ERROR',
        details: parseResult.error.errors,
      });
    }

    const options = parseResult.data;

    // Get dealers
    const { dealers, total } = await listDealers(
      {
        status: options.status,
        limit: options.limit,
        offset: options.offset,
      },
      correlationId
    );

    return res.json({
      success: true,
      data: {
        dealers,
        pagination: {
          total,
          limit: options.limit || 50,
          offset: options.offset || 0,
          has_more: (options.offset || 0) + dealers.length < total,
        },
      },
    });

  } catch (error: any) {
    logger.error('Failed to list dealers', {
      correlationId,
      error: error.message,
    });

    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to list dealers',
      code: 'LIST_DEALERS_FAILED',
    });
  }
});

/**
 * GET /api/admin/dealers/:id
 *
 * Get detailed dealer information including stats.
 */
router.get('/dealers/:id', adminAuth, async (req: AdminRequest, res: Response) => {
  const correlationId = req.correlationId || 'unknown';
  const dealerId = req.params.id;

  try {
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(dealerId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid dealer ID format',
        code: 'INVALID_ID',
      });
    }

    const dealer = await getDealerById(dealerId, correlationId);

    if (!dealer) {
      return res.status(404).json({
        success: false,
        error: 'Dealer not found',
        code: 'NOT_FOUND',
      });
    }

    return res.json({
      success: true,
      data: dealer,
    });

  } catch (error: any) {
    logger.error('Failed to get dealer', {
      correlationId,
      dealerId,
      error: error.message,
    });

    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to get dealer',
      code: 'GET_DEALER_FAILED',
    });
  }
});

/**
 * PATCH /api/admin/dealers/:id
 *
 * Update dealer information.
 * Can update: name, system_prompt, active status
 */
router.patch('/dealers/:id', adminAuth, async (req: AdminRequest, res: Response) => {
  const correlationId = req.correlationId || 'unknown';
  const dealerId = req.params.id;

  try {
    // Validate UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(dealerId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid dealer ID format',
        code: 'INVALID_ID',
      });
    }

    // Validate input
    const parseResult = UpdateDealerSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        code: 'VALIDATION_ERROR',
        details: parseResult.error.errors,
      });
    }

    const updates = parseResult.data;

    // Check if dealer exists
    const existing = await getDealerById(dealerId, correlationId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Dealer not found',
        code: 'NOT_FOUND',
      });
    }

    // Update dealer
    await updateDealer(dealerId, updates, correlationId);

    // Get updated dealer
    const updated = await getDealerById(dealerId, correlationId);

    logger.info('Dealer updated via admin API', {
      correlationId,
      dealerId,
      updates: Object.keys(updates),
    });

    return res.json({
      success: true,
      data: updated,
    });

  } catch (error: any) {
    logger.error('Failed to update dealer', {
      correlationId,
      dealerId,
      error: error.message,
    });

    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to update dealer',
      code: 'UPDATE_DEALER_FAILED',
    });
  }
});

/**
 * DELETE /api/admin/dealers/:id
 *
 * Soft delete a dealer (sets active = false).
 * Does NOT delete Tavus persona or Retell agent.
 */
router.delete('/dealers/:id', adminAuth, async (req: AdminRequest, res: Response) => {
  const correlationId = req.correlationId || 'unknown';
  const dealerId = req.params.id;

  try {
    // Validate UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(dealerId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid dealer ID format',
        code: 'INVALID_ID',
      });
    }

    // Check if dealer exists
    const existing = await getDealerById(dealerId, correlationId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Dealer not found',
        code: 'NOT_FOUND',
      });
    }

    // Soft delete
    await updateDealer(dealerId, { active: false }, correlationId);

    logger.info('Dealer deactivated via admin API', {
      correlationId,
      dealerId,
    });

    return res.json({
      success: true,
      message: 'Dealer deactivated',
    });

  } catch (error: any) {
    logger.error('Failed to delete dealer', {
      correlationId,
      dealerId,
      error: error.message,
    });

    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete dealer',
      code: 'DELETE_DEALER_FAILED',
    });
  }
});

// ============================================
// PHASE 2: HEALTH, DLQ, METRICS
// ============================================

/**
 * POST /api/admin/dealers/:id/test-integrations
 *
 * Test all integrations for a specific dealer.
 * Calls Tavus, Retell, and GHL APIs to verify connectivity.
 */
router.post('/dealers/:id/test-integrations', adminAuth, async (req: AdminRequest, res: Response) => {
  const correlationId = req.correlationId || 'unknown';
  const dealerId = req.params.id;

  try {
    // Validate UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(dealerId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid dealer ID format',
        code: 'INVALID_ID',
      });
    }

    const result = await testDealerIntegrations(dealerId, correlationId);

    return res.json({
      success: true,
      data: result,
    });

  } catch (error: any) {
    logger.error('Failed to test integrations', {
      correlationId,
      dealerId,
      error: error.message,
    });

    if (error.message === 'Dealer not found') {
      return res.status(404).json({
        success: false,
        error: 'Dealer not found',
        code: 'NOT_FOUND',
      });
    }

    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to test integrations',
      code: 'TEST_INTEGRATIONS_FAILED',
    });
  }
});

/**
 * GET /api/admin/health
 *
 * Get comprehensive system health status.
 * Checks queues, Redis, and database.
 */
router.get('/health', adminAuth, async (req: AdminRequest, res: Response) => {
  const correlationId = req.correlationId || 'unknown';

  try {
    const health = await getSystemHealth(correlationId);

    // Return appropriate status code based on health
    const statusCode = health.status === 'down' ? 503 :
                       health.status === 'degraded' ? 200 : 200;

    return res.status(statusCode).json({
      success: true,
      data: health,
    });

  } catch (error: any) {
    logger.error('Failed to get system health', {
      correlationId,
      error: error.message,
    });

    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to get system health',
      code: 'HEALTH_CHECK_FAILED',
    });
  }
});

/**
 * GET /api/admin/dlq
 *
 * Get failed jobs from dead letter queue.
 * Query params:
 * - limit: number (default 50, max 100)
 * - offset: number (default 0)
 * - queue: 'all' | 'tavus-webhooks' | 'retell-webhooks' | 'ghl-sync'
 */
router.get('/dlq', adminAuth, async (req: AdminRequest, res: Response) => {
  const correlationId = req.correlationId || 'unknown';

  try {
    // Validate query params
    const parseResult = DLQQuerySchema.safeParse(req.query);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
        code: 'VALIDATION_ERROR',
        details: parseResult.error.errors,
      });
    }

    const options = parseResult.data;

    const result = await getFailedJobs(
      {
        limit: options.limit,
        offset: options.offset,
        queue: options.queue,
      },
      correlationId
    );

    return res.json({
      success: true,
      data: {
        ...result,
        pagination: {
          limit: options.limit || 50,
          offset: options.offset || 0,
          has_more: result.jobs.length === (options.limit || 50),
        },
      },
    });

  } catch (error: any) {
    logger.error('Failed to get DLQ jobs', {
      correlationId,
      error: error.message,
    });

    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to get failed jobs',
      code: 'DLQ_FETCH_FAILED',
    });
  }
});

/**
 * POST /api/admin/dlq/retry
 *
 * Retry failed jobs.
 * Body: { job_ids: ["id1", "id2"] }
 */
router.post('/dlq/retry', adminAuth, async (req: AdminRequest, res: Response) => {
  const correlationId = req.correlationId || 'unknown';

  try {
    // Validate input
    const parseResult = RetryJobsSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        code: 'VALIDATION_ERROR',
        details: parseResult.error.errors,
      });
    }

    const { job_ids } = parseResult.data;

    const result = await retryFailedJobs(job_ids, correlationId);

    logger.info('DLQ retry completed', {
      correlationId,
      retried: result.retried.length,
      failed: result.failed.length,
    });

    return res.json({
      success: true,
      data: result,
    });

  } catch (error: any) {
    logger.error('Failed to retry jobs', {
      correlationId,
      error: error.message,
    });

    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to retry jobs',
      code: 'DLQ_RETRY_FAILED',
    });
  }
});

/**
 * GET /api/admin/metrics
 *
 * Get aggregated analytics for a date range.
 * Query params:
 * - start_date: YYYY-MM-DD
 * - end_date: YYYY-MM-DD
 */
router.get('/metrics', adminAuth, async (req: AdminRequest, res: Response) => {
  const correlationId = req.correlationId || 'unknown';

  try {
    // Validate query params
    const parseResult = MetricsQuerySchema.safeParse(req.query);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid query parameters. Required: start_date (YYYY-MM-DD), end_date (YYYY-MM-DD)',
        code: 'VALIDATION_ERROR',
        details: parseResult.error.errors,
      });
    }

    const { start_date, end_date } = parseResult.data;

    // Validate date range (max 90 days)
    const start = new Date(start_date);
    const end = new Date(end_date);
    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays > 90) {
      return res.status(400).json({
        success: false,
        error: 'Date range cannot exceed 90 days',
        code: 'INVALID_DATE_RANGE',
      });
    }

    if (end < start) {
      return res.status(400).json({
        success: false,
        error: 'end_date must be after start_date',
        code: 'INVALID_DATE_RANGE',
      });
    }

    const metrics = await getAggregatedMetrics(start_date, end_date, correlationId);

    return res.json({
      success: true,
      data: metrics,
    });

  } catch (error: any) {
    logger.error('Failed to get metrics', {
      correlationId,
      error: error.message,
    });

    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to get metrics',
      code: 'METRICS_FETCH_FAILED',
    });
  }
});

export default router;
