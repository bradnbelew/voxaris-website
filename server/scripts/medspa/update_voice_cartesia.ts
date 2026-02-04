/**
 * Update Tavus Med Spa Agent with Cartesia Voice
 *
 * Usage:
 *   npx ts-node scripts/medspa/update_voice_cartesia.ts <PERSONA_ID>
 *
 * Example:
 *   npx ts-node scripts/medspa/update_voice_cartesia.ts p_abc123xyz
 */

import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const TAVUS_API_KEY = process.env.TAVUS_API_KEY?.replace(/^["']|["']$/g, '');

// Get persona ID from command line or env
const PERSONA_ID = process.argv[2] || process.env.MEDSPA_TAVUS_PERSONA_ID || process.env.TAVUS_PERSONA_ID;

if (!TAVUS_API_KEY) {
    console.error("❌ Missing TAVUS_API_KEY in .env");
    process.exit(1);
}

if (!PERSONA_ID) {
    console.error("❌ Missing PERSONA_ID");
    console.log("\nUsage: npx ts-node scripts/medspa/update_voice_cartesia.ts <PERSONA_ID>");
    console.log("\nExample: npx ts-node scripts/medspa/update_voice_cartesia.ts p_abc123xyz");
    process.exit(1);
}

// =====================================================
// CARTESIA VOICE CONFIGURATION
// From user's exact payload - female voice
// =====================================================
const CARTESIA_VOICE_CONFIG = {
    voice_id: "9626c31c-bec5-4cca-baa8-f8ba9e84c8bc",
    model: "sonic-3",
    speed: 1,
    volume: 1,
    emotion: "excited"
};

// =====================================================
// UPDATE TAVUS PERSONA VOICE
// =====================================================
async function updateTavusVoice() {
    console.log("🏥 UPDATING TAVUS MED SPA AGENT VOICE");
    console.log("═══════════════════════════════════════════════════════════════");
    console.log(`📊 Persona ID: ${PERSONA_ID}`);
    console.log(`🎤 Voice ID: ${CARTESIA_VOICE_CONFIG.voice_id}`);
    console.log(`⚡ Model: ${CARTESIA_VOICE_CONFIG.model}`);
    console.log("═══════════════════════════════════════════════════════════════\n");

    try {
        // Tavus PATCH uses JSON Patch format (RFC 6902)
        const payload = [
            { op: "replace", path: "/layers/tts/tts_engine", value: "cartesia" },
            { op: "replace", path: "/layers/tts/external_voice_id", value: CARTESIA_VOICE_CONFIG.voice_id },
            { op: "replace", path: "/layers/tts/tts_model_name", value: CARTESIA_VOICE_CONFIG.model },
            { op: "replace", path: "/layers/tts/tts_emotion_control", value: true },
            { op: "replace", path: "/layers/tts/voice_settings", value: {
                speed: CARTESIA_VOICE_CONFIG.speed,
                volume: CARTESIA_VOICE_CONFIG.volume,
                emotion: [CARTESIA_VOICE_CONFIG.emotion]
            }}
        ];

        console.log("📤 Sending update to Tavus API...\n");
        console.log("Payload:", JSON.stringify(payload, null, 2));

        const response = await axios.patch(
            `https://tavusapi.com/v2/personas/${PERSONA_ID}`,
            payload,
            {
                headers: {
                    'x-api-key': TAVUS_API_KEY,
                    'Content-Type': 'application/json-patch+json'
                }
            }
        );

        console.log("\n✅ SUCCESS! Voice updated!");
        console.log("═══════════════════════════════════════════════════════════════");
        console.log(`🆔 Persona: ${PERSONA_ID}`);
        console.log(`🎤 Voice: Cartesia ${CARTESIA_VOICE_CONFIG.voice_id}`);
        console.log(`⚡ Model: ${CARTESIA_VOICE_CONFIG.model}`);
        console.log(`🎭 Emotion: ${CARTESIA_VOICE_CONFIG.emotion}`);
        console.log("═══════════════════════════════════════════════════════════════");
        console.log("\n🧪 Test by starting a new conversation with the agent.");

        return response.data;

    } catch (error: any) {
        console.error("\n❌ Error updating Tavus persona:");
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error('Response:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
        process.exit(1);
    }
}

// Run
updateTavusVoice();
