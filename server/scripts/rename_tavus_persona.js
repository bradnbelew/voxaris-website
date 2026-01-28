const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const TAVUS_API_KEY = process.env.TAVUS_API_KEY;
const PERSONA_ID = "p7aae9095144"; 

async function renamePersona() {
    console.log(`Renaming Persona ${PERSONA_ID}...`);
    try {
        // Tavus requires JSON Patch format (RFC 6902)
        const patchPayload = [
            { "op": "replace", "path": "/persona_name", "value": "Maria - VIP Buyback Agent" }
        ];

        const response = await axios.patch(
            `https://tavusapi.com/v2/personas/${PERSONA_ID}`,
            patchPayload,
            { headers: { 'x-api-key': TAVUS_API_KEY, 'Content-Type': 'application/json' } }
        );
        console.log("✅ Renamed successfully to:", response.data.persona_name);
    } catch (error) {
        console.error("❌ Error:", error.message);
        if (error.response) {
            console.error(JSON.stringify(error.response.data, null, 2));
        }
    }
}

renamePersona();
