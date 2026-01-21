import { Router, Request, Response } from 'express';
import { AnalyticsService } from './analytics.service';

const router = Router();
const analyticsService = new AnalyticsService();

// GET /api/analytics/calls
router.get('/calls', async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const calls = await analyticsService.listCalls(limit);
    res.json({ success: true, data: calls });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch calls' });
  }
});

// GET /api/analytics/calls/:callId
router.get('/calls/:callId', async (req: Request, res: Response) => {
  try {
    const { callId } = req.params;
    const call = await analyticsService.getCall(callId);
    if (!call) {
         res.status(404).json({ success: false, error: 'Call not found' });
         return;
    }
    res.json({ success: true, data: call });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch call details' });
  }
});

// GET /api/analytics/retell/summary
router.get('/retell/summary', async (req: Request, res: Response) => {
    try {
        const days = req.query.days ? parseInt(req.query.days as string) : 7;
        const metrics = await analyticsService.getRetellAnalytics(days);
        res.json({ success: true, data: metrics });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to compute analytics' });
    }
});

// GET /api/analytics/tavus/conversations
router.get('/tavus/conversations', async (req: Request, res: Response) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
        const conversations = await analyticsService.listTavusConversations(limit);
        res.json({ success: true, data: conversations });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch video conversations' });
    }
});

// GET /api/analytics/tavus/conversations/:id
router.get('/tavus/conversations/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const conversation = await analyticsService.getTavusConversation(id);
        if (!conversation) {
            res.status(404).json({ success: false, error: 'Conversation not found' });
            return;
        }
        res.json({ success: true, data: conversation });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch video details' });
    }
});

export default router;
