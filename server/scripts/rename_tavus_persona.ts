import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const TAVUS_API_KEY = process.env.TAVUS_API_KEY;
const PERSONA_ID = "p7aae9095144"; // The one we optimized

async function renamePersona() {
    try {
        console.log(`Renaming Persona ${PERSONA_ID}...`);
        const response = await axios.patch(
            `https://tavusapi.com/v2/personas/${PERSONA_ID}`,
            { persona_name: "Olivia - Hill Nissan Acquisition (ACTIVE)" },
            { headers: { 'x-api-key': TAVUS_API_KEY } }
        );
        console.log("✅ Renamed successfully to:", response.data.persona_name);
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

renamePersona();
