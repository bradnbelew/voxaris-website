import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const RETELL_API_KEY = process.env.RETELL_API_KEY;

if (!RETELL_API_KEY) {
    console.error("❌ Missing RETELL_API_KEY in .env");
    process.exit(1);
}

// ============================================================
// VOXARIS AI VOICE AGENT - ALEX
// Premium Sales Demo Bot with Cal.com Integration
// ============================================================

const VOXARIS_SYSTEM_PROMPT = `You are Alex, a friendly and knowledgeable AI sales representative for Voxaris AI. Your role is to:

1. WELCOME visitors warmly and introduce yourself
2. EXPLAIN Voxaris AI's products clearly and enthusiastically:
   - VVideo: Photorealistic AI video agents powered by Tavus that engage leads 24/7
   - VVoice: Intelligent voice agents powered by Retell AI that handle calls, qualify leads, and book appointments
   - Both work together to create a complete AI sales automation system
3. ANSWER questions about:
   - How the technology works
   - Pricing (suggest they book a demo for custom pricing)
   - Use cases: Automotive dealerships, Law firms, Contractors, Agencies
   - Integration capabilities (CRMs, calendars, etc.)
4. BOOK MEETINGS when the prospect is interested - use Cal.com integration

KEY TALKING POINTS:
- "Our AI agents work 24/7 so you never miss a lead"
- "We've helped businesses increase conversions by 3-4x"
- "The video agents look and sound completely human"
- "Voice agents can handle hundreds of concurrent calls"
- "Everything integrates with your existing CRM"

PERSONALITY:
- Warm, professional, and genuinely helpful
- Speak naturally, not like a script
- Use short, punchy sentences
- Be enthusiastic about the technology
- If asked if you're AI, be honest: "Yes, I'm actually one of our VVoice agents! Pretty cool, right?"

BOOKING FLOW:
When prospect wants to learn more or seems interested:
1. Ask: "Would you like to schedule a personalized demo with our team?"
2. If yes, collect: name, email, preferred time
3. Use the book_meeting tool to schedule on Cal.com
4. Confirm the booking details

OBJECTION HANDLING:
- "Too expensive" → "I totally understand. Our pricing is actually quite competitive, and the ROI typically pays for itself within the first month. Let me show you some case studies in a quick demo."
- "Not ready" → "No problem at all! Want me to send you some information to review first? Or I can book a demo for next week to give you time to think it over."
- "Already have a solution" → "That's great! Many of our clients came from other solutions. What made you curious about Voxaris today?"

Remember: Your goal is to be helpful and informative, not pushy. Build rapport and guide interested prospects to book a demo.`;

// Tool definitions for Cal.com integration (Retell format)
const TOOLS = [
    {
        type: "custom",
        name: "check_availability",
        description: "Check available time slots for a demo meeting. Call this before booking.",
        url: process.env.VOXARIS_TOOL_HANDLER_URL || "https://exteehwwpcbibttpvswx.supabase.co/functions/v1/voxaris-tool-handler",
        speak_during_execution: true,
        speak_after_execution: false,
        parameters: {
            type: "object",
            properties: {
                date: {
                    type: "string",
                    description: "The date to check in YYYY-MM-DD format, or 'today', 'tomorrow', 'this week'"
                }
            },
            required: ["date"]
        }
    },
    {
        type: "custom",
        name: "book_meeting",
        description: "Book a demo meeting after confirming availability and collecting customer info.",
        url: process.env.VOXARIS_TOOL_HANDLER_URL || "https://exteehwwpcbibttpvswx.supabase.co/functions/v1/voxaris-tool-handler",
        speak_during_execution: true,
        speak_after_execution: false,
        parameters: {
            type: "object",
            properties: {
                customer_name: {
                    type: "string",
                    description: "Customer's full name"
                },
                email: {
                    type: "string",
                    description: "Customer's email address"
                },
                datetime: {
                    type: "string",
                    description: "The confirmed ISO 8601 datetime (e.g., 2024-06-15T14:00:00Z)"
                },
                notes: {
                    type: "string",
                    description: "Any notes about what the customer wants to discuss"
                }
            },
            required: ["customer_name", "email", "datetime"]
        }
    }
];

const AGENT_CONFIG = {
    agent_name: "Alex - Voxaris AI Sales Demo",

    // Voice: Professional, friendly male voice
    voice_id: "11labs-Adrian",  // ElevenLabs Adrian - professional male

    // Response Model (built-in LLM)
    response_engine: {
        type: "retell-llm",
        llm_id: null  // Will be created
    },

    // Voice Settings
    voice_speed: 1.05,
    voice_temperature: 0.7,
    responsiveness: 0.85,
    interruption_sensitivity: 0.6,

    // Natural conversation features
    enable_backchannel: true,
    backchannel_frequency: 0.7,

    // Call settings
    ambient_sound: null,  // Clean audio
    ambient_sound_volume: 0,

    // End call settings
    end_call_after_silence_ms: 15000,
    max_call_duration_ms: 900000,  // 15 minute max

    // Post-call analysis
    post_call_analysis_data: [
        {
            name: "meeting_booked",
            type: "boolean",
            description: "Whether a demo meeting was booked"
        },
        {
            name: "interest_level",
            type: "string",
            description: "High, Medium, or Low interest level"
        },
        {
            name: "product_interest",
            type: "string",
            description: "VVideo, VVoice, or Both"
        },
        {
            name: "industry",
            type: "string",
            description: "Industry mentioned (automotive, legal, contractors, agency, other)"
        }
    ]
};

async function createRetellLLM() {
    console.log("🧠 Creating Retell LLM for Voxaris...");

    try {
        const response = await axios.post(
            'https://api.retellai.com/create-retell-llm',
            {
                model: "claude-4.5-sonnet",
                general_prompt: VOXARIS_SYSTEM_PROMPT,
                general_tools: TOOLS,
                begin_message: "Hey there! This is Alex from Voxaris AI. Thanks for checking us out! What brings you to Voxaris today?",
                model_temperature: 0.7,
                max_tokens: 500
            },
            {
                headers: {
                    'Authorization': `Bearer ${RETELL_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log("✅ LLM Created! ID:", response.data.llm_id);
        return response.data.llm_id;

    } catch (error: any) {
        console.error("❌ Error creating LLM:", error.response?.data || error.message);
        throw error;
    }
}

async function createVoxarisAgent(llmId: string) {
    console.log("🚀 Creating Voxaris Voice Agent...");
    console.log(`🔊 Voice: ${AGENT_CONFIG.voice_id}`);
    console.log(`🧠 LLM ID: ${llmId}`);

    try {
        const response = await axios.post(
            'https://api.retellai.com/create-agent',
            {
                agent_name: AGENT_CONFIG.agent_name,
                voice_id: AGENT_CONFIG.voice_id,
                llm_websocket_url: undefined,  // Using Retell LLM
                response_engine: {
                    type: "retell-llm",
                    llm_id: llmId
                },
                voice_speed: AGENT_CONFIG.voice_speed,
                voice_temperature: AGENT_CONFIG.voice_temperature,
                responsiveness: AGENT_CONFIG.responsiveness,
                interruption_sensitivity: AGENT_CONFIG.interruption_sensitivity,
                enable_backchannel: AGENT_CONFIG.enable_backchannel,
                backchannel_frequency: AGENT_CONFIG.backchannel_frequency,
                ambient_sound: AGENT_CONFIG.ambient_sound,
                end_call_after_silence_ms: AGENT_CONFIG.end_call_after_silence_ms,
                max_call_duration_ms: AGENT_CONFIG.max_call_duration_ms,
                post_call_analysis_data: AGENT_CONFIG.post_call_analysis_data
            },
            {
                headers: {
                    'Authorization': `Bearer ${RETELL_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const agent = response.data;

        console.log("\n✅ VOXARIS VOICE AGENT CREATED!");
        console.log("═══════════════════════════════════════════════════════");
        console.log(`🆔 Agent ID: ${agent.agent_id}`);
        console.log(`📛 Name: ${agent.agent_name}`);
        console.log(`🔊 Voice: ${agent.voice_id}`);
        console.log(`🧠 LLM: ${llmId}`);
        console.log("═══════════════════════════════════════════════════════");
        console.log("\n📋 NEXT STEPS:");
        console.log("1. Add to .env: VOXARIS_VOICE_AGENT_ID=" + agent.agent_id);
        console.log("2. Add to .env: VOXARIS_VOICE_LLM_ID=" + llmId);
        console.log("3. Set up Cal.com webhook handler for tool calls");
        console.log("4. Embed the web call widget on voxaris.io");
        console.log("\n🔗 Test call: Use Retell dashboard or create web call");

        return agent;

    } catch (error: any) {
        console.error("❌ Error Creating Agent:");
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error('Error:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
        throw error;
    }
}

async function main() {
    console.log("\n🎙️ VOXARIS AI VOICE AGENT SETUP");
    console.log("================================\n");

    try {
        // Step 1: Create the LLM
        const llmId = await createRetellLLM();

        // Step 2: Create the Agent
        await createVoxarisAgent(llmId);

        console.log("\n✨ Setup complete! Your Voxaris voice bot is ready.");

    } catch (error) {
        console.error("\n❌ Setup failed. Check errors above.");
        process.exit(1);
    }
}

main();
