import { Router, Request, Response } from 'express';
import { AnalyticsService } from './analytics.service';

const router = Router();
const analyticsService = new AnalyticsService();

// ==========================================
// MED SPA ANALYTICS API
// ==========================================

/**
 * GET /api/analytics/medspa/:clientId
 * Returns comprehensive analytics for a med spa client
 */
router.get('/medspa/:clientId', async (req: Request, res: Response) => {
  try {
    const { clientId } = req.params;
    const days = parseInt(req.query.days as string) || 30;

    console.log(`📊 Med Spa Analytics requested for client: ${clientId} (${days} days)`);

    const analytics = await analyticsService.getMedSpaAnalytics(clientId, days);

    res.json({
      success: true,
      data: analytics
    });

  } catch (error: any) {
    console.error('❌ Med Spa Analytics Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/analytics/medspa/:clientId/calls
 * Returns paginated list of calls for a client
 */
router.get('/medspa/:clientId/calls', async (req: Request, res: Response) => {
  try {
    const { clientId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    console.log(`📞 Med Spa Calls requested for client: ${clientId} (page ${page})`);

    const calls = await analyticsService.listMedSpaCalls(clientId, page, limit);

    res.json({
      success: true,
      ...calls
    });

  } catch (error: any) {
    console.error('❌ Med Spa Calls Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/analytics/medspa/call/:callId
 * Returns detailed information for a single call
 */
router.get('/medspa/call/:callId', async (req: Request, res: Response) => {
  try {
    const { callId } = req.params;

    console.log(`📞 Med Spa Call Detail requested: ${callId}`);

    const call = await analyticsService.getMedSpaCallDetail(callId);

    if (!call) {
      return res.status(404).json({
        success: false,
        error: 'Call not found'
      });
    }

    res.json({
      success: true,
      data: call
    });

  } catch (error: any) {
    console.error('❌ Med Spa Call Detail Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/analytics/medspa/:clientId/usage
 * Returns usage/billing metrics for a client (minutes consumed)
 */
router.get('/medspa/:clientId/usage', async (req: Request, res: Response) => {
  try {
    const { clientId } = req.params;
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

    console.log(`📊 Med Spa Usage requested for client: ${clientId}`);

    const usage = await analyticsService.getUsageMetrics(clientId, startDate, endDate);

    res.json({
      success: true,
      data: usage
    });

  } catch (error: any) {
    console.error('❌ Med Spa Usage Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
