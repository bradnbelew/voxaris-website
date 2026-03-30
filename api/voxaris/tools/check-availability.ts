import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * POST /api/voxaris/tools/check-availability
 *
 * Tavus CVI tool handler — called when the AI agent needs to check
 * available appointment slots for the customer.
 *
 * Queries GHL calendar for open slots within the requested date range,
 * then returns a human-friendly summary that Sofia speaks aloud.
 */

// GHL credentials
const GHL_TOKEN = process.env.GHL_ACCESS_TOKEN || '';
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID || '';
const GHL_CALENDAR_ID = process.env.GHL_CALENDAR_ID || '7UjfYF1nnbxPID4qINbH';
const GHL_WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/euXH15G0pqPgr497kAL2/webhook-trigger/6730dcb6-748c-4323-a525-65b972384f7a';

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_HEADERS = {
  Authorization: `Bearer ${GHL_TOKEN}`,
  Version: '2021-07-28',
  'Content-Type': 'application/json',
};

// ── Fire GHL inbound webhook (master workflow trigger) ──
async function fireGhlWebhook(payload: Record<string, any>): Promise<void> {
  try {
    await fetch(GHL_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, timestamp: new Date().toISOString(), location_id: GHL_LOCATION_ID }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch {}
}

interface CheckAvailabilityProps {
  requested_date: string;   // e.g. "tomorrow", "Thursday", "2026-03-25"
  time_preference: string;  // e.g. "morning", "afternoon", "anytime"
}

// ── Parse a natural-language date into a start/end ISO range ──
// Get today's date string in ET (YYYY-MM-DD)
function todayET(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' }); // en-CA = YYYY-MM-DD
}

// Get a Date object anchored to ET "today" at midnight
function etNow(): Date {
  const dateStr = todayET(); // e.g. "2026-03-30"
  return new Date(dateStr + 'T12:00:00'); // noon to avoid DST edge cases
}

function parseDateRange(requested: string): { startDate: string; endDate: string } {
  const today = todayET();
  let target = new Date(today + 'T12:00:00');

  const lower = (requested || '').toLowerCase().trim();

  if (lower === 'today') {
    // Start today, include tomorrow as fallback in case today's slots passed
    const endTarget = new Date(target);
    endTarget.setDate(endTarget.getDate() + 1);
    return {
      startDate: today,
      endDate: endTarget.toLocaleDateString('en-CA', { timeZone: 'America/New_York' }),
    };
  } else if (lower === 'tomorrow') {
    target.setDate(target.getDate() + 1);
  } else if (['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].includes(lower)) {
    const dayMap: Record<string, number> = {
      sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
      thursday: 4, friday: 5, saturday: 6,
    };
    const targetDay = dayMap[lower]!;
    const currentDay = target.getDay();
    let daysAhead = targetDay - currentDay;
    if (daysAhead <= 0) daysAhead += 7;
    target.setDate(target.getDate() + daysAhead);
  } else if (lower.includes('this week')) {
    const endOfWeek = new Date(target);
    const daysUntilSunday = 7 - endOfWeek.getDay();
    endOfWeek.setDate(endOfWeek.getDate() + daysUntilSunday);
    return {
      startDate: today,
      endDate: endOfWeek.toLocaleDateString('en-CA', { timeZone: 'America/New_York' }),
    };
  } else if (lower.includes('next week')) {
    const startNext = new Date(target);
    const daysUntilMonday = (8 - startNext.getDay()) % 7 || 7;
    startNext.setDate(startNext.getDate() + daysUntilMonday);
    const endNext = new Date(startNext);
    endNext.setDate(endNext.getDate() + 6);
    return {
      startDate: startNext.toLocaleDateString('en-CA', { timeZone: 'America/New_York' }),
      endDate: endNext.toLocaleDateString('en-CA', { timeZone: 'America/New_York' }),
    };
  } else {
    // Try parsing as a date string — guard against bogus parses (e.g. epoch)
    const parsed = new Date(requested);
    if (!isNaN(parsed.getTime()) && parsed.getFullYear() >= 2024) {
      target = parsed;
    } else {
      // Fallback: tomorrow
      target.setDate(target.getDate() + 1);
    }
  }

  const dateStr = target.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
  return { startDate: dateStr, endDate: dateStr };
}

// ── Query GHL calendar for available slots ──
async function getAvailableSlots(
  startDate: string,
  endDate: string,
  timePref: string,
): Promise<string[]> {
  if (!GHL_TOKEN || !GHL_LOCATION_ID) {
    console.warn('[check-availability] GHL credentials not set');
    return [];
  }

  const calendarId = GHL_CALENDAR_ID;
  if (!calendarId) {
    console.warn('[check-availability] GHL_CALENDAR_ID not set, returning dealership hours');
    return buildDefaultSlots(startDate, endDate, timePref);
  }

  try {
    // GHL free slots endpoint
    const params = new URLSearchParams({
      calendarId,
      startDate: `${startDate}T00:00:00Z`,
      endDate: `${endDate}T23:59:59Z`,
      timezone: 'America/New_York',
    });

    const resp = await fetch(`${GHL_BASE}/calendars/${calendarId}/free-slots?${params}`, {
      headers: GHL_HEADERS,
      signal: AbortSignal.timeout(10_000),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      console.warn(`[check-availability] GHL free-slots failed ${resp.status}: ${errText}`);
      return buildDefaultSlots(startDate, endDate, timePref);
    }

    const data = await resp.json();

    // GHL returns slots keyed by date
    const allSlots: string[] = [];
    const slotsByDate = data?.slots || data || {};

    for (const [date, slots] of Object.entries(slotsByDate)) {
      if (!Array.isArray(slots)) continue;
      for (const slot of slots) {
        const time = slot.startTime || slot;
        if (typeof time === 'string') {
          allSlots.push(formatSlot(date, time, timePref));
        }
      }
    }

    // Pick 1 morning + 1 afternoon, same-day first
    return pickTwoSlots(allSlots, startDate);
  } catch (err: any) {
    console.warn(`[check-availability] GHL query failed: ${err.message}`);
    return buildDefaultSlots(startDate, endDate, timePref);
  }
}

function formatSlot(date: string, time: string, _pref: string): string {
  try {
    const dt = new Date(time);
    if (isNaN(dt.getTime())) return time;
    return dt.toLocaleString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'America/New_York',
    });
  } catch {
    return `${date} at ${time}`;
  }
}

function getHour24(slot: string): number {
  const hourMatch = slot.match(/(\d{1,2})(?::|\s)/);
  if (!hourMatch) return 12;
  const h = parseInt(hourMatch[1]!, 10);
  const isPM = slot.toLowerCase().includes('pm');
  if (isPM && h !== 12) return h + 12;
  if (!isPM && h === 12) return 0;
  return h;
}

function isMorning(slot: string): boolean { return getHour24(slot) < 12; }

function pickTwoSlots(slots: string[], preferDate: string): string[] {
  // Separate morning and afternoon slots
  const morning = slots.filter(isMorning);
  const afternoon = slots.filter((s) => !isMorning(s));
  const picked: string[] = [];

  // Pick 1 morning slot (prefer same-day / earliest)
  if (morning.length > 0) picked.push(morning[0]!);
  // Pick 1 afternoon slot
  if (afternoon.length > 0) picked.push(afternoon[0]!);

  // If only morning or only afternoon available, just return the 1
  // (don't pad with extras — agent will ask what else works)
  if (picked.length === 0 && slots.length > 0) {
    picked.push(slots[0]!);
  }

  return picked;
}

// ── Current time in Orlando (ET) ──
function nowET(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
}

// ── Fallback: generate slots from dealership hours ──
function buildDefaultSlots(startDate: string, endDate: string, timePref: string): string[] {
  const slots: string[] = [];
  const start = new Date(startDate + 'T12:00:00'); // noon UTC avoids ET day-rollback
  const end = new Date(endDate + 'T12:00:00');
  const now = nowET();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  const todayStr = todayET();

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay();
    const dateStr = d.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
    const isToday = dateStr === todayStr;
    const dayName = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'America/New_York' });

    // Build candidate slots for this day
    const candidates: { label: string; hour: number }[] = [];
    if (dayOfWeek === 0) {
      // Sunday: 11AM-6PM
      candidates.push({ label: `${dayName} at 11:00 AM`, hour: 11 });
      candidates.push({ label: `${dayName} at 2:00 PM`, hour: 14 });
    } else {
      // Mon-Sat: 9AM-8PM
      candidates.push({ label: `${dayName} at 10:00 AM`, hour: 10 });
      candidates.push({ label: `${dayName} at 2:00 PM`, hour: 14 });
    }

    // If today, only keep slots at least 1 hour from now
    for (const c of candidates) {
      if (isToday && (c.hour <= currentHour || (c.hour === currentHour + 1 && currentMinutes > 30))) {
        continue; // slot already passed or too soon
      }
      slots.push(c.label);
    }

    // Once we have 2 slots, stop
    if (slots.length >= 2) break;
  }

  // If today had no valid slots, we'll have grabbed tomorrow's
  return slots.slice(0, 2);
}

// ── Main handler ──
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { tool_call_id, conversation_id, properties } = req.body || {};

    console.log(`[check-availability] Tool call received — tool_call_id=${tool_call_id}, conversation_id=${conversation_id}`);

    const props = (properties || {}) as CheckAvailabilityProps;
    const requested = props.requested_date || 'tomorrow';
    const timePref = props.time_preference || 'anytime';

    const { startDate, endDate } = parseDateRange(requested);
    const slots = await getAvailableSlots(startDate, endDate, timePref);

    let result: string;
    if (slots.length === 0) {
      result = `Nothing open for ${requested}. Ask the customer what day works better for them.`;
    } else if (slots.length === 1) {
      result = `One slot open: ${slots[0]}. Offer this to the customer.`;
    } else {
      result = `Two times available: ${slots[0]} or ${slots[1]}. Offer both and let the customer pick. If neither works, ask what day and time is better for them.`;
    }

    // Fire webhook for availability check tracking (fire-and-forget)
    fireGhlWebhook({
      event_type: 'availability_checked',
      requested_date: requested,
      time_preference: timePref,
      slots_found: slots.length,
      conversation_id: conversation_id || '',
      source: 'tavus_tool_call',
    }).catch(() => {});

    return res.status(200).json({
      tool_call_id: tool_call_id || '',
      result,
    });
  } catch (err: any) {
    console.error(`[check-availability] Handler error: ${err.message}`);
    return res.status(200).json({
      tool_call_id: req.body?.tool_call_id || '',
      result: "We're open Monday through Saturday 9 to 8, and Sunday 11 to 6. What day works best for you?",
    });
  }
}
