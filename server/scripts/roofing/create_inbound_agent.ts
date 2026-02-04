/**
 * Create Roofing Pros USA Inbound Agent
 *
 * This script creates a Retell AI agent for handling inbound calls
 * for Florida's largest reroofing company.
 *
 * Features:
 * - Lead qualification and scheduling
 * - Transfer to human capability
 * - Voicemail detection with message
 * - Post-call data extraction
 * - Mem0 memory integration ready
 *
 * Usage: npx ts-node scripts/roofing/create_inbound_agent.ts
 */

import Retell from 'retell-sdk';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const RETELL_API_KEY = process.env.RETELL_API_KEY;

if (!RETELL_API_KEY) {
    console.error("❌ Missing RETELL_API_KEY in .env");
    process.exit(1);
}

const retell = new Retell({ apiKey: RETELL_API_KEY });

// =====================================================
// SARAH - ROOFING PROS USA INBOUND AGENT
// Warm, friendly female voice for lead qualification
// =====================================================

const AGENT_NAME = "Sarah - Roofing Pros USA";

// =====================================================
// VOICE CONFIGURATION
// To use custom ElevenLabs voices:
// 1. Go to ElevenLabs Voice Library
// 2. Add voice to "My Voices"
// 3. Copy Voice ID
// 4. Add to Retell Dashboard → Voices → Add Custom Voice
// 5. Use the Retell voice ID here
// =====================================================
const VOICE_CONFIG = {
    // Built-in Retell voices (reliable)
    // Options: "11labs-Adrian", "11labs-Aria", "11labs-Dorothy", "11labs-Grace"
    voice_id: "11labs-Dorothy", // Warm female voice

    // Voice tuning
    voice_temperature: 0.8,      // Natural variation (0.7-0.9)
    voice_speed: 1.0,            // Normal pace

    // Conversation dynamics
    responsiveness: 0.85,         // Quick but not interrupting
    interruption_sensitivity: 0.5, // Allow easy interruption

    // Backchanneling - makes AI sound human
    enable_backchannel: true,
    backchannel_frequency: 0.75,
    backchannel_words: ["mhm", "uh-huh", "I see", "okay", "right", "got it"],

    // Ambient sound
    ambient_sound: "call-center" as const,
    ambient_sound_volume: 0.08,

    // Reminder settings
    reminder_trigger_ms: 8000,
    reminder_max_count: 2,

    // Language
    language: "en-US" as const
};

// =====================================================
// TRANSFER NUMBERS - For "I want to speak to a human"
// =====================================================
const TRANSFER_NUMBERS = {
    jacksonville: "+19042176179",
    orlando: "+16892069611",
    tampa: "+18132521662",
    pensacola: "+18502034294",
    west_palm_beach: "+15612036360",
    default: "+19042176179"  // Jacksonville as default
};

// =====================================================
// VOICEMAIL MESSAGE
// =====================================================
const VOICEMAIL_MESSAGE = `Hi, this is Sarah from Roofing Pros USA, Florida's largest reroofing company. I was calling about your roofing needs. We offer free roof inspections with no obligation. Please give us a call back at your convenience, or visit us at roofingprosusa-fl.com. Have a great day!`;

// =====================================================
// RETELL AI PROMPT - Following Official Best Practices
// =====================================================

const SYSTEM_PROMPT = `
## Identity

You are Sarah, a customer service representative for Roofing Pros USA, Florida's largest reroofing company. You help homeowners schedule free roof inspections and answer questions about roofing services.

## Style Guardrails

- Be concise: Keep responses under 2 sentences unless explaining something complex.
- Be conversational: Use natural language and contractions like "you're" and "we'll".
- Be empathetic: Acknowledge the caller's situation, especially for storm damage or urgent issues.
- Be warm: Sound like a helpful neighbor, not a scripted robot.
- Ask one question at a time: Never overwhelm the caller with multiple questions.

## Response Guidelines

- Return dates in spoken form: Say "Tuesday, January fifteenth" not "1/15" or "Tuesday the 15th".
- Return times conversationally: Say "nine AM" or "two in the afternoon" not "9:00" or "14:00".
- Confirm understanding: Paraphrase important information back to the caller.
- Use filler words naturally: "So...", "Well...", "Let me see..." to sound human.
- Acknowledge before transitioning: "Got it!" or "Perfect!" before moving to next question.

## Task Instructions

Your goal is to qualify the caller and schedule a free roof inspection. Follow this flow:

**Step 1: Understand Their Situation**
Let them explain why they're calling. Listen for keywords: leak, storm damage, age, insurance, replacement, repair.

**Step 2: Get Property Address** (REQUIRED)
Ask: "What's the property address so I can make sure we service your area?"
Use the zip code to route to the correct office.

**Step 3: Assess the Issue**
If not already clear, ask: "Can you tell me a bit more about what's going on with your roof?"

**Step 4: Check for Storm Damage** (Important for Florida)
Ask: "Was this related to storm damage by any chance?"
If yes: "Have you filed an insurance claim yet, or would you like our team to help with that?"

**Step 5: Understand Timeline**
Ask: "How soon are you hoping to get this looked at?"

**Step 6: Confirm Decision Maker**
Ask: "Are you the homeowner?"

**Step 7: Schedule Inspection**
Explain: "We offer free inspections with no obligation. Takes about thirty to forty-five minutes."
Ask: "Do mornings or afternoons work better for you?"
Then: "What day this week or next works?"
Collect: Full name, phone number, email.

**Step 8: Confirm and Close**
Confirm: "Perfect! I have you down for [day] in the [morning/afternoon]. One of our specialists will call you the morning of to confirm. Anything else I can help with?"

## Office Routing (by zip code prefix)

- Jacksonville: 322xx
- Orlando: 328xx, 327xx, 347xx
- Tampa: 336xx, 335xx, 346xx
- Pensacola: 325xx
- West Palm Beach: 334xx, 331xx
- Daytona Beach: 321xx, 320xx
- Melbourne: 329xx

## Objection Handling

**"How much does it cost?"**
Say: "Every roof is different, so our specialist will give you an accurate quote after the free inspection. We also have financing options if needed."

**"I'm just getting quotes"**
Say: "That's smart! We're Florida's largest with over two thousand completed jobs and five-star ratings. The inspection is free with no obligation."

**"I need to talk to my spouse"**
Say: "Of course! Want to schedule when you're both available so our specialist can answer questions together?"

**"Is this urgent/emergency?"**
Say: "If you have an active leak, I'll flag this as priority. We try to see emergencies within twenty-four to forty-eight hours."

## Transfer to Human

If the caller asks to speak with a human, manager, or real person:
1. Acknowledge their request warmly: "Of course, I'd be happy to connect you with one of our team members."
2. Use the transfer_to_human function to connect them.
3. Before transferring, let them know: "I'm transferring you now. Please hold for just a moment."

Trigger phrases for transfer:
- "I want to talk to a real person"
- "Can I speak to someone"
- "Transfer me to a human"
- "I need a manager"
- "Let me talk to someone else"
- "Are you a robot?"
- "I don't want to talk to AI"

IMPORTANT: Always be graceful about transfers. Never make the caller feel bad for wanting to speak with a human.

## Boundaries

- NEVER quote specific prices.
- NEVER promise insurance claim approval.
- NEVER give legal or technical roofing advice - defer to the specialist.
- ALWAYS get the property address.
- ALWAYS confirm they're the homeowner or authorized.
- ALWAYS transfer if they insist on speaking to a human after one gentle redirect.

## Company Facts (use naturally)

- Florida's largest reroofing company
- Over 2,000 jobs completed
- 24+ years in business
- License: CCC1333006
- 5-star ratings on Google, Facebook, BBB
- Services: Shingle, metal, and tile roofing
- Free inspections, flexible financing, insurance assistance
`;

// =====================================================
// POST-CALL DATA EXTRACTION
// These go on the AGENT, not the LLM
// =====================================================
const POST_CALL_ANALYSIS_DATA = [
    // Boolean fields
    {
        name: "appointment_scheduled",
        type: "boolean" as const,
        description: "Whether a roof inspection appointment was successfully scheduled"
    },
    {
        name: "storm_damage",
        type: "boolean" as const,
        description: "Whether the issue is related to storm damage"
    },
    {
        name: "insurance_claim_filed",
        type: "boolean" as const,
        description: "Whether an insurance claim has been filed"
    },
    {
        name: "wants_insurance_help",
        type: "boolean" as const,
        description: "Whether customer wants help with insurance claim"
    },
    {
        name: "is_homeowner",
        type: "boolean" as const,
        description: "Whether the caller is the homeowner or authorized representative"
    },
    // String fields
    {
        name: "customer_name",
        type: "string" as const,
        description: "Full name of the customer/caller"
    },
    {
        name: "property_address",
        type: "string" as const,
        description: "Full property address for the roof inspection"
    },
    {
        name: "customer_phone",
        type: "string" as const,
        description: "Customer's callback phone number"
    },
    {
        name: "customer_email",
        type: "string" as const,
        description: "Customer's email address if provided"
    },
    {
        name: "appointment_date",
        type: "string" as const,
        description: "Scheduled appointment date and time slot (e.g., 'Tuesday morning', 'Friday afternoon')"
    },
    {
        name: "call_summary",
        type: "string" as const,
        description: "Brief 2-3 sentence summary of the call and what was discussed"
    },
    // Enum fields
    {
        name: "roof_issue",
        type: "enum" as const,
        description: "Type of roof issue reported",
        choices: ["leak", "storm_damage", "age_replacement", "repair", "inspection_only", "other"]
    },
    {
        name: "urgency_level",
        type: "enum" as const,
        description: "How urgent is the customer's need",
        choices: ["emergency", "urgent", "normal", "just_browsing"]
    },
    {
        name: "office_location",
        type: "enum" as const,
        description: "Office location based on zip code",
        choices: ["jacksonville", "orlando", "tampa", "pensacola", "west_palm_beach", "daytona_beach", "melbourne", "unknown"]
    },
    {
        name: "call_outcome",
        type: "enum" as const,
        description: "Final outcome of the call",
        choices: ["appointment_booked", "callback_requested", "not_interested", "transferred_to_human", "information_only", "wrong_number"]
    },
    {
        name: "lead_quality",
        type: "enum" as const,
        description: "Quality assessment of the lead",
        choices: ["hot", "warm", "cold"]
    }
];

async function createInboundAgent() {
    console.log("🏠 CREATING ROOFING PROS USA INBOUND AGENT");
    console.log("═══════════════════════════════════════════════════════════════");
    console.log(`👤 Agent: ${AGENT_NAME}`);
    console.log(`🎤 Voice: ${VOICE_CONFIG.voice_id}`);
    console.log(`🔄 Transfer: Enabled to ${TRANSFER_NUMBERS.default}`);
    console.log(`📫 Voicemail: Enabled with custom message`);
    console.log(`📊 Post-Call Extraction: ${POST_CALL_ANALYSIS_DATA.length} fields`);
    console.log("═══════════════════════════════════════════════════════════════\n");

    try {
        // Step 1: Create the LLM configuration
        console.log("📝 Creating LLM configuration...");

        const llm = await retell.llm.create({
            model: "claude-4.5-haiku" as const,  // Fast, natural, cost-effective
            general_prompt: SYSTEM_PROMPT,
            general_tools: [
                {
                    type: "end_call",
                    name: "end_call",
                    description: "End the call when the conversation is naturally complete, customer says goodbye, or has no more questions"
                },
                {
                    type: "transfer_call",
                    name: "transfer_to_human",
                    description: "Transfer the caller to a human representative when they request to speak with a real person, manager, or express frustration with the AI",
                    transfer_destination: {
                        type: "predefined",
                        number: TRANSFER_NUMBERS.default
                    },
                    transfer_option: {
                        type: "cold_transfer"
                    }
                } as any
            ],
            begin_message: "Thank you for calling Roofing Pros USA, Florida's largest reroofing company. This is Sarah, how can I help you today?"
        });

        console.log(`✅ LLM created: ${llm.llm_id}`);

        // Step 2: Create the agent with ALL features
        console.log("🎤 Creating agent with voice, voicemail, and post-call analysis...");

        const agent = await retell.agent.create({
            agent_name: AGENT_NAME,
            response_engine: {
                type: "retell-llm",
                llm_id: llm.llm_id
            },
            // Voice settings
            voice_id: VOICE_CONFIG.voice_id,
            language: VOICE_CONFIG.language,
            voice_temperature: VOICE_CONFIG.voice_temperature,
            voice_speed: VOICE_CONFIG.voice_speed,
            responsiveness: VOICE_CONFIG.responsiveness,
            interruption_sensitivity: VOICE_CONFIG.interruption_sensitivity,
            enable_backchannel: VOICE_CONFIG.enable_backchannel,
            backchannel_frequency: VOICE_CONFIG.backchannel_frequency,
            backchannel_words: VOICE_CONFIG.backchannel_words,
            reminder_trigger_ms: VOICE_CONFIG.reminder_trigger_ms,
            reminder_max_count: VOICE_CONFIG.reminder_max_count,
            ambient_sound: VOICE_CONFIG.ambient_sound,
            ambient_sound_volume: VOICE_CONFIG.ambient_sound_volume,

            // VOICEMAIL DETECTION - Leave a message when voicemail detected
            voicemail_option: {
                action: {
                    type: "static_text",
                    text: VOICEMAIL_MESSAGE
                }
            },

            // POST-CALL DATA EXTRACTION
            post_call_analysis_data: POST_CALL_ANALYSIS_DATA,
            post_call_analysis_model: "gpt-4.1" as const,

            // Webhook for post-call processing
            webhook_url: process.env.ROOFING_WEBHOOK_URL || "https://your-server.com/api/webhooks/retell/roofing"
        });

        console.log(`✅ Agent created: ${agent.agent_id}`);

        // Output summary
        console.log("\n═══════════════════════════════════════════════════════════════");
        console.log("✅ SUCCESS! ROOFING INBOUND AGENT CREATED");
        console.log("═══════════════════════════════════════════════════════════════");
        console.log(`🆔 Agent ID: ${agent.agent_id}`);
        console.log(`🧠 LLM ID: ${llm.llm_id}`);
        console.log(`👤 Name: ${AGENT_NAME}`);
        console.log(`🎤 Voice: ${VOICE_CONFIG.voice_id}`);
        console.log(`🔄 Transfer: ${TRANSFER_NUMBERS.default}`);
        console.log(`📫 Voicemail: Will leave message when detected`);
        console.log(`📊 Post-Call Analysis: ${POST_CALL_ANALYSIS_DATA.length} fields extracted`);
        console.log("═══════════════════════════════════════════════════════════════");

        console.log(`\n📋 Add to .env:`);
        console.log(`ROOFING_RETELL_AGENT_ID="${agent.agent_id}"`);
        console.log(`ROOFING_RETELL_LLM_ID="${llm.llm_id}"`);

        console.log("\n📊 Post-Call Fields:");
        POST_CALL_ANALYSIS_DATA.forEach(field => {
            console.log(`   - ${field.name} (${field.type})`);
        });

        console.log("\n🔧 Voice Settings:");
        console.log(`   Temperature: ${VOICE_CONFIG.voice_temperature}`);
        console.log(`   Speed: ${VOICE_CONFIG.voice_speed}`);
        console.log(`   Responsiveness: ${VOICE_CONFIG.responsiveness}`);
        console.log(`   Backchannel: ${VOICE_CONFIG.backchannel_words.join(", ")}`);

        console.log("\n📞 Assign phone number +14072891565 to this agent in Retell Dashboard");

        return { agent, llm };

    } catch (error: any) {
        console.error("\n❌ Error creating agent:");
        if (error.status) {
            console.error('Status:', error.status);
        }
        if (error.error) {
            console.error('Error:', JSON.stringify(error.error, null, 2));
        } else {
            console.error(error.message || error);
        }
        process.exit(1);
    }
}

// Run
createInboundAgent();
