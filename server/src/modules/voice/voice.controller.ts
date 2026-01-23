import { Router, Request, Response } from 'express';
import Retell from 'retell-sdk';

const router = Router();

// Initialize Retell SDK
const retell = new Retell({
  apiKey: process.env.RETELL_API_KEY || '',
});

// Olivia Agent Configuration
const OLIVIA_AGENT_ID = process.env.RETELL_AGENT_ID || '';
const FROM_NUMBER = process.env.RETELL_FROM_NUMBER || '+14077594100';

// Shared Handler for Triggering Calls
const triggerCallHandler = async (req: Request, res: Response) => {
  try {
    const { 
      name, 
      phone, 
      car_model,
      customer_name,
      manager_name,
      offer_expiration 
    } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, error: 'Phone number is required' });
    }

    if (!process.env.RETELL_API_KEY || !OLIVIA_AGENT_ID) {
      console.error('Missing RETELL_API_KEY or RETELL_AGENT_ID');
      return res.status(500).json({ success: false, error: 'Retell not configured' });
    }

    console.log(`📞 Triggering Olivia call to: ${phone}`);
    console.log(`👤 Customer: ${customer_name || name}`);
    console.log(`🚗 Vehicle: ${car_model}`);

    const call = await retell.call.createPhoneCall({
      from_number: FROM_NUMBER,
      to_number: phone,
      override_agent_id: OLIVIA_AGENT_ID,
      retell_llm_dynamic_variables: {
        customer_name: customer_name || name || 'there',
        car_model: car_model || 'your vehicle',
        manager_name: manager_name || 'Marcus',
        offer_expiration: offer_expiration || 'this Friday'
      },
      metadata: {
        source: 'lovable_demo',
        campaign: 'vip_buyback'
      }
    });

    console.log(`✅ Call initiated: ${call.call_id}`);

    return res.json({
      success: true,
      call_id: call.call_id,
      status: call.call_status
    });

  } catch (error: any) {
    console.error('❌ Retell call error:', error.message || error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to initiate call' 
    });
  }
};

// POST /api/voice/trigger-call
router.post('/trigger-call', triggerCallHandler);

// POST /api/voice/trigger-call-demo (Legacy compatibility)
router.post('/trigger-call-demo', triggerCallHandler);

// GET /api/voice/candidates
router.get('/candidates', async (_req: Request, res: Response) => {
  try {
    const agents = await retell.agent.list();
    res.json({ success: true, data: agents });
  } catch (error: any) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch agents' });
  }
});

export default router;
