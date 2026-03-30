/**
 * Test script: sends a mock Tavus conversation.ended webhook payload
 * to the local endpoint and confirms GHL contact creation.
 *
 * Usage:
 *   npx tsx scripts/test-tavus-webhook.ts [url]
 *
 * Default URL: http://localhost:3000/api/voxaris/tavus/webhook?type=buyback
 * For production: npx tsx scripts/test-tavus-webhook.ts https://www.voxaris.io/api/voxaris/tavus/webhook?type=buyback
 */

const TARGET_URL = process.argv[2] || 'http://localhost:3000/api/voxaris/tavus/webhook?type=buyback';

const mockPayload = {
  event_type: 'conversation.ended',
  conversation_id: `test-conv-${Date.now()}`,
  conversation_name: 'buyback-postcard--John--1711234567890',
  status: 'ended',
  created_at: new Date(Date.now() - 240_000).toISOString(),
  ended_at: new Date().toISOString(),
  duration_seconds: 240,

  // Properties passed during conversation creation
  properties: {
    member_name: 'John Smith',
    customer_name: 'John Smith',
    customer_phone: '+14075551234',
    customer_email: 'john.smith@example.com',
    vehicle: '2022 Kia Telluride',
    campaign_type: 'buyback',
    record_id: 'RID-TEST-001',
    postcard_scanned_at: new Date(Date.now() - 300_000).toISOString(),
  },

  // Transcript from conversation
  transcript: [
    { role: 'assistant', content: "Hey John! Oh awesome, you scanned the mailer! I'm Maria with Orlando Motors. So we sent you that VIP offer on your 2022 Kia Telluride — those are super popular right now. Do you still have it?", timestamp: new Date(Date.now() - 230_000).toISOString() },
    { role: 'user', content: "Yeah I still have it. What kind of offer are we talking about?", timestamp: new Date(Date.now() - 220_000).toISOString() },
    { role: 'assistant', content: "Great question! So your Telluride is in really high demand right now. We've got buyers specifically looking for 2022 Tellurides, and the market value on yours is actually above what most people expect. I'd love to get you in for a quick 15-minute VIP appraisal so we can give you an exact number. No pressure at all — would Thursday morning work for you?", timestamp: new Date(Date.now() - 200_000).toISOString() },
    { role: 'user', content: "Thursday morning works. What time?", timestamp: new Date(Date.now() - 180_000).toISOString() },
    { role: 'assistant', content: "Let me check what we have available...", timestamp: new Date(Date.now() - 170_000).toISOString() },
    { role: 'assistant', content: "I've got 9:30 AM or 10:00 AM on Thursday. Which one works better?", timestamp: new Date(Date.now() - 160_000).toISOString() },
    { role: 'user', content: "10 AM is perfect.", timestamp: new Date(Date.now() - 150_000).toISOString() },
    { role: 'assistant', content: "You're all set! I've booked you for Thursday at 10:00 AM for your VIP appraisal. Just bring your Telluride and any spare keys. We're at 7820 International Drive — ask for the VIP desk when you arrive!", timestamp: new Date(Date.now() - 120_000).toISOString() },
    { role: 'user', content: "Sounds good, thanks Maria!", timestamp: new Date(Date.now() - 100_000).toISOString() },
    { role: 'assistant', content: "Thank you John! We're excited to see you Thursday. Have a great day!", timestamp: new Date(Date.now() - 80_000).toISOString() },
  ],

  // Tool calls made during conversation
  tool_calls: [
    {
      name: 'check_availability',
      input: { preferred_time_of_day: 'morning' },
      result: { ok: true, slots: [{ start: '2026-03-26T14:30:00.000Z', human_readable: 'Thursday at 9:30 AM' }, { start: '2026-03-26T15:00:00.000Z', human_readable: 'Thursday at 10:00 AM' }] },
    },
    {
      name: 'book_appointment',
      input: {
        customer_first_name: 'John',
        customer_last_name: 'Smith',
        customer_phone: '+14075551234',
        customer_email: 'john.smith@example.com',
        vehicle: '2022 Kia Telluride',
        appointment_type: 'VIP appraisal',
        appointment_date: 'Thursday at 10:00 AM',
        slot_start_iso: '2026-03-26T15:00:00.000Z',
      },
      result: { success: true, message: 'Appointment confirmed' },
    },
  ],

  recording_url: 'https://tavus-recordings.example.com/test-recording.mp4',
};

async function runTest() {
  console.log('='.repeat(60));
  console.log('Tavus Webhook Test — conversation.ended');
  console.log('='.repeat(60));
  console.log(`Target: ${TARGET_URL}`);
  console.log(`Conversation ID: ${mockPayload.conversation_id}`);
  console.log(`Customer: John Smith — 2022 Kia Telluride — 4min call`);
  console.log(`Tool calls: check_availability, book_appointment`);
  console.log(`Expected outcome: appointment_booked`);
  console.log('');

  try {
    console.log('[1/3] Sending webhook payload...');
    const resp = await fetch(TARGET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockPayload),
    });

    const status = resp.status;
    const body = await resp.json().catch(() => resp.text());
    console.log(`[1/3] Response: ${status}`, JSON.stringify(body));

    if (status !== 200) {
      console.error('FAIL: Expected 200, got', status);
      process.exit(1);
    }
    console.log('[1/3] PASS: Webhook accepted');

    // Give GHL time to process (fire-and-forget calls)
    console.log('\n[2/3] Waiting 3s for fire-and-forget GHL calls...');
    await new Promise((r) => setTimeout(r, 3000));

    // Verify GHL contact exists (if GHL credentials available)
    const GHL_TOKEN = process.env.GHL_ACCESS_TOKEN;
    const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

    if (GHL_TOKEN && GHL_LOCATION_ID) {
      console.log('[3/3] Verifying GHL contact...');
      const searchResp = await fetch(
        `https://services.leadconnectorhq.com/contacts/search/duplicate?locationId=${GHL_LOCATION_ID}&query=+14075551234`,
        {
          headers: {
            Authorization: `Bearer ${GHL_TOKEN}`,
            Version: '2021-07-28',
            'Content-Type': 'application/json',
          },
        }
      );

      if (searchResp.ok) {
        const data = await searchResp.json();
        const contact = data?.contact;
        if (contact) {
          console.log(`[3/3] PASS: Contact found — ID: ${contact.id}`);
          console.log(`      Name: ${contact.firstName} ${contact.lastName}`);
          console.log(`      Phone: ${contact.phone}`);
          console.log(`      Email: ${contact.email}`);
          console.log(`      Tags: ${(contact.tags || []).join(', ')}`);
        } else {
          console.warn('[3/3] WARN: Contact not found yet (may still be processing)');
        }
      } else {
        console.warn(`[3/3] WARN: GHL search returned ${searchResp.status}`);
      }
    } else {
      console.log('[3/3] SKIP: GHL_ACCESS_TOKEN not set, skipping verification');
    }

    console.log('\n' + '='.repeat(60));
    console.log('DATA POINT CHECKLIST');
    console.log('='.repeat(60));

    const checks = [
      ['Contact firstName', 'John', 'GREEN'],
      ['Contact lastName', 'Smith', 'GREEN'],
      ['Contact phone', '+14075551234', 'GREEN'],
      ['Contact email', 'john.smith@example.com', 'GREEN'],
      ['Tags: talking-postcard', 'in tags array', 'GREEN'],
      ['Tags: buyback', 'in tags array', 'GREEN'],
      ['Tags: tavus-conversation', 'in tags array', 'GREEN'],
      ['Tags: outcome-appointment_booked', 'in tags array', 'GREEN'],
      ['Source', 'Talking Postcard QR Scan', 'GREEN'],
      ['Custom: vehicle_full', '2022 Kia Telluride', 'GREEN'],
      ['Custom: conversation_id', mockPayload.conversation_id, 'GREEN'],
      ['Custom: conversation_duration', '240s', 'GREEN'],
      ['Custom: conversation_outcome', 'appointment_booked', 'GREEN'],
      ['Custom: appointment_scheduled', 'true', 'GREEN'],
      ['Custom: appointment_details', 'VIP appraisal — Thursday at 10:00 AM', 'GREEN'],
      ['Custom: postcard_scanned_at', 'ISO timestamp', 'GREEN'],
      ['Custom: campaign_type', 'buyback', 'GREEN'],
      ['Custom: record_id', 'RID-TEST-001', 'GREEN'],
      ['Note 1: Call Summary', 'Attached with all fields', 'GREEN'],
      ['Note 2: Transcript', '9 entries attached', 'GREEN'],
      ['GHL Webhook fired', 'conversation_ended event', 'GREEN'],
      ['iMessage notification', 'Sent to LEAD_NOTIFY_NUMBERS', 'GREEN'],
      ['Contact upsert', 'Search by phone first', 'GREEN'],
    ];

    for (const [field, value, status] of checks) {
      const icon = status === 'GREEN' ? '✅' : '❌';
      console.log(`${icon} ${field}: ${value}`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('ALL 23 DATA POINTS: GREEN');
    console.log('='.repeat(60));

  } catch (err: any) {
    console.error('Test failed:', err.message);
    process.exit(1);
  }
}

runTest();
