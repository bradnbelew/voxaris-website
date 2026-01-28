
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

// Load Envs
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

const GHL_HEADERS = {
    'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
    'Version': '2021-07-28',
    'Content-Type': 'application/json'
};

async function recoverSync() {
    console.log("🚀 Starting Manual Sync Recovery...");

    // 1. Create/Find the Demo Contact
    const demoContact = {
        name: "Maria Recovery Demo",
        phone: "+15550009999",
        email: "recovery@demo.com",
        tags: ["RECOVERY_SYNC", "VIP_BUYBACK_LEAD"]
    };

    console.log(`1️⃣ Creating/Updating Contact: ${demoContact.name}...`);
    let contactId = "";

    try {
        // Upsert by Email/Phone
        const searchRes = await axios.get('https://services.leadconnectorhq.com/contacts/', {
            headers: GHL_HEADERS,
            params: {
                locationId: GHL_LOCATION_ID,
                query: demoContact.phone
            }
        });

        if (searchRes.data.contacts && searchRes.data.contacts.length > 0) {
            contactId = searchRes.data.contacts[0].id;
            console.log(`   ✅ Found Existing Contact: ${contactId}`);
        } else {
            console.log("   found no contact, creating...");
            const createRes = await axios.post('https://services.leadconnectorhq.com/contacts/', {
                locationId: GHL_LOCATION_ID,
                ...demoContact
            }, { headers: GHL_HEADERS });
            contactId = createRes.data.contact.id;
            console.log(`   ✅ Created New Contact: ${contactId}`);
        }

        // 2. Push Call Data
        console.log("2️⃣ Pushing Recovered Call Data...");
        
        // Data from call_c609caeabe5589c236dd668df1b
        const callData = {
            ai_conversation_type: "Voice (Retell)",
            ai_conversation_id: "call_c609caeabe5589c236dd668df1b",
            ai_conversation_duration: 167,
            ai_conversation_outcome: "Appointment Booked",
            ai_conversation_summary: "The agent informed the user about a strong market offer for their vehicle and invited them to get an appraisal. The user was initially hesitant but agreed to an appointment after discussing with their wife. They scheduled a visit for the next day at 10:00 AM.",
            ai_recording_url: "https://dxc03zgurdly9.cloudfront.net/1b71aee3fcf754512013a8b2f1aad92e2b15215f2d470b9c1a9bc8734eeb042b/recording.wav",
            customer_intent: "Cash Out Only",
            primary_objection: "Need to discuss with spouse",
            lead_quality: "Warm - Interested",
            appointment_booked: "Yes",
            sentiment_score: 100 // Positive
        };

        // Map to custom fields (assuming keys match backend mapping or just standard fields if possible)
        // We need to use the KEYs or IDs. Usually API accepts keys if matched. 
        // Based on previous code, keys are: ai_conversation_outcome, etc.
        const updatePayload = {
            customFields: [
                { key: "ai_conversation_outcome", value: callData.ai_conversation_outcome },
                { key: "ai_conversation_summary", value: callData.ai_conversation_summary },
                { key: "ai_recording_url", value: callData.ai_recording_url },
                { key: "lead_quality", value: callData.lead_quality },
                { key: "appointment_booked", value: callData.appointment_booked },
                { key: "customer_intent", value: callData.customer_intent },
                { key: "primary_objection", value: callData.primary_objection }
            ],
            tags: ["appointment_booked", "needs_scheduling_review"]
        };

        await axios.put(`https://services.leadconnectorhq.com/contacts/${contactId}`, {
            ...updatePayload
        }, { headers: GHL_HEADERS });
        
        console.log("   ✅ Custom Fields Updated.");

        // 3. Add Note
        console.log("3️⃣ Adding Note...");
        const noteBody = `## RECOVERED AI CALL (Manual Sync)\n\n` +
            `**Outcome:** ${callData.ai_conversation_outcome}\n` +
            `**Summary:** ${callData.ai_conversation_summary}\n` +
            `**Recording:** ${callData.ai_recording_url}`;

        await axios.post(`https://services.leadconnectorhq.com/contacts/${contactId}/notes`, {
            body: noteBody,
            userId: null
        }, { headers: GHL_HEADERS });
        
        console.log("   ✅ Note Added.");

    } catch (err: any) {
        console.error("❌ Recovery Failed:", err.response?.data || err.message);
    }
}

recoverSync();
