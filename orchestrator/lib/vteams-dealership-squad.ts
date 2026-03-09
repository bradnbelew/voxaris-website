/**
 * V·TEAMS Dealership Inbound Squad Configuration
 *
 * Architecture: Vapi Squads — 4 specialized assistants with explicit handoffs
 * Purpose: Answer inbound dealership sales calls, qualify, and book appointments
 *
 * Squad members:
 * 1. Receptionist — greet, identify intent, route
 * 2. Sales Qualifier — gather context, determine readiness
 * 3. Product Specialist — handle consultative questions
 * 4. Closer — secure appointment, confirm details, trigger CRM sync
 *
 * Reference: https://docs.vapi.ai/squads
 */

const VAPI_SERVER_URL = process.env.VAPI_SERVER_URL || 'https://voxaris.io/api/vteams/webhook';

// ── Shared context variables passed across all handoffs ──────
export const SHARED_VARIABLES = [
  'caller_name',
  'phone_number',
  'intent_primary',       // sales | test_drive | inventory | service | other
  'dealership_location',
  'vehicle_interest',
  'appointment_intent',   // ready | maybe | not_yet
  'trade_in_interest',    // yes | no | unknown
  'financing_interest',   // yes | no | unknown
  'timeline',             // today | this_week | this_month | just_looking
  'notes_summary',
  'disposition_so_far',   // greeting | qualifying | consulting | closing | escalated
];

// ── Tool definitions for Vapi ────────────────────────────────
export const SQUAD_TOOLS = [
  {
    type: 'function',
    function: {
      name: 'create_or_update_contact',
      description: 'Create or update a contact record in the CRM with caller details',
      parameters: {
        type: 'object',
        properties: {
          caller_name: { type: 'string', description: 'Full name of the caller' },
          phone_number: { type: 'string', description: 'Caller phone number' },
          email: { type: 'string', description: 'Caller email if provided' },
          company: { type: 'string', description: 'Dealership or company name' },
          source: { type: 'string', description: 'Lead source — always "inbound_call"' },
        },
        required: ['caller_name', 'phone_number'],
      },
    },
    server: { url: VAPI_SERVER_URL },
  },
  {
    type: 'function',
    function: {
      name: 'book_appointment',
      description: 'Book a dealership appointment for the caller',
      parameters: {
        type: 'object',
        properties: {
          caller_name: { type: 'string' },
          phone_number: { type: 'string' },
          email: { type: 'string' },
          company: { type: 'string' },
          appointment_date: { type: 'string', description: 'ISO 8601 datetime for the appointment' },
          appointment_type: { type: 'string', description: 'test_drive | sales_consultation | service' },
          vehicle_interest: { type: 'string' },
          notes: { type: 'string' },
        },
        required: ['caller_name', 'phone_number', 'appointment_date'],
      },
    },
    server: { url: VAPI_SERVER_URL },
  },
  {
    type: 'function',
    function: {
      name: 'escalate_to_human',
      description: 'Transfer the call to a human agent when needed',
      parameters: {
        type: 'object',
        properties: {
          reason: { type: 'string', description: 'Why the caller needs a human' },
          caller_name: { type: 'string' },
          phone_number: { type: 'string' },
          context_summary: { type: 'string', description: 'Summary of the conversation so far' },
        },
        required: ['reason'],
      },
    },
    server: { url: VAPI_SERVER_URL },
  },
  {
    type: 'function',
    function: {
      name: 'save_call_summary',
      description: 'Save the full call summary and disposition to CRM',
      parameters: {
        type: 'object',
        properties: {
          caller_name: { type: 'string' },
          phone_number: { type: 'string' },
          intent: { type: 'string' },
          disposition: { type: 'string', description: 'appointment_booked | follow_up_needed | escalated | no_action' },
          squad_path: { type: 'string', description: 'Agents involved: receptionist > qualifier > closer' },
          summary: { type: 'string' },
          appointment_time: { type: 'string' },
          unanswered_questions: { type: 'string' },
        },
        required: ['caller_name', 'disposition', 'summary'],
      },
    },
    server: { url: VAPI_SERVER_URL },
  },
];

// ── Agent 1: Receptionist ────────────────────────────────────
export const RECEPTIONIST_ASSISTANT = {
  name: 'V·TEAMS Receptionist',
  firstMessage: "Thanks for calling! This is the sales team. How can I help you today?",
  firstMessageMode: 'assistant-speaks-first' as const,
  model: {
    provider: 'openai' as const,
    model: 'gpt-4o-mini',
    temperature: 0.3,
    systemMessage: `You are the first point of contact for inbound dealership sales calls.

Your only jobs are:
1. Greet the caller warmly and naturally
2. Capture their name if not already known
3. Understand why they are calling (sales inquiry, test drive, inventory question, service, or other)
4. Route cleanly to the right next agent

Rules:
- Be brief, calm, and fast
- Do NOT try to handle deep vehicle questions
- Do NOT try to close an appointment unless the caller explicitly and immediately asks to book
- Do NOT over-qualify — that is the qualifier's job
- If the caller asks for a human or a specific person, escalate immediately
- If the caller seems frustrated or angry, escalate immediately
- Confirm the caller's name naturally: "And who am I speaking with?"

When you have identified the caller's intent and captured their name:
- If intent is sales, test drive, vehicle inquiry, or appointment → transfer to Sales Qualifier
- If intent is service → let them know you'll connect them with the right team and escalate to human
- If caller demands a human → escalate to human immediately

On transfer, pass: caller_name, phone_number, intent_primary, and a brief summary of what was discussed.`,
  },
  voice: {
    provider: 'rime-ai' as const,
    voiceId: 'marsh',
    speed: 1.05,
  },
  transcriber: {
    provider: 'deepgram' as const,
    model: 'nova-2',
    language: 'en',
  },
  serverUrl: VAPI_SERVER_URL,
  silenceTimeoutSeconds: 30,
  maxDurationSeconds: 120,
  backchannelingEnabled: true,
  backgroundSound: 'off' as const,
};

// ── Agent 2: Sales Qualifier ─────────────────────────────────
export const QUALIFIER_ASSISTANT = {
  name: 'V·TEAMS Sales Qualifier',
  firstMessage: "Got it — I'm pulling in the right person to help you out. I just need a couple quick details so we can get this handled fast.",
  firstMessageMode: 'assistant-speaks-first' as const,
  model: {
    provider: 'openai' as const,
    model: 'gpt-4o',
    temperature: 0.3,
    systemMessage: `You are the dealership sales qualifier for V·TEAMS.

You received a warm transfer from the receptionist. You already have: caller_name, phone_number, and intent_primary. DO NOT ask for information you already have.

Your job is to understand:
1. What vehicle or type of vehicle they're interested in (make, model, new/used, or general category)
2. Their timeline (today, this week, this month, just browsing)
3. Whether they have a trade-in
4. Whether they need financing
5. Whether they are ready to schedule a visit or test drive NOW

Rules:
- Use the context from the receptionist. Never repeat questions already answered.
- Be conversational, not interrogating
- Do NOT hard-close prematurely
- Do NOT ramble or over-explain
- Keep it to 3-4 focused questions maximum
- If the caller has complex questions about process, availability, or trade-in values → transfer to Product Specialist
- If the caller is clearly ready to book → transfer to Closer immediately
- If the caller gets frustrated or asks for a human → escalate

On transfer to Specialist, pass: all existing context + vehicle_interest, timeline, trade_in_interest, financing_interest, appointment_intent
On transfer to Closer, pass: all existing context with appointment_intent = "ready"`,
  },
  voice: {
    provider: 'rime-ai' as const,
    voiceId: 'marsh',
    speed: 1.0,
  },
  transcriber: {
    provider: 'deepgram' as const,
    model: 'nova-2',
    language: 'en',
  },
  serverUrl: VAPI_SERVER_URL,
  silenceTimeoutSeconds: 30,
  maxDurationSeconds: 180,
  backchannelingEnabled: true,
  backgroundSound: 'off' as const,
};

// ── Agent 3: Product Specialist ──────────────────────────────
export const SPECIALIST_ASSISTANT = {
  name: 'V·TEAMS Product Specialist',
  firstMessage: "Great, let me help you with that. I've got all the details from our conversation so far.",
  firstMessageMode: 'assistant-speaks-first' as const,
  model: {
    provider: 'openai' as const,
    model: 'gpt-4o',
    temperature: 0.4,
    systemMessage: `You are the product and process specialist for dealership inbound sales calls.

You handle the higher-trust, consultative parts of the call. You have full context from the receptionist and qualifier — caller_name, intent, vehicle_interest, timeline, trade-in and financing context. DO NOT ask for information you already have.

Your job:
1. Answer bounded questions about the process (what happens when they visit, how test drives work, what to bring)
2. Address availability approach without making up specific inventory ("We typically have a good selection of [type], and I can have the team pull options before you arrive")
3. Explain trade-in process if relevant ("You can bring your current vehicle and we'll appraise it on the spot")
4. Explain financing options at a high level if relevant
5. Reduce hesitation and move the caller toward scheduling

Rules:
- NEVER invent specific inventory, exact pricing, incentive amounts, or OEM-specific facts
- NEVER improvise dealership policies
- If you cannot verify a fact, say so honestly: "I don't have that exact number, but here's what I can do..."
- Move toward the best next step — which is usually booking a visit
- When the caller's questions are resolved and they seem ready → transfer to Closer
- If caller asks for a human → escalate

On transfer to Closer, pass: all context + a clear recommendation (e.g., "caller wants to test drive a [vehicle], available [timeframe], has trade-in")`,
  },
  voice: {
    provider: 'rime-ai' as const,
    voiceId: 'marsh',
    speed: 1.0,
  },
  transcriber: {
    provider: 'deepgram' as const,
    model: 'nova-2',
    language: 'en',
  },
  serverUrl: VAPI_SERVER_URL,
  silenceTimeoutSeconds: 30,
  maxDurationSeconds: 240,
  backchannelingEnabled: true,
  backgroundSound: 'off' as const,
};

// ── Agent 4: Closer ──────────────────────────────────────────
export const CLOSER_ASSISTANT = {
  name: 'V·TEAMS Closer',
  firstMessage: "Perfect — let's get you on the schedule. I just need to confirm a few things and we'll have you all set.",
  firstMessageMode: 'assistant-speaks-first' as const,
  model: {
    provider: 'openai' as const,
    model: 'gpt-4o',
    temperature: 0.2,
    systemMessage: `You are the appointment closer for V·TEAMS.

You have full context from the previous agents — caller_name, phone_number, vehicle_interest, timeline, trade_in_interest, and a recommendation. DO NOT re-open broad discovery. The qualification is done.

Your job:
1. Confirm preferred day and time window for the appointment
2. Confirm the best callback number
3. Confirm the dealership location if there are multiple
4. Summarize what will happen at the appointment (test drive, consultation, appraisal, etc.)
5. Use the book_appointment tool to create the actual appointment
6. Confirm the booking with the caller
7. Use save_call_summary to log the full interaction

Rules:
- Move quickly and clearly
- Do NOT reopen vehicle discovery unless the caller brings up something new
- Do NOT overtalk once the buyer is ready — close and confirm
- If no slot works, offer the closest alternatives or a callback
- If the caller is not ready, capture their preference and offer a follow-up call or text
- Always end with a clear next step

If booking succeeds: "You're all set for [day] at [time]. You'll get a confirmation shortly. We look forward to seeing you!"
If booking fails: "I want to make sure we get this right. Let me have someone from our team reach out to confirm your appointment within the hour."

After the call, use save_call_summary with: caller_name, disposition, squad_path, summary, appointment_time if booked, and any unanswered questions.`,
  },
  voice: {
    provider: 'rime-ai' as const,
    voiceId: 'marsh',
    speed: 1.0,
  },
  transcriber: {
    provider: 'deepgram' as const,
    model: 'nova-2',
    language: 'en',
  },
  serverUrl: VAPI_SERVER_URL,
  silenceTimeoutSeconds: 45,
  maxDurationSeconds: 180,
  backchannelingEnabled: true,
  backgroundSound: 'off' as const,
  tools: SQUAD_TOOLS,
};

// ── Squad Configuration ──────────────────────────────────────
export const DEALERSHIP_INBOUND_SQUAD = {
  name: 'V·TEAMS Dealership Inbound',
  members: [
    {
      assistant: RECEPTIONIST_ASSISTANT,
      assistantDestinations: [
        {
          type: 'assistant' as const,
          assistantName: 'V·TEAMS Sales Qualifier',
          message: 'Connecting you with our sales team now.',
          description: 'Transfer to sales qualifier when caller intent is sales, test drive, vehicle inquiry, or appointment.',
        },
      ],
    },
    {
      assistant: QUALIFIER_ASSISTANT,
      assistantDestinations: [
        {
          type: 'assistant' as const,
          assistantName: 'V·TEAMS Product Specialist',
          message: "Got it. I'm pulling in the right specialist so we can get this handled quickly.",
          description: 'Transfer to product specialist when caller has consultative or objection-heavy questions.',
        },
        {
          type: 'assistant' as const,
          assistantName: 'V·TEAMS Closer',
          message: "Great — let me get you scheduled right now.",
          description: 'Transfer to closer when caller is ready to schedule or commit to next step.',
        },
      ],
    },
    {
      assistant: SPECIALIST_ASSISTANT,
      assistantDestinations: [
        {
          type: 'assistant' as const,
          assistantName: 'V·TEAMS Closer',
          message: "Let's get you on the schedule.",
          description: 'Transfer to closer when question resolution is complete and appointment readiness is clear.',
        },
      ],
    },
    {
      assistant: CLOSER_ASSISTANT,
      assistantDestinations: [],
    },
  ],
};

/**
 * Helper to create the squad via Vapi API
 */
export async function createDealershipSquad(vapiApiKey: string): Promise<any> {
  const response = await fetch('https://api.vapi.ai/squad', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${vapiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(DEALERSHIP_INBOUND_SQUAD),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create Vapi squad: ${response.status} ${error}`);
  }

  return response.json();
}
