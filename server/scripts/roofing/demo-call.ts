/**
 * Roofing Pros USA - Demo Call Script
 *
 * Initiates a test outbound call to demonstrate the system.
 * Run with: npx ts-node scripts/roofing/demo-call.ts <phone_number>
 *
 * Prerequisites:
 * - Server must be running
 * - RETELL_API_KEY must be configured
 * - ROOFING_OUTBOUND_AGENT_ID must be configured
 */

import dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

interface DemoOptions {
  phone: string;
  customerName: string;
  scenario: 'new_lead' | 'estimate_sent' | 'no_show' | 'review_request';
  address?: string;
  roofIssue?: string;
}

async function initiateCall(options: DemoOptions): Promise<void> {
  console.log('\n📞 Initiating Demo Outbound Call');
  console.log('═'.repeat(50));
  console.log(`Phone: ${options.phone}`);
  console.log(`Customer: ${options.customerName}`);
  console.log(`Scenario: ${options.scenario}`);
  console.log(`Address: ${options.address || 'Not provided'}`);
  console.log('═'.repeat(50));

  // First, check if we can call
  console.log('\n🔍 Running pre-call compliance checks...');

  const canCallResponse = await fetch(
    `${BASE_URL}/api/roofing/outbound/can-call/${encodeURIComponent(options.phone)}`,
    { method: 'GET' }
  );
  const canCallData = await canCallResponse.json();

  console.log(`   DNC Check: ${canCallData.checks?.dnc?.pass ? '✅ Clear' : '❌ Blocked'}`);
  console.log(`   TCPA Check: ${canCallData.checks?.tcpa?.pass ? '✅ Clear' : '❌ Blocked'}`);

  if (!canCallData.canCall) {
    console.log(`\n❌ Cannot proceed with call:`);
    console.log(`   Blocked by: ${canCallData.blockedBy}`);
    if (canCallData.checks?.tcpa?.reason) {
      console.log(`   Reason: ${canCallData.checks.tcpa.reason}`);
    }
    process.exit(1);
  }

  console.log('\n✅ All compliance checks passed. Initiating call...\n');

  // Trigger the outbound call
  const response = await fetch(`${BASE_URL}/api/roofing/outbound/trigger`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phone: options.phone,
      customerName: options.customerName,
      scenario: options.scenario,
      address: options.address,
      roofIssue: options.roofIssue,
      source: 'demo_script',
    }),
  });

  const data = await response.json();

  if (data.success) {
    console.log('🎉 Call initiated successfully!');
    console.log(`   Call ID: ${data.callId}`);
    console.log('\n📱 The phone should ring shortly...');
    console.log('\nThe AI agent (Sarah) will:');
    switch (options.scenario) {
      case 'new_lead':
        console.log('   - Introduce herself and Roofing Pros USA');
        console.log('   - Ask about the roof issue');
        console.log('   - Try to schedule a free inspection');
        break;
      case 'estimate_sent':
        console.log('   - Follow up on the estimate that was sent');
        console.log('   - Answer questions about pricing');
        console.log('   - Try to schedule the installation');
        break;
      case 'no_show':
        console.log('   - Check if the customer is still interested');
        console.log('   - Try to reschedule the inspection');
        console.log('   - Offer flexible timing options');
        break;
      case 'review_request':
        console.log('   - Thank them for choosing Roofing Pros USA');
        console.log('   - Ask if they would leave a review');
        console.log('   - Provide review link options');
        break;
    }
  } else {
    console.log('❌ Call failed to initiate');
    console.log(`   Reason: ${data.reason || 'Unknown'}`);
    console.log(`   Error: ${data.error || 'No details'}`);

    if (data.scheduledFor) {
      console.log(`\n📅 Suggested time: ${data.scheduledFor}`);
    }
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help') {
    console.log(`
📞 Roofing Pros USA - Demo Call Script

Usage:
  npx ts-node scripts/roofing/demo-call.ts <phone> [options]

Arguments:
  phone         Phone number to call (required)

Options:
  --name        Customer name (default: "Demo Customer")
  --scenario    Call scenario: new_lead, estimate_sent, no_show, review_request
                (default: new_lead)
  --address     Property address
  --issue       Roof issue description

Examples:
  npx ts-node scripts/roofing/demo-call.ts +14075551234
  npx ts-node scripts/roofing/demo-call.ts +14075551234 --name "John Smith" --scenario estimate_sent
  npx ts-node scripts/roofing/demo-call.ts +14075551234 --address "123 Oak St, Orlando FL"
    `);
    process.exit(0);
  }

  const phone = args[0];

  // Parse options
  const options: DemoOptions = {
    phone,
    customerName: 'Demo Customer',
    scenario: 'new_lead',
  };

  for (let i = 1; i < args.length; i += 2) {
    const flag = args[i];
    const value = args[i + 1];

    switch (flag) {
      case '--name':
        options.customerName = value;
        break;
      case '--scenario':
        if (['new_lead', 'estimate_sent', 'no_show', 'review_request'].includes(value)) {
          options.scenario = value as any;
        } else {
          console.log(`Invalid scenario: ${value}`);
          process.exit(1);
        }
        break;
      case '--address':
        options.address = value;
        break;
      case '--issue':
        options.roofIssue = value;
        break;
    }
  }

  try {
    await initiateCall(options);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
