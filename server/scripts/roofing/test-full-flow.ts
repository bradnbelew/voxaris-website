/**
 * Roofing Pros USA - Full Flow Test Script
 *
 * Simulates the entire call flow from webhook to GHL sync.
 * Run with: npx ts-node scripts/roofing/test-full-flow.ts
 *
 * Tests:
 * 1. Retell webhook handling (call_analyzed event)
 * 2. GHL sync endpoint
 * 3. Appointment booking function
 * 4. DNC list management
 * 5. TCPA compliance checks
 * 6. Follow-up sequence triggering
 */

import dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

// Test data
const TEST_CUSTOMER = {
  name: 'John Smith',
  phone: '+14075551234',
  email: 'john.smith@test.com',
  address: '123 Oak Street, Orlando, FL 32801',
  zip: '32801',
  roofIssue: 'Storm damage from recent hurricane',
};

const SIMULATED_RETELL_WEBHOOK = {
  event: 'call_analyzed',
  call_id: `test-call-${Date.now()}`,
  agent_id: 'agent_83e716b69e9a025d6ade2b19f3',
  call_status: 'ended',
  start_timestamp: Date.now() - 300000, // 5 minutes ago
  end_timestamp: Date.now(),
  duration_ms: 300000,
  from_number: TEST_CUSTOMER.phone,
  to_number: '+14072891565',
  direction: 'inbound',
  disconnection_reason: 'user_hangup',
  recording_url: 'https://example.com/recording.mp3',
  transcript: `
Agent: Hi, this is Sarah with Roofing Pros USA. This call may be recorded for quality assurance. How can I help you today?
Customer: Hi, I have some storm damage on my roof from the hurricane last week.
Agent: I'm sorry to hear that! Storm damage can be really stressful. Are you the homeowner at the property?
Customer: Yes, I am.
Agent: Great. Can you tell me a bit more about what you're seeing?
Customer: There are some missing shingles and I think there might be a leak starting.
Agent: I understand. We'll definitely want to get one of our specialists out there for a free inspection. Have you filed an insurance claim yet?
Customer: Not yet, I wanted to get an assessment first.
Agent: That's smart. We can help you with the documentation for your insurance claim. Let me get your information and schedule that inspection.
Customer: Sounds good.
Agent: What's the best address for the inspection?
Customer: 123 Oak Street, Orlando.
Agent: Perfect. Would morning or afternoon work better for you?
Customer: Morning would be best.
Agent: How about this Thursday morning between 9 and 12?
Customer: That works.
Agent: Excellent! Just to confirm - that's Thursday, February 15th in the morning for John Smith at 123 Oak Street, Orlando. Is that correct?
Customer: Yes, that's right.
Agent: You're all set! One of our roofing specialists will call you the morning of to confirm. Is there anything else I can help with?
Customer: No, that's all. Thank you!
Agent: Thank you for calling Roofing Pros USA. Have a great day!
  `.trim(),
  call_analysis: {
    custom_analysis_data: {
      caller_name: TEST_CUSTOMER.name,
      caller_phone: TEST_CUSTOMER.phone,
      property_address: TEST_CUSTOMER.address,
      property_zip: TEST_CUSTOMER.zip,
      is_homeowner: true,
      roof_issue_type: 'Storm Damage',
      is_storm_damage: true,
      has_insurance_claim: false,
      appointment_booked: true,
      appointment_date: 'Thursday, Feb 15 - Morning',
      call_outcome: 'Appointment Booked',
      urgency_level: 'Priority',
      customer_sentiment: 'Positive',
      call_summary: 'Homeowner called about storm damage from recent hurricane. Missing shingles and potential leak. Scheduled free inspection for Thursday morning. No insurance claim filed yet - we will help with documentation.',
      follow_up_needed: false,
    },
  },
};

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  duration: number;
}

const results: TestResult[] = [];

async function runTest(name: string, testFn: () => Promise<void>): Promise<void> {
  const start = Date.now();
  try {
    await testFn();
    results.push({
      name,
      passed: true,
      message: 'Success',
      duration: Date.now() - start,
    });
    console.log(`✅ ${name} (${Date.now() - start}ms)`);
  } catch (error: any) {
    results.push({
      name,
      passed: false,
      message: error.message,
      duration: Date.now() - start,
    });
    console.log(`❌ ${name}: ${error.message}`);
  }
}

async function fetchWithTimeout(url: string, options: RequestInit, timeout = 10000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(id);
  }
}

// ============================================================================
// TEST SUITE
// ============================================================================

async function testHealthCheck(): Promise<void> {
  const response = await fetchWithTimeout(`${BASE_URL}/api/health`, { method: 'GET' });
  if (!response.ok) throw new Error(`Health check failed: ${response.status}`);
  const data = await response.json();
  if (data.status !== 'ok' && data.status !== 'degraded') {
    throw new Error(`Unexpected health status: ${data.status}`);
  }
}

async function testRoofingHealthCheck(): Promise<void> {
  const response = await fetchWithTimeout(`${BASE_URL}/api/roofing/health`, { method: 'GET' });
  if (!response.ok) throw new Error(`Roofing health check failed: ${response.status}`);
  const data = await response.json();
  if (data.status !== 'ok') {
    throw new Error(`Unexpected status: ${data.status}`);
  }
}

async function testTcpaStatus(): Promise<void> {
  const response = await fetchWithTimeout(`${BASE_URL}/api/roofing/outbound/tcpa-status`, { method: 'GET' });
  if (!response.ok) throw new Error(`TCPA status check failed: ${response.status}`);
  const data = await response.json();
  if (!data.success) {
    throw new Error('TCPA status returned unsuccessful');
  }
  if (!data.windowStart || !data.windowEnd) {
    throw new Error('Missing TCPA window times');
  }
  console.log(`   Current Time: ${data.currentTime}, Window Open: ${data.isOpen}`);
}

async function testDncCheck(): Promise<void> {
  // Test with a known clean number
  const testPhone = '+14075559999';
  const response = await fetchWithTimeout(`${BASE_URL}/api/roofing/outbound/dnc/${encodeURIComponent(testPhone)}`, {
    method: 'GET',
  });
  if (!response.ok) throw new Error(`DNC check failed: ${response.status}`);
  const data = await response.json();
  // Should return isOnDnc field
  if (typeof data.isOnDnc !== 'boolean') {
    throw new Error('Missing isOnDnc field in response');
  }
}

async function testDncAddRemove(): Promise<void> {
  const testPhone = '+14075558888';

  // Add to DNC
  const addResponse = await fetchWithTimeout(`${BASE_URL}/api/roofing/outbound/dnc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phone: testPhone,
      reason: 'test_entry',
      source: 'integration_test',
    }),
  });
  if (!addResponse.ok) throw new Error(`DNC add failed: ${addResponse.status}`);

  // Verify it's on DNC
  const checkResponse = await fetchWithTimeout(`${BASE_URL}/api/roofing/outbound/dnc/${encodeURIComponent(testPhone)}`, {
    method: 'GET',
  });
  const checkData = await checkResponse.json();
  if (!checkData.isOnDnc) {
    throw new Error('Phone should be on DNC list after adding');
  }

  // Remove from DNC
  const removeResponse = await fetchWithTimeout(`${BASE_URL}/api/roofing/outbound/dnc/${encodeURIComponent(testPhone)}`, {
    method: 'DELETE',
  });
  if (!removeResponse.ok) throw new Error(`DNC remove failed: ${removeResponse.status}`);

  // Verify it's removed
  const verifyResponse = await fetchWithTimeout(`${BASE_URL}/api/roofing/outbound/dnc/${encodeURIComponent(testPhone)}`, {
    method: 'GET',
  });
  const verifyData = await verifyResponse.json();
  if (verifyData.isOnDnc) {
    throw new Error('Phone should not be on DNC list after removing');
  }
}

async function testCanCallCheck(): Promise<void> {
  const testPhone = '+14075557777';
  const response = await fetchWithTimeout(`${BASE_URL}/api/roofing/outbound/can-call/${encodeURIComponent(testPhone)}`, {
    method: 'GET',
  });
  if (!response.ok) throw new Error(`Can-call check failed: ${response.status}`);
  const data = await response.json();
  if (typeof data.canCall !== 'boolean') {
    throw new Error('Missing canCall field in response');
  }
  console.log(`   Phone: ${testPhone}, Can Call: ${data.canCall}, Blocked By: ${data.blockedBy || 'none'}`);
}

async function testRetellWebhook(): Promise<void> {
  const response = await fetchWithTimeout(`${BASE_URL}/api/roofing/retell/roofing`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(SIMULATED_RETELL_WEBHOOK),
  });
  // Should return 200 or 202
  if (response.status !== 200 && response.status !== 202) {
    throw new Error(`Retell webhook failed: ${response.status}`);
  }
  const data = await response.json();
  console.log(`   Response: ${JSON.stringify(data)}`);
}

async function testGhlSync(): Promise<void> {
  const response = await fetchWithTimeout(`${BASE_URL}/api/roofing/n8n/ghl-sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      call_id: SIMULATED_RETELL_WEBHOOK.call_id,
      customer_name: TEST_CUSTOMER.name,
      customer_phone: TEST_CUSTOMER.phone,
      customer_email: TEST_CUSTOMER.email,
      property_address: TEST_CUSTOMER.address,
      property_zip: TEST_CUSTOMER.zip,
      roof_issue: TEST_CUSTOMER.roofIssue,
      is_storm_damage: true,
      has_insurance_claim: false,
      is_homeowner: true,
      appointment_booked: true,
      appointment_date: 'Thursday, Feb 15',
      appointment_time: 'Morning',
      call_outcome: 'Appointment Booked',
      call_summary: 'Test call summary',
      urgency_level: 'Priority',
      lead_quality: 'hot',
      direction: 'inbound',
    }),
  });
  if (!response.ok) throw new Error(`GHL sync failed: ${response.status}`);
  const data = await response.json();
  if (!data.success) {
    throw new Error(`GHL sync returned unsuccessful: ${data.error}`);
  }
  console.log(`   GHL Contact ID: ${data.ghl_contact_id || 'N/A'}`);
}

async function testBookInspection(): Promise<void> {
  const response = await fetchWithTimeout(`${BASE_URL}/api/roofing/functions/book-inspection`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customer_name: 'Test Customer',
      phone: '+14075556666',
      email: 'test@example.com',
      property_address: '456 Test Ave, Tampa, FL 33601',
      zip_code: '33601',
      roof_issue: 'General inspection',
      is_storm_damage: false,
      has_insurance_claim: false,
      is_homeowner: true,
      appointment_date: 'Friday, Feb 16',
      appointment_time_window: 'afternoon',
      urgency: 'normal',
      call_source: 'integration_test',
    }),
  });
  if (!response.ok) throw new Error(`Book inspection failed: ${response.status}`);
  const data = await response.json();
  if (!data.success) {
    throw new Error(`Book inspection returned unsuccessful: ${data.error}`);
  }
  console.log(`   Lead ID: ${data.lead_id || 'N/A'}, Confirmation: ${data.confirmation_number || 'N/A'}`);
}

async function testN8nHealth(): Promise<void> {
  const response = await fetchWithTimeout(`${BASE_URL}/api/roofing/n8n/health`, { method: 'GET' });
  if (!response.ok) throw new Error(`n8n health check failed: ${response.status}`);
  const data = await response.json();
  if (data.status !== 'ok') {
    throw new Error(`Unexpected n8n health status: ${data.status}`);
  }
  console.log(`   Endpoints: ${data.endpoints?.length || 0}`);
}

// ============================================================================
// RUN ALL TESTS
// ============================================================================

async function main() {
  console.log('\n🧪 Roofing Pros USA - Full Flow Test Suite\n');
  console.log(`📍 Base URL: ${BASE_URL}`);
  console.log('═'.repeat(60));

  // Basic connectivity tests
  console.log('\n📡 Connectivity Tests:');
  await runTest('Main Health Check', testHealthCheck);
  await runTest('Roofing Health Check', testRoofingHealthCheck);
  await runTest('n8n Workflows Health', testN8nHealth);

  // TCPA compliance tests
  console.log('\n⚖️ TCPA Compliance Tests:');
  await runTest('TCPA Status Check', testTcpaStatus);
  await runTest('Can-Call Check', testCanCallCheck);

  // DNC list tests
  console.log('\n🚫 DNC List Tests:');
  await runTest('DNC Check (Clean Number)', testDncCheck);
  await runTest('DNC Add/Remove Cycle', testDncAddRemove);

  // Webhook tests
  console.log('\n📞 Webhook Tests:');
  await runTest('Retell Webhook (call_analyzed)', testRetellWebhook);

  // Integration tests
  console.log('\n🔗 Integration Tests:');
  await runTest('GHL Sync Endpoint', testGhlSync);
  await runTest('Book Inspection Function', testBookInspection);

  // Summary
  console.log('\n' + '═'.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('═'.repeat(60));

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);

  console.log(`\n✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⏱️ Total Duration: ${totalDuration}ms`);

  if (failed > 0) {
    console.log('\n❌ Failed Tests:');
    results.filter((r) => !r.passed).forEach((r) => {
      console.log(`   - ${r.name}: ${r.message}`);
    });
    process.exit(1);
  } else {
    console.log('\n🎉 All tests passed!\n');
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('❌ Test suite crashed:', err.message);
  process.exit(1);
});
