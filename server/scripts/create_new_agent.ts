import Retell from 'retell-sdk';

// @ts-ignore
const retell = new Retell({
  apiKey: process.env.RETELL_API_KEY || '',
});

async function createAgent() {
  try {
    console.log('🔍 Fetching existing agents to clone Webhook URL...');
    const agents = await retell.agent.list();
    // @ts-ignore
    const existingAgent = agents[0]; // Just grab the first one as template
    // @ts-ignore
    const webhookUrl = existingAgent?.webhook_url || "https://estopperich.app.n8n.cloud/webhook/retell-webhook";
    
    console.log(`🔗 Using Webhook URL: ${webhookUrl}`);

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

    console.log('🚀 Creating LLM...');
    // 1. Create LLM
    const llm = await retell.llm.create({
      // @ts-ignore
      model: 'gpt-4o',
      general_prompt: UNIFIED_PROMPT,
    });

    console.log('✅ LLM Created:', llm.llm_id);

    // 2. Create Agent
    console.log('🚀 Creating Agent...');
    const agent = await retell.agent.create({
      agent_name: 'Maria (Legal Compliant)',
      voice_id: '11labs-Cimo', // Keeping Cimo per config, user can switch in dashboard
      response_engine: {
        type: 'retell-llm',
        llm_id: llm.llm_id
      },
      webhook_url: webhookUrl,
      language: 'en-US',
      boosted_keywords: ['Nissan', 'Titan', 'Rogue', 'Altima', 'frontier', 'showroom', 'appraisal'],
      interruption_sensitivity: 1.0, // High sensitivity for "barge-in"
    });

    console.log('✅ Agent Created Successfully!');
    console.log('---------------------------------------------------');
    console.log(`AGENT ID: ${agent.agent_id}`);
    console.log('---------------------------------------------------');
    console.log('👉 Please update your .env or controller with this ID.');
  
  } catch (error) {
     console.error('❌ Error creating agent:', error);
  }
}

createAgent();
