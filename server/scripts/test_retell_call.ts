import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const RETELL_API_KEY = process.env.RETELL_API_KEY;
const RETELL_AGENT_ID = process.env.RETELL_AGENT_ID;
const FROM_NUMBER = process.env.RETELL_FROM_NUMBER || '+14077594100';

if (!RETELL_API_KEY || !RETELL_AGENT_ID) {
    console.error("❌ Missing RETELL_API_KEY or RETELL_AGENT_ID in .env");
    process.exit(1);
}

// Test call configuration
const TEST_CALL = {
    to_number: process.argv[2] || '+14075551234',  // Pass phone as argument
    customer_name: 'Demo User',
    car_model: '2022 Nissan Altima'
};

async function testRetellCall() {
    console.log("📞 Initiating Test Call via Retell AI");
    console.log(`🎯 Agent: ${RETELL_AGENT_ID}`);
    console.log(`📱 To: ${TEST_CALL.to_number}`);
    console.log(`👤 Customer: ${TEST_CALL.customer_name}`);
    console.log(`🚗 Vehicle: ${TEST_CALL.car_model}`);

    try {
        const response = await axios.post(
            'https://api.retellai.com/v2/create-phone-call',
            {
                from_number: FROM_NUMBER,
                to_number: TEST_CALL.to_number,
                agent_id: RETELL_AGENT_ID,
                retell_llm_dynamic_variables: {
                    customer_name: TEST_CALL.customer_name,
                    car_model: TEST_CALL.car_model,
                    manager_name: "Marcus",
                    offer_expiration: "this Friday"
                },
                metadata: {
                    source: "test_script",
                    campaign: "vip_buyback"
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${RETELL_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log("\n✅ CALL INITIATED!");
        console.log("═══════════════════════════════════════");
        console.log(`📞 Call ID: ${response.data.call_id}`);
        console.log(`✨ Status: ${response.data.call_status}`);
        console.log("═══════════════════════════════════════");
        console.log("\n💡 Olivia will call the number now!");

    } catch (error: any) {
        console.error("❌ Error Initiating Call:");
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error('Error:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
}

testRetellCall();
