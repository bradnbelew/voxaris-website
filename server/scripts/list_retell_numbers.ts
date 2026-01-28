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

if (!RETELL_API_KEY) {
    console.error("❌ Missing RETELL_API_KEY");
    process.exit(1);
}

async function listPhoneNumbers() {
    try {
        console.log("📥 Fetching phone numbers...");
        const response = await axios.get(
            'https://api.retellai.com/list-phone-numbers',
            { headers: { 'Authorization': `Bearer ${RETELL_API_KEY}` } }
        );
        
        const numbers = response.data;
        console.log(`Found ${numbers.length} numbers.`);
        
        numbers.forEach((n: any) => {
            console.log(`- ${n.phone_number} (ID: ${n.phone_number_pretty ? n.phone_number_pretty : n.phone_number}) | ID: ${n.phone_number}`);
             // Retell might return ID as the number itself or a specific ID field. Let's dump the first one fully to be sure.
             console.log(JSON.stringify(n));
        });

    } catch (error: any) {
        console.error("❌ Error fetching numbers:", error.response?.data || error.message);
    }
}

listPhoneNumbers();
