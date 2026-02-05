import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
const envPaths = [
    path.resolve(__dirname, '../../.env'),
    path.resolve(__dirname, '../.env')
];
envPaths.forEach(p => dotenv.config({ path: p }));

const TAVUS_API_KEY = process.env.TAVUS_API_KEY;
const VOXARIS_PERSONA_ID = process.env.VOXARIS_VIDEO_PERSONA_ID;

if (!TAVUS_API_KEY) {
    console.error("❌ Missing TAVUS_API_KEY in .env");
    process.exit(1);
}

if (!VOXARIS_PERSONA_ID) {
    console.error("❌ Missing VOXARIS_VIDEO_PERSONA_ID in .env");
    console.error("   Run: npx ts-node scripts/create_voxaris_video_agent.ts first");
    process.exit(1);
}

// ============================================================
// CREATE TAVUS CONVERSATION FOR VOXARIS DEMO
// ============================================================

async function createConversation() {
    console.log("\n🎬 Creating Voxaris Video Conversation...");
    console.log(`📛 Persona ID: ${VOXARIS_PERSONA_ID}`);

    try {
        const response = await axios.post(
            'https://tavusapi.com/v2/conversations',
            {
                persona_id: VOXARIS_PERSONA_ID,
                conversation_name: `Voxaris Demo - ${new Date().toISOString().split('T')[0]}`,
                // Custom properties for the conversation
                properties: {
                    max_call_duration: 900,  // 15 minutes max
                    enable_recording: true,
                    enable_transcription: true
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': TAVUS_API_KEY
                }
            }
        );

        const conversation = response.data;

        console.log("\n✅ CONVERSATION CREATED!");
        console.log("═══════════════════════════════════════════════════════");
        console.log(`🆔 Conversation ID: ${conversation.conversation_id}`);
        console.log(`📛 Name: ${conversation.conversation_name}`);
        console.log(`🔗 Conversation URL: ${conversation.conversation_url}`);
        console.log("═══════════════════════════════════════════════════════");
        console.log("\n📋 EMBED CODE:");
        console.log(`
<iframe
  src="${conversation.conversation_url}"
  width="400"
  height="600"
  allow="camera; microphone"
  style="border: none; border-radius: 16px;"
></iframe>
        `);
        console.log("\n🔗 Direct Link: " + conversation.conversation_url);

        return conversation;

    } catch (error: any) {
        console.error("\n❌ Error Creating Conversation:");
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
        throw error;
    }
}

createConversation();
