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
const PHONE_NUMBER = "+14077594100";
const AGENT_ID = "agent_4899f1434beabfa398e34418e8";

if (!RETELL_API_KEY) {
    console.error("❌ Missing RETELL_API_KEY");
    process.exit(1);
}

async function connectNumber() {
    try {
        console.log(`🔗 Connecting ${PHONE_NUMBER} to Agent ${AGENT_ID}...`);
        
        const response = await axios.patch(
            `https://api.retellai.com/update-phone-number/${PHONE_NUMBER}`,
            { 
                inbound_agent_id: AGENT_ID,
                outbound_agent_id: AGENT_ID
            },
            { headers: { 'Authorization': `Bearer ${RETELL_API_KEY}` } }
        );
        
        console.log("✅ SUCCESS! Number Updated:");
        console.log(JSON.stringify(response.data, null, 2));

    } catch (error: any) {
        console.error("❌ Error connecting number:", error.response?.data || error.message);
    }
}

connectNumber();
