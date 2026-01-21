import { Router } from 'express';
import { retellService } from './retell.service';

const router = Router();

// GET /api/voice/candidates
// Returns list of available voice agents
router.get('/candidates', async (req, res) => {
  try {
    const candidates = await retellService.getCandidates();
    res.json({ success: true, data: candidates });
  } catch (error) {
    console.error('Error fetching voice candidates:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch candidates' });
  }
});

// POST /api/voice/call
// Initiates a call to a candidate
router.post('/call', async (req, res) => {
  try {
    const { agentId, userPhone } = req.body;
    // TODO: Implement actual phone call logic using Retell SDK
    res.json({ success: true, message: 'Call initiated (mock)' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to initiate call' });
  }
});

export default router;
