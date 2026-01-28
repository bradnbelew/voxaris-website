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
const AGENT_ID = "agent_4899f1434beabfa398e34418e8";
// Try using the WSS protocol if HTTPS fails, but let's try HTTPS first as some docs suggest webhook support.
// Ideally, this should be wss://hill-nissan-backend.onrender.com/api/retell-llm
// But our server is Express HTTP. 
// Let's try to set it to wss, assuming Render might handle upgrade?
// No, Express needs ws library.
// Let's try HTTPS first.
const CUSTOM_LLM_URL = "https://hill-nissan-backend.onrender.com/api/retell-llm";

if (!RETELL_API_KEY) {
    console.error("❌ Missing RETELL_API_KEY");
    process.exit(1);
}

async function updateAgentUrl() {
    try {
        console.log(`🔗 Connecting Agent ${AGENT_ID} to Custom LLM: ${CUSTOM_LLM_URL}...`);
        
        const response = await axios.patch(
            `https://api.retellai.com/update-agent/${AGENT_ID}`,
            { 
               response_engine: {
                   type: "custom-llm", // Using hyphen as per standard API convention
                   llm_websocket_url: CUSTOM_LLM_URL 
               }
            },
            { headers: { 'Authorization': `Bearer ${RETELL_API_KEY}` } }
        );
        
        console.log("✅ SUCCESS! Agent Updated to use Render Backend.");
        console.log(JSON.stringify(response.data, null, 2));

    } catch (error: any) {
        console.error("❌ Error updating agent:", error.response?.data || error.message);
        
        // If it failed because of http scheme, try wss
        if (error.response?.data?.error_message?.includes("scheme")) {
             console.log("🔄 Retrying with WSS scheme...");
             const wssUrl = CUSTOM_LLM_URL.replace("https://", "wss://");
             try {
                const response2 = await axios.patch(
                    `https://api.retellai.com/update-agent/${AGENT_ID}`,
                    { 
                       response_engine: {
                           type: "custom_llm", 
                           llm_websocket_url: wssUrl 
                       }
                    },
                    { headers: { 'Authorization': `Bearer ${RETELL_API_KEY}` } }
                );
                console.log("✅ SUCCESS! Agent Updated with WSS.");
                console.log(JSON.stringify(response2.data, null, 2));
             } catch (err2: any) {
                 console.error("❌ WSS Retry Failed:", err2.response?.data || err2.message);
             }
        }
    }
}

updateAgentUrl();
