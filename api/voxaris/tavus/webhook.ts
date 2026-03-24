import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * POST /api/voxaris/tavus/webhook?type=buyback|business-card
 *
 * Unified Tavus webhook handler. Routes to the correct tool handler
 * based on the `type` query param or conversation name prefix.
 * Merges buyback-webhook.ts and business-card-webhook.ts into one function.
 */

// ── Imports from consolidated handlers ──

// Cal.com
const CAL_API_KEY = process.env.CAL_COM_API_KEY || '';
const CAL_EVENT_TYPE_ID = process.env.CAL_COM_EVENT_TYPE_ID || '';
const CAL_API_VERSION = '2024-09-04';
const CAL_HEADERS = {
  Authorization: `Bearer ${CAL_API_KEY}`,
  'cal-api-version': CAL_API_VERSION,
  'Content-Type': 'application/json',
  'User-Agent': 'Voxaris/1.0',
};

// Sendblue
const SB_KEY = process.env.SENDBLUE_API_KEY || '';
const SB_SECRET = process.env.SENDBLUE_API_SECRET || '';
const SB_FROM = process.env.SENDBLUE_BUYBACK_FROM || process.env.SENDBLUE_FROM_NUMBER || '+13214744152';
const NOTIFY_NUMBER = process.env.LEAD_NOTIFY_NUMBERS || '+14078195809';

// GHL
const GHL_TOKEN = process.env.GHL_ACCESS_TOKEN || '';
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID || '';
const GHL_HEADERS_BASE = {
  Authorization: `Bearer ${GHL_TOKEN}`,
  Version: '2021-07-28',
  'Content-Type': 'application/json',
};
const GHL_WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/euXH15G0pqPgr497kAL2/webhook-trigger/6730dcb6-748c-4323-a525-65b972384f7a';

// Dealership config
const DEALERSHIP = { name: 'Orlando Motors', phone: '(407) 555-0193', address: '7820 International Drive, Orlando, FL 32819' };

// ── Clean phone number from STT garbled input ──
function cleanPhoneNumber(raw: string): string {
  if (!raw) return '';
  let digits = raw.replace(/[^\d+]/g, '');
  // US numbers: 10 digits, or 11 with leading 1, or 12 with +1
  if (digits.startsWith('+1') && digits.length > 12) digits = digits.substring(0, 12);
  else if (digits.startsWith('1') && digits.length > 11) digits = digits.substring(0, 11);
  else if (digits.length > 10 && !digits.startsWith('+') && !digits.startsWith('1')) digits = digits.substring(0, 10);
  if (digits.length === 10 && !digits.startsWith('+')) digits = '+1' + digits;
  else if (digits.length === 11 && digits.startsWith('1')) digits = '+' + digits;
  return digits;
}

// Campaign expiry (default 7 days)
function getCampaignExpiry(): string {
  const days = parseInt(process.env.CAMPAIGN_DURATION_DAYS || '7', 10);
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + days);
  expiry.setHours(23, 59, 59, 0);
  return expiry.toISOString();
}

// Fire data to GHL inbound webhook (master workflow trigger)
async function fireGhlWebhook(payload: Record<string, any>): Promise<void> {
  try {
    const res = await fetch(GHL_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        campaign_expiry: payload.campaign_expiry || getCampaignExpiry(),
        timestamp: new Date().toISOString(),
        location_id: GHL_LOCATION_ID,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) console.error(`GHL webhook failed: ${res.status}`);
    else console.log(`GHL webhook fired: ${payload.event_type}`);
  } catch (err: any) {
    console.error(`GHL webhook error: ${err.message}`);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = req.body || {};
  const conversationId = body.conversation_id || body.properties?.conversation_id || body.cid || '';
  const toolName = body.tool_name || body.function_name || body.name || '';
  const toolArgs = body.tool_args || body.tool_input || body.arguments || body.args || {};
  const eventType = body.event_type || body.type || 'unknown';
  const convName = body.conversation_name || '';

  // Determine which handler based on query param or conversation name
  const webhookType = (req.query.type as string) ||
    (convName.startsWith('buyback-postcard') ? 'buyback' :
     convName.startsWith('Business Card') ? 'business-card' : 'unknown');

  console.log(`Tavus webhook [${webhookType}]: event=${eventType} tool=${toolName} cid=${conversationId}`);

  // Tool call handling
  if (toolName) {
    let result: Record<string, any>;
    if (webhookType === 'business-card') {
      result = await handleBusinessCardTool(toolName, toolArgs, conversationId);
    } else {
      result = await handleBuybackTool(toolName, toolArgs, conversationId);
    }
    return res.status(200).json({ ok: true, result: JSON.stringify(result) });
  }

  // Non-tool events
  console.log(`Tavus event [${webhookType}]: ${eventType}`, JSON.stringify(body).slice(0, 500));

  // Handle conversation end — full GHL data capture
  if (eventType === 'conversation_ended' || eventType === 'conversation.ended') {
    console.log(`[webhook] conversation.ended received: ${conversationId}`);

    const durationSec = body.duration_seconds || body.properties?.duration_seconds || 0;
    const convProps = body.properties || {};
    const convContext = body.conversational_context || '';

    // Extract all available fields from properties or top-level body
    const memberName = convProps.member_name || convProps.customer_name || body.customer_name || '';
    const firstName = memberName ? memberName.split(' ')[0] : '';
    const lastName = memberName ? memberName.split(' ').slice(1).join(' ') : '';
    const phone = convProps.customer_phone || convProps.phone || body.phone || '';
    const email = convProps.customer_email || convProps.email || body.email || '';
    const vehicle = convProps.vehicle || convProps.vehicle_full || body.vehicle || '';
    const campaignType = convProps.campaign_type || convProps.campaignType || 'buyback';
    const recordId = convProps.record_id || convProps.recordId || '';
    const scannedAt = convProps.postcard_scanned_at || convProps.scanned_at || '';

    // Extract transcript
    const transcript: Array<{ role: string; content: string; timestamp?: string }> = body.transcript || body.messages || [];
    const hasTranscript = Array.isArray(transcript) && transcript.length > 0;
    console.log(`[webhook] Transcript entries: ${hasTranscript ? transcript.length : 0}`);

    // Extract tool calls made during conversation
    const toolCalls: Array<Record<string, any>> = body.tool_calls || body.tools_used || [];
    const hasToolCalls = Array.isArray(toolCalls) && toolCalls.length > 0;
    console.log(`[webhook] Tool calls made: ${hasToolCalls ? toolCalls.length : 0}`);

    // Determine dynamic outcome based on tool calls
    const toolNames = toolCalls.map((t: any) => t.name || t.tool_name || t.function_name || '');
    let callOutcome = 'not_interested';
    let appointmentScheduled = false;
    let appointmentDetails = '';

    if (toolNames.includes('book_appointment')) {
      callOutcome = 'appointment_booked';
      appointmentScheduled = true;
      const bookCall = toolCalls.find((t: any) => (t.name || t.tool_name || '') === 'book_appointment');
      const bookArgs = bookCall?.input || bookCall?.arguments || bookCall?.tool_input || {};
      appointmentDetails = `${bookArgs.appointment_type || 'VIP appraisal'} — ${bookArgs.appointment_date || bookArgs.slot_start_iso || 'TBD'}`;
    } else if (toolNames.includes('transfer_to_human')) {
      callOutcome = 'transfer_requested';
    } else if (toolNames.includes('log_lead') || toolNames.includes('log_interested_lead')) {
      callOutcome = 'interested';
    } else if (durationSec < 15) {
      callOutcome = 'no_answer';
    }

    console.log(`[webhook] Outcome: ${callOutcome}, appointment: ${appointmentScheduled}`);

    // Build tags
    const tags = [
      'talking-postcard',
      campaignType,
      'tavus-conversation',
      `outcome-${callOutcome}`,
      `duration-${Math.round(durationSec / 60)}min`,
      ...(appointmentScheduled ? ['appointment-booked'] : []),
    ];

    // Build custom fields
    const customFields = [
      { key: 'contact.vehicle_full', field_value: vehicle },
      { key: 'contact.conversation_id', field_value: conversationId },
      { key: 'contact.conversation_duration', field_value: `${Math.round(durationSec)}s` },
      { key: 'contact.conversation_outcome', field_value: callOutcome },
      { key: 'contact.appointment_scheduled', field_value: appointmentScheduled ? 'true' : 'false' },
      { key: 'contact.appointment_details', field_value: appointmentDetails },
      { key: 'contact.postcard_scanned_at', field_value: scannedAt || new Date().toISOString() },
      { key: 'contact.campaign_type', field_value: campaignType },
      { key: 'contact.record_id', field_value: recordId },
      { key: 'contact.direction', field_value: 'tavus_video' },
    ];

    // Build summary note
    const durationMin = Math.round(durationSec / 60);
    const toolCallSummary = hasToolCalls
      ? toolCalls.map((t: any) => `- ${t.name || t.tool_name || 'unknown'}`).join('\n')
      : '- None';

    const summaryNote =
      `## Talking Postcard Call Summary\n\n` +
      `**Customer:** ${memberName || 'Unknown'}\n` +
      `**Vehicle:** ${vehicle || 'Not specified'}\n` +
      `**Duration:** ${durationMin} minute${durationMin !== 1 ? 's' : ''} (${durationSec}s)\n` +
      `**Outcome:** ${callOutcome}\n` +
      `**Appointment:** ${appointmentScheduled ? `Booked — ${appointmentDetails}` : 'Not booked'}\n` +
      `**Tool calls made:**\n${toolCallSummary}\n\n` +
      `**Campaign:** ${campaignType}\n` +
      `**Record ID:** ${recordId || 'N/A'}\n` +
      `**Conversation ID:** ${conversationId}\n` +
      `**Scanned at:** ${scannedAt || 'N/A'}\n` +
      `**Call ended:** ${new Date().toLocaleString('en-US')}`;

    // Build transcript note
    const notes = [summaryNote];
    if (hasTranscript) {
      const transcriptLines = transcript.map((t: any) => {
        const role = (t.role || 'unknown').toUpperCase();
        const content = t.content || t.text || t.message || '';
        return `**${role}:** ${content}`;
      }).join('\n\n');

      notes.push(
        `## Conversation Transcript\n\n` +
        `**Conversation ID:** ${conversationId}\n` +
        `**Entries:** ${transcript.length}\n\n` +
        `---\n\n${transcriptLines}`
      );
    }

    // Upsert contact with everything (fire-and-forget)
    ghlUpsert({
      firstName,
      lastName,
      phone,
      email,
      tags,
      source: 'Talking Postcard QR Scan',
      customFields,
      notes,
    }).catch(() => {});

    // Fire GHL inbound webhook with full data
    fireGhlWebhook({
      event_type: 'conversation_ended',
      first_name: firstName,
      last_name: lastName,
      phone,
      email,
      vehicle,
      outcome: callOutcome,
      appointment_scheduled: appointmentScheduled,
      appointment_details: appointmentDetails,
      duration_seconds: durationSec,
      campaign_type: campaignType,
      record_id: recordId,
      direction: 'tavus_video',
      source: 'tavus_video',
      conversation_id: conversationId,
      tool_calls: toolNames,
      has_transcript: hasTranscript,
      tags,
    }).catch(() => {});

    // Notify owner
    const outcomeEmoji = appointmentScheduled ? '✅' : callOutcome === 'transfer_requested' ? '🔄' : callOutcome === 'interested' ? '👀' : '📞';
    notifyOwner(`${outcomeEmoji} Call ended: ${memberName || 'Unknown'} — ${vehicle || 'N/A'} — ${durationMin}min — ${callOutcome}${appointmentScheduled ? ' — ' + appointmentDetails : ''}`).catch(() => {});

    // ═══════════════════════════════════════════════════
    // AUTO FOLLOW-UP: Outcome-based customer texts
    // Goal: get the customer to the dealership
    // ═══════════════════════════════════════════════════
    const custName = firstName || 'there';
    const veh = vehicle || 'your vehicle';

    if (phone) {
      switch (callOutcome) {
        case 'appointment_booked': {
          // Immediate confirmation — make it easy to show up
          sendblueText(phone,
            `Hey ${custName}! Your VIP appraisal at Orlando Motors is confirmed — ${appointmentDetails}. ` +
            `Bring your ${veh} and any spare keys. We're at ${DEALERSHIP.address}. ` +
            `Ask for the VIP desk when you arrive! See you soon.`
          ).catch(() => {});

          // Schedule a reminder via GHL webhook (GHL workflow handles the timing)
          fireGhlWebhook({
            event_type: 'follow_up_appointment_reminder',
            first_name: firstName,
            phone,
            vehicle: veh,
            appointment_details: appointmentDetails,
            conversation_id: conversationId,
            follow_up_type: 'appointment_confirmation',
          }).catch(() => {});
          console.log(`[follow-up] appointment_booked: confirmation text sent to ${phone}`);
          break;
        }

        case 'interested': {
          // They talked but didn't book — soft nudge
          sendblueText(phone,
            `Hey ${custName}, great chatting with you! That VIP offer on your ${veh} is still on the table. ` +
            `If you want to lock in a quick 15-min appraisal, just reply here or call us at ${DEALERSHIP.phone}. ` +
            `The offer's good through Friday — no pressure at all.`
          ).catch(() => {});

          // Tell GHL to start warm nurture sequence
          fireGhlWebhook({
            event_type: 'follow_up_warm_lead',
            first_name: firstName,
            phone,
            email,
            vehicle: veh,
            conversation_id: conversationId,
            follow_up_type: 'warm_nurture',
          }).catch(() => {});
          console.log(`[follow-up] interested: soft nudge sent to ${phone}`);
          break;
        }

        case 'no_answer': {
          // Scanned but didn't really engage — re-engage
          sendblueText(phone,
            `Hey ${custName}! Looks like you checked out your VIP mailer — nice. ` +
            `We've got a strong offer on your ${veh} right now. ` +
            `Tap here to chat with us when you have a sec, or call ${DEALERSHIP.phone}. ` +
            `Offer expires Friday!`
          ).catch(() => {});

          // Tell GHL to start re-engage sequence
          fireGhlWebhook({
            event_type: 'follow_up_reengage',
            first_name: firstName,
            phone,
            vehicle: veh,
            conversation_id: conversationId,
            follow_up_type: 'reengage_no_show',
          }).catch(() => {});
          console.log(`[follow-up] no_answer: re-engage text sent to ${phone}`);
          break;
        }

        case 'transfer_requested': {
          // Team already notified — just confirm to customer
          sendblueText(phone,
            `Hey ${custName}, thanks for your patience! Someone from Orlando Motors will be calling you shortly. ` +
            `If you need us sooner, call ${DEALERSHIP.phone} directly.`
          ).catch(() => {});
          console.log(`[follow-up] transfer_requested: confirmation sent to ${phone}`);
          break;
        }

        default:
          // not_interested — don't text them
          console.log(`[follow-up] ${callOutcome}: no follow-up sent (opted out or not interested)`);
          break;
      }
    } else {
      console.log(`[follow-up] No phone number available, skipping customer follow-up`);
    }

    console.log(`[webhook] conversation.ended fully processed: ${conversationId} outcome=${callOutcome} duration=${durationSec}s`);
  }

  return res.status(200).json({ ok: true });
}

// ═══════════════════════════════════════════════════
// BUYBACK POSTCARD TOOLS
// ═══════════════════════════════════════════════════

async function handleBuybackTool(toolName: string, toolArgs: Record<string, any>, cid: string): Promise<Record<string, any>> {
  switch (toolName) {
    case 'check_availability':
      return getBuybackAvailability(toolArgs);

    case 'book_appointment': {
      console.log('Buyback appointment:', JSON.stringify(toolArgs));
      // Clean phone number — STT often garbles digit sequences
      const cleanedPhone = cleanPhoneNumber(toolArgs.customer_phone || '');
      console.log(`[book_appointment] Phone cleaned: "${toolArgs.customer_phone}" → "${cleanedPhone}"`);

      const dt = toolArgs.slot_start_iso ? new Date(toolArgs.slot_start_iso) : null;
      const timeStr = dt ? dt.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'America/New_York' }) + ' at ' + dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York' }) : 'your scheduled time';
      const hoursUntilAppt = dt ? (dt.getTime() - Date.now()) / (1000 * 60 * 60) : 999;
      const isSameDay = hoursUntilAppt < 24;

      // Push to GHL REST API
      ghlPush({
        firstName: toolArgs.customer_first_name,
        lastName: toolArgs.customer_last_name,
        phone: cleanedPhone,
        email: toolArgs.customer_email,
        tags: ['buyback-postcard', 'appointment-booked', 'vip-appraisal', 'booked-via-video', ...(isSameDay ? ['same-day-appt'] : [])],
        note: `## VIP Appraisal Appointment Booked\n\n**Type:** ${toolArgs.appointment_type || 'Appraisal'}\n**Time:** ${timeStr}\n**Vehicle:** ${toolArgs.vehicle || 'N/A'}\n**Same-day:** ${isSameDay ? 'Yes' : 'No'}\n**Conversation:** ${cid}\n**Booked:** ${new Date().toLocaleString('en-US')}`,
        customFields: [
          { key: 'contact.appointment_time', field_value: toolArgs.slot_start_iso || '' },
          { key: 'contact.appointment_readable', field_value: timeStr },
          { key: 'contact.conversation_outcome', field_value: 'Appointment Booked' },
          { key: 'contact.vehicle_full', field_value: toolArgs.vehicle || '' },
          { key: 'contact.direction', field_value: 'tavus_video' },
          { key: 'contact.same_day_appt', field_value: isSameDay ? 'true' : 'false' },
        ],
      }).catch(() => {});

      // Fire to GHL inbound webhook (master workflow trigger)
      fireGhlWebhook({
        event_type: 'appointment_booked',
        first_name: toolArgs.customer_first_name,
        last_name: toolArgs.customer_last_name,
        phone: cleanedPhone,
        email: toolArgs.customer_email,
        vehicle: toolArgs.vehicle,
        appointment_time: toolArgs.slot_start_iso,
        appointment_readable: timeStr,
        outcome: 'Appointment Booked',
        direction: 'tavus_video',
        source: 'tavus_video',
        same_day: isSameDay,
        tags: ['buyback-postcard', 'appointment-booked', 'vip-appraisal', 'booked-via-video'],
      }).catch(() => {});

      // Send confirmation text to customer via Sendblue
      if (cleanedPhone) {
        sendblueText(cleanedPhone, `Hi ${toolArgs.customer_first_name || 'there'}! Your VIP appraisal at Orlando Motors is confirmed for ${timeStr}. Bring your vehicle and any spare keys. ${DEALERSHIP.address}. Ask for the VIP desk! — Orlando Motors`).catch(() => {});
      }
      // Notify owner
      notifyOwner(`✅ Appt booked (video): ${toolArgs.customer_first_name || ''}${toolArgs.customer_last_name ? ' ' + toolArgs.customer_last_name : ''} — ${timeStr}${toolArgs.vehicle ? ' (' + toolArgs.vehicle + ')' : ''}${isSameDay ? ' ⚡ SAME DAY' : ''}`).catch(() => {});
      return { success: true, message: `Appointment confirmed for ${toolArgs.customer_first_name}. Tell the customer they are all set and we look forward to seeing them at Orlando Motors. Remind them to bring the mailer and ask for the VIP desk.` };
    }

    case 'log_lead': {
      console.log('Buyback lead:', JSON.stringify(toolArgs));
      ghlPush({
        firstName: toolArgs.first_name,
        lastName: toolArgs.last_name,
        phone: toolArgs.phone,
        email: toolArgs.email,
        tags: ['buyback-postcard', 'lead-captured'],
        note: `## Lead Captured via Buyback Postcard\n\n**Interest:** ${toolArgs.interest || 'Vehicle buyback'}\n**Notes:** ${toolArgs.notes || 'None'}\n**Conversation:** ${cid}`,
      }).catch(() => {});
      fireGhlWebhook({
        event_type: 'lead_captured',
        first_name: toolArgs.first_name,
        last_name: toolArgs.last_name,
        phone: toolArgs.phone,
        email: toolArgs.email,
        vehicle: toolArgs.vehicle,
        outcome: 'Lead Captured',
        direction: 'tavus_video',
        source: 'tavus_video',
        tags: ['buyback-postcard', 'lead-captured'],
      }).catch(() => {});
      return { success: true, message: 'Contact info saved.' };
    }

    case 'transfer_to_human':
      return { success: true, message: 'Let the customer know they can reach Orlando Motors directly at (407) 555-0193.', phone: '(407) 555-0193' };

    default:
      return { success: false, error: `Unknown tool: ${toolName}` };
  }
}

function getBuybackAvailability(toolInput: Record<string, any>): Record<string, any> {
  const now = new Date();
  const currentHour = now.getHours();
  const slots: Array<{ start: string; human_readable: string }> = [];

  // Same-day slots if before 4PM
  if (currentHour < 16 && toolInput.preferred_time_of_day !== 'morning') {
    const today = new Date(now);
    const day = today.getDay();
    if (day !== 0) { // not Sunday
      if (currentHour < 14) {
        slots.push({ start: fmtSlot(today, 14, 0), human_readable: `Today at 2:00 PM` });
      } else if (currentHour < 16) {
        const nextHour = currentHour + 1;
        slots.push({ start: fmtSlot(today, nextHour, 0), human_readable: `Today at ${fmtTime(nextHour, 0)}` });
      }
    }
  }

  for (let d = 1; d <= 7 && slots.length < 6; d++) {
    const date = new Date(now);
    date.setDate(date.getDate() + d);
    const day = date.getDay();
    if (day === 0) continue;
    if (day === 6) {
      slots.push({ start: fmtSlot(date, 10, 0), human_readable: `${fmtDay(date)} at 10:00 AM` });
      continue;
    }
    const times = toolInput.preferred_time_of_day === 'morning' ? [[9, 30], [10, 0]]
      : toolInput.preferred_time_of_day === 'afternoon' ? [[14, 0], [15, 30]]
      : [[10, 0], [14, 0]];
    for (const [h, m] of times) {
      slots.push({ start: fmtSlot(date, h!, m!), human_readable: `${fmtDay(date)} at ${fmtTime(h!, m!)}` });
    }
  }

  const topSlots = slots.slice(0, 3);
  const slotList = topSlots.map(s => s.human_readable).join(', or ');
  return { ok: true, message: `Available times for a 15-minute appraisal: ${slotList}.`, slots: topSlots };
}

// ═══════════════════════════════════════════════════
// BUSINESS CARD TOOLS (Cal.com)
// ═══════════════════════════════════════════════════

async function handleBusinessCardTool(toolName: string, toolArgs: Record<string, any>, cid: string): Promise<Record<string, any>> {
  switch (toolName) {
    case 'check_availability':
      return await checkCalAvailability(toolArgs);

    case 'book_strategy_call':
      return await bookCalAppointment(toolArgs, cid);

    case 'log_interested_lead': {
      ghlPush({
        firstName: (toolArgs.name || '').split(' ')[0],
        lastName: (toolArgs.name || '').split(' ').slice(1).join(' '),
        email: toolArgs.email,
        phone: toolArgs.phone,
        tags: ['business-card-scan', 'interested-lead', 'voxaris-lead'],
        note: `## Interested Lead from Business Card\n\n**Interest:** ${toolArgs.interest || 'General'}\n**Notes:** ${toolArgs.notes || 'None'}\n**Conversation:** ${cid}`,
      }).catch(() => {});
      return { success: true, message: 'Contact info saved. The team will follow up.' };
    }

    default:
      return { success: false, error: `Unknown tool: ${toolName}` };
  }
}

async function checkCalAvailability(toolArgs: Record<string, any>): Promise<Record<string, any>> {
  if (!CAL_API_KEY || !CAL_EVENT_TYPE_ID) return getStaticBusinessSlots(toolArgs);

  try {
    const now = new Date();
    const start = now.toISOString().split('T')[0];
    const endDate = new Date(now); endDate.setDate(endDate.getDate() + 7);
    const end = endDate.toISOString().split('T')[0];

    const resp = await fetch(
      `https://api.cal.com/v2/slots?eventTypeId=${CAL_EVENT_TYPE_ID}&start=${start}&end=${end}&timeZone=America/New_York`,
      { headers: CAL_HEADERS, signal: AbortSignal.timeout(10_000) }
    );

    if (!resp.ok) return getStaticBusinessSlots(toolArgs);

    const data = await resp.json();
    const allSlots: Array<{ start: string; human_readable: string }> = [];
    for (const [, daySlots] of Object.entries(data?.data || {})) {
      for (const slot of daySlots as Array<{ start: string }>) {
        const dt = new Date(slot.start);
        allSlots.push({
          start: slot.start,
          human_readable: `${dt.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', timeZone: 'America/New_York' })} at ${dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York' })}`,
        });
      }
    }

    const pref = toolArgs.preferred_time_of_day;
    let filtered = allSlots;
    if (pref === 'morning') filtered = allSlots.filter(s => { const h = new Date(s.start).getUTCHours(); return h >= 13 && h < 17; });
    else if (pref === 'afternoon') filtered = allSlots.filter(s => { const h = new Date(s.start).getUTCHours(); return h >= 17 && h < 22; });

    const finalSlots = (filtered.length > 0 ? filtered : allSlots).slice(0, 3);
    return { ok: true, message: `Available times: ${finalSlots.map(s => s.human_readable).join(', or ')}.`, slots: finalSlots };
  } catch {
    return getStaticBusinessSlots(toolArgs);
  }
}

async function bookCalAppointment(toolArgs: Record<string, any>, cid: string): Promise<Record<string, any>> {
  const { slot_start_iso, name, email, phone, notes } = toolArgs;
  if (!slot_start_iso || !name || !email) return { success: false, message: 'I need your name and email to confirm the booking. Could you share those?' };

  if (CAL_API_KEY && CAL_EVENT_TYPE_ID) {
    try {
      const resp = await fetch('https://api.cal.com/v2/bookings', {
        method: 'POST', headers: CAL_HEADERS,
        body: JSON.stringify({
          eventTypeId: parseInt(CAL_EVENT_TYPE_ID),
          start: slot_start_iso,
          attendee: { name, email, timeZone: 'America/New_York', language: 'en' },
          metadata: { phone: phone || '', notes: notes || '', source: 'business-card-qr', conversation_id: cid },
        }),
        signal: AbortSignal.timeout(10_000),
      });
      if (resp.ok) {
        const booking = (await resp.json())?.data;
        ghlPush({ firstName: name.split(' ')[0], lastName: name.split(' ').slice(1).join(' '), email, phone, tags: ['business-card-scan', 'strategy-call-booked', 'voxaris-lead'], note: `## Strategy Call Booked\n\n**Time:** ${slot_start_iso}\n**Booking:** ${booking?.uid || 'N/A'}\n**Conversation:** ${cid}` }).catch(() => {});
        const dt = new Date(slot_start_iso);
        const readable = dt.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'America/New_York' }) + ' at ' + dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York' });
        // Send confirmation text if phone provided
        if (phone) {
          sendblueText(phone, `Hi ${name.split(' ')[0]}! Your Voxaris strategy call is confirmed for ${readable}. You'll get a calendar invite at ${email}. Looking forward to it! - Voxaris Team`).catch(() => {});
        }
        return { success: true, message: `Strategy call confirmed for ${name} on ${readable}. A confirmation email will be sent to ${email}. Tell them you are excited for them to meet the team!`, booking_id: booking?.uid };
      }
    } catch {}
  }

  ghlPush({ firstName: name.split(' ')[0], lastName: name.split(' ').slice(1).join(' '), email, phone, tags: ['business-card-scan', 'booking-requested', 'voxaris-lead'], note: `## Strategy Call Requested\n\n**Time:** ${slot_start_iso}\n**Conversation:** ${cid}\n**Note:** Needs manual confirmation.` }).catch(() => {});
  return { success: true, message: `Booking request logged for ${name}. The team will send a confirmation email to ${email} shortly.` };
}

function getStaticBusinessSlots(toolArgs: Record<string, any>): Record<string, any> {
  const now = new Date();
  const slots: Array<{ start: string; human_readable: string }> = [];
  for (let d = 1; d <= 7 && slots.length < 6; d++) {
    const date = new Date(now); date.setDate(date.getDate() + d);
    const day = date.getDay();
    if (day === 0 || day === 6) continue;
    const times = toolArgs.preferred_time_of_day === 'morning' ? [[10, 0], [11, 0]] : toolArgs.preferred_time_of_day === 'afternoon' ? [[14, 0], [15, 30]] : [[10, 0], [14, 0]];
    for (const [h, m] of times) {
      const d2 = new Date(date); d2.setHours(h!, m!, 0, 0);
      slots.push({ start: d2.toISOString(), human_readable: `${fmtDay(d2)} at ${fmtTime(h!, m!)}` });
    }
  }
  const finalSlots = slots.slice(0, 3);
  return { ok: true, message: `Available times: ${finalSlots.map(s => s.human_readable).join(', or ')}.`, slots: finalSlots };
}

// ═══════════════════════════════════════════════════
// SHARED HELPERS
// ═══════════════════════════════════════════════════

// ── GHL: Search contact by phone, return ID if found ──
async function ghlSearchByPhone(phone: string): Promise<string | null> {
  if (!phone || !GHL_TOKEN) return null;
  try {
    const params = new URLSearchParams({ query: phone, locationId: GHL_LOCATION_ID });
    const resp = await fetch(`https://services.leadconnectorhq.com/contacts/search/duplicate?${params}`, {
      headers: GHL_HEADERS_BASE,
      signal: AbortSignal.timeout(10_000),
    });
    if (resp.ok) {
      const data = await resp.json();
      const contactId = data?.contact?.id;
      if (contactId) {
        console.log(`[ghl-upsert] Found existing contact by phone ${phone}: ${contactId}`);
        return contactId;
      }
    }
  } catch (err: any) {
    console.warn(`[ghl-upsert] Search by phone failed: ${err.message}`);
  }
  return null;
}

// ── GHL: Upsert contact (search by phone first, update if found, create if not) ──
async function ghlUpsert(params: {
  firstName?: string; lastName?: string; email?: string; phone?: string;
  tags?: string[]; source?: string;
  customFields?: Array<{ key: string; field_value: string }>;
  notes?: string[];  // array of note bodies to attach
}): Promise<string | null> {
  if (!GHL_TOKEN || !GHL_LOCATION_ID) {
    console.warn('[ghl-upsert] GHL credentials not set, skipping');
    return null;
  }

  try {
    // 1. Search for existing contact by phone
    let contactId = params.phone ? await ghlSearchByPhone(params.phone) : null;

    if (contactId) {
      // 2a. UPDATE existing contact
      console.log(`[ghl-upsert] Updating existing contact ${contactId}`);
      const updateBody: Record<string, any> = {};
      if (params.firstName) updateBody.firstName = params.firstName;
      if (params.lastName) updateBody.lastName = params.lastName;
      if (params.email) updateBody.email = params.email;
      if (params.tags?.length) updateBody.tags = params.tags;
      if (params.customFields?.length) updateBody.customFields = params.customFields;

      await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}`, {
        method: 'PUT',
        headers: GHL_HEADERS_BASE,
        body: JSON.stringify(updateBody),
        signal: AbortSignal.timeout(10_000),
      }).catch((err) => console.warn(`[ghl-upsert] Update failed: ${err.message}`));
    } else {
      // 2b. CREATE new contact
      console.log(`[ghl-upsert] Creating new contact: ${params.firstName} ${params.lastName}`);
      const createBody: Record<string, any> = {
        firstName: params.firstName || undefined,
        lastName: params.lastName || undefined,
        email: params.email || undefined,
        phone: params.phone || undefined,
        tags: params.tags,
        source: params.source || 'Voxaris AI Agent',
        locationId: GHL_LOCATION_ID,
      };
      if (params.customFields?.length) createBody.customFields = params.customFields;

      const contactRes = await fetch('https://services.leadconnectorhq.com/contacts/', {
        method: 'POST',
        headers: GHL_HEADERS_BASE,
        body: JSON.stringify(createBody),
        signal: AbortSignal.timeout(10_000),
      });
      if (contactRes.ok) {
        contactId = (await contactRes.json())?.contact?.id;
        console.log(`[ghl-upsert] Contact created: ${contactId}`);
      } else {
        const errText = await contactRes.text();
        console.warn(`[ghl-upsert] Create failed ${contactRes.status}: ${errText}`);
        return null;
      }
    }

    // 3. Attach notes
    if (contactId && params.notes?.length) {
      for (const noteBody of params.notes) {
        await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}/notes`, {
          method: 'POST',
          headers: GHL_HEADERS_BASE,
          body: JSON.stringify({ body: noteBody, userId: null }),
          signal: AbortSignal.timeout(10_000),
        }).catch((err) => console.warn(`[ghl-upsert] Note failed: ${err.message}`));
      }
    }

    return contactId;
  } catch (err: any) {
    console.warn(`[ghl-upsert] Failed: ${err.message}`);
    return null;
  }
}

// ── Legacy wrapper for backward compat (uses upsert now) ──
async function ghlPush(params: { firstName?: string; lastName?: string; email?: string; phone?: string; tags?: string[]; note?: string; customFields?: Array<{ key: string; field_value: string }> }) {
  await ghlUpsert({
    ...params,
    notes: params.note ? [params.note] : [],
  });
}

function fmtSlot(date: Date, h: number, m: number): string { const d = new Date(date); d.setHours(h, m, 0, 0); return d.toISOString(); }
function fmtDay(date: Date): string { return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }); }
function fmtTime(h: number, m: number): string { const p = h >= 12 ? 'PM' : 'AM'; return `${h > 12 ? h - 12 : h}:${m.toString().padStart(2, '0')} ${p}`; }

// ── Notify owner via iMessage ──
async function notifyOwner(message: string): Promise<void> {
  if (!SB_KEY || !SB_SECRET) return;
  try {
    await fetch('https://api.sendblue.co/api/send-message', {
      method: 'POST',
      headers: { 'sb-api-key-id': SB_KEY, 'sb-api-secret-key': SB_SECRET, 'Content-Type': 'application/json' },
      body: JSON.stringify({ number: NOTIFY_NUMBER, content: message, from_number: SB_FROM }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch {}
}

// ── Sendblue: Send iMessage/SMS ──
async function sendblueText(number: string, content: string): Promise<void> {
  if (!SB_KEY || !SB_SECRET) return;
  const fromNumber = SB_FROM;
  try {
    const resp = await fetch('https://api.sendblue.co/api/send-message', {
      method: 'POST',
      headers: { 'sb-api-key-id': SB_KEY, 'sb-api-secret-key': SB_SECRET, 'Content-Type': 'application/json', 'User-Agent': 'Voxaris/1.0' },
      body: JSON.stringify({ number, content, from_number: fromNumber }),
      signal: AbortSignal.timeout(10_000),
    });
    const data = await resp.json();
    console.log(`Sendblue text to ${number}: ${data.status || 'sent'}`);
  } catch (err: any) {
    console.warn(`Sendblue failed: ${err.message}`);
  }
}
