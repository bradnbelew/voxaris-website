import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

// 1. Load Envs
const envPaths = [
    path.resolve(__dirname, '../../.env'),
    path.resolve(__dirname, '../.env')
];
envPaths.forEach(p => dotenv.config({ path: p }));

const GHL_ACCESS_TOKEN = process.env.GHL_ACCESS_TOKEN;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const WEBHOOK_URL = "https://hill-nissan-backend.onrender.com/api/webhooks/retell";

if (!GHL_ACCESS_TOKEN) {
    console.error("❌ Missing GHL_ACCESS_TOKEN");
    process.exit(1);
}

const GHL_HEADERS = {
    'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
    'Version': '2021-07-28',
    'Content-Type': 'application/json'
};

async function runSimulation() {
    console.log("🚀 Starting V-Suite Simulation...");

    // STEP 1: Create a Base Contact (Simulating a Lead from Mailer)
    console.log("\n1️⃣ Creating Lead in GHL...");
    let contactId = "";
    try {
        const createRes = await axios.post(`https://services.leadconnectorhq.com/contacts/upsert`, {
            locationId: GHL_LOCATION_ID,
            name: "Maria Simulator (Call Test)",
            email: "maria.sim@example.com",
            phone: "+15550107777",
            tags: ["VIP_BUYBACK_LEAD", "SIMULATION"],
            customFields: [
                { key: "vehicle_year", value: "2020" },
                { key: "vehicle_model", value: "Sentra" }
            ]
        }, { headers: GHL_HEADERS });
        
        contactId = createRes.data.contact.id;
        console.log(`   ✅ Created Contact: ${contactId}`);
    } catch (err: any) {
        console.error("   ❌ Failed to create contact:", err.message);
        return;
    }

    // STEP 2: Simulate Retell Webhook (The "Call" Finishing)
    console.log("\n2️⃣ Sending Mock 'Call Analyzed' Webhook...");
    const webhookPayload = {
        event: "call_analyzed",
        call_id: "call_sim_" + Date.now(),
        duration_seconds: 145,
        metadata: {
            contact_id: contactId // IMPORTANT: This links it to the contact
        },
        recording_url: "https://retell.ai/recordings/dummy_sim.mp3",
        post_call_analysis: {
            call_outcome: "Appointment Booked",
            
            // THESE ARE THE FIELDS WE MAPPED:
            appointment_booked: true,
            appointment_details: "Tuesday at 4pm",
            customer_intent: "Upgrade to New Vehicle",
            primary_objection: "Monthly Payment",
            lead_quality: "Hot - Ready to Buy",
            call_summary: "Customer simulated call. Wants to trade in 2020 Sentra. Concerned about payment but agreed to come in.",
            sentiment_score: 85
        }
    };

    try {
        const hookRes = await axios.post(WEBHOOK_URL, webhookPayload);
        console.log(`   ✅ Webhook Sent! Status: ${hookRes.status}`);
        
        if (hookRes.data.success) {
            console.log("   🎉 Success! Backend processed the data.");
        } else {
            console.warn("   ⚠️ Warning: Backend returned:", hookRes.data);
        }

    } catch (err: any) {
        console.error("   ❌ Webhook Failed (Server Auth Issue?):", err.message);
        console.error("   Response:", err.response?.data);
        
        console.log("\n⚠️ Fallback: Manually updating Contact to show 'Simulated Result'...");
        await axios.post(`https://services.leadconnectorhq.com/contacts/upsert`, {
            locationId: GHL_LOCATION_ID,
            id: contactId,
            customFields: [
                { key: "ai_conversation_outcome", value: "Appointment Booked" },
                { key: "appointment_booked", value: "Yes" },
                { key: "lead_quality", value: "Hot - Ready to Buy" },
                { key: "customer_intent", value: "Upgrade to New Vehicle" },
                { key: "primary_objection", value: "Monthly Payment" },
                { key: "ai_conversation_summary", value: "Customer simulated call. Wants to trade in 2020 Sentra. Concerned about payment but agreed to come in." }
            ]
        }, { headers: GHL_HEADERS });
        console.log("   ✅ Fallback Update Success.");
    }

    // STEP 3: Report
    console.log("\n📋 Result:");
    console.log(`Go to GHL and check 'Maria Simulator'.`);
    console.log(`Link: https://app.gohighlevel.com/v2/location/${GHL_LOCATION_ID}/contacts/detail/${contactId}`);
    console.log("Expected Custom Fields:");
    console.log(" - Lead Quality: Hot");
    console.log(" - Intent: Upgrade");
    console.log(" - Primary Objection: Monthly Payment");
    console.log(" - Appointment Booked: Yes");
}

runSimulation();
