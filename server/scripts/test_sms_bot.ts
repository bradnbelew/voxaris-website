import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

// Load Env
const envPaths = [
    path.resolve(__dirname, '../../.env'),
    path.resolve(__dirname, '../.env')
];
envPaths.forEach(p => dotenv.config({ path: p }));

const SERVER_URL = 'https://hill-nissan-backend.onrender.com'; // Live URL
// const SERVER_URL = process.env.API_BASE_URL || 'http://localhost:3000';

async function testSMSBot() {
    console.log("🤖 Testing SMS Bot Logic...");
    console.log(`📡 Target: ${SERVER_URL}/api/webhooks/ghl`);

    // Mock GHL Webhook Payload
    // Type: InboundMessage
    const payload = {
        type: "InboundMessage",
        contactId: "TEST_CONTACT_123", // Dummy ID
        message: {
            body: "How much can I get for my 2021 Altima?",
            direction: "inbound"
        }
    };

    try {
        // We expect the server to:
        // 1. Receive Hook
        // 2. Call OpenAI
        // 3. Call GHL sendSMS (This will fail with 401/404 since ID is fake, but we check if it TRIES)
        // Actually, for this test to be truly useful, we might want to mock the 'ghl.sendSMS' or just see the server logs.
        // We will assert we get a 200 OK from the webhook (meaning it processed).
        
        const res = await axios.post(`${SERVER_URL}/api/webhooks/ghl`, payload);
        
        console.log("✅ Webhook Accepted:", res.data);
        console.log("👉 Check Server Logs to see OpenAI Reply + GHL Send Attempt.");

    } catch (error: any) {
        console.error("❌ Test Failed:", error.message);
        console.error("   Response:", error.response?.data);
    }
}

testSMSBot();
