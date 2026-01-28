import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

// Load env
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

async function getLatestConversation() {
    try {
        const conversationId = "cdfa2797c17ea4dc";
        console.log(`📥 Fetching details for ID: ${conversationId}...`);
             
        const detailResponse = await axios.get(
            `https://tavusapi.com/v2/conversations/${conversationId}?verbose=true`,
            { headers: { 'x-api-key': TAVUS_API_KEY } }
        );
        
        console.log("📝 FULL RESPONSE JSON:");
        console.log(JSON.stringify(detailResponse.data, null, 2));

    } catch (error: any) {
        console.error("❌ Error fetching conversation:", error.response?.data || error.message);
    }
}

getLatestConversation();
