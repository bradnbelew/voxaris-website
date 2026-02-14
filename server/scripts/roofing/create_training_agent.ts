/**
 * Create Roofing Pros USA Video Training Agent
 *
 * This script creates a Tavus AI video agent for interactive 1:1 training
 * of sales representatives. The agent simulates different customer scenarios
 * and provides real-time coaching.
 *
 * Training Topics:
 * - Insurance claims process (Florida-specific)
 * - Objection handling
 * - Product knowledge (shingle, metal, tile)
 * - Closing techniques
 *
 * Usage: npx ts-node scripts/roofing/create_training_agent.ts
 */

import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
const envPaths = [
    path.resolve(__dirname, '../../.env'),
    path.resolve(__dirname, '../.env')
];
envPaths.forEach(p => dotenv.config({ path: p }));

// Use Roofing-specific Tavus API key (separate account from Voxaris)
const TAVUS_API_KEY = process.env.ROOFING_TAVUS_API_KEY || process.env.TAVUS_API_KEY;

if (!TAVUS_API_KEY) {
    console.error("❌ Missing ROOFING_TAVUS_API_KEY in .env");
    console.log("\n💡 Get your API key from: https://app.tavus.io/settings/api");
    process.exit(1);
}

// Helper to list available replicas
async function listAvailableReplicas() {
    console.log("\n🔍 Fetching available replicas from your Tavus account...\n");
    try {
        const response = await axios.get(
            'https://tavusapi.com/v2/replicas',
            { headers: { 'x-api-key': TAVUS_API_KEY } }
        );
        const replicas = response.data.data || response.data || [];
        if (replicas.length === 0) {
            console.log("   No replicas found. Create one at: https://app.tavus.io/replicas");
            console.log("   Or use a stock replica ID from Tavus documentation.");
            return null;
        }
        console.log("   Available replicas:");
        replicas.forEach((r: any, i: number) => {
            console.log(`   ${i + 1}. ${r.replica_name || 'Unnamed'} (${r.replica_id})`);
        });
        return replicas[0]?.replica_id; // Return first available
    } catch (error: any) {
        if (error.response?.status === 401) {
            console.error("   ❌ Invalid API key. Get a new one from: https://app.tavus.io/settings/api");
        } else {
            console.error("   Error:", error.response?.data?.message || error.message);
        }
        return null;
    }
}

import { COACH_PRO_PROMPT } from './coach_pro_prompt';

// ============================================================
// COACH PRO - ROOFING PROS USA TRAINING AI
// Interactive Video Training Agent for Sales Reps
// ============================================================

// ============================================================
// TAVUS PERSONA CONFIGURATION
// ============================================================

const PERSONA_CONFIG = {
    persona_name: "Coach Pro - Roofing Sales Training",

    system_prompt: COACH_PRO_PROMPT,

    // Roofing Pros USA replica (Anna - Office)
    default_replica_id: process.env.ROOFING_TRAINER_REPLICA_ID || "r4dcf31b60e1",

    context: "You are Coach Pro, an elite AI sales training coach for Roofing Pros USA, providing 1:1 sales training, roleplay practice, and performance coaching.",

    // Layers configuration
    layers: {
        // Text-to-Speech settings - Using Cartesia Sonic 3 for best quality
        tts: {
            tts_engine: "cartesia",
            // Use one of Cartesia's recommended emotive voices
            external_voice_id: process.env.ROOFING_TRAINER_VOICE_ID || "f9836c6e-a0bd-460e-9d3c-f7299fa60f94",
            tts_emotion_control: true,
            // Use latest Sonic 3 model for best expressiveness
            tts_model_name: "sonic-3",
            // Voice settings for natural, expressive coaching voice
            // Reference: https://docs.tavus.io/sections/conversational-video-interface/persona/tts
            voice_settings: {
                speed: "fast", // Energetic pace for engagement
                // Primary emotions for coaching - Cartesia Sonic 3 supports 60+ emotions
                // Best for coaching: enthusiastic, confident, friendly, excited, curious
                emotion: [
                    "enthusiastic:high",
                    "confident:high",
                    "friendly:medium"
                ]
            }
        },

        // Conversational flow settings - Patient for training scenarios
        conversational: {
            turn_detection_model: "sparrow-1",
            turn_taking_patience: "high", // More patience for trainees thinking
            replica_interruptibility: "low" // Let trainees finish their thoughts
        },

        // Perception settings - Raven for visual awareness
        perception: {
            perception_model: "raven-1",
            ambient_awareness: true // Detect engagement, confusion, frustration
        }
    }
};

// ============================================================
// CREATE OR UPDATE PERSONA
// ============================================================

async function createTrainingPersona() {
    console.log("\n🎓 ROOFING PROS USA - VIDEO TRAINING AGENT SETUP");
    console.log("══════════════════════════════════════════════════\n");
    console.log(`📛 Name: ${PERSONA_CONFIG.persona_name}`);
    console.log(`🎭 Replica: ${PERSONA_CONFIG.default_replica_id}`);
    console.log(`🎯 Purpose: Interactive 1:1 sales training`);
    console.log(`📚 Topics: Insurance claims, objections, products, closing`);

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

        console.log("\n✅ TRAINING AGENT CREATED SUCCESSFULLY!");
        console.log("═══════════════════════════════════════════════════════");
        console.log(`🆔 Persona ID: ${persona.persona_id}`);
        console.log(`📛 Name: ${persona.persona_name}`);
        console.log(`🎭 Replica: ${persona.default_replica_id}`);
        console.log("═══════════════════════════════════════════════════════");

        console.log("\n📋 ADD TO .env:");
        console.log(`ROOFING_TRAINING_PERSONA_ID="${persona.persona_id}"`);

        console.log("\n🔧 TRAINING MODES:");
        console.log("   1. ROLEPLAY: Say 'let's roleplay' to practice scenarios");
        console.log("   2. TEACHING: Ask about insurance, objections, products, closing");

        console.log("\n📞 TO START A TRAINING SESSION:");
        console.log("   npx ts-node scripts/roofing/start_training_session.ts");

        console.log("\n🎓 TRAINING TOPICS COVERED:");
        console.log("   - Florida insurance claims (deductibles, supplements, AOB)");
        console.log("   - Objection handling (A.C.E. method)");
        console.log("   - Product knowledge (shingle, metal, tile)");
        console.log("   - Closing techniques");

        return persona;

    } catch (error: any) {
        console.error("\n❌ Error Creating Training Persona:");
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
        throw error;
    }
}

async function updateTrainingPersona(personaId: string) {
    console.log(`\n🔄 Updating Training Persona: ${personaId}`);

    try {
        // Fetch current persona
        await axios.get(
            `https://tavusapi.com/v2/personas/${personaId}`,
            {
                headers: { 'x-api-key': TAVUS_API_KEY }
            }
        );

        console.log("📥 Current persona fetched");

        // Update with new config
        const updatePayload = [
            { op: "replace", path: "/system_prompt", value: PERSONA_CONFIG.system_prompt },
            { op: "replace", path: "/layers", value: PERSONA_CONFIG.layers },
            { op: "replace", path: "/persona_name", value: PERSONA_CONFIG.persona_name }
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

        console.log("\n✅ Training Persona Updated Successfully!");
        console.log(`   ID: ${response.data.persona_id}`);
        console.log(`   Name: ${response.data.persona_name}`);

        return response.data;

    } catch (error: any) {
        console.error("❌ Update Failed:", error.response?.data || error.message);
        throw error;
    }
}

// ============================================================
// MAIN
// ============================================================

async function main() {
    const existingPersonaId = process.env.ROOFING_TRAINING_PERSONA_ID;
    const configuredReplicaId = process.env.ROOFING_TRAINER_REPLICA_ID;

    // First, verify API key works by listing replicas
    const validReplicaId = await listAvailableReplicas();

    if (!validReplicaId && !configuredReplicaId) {
        console.error("\n❌ No valid replica ID available.");
        console.log("\n💡 To fix this:");
        console.log("   1. Get a fresh API key from https://app.tavus.io/settings/api");
        console.log("   2. Update ROOFING_TAVUS_API_KEY in server/.env");
        console.log("   3. Set ROOFING_TRAINER_REPLICA_ID in .env to a replica ID from the list above");
        process.exit(1);
    }

    // Use configured replica ID if set, otherwise use first available
    if (configuredReplicaId) {
        PERSONA_CONFIG.default_replica_id = configuredReplicaId;
        console.log(`\n   Using configured replica: ${configuredReplicaId}`);
    } else if (validReplicaId) {
        PERSONA_CONFIG.default_replica_id = validReplicaId;
        console.log(`\n   Using first available replica: ${validReplicaId}`);
    }

    if (existingPersonaId) {
        console.log(`\n📝 Found existing persona ID: ${existingPersonaId}`);
        console.log("   Updating with latest configuration...");
        await updateTrainingPersona(existingPersonaId);
    } else {
        console.log("\n🆕 Creating new training persona...");
        await createTrainingPersona();
    }
}

main().catch(error => {
    console.error("\n💥 Fatal error:", error.message);

    if (error.response?.status === 401) {
        console.log("\n🔑 Your Tavus API key is invalid or expired.");
        console.log("   Get a new one from: https://app.tavus.io/settings/api");
    }

    process.exit(1);
});
