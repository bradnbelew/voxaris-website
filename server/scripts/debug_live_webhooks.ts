import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

// Load Env
const envPaths = [
    path.resolve(__dirname, '../../.env'),
    path.resolve(__dirname, '../.env')
];
envPaths.forEach(p => dotenv.config({ path: p }));

const BACKEND_URL = "https://hill-nissan-backend.onrender.com";
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

async function runDebug() {
    console.log("🕵️‍♂️ Starting Webhook Detective...");
    console.log(`📡 Target: ${BACKEND_URL}`);

    // 1. HEALTH CHECK
    try {
        console.log("\n1️⃣ Checking Health...");
        const health = await axios.get(`${BACKEND_URL}/health`).catch(() => null);
        if (health && health.status === 200) {
            console.log("   ✅ Backend is ONLINE.");
        } else {
            // Try root if health missing
             await axios.get(`${BACKEND_URL}/`).then(() => console.log("   ✅ Backend is ONLINE (Root).")).catch(e => console.log("   ⚠️ Backend might be sleeping or erroring:", e.message));
        }
    } catch (e) {
        console.log("   ❌ Backend Unreachable.");
    }

    // 2. RETELL TEST
    console.log("\n2️⃣ Testing Retell Webhook...");
    try {
        // We need a Contact ID that exists. Use the one we created earlier if possible, or a dummy.
        // If we use a dummy, we might get 401/404 from GHL, but the *Backend* should respond 200/500, not 404.
        const payload = {
            event: "call_analyzed",
            call_id: "debug_retell_" + Date.now(),
            duration_seconds: 60,
            metadata: {
                contact_id: "mVseS4bQx2lGICFVIRs4" // Maria Simulator ID
            },
            recording_url: "http://test.com/rec.mp3",
            post_call_analysis: {
                call_outcome: "Debug Test",
                call_summary: "Debug Webhook Test",
                customer_intent: "Testing",
                primary_objection: "None",
                lead_quality: "Warm",
                appointment_booked: false
            }
        };
        
        const res = await axios.post(`${BACKEND_URL}/api/webhooks/retell`, payload);
        console.log(`   ✅ Retell Probe: Status ${res.status}`);
        console.log("      (If 200, Backend logic is working. If 401/500, GHL Auth failed but Backend received it.)");
    } catch (e: any) {
        console.log(`   ❌ Retell Probe Log:`, e.response ? e.response.data : e.message);
    }

    // 3. TAVUS TEST
    console.log("\n3️⃣ Testing Tavus Webhook...");
    try {
        const payload = {
            event: "conversation.ended",
            conversation_id: "debug_tavus_" + Date.now(),
            duration_seconds: 120,
            metadata: {
                contact_id: "mVseS4bQx2lGICFVIRs4"
            },
            summary: "Debug Tavus Summary",
            sentiment: { score: 0.9 }
        };

        const res = await axios.post(`${BACKEND_URL}/api/webhooks/tavus`, payload);
        console.log(`   ✅ Tavus Probe: Status ${res.status}`);
    } catch (e: any) {
        console.log(`   ❌ Tavus Probe Log:`, e.response ? e.response.data : e.message);
    }
}

runDebug();
