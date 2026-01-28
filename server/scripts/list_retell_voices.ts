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

async function listVoices() {
    try {
        const response = await axios.get(
            'https://api.retellai.com/list-voices',
            { headers: { 'Authorization': `Bearer ${RETELL_API_KEY}` } }
        );
        
        console.log("Existing Voices:");
        response.data.forEach((v: any) => {
            console.log(`- ${v.voice_name} (${v.provider}): ${v.voice_id}`);
        });
    } catch (error: any) {
        console.error("Error listing voices:", error.response?.data || error.message);
    }
}

listVoices();
