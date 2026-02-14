/**
 * Cal.com Integration Library
 *
 * Provides calendar availability checking and booking functionality
 * for the Roofing Pros USA voice agents.
 *
 * Uses Cal.com's API for real-time slot availability.
 */

import { logger } from './logger';

const CAL_API_KEY = process.env.CAL_API_KEY;
const CAL_API_URL = process.env.CAL_API_URL || 'https://api.cal.com/v1';
const CAL_EVENT_TYPE_ID = process.env.CAL_EVENT_TYPE_ID; // Roof inspection event type

interface TimeSlot {
  time: string;      // ISO datetime
  available: boolean;
}

interface AvailabilityResponse {
  slots: TimeSlot[];
  dateRange: {
    start: string;
    end: string;
  };
}

interface BookingRequest {
  eventTypeId: number;
  start: string;           // ISO datetime
  end: string;             // ISO datetime
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  location?: string;
  metadata?: Record<string, any>;
}

interface BookingResponse {
  id: number;
  uid: string;
  title: string;
  startTime: string;
  endTime: string;
  status: string;
  attendees: Array<{
    name: string;
    email: string;
  }>;
}

/**
 * Check availability for roof inspections
 *
 * Used by Retell agents via the check_availability_cal preset function
 */
export async function checkAvailability(
  dateFrom: string,
  dateTo: string,
  eventTypeId?: number
): Promise<AvailabilityResponse> {
  if (!CAL_API_KEY) {
    logger.warn('⚠️ CAL_API_KEY not configured, returning mock availability');
    return getMockAvailability(dateFrom, dateTo);
  }

  try {
    const typeId = eventTypeId || parseInt(CAL_EVENT_TYPE_ID || '0');

    const response = await fetch(
      `${CAL_API_URL}/availability?` +
      `apiKey=${CAL_API_KEY}&` +
      `eventTypeId=${typeId}&` +
      `dateFrom=${dateFrom}&` +
      `dateTo=${dateTo}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      logger.error(`Cal.com availability error: ${error}`);
      throw new Error(`Cal.com API error: ${response.status}`);
    }

    const data = await response.json();

    logger.info(`📅 Cal.com availability: ${data.slots?.length || 0} slots found`);

    return {
      slots: data.slots || [],
      dateRange: {
        start: dateFrom,
        end: dateTo,
      },
    };
  } catch (error: any) {
    logger.error(`Cal.com availability error: ${error.message}`);
    throw error;
  }
}

/**
 * Book an appointment via Cal.com
 *
 * Used by Retell agents via the book_appointment_cal preset function
 */
export async function bookAppointment(
  booking: BookingRequest
): Promise<BookingResponse> {
  if (!CAL_API_KEY) {
    logger.warn('⚠️ CAL_API_KEY not configured, returning mock booking');
    return getMockBooking(booking);
  }

  try {
    const response = await fetch(
      `${CAL_API_URL}/bookings?apiKey=${CAL_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventTypeId: booking.eventTypeId || parseInt(CAL_EVENT_TYPE_ID || '0'),
          start: booking.start,
          end: booking.end,
          responses: {
            name: booking.name,
            email: booking.email,
            phone: booking.phone,
            notes: booking.notes,
            location: booking.location || 'On-site inspection',
          },
          metadata: {
            ...booking.metadata,
            source: 'retell_voice_agent',
            booked_at: new Date().toISOString(),
          },
          timeZone: 'America/New_York', // Florida timezone
          language: 'en',
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      logger.error(`Cal.com booking error: ${error}`);
      throw new Error(`Cal.com booking failed: ${response.status}`);
    }

    const data = await response.json();

    logger.info(`✅ Cal.com booking created: ${data.uid}`);

    return {
      id: data.id,
      uid: data.uid,
      title: data.title,
      startTime: data.startTime,
      endTime: data.endTime,
      status: data.status,
      attendees: data.attendees,
    };
  } catch (error: any) {
    logger.error(`Cal.com booking error: ${error.message}`);
    throw error;
  }
}

/**
 * Cancel a Cal.com booking
 */
export async function cancelBooking(
  bookingId: number,
  reason?: string
): Promise<boolean> {
  if (!CAL_API_KEY) {
    logger.warn('⚠️ CAL_API_KEY not configured');
    return true;
  }

  try {
    const response = await fetch(
      `${CAL_API_URL}/bookings/${bookingId}?apiKey=${CAL_API_KEY}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cancellationReason: reason || 'Cancelled via voice agent',
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      logger.error(`Cal.com cancel error: ${error}`);
      return false;
    }

    logger.info(`✅ Cal.com booking ${bookingId} cancelled`);
    return true;
  } catch (error: any) {
    logger.error(`Cal.com cancel error: ${error.message}`);
    return false;
  }
}

/**
 * Reschedule a Cal.com booking
 */
export async function rescheduleBooking(
  bookingUid: string,
  newStart: string,
  newEnd: string,
  reason?: string
): Promise<BookingResponse | null> {
  if (!CAL_API_KEY) {
    logger.warn('⚠️ CAL_API_KEY not configured');
    return null;
  }

  try {
    const response = await fetch(
      `${CAL_API_URL}/bookings/${bookingUid}/reschedule?apiKey=${CAL_API_KEY}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          start: newStart,
          end: newEnd,
          rescheduleReason: reason || 'Rescheduled via voice agent',
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      logger.error(`Cal.com reschedule error: ${error}`);
      return null;
    }

    const data = await response.json();
    logger.info(`✅ Cal.com booking rescheduled: ${data.uid}`);

    return data;
  } catch (error: any) {
    logger.error(`Cal.com reschedule error: ${error.message}`);
    return null;
  }
}

/**
 * Get upcoming bookings for a phone number
 */
export async function getBookingsForPhone(phone: string): Promise<BookingResponse[]> {
  if (!CAL_API_KEY) {
    logger.warn('⚠️ CAL_API_KEY not configured');
    return [];
  }

  try {
    // Cal.com doesn't have direct phone lookup, search by metadata
    const response = await fetch(
      `${CAL_API_URL}/bookings?apiKey=${CAL_API_KEY}&status=upcoming`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    // Filter by phone in metadata or responses
    const bookings = (data.bookings || []).filter((b: any) =>
      b.metadata?.phone === phone ||
      b.responses?.phone === phone
    );

    return bookings;
  } catch (error: any) {
    logger.error(`Cal.com lookup error: ${error.message}`);
    return [];
  }
}

// ============================================================================
// MOCK DATA (for development without Cal.com API key)
// ============================================================================

function getMockAvailability(dateFrom: string, dateTo: string): AvailabilityResponse {
  const slots: TimeSlot[] = [];
  const start = new Date(dateFrom);
  const end = new Date(dateTo);

  // Generate mock slots for each day
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay();

    // Skip weekends
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    // Morning slots (9 AM, 10 AM, 11 AM)
    for (let hour = 9; hour <= 11; hour++) {
      const slotTime = new Date(d);
      slotTime.setHours(hour, 0, 0, 0);
      slots.push({
        time: slotTime.toISOString(),
        available: Math.random() > 0.3, // 70% availability
      });
    }

    // Afternoon slots (1 PM, 2 PM, 3 PM, 4 PM)
    for (let hour = 13; hour <= 16; hour++) {
      const slotTime = new Date(d);
      slotTime.setHours(hour, 0, 0, 0);
      slots.push({
        time: slotTime.toISOString(),
        available: Math.random() > 0.3,
      });
    }
  }

  return {
    slots,
    dateRange: { start: dateFrom, end: dateTo },
  };
}

function getMockBooking(booking: BookingRequest): BookingResponse {
  return {
    id: Math.floor(Math.random() * 100000),
    uid: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: 'Roof Inspection - Roofing Pros USA',
    startTime: booking.start,
    endTime: booking.end,
    status: 'ACCEPTED',
    attendees: [
      {
        name: booking.name,
        email: booking.email,
      },
    ],
  };
}

export default {
  checkAvailability,
  bookAppointment,
  cancelBooking,
  rescheduleBooking,
  getBookingsForPhone,
};
