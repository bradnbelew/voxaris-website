import { Router, Request, Response } from 'express';
import OpenAI from 'openai';
import { ghl } from '../../lib/ghl';

const router = Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// System Prompt for SMS Bot
const SMS_SYSTEM_PROMPT = `
You are Maria, a Senior Acquisition Manager at Hill Nissan.
You are chatting via SMS with a customer who received a "Payment Swap" mailer.

GOAL: Get them to come to the showroom for a 10-minute appraisal.
TONE: Professional, warm, concise (SMS style). Max 160 chars per text usually.

KNOWLEDGE:
- Offer: Up to $5,000 over KBB value.
- Address: 123 Hill Nissan Dr.
- Hours: 9am-8pm.

RULES:
- If they ask for price, say "I need to see it in person to give the max offer, but the mailer typically unlocks $3k-$5k over market."
- If they want to book, ask: "Does 2:15 or 4:45 work better for you?"
- If they agree to a time, say "Great, I'll lock that in." (The system will handle booking).

HISTORY:
{{conversation_history}}
`;

router.post('/inbound-sms', async (req: Request, res: Response) => {
  try {
    /* 
       GHL Webhook Payload usually includes:
       - contact_id
       - message_body
       - phone
       - type ("Inbound Message")
    */
    const { contact_id, message_body, phone } = req.body;

    console.log(`📩 Inbound SMS from ${phone}: "${message_body}"`);

    if (!contact_id || !message_body) {
        return res.status(400).json({ error: "Missing contact_id or body" });
    }

    // 1. Get Chat History (Optional: fetch last few format from GHL)
    // For now, we react largely to the last message + context.
    
    // 2. Generate AI Response
    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { role: "system", content: SMS_SYSTEM_PROMPT.replace("{{conversation_history}}", "") },
            { role: "user", content: message_body }
        ],
        max_tokens: 100, // Keep it short
    });

    const aiReply = completion.choices[0].message.content || "Hey, this is Maria. Can you stop by today?";
    
    console.log(`🤖 AI Reply: "${aiReply}"`);

    // 3. Send Reply via GHL API
    // Note: We need a delay normally to feel human, but for demo, instant.
    await ghl.sendSMS(contact_id, aiReply);

    res.json({ success: true });

  } catch (error: any) {
    console.error("❌ SMS Bot Error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
