import type { VapiAssistantConfig, VapiTool, VapiSquadConfig } from "@/lib/clients/vapi";

// ── Shared Tools ──

const TOOL_LOOKUP_MEMBER: VapiTool = {
  type: "function",
  function: {
    name: "lookup_member",
    description:
      "Look up a member's account details by phone number or member ID. Returns tier, points balance, renewal date, and recent activity.",
    parameters: {
      type: "object",
      properties: {
        phone_number: {
          type: "string",
          description: "Member's phone number (caller ID or spoken)",
        },
        member_id: {
          type: "string",
          description: "Member ID if provided by the caller",
        },
      },
    },
  },
  messages: [
    { type: "request-start", content: "Let me pull up your account real quick." },
    { type: "request-complete", content: "Got it, I can see your account now." },
    {
      type: "request-failed",
      content: "I'm having a little trouble accessing that. Let me try again.",
    },
  ],
};

const TOOL_CHECK_UPGRADE_PRICING: VapiTool = {
  type: "function",
  function: {
    name: "check_upgrade_pricing",
    description:
      "Get upgrade pricing and active promotions for moving from one tier to another.",
    parameters: {
      type: "object",
      properties: {
        current_tier: { type: "string", description: "Member's current tier" },
        target_tier: { type: "string", description: "Target upgrade tier" },
      },
      required: ["current_tier", "target_tier"],
    },
  },
  messages: [
    { type: "request-start", content: "Let me check the latest pricing for you." },
    { type: "request-complete", content: "Here's what I found." },
  ],
};

const TOOL_LOOKUP_BENEFITS: VapiTool = {
  type: "function",
  function: {
    name: "lookup_member_benefits",
    description:
      "Compare benefits between current and target membership tier. Shows what the member gains by upgrading.",
    parameters: {
      type: "object",
      properties: {
        current_tier: { type: "string" },
        target_tier: { type: "string" },
      },
      required: ["current_tier", "target_tier"],
    },
  },
  messages: [
    { type: "request-start", content: "Let me compare those tiers for you." },
  ],
};

const TOOL_LOG_OBJECTION: VapiTool = {
  type: "function",
  function: {
    name: "log_objection",
    description:
      "Record when a member raises a concern about upgrading. Call this every time the member pushes back.",
    parameters: {
      type: "object",
      properties: {
        objection_type: {
          type: "string",
          enum: ["cost", "timing", "underuse", "skepticism", "commitment", "other"],
        },
        objection_text: { type: "string", description: "What the member said" },
      },
      required: ["objection_type", "objection_text"],
    },
  },
  async: true,
};

const TOOL_MARK_UPGRADE_INTENT: VapiTool = {
  type: "function",
  function: {
    name: "mark_upgrade_intent",
    description:
      "Record that the member expressed clear interest in upgrading. Call when they say yes or ask how to proceed.",
    parameters: {
      type: "object",
      properties: {
        confidence: {
          type: "string",
          enum: ["high", "medium"],
        },
      },
      required: ["confidence"],
    },
  },
};

const TOOL_SCHEDULE_FOLLOW_UP: VapiTool = {
  type: "function",
  function: {
    name: "schedule_follow_up",
    description:
      "Member wants to think about it. Record their follow-up preference.",
    parameters: {
      type: "object",
      properties: {
        follow_up_preference: {
          type: "string",
          description:
            "When/how to follow up (e.g., 'email next week', 'call before renewal')",
        },
      },
      required: ["follow_up_preference"],
    },
  },
};

const TOOL_TRANSFER_TO_HUMAN: VapiTool = {
  type: "function",
  function: {
    name: "transfer_to_human",
    description:
      "Transfer the caller to a live agent. Use only when the member explicitly requests a human or you cannot resolve their issue.",
    parameters: {
      type: "object",
      properties: {
        reason: {
          type: "string",
          description: "Why the transfer is needed",
        },
        department: {
          type: "string",
          enum: ["billing", "bookings", "general", "cancellation"],
        },
      },
      required: ["reason"],
    },
  },
  messages: [
    {
      type: "request-start",
      content: "Of course, let me connect you with a team member.",
    },
  ],
};

const TOOL_SEND_UPGRADE_LINK: VapiTool = {
  type: "function",
  function: {
    name: "send_upgrade_link",
    description:
      "Send the member an SMS or email with their personalized upgrade link. Call when the member is ready to upgrade.",
    parameters: {
      type: "object",
      properties: {
        method: {
          type: "string",
          enum: ["sms", "email"],
          description: "How to send the link",
        },
        member_email: {
          type: "string",
          description: "Member's email (if sending by email)",
        },
      },
      required: ["method"],
    },
  },
  messages: [
    { type: "request-start", content: "Sending that over to you now." },
    { type: "request-complete", content: "Done, you should have it in just a moment." },
  ],
};

// ── Server URL ──

const SERVER_URL = `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/voice/webhooks/vapi`;

// ── Inbound Agent: Greeter/Router ──

const INBOUND_GREETER_CONFIG: VapiAssistantConfig = {
  name: "Arrivia Inbound Greeter",
  firstMessage:
    "Hi there, thanks for calling. My name is Mia and I'm here to help with your travel membership. Can I get your name or member ID to pull up your account?",
  firstMessageMode: "assistant-speaks-first",
  model: {
    provider: "openai",
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are Mia, a friendly travel membership assistant. You answer inbound calls for a travel club.
Your job:
1. Greet the caller warmly
2. Identify them — ask for name or member ID, then call lookup_member
3. Understand why they're calling
4. Route them to the right specialist
Routes:
- Upgrade questions → transfer to "Upgrade Specialist"
- Booking help → transfer to "Booking Support"
- General questions about their account/benefits → handle directly
- Billing/cancellation → transfer to human agent
Style rules:
- Speak in short sentences (1-2 per turn)
- Use the member's first name after lookup
- Sound warm and unhurried
- Never read raw data — summarize naturally
- If unsure, ask a clarifying question rather than guessing
You have 10 minutes max. If the member hasn't stated their need within 2 minutes, gently ask how you can help.`,
      },
    ],
    temperature: 0.4,
    maxTokens: 200,
    tools: [TOOL_LOOKUP_MEMBER, TOOL_TRANSFER_TO_HUMAN],
  },
  voice: {
    provider: "rime",
    voiceId: "celeste",
    model: "arcana",
  },
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en",
  },
  serverUrl: SERVER_URL,
  serverMessages: [
    "tool-calls",
    "status-update",
    "end-of-call-report",
    "transcript",
    "hang",
  ],
  maxDurationSeconds: 600,
  silenceTimeoutSeconds: 30,
  backgroundSound: "off",
  endCallMessage: "Thanks for calling. Have a wonderful day!",
};

// ── Inbound Agent: Upgrade Specialist ──

const INBOUND_UPGRADE_CONFIG: VapiAssistantConfig = {
  name: "Arrivia Upgrade Specialist",
  firstMessage:
    "Hey, I hear you might be interested in getting more out of your membership. Let me take a look at what's available for you.",
  firstMessageMode: "assistant-speaks-first",
  model: {
    provider: "openai",
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are an upgrade specialist for a travel membership club. A greeter just transferred this call to you with member context.
Your goal: Help the member understand upgrade benefits and guide them toward upgrading. Never pressure — educate and excite.
Flow:
1. Acknowledge the transfer warmly. Use their name.
2. Ask what matters most in their travels (beaches, cruises, family trips, etc.)
3. Call lookup_member_benefits to compare their current tier vs. the next tier
4. Present 2-3 specific benefits tied to what they said they care about
5. If interested → call check_upgrade_pricing, then send_upgrade_link
6. If objection → call log_objection, address it, try once more
7. If still no → call schedule_follow_up, end warmly
Objection handling (be brief, one sentence each):
- Cost: "Most members save 3-5x the upgrade cost on their first booking alone."
- Timing: "Upgrading now locks in current pricing before your renewal."
- Underuse: "That's actually the best reason — Gold unlocks deals that make it worth using more."
- Skepticism: "Totally fair. Want me to walk you through the savings on a trip you're already considering?"
- Commitment: "There's no long-term lock-in. You can always adjust at renewal."
Style: Warm, conversational, 1-2 sentences per turn. Never read lists. Never say "as a Gold member, you get X, Y, Z." Instead, tie each benefit to something they mentioned.`,
      },
    ],
    temperature: 0.5,
    maxTokens: 200,
    tools: [
      TOOL_LOOKUP_BENEFITS,
      TOOL_CHECK_UPGRADE_PRICING,
      TOOL_LOG_OBJECTION,
      TOOL_MARK_UPGRADE_INTENT,
      TOOL_SCHEDULE_FOLLOW_UP,
      TOOL_SEND_UPGRADE_LINK,
      TOOL_TRANSFER_TO_HUMAN,
    ],
  },
  voice: {
    provider: "rime",
    voiceId: "celeste",
    model: "arcana",
  },
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en",
  },
  serverUrl: SERVER_URL,
  serverMessages: ["tool-calls", "status-update", "end-of-call-report"],
  maxDurationSeconds: 600,
  silenceTimeoutSeconds: 30,
  endCallMessage:
    "It was great chatting with you. If you have any questions later, just give us a call back. Enjoy your travels!",
};

// ── Inbound Agent: Booking Support ──

const INBOUND_BOOKING_CONFIG: VapiAssistantConfig = {
  name: "Arrivia Booking Support",
  firstMessage:
    "Hi, I'm here to help with your booking. What can I assist you with today?",
  firstMessageMode: "assistant-speaks-first",
  model: {
    provider: "openai",
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a booking support agent for a travel membership club.
You help with:
- Questions about existing bookings (dates, confirmation numbers, cancellation policies)
- Help finding available trips at their tier level
- General booking process guidance
You do NOT process actual bookings or payments. For those, transfer to a human agent.
Style: Helpful, patient, clear. Short answers. If you don't know something specific, be honest and offer to transfer.`,
      },
    ],
    temperature: 0.3,
    maxTokens: 200,
    tools: [TOOL_LOOKUP_MEMBER, TOOL_TRANSFER_TO_HUMAN],
  },
  voice: {
    provider: "rime",
    voiceId: "celeste",
    model: "arcana",
  },
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en",
  },
  serverUrl: SERVER_URL,
  serverMessages: ["tool-calls", "status-update", "end-of-call-report"],
  maxDurationSeconds: 600,
  silenceTimeoutSeconds: 30,
  endCallMessage: "Glad I could help. Have a great trip!",
};

// ── Inbound Squad ──

export const INBOUND_SQUAD_CONFIG: VapiSquadConfig = {
  name: "Arrivia Inbound Squad",
  members: [
    {
      assistant: INBOUND_GREETER_CONFIG,
      assistantDestinations: [
        {
          type: "assistant",
          assistantName: "Arrivia Upgrade Specialist",
          message:
            "Let me connect you with our upgrade specialist who can walk you through the options.",
          description:
            "Transfer when caller asks about upgrading their membership tier.",
        },
        {
          type: "assistant",
          assistantName: "Arrivia Booking Support",
          message: "I'll connect you with our booking team right away.",
          description:
            "Transfer when caller needs help with bookings or trips.",
        },
      ],
    },
    {
      assistant: INBOUND_UPGRADE_CONFIG,
      assistantDestinations: [
        {
          type: "assistant",
          assistantName: "Arrivia Inbound Greeter",
          message: "Let me transfer you back. One moment.",
          description:
            "Transfer back if the member has a different question.",
        },
      ],
    },
    {
      assistant: INBOUND_BOOKING_CONFIG,
      assistantDestinations: [
        {
          type: "assistant",
          assistantName: "Arrivia Inbound Greeter",
          message: "Let me transfer you back. One moment.",
          description:
            "Transfer back if the member has a different question.",
        },
      ],
    },
  ],
};

// ── Outbound Agent: Tier Upgrade ──

export const OUTBOUND_UPGRADE_CONFIG: VapiAssistantConfig = {
  name: "Arrivia Outbound Upgrade",
  firstMessage: "", // Set dynamically per call via assistantOverrides
  firstMessageMode: "assistant-speaks-first",
  model: {
    provider: "openai",
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are Mia from the travel club calling a member about upgrading their membership. This is a warm outbound call — they're an existing member, not a cold lead.
Your goal: Have a friendly conversation about their travel plans and naturally introduce upgrade benefits. Never hard-sell.
Flow:
1. Greet by name. Confirm you're speaking to the right person.
2. Mention you noticed they've been a loyal member and wanted to share something.
3. Ask about upcoming travel plans or what they enjoyed about past trips.
4. Call lookup_member_benefits — present 2 personalized benefits tied to their interests.
5. If interested → call check_upgrade_pricing, then send_upgrade_link
6. If not now → call schedule_follow_up
7. If objection → call log_objection, address once, don't push
Objection handling (one sentence each):
- Cost: "Most members save 3-5x the upgrade cost on their first booking alone."
- Timing: "Totally understand. Want me to send you the info so you can look when it's convenient?"
- Not interested: "No problem at all. I just wanted to make sure you knew about it. Enjoy your membership!"
Style: Conversational, warm, like calling a friend. Never read from a script. 1-2 sentences per turn. If they're busy, offer to call back — don't force the conversation.
Critical rules:
- If they ask you to stop calling or remove them, immediately comply and end the call politely.
- Never lie about benefits or pricing.
- Never pretend to be human — if asked directly, say you're an AI assistant.
- Keep the call under 5 minutes unless they're engaged.`,
      },
    ],
    temperature: 0.6,
    maxTokens: 200,
    tools: [
      TOOL_LOOKUP_MEMBER,
      TOOL_LOOKUP_BENEFITS,
      TOOL_CHECK_UPGRADE_PRICING,
      TOOL_LOG_OBJECTION,
      TOOL_MARK_UPGRADE_INTENT,
      TOOL_SCHEDULE_FOLLOW_UP,
      TOOL_SEND_UPGRADE_LINK,
    ],
  },
  voice: {
    provider: "rime",
    voiceId: "celeste",
    model: "arcana",
  },
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en",
  },
  serverUrl: SERVER_URL,
  serverMessages: ["tool-calls", "status-update", "end-of-call-report"],
  maxDurationSeconds: 300,
  silenceTimeoutSeconds: 15,
  endCallMessage: "Thanks so much for your time. Have a wonderful day!",
};

// ── Helper: Get personalized first message for outbound ──

const OUTBOUND_GREETINGS = [
  (name: string) =>
    `Hi, is this ${name}? This is Mia from your travel club. I wanted to give you a quick call about something I think you'll love.`,
  (name: string) =>
    `Hey ${name}, this is Mia with your travel membership. Do you have just a couple minutes? I've got some exciting news about your account.`,
  (name: string) =>
    `Hi ${name}! It's Mia from the travel club. Hope I'm not catching you at a bad time — I had something I wanted to share with you real quick.`,
  (name: string) =>
    `Hello ${name}, this is Mia calling from your travel membership. I noticed something on your account I wanted to tell you about — do you have a quick minute?`,
] as const;

export function getOutboundGreeting(memberName: string): string {
  const idx = Math.floor(Math.random() * OUTBOUND_GREETINGS.length);
  const fn = OUTBOUND_GREETINGS[idx];
  return fn ? fn(memberName) : OUTBOUND_GREETINGS[0](memberName);
}
