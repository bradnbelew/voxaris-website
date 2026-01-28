import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

// Load env
const envPaths = [
    path.resolve(__dirname, '../../.env'),
    path.resolve(__dirname, '../.env')
];
envPaths.forEach(p => dotenv.config({ path: p }));

// Using SUB-ACCOUNT Token for Fields (Agency Token failed on scope) 
// or Users/Agency token if we have write access. 
// We will try ACCESS_TOKEN first as it worked for contact read.
const GHL_ACCESS_TOKEN = process.env.GHL_ACCESS_TOKEN; 
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

if (!GHL_ACCESS_TOKEN || !GHL_LOCATION_ID) {
    console.error("❌ Missing GHL Credentials");
    process.exit(1);
}

const HEADERS = {
    'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
    'Version': '2021-07-28',
    'Content-Type': 'application/json'
};

// ==========================================
// BLUEPRINT SCHEMA DEFINITIONS
// ==========================================
const CUSTOM_FIELDS = [
    // 1. Vehicle Information
    { name: "Vehicle Year", dataType: "TEXT", key: "vehicle_year" },
    { name: "Vehicle Make", dataType: "TEXT", key: "vehicle_make" },
    { name: "Vehicle Model", dataType: "TEXT", key: "vehicle_model" },
    { name: "Vehicle VIN", dataType: "TEXT", key: "vehicle_vin" },
    { name: "Vehicle Mileage", dataType: "NUMBER", key: "vehicle_mileage" },
    { name: "Vehicle Condition", dataType: "TEXT", key: "vehicle_condition" }, // Dropdowns often tricky via API, using TEXT for safety
    { name: "Has Loan", dataType: "TEXT", key: "has_loan" },

    // 2. Campaign Tracking
    { name: "Campaign ID", dataType: "TEXT", key: "campaign_id" },
    { name: "Campaign Name", dataType: "TEXT", key: "campaign_name" },
    { name: "Mailer Sent Date", dataType: "DATE", key: "mailer_sent_date" },
    { name: "QR Scanned", dataType: "TEXT", key: "qr_scanned" },
    { name: "QR Scan Date", dataType: "DATE", key: "qr_scan_date" },
    { name: "Lead Source", dataType: "TEXT", key: "source" },

    // 3. AI Conversation Data
    { name: "AI Conversation Type", dataType: "TEXT", key: "ai_conversation_type" },
    { name: "AI Conversation ID", dataType: "TEXT", key: "ai_conversation_id" },
    { name: "AI Conversation Date", dataType: "DATE", key: "ai_conversation_date" },
    { name: "AI Duration Seconds", dataType: "NUMBER", key: "ai_conversation_duration" },
    { name: "AI Outcome", dataType: "TEXT", key: "ai_conversation_outcome" }, // "Appointment Booked", etc
    { name: "AI Summary", dataType: "LARGE_TEXT", key: "ai_conversation_summary" },
    { name: "Transcript URL", dataType: "TEXT", key: "ai_transcript_url" },
    { name: "Recording URL", dataType: "TEXT", key: "ai_recording_url" },

    // 4. Customer Intent
    { name: "Customer Intent", dataType: "TEXT", key: "customer_intent" },
    { name: "Primary Objection", dataType: "TEXT", key: "primary_objection" },
    { name: "Competing Offer", dataType: "TEXT", key: "competing_offer" },
    { name: "Competing Amount", dataType: "NUMBER", key: "competing_offer_amount" },
    { name: "Spouse Involved", dataType: "TEXT", key: "spouse_involved" },
    
    // 5. Lead Scoring
    { name: "Lead Quality", dataType: "TEXT", key: "lead_quality" }, // Hot/Warm/Cool
    { name: "Lead Score", dataType: "NUMBER", key: "lead_score" },
    { name: "Sentiment Score", dataType: "NUMBER", key: "sentiment_score" },

    // 6. Appointment Data
    { name: "Appointment Booked", dataType: "TEXT", key: "appointment_booked" }, // Yes/No
    { name: "Appointment Status", dataType: "TEXT", key: "appointment_status" },
    { name: "Customer Showed", dataType: "TEXT", key: "appointment_showed" },

    // 7. Dealership Outcome
    { name: "Deal Closed", dataType: "TEXT", key: "deal_closed" },
    { name: "Deal Value", dataType: "MONETARY", key: "deal_value" },
    { name: "Deal Type", dataType: "TEXT", key: "deal_type" }
];

const PIPELINE_STAGES = [
    { name: "Mailer Sent", position: 1 },
    { name: "QR Scanned", position: 2 },
    { name: "AI Conversation Started", position: 3 },
    { name: "AI Conversation Completed", position: 4 },
    { name: "Appointment Booked", position: 5 },
    { name: "Appointment Confirmed", position: 6 },
    { name: "Customer Showed", position: 7 },
    { name: "Appraisal Completed", position: 8 },
    { name: "Deal Closed - Won", position: 9 },
    { name: "Deal Lost", position: 10 },
    { name: "Follow Up Required", position: 11 },
    { name: "Not Interested", position: 12 }
];


async function provisionBlueprint() {
    console.log("🏗️ Provisioning Blueprint Architecture...");

    // 1. CUSTOM FIELDS
    console.log(`\n👉 Section 1: Custom Fields (${CUSTOM_FIELDS.length} items)...`);
    for (const field of CUSTOM_FIELDS) {
        try {
            await axios.post(
                `https://services.leadconnectorhq.com/locations/${GHL_LOCATION_ID}/customFields`,
                {
                    name: field.name,
                    dataType: field.dataType, // API might reject strict types, fallback to TEXT if fails loop?
                    placeholder: field.name
                },
                { headers: HEADERS }
            );
            console.log(`   ✅ Created: ${field.name}`);
        } catch (err: any) {
             if (err.response?.status === 409) {
                 console.log(`   ℹ️ Exists: ${field.name}`);
             } else if (err.response?.status === 422 || err.response?.status === 400) {
                 // Retry as TEXT if specific type failed
                 console.log(`   ⚠️ Failed type ${field.dataType}, retrying as TEXT...`);
                 try {
                    await axios.post(
                        `https://services.leadconnectorhq.com/locations/${GHL_LOCATION_ID}/customFields`,
                        {
                            name: field.name,
                            dataType: "TEXT",
                            placeholder: field.name
                        },
                        { headers: HEADERS }
                    );
                    console.log(`   ✅ Created (as TEXT): ${field.name}`);
                 } catch (retryErr) {
                     console.error(`   ❌ Failed: ${field.name}`);
                 }
             } else {
                 console.error(`   ❌ Error ${field.name}: ${err.message}`);
             }
        }
    }

    // 2. PIPELINES
    console.log("\n👉 Section 2: Blueprinted Pipeline...");
    try {
        const pipelinePayload = {
            name: "VIP Buyback Campaign",
            stages: PIPELINE_STAGES
        };
        await axios.post(
            `https://services.leadconnectorhq.com/opportunities/pipelines/?locationId=${GHL_LOCATION_ID}`,
            pipelinePayload,
            { headers: HEADERS }
        );
        console.log("   ✅ Pipeline 'VIP Buyback Campaign' Created!");
    } catch (err: any) {
        if (err.response?.status === 401) {
            console.error("   ❌ Permission Denied (Pipeline Write Scope Missing).");
            console.error("      ACTION: User must add 'pipelines.write' to token.");
        } else {
             console.error("   ❌ Pipeline Error:", err.message);
        }
    }

    console.log("\n🏁 Phase 1 Complete.");
}

provisionBlueprint();
