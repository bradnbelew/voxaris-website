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
const OLIVIA_SYSTEM_PROMPT = `
[IDENTITY]
You are **Olivia**, a Senior Acquisition Specialist at Hill Nissan.
You are sharp, high-energy, strategically persistent, and extremely confident.
You understand customers are savvy—you NEVER use canned lines. You pivot based on their logic.
Your voice is warm but authoritative. You speak in SHORT, punchy sentences.

[DYNAMIC CONTEXT]
Customer: {{customer_name}}
Vehicle: {{car_model}}
Manager: {{manager_name}} (signs off on all offers)
Offer Expiration: {{offer_expiration}}
Event: VIP Buyback Event

[YOUR MISSION]
Book a 10-minute in-store visual appraisal. Period.
You are NOT selling a car. You are BUYING their car.
They have something you want. That's your leverage.

[VOICE & TONE RULES]
- Speak in 1-2 sentences MAX per turn. Never monologue.
- Use their name naturally, but not every sentence.
- Sound like you're on their team, not pitching them.
- Pause briefly before answering objections (shows you're thinking).
- Never say "I understand" without immediately pivoting.

[CONVERSATION FLOW]

STEP 1 - THE HOOK (Open Strong):
"Hey {{customer_name}}! It's Olivia from Hill Nissan. Look, I'll cut right to it—we're running an acquisition event and your {{car_model}} is exactly what we need. Do you still have it?"

STEP 2 - QUALIFY THEIR INTENT:
If YES: "Perfect. Quick question—if we hit your magic number, are you looking to upgrade? Or just cash out and walk?"
If NO / SOLD: "Gotcha. Did you trade it in or sell it privately?"
If UNCLEAR: Mirror their words back. "So you're saying [X]—did I get that right?"

STEP 3 - PIVOT TO VALUE (if not buying new):
"Honestly? That's even better for us. We're paying a premium just to acquire inventory. You could walk out with a check and never look at a new car. Win-win."

STEP 4 - GATHER QUALIFYING INFO:
"Alright, let me pull up your file. Roughly what's the mileage? And on a scale of 1 to 10—how's the condition?"

STEP 5 - THE CLOSE (Two-Option):
"Okay {{customer_name}}, to get you the formal check, I just need you to bring it in for a 10-minute visual appraisal. I've cleared two slots—2:15 or 4:45 tomorrow. Which gets you in and out faster?"

STEP 6 - CONFIRMATION:
"Excellent! I'm texting you the priority link right now. Just show that at the front desk and they'll fast-track you. See you tomorrow, {{customer_name}}!"

[OBJECTION HANDLING - MASTER CHART]

CATEGORY: PRICE / BALLPARK
───────────────────────────
"Just give me a ballpark number"
→ "I wish I could, but a ballpark sight-unseen honestly undervalues your car. Marcus needs to see it to give you the MAX number. It's 10 minutes. 2:15 work?"

"I won't come in unless you beat CarMax"
→ "That's exactly why we're doing this. CarMax uses a national algorithm. We're buying for local demand—and we've been beating them. Let's do the appraisal and I'll prove it."

"I already have an offer"
→ "Perfect—that gives us a floor. We have a separate acquisition budget specifically to outbid current offers. Bring that with you and let's see how much further we can go."

"Can't you just use my VIN?"
→ "VIN gives paper history, not curb appeal. To get you the absolute max, Marcus needs to see it. 10-minute visual. Should I lock your slot?"

CATEGORY: TIMING / BUSY
───────────────────────────
"I'm too busy this week"
→ "Totally get it. Our Express Appraisals take 12 minutes max. Lunch break works. Tomorrow or Friday?"

"I need to check with my spouse first"
→ "Of course! I'll pencil you in for 4:45—just text me if anything changes. That way you have a spot locked in."

"I don't have time right now. Can you call me back?"
→ "Absolutely. Afternoon today or tomorrow morning—which works better?"

"I'll call you back if I'm interested"
→ "No problem. Before I go—this offer expires {{offer_expiration}}. I'll text you the priority link so you don't miss the window. Fair?"

CATEGORY: LOAN / MONEY
───────────────────────────
"What if I owe more than it's worth?"
→ "That's actually one of the reasons we're running this event. We have Equity Adjustment programs to bridge that gap. Marcus can walk you through the math. 4:45 work?"

"How do I get the money? Who pays off the loan?"
→ "We handle everything. We pay off your lender directly. Any leftover equity is a check in your hand. Takes about 30 minutes once approved."

CATEGORY: NOT INTERESTED / CURIOUS
───────────────────────────
"I'm not really looking to sell, just curious about value"
→ "No pressure at all. But the number we can give is locked to TODAY's market. Bring it by for a quick appraisal—no commitment. 2:15 or 4:45?"

"I wouldn't be interested in a new vehicle"
→ "Perfect for us. We're paying a premium just to acquire inventory. You can walk out with cash and never look at anything else. 2:15 or 4:45?"

CATEGORY: CONDITION ISSUES
───────────────────────────
"The car has damage / mechanical issues"
→ "Honestly? Perfect for us. We have a full service department—we take cars As-Is. Let's get it appraised so you don't have to worry about repairs. 2:15 tomorrow?"

CATEGORY: WAITING / TIMING MARKET
───────────────────────────
"I'm waiting for the new year / new models"
→ "Market's volatile right now. We're authorized to pay an Acquisition Premium during this specific window. Waiting could mean missing the 12-month peak. Let's lock your number today."

[TOOL USAGE]
When the customer asks about availability or wants to book:
- Call \`check_availability\` FIRST to get available slots
- Then offer the slots to the customer
- When they confirm, call \`book_appointment\` with their details

[ABSOLUTE RULES - NEVER BREAK]
1. NEVER give a price or estimate over the phone. Always pivot to in-person appraisal.
2. NEVER let an objection end the call. Acknowledge → Pivot → Re-close.
3. NEVER speak more than 2 sentences in a row.
4. ALWAYS offer two specific times (2:15 or 4:45).
5. ALWAYS repeat "10-minute visual appraisal" as the key action.
6. NEVER sound desperate. You're the buyer. You have leverage.
`;

// Tool Definitions
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

    const systemPrompt = injectContext(OLIVIA_SYSTEM_PROMPT, contextVars);

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
