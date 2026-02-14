/**
 * Cal.com Webhook Handler for Roofing Pros USA
 *
 * Receives booking events from Cal.com and syncs to:
 * - Supabase (leads table)
 * - GHL (contact + pipeline update)
 * - Slack (notifications)
 *
 * Webhook events handled:
 * - BOOKING_CREATED: New inspection scheduled
 * - BOOKING_RESCHEDULED: Inspection time changed
 * - BOOKING_CANCELLED: Inspection cancelled
 */

import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { logger } from '../../lib/logger';
import { supabase } from '../../lib/supabase';
import { ghl } from '../../lib/ghl';
import slack from '../../lib/slack';
import { cancelFollowupsForPhone } from '../../queues/roofing-followup.processor';

const router = Router();

const CAL_WEBHOOK_SECRET = process.env.CAL_WEBHOOK_SECRET;

// ============================================================================
// WEBHOOK SIGNATURE VERIFICATION
// ============================================================================

function verifyCalWebhookSignature(
  payload: string,
  signature: string | undefined
): boolean {
  if (!CAL_WEBHOOK_SECRET) {
    logger.warn('⚠️ CAL_WEBHOOK_SECRET not configured, skipping verification');
    return true;
  }

  if (!signature) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', CAL_WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// ============================================================================
// WEBHOOK TYPES
// ============================================================================

interface CalBookingPayload {
  triggerEvent: 'BOOKING_CREATED' | 'BOOKING_RESCHEDULED' | 'BOOKING_CANCELLED';
  createdAt: string;
  payload: {
    bookingId: number;
    uid: string;
    eventTypeId: number;
    title: string;
    startTime: string;
    endTime: string;
    status: string;
    attendees: Array<{
      name: string;
      email: string;
      timeZone: string;
    }>;
    organizer: {
      name: string;
      email: string;
    };
    responses?: {
      name?: string;
      email?: string;
      phone?: string;
      notes?: string;
      location?: string;
      [key: string]: any;
    };
    metadata?: {
      source?: string;
      call_id?: string;
      lead_id?: string;
      roof_issue?: string;
      urgency?: string;
      is_storm_damage?: boolean;
      has_insurance_claim?: boolean;
      property_address?: string;
      [key: string]: any;
    };
    location?: string;
    cancellationReason?: string;
    rescheduledFrom?: string;
  };
}

// ============================================================================
// WEBHOOK ENDPOINT
// ============================================================================

/**
 * POST /api/roofing/webhooks/calcom
 *
 * Receives all Cal.com booking events
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const rawBody = JSON.stringify(req.body);
    const signature = req.headers['x-cal-signature'] as string;

    // Verify signature
    if (!verifyCalWebhookSignature(rawBody, signature)) {
      logger.warn('⚠️ Invalid Cal.com webhook signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const event: CalBookingPayload = req.body;

    logger.info(`📅 Cal.com webhook: ${event.triggerEvent}`);

    switch (event.triggerEvent) {
      case 'BOOKING_CREATED':
        await handleBookingCreated(event);
        break;

      case 'BOOKING_RESCHEDULED':
        await handleBookingRescheduled(event);
        break;

      case 'BOOKING_CANCELLED':
        await handleBookingCancelled(event);
        break;

      default:
        logger.debug(`Ignoring Cal.com event: ${event.triggerEvent}`);
    }

    res.status(200).json({ received: true });
  } catch (error: any) {
    logger.error(`❌ Cal.com webhook error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// EVENT HANDLERS
// ============================================================================

/**
 * Handle new booking created
 */
async function handleBookingCreated(event: CalBookingPayload): Promise<void> {
  const { payload } = event;
  const { responses, metadata, attendees } = payload;

  const customerName = responses?.name || attendees?.[0]?.name || 'Unknown';
  const customerEmail = responses?.email || attendees?.[0]?.email;
  const customerPhone = responses?.phone;
  const propertyAddress = metadata?.property_address || responses?.location;

  logger.info(`📅 New booking: ${customerName} on ${payload.startTime}`);

  // 1. Update lead in Supabase
  if (customerPhone) {
    try {
      const { error } = await supabase
        .from('leads')
        .upsert({
          phone: customerPhone,
          first_name: customerName.split(' ')[0],
          last_name: customerName.split(' ').slice(1).join(' ') || '',
          email: customerEmail,
          address: propertyAddress,
          appointment_booked: true,
          appointment_date: payload.startTime.split('T')[0],
          appointment_time: getTimeWindow(payload.startTime),
          pipeline_stage: 'inspection_booked',
          source: metadata?.source || 'cal_booking',
          cal_booking_id: payload.uid,
          metadata: {
            cal_booking_id: payload.bookingId,
            cal_event_type_id: payload.eventTypeId,
            roof_issue: metadata?.roof_issue,
            urgency: metadata?.urgency,
            is_storm_damage: metadata?.is_storm_damage,
            has_insurance_claim: metadata?.has_insurance_claim,
            notes: responses?.notes,
          },
        }, {
          onConflict: 'phone',
        });

      if (error) {
        logger.warn(`⚠️ Supabase update failed: ${error.message}`);
      } else {
        logger.info(`✅ Lead updated in Supabase`);
      }
    } catch (err: any) {
      logger.warn(`⚠️ Supabase error: ${err.message}`);
    }

    // 2. Cancel any pending follow-up calls
    await cancelFollowupsForPhone(customerPhone);
  }

  // 3. Sync to GHL
  try {
    let contact = await ghl.findContact(customerPhone || customerEmail);

    const contactData: any = {
      firstName: customerName.split(' ')[0],
      lastName: customerName.split(' ').slice(1).join(' ') || '',
      phone: customerPhone,
      email: customerEmail,
      address1: propertyAddress,
      tags: ['appointment-scheduled', 'cal-booking'],
      customFields: {
        appointment_date: payload.startTime.split('T')[0],
        appointment_time: getTimeWindow(payload.startTime),
        cal_booking_id: payload.uid,
        roof_issue: metadata?.roof_issue,
        urgency: metadata?.urgency,
      },
    };

    if (contact?.id) {
      await ghl.createOrUpdateContact({ id: contact.id, ...contactData });
    } else {
      contact = await ghl.createOrUpdateContact(contactData);
    }

    // Add booking note
    if (contact?.id) {
      const formattedDate = new Date(payload.startTime).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const formattedTime = new Date(payload.startTime).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });

      await ghl.addNote(contact.id,
        `## 📅 Roof Inspection Scheduled\n\n` +
        `**Date:** ${formattedDate}\n` +
        `**Time:** ${formattedTime}\n` +
        `**Address:** ${propertyAddress || 'TBD'}\n` +
        `**Issue:** ${metadata?.roof_issue || 'General inspection'}\n` +
        `**Notes:** ${responses?.notes || 'None'}\n` +
        `\n*Booked via ${metadata?.source === 'retell_voice_agent' ? 'AI Voice Agent' : 'Cal.com'}*`
      );
    }

    logger.info(`✅ GHL contact synced: ${contact?.id}`);
  } catch (err: any) {
    logger.warn(`⚠️ GHL sync failed: ${err.message}`);
  }

  // 4. Send Slack notification
  const formattedDate = new Date(payload.startTime).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  await slack.sendSlackAlert({
    level: 'info',
    title: '📅 New Roof Inspection Booked',
    message: `${customerName} scheduled an inspection`,
    fields: [
      { name: 'Customer', value: customerName, inline: true },
      { name: 'Phone', value: customerPhone || 'N/A', inline: true },
      { name: 'Date', value: formattedDate, inline: true },
      { name: 'Time', value: getTimeWindow(payload.startTime), inline: true },
      { name: 'Address', value: propertyAddress || 'TBD', inline: false },
      { name: 'Issue', value: metadata?.roof_issue || 'General', inline: true },
      { name: 'Source', value: metadata?.source || 'Direct', inline: true },
    ],
  });
}

/**
 * Handle booking rescheduled
 */
async function handleBookingRescheduled(event: CalBookingPayload): Promise<void> {
  const { payload } = event;
  const { responses, attendees } = payload;

  const customerName = responses?.name || attendees?.[0]?.name || 'Unknown';
  const customerPhone = responses?.phone;

  logger.info(`📅 Booking rescheduled: ${customerName} to ${payload.startTime}`);

  // Update Supabase
  if (customerPhone) {
    await supabase
      .from('leads')
      .update({
        appointment_date: payload.startTime.split('T')[0],
        appointment_time: getTimeWindow(payload.startTime),
        cal_booking_id: payload.uid,
      })
      .eq('phone', customerPhone);
  }

  // Update GHL note
  try {
    const lookupKey = customerPhone || responses?.email || '';
    if (lookupKey) {
      const contact = await ghl.findContact(lookupKey);
      if (contact?.id) {
        const formattedDate = new Date(payload.startTime).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        });

        await ghl.addNote(contact.id,
          `## 🔄 Inspection Rescheduled\n\n` +
          `**New Date:** ${formattedDate}\n` +
          `**New Time:** ${getTimeWindow(payload.startTime)}\n` +
          `**Previous:** ${payload.rescheduledFrom || 'Unknown'}`
        );
      }
    }
  } catch (err: any) {
    logger.warn(`⚠️ GHL note failed: ${err.message}`);
  }

  // Slack notification
  await slack.sendSlackAlert({
    level: 'warning',
    title: '🔄 Inspection Rescheduled',
    message: `${customerName} rescheduled their inspection`,
    fields: [
      { name: 'Customer', value: customerName, inline: true },
      { name: 'New Date', value: payload.startTime.split('T')[0], inline: true },
      { name: 'New Time', value: getTimeWindow(payload.startTime), inline: true },
    ],
  });
}

/**
 * Handle booking cancelled
 */
async function handleBookingCancelled(event: CalBookingPayload): Promise<void> {
  const { payload } = event;
  const { responses, attendees } = payload;

  const customerName = responses?.name || attendees?.[0]?.name || 'Unknown';
  const customerPhone = responses?.phone;

  logger.info(`📅 Booking cancelled: ${customerName}`);

  // Update Supabase
  if (customerPhone) {
    await supabase
      .from('leads')
      .update({
        appointment_booked: false,
        appointment_date: null,
        appointment_time: null,
        pipeline_stage: 'cancelled',
        metadata: {
          cancellation_reason: payload.cancellationReason,
          cancelled_at: new Date().toISOString(),
        },
      })
      .eq('phone', customerPhone);
  }

  // Update GHL
  try {
    const lookupKey = customerPhone || responses?.email || '';
    if (lookupKey) {
      const contact = await ghl.findContact(lookupKey);
      if (contact?.id) {
        await ghl.createOrUpdateContact({
          id: contact.id,
          tags: ['appointment-cancelled'],
        });

        await ghl.addNote(contact.id,
          `## ❌ Inspection Cancelled\n\n` +
          `**Reason:** ${payload.cancellationReason || 'Not provided'}\n` +
          `**Original Date:** ${payload.startTime.split('T')[0]}`
        );
      }
    }
  } catch (err: any) {
    logger.warn(`⚠️ GHL update failed: ${err.message}`);
  }

  // Slack notification
  await slack.sendSlackAlert({
    level: 'critical',
    title: '❌ Inspection Cancelled',
    message: `${customerName} cancelled their inspection`,
    fields: [
      { name: 'Customer', value: customerName, inline: true },
      { name: 'Phone', value: customerPhone || 'N/A', inline: true },
      { name: 'Reason', value: payload.cancellationReason || 'Not provided', inline: false },
    ],
  });
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Convert ISO time to morning/afternoon window
 */
function getTimeWindow(isoTime: string): string {
  const hour = new Date(isoTime).getHours();
  return hour < 12 ? 'morning' : 'afternoon';
}

export default router;
