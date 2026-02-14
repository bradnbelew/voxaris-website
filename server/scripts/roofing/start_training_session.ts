/**
 * Start Roofing Pros USA Training Session
 *
 * This script creates a Tavus conversation for a 1:1 training session
 * with a sales representative.
 *
 * Features:
 * - Creates unique training session
 * - Tracks trainee name and session metadata
 * - Returns embed URL for video interface
 * - Logs session for progress tracking
 *
 * Usage:
 *   npx ts-node scripts/roofing/start_training_session.ts
 *   npx ts-node scripts/roofing/start_training_session.ts --trainee "John Smith" --topic "objections"
 *
 * Available topics:
 *   - insurance: Florida insurance claims process
 *   - objections: Handling customer objections (A.C.E. method)
 *   - products: Shingle, metal, tile knowledge
 *   - closing: Closing techniques
 *   - roleplay: Practice with simulated customers
 *   - general: Open session
 */

import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
const envPaths = [
    path.resolve(__dirname, '../../.env'),
    path.resolve(__dirname, '../.env')
];
envPaths.forEach(p => dotenv.config({ path: p }));

// Use Roofing-specific Tavus API key (separate account from Voxaris)
const TAVUS_API_KEY = process.env.ROOFING_TAVUS_API_KEY || process.env.TAVUS_API_KEY;
const PERSONA_ID = process.env.ROOFING_TRAINING_PERSONA_ID;

if (!TAVUS_API_KEY) {
    console.error("❌ Missing TAVUS_API_KEY in .env");
    process.exit(1);
}

if (!PERSONA_ID) {
    console.error("❌ Missing ROOFING_TRAINING_PERSONA_ID in .env");
    console.log("\n💡 Run 'npx ts-node scripts/roofing/create_training_agent.ts' first to create the persona.");
    process.exit(1);
}

// Initialize Supabase for session logging
const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Parse command line arguments
function parseArgs(): { trainee: string; topic: string } {
    const args = process.argv.slice(2);
    const result = { trainee: 'Anonymous Trainee', topic: 'general' };

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--trainee' && args[i + 1]) {
            result.trainee = args[i + 1];
            i++;
        } else if (args[i] === '--topic' && args[i + 1]) {
            result.topic = args[i + 1];
            i++;
        }
    }

    return result;
}

// Topic-specific prompts to inject
const TOPIC_PROMPTS: Record<string, string> = {
    insurance: `Today's focus: FLORIDA INSURANCE CLAIMS PROCESS

Start by asking: "Let's dive into insurance claims today. What's your biggest question or challenge when it comes to insurance?"

Key areas to cover:
- 3-year filing window in Florida
- Hurricane deductibles (usually 2% of dwelling)
- Supplement process
- Working with adjusters
- AOB (Assignment of Benefits)

Make sure they understand: We NEVER promise claim approval.`,

    objections: `Today's focus: OBJECTION HANDLING

Start by asking: "Objections are just hidden opportunities! What's the objection you hear most often that trips you up?"

Teach the A.C.E. method:
1. Acknowledge: Validate their concern
2. Clarify: Make sure you understand
3. Educate: Provide value

Practice the most common objections through roleplay.`,

    products: `Today's focus: PRODUCT KNOWLEDGE

Start by asking: "Let's talk roofing products! Do you want to start with shingles, metal, or tile - or compare all three?"

Make sure they know:
- When to recommend each product
- Warranty differences
- Price ranges and value propositions
- Installation considerations

End with a quiz: Give scenarios, have them recommend products.`,

    closing: `Today's focus: CLOSING TECHNIQUES

Start by asking: "Closing isn't pushy when done right. What part of the close feels awkward to you?"

Cover:
- Assumptive close
- Summary close
- Urgency close
- Fear of loss

Do multiple roleplay closes - practice makes perfect!`,

    roleplay: `Today's focus: CUSTOMER ROLEPLAY PRACTICE

Start by asking: "Ready to practice? I'll play the customer - pick a scenario:
1. Skeptical Steve: Doesn't trust contractors
2. Hurricane Helen: Just had storm damage, stressed
3. Research Randy: Has quotes from competitors
4. Elderly Eleanor: Needs patience and reassurance
5. Insurance Irene: Confused about her claim

Which one do you want to tackle?"

After each roleplay, break character and coach them.`,

    general: `This is an open training session.

Start by asking: "Good to see you! What do you want to work on today? We can:
- Dive into insurance claims
- Practice handling objections
- Review product knowledge
- Work on closing techniques
- Do some customer roleplay

What sounds most useful right now?"`
};

async function createTrainingSession(trainee: string, topic: string) {
    console.log("\n🎓 STARTING ROOFING TRAINING SESSION");
    console.log("══════════════════════════════════════════════════\n");
    console.log(`👤 Trainee: ${trainee}`);
    console.log(`📚 Topic: ${topic}`);
    console.log(`🎭 Persona: ${PERSONA_ID}`);

    // Get topic-specific prompt
    const topicPrompt = TOPIC_PROMPTS[topic] || TOPIC_PROMPTS.general;

    // Create conversation with context
    const conversationPayload = {
        persona_id: PERSONA_ID,
        conversation_name: `Training: ${trainee} - ${topic} - ${new Date().toISOString().split('T')[0]}`,
        conversational_context: `
TRAINEE INFORMATION:
- Name: ${trainee}
- Topic requested: ${topic}
- Session date: ${new Date().toLocaleDateString()}

${topicPrompt}

Remember to:
1. Be encouraging but honest
2. Use Florida-specific examples
3. Reference their name naturally
4. Track what they've learned
5. End with a specific thing to practice
`
    };

    try {
        console.log("\n📡 Creating Tavus conversation...");

        const response = await axios.post(
            'https://tavusapi.com/v2/conversations',
            conversationPayload,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': TAVUS_API_KEY
                }
            }
        );

        const conversation = response.data;

        console.log("\n✅ TRAINING SESSION CREATED!");
        console.log("═══════════════════════════════════════════════════════");
        console.log(`🆔 Conversation ID: ${conversation.conversation_id}`);
        console.log(`📛 Name: ${conversation.conversation_name || 'Training Session'}`);
        console.log(`🔗 Status: ${conversation.status || 'active'}`);
        console.log("═══════════════════════════════════════════════════════");

        // Get the conversation URL
        if (conversation.conversation_url) {
            console.log("\n🎬 VIDEO TRAINING URL:");
            console.log(`   ${conversation.conversation_url}`);
            console.log("\n   Open this URL in a browser to start the training session!");
        }

        // Log session to database for tracking
        try {
            if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
                await supabase.from('roofing_training_sessions').insert({
                    conversation_id: conversation.conversation_id,
                    trainee_name: trainee,
                    topic: topic,
                    status: 'active',
                    created_at: new Date().toISOString()
                });
                console.log("\n📊 Session logged to database for progress tracking.");
            }
        } catch (dbError) {
            // Don't fail if DB logging fails - session is still valid
            console.log("\n⚠️  Could not log session to database (table may not exist yet)");
        }

        console.log("\n💡 TRAINING TIPS:");
        console.log("   - Say 'let's roleplay' to practice customer scenarios");
        console.log("   - Ask 'teach me about [topic]' for direct instruction");
        console.log("   - Say 'quiz me' to test your knowledge");
        console.log("   - Say 'let's switch topics' to change focus");

        return conversation;

    } catch (error: any) {
        console.error("\n❌ Error Creating Training Session:");
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
        throw error;
    }
}

// List available training sessions
async function listActiveSessions() {
    console.log("\n📋 ACTIVE TRAINING SESSIONS");
    console.log("══════════════════════════════════════════════════\n");

    try {
        const response = await axios.get(
            'https://tavusapi.com/v2/conversations',
            {
                headers: { 'x-api-key': TAVUS_API_KEY },
                params: { persona_id: PERSONA_ID, limit: 10 }
            }
        );

        const conversations = response.data.data || response.data || [];

        if (conversations.length === 0) {
            console.log("No active training sessions found.");
            return;
        }

        conversations.forEach((conv: any, index: number) => {
            console.log(`${index + 1}. ${conv.conversation_name || 'Training Session'}`);
            console.log(`   🆔 ID: ${conv.conversation_id}`);
            console.log(`   📊 Status: ${conv.status || 'unknown'}`);
            if (conv.created_at) {
                console.log(`   📅 Created: ${new Date(conv.created_at).toLocaleString()}`);
            }
            console.log("");
        });

    } catch (error: any) {
        console.error("❌ Error fetching sessions:", error.response?.data || error.message);
    }
}

// Main execution
const { trainee, topic } = parseArgs();

// Check for --list flag
if (process.argv.includes('--list')) {
    listActiveSessions();
} else {
    createTrainingSession(trainee, topic);
}
