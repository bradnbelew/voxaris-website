
import Retell from 'retell-sdk';
import dotenv from 'dotenv';
import path from 'path';

// Load Envs
const envPaths = [
    path.resolve(__dirname, '../../.env'),
    path.resolve(__dirname, '../.env')
];
envPaths.forEach(p => dotenv.config({ path: p }));

const RETELL_API_KEY = process.env.RETELL_API_KEY;

if (!RETELL_API_KEY) {
    console.error("❌ Missing RETELL_API_KEY");
    process.exit(1);
}

const retell = new Retell({
    apiKey: RETELL_API_KEY
});

async function getCall() {
    try {
        const callId = "call_c609caeabe5589c236dd668df1b";
        console.log(`🔍 Fetching full details for ${callId}...`);
        const call = await retell.call.retrieve(callId);
        console.log(JSON.stringify(call, null, 2));
    } catch (err: any) {
        console.error("❌ Error fetching call:", err);
    }
}

getCall();
