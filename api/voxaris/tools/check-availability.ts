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
function parseDateRange(requested: string): { startDate: string; endDate: string } {
  const now = new Date();
  let target = new Date(now);

  const lower = (requested || '').toLowerCase().trim();

  if (lower === 'today') {
    // keep target as today
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
    // Return rest of the week
    const endOfWeek = new Date(now);
    const daysUntilSunday = 7 - endOfWeek.getDay();
    endOfWeek.setDate(endOfWeek.getDate() + daysUntilSunday);
    return {
      startDate: now.toISOString().split('T')[0]!,
      endDate: endOfWeek.toISOString().split('T')[0]!,
    };
  } else if (lower.includes('next week')) {
    const startNext = new Date(now);
    const daysUntilMonday = (8 - startNext.getDay()) % 7 || 7;
    startNext.setDate(startNext.getDate() + daysUntilMonday);
    const endNext = new Date(startNext);
    endNext.setDate(endNext.getDate() + 6);
    return {
      startDate: startNext.toISOString().split('T')[0]!,
      endDate: endNext.toISOString().split('T')[0]!,
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

  const dateStr = target.toISOString().split('T')[0]!;
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

    // Filter by time preference
    return filterByPreference(allSlots, timePref).slice(0, 5);
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

function filterByPreference(slots: string[], pref: string): string[] {
  const lower = (pref || '').toLowerCase();
  if (lower === 'morning') {
    return slots.filter((s) => {
      const hourMatch = s.match(/(\d{1,2})(?::|\s)/);
      if (!hourMatch) return true;
      const h = parseInt(hourMatch[1]!, 10);
      const isPM = s.toLowerCase().includes('pm');
      const hour24 = isPM && h !== 12 ? h + 12 : h;
      return hour24 < 12;
    });
  }
  if (lower === 'afternoon') {
    return slots.filter((s) => {
      const hourMatch = s.match(/(\d{1,2})(?::|\s)/);
      if (!hourMatch) return true;
      const h = parseInt(hourMatch[1]!, 10);
      const isPM = s.toLowerCase().includes('pm');
      const hour24 = isPM && h !== 12 ? h + 12 : h;
      return hour24 >= 12;
    });
  }
  return slots; // "anytime" or unrecognized
}

// ── Fallback: generate slots from dealership hours ──
function buildDefaultSlots(startDate: string, endDate: string, timePref: string): string[] {
  const slots: string[] = [];
  const start = new Date(startDate + 'T00:00:00');
  const end = new Date(endDate + 'T23:59:59');

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay();
    const dayName = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    if (dayOfWeek === 0) {
      // Sunday: 11AM-6PM
      slots.push(`${dayName} at 11:00 AM`, `${dayName} at 1:00 PM`, `${dayName} at 3:00 PM`);
    } else {
      // Mon-Sat: 9AM-8PM
      slots.push(
        `${dayName} at 9:00 AM`,
        `${dayName} at 10:30 AM`,
        `${dayName} at 1:00 PM`,
        `${dayName} at 3:00 PM`,
        `${dayName} at 5:00 PM`,
      );
    }
  }

  return filterByPreference(slots, timePref).slice(0, 5);
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
      result = `I don't see any open slots for ${requested}. Would another day work for you?`;
    } else if (slots.length === 1) {
      result = `I have one slot available: ${slots[0]}. Want me to lock that in for you?`;
    } else {
      const slotList = slots.slice(0, 3).join(', or ');
      result = `I have a few options: ${slotList}. Which one works best for you?`;
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
