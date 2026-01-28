import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

// Load env
const envPaths = [
    path.resolve(__dirname, '../../.env'),
    path.resolve(__dirname, '../.env')
];
envPaths.forEach(p => dotenv.config({ path: p }));

const GHL_ACCESS_TOKEN = process.env.GHL_ACCESS_TOKEN;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

if (!GHL_ACCESS_TOKEN || !GHL_LOCATION_ID) {
    console.error("❌ Missing GHL Credentials");
    process.exit(1);
}

async function verifyLocationAccess() {
    try {
        console.log(`🔌 Verifying access to Location: ${GHL_LOCATION_ID}...`);
        
        // 1. Fetch Location Details
        const locResp = await axios.get(
            `https://services.leadconnectorhq.com/locations/${GHL_LOCATION_ID}`,
            { 
                headers: { 
                    'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
                    'Version': '2021-07-28' 
                } 
            }
        );
        console.log(`✅ Location Verified: ${locResp.data.location.name}`);

        // 2. Try to List Contacts (Read Access)
        console.log("👉 Testing Contact Read Access...");
        const contactsResp = await axios.get(
            `https://services.leadconnectorhq.com/contacts/?locationId=${GHL_LOCATION_ID}&limit=1`,
            { 
                headers: { 
                    'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
                    'Version': '2021-07-28' 
                } 
            }
        );
        console.log(`✅ Success! Found ${contactsResp.data.contacts.length} contacts (limit 1).`);

    } catch (error: any) {
        console.error("❌ verification Failed:", error.response?.data || error.message);
    }
}

verifyLocationAccess();
