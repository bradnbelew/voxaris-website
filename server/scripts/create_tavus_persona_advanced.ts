import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

// Load Env
const envPaths = [
    path.resolve(__dirname, '../../.env'),
    path.resolve(__dirname, '../.env')
];
envPaths.forEach(p => dotenv.config({ path: p }));

const TAVUS_API_KEY = process.env.TAVUS_API_KEY;

if (!TAVUS_API_KEY) {
    console.error("❌ Missing TAVUS_API_KEY");
    process.exit(1);
}

const PAYLOAD = {
  "persona_name": "Maria - VIP Acquisition (Minimal)",
  "system_prompt": "You are Maria, a warm and genuinely excited VIP Acquisition Specialist at Hill Nissan. You're 28, love your job, and get genuinely happy when you can help someone get top dollar for their car...",
  "default_replica_id": process.env.TAVUS_REPLICA_ID || "rc2146c13e81"
};

async function createPersona() {
    console.log(`🚀 Creating NEW Tavus Persona (Maria Final)...`);
    try {
        const url = `https://tavusapi.com/v2/personas`;
        const response = await axios.post(url, PAYLOAD, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': TAVUS_API_KEY
            }
        });
        
        console.log("✅ Persona Created Successfully!");
        console.log("   Name:", response.data.persona_name);
        console.log("   NEW ID:", response.data.persona_id);
    } catch (error: any) {
        console.error("❌ Creation Failed:", error.message);
        if (error.response) {
            console.error("   API Error:", JSON.stringify(error.response.data, null, 2));
        }
    }
}

createPersona();
