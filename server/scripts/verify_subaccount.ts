import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

// Load env
const envPaths = [
    path.resolve(__dirname, '../../.env'),
    path.resolve(__dirname, '../.env')
];
envPaths.forEach(p => dotenv.config({ path: p }));

const GHL_ACCESS_TOKEN = process.env.GHL_ACCESS_TOKEN; // The Sub-Account Token
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

if (!GHL_ACCESS_TOKEN) {
    console.error("❌ Missing GHL_ACCESS_TOKEN");
    process.exit(1);
}

async function verifySubAccountAccess() {
    try {
        console.log(`🔌 Verifying SUB-ACCOUNT Token (${(GHL_ACCESS_TOKEN as string).substring(0, 10)}...)...`);
        
        // 1. Try to List Contacts (Read Access) WITHOUT Location ID (if self-scoped)
        // Note: For PIT, sometimes you still need Location-Id header if user has multiple.
        // Let's try simple first.
        console.log("👉 Testing Contact Access...");
        const contactsResp = await axios.get(
            `https://services.leadconnectorhq.com/contacts/?limit=1`, 
            { 
                headers: { 
                    'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
                    'Version': '2021-07-28' 
                } 
            }
        ).catch(async (err) => {
             // If failed, try WITH Location ID explicitly
             console.log("   ⚠️ Direct access failed, retrying with Location ID header...");
             return await axios.get(
                `https://services.leadconnectorhq.com/contacts/?locationId=${GHL_LOCATION_ID}&limit=1`,
                { 
                    headers: { 
                        'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
                        'Version': '2021-07-28' 
                    } 
                }
             );
        });
        
        console.log(`✅ Success! Found ${contactsResp.data.contacts.length} contacts.`);

    } catch (error: any) {
        console.error("❌ Verification Failed:", error.response?.data || error.message);
    }
}

verifySubAccountAccess();
