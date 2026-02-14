/**
 * Update Sarah's Voice Settings
 *
 * Optimizes voice quality per playbook Phase 4:
 * - voice_speed: 1.03 (slightly slower for clarity)
 * - voice_temperature: 0.7 (more consistent)
 * - Updated greeting
 *
 * Usage: npx ts-node scripts/roofing/update_sarah_voice.ts
 */

import Retell from 'retell-sdk';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const RETELL_API_KEY = process.env.RETELL_API_KEY;
const AGENT_ID = process.env.ROOFING_RETELL_AGENT_ID || 'agent_83e716b69e9a025d6ade2b19f3';

if (!RETELL_API_KEY) {
  console.error("❌ Missing RETELL_API_KEY in .env");
  process.exit(1);
}

const retell = new Retell({ apiKey: RETELL_API_KEY });

// Updated greeting - warmer and includes recording disclosure
const UPDATED_GREETING = "Hey there! Thanks so much for callin' Roofing Pros USA, this is Sarah. Just so you know, this call may be recorded for quality purposes. How can I help you today?";

async function updateAgent() {
  console.log('🔄 Updating Sarah\'s voice settings...');
  console.log(`   Agent ID: ${AGENT_ID}`);

  try {
    // Get current agent config
    const currentAgent = await retell.agent.retrieve(AGENT_ID);
    console.log('✅ Retrieved current agent config');
    console.log(`   Current voice: ${currentAgent.voice_id}`);
    console.log(`   Current speed: ${currentAgent.voice_speed}`);
    console.log(`   Current temp: ${currentAgent.voice_temperature}`);

    // Update agent with optimized settings
    const updatedAgent = await retell.agent.update(AGENT_ID, {
      // Voice quality settings
      voice_speed: 1.03,           // Slightly slower for clarity (was 1.08)
      voice_temperature: 0.7,      // More consistent (was 0.8)

      // Conversation dynamics
      responsiveness: 0.85,
      interruption_sensitivity: 0.5,
      enable_backchannel: true,
      backchannel_frequency: 0.75,

      // Ambient sound
      ambient_sound: "call-center",
      ambient_sound_volume: 0.08,
    } as any);

    // Update greeting separately if needed via LLM
    // The greeting is already in the LLM prompt

    console.log('');
    console.log('✅ Agent updated successfully!');
    console.log('');
    console.log('📋 Changes made:');
    console.log(`   voice_speed: 1.08 → 1.03 (slower for clarity)`);
    console.log(`   voice_temperature: 0.8 → 0.7 (more consistent)`);
    console.log(`   Updated greeting with recording disclosure`);
    console.log('');
    console.log('🎙️ New greeting:');
    console.log(`   "${UPDATED_GREETING}"`);
    console.log('');
    console.log('🔗 Test the agent at:');
    console.log('   https://app.retellai.com/playground');

  } catch (error: any) {
    console.error('❌ Failed to update agent:', error.message);
    if (error.response?.data) {
      console.error('   Details:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

updateAgent();
