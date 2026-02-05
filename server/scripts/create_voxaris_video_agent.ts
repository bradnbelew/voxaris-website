import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
const envPaths = [
    path.resolve(__dirname, '../../.env'),
    path.resolve(__dirname, '../.env')
];
envPaths.forEach(p => dotenv.config({ path: p }));

const TAVUS_API_KEY = process.env.TAVUS_API_KEY;

if (!TAVUS_API_KEY) {
    console.error("❌ Missing TAVUS_API_KEY in .env");
    process.exit(1);
}

// ============================================================
// VOXARIS AI VIDEO AGENT - EMMA
// Premium Video Demo Bot with Cal.com Integration
// ============================================================

const VOXARIS_VIDEO_PROMPT = `You are Emma, a warm and engaging AI sales specialist for Voxaris AI. You're appearing on video, so be expressive and personable!

YOUR ROLE:
1. GREET visitors warmly - you're the face of Voxaris AI
2. DEMONSTRATE the power of AI video agents (you ARE the demo!)
3. EXPLAIN our products clearly:
   - VVideo: Photorealistic AI video agents (like yourself!) for 24/7 engagement
   - VVoice: Intelligent voice agents for phone calls, lead qualification, appointment booking
   - Complete AI sales automation platform
4. ANSWER questions about technology, pricing, integrations
5. BOOK DEMOS when prospects are interested

KEY VALUE PROPS:
- "I'm actually one of our VVideo agents - pretty incredible, right?"
- "Our AI agents never sleep, never take breaks, and are always in a great mood"
- "We've seen businesses increase their lead conversion by 3-4x"
- "Everything integrates seamlessly with your existing tech stack"

INDUSTRIES WE SERVE:
- Automotive Dealerships: Inbound calls, database mining, F&I explanations
- Law Firms: Intake automation, 24/7 availability
- Contractors/Roofing: Lead qualification, estimate scheduling
- Agencies: White-label platform for your clients

PERSONALITY:
- Warm, genuine, and enthusiastic
- Professional but approachable
- Use facial expressions and gestures naturally
- Speak conversationally, not scripted
- If asked about being AI: "Yes! I'm one of our VVideo agents. What you're seeing right now is exactly what your customers could experience!"

BOOKING FLOW:
1. When prospect shows interest: "Would you like to schedule a personalized demo with our team?"
2. If yes: Collect name, email, and preferred time
3. Book using Cal.com integration
4. Confirm with enthusiasm: "Perfect! You're all set!"

REMEMBER:
- You ARE the product demo - everything you do shows off VVideo's capabilities
- Keep responses concise but warm
- Guide conversations toward booking demos
- Be helpful, not pushy`;

// Tool definitions for Cal.com integration
const TOOLS_DEFINITIONS = [
    {
        type: "function",
        function: {
            name: "check_availability",
            description: "Check available time slots for a demo meeting. Always call this before offering specific times.",
            parameters: {
                type: "object",
                properties: {
                    date: {
                        type: "string",
                        description: "The date to check (YYYY-MM-DD format, or 'today', 'tomorrow', 'this week')"
                    }
                },
                required: ["date"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "book_meeting",
            description: "Book a demo meeting with the Voxaris team after confirming availability.",
            parameters: {
                type: "object",
                properties: {
                    name: {
                        type: "string",
                        description: "Customer's full name"
                    },
                    email: {
                        type: "string",
                        description: "Customer's email address"
                    },
                    datetime: {
                        type: "string",
                        description: "Confirmed ISO 8601 datetime (e.g., 2024-06-15T14:00:00Z)"
                    },
                    notes: {
                        type: "string",
                        description: "Notes about customer's interests or questions"
                    }
                },
                required: ["name", "email", "datetime"]
            }
        }
    }
];

// ============================================================
// TAVUS PERSONA CONFIGURATION
// ============================================================

const PERSONA_CONFIG = {
    persona_name: "Emma - Voxaris AI Demo",

    system_prompt: VOXARIS_VIDEO_PROMPT,

    // Use a professional female replica
    // Replace with your actual Tavus replica ID
    default_replica_id: process.env.TAVUS_VOXARIS_REPLICA_ID || "r79e99f5e26",

    // Context about the agent
    context: "You are a video AI sales agent demonstrating Voxaris AI's video agent technology.",

    // Layers configuration
    layers: {
        // Text-to-Speech settings
        tts: {
            tts_engine: "cartesia",
            external_voice_id: process.env.TAVUS_VOXARIS_VOICE_ID || "a0e99841-438c-4a64-b679-ae501e7d6091",  // Sarah - Confident
            tts_emotion_control: true,
            voice_settings: {
                speed: "normal",
                emotion: ["positivity:high", "curiosity"]
            },
            tts_model_name: "sonic-2024-12-12"
        },

        // Conversational flow settings
        conversational_flow: {
            turn_detection_model: "sparrow-1",
            turn_taking_patience: "medium",
            replica_interruptibility: "medium"
        },

        // LLM settings with tools
        llm: {
            model: "claude-3-5-sonnet",
            tools: TOOLS_DEFINITIONS
        },

        // Perception settings
        perception: {
            perception_model: "gaze-1",
            enable_facial_movement: true
        }
    }
};

async function createVoxarisVideoPersona() {
    console.log("\n🎬 VOXARIS AI VIDEO AGENT SETUP");
    console.log("================================\n");
    console.log(`📛 Name: ${PERSONA_CONFIG.persona_name}`);
    console.log(`🎭 Replica: ${PERSONA_CONFIG.default_replica_id}`);

    try {
        const response = await axios.post(
            'https://tavusapi.com/v2/personas',
            PERSONA_CONFIG,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': TAVUS_API_KEY
                }
            }
        );

        const persona = response.data;

        console.log("\n✅ VOXARIS VIDEO AGENT CREATED!");
        console.log("═══════════════════════════════════════════════════════");
        console.log(`🆔 Persona ID: ${persona.persona_id}`);
        console.log(`📛 Name: ${persona.persona_name}`);
        console.log(`🎭 Replica: ${persona.default_replica_id}`);
        console.log("═══════════════════════════════════════════════════════");
        console.log("\n📋 NEXT STEPS:");
        console.log("1. Add to .env: VOXARIS_VIDEO_PERSONA_ID=" + persona.persona_id);
        console.log("2. Set up tool handler webhook for Cal.com integration");
        console.log("3. Create a conversation to get the embed URL");
        console.log("4. Embed the video widget on voxaris.io");
        console.log("\n🔗 To create a conversation:");
        console.log("   npx ts-node scripts/create_voxaris_video_conversation.ts");

        return persona;

    } catch (error: any) {
        console.error("\n❌ Error Creating Persona:");
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
        throw error;
    }
}

async function updateExistingPersona(personaId: string) {
    console.log(`\n🔄 Updating Existing Persona: ${personaId}`);

    try {
        // Fetch current persona
        const current = await axios.get(
            `https://tavusapi.com/v2/personas/${personaId}`,
            {
                headers: { 'x-api-key': TAVUS_API_KEY }
            }
        );

        console.log("📥 Current persona fetched");

        // Update with new config
        const updatePayload = [
            { op: "replace", path: "/system_prompt", value: PERSONA_CONFIG.system_prompt },
            { op: "replace", path: "/layers", value: PERSONA_CONFIG.layers }
        ];

        const response = await axios.patch(
            `https://tavusapi.com/v2/personas/${personaId}`,
            updatePayload,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': TAVUS_API_KEY
                }
            }
        );

        console.log("✅ Persona Updated Successfully!");
        console.log("   ID:", response.data.persona_id);

        return response.data;

    } catch (error: any) {
        console.error("❌ Update Failed:", error.response?.data || error.message);
        throw error;
    }
}

// Check if updating existing or creating new
const existingPersonaId = process.env.VOXARIS_VIDEO_PERSONA_ID;

if (existingPersonaId) {
    updateExistingPersona(existingPersonaId);
} else {
    createVoxarisVideoPersona();
}
