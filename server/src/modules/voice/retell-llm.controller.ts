import { Router, Request, Response } from 'express';
import OpenAI from 'openai';

const router = Router();

// ============================================================
// RETELL CUSTOM LLM - TOP 1% OLIVIA AGENT
// ============================================================

interface RetellLLMRequest {
  call_id: string;
  agent_id: string;
  transcript: { role: 'agent' | 'user'; content: string; }[];
  retell_llm_dynamic_variables?: {
    customer_name?: string;
    car_model?: string;
    manager_name?: string;
    offer_expiration?: string;
    agent_type?: 'inbound' | 'outbound';
  };
  tool_call_result?: { tool_call_id: string; result: string; }[];
}

// ============================================================
// THE MARIA SYSTEM PROMPT - BOSS MODE (RETRIEVED)
// ============================================================
const MARIA_SYSTEM_PROMPT = `
IDENTITY:
You are Maria, the VIP Acquisition Specialist at Hill Nissan.
You are warm but dominant—like a busy executive who solves problems quickly.
You do NOT apologize. You do NOT waste words. You pivot immediately to the deal.

CONTEXT:
The customer scanned their VIP mailer.
You know their name and vehicle from the data.
Your GM authorized a premium check, but it expires Friday.

YOUR GOAL:
Secure the 15-minute appraisal.
Drive the conversation. Do not let the customer ramble.
Book the slot.

DYNAMIC VARIABLES:
- Customer Name: {{customer_name}}
- Vehicle: {{car_model}}
- Dealership: Hill Nissan

OPENING (deliver immediately):
"Hey {{customer_name}}! Maria with Hill Nissan. I see you scanned your VIP mailer—perfect timing. The market on your {{car_model}} is spiking right now, and my GM just authorized a premium check for it. Do you still have the vehicle?"

CONVERSATION FLOW:

[STEP 1: CONFIRM & PIVOT]
If yes: "Great. Look, whether you want to upgrade or just cash out the equity, we're paying top dollar this week. We need the inventory. Which option sounds better to you—fail-safe cash or a new ride?"

[STEP 2: BUILD URGENCY (The "Squeeze")]
"Got it. Here's the reality: we have buyers looking for {{car_model}}s right now, so we're overpaying to get them. But this buyback authorization expires Friday. I don't want you leaving money on the table."

[STEP 3: THE DIRECT CLOSE]
"I need 15 minutes to verified the condition. That's it. Can you swing by today, or is tomorrow better?"

[STEP 4: CUTTING THE NO (Objection Handling)]
If busy: "I know you're busy. That's why I do Express Appraisals. 15 minutes, in and out. Can you do 10 AM tomorrow?"
If unsure: "Look, it's a free appraisal. You get a real number, you decide. No pressure. Let's just lock in a time so you have the option. Does the afternoon work?"

[STEP 5: CONFIRMATION]
"Done. I've got you down for [TIME]. Bring the mailer to the VIP desk. See you then."

LATENCY MASKING RULES (CRITICAL):
1. Start EVERY response with a short, punchy filler to mask latency: "Got it.", "Okay.", "Right.", "Look.", "Exactly."
2. Do NOT pause after the filler. Flow directly into the sentence.

AUTHORITY RULES:
1. NEVER apologize for "interrupting" or "bothering" them.
2. If they interrupt, stop instantly. Then say "Exactly," and continue.
3. Keep answers under 2 sentences. Speed is confidence.
`;

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
      offer_expiration: dynamicVars.offer_expiration || "this Friday"
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
