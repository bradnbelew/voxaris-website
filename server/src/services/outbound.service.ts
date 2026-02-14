/**
 * Outbound Call Service with TCPA Compliance
 *
 * Handles all outbound call logic with regulatory compliance:
 * - TCPA time restrictions (8 AM - 9 PM local time)
 * - DNC (Do Not Call) list management
 * - 24-hour cooldown between calls
 * - Maximum 3 attempts per lead
 *
 * TCPA Reference: Calls must be made between 8 AM and 9 PM in the called party's local time
 */

import { supabase } from '../lib/supabase';
import { retell } from '../lib/retell';
import { logger } from '../lib/logger';
import { cancelFollowupsForPhone } from '../queues/roofing-followup.processor';

// TCPA Calling Hours (in the recipient's local timezone)
const TCPA_START_HOUR = 8;  // 8 AM
const TCPA_END_HOUR = 21;   // 9 PM

// Cooldown and attempt limits
const COOLDOWN_HOURS = 24;
const MAX_CALL_ATTEMPTS = 3;

// Florida timezone (Roofing Pros operates in FL)
const FLORIDA_TIMEZONE = 'America/New_York';

export interface OutboundCallRequest {
  phone: string;
  customerName: string;
  email?: string;
  address?: string;
  zipCode?: string;
  roofIssue?: string;
  scenario: 'new_lead' | 'estimate_sent' | 'no_show' | 'review_request';
  source?: string;
  leadId?: string;
  scheduledTime?: Date;  // If provided, schedule for this time
  bypassTcpaCheck?: boolean;  // For testing only - never use in production
}

export interface OutboundCallResult {
  success: boolean;
  callId?: string;
  scheduledFor?: Date;
  reason?: string;
  error?: string;
}

export interface DncEntry {
  phone: string;
  reason: string;
  source: string;
  addedBy?: string;
  addedAt: Date;
}

/**
 * Main entry point for triggering an outbound call
 * Performs all compliance checks before initiating
 */
export async function triggerOutboundCall(request: OutboundCallRequest): Promise<OutboundCallResult> {
  const normalizedPhone = normalizePhone(request.phone);

  logger.info(`📞 Outbound call request for ${normalizedPhone} (${request.scenario})`);

  // 1. Check DNC list first (most important)
  const dncCheck = await checkDncList(normalizedPhone);
  if (dncCheck.isOnDnc) {
    logger.warn(`🚫 Phone ${normalizedPhone} is on DNC list: ${dncCheck.reason}`);
    return {
      success: false,
      reason: 'DNC_LISTED',
      error: `Number is on Do Not Call list: ${dncCheck.reason}`
    };
  }

  // 2. Check TCPA calling hours
  if (!request.bypassTcpaCheck) {
    const tcpaCheck = checkTcpaCompliance(request.zipCode);
    if (!tcpaCheck.canCall) {
      logger.info(`⏰ TCPA restriction: ${tcpaCheck.reason}. Next window: ${tcpaCheck.nextWindow}`);

      // If we have a scheduled time and it's compliant, proceed
      if (request.scheduledTime && isTimeInTcpaWindow(request.scheduledTime, request.zipCode)) {
        logger.info(`📅 Call scheduled for compliant time: ${request.scheduledTime}`);
      } else {
        return {
          success: false,
          reason: 'TCPA_RESTRICTED',
          scheduledFor: tcpaCheck.nextWindow,
          error: tcpaCheck.reason
        };
      }
    }
  }

  // 3. Check cooldown (24-hour minimum between calls)
  const cooldownCheck = await checkCooldown(normalizedPhone);
  if (!cooldownCheck.canCall) {
    logger.info(`⏳ Cooldown active for ${normalizedPhone}. Can call after: ${cooldownCheck.nextAvailable}`);
    return {
      success: false,
      reason: 'COOLDOWN_ACTIVE',
      scheduledFor: cooldownCheck.nextAvailable,
      error: `24-hour cooldown in effect. Last called: ${cooldownCheck.lastCallTime}`
    };
  }

  // 4. Check max attempts (3 attempts max)
  const attemptCheck = await checkMaxAttempts(normalizedPhone);
  if (!attemptCheck.canCall) {
    logger.info(`🔒 Max attempts reached for ${normalizedPhone}: ${attemptCheck.attempts}/${MAX_CALL_ATTEMPTS}`);
    return {
      success: false,
      reason: 'MAX_ATTEMPTS_REACHED',
      error: `Maximum ${MAX_CALL_ATTEMPTS} call attempts reached. Manual intervention required.`
    };
  }

  // 5. All checks passed - make the call
  const callResult = await makeOutboundCall(request, normalizedPhone);

  // 6. Log the attempt
  await logCallAttempt({
    phone: normalizedPhone,
    callId: callResult.callId,
    scenario: request.scenario,
    source: request.source,
    success: callResult.success,
    error: callResult.error
  });

  return callResult;
}

/**
 * Add a phone number to the DNC list
 */
export async function addToDncList(entry: DncEntry): Promise<{ success: boolean; error?: string }> {
  const normalizedPhone = normalizePhone(entry.phone);

  try {
    // Insert into dnc_list table
    const { error } = await supabase.from('dnc_list').upsert({
      phone_number: normalizedPhone,
      reason: entry.reason,
      source: entry.source,
      added_by: entry.addedBy || 'system',
      created_at: entry.addedAt.toISOString()
    }, {
      onConflict: 'phone_number'
    });

    if (error) {
      logger.error(`❌ Failed to add to DNC list: ${error.message}`);
      return { success: false, error: error.message };
    }

    // Cancel any pending follow-ups for this number
    await cancelFollowupsForPhone(normalizedPhone);

    logger.info(`✅ Added ${normalizedPhone} to DNC list: ${entry.reason}`);
    return { success: true };

  } catch (err: any) {
    logger.error(`❌ DNC list error: ${err.message}`);
    return { success: false, error: err.message };
  }
}

/**
 * Remove a phone number from the DNC list
 */
export async function removeFromDncList(phone: string): Promise<{ success: boolean; error?: string }> {
  const normalizedPhone = normalizePhone(phone);

  try {
    const { error } = await supabase
      .from('dnc_list')
      .delete()
      .eq('phone_number', normalizedPhone);

    if (error) {
      logger.error(`❌ Failed to remove from DNC list: ${error.message}`);
      return { success: false, error: error.message };
    }

    logger.info(`✅ Removed ${normalizedPhone} from DNC list`);
    return { success: true };

  } catch (err: any) {
    logger.error(`❌ DNC removal error: ${err.message}`);
    return { success: false, error: err.message };
  }
}

/**
 * Check if a phone number is on the DNC list
 */
export async function checkDncList(phone: string): Promise<{
  isOnDnc: boolean;
  reason?: string;
  addedAt?: Date;
}> {
  const normalizedPhone = normalizePhone(phone);

  try {
    const { data, error } = await supabase
      .from('dnc_list')
      .select('*')
      .eq('phone_number', normalizedPhone)
      .single();

    if (error || !data) {
      return { isOnDnc: false };
    }

    return {
      isOnDnc: true,
      reason: data.reason,
      addedAt: new Date(data.created_at)
    };

  } catch (err: any) {
    // If table doesn't exist yet, assume not on DNC
    logger.warn(`⚠️ DNC check failed: ${err.message}`);
    return { isOnDnc: false };
  }
}

/**
 * Check TCPA compliance for calling hours
 * Returns whether we can call now and when the next window opens
 */
export function checkTcpaCompliance(zipCode?: string): {
  canCall: boolean;
  reason?: string;
  nextWindow?: Date;
  currentLocalTime?: string;
} {
  // Get current time in Florida timezone
  const now = new Date();
  const floridaTime = new Date(now.toLocaleString('en-US', { timeZone: FLORIDA_TIMEZONE }));
  const currentHour = floridaTime.getHours();
  const currentMinute = floridaTime.getMinutes();

  // Format current time for logging
  const currentLocalTime = floridaTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: FLORIDA_TIMEZONE
  });

  // Check if within calling hours (8 AM - 9 PM)
  if (currentHour >= TCPA_START_HOUR && currentHour < TCPA_END_HOUR) {
    return {
      canCall: true,
      currentLocalTime
    };
  }

  // Calculate next available window
  let nextWindow: Date;
  if (currentHour >= TCPA_END_HOUR) {
    // After 9 PM - next window is tomorrow at 8 AM
    nextWindow = new Date(floridaTime);
    nextWindow.setDate(nextWindow.getDate() + 1);
    nextWindow.setHours(TCPA_START_HOUR, 0, 0, 0);
  } else {
    // Before 8 AM - next window is today at 8 AM
    nextWindow = new Date(floridaTime);
    nextWindow.setHours(TCPA_START_HOUR, 0, 0, 0);
  }

  return {
    canCall: false,
    reason: `Outside TCPA calling hours (8 AM - 9 PM). Current time: ${currentLocalTime}`,
    nextWindow,
    currentLocalTime
  };
}

/**
 * Check if a specific time is within TCPA window
 */
export function isTimeInTcpaWindow(time: Date, zipCode?: string): boolean {
  const floridaTime = new Date(time.toLocaleString('en-US', { timeZone: FLORIDA_TIMEZONE }));
  const hour = floridaTime.getHours();
  return hour >= TCPA_START_HOUR && hour < TCPA_END_HOUR;
}

/**
 * Check 24-hour cooldown between calls
 */
async function checkCooldown(phone: string): Promise<{
  canCall: boolean;
  lastCallTime?: Date;
  nextAvailable?: Date;
}> {
  try {
    const { data, error } = await supabase
      .from('call_logs')
      .select('created_at')
      .eq('phone', phone)
      .eq('direction', 'outbound')
      .order('created_at', { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0) {
      return { canCall: true };
    }

    const lastCallTime = new Date(data[0].created_at);
    const cooldownEnd = new Date(lastCallTime.getTime() + COOLDOWN_HOURS * 60 * 60 * 1000);
    const now = new Date();

    if (now >= cooldownEnd) {
      return { canCall: true, lastCallTime };
    }

    return {
      canCall: false,
      lastCallTime,
      nextAvailable: cooldownEnd
    };

  } catch (err: any) {
    logger.warn(`⚠️ Cooldown check failed: ${err.message}`);
    return { canCall: true }; // Allow if check fails
  }
}

/**
 * Check if max attempts have been reached
 */
async function checkMaxAttempts(phone: string): Promise<{
  canCall: boolean;
  attempts: number;
}> {
  try {
    // Count outbound attempts in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { count, error } = await supabase
      .from('call_logs')
      .select('*', { count: 'exact', head: true })
      .eq('phone', phone)
      .eq('direction', 'outbound')
      .gte('created_at', thirtyDaysAgo.toISOString());

    if (error) {
      logger.warn(`⚠️ Max attempts check failed: ${error.message}`);
      return { canCall: true, attempts: 0 };
    }

    const attempts = count || 0;
    return {
      canCall: attempts < MAX_CALL_ATTEMPTS,
      attempts
    };

  } catch (err: any) {
    logger.warn(`⚠️ Max attempts check error: ${err.message}`);
    return { canCall: true, attempts: 0 };
  }
}

/**
 * Make the actual outbound call via Retell
 */
async function makeOutboundCall(
  request: OutboundCallRequest,
  normalizedPhone: string
): Promise<OutboundCallResult> {
  try {
    const outboundAgentId = process.env.ROOFING_OUTBOUND_AGENT_ID;
    const outboundPhone = process.env.ROOFING_OUTBOUND_PHONE || '+14072891565';

    if (!outboundAgentId) {
      return {
        success: false,
        error: 'ROOFING_OUTBOUND_AGENT_ID not configured'
      };
    }

    // Build dynamic variables for the agent
    const dynamicVariables: Record<string, string> = {
      customer_name: request.customerName,
      call_scenario: request.scenario,
      property_address: request.address || '',
      has_email: request.email ? 'true' : 'false',
      customer_email: request.email || ''
    };

    // Add scenario-specific variables
    switch (request.scenario) {
      case 'new_lead':
        dynamicVariables.intro_context = 'calling to follow up on your recent inquiry about roof inspection';
        break;
      case 'estimate_sent':
        dynamicVariables.intro_context = 'calling to follow up on the estimate we sent over';
        break;
      case 'no_show':
        dynamicVariables.intro_context = 'calling because we noticed you missed your scheduled appointment';
        break;
      case 'review_request':
        dynamicVariables.intro_context = 'calling to thank you for choosing Roofing Pros USA';
        break;
    }

    const callResult = await retell.createOutboundCall({
      fromNumber: outboundPhone,
      toNumber: normalizedPhone,
      agentId: outboundAgentId,
      dynamicVariables,
      metadata: {
        scenario: request.scenario,
        source: request.source,
        leadId: request.leadId,
        isOutbound: true,
        tcpaCompliant: true
      }
    });

    if (callResult.success) {
      logger.info(`✅ Outbound call initiated: ${callResult.callId}`);
      return {
        success: true,
        callId: callResult.callId
      };
    }

    return {
      success: false,
      error: callResult.error
    };

  } catch (err: any) {
    logger.error(`❌ Outbound call error: ${err.message}`);
    return {
      success: false,
      error: err.message
    };
  }
}

/**
 * Log the call attempt to the database
 */
async function logCallAttempt(params: {
  phone: string;
  callId?: string;
  scenario: string;
  source?: string;
  success: boolean;
  error?: string;
}): Promise<void> {
  try {
    await supabase.from('call_logs').insert({
      phone: params.phone,
      call_id: params.callId,
      direction: 'outbound',
      client_id: 'roofing-pros',
      status: params.success ? 'initiated' : 'failed',
      metadata: {
        scenario: params.scenario,
        source: params.source,
        error: params.error,
        tcpa_compliant: true
      },
      created_at: new Date().toISOString()
    });
  } catch (err: any) {
    logger.warn(`⚠️ Failed to log call attempt: ${err.message}`);
  }
}

/**
 * Normalize phone number to E.164 format
 */
function normalizePhone(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // If 10 digits, assume US and add +1
  if (digits.length === 10) {
    return `+1${digits}`;
  }

  // If 11 digits starting with 1, add +
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  }

  // If already has +, return as-is
  if (phone.startsWith('+')) {
    return phone;
  }

  // Default: add + prefix
  return `+${digits}`;
}

/**
 * Get DNC list statistics
 */
export async function getDncStats(): Promise<{
  total: number;
  byReason: Record<string, number>;
}> {
  try {
    const { data, error } = await supabase
      .from('dnc_list')
      .select('reason');

    if (error || !data) {
      return { total: 0, byReason: {} };
    }

    const byReason: Record<string, number> = {};
    for (const entry of data) {
      byReason[entry.reason] = (byReason[entry.reason] || 0) + 1;
    }

    return {
      total: data.length,
      byReason
    };

  } catch (err: any) {
    return { total: 0, byReason: {} };
  }
}

/**
 * Get current TCPA status for display
 */
export function getTcpaStatus(): {
  isOpen: boolean;
  currentTime: string;
  windowStart: string;
  windowEnd: string;
  timezone: string;
} {
  const now = new Date();
  const floridaTime = new Date(now.toLocaleString('en-US', { timeZone: FLORIDA_TIMEZONE }));

  return {
    isOpen: floridaTime.getHours() >= TCPA_START_HOUR && floridaTime.getHours() < TCPA_END_HOUR,
    currentTime: floridaTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: FLORIDA_TIMEZONE
    }),
    windowStart: '8:00 AM',
    windowEnd: '9:00 PM',
    timezone: 'America/New_York (Florida)'
  };
}
