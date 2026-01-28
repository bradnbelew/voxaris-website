import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

// 1. Load Envs FIRST
const envPaths = [
    path.resolve(__dirname, '../../.env'),
    path.resolve(__dirname, '../.env')
];
envPaths.forEach(p => dotenv.config({ path: p }));

const GHL_ACCESS_TOKEN = process.env.GHL_ACCESS_TOKEN;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

if (!GHL_ACCESS_TOKEN) {
    console.error("❌ Missing GHL_ACCESS_TOKEN");
    process.exit(1);
}

const HEADERS = {
    'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
    'Version': '2021-07-28',
    'Content-Type': 'application/json'
};

async function createTestPersson() {
    try {
        console.log("🧪 Creating Test Person (Direct Axios)...");

        // GHL V2 Contacts Endpoint
        const url = `https://services.leadconnectorhq.com/contacts/upsert`;
        
        const payload = {
            locationId: GHL_LOCATION_ID,
            email: "maria.sim.proven@example.com",
            phone: "+15550108888",
            name: "Maria Simulator (Shown)",
            tags: ["VIP_BUYBACK_LEAD", "SIMULATION_SUCCESS"],
            customFields: [
                { key: "vehicle_year", value: "2020" },
                { key: "vehicle_model", value: "Altima SR" },
                { key: "lead_quality", value: "Hot - Ready to Buy" },
                { key: "customer_intent", value: "Upgrade to New Vehicle" },
                { key: "primary_objection", value: "Monthly Payment" }, 
                { key: "appointment_booked", value: "Yes" },
                { key: "ai_conversation_outcome", value: "Appointment Booked" },
                { key: "ai_conversation_summary", value: "Customer agreed to come in Tuesday at 4pm. Wants to trade 2020 Altima." }
            ]
        };

        const response = await axios.post(url, payload, { headers: HEADERS });
        const contact = response.data.contact;

        if (contact) {
            console.log("✅ API Success!");
            console.log(`👤 Contact Created: ${contact.id}`);
            // GHL Link
            console.log(`🔗 Link: https://app.gohighlevel.com/v2/location/${GHL_LOCATION_ID}/contacts/detail/${contact.id}`);
        }

    } catch (error: any) {
        console.error("❌ Error Creating Test Person:", error.message);
        if (error.response) {
            console.error("   API Response:", JSON.stringify(error.response.data, null, 2));
        }
    }
}

createTestPersson();
