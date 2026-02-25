/**
 * Creates the "Voxaris Site Demo Agent" persona on Tavus.
 * Run: npx tsx scripts/create-persona.ts
 */

const TAVUS_API_KEY = process.env.TAVUS_API_KEY ?? "7f3c93c88c4a44c79f5d969b56bdbd75";
const CALLBACK_URL = process.env.CALLBACK_URL ?? "https://orchestrator.voxaris.io/api/execute";

const SYSTEM_PROMPT = `You are Voxaris, the warm, confident, and helpful AI video guide on voxaris.io — the official website for Voxaris AI.

WHAT YOU DO:
You appear as a photorealistic floating video avatar on voxaris.io. You can visibly control the page — scrolling to sections, highlighting features, and navigating — while narrating everything in real time.

PERSONALITY:
- Warm, professional, subtly excited about the technology
- Speak naturally with contractions and conversational rhythm
- Keep responses to 1-3 sentences max (you're speaking, not writing)
- Use the visitor's name if they share it

CAPABILITIES (via tools):
- scroll_to_section: Smoothly scroll the page to any section (hero, features, how-it-works, pricing, demo, contact)
- highlight_feature: Visually highlight a specific feature on the page
- navigate_to_page: Go to a different page on the site
- extract_page_content: Read current page content to answer questions
- request_demo_booking: Start the demo booking flow (requires confirmation)

KNOWLEDGE:
Voxaris builds AI employees for businesses — voice agents (V·VOICE), video agents (V·FACE), and a full orchestration suite (V·SUITE). Core industries: automotive dealerships, law firms, contractors, medical spas. Based in Orlando, FL.

Key products:
- V·VOICE: AI phone agents that answer calls 24/7, book appointments, qualify leads
- V·FACE: Photorealistic video avatars for websites (what you ARE right now)
- V·SUITE: Full AI employee management dashboard
- Talking Postcards: Direct mail with QR codes that launch video AI conversations

RULES:
1. Always narrate what you're doing on screen ("Let me show you..." / "Scrolling down to...")
2. Never make up information — if unsure, say so
3. For demo bookings, confirm details twice (verbal + button)
4. If asked about competitors, stay professional and redirect to Voxaris strengths
5. If asked about pricing, explain it's custom per business and offer to book a demo call`;

const TOOLS = [
  {
    type: "function",
    function: {
      name: "scroll_to_section",
      description: "Smoothly scroll the voxaris.io page to a specific section",
      parameters: {
        type: "object",
        properties: {
          section: {
            type: "string",
            enum: ["hero", "features", "how-it-works", "solutions", "technology", "pricing", "demo", "contact", "vface", "vvoice", "vsuite", "talking-postcard"],
            description: "The section to scroll to",
          },
          narration: {
            type: "string",
            description: "What to say while scrolling",
          },
        },
        required: ["section", "narration"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "highlight_feature",
      description: "Visually highlight a feature card or element on the page",
      parameters: {
        type: "object",
        properties: {
          feature: {
            type: "string",
            description: "Which feature to highlight (e.g., 'V·FACE', 'V·VOICE', '24/7 availability')",
          },
          narration: {
            type: "string",
            description: "What to say while highlighting",
          },
        },
        required: ["feature", "narration"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "navigate_to_page",
      description: "Navigate to a different page on voxaris.io",
      parameters: {
        type: "object",
        properties: {
          page: {
            type: "string",
            enum: ["home", "technology", "solutions-dealerships", "solutions-law-firms", "solutions-contractors", "pricing", "demo", "how-it-works"],
            description: "The page to navigate to",
          },
          narration: {
            type: "string",
            description: "What to say while navigating",
          },
        },
        required: ["page", "narration"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "extract_page_content",
      description: "Read information from the current page to answer a visitor's question",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "What information to find on the page",
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "request_demo_booking",
      description: "Start the demo booking process. Requires user confirmation before proceeding.",
      parameters: {
        type: "object",
        properties: {
          visitor_name: { type: "string" },
          business_type: { type: "string" },
          interest: { type: "string", description: "Which product they're interested in" },
        },
        required: ["interest"],
      },
    },
  },
];

async function main() {
  console.log("Creating Voxaris Site Demo Agent persona on Tavus...\n");

  const response = await fetch("https://api.tavus.io/v2/personas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": TAVUS_API_KEY,
    },
    body: JSON.stringify({
      persona_name: "Voxaris Site Demo Agent",
      system_prompt: SYSTEM_PROMPT,
      context: "You are the AI video guide on voxaris.io, demonstrating Voxaris AI products to website visitors.",
      default_replica_id: "raf6459c9b82", // Voxaris custom replica
      layers: {
        perception: {
          perception_model: "raven-1",
          ambient_awareness_queries: [
            "Is the visitor nodding or showing interest?",
            "Does the visitor look confused or hesitant?",
            "Is the visitor looking at a specific part of the page?",
          ],
          perception_tool_calls: true,
        },
        turn_taking: {
          turn_taking_model: "sparrow-1",
          turn_taking_patience: "medium",
        },
        llm: {
          model: "default", // Use Tavus built-in Raven for reasoning
          tools: TOOLS,
          tool_call_callback_url: CALLBACK_URL,
        },
        speech: {
          speculative_inference: true,
        },
      },
      custom_greeting: "Hey there! Welcome to Voxaris. I'm your AI guide — I can show you around the site, answer questions about our products, or help you book a demo. What brings you here today?",
      max_call_duration: 1200, // 20 minutes
      enable_recording: true,
      enable_transcription: true,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`Failed: ${response.status}\n${error}`);
    process.exit(1);
  }

  const persona = await response.json();
  console.log("Persona created successfully!\n");
  console.log(`Persona ID: ${persona.persona_id}`);
  console.log(`Name: ${persona.persona_name}`);
  console.log(`\nAdd this to your .env.local:`);
  console.log(`TAVUS_PERSONA_ID=${persona.persona_id}`);
  console.log(`\nNext: Create a conversation with:`);
  console.log(`npx tsx scripts/create-conversation.ts`);
}

main().catch(console.error);
