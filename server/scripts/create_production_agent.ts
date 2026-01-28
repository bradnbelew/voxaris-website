import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

// Load env
const envPaths = [
    path.resolve(__dirname, '../../.env'),
    path.resolve(__dirname, '../.env')
];
envPaths.forEach(p => dotenv.config({ path: p }));

const RETELL_API_KEY = process.env.RETELL_API_KEY;
const CUSTOM_LLM_URL = "https://hill-nissan-backend.onrender.com/api/retell-llm";
// Placeholder for Cimo voice or the Tavus voice if available. 
// Using Cimo for stability.
const VOICE_ID = "openai-Alloy"; // Standard fallback voice 

if (!RETELL_API_KEY) {
    console.error("❌ Missing RETELL_API_KEY");
    process.exit(1);
}

async function createAgent() {
    try {
        console.log(`🔨 Creating NEW Agent connected to ${CUSTOM_LLM_URL}...`);
        
        const response = await axios.post(
            'https://api.retellai.com/create-agent',
            { 
               agent_name: "Maria - VIP Buyback (Production)",
               voice_id: VOICE_ID,
               response_engine: {
                   type: "custom-llm", 
                   llm_websocket_url: CUSTOM_LLM_URL 
               },
               avatar_url: "https://hill-nissan-backend.onrender.com/assets/maria.png" // Optional
            },
            { headers: { 'Authorization': `Bearer ${RETELL_API_KEY}` } }
        );
        
        const newAgent = response.data;
        console.log("✅ SUCCESS! Created New Agent.");
        console.log(`🆔 Agent ID: ${newAgent.agent_id}`);
        console.log(`🔗 LLM URL: ${newAgent.response_engine.llm_websocket_url}`);
        
        // NOW LINK THE PHONE NUMBER AUTOMATICALLY
        const PHONE_NUMBER = "+14077594100";
        console.log(`📞 Linking ${PHONE_NUMBER} to new Agent ID...`);
        
        const linkResponse = await axios.patch(
            `https://api.retellai.com/update-phone-number/${PHONE_NUMBER}`,
            { 
                inbound_agent_id: newAgent.agent_id,
                outbound_agent_id: newAgent.agent_id
            },
            { headers: { 'Authorization': `Bearer ${RETELL_API_KEY}` } }
        );
         console.log("✅ Phone Number Updated!");

    } catch (error: any) {
        console.error("❌ Error creating/linking agent:", error.response?.data || error.message);
    }
}

createAgent();
