import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const TAVUS_API_KEY = process.env.TAVUS_API_KEY?.replace(/^["']|["']$/g, '');

if (!TAVUS_API_KEY) {
    console.error("❌ CRITICAL: Missing TAVUS_API_KEY in .env");
    process.exit(1);
}

// =====================================================
// ORLANDO ART OF SURGERY - TEST CONVERSATION
// =====================================================

const MEDSPA_PERSONA_ID = "pf0d43ed3051"; // OPTIMAL Four-Layer Agent + Visual Perception

async function startConversation() {
    console.log("🏥 Starting Orlando Art of Surgery Test Conversation...");
    console.log(`👤 Persona ID: ${MEDSPA_PERSONA_ID}`);

    try {
        const payload = {
            persona_id: MEDSPA_PERSONA_ID,
            // Optional: add conversation-specific context
            conversational_context: "The visitor just clicked on the 'Talk to Us' button on the website. They're interested in learning about treatments.",
            // Optional: enable recording for review
            properties: {
                enable_recording: true,
                enable_transcription: true,
                max_call_duration: 900 // 15 minutes
            }
        };

        console.log("\n📤 Creating conversation...");

        const response = await axios.post(
            'https://tavusapi.com/v2/conversations',
            payload,
            {
                headers: {
                    'x-api-key': TAVUS_API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log("\n✅ Conversation Created!");
        console.log("═══════════════════════════════════════════════════════════════");
        console.log(`🆔 Conversation ID: ${response.data.conversation_id}`);
        console.log(`🔗 Join URL: ${response.data.conversation_url}`);
        console.log("═══════════════════════════════════════════════════════════════");
        console.log("\n👆 Click the URL above to start talking to Sophia!");
        console.log("\n💡 Tips for testing:");
        console.log("   - Say: 'I have wrinkles on my forehead'");
        console.log("   - Say: 'How much does Botox cost?'");
        console.log("   - Say: 'I'm not sure what I need'");
        console.log("   - Say: 'I had my baby last year and my body changed'");

        return response.data;

    } catch (error: any) {
        console.error("\n❌ Error Creating Conversation:");
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
        process.exit(1);
    }
}

// Run it
startConversation();
