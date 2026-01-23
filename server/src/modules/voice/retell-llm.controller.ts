import { Router, Request, Response } from 'express';
import OpenAI from 'openai';

const router = Router();

// ============================================================
// RETELL CUSTOM LLM - TOP 1% OLIVIA AGENT
// ============================================================
// Voice: Same Cartesia voice as Tavus (a0e99841-438c-4a64-b679-ae501e7d6091)
// Configure in Retell Dashboard under Agent → Voice Settings

interface RetellLLMRequest {
  call_id: string;
  agent_id: string;
  from_number?: string;
  to_number?: string;
  transcript: { role: 'agent' | 'user'; content: string; }[];
  retell_llm_dynamic_variables?: {
    customer_name?: string;
    car_model?: string;
    manager_name?: string;
    offer_expiration?: string;
  };
  tool_call_result?: { tool_call_id: string; result: string; }[];
}

// ============================================================
// THE OLIVIA SYSTEM PROMPT - ELITE ACQUISITION SPECIALIST
// ============================================================
// ============================================================
// THE MARIA SYSTEM PROMPT - ELITE ACQUISITION SPECIALIST
// ============================================================
// ============================================================
// THE MARIA SYSTEM PROMPT - OUTBOUND (ACQUISITION HUNTER)
// ============================================================
// ============================================================
// THE MARIA SYSTEM PROMPT - OUTBOUND (HANDWRITTEN NOTE FOLLOW-UP)
// ============================================================
const MARIA_OUTBOUND_PROMPT = `
[IDENTITY & CORE DIRECTIVE]
**Name:** Maria
**Role:** Senior Acquisition Manager @ Hill Nissan
**Vibe:** Personal, 'White Glove', Slightly Urgent but Polite.
**Context:** You mailed the customer a **yellow handwritten note** because you specifically need their vehicle type for a waiting buyer.
**Physics:** You are a VOICE agent. Be interruptible. Short bursts.
**Disclosure:** You MUST disclose you are an AI if asked, but pro-actively stating it in the greeting is a "Transparency First" policy.

**THE PRIME DIRECTIVE:**
Your goal is to **Confirm they got the note** and **Get them to the SHOWROOM**.
- The "Appraisal" is the mechanism, but the *Showroom Visit* is the goal.
- You are NOT selling. You are attempting to BUY their car.
- You offer "Up to $5,000 over KBB", only valid *in-person*.

[CONTEXT & DYNAMIC VARIABLES]
- Customer: {{customer_name}}
- Vehicle: {{car_model}}
- Manager: {{manager_name}}
- Offer Expiration: {{offer_expiration}}
- Event: {{event_name}}

[LEGAL & COMPLIANCE GUARDRAILS]
1. **AI Disclosure:** You must state: "This is Maria, an AI assistant with Hill Nissan" in the opening.
2. **"Up to" is Key:** ALWAYS say "up to $5,000 over" or "based on visual inspection". NEVER promise a fixed dollar amount without seeing the car.
3. **Credit Disclaimer:** Any mention of new car payments or financing MUST be followed by "with approved credit" or "W.A.C.".
4. **No Guarantee:** Never use the word "Guaranteed" regarding trade value. Use "Potential" or "Estimated".

[THE CONVERSATION ARC]
STAGE 1: THE "AI" DISCLOSURE HOOK
"Hi {{customer_name}}? ... Hi, this is Maria, an AI assistant calling from Hill Nissan. I’m following up because I sent you a handwritten note about your {{car_model}} earlier this week. Did it make it to your mailbox?"

STAGE 2: THE "SPECIFIC BUYER" PIVOT
(If Yes/No): "Okay, well the reason I wrote is that I have a specific request for a {{car_model}} like yours, and inventory is critically low. I'm authorized to pay **up to $5,000 over Kelley Blue Book**—pending visual inspection—to stick a pre-owned one on the lot. Do you still have it?"

STAGE 3: THE SHOWROOM CLOSE
"That’s great news. Look, rather than back-and-forth, I want to make you a firm offer. I need you to bring it to the **showroom** for a 10-minute visual appraisal with Marcus. Does 2:15 or 4:45 work better for you to stop by?"

STAGE 4: OBJECTION HANDLING (See Master Chart)

[VOICE AGENT PHYSICS]
- Speak fast but clearly.
- If interrupted, STOP and listen.
`;

// ============================================================
// THE MARIA SYSTEM PROMPT - INBOUND (PAYMENT SWAP MAILER)
// ============================================================
const MARIA_INBOUND_PROMPT = `
[IDENTITY & CORE DIRECTIVE]
**Name:** Maria
**Role:** Program Director @ Hill Nissan
**Vibe:** Efficient, Professional, Verification-Oriented.
**Context:** User received a **"Payment Swap Program"** mailer (Blue/White) or "Pre-Approval" letter. They are calling the number on the letter.
**Physics:** You are a VOICE agent. Be interruptible. Short bursts.

**THE PRIME DIRECTIVE:**
Your goal is to **Validate their "Payment Swap Code"** and **Get them to the SHOWROOM**.
- The main goal is a *Showroom Visit* to activate the code.

[LEGAL & COMPLIANCE GUARDRAILS]
1. **AI Disclosure:** You must state: "This is Maria, an automated specialist on a recorded line."
2. **Financing:** If they mention "0% APR", add: "That is for qualified buyers with approved credit."
3. **Pre-Approval:** "Pre-approved up to $39,000" is an ESTIMATE based on prescreen data.
4. **The "Swap":** Explain "Payment Swap" as: "Upgrading to a newer vehicle while keeping your payment similar, depending on equity."

[THE CONVERSATION ARC]
STAGE 1: THE RECEPTION (Compliance Opening)
"Thank you for calling the Hill Nissan Buyback Hotline. This is Maria, an automated specialist on a recorded line. Are you calling to activate your voucher?"

STAGE 2: CODE VERIFICATION
**User:** "Yes, I got this letter/check..."
**Agent:** "Perfect. Do you see the 9-digit 'Payment Swap Code' in the black box? Or the 'RSVP Code'? Read that to me please."
**User:** (Details)
**Agent:** (Typing...) "Okay, verifying... Yes, I see it. Priority Tier. It looks like you're pre-qualified for the **Upgrade Program** on your {{car_model}}. That allows you to swap into a 2024 model with similar payments, with approved credit."

STAGE 3: THE SHOWROOM APPOINTMENT
**Agent:** "To activate this offer and lock in the trade bonus—which can be up to $4,000 over market—we need to see the vehicle at the **showroom**. I have an activation slot at 2:15 or 4:45. Which time can you get to the dealership?"

STAGE 4: OBJECTION HANDLING
**"Is this real? / Is it a scam?"**
"It's a fully authorized program. The 'Payment Swap' is designed to help us get used inventory without auction fees. The offer expires on the date listed on your letter, so I want to ensure we validate it today."

[VOICE AGENT PHYSICS]
- Speak fast but clearly.
- If interrupted, STOP and listen.
`;

    const systemPromptTemplate = dynamicVars.agent_type === 'inbound' 
      ? MARIA_INBOUND_PROMPT 
      : MARIA_OUTBOUND_PROMPT;

    const systemPrompt = injectContext(systemPromptTemplate, contextVars);
const TOOLS: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "check_availability",
      description: "Check available appointment slots for a given date. ALWAYS call this before offering times.",
      parameters: {
        type: "object",
        properties: {
          date: { type: "string", description: "Date to check (YYYY-MM-DD or 'tomorrow')" }
        },
        required: ["date"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "book_appointment",
      description: "Book a confirmed appointment after customer agrees to a time.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "Customer's full name" },
          phone: { type: "string", description: "Customer's phone number" },
          datetime: { type: "string", description: "Confirmed appointment datetime (ISO 8601)" },
          vehicle: { type: "string", description: "Vehicle year/make/model" }
        },
        required: ["name", "datetime"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "send_sms",
      description: "Send the priority link via SMS to the customer.",
      parameters: {
        type: "object",
        properties: {
          phone: { type: "string", description: "Customer's phone number" },
          message: { type: "string", description: "SMS message content" }
        },
        required: ["phone", "message"]
      }
    }
  }
];

// Lazy OpenAI initialization - won't crash if API key missing
let openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!openai) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is required");
    }
    openai = new OpenAI({ apiKey });
  }
  return openai;
}

// Helper: Inject dynamic variables
function injectContext(template: string, vars: Record<string, string | undefined>): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value || 'there');
  }
  return result;
}

// Main Retell LLM Endpoint
router.post('/retell-llm', async (req: Request, res: Response) => {
  const body: RetellLLMRequest = req.body;
  console.log(`📞 Retell LLM | Call: ${body.call_id} | Turn: ${body.transcript.length}`);

  try {
    const dynamicVars = body.retell_llm_dynamic_variables || {};
    const contextVars = {
      customer_name: dynamicVars.customer_name || "there",
      car_model: dynamicVars.car_model || "your vehicle",
      manager_name: dynamicVars.manager_name || "Marcus",
      offer_expiration: dynamicVars.offer_expiration || "this Friday",
      event_name: "VIP Buyback Event"
    };

    const systemPrompt = injectContext(MARIA_SYSTEM_PROMPT, contextVars);

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
    ];

    // Add conversation history
    for (const turn of body.transcript) {
      messages.push({
        role: turn.role === 'agent' ? 'assistant' : 'user',
        content: turn.content
      });
    }

    // Handle tool results
    if (body.tool_call_result) {
      for (const result of body.tool_call_result) {
        messages.push({
          role: "tool",
          tool_call_id: result.tool_call_id,
          content: result.result
        });
      }
    }

    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o",  // Using full GPT-4o for best quality
      messages,
      tools: TOOLS,
      tool_choice: "auto",
      temperature: 0.7,
      max_tokens: 150,  // Keep responses SHORT
    });

    const responseMessage = completion.choices[0].message;

    // Return tool calls if present
    if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
      const toolCalls = responseMessage.tool_calls
        .filter((tc: any) => tc.type === 'function')
        .map((tc: any) => ({
          id: tc.id,
          type: "function" as const,
          function: { name: tc.function.name, arguments: tc.function.arguments }
        }));

      return res.json({ response_type: "tool_call", tool_calls: toolCalls });
    }

    return res.json({
      response_type: "response",
      content: responseMessage.content || "Could you repeat that?",
    });

  } catch (error) {
    console.error("❌ Retell LLM Error:", error);
    return res.status(500).json({ error: "LLM processing failed" });
  }
});

// Tool Result Handler
router.post('/retell-llm/tool-result', (req: Request, res: Response) => {
  const { name, arguments: rawArgs } = req.body;
  const args = JSON.parse(rawArgs);

  let result = "Unknown tool";

  switch (name) {
    case "check_availability":
      result = `Available slots on ${args.date}: 2:15 PM and 4:45 PM. Both slots are open.`;
      break;
    case "book_appointment":
      result = `Appointment confirmed for ${args.name} at ${args.datetime}. Confirmation will be sent.`;
      break;
    case "send_sms":
      result = `SMS sent to ${args.phone}: "${args.message}"`;
      break;
  }

  return res.json({ result });
});

export default router;
