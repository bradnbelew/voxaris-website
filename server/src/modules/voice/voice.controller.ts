import { Router, Request, Response } from 'express';
import Retell from 'retell-sdk';

const router = Router();

// Initialize Retell SDK
const retell = new Retell({
  apiKey: process.env.RETELL_API_KEY || '',
});

// Olivia Agent Configuration (Maria Compliant)
const OLIVIA_AGENT_ID = process.env.RETELL_AGENT_ID || 'agent_c5705b577a4455053548843fd5';
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
      offer_expiration,
      agent_type = 'outbound'
    } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, error: 'Phone number is required' });
    }

    if (!process.env.RETELL_API_KEY || !OLIVIA_AGENT_ID) {
      console.error('Missing RETELL_API_KEY or RETELL_AGENT_ID');
      return res.status(500).json({ success: false, error: 'Retell not configured' });
    }

    console.log(`📞 Triggering Maria (${agent_type}) call to: ${phone}`);
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
        offer_expiration: offer_expiration || 'this Friday',
        agent_type: agent_type
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

// Provision Agent Handler (Server-Side to utilize Render Params)
const provisionAgentHandler = async (_req: Request, res: Response) => {
  try {
    console.log('🚀 Provisioning new Maria Agent...');

    // 1. Fetch Existing Webhook
    const agents = await retell.agent.list();
    // @ts-ignore
    const existingAgent = agents[0];
    // @ts-ignore
    const webhookUrl = existingAgent?.webhook_url || "https://estopperich.app.n8n.cloud/webhook/retell-webhook";

    const UNIFIED_PROMPT = `
[IDENTITY & CORE DIRECTIVE]
**Name:** Maria
**Role:** Senior Acquisition Manager @ Hill Nissan
**Vibe:** Professional, Warm, Unshakeable.
**Context:** Your behavior depends on the {{agent_type}} variable. 
- If 'inbound': You are receiving a call about a PAYMENT SWAP mailer.
- If 'outbound': You are calling about a HANDWRITTEN NOTE.

**THE PRIME DIRECTIVE:**
Your ONLY goal is to **Get them to the SHOWROOM**.

[LEGAL & COMPLIANCE GUARDRAILS]
1. **AI Disclosure:** You must state: "This is Maria, an AI assistant with Hill Nissan" in the opening.
2. **"Up to" is Key:** ALWAYS say "up to $5,000 over" or "based on visual inspection".
3. **Credit Disclaimer:** Mentions of 0% APR or payments MUST be followed by "with approved credit" or "W.A.C.".

[LOGIC BRANCH: INBOUND (Payment Swap)]
(Triggered when {{agent_type}} is 'inbound')
**Hook:** "Thank you for calling the Hill Nissan Buyback Hotline. This is Maria, an automated specialist on a recorded line. Are you calling to activate your voucher?"
**Goal:** Verify "Payment Swap Code" -> Book 10-min Activation at Showroom.
**Offers:** "Pre-qualified for Upgrade Program" (Estimate based on prescreen). Explain that "Pre-approval up to $39k" is estimated.

[LOGIC BRANCH: OUTBOUND (Handwritten Note)]
(Triggered when {{agent_type}} is 'outbound' or empty)
**Hook:** "Hi {{customer_name}}, this is Maria, an AI assistant from Hill Nissan. I sent you a handwritten note about your {{car_model}}..."
**Goal:** Specific Buyer Request -> Book 10-min Appraisal at Showroom.
**Offers:** "Up to $5,000 over KBB" (Pending visual inspection).

[COMMON RULES]
1. NEVER give a price over phone. Pivot to Showroom.
2. ALWAYS offer two specific times (2:15 or 4:45).
3. SHORT sentences (max 15 words). Allow interruption.
`;

    // 2. Create Custom LLM
    const llm = await retell.llm.create({
      // @ts-ignore
      model: 'gpt-4o',
      general_prompt: UNIFIED_PROMPT,
    });
    console.log('✅ LLM Created:', llm.llm_id);

    // 3. Create Agent
    const agent = await retell.agent.create({
      agent_name: 'Maria (Legal Compliant)',
      voice_id: '11labs-Cimo',
      response_engine: {
        type: 'retell-llm',
        llm_id: llm.llm_id
      },
      webhook_url: webhookUrl,
      language: 'en-US',
      boosted_keywords: ['Nissan', 'Titan', 'Rogue', 'Altima', 'Showroom'],
      interruption_sensitivity: 1.0
    });

    console.log('✅ Agent Created:', agent.agent_id);

    return res.json({
      success: true,
      agent_id: agent.agent_id,
      llm_id: llm.llm_id,
      message: 'Agent provisioned successfully. Please update RETELL_AGENT_ID env var.'
    });

  } catch (error: any) {
    console.error('❌ Provisioning Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

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

// POST /api/voice/provision-agent
router.post('/provision-agent', provisionAgentHandler);

export default router;
