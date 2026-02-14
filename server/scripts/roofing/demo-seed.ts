/**
 * Roofing Pros USA - Demo Seed Script
 *
 * Populates demo data for demonstrations.
 * Run after demo-reset.ts to set up a fresh demo environment.
 *
 * Usage: npx ts-node scripts/roofing/demo-seed.ts
 */

import dotenv from 'dotenv';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ============================================================================
// DEMO DATA
// ============================================================================

const DEMO_LEADS = [
  {
    first_name: 'Michael',
    last_name: 'Thompson',
    phone: '+14075551001',
    email: 'michael.thompson@demo.com',
    address: '123 Oak Street, Orlando, FL 32801',
    zip: '32801',
    is_homeowner: true,
    issue_type: 'storm_damage',
    has_insurance_claim: true,
    urgency: 'priority',
    appointment_booked: true,
    appointment_date: getNextBusinessDay(),
    appointment_time: 'morning',
    pipeline_stage: 'inspection_booked',
    lead_score: 95,
    sentiment: 'positive',
    source: 'demo_script',
    metadata: {
      demo: true,
      notes: 'Recent storm damage, insurance claim filed, urgent repair needed'
    }
  },
  {
    first_name: 'Sarah',
    last_name: 'Martinez',
    phone: '+14075551002',
    email: 'sarah.martinez@demo.com',
    address: '456 Palm Ave, Tampa, FL 33601',
    zip: '33601',
    is_homeowner: true,
    issue_type: 'leak',
    has_insurance_claim: false,
    urgency: 'normal',
    appointment_booked: false,
    pipeline_stage: 'new_lead',
    lead_score: 75,
    sentiment: 'neutral',
    source: 'demo_script',
    metadata: {
      demo: true,
      notes: 'Noticed leak during recent rain, wants estimate'
    }
  },
  {
    first_name: 'David',
    last_name: 'Johnson',
    phone: '+14075551003',
    email: 'david.johnson@demo.com',
    address: '789 Beach Blvd, Jacksonville, FL 32202',
    zip: '32202',
    is_homeowner: true,
    issue_type: 'age_wear',
    has_insurance_claim: false,
    urgency: 'low',
    appointment_booked: true,
    appointment_date: getNextBusinessDay(2),
    appointment_time: 'afternoon',
    pipeline_stage: 'inspection_booked',
    lead_score: 80,
    sentiment: 'positive',
    source: 'demo_script',
    metadata: {
      demo: true,
      notes: 'Roof is 20+ years old, planning full replacement'
    }
  },
  {
    first_name: 'Jennifer',
    last_name: 'Williams',
    phone: '+14075551004',
    email: 'jennifer.williams@demo.com',
    address: '321 Sunset Dr, West Palm Beach, FL 33401',
    zip: '33401',
    is_homeowner: true,
    issue_type: 'storm_damage',
    has_insurance_claim: true,
    urgency: 'emergency',
    appointment_booked: false,
    pipeline_stage: 'hot_lead',
    lead_score: 98,
    sentiment: 'frustrated',
    source: 'demo_script',
    metadata: {
      demo: true,
      notes: 'Emergency - tree fell on roof, needs immediate assessment'
    }
  },
  {
    first_name: 'Robert',
    last_name: 'Garcia',
    phone: '+14075551005',
    email: 'robert.garcia@demo.com',
    address: '555 Main St, Pensacola, FL 32501',
    zip: '32501',
    is_homeowner: true,
    issue_type: 'general_inquiry',
    has_insurance_claim: false,
    urgency: 'normal',
    appointment_booked: false,
    pipeline_stage: 'estimate_sent',
    lead_score: 65,
    sentiment: 'positive',
    source: 'demo_script',
    metadata: {
      demo: true,
      notes: 'Received estimate, considering options, follow-up scheduled'
    }
  }
];

const DEMO_CALL_LOGS = [
  {
    call_id: 'demo-call-001',
    direction: 'inbound',
    phone: '+14075551001',
    agent_id: process.env.RETELL_INBOUND_AGENT_ID || 'demo-inbound-agent',
    status: 'completed',
    duration_seconds: 245,
    started_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    ended_at: new Date(Date.now() - 2 * 60 * 60 * 1000 + 245000).toISOString(),
    outcome: 'appointment_booked',
    summary: 'Customer reported storm damage from recent weather. Insurance claim already filed. Scheduled morning inspection for tomorrow. Very cooperative, eager to get repairs started.',
    sentiment: 'positive',
    recording_url: 'https://demo.retellai.com/recordings/demo-call-001',
    transcript: '[Demo transcript - Customer discussed storm damage and booked inspection]',
    metadata: { demo: true }
  },
  {
    call_id: 'demo-call-002',
    direction: 'inbound',
    phone: '+14075551002',
    agent_id: process.env.RETELL_INBOUND_AGENT_ID || 'demo-inbound-agent',
    status: 'completed',
    duration_seconds: 180,
    started_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    ended_at: new Date(Date.now() - 5 * 60 * 60 * 1000 + 180000).toISOString(),
    outcome: 'callback_scheduled',
    summary: 'Customer noticed leak during rain. Wants to discuss with spouse before scheduling. Callback scheduled for tomorrow afternoon.',
    sentiment: 'neutral',
    recording_url: 'https://demo.retellai.com/recordings/demo-call-002',
    transcript: '[Demo transcript - Customer reported leak, requested callback]',
    metadata: { demo: true }
  },
  {
    call_id: 'demo-call-003',
    direction: 'outbound',
    phone: '+14075551005',
    agent_id: process.env.RETELL_OUTBOUND_AGENT_ID || 'demo-outbound-agent',
    status: 'completed',
    duration_seconds: 120,
    started_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    ended_at: new Date(Date.now() - 24 * 60 * 60 * 1000 + 120000).toISOString(),
    outcome: 'estimate_follow_up',
    summary: 'Follow-up call about estimate sent last week. Customer is comparing with other contractors. Will make decision by end of week.',
    sentiment: 'positive',
    recording_url: 'https://demo.retellai.com/recordings/demo-call-003',
    transcript: '[Demo transcript - Follow-up call about estimate]',
    metadata: { demo: true }
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getNextBusinessDay(daysAhead: number = 1): string {
  const date = new Date();
  let added = 0;

  while (added < daysAhead) {
    date.setDate(date.getDate() + 1);
    const dayOfWeek = date.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Skip weekends
      added++;
    }
  }

  return date.toISOString().split('T')[0];
}

// ============================================================================
// MAIN SEED FUNCTION
// ============================================================================

async function main() {
  console.log('\n🌱 Roofing Pros USA - Demo Seed\n');
  console.log('═'.repeat(50));
  console.log(`📍 Supabase: ${SUPABASE_URL}`);
  console.log('═'.repeat(50));

  let totalSeeded = 0;
  let errors = 0;

  // 1. Seed leads
  console.log('\n📊 Seeding demo leads...\n');

  for (const lead of DEMO_LEADS) {
    try {
      const { error } = await supabase
        .from('leads')
        .upsert(lead, { onConflict: 'phone' });

      if (error) {
        console.log(`   ❌ ${lead.first_name} ${lead.last_name}: ${error.message}`);
        errors++;
      } else {
        console.log(`   ✅ ${lead.first_name} ${lead.last_name} (${lead.issue_type})`);
        totalSeeded++;
      }
    } catch (err: any) {
      console.log(`   ❌ ${lead.first_name} ${lead.last_name}: ${err.message}`);
      errors++;
    }
  }

  // 2. Seed call logs
  console.log('\n📞 Seeding demo call logs...\n');

  for (const call of DEMO_CALL_LOGS) {
    try {
      const { error } = await supabase
        .from('call_logs')
        .upsert(call, { onConflict: 'call_id' });

      if (error) {
        console.log(`   ❌ ${call.call_id}: ${error.message}`);
        errors++;
      } else {
        console.log(`   ✅ ${call.call_id} (${call.direction}, ${call.outcome})`);
        totalSeeded++;
      }
    } catch (err: any) {
      console.log(`   ❌ ${call.call_id}: ${err.message}`);
      errors++;
    }
  }

  // Summary
  console.log('\n' + '═'.repeat(50));
  console.log('📊 SEED SUMMARY');
  console.log('═'.repeat(50));
  console.log(`\n✅ Seeded: ${totalSeeded} records`);
  console.log(`❌ Errors: ${errors}`);

  console.log('\n🎉 Demo environment is ready!\n');
  console.log('Demo data includes:');
  console.log('   - 5 sample leads (various stages)');
  console.log('   - 3 sample call logs (inbound/outbound)');
  console.log('   - Mix of urgent, normal, and low priority');
  console.log('   - Storm damage, leaks, age/wear scenarios\n');

  console.log('Dashboard Highlights:');
  console.log('   - Michael Thompson: Hot lead, inspection booked tomorrow AM');
  console.log('   - Jennifer Williams: Emergency, tree on roof, needs callback');
  console.log('   - Robert Garcia: Estimate sent, follow-up in progress\n');

  process.exit(errors > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
