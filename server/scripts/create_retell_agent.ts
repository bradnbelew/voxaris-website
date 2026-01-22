import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const RETELL_API_KEY = process.env.RETELL_API_KEY;
const CUSTOM_LLM_URL = process.env.CUSTOM_LLM_URL || 'https://your-server.onrender.com/api';

if (!RETELL_API_KEY) {
    console.error("❌ Missing RETELL_API_KEY in .env");
    process.exit(1);
}

// ============================================================
// RETELL AGENT CONFIGURATION - TOP 1% OLIVIA
// ============================================================

const AGENT_CONFIG = {
    // Agent Name & Description
    agent_name: "Olivia - Hill Nissan Acquisition",
    
    // Voice: Same as Tavus (Cartesia "Sarah" - Confident)
    voice_id: "a0e99841-438c-4a64-b679-ae501e7d6091",
    
    // Custom LLM Configuration
    llm_websocket_url: `${CUSTOM_LLM_URL}/retell-llm`,
    
    // Voice Settings (matches Tavus Olivia)
    voice_speed: 1.1,
    voice_temperature: 0.7,
    responsiveness: 0.9,  // High responsiveness for natural flow
    interruption_sensitivity: 0.6,  // Allow some interruption for natural convo
    
    // Enable features
    enable_backchannel: true,  // "mm-hmm", "yeah", etc.
    backchannel_frequency: 0.8,
    
    // Call settings
    ambient_sound: "office",  // Professional background
    
    // Webhook configuration (n8n integration)
    webhook_url: process.env.N8N_WEBHOOK_URL || "https://your-n8n.app.n8n.cloud/webhook/call-completed",
    
    // End call settings
    end_call_after_silence_ms: 10000,  // 10 second silence = end
    max_call_duration_ms: 600000,  // 10 minute max
    
    // Post-call analysis
    post_call_analysis_enabled: true,
    post_call_analysis_data: [
        {
            name: "appointment_booked",
            type: "boolean",
            description: "Whether customer agreed to an appointment"
        },
        {
            name: "objection_type",
            type: "string",
            description: "Main objection raised (price, busy, loan, not_interested, none)"
        },
        {
            name: "next_action",
            type: "string",
            description: "Recommended follow-up (sales_call, nurture_3day, remove_from_list)"
        }
    ],

    // Dynamic variables for personalization
    dynamic_variables: [
        { name: "customer_name", default_value: "there" },
        { name: "car_model", default_value: "your vehicle" },
        { name: "manager_name", default_value: "Marcus" },
        { name: "offer_expiration", default_value: "this Friday" }
    ],

    // Pronunciation corrections
    pronunciation_dictionary: [
        { word: "Nissan", pronunciation: "NEE-sahn" },
        { word: "Olivia", pronunciation: "oh-LIV-ee-uh" },
        { word: "Marcus", pronunciation: "MAR-kus" }
    ]
};

async function createRetellAgent() {
    console.log("🚀 Creating Retell AI Agent: Olivia");
    console.log(`🔊 Voice: Cartesia Sarah (${AGENT_CONFIG.voice_id})`);
    console.log(`🔗 Custom LLM: ${AGENT_CONFIG.llm_websocket_url}`);

    try {
        const response = await axios.post(
            'https://api.retellai.com/v2/create-agent',
            {
                agent_name: AGENT_CONFIG.agent_name,
                voice_id: AGENT_CONFIG.voice_id,
                llm_websocket_url: AGENT_CONFIG.llm_websocket_url,
                voice_speed: AGENT_CONFIG.voice_speed,
                voice_temperature: AGENT_CONFIG.voice_temperature,
                responsiveness: AGENT_CONFIG.responsiveness,
                interruption_sensitivity: AGENT_CONFIG.interruption_sensitivity,
                enable_backchannel: AGENT_CONFIG.enable_backchannel,
                backchannel_frequency: AGENT_CONFIG.backchannel_frequency,
                ambient_sound: AGENT_CONFIG.ambient_sound,
                webhook_url: AGENT_CONFIG.webhook_url,
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
        
        console.log("\n✅ AGENT CREATED SUCCESSFULLY!");
        console.log("═══════════════════════════════════════");
        console.log(`🆔 Agent ID: ${agent.agent_id}`);
        console.log(`📛 Name: ${agent.agent_name}`);
        console.log(`🔊 Voice: ${agent.voice_id}`);
        console.log(`🌐 Webhook: ${agent.webhook_url}`);
        console.log("═══════════════════════════════════════");
        console.log("\n📋 NEXT STEPS:");
        console.log("1. Add to .env: RETELL_AGENT_ID=" + agent.agent_id);
        console.log("2. Deploy your server with the /api/retell-llm endpoint");
        console.log("3. Configure n8n webhook to receive call events");
        console.log("4. Test with: npx ts-node scripts/test_retell_call.ts");

        return agent;

    } catch (error: any) {
        console.error("❌ Error Creating Agent:");
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error('Error:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
}

async function updateRetellAgent(agentId: string) {
    console.log(`🔄 Updating Retell Agent: ${agentId}`);

    try {
        const response = await axios.patch(
            `https://api.retellai.com/v2/update-agent/${agentId}`,
            {
                agent_name: AGENT_CONFIG.agent_name,
                voice_id: AGENT_CONFIG.voice_id,
                llm_websocket_url: AGENT_CONFIG.llm_websocket_url,
                voice_speed: AGENT_CONFIG.voice_speed,
                responsiveness: AGENT_CONFIG.responsiveness,
                webhook_url: AGENT_CONFIG.webhook_url
            },
            {
                headers: {
                    'Authorization': `Bearer ${RETELL_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log("✅ Agent Updated Successfully!");
        console.log(JSON.stringify(response.data, null, 2));

    } catch (error: any) {
        console.error("❌ Error Updating Agent:", error.response?.data || error.message);
    }
}

// Check if updating existing or creating new
const existingAgentId = process.env.RETELL_AGENT_ID;

if (existingAgentId) {
    updateRetellAgent(existingAgentId);
} else {
    createRetellAgent();
}
