import type { VapiAssistantConfig, VapiTool } from "@/lib/clients/vapi";

// ═══════════════════════════════════════════════════════════════
// Agent 03 — Arrivia Inbound Support & Signup (V·SENSE / VAPI)
// The phone front door. Triages callers, handles simple requests,
// detects cruise interest, and catches non-member signups.
// ═══════════════════════════════════════════════════════════════

// ── Tools ──

const TOOL_LOOKUP_MEMBER: VapiTool = {
  type: "function",
  function: {
    name: "lookup_member",
    description:
      "Look up a member's account by phone number or member ID. Returns tier, points balance, recent bookings, and account details.",
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
      required: [],
    },
  },
  messages: [
    { type: "request-start", content: "Let me pull up your account real quick." },
    { type: "request-complete", content: "Got it, I can see your account now." },
    {
      type: "request-failed",
      content: "I'm having a little trouble accessing that. Can you try giving me your member ID instead?",
    },
  ],
};

const TOOL_SEND_SIGNUP_LINK: VapiTool = {
  type: "function",
  function: {
    name: "send_signup_link",
    description:
      "Send a non-member a signup link via SMS so they can create their membership account.",
    parameters: {
      type: "object",
      properties: {
        phone_number: {
          type: "string",
          description: "Phone number to send the signup link to",
        },
      },
      required: ["phone_number"],
    },
  },
  messages: [
    { type: "request-start", content: "I'm sending you a link right now." },
    {
      type: "request-complete",
      content: "Done! You should get a text in just a moment with everything you need to get started.",
    },
    {
      type: "request-failed",
      content: "Hmm, I had trouble sending that. Can you confirm your phone number for me?",
    },
  ],
};

const TOOL_SEND_CRUISE_BOOKING_LINK: VapiTool = {
  type: "function",
  function: {
    name: "send_cruise_booking_link",
    description:
      "Send a member a link to browse cruise deals matching their interests via SMS or email.",
    parameters: {
      type: "object",
      properties: {
        method: {
          type: "string",
          enum: ["sms", "email"],
          description: "How to send the link",
        },
        destination_interest: {
          type: "string",
          description: "Cruise destination or type they're interested in",
        },
        member_email: {
          type: "string",
          description: "Member email if sending by email",
        },
      },
      required: ["method", "destination_interest"],
    },
  },
  messages: [
    { type: "request-start", content: "Let me send you those cruise deals right now!" },
    {
      type: "request-complete",
      content: "Sent! You're going to love what's available. Check your messages in just a sec.",
    },
    { type: "request-failed", content: "I had a little trouble sending that. Let me try another way." },
  ],
};

const TOOL_TRANSFER_TO_HUMAN: VapiTool = {
  type: "function",
  function: {
    name: "transfer_to_human",
    description:
      "Transfer the caller to a human specialist when the issue requires human intervention.",
    parameters: {
      type: "object",
      properties: {
        reason: {
          type: "string",
          description: "Why the transfer is needed",
        },
        department: {
          type: "string",
          enum: ["billing", "bookings", "cancellation", "supervisor", "general"],
          description: "Which department to transfer to",
        },
      },
      required: ["reason", "department"],
    },
  },
  messages: [
    {
      type: "request-start",
      content: "Of course, let me connect you with someone who can help with that right away.",
    },
    { type: "request-failed", content: "I'm sorry, I'm having trouble connecting you. Let me try again." },
  ],
};

const TOOL_LOG_CALL_EVENT: VapiTool = {
  type: "function",
  function: {
    name: "log_call_event",
    description: "Log call events for analytics tracking.",
    parameters: {
      type: "object",
      properties: {
        event_type: {
          type: "string",
          enum: ["signup_sent", "cruise_interest", "faq_resolved", "transfer", "complaint"],
          description: "Type of event",
        },
        details: {
          type: "string",
          description: "Event details",
        },
      },
      required: ["event_type", "details"],
    },
  },
  async: true,
};

// ── System Prompt ──

const AGENT_03_SYSTEM_PROMPT = `You are Mia, the inbound voice assistant for the travel club. You handle all incoming phone calls. Callers may be existing members or prospective new members.

FOR EXISTING MEMBERS: Help with booking questions, general FAQ, and detect upgrade or cruise booking interest. Use their name after identification. Pull up their account with lookup_member.

FOR NON-MEMBERS: Help them understand membership value and send a signup link via send_signup_link.

CALL FLOW:
1. Greet warmly, ask for name or member ID
2. Call lookup_member to identify them
3. If member → assess their need:
   - General question → answer from knowledge base
   - Booking question → answer if simple, transfer if complex
   - Cruise interest → get excited, capture preferences, send cruise booking link
   - Billing/cancellation → transfer to human agent
   - Complaint → empathize, document, transfer to specialist
4. If non-member → explain membership value, ask about travel interests, send signup link
5. Always check for additional needs before closing
6. Proactively mention cruise deals or unused benefits when relevant

CRUISE INTEREST DETECTION: If a member asks about their points, mention cruises as a great way to use them. If they mention travel plans, ask if they've seen the cruise deals. Get excited about cruises!

TONE: Sound warm, upbeat, and genuinely helpful. You're the first voice people hear — make it count. Be efficient but never rushed. Keep responses to 1-2 sentences per turn. If someone is frustrated, slow down and empathize before jumping to solutions. For non-members, sound excited about what you can offer.

TRANSFER ROUTING:
- Billing → billing inquiries, payment issues, refund requests
- Bookings → complex booking modifications, date changes
- Cancellation → membership cancellation requests
- Supervisor → escalations, unresolved complaints, abusive callers
- General → anything that doesn't fit above

KNOWLEDGE BASE TOPICS:
- Membership FAQ (tiers, pricing, benefits, how to use)
- Booking FAQ (how to book, cancellation policies, modification process)
- Current cruise promotions
- Points earning and redemption guide
- Referral program overview
- Contact hours and specialist availability

GUARDRAILS:
- Do NOT process payments, execute bookings, or modify accounts
- Do NOT guarantee refund amounts, rebooking availability, or resolution timelines
- Do NOT share other members' information
- Do NOT provide legal advice about travel insurance
- Do NOT create accounts — only send signup links
- If a caller becomes abusive, remain professional and offer to transfer to a supervisor
- If asked about topics outside travel membership, politely redirect`;

// ── Inbound Assistant Config (Agent 03) ──

const SERVER_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/voice/webhooks/vapi`;

export const INBOUND_SUPPORT_CONFIG: VapiAssistantConfig = {
  name: "Arrivia Inbound Support — Mia",
  firstMessage:
    "Hey there, thanks for calling! My name is Mia and I'm here to help with your travel membership. What can I help you with today?",
  firstMessageMode: "assistant-speaks-first",
  model: {
    provider: "openai",
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: AGENT_03_SYSTEM_PROMPT,
      },
    ],
    temperature: 0.6,
    maxTokens: 200,
    tools: [
      TOOL_LOOKUP_MEMBER,
      TOOL_SEND_SIGNUP_LINK,
      TOOL_SEND_CRUISE_BOOKING_LINK,
      TOOL_TRANSFER_TO_HUMAN,
      TOOL_LOG_CALL_EVENT,
    ],
  },
  voice: {
    provider: "rime-ai",
    voiceId: "luna",
    model: "arcana",
    speed: 1.05,
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
  backchannelingEnabled: true,
  backgroundSound: "office",
  endCallMessage: "Thanks for calling! Have a wonderful day!",
};

// ── Outbound Agent: Tier Upgrade (kept for outbound campaigns) ──

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
4. Tie in how their current tier could work harder for them.
5. If interested → offer to send info
6. If not now → schedule follow-up
7. If objection → address once, don't push
Style: Conversational, warm, like calling a friend. Never read from a script. 1-2 sentences per turn. If they're busy, offer to call back — don't force the conversation.
Critical rules:
- If they ask you to stop calling or remove them, immediately comply and end the call politely.
- Never lie about benefits or pricing.
- Never pretend to be human — if asked directly, say you're an AI assistant.
- Keep the call under 5 minutes unless they're engaged.`,
      },
    ],
    temperature: 0.7,
    maxTokens: 200,
    tools: [TOOL_LOOKUP_MEMBER, TOOL_TRANSFER_TO_HUMAN, TOOL_LOG_CALL_EVENT],
  },
  voice: {
    provider: "rime-ai",
    voiceId: "luna",
    model: "arcana",
    speed: 1.05,
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
  backchannelingEnabled: true,
  backgroundSound: "office",
  endCallMessage: "Thanks so much for your time. Have a wonderful day!",
};

// ── Helper: Get personalized first message for outbound ──

export function getOutboundGreeting(memberName: string): string {
  const greetings = [
    `Hi, is this ${memberName}? This is Mia from your travel club. I wanted to give you a quick call about something I think you'll love.`,
    `Hey ${memberName}, this is Mia with your travel membership. Do you have just a couple minutes? I've got some exciting news about your account.`,
    `Hi ${memberName}! It's Mia from the travel club. Hope I'm not catching you at a bad time — I had something I wanted to share with you real quick.`,
    `Hello ${memberName}, this is Mia calling from your travel membership. I noticed something on your account I wanted to tell you about — do you have a quick minute?`,
  ];
  return greetings[Math.floor(Math.random() * greetings.length)]!;
}
