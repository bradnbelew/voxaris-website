/**
 * n8n Workflow Integration Endpoints
 *
 * These endpoints are designed to be called by n8n workflows
 * to trigger specific actions in the Roofing Pros USA system.
 *
 * Workflow Pattern:
 * 1. n8n receives webhook from Retell/external source
 * 2. n8n transforms/enriches data
 * 3. n8n calls these endpoints to execute actions
 * 4. Response returned to n8n for further processing
 */

import { Router, Request, Response } from 'express';
import { logger } from '../../lib/logger';
import { supabase } from '../../lib/supabase';
import { ghl } from '../../lib/ghl';
import slack from '../../lib/slack';
import { sendRoofingLeadEmail } from '../../lib/resend';
import { startFollowupSequence, cancelFollowupsForPhone } from '../../queues/roofing-followup.processor';

const router = Router();

// ============================================================================
// WORKFLOW: Call Completed → GHL Sync
// Triggered after Retell call_analyzed event
// ============================================================================

interface GhlSyncRequest {
  call_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  property_address?: string;
  property_zip?: string;
  roof_issue?: string;
  is_storm_damage?: boolean;
  has_insurance_claim?: boolean;
  is_homeowner?: boolean;
  appointment_booked?: boolean;
  appointment_date?: string;
  appointment_time?: string;
  call_outcome?: string;
  call_summary?: string;
  urgency_level?: string;
  lead_quality?: string;
  sentiment?: string;
  recording_url?: string;
  direction?: 'inbound' | 'outbound';
}

/**
 * POST /api/roofing/n8n/ghl-sync
 *
 * Creates or updates a contact in GHL with call data
 * Called by n8n after processing Retell webhook
 */
router.post('/ghl-sync', async (req: Request, res: Response) => {
  try {
    const data: GhlSyncRequest = req.body;

    logger.info(`📤 GHL Sync: ${data.customer_name} (${data.customer_phone})`);

    // 1. Find or create contact in GHL
    let contact = await ghl.findContact(data.customer_phone);

    const contactData: any = {
      firstName: data.customer_name?.split(' ')[0],
      lastName: data.customer_name?.split(' ').slice(1).join(' ') || '',
      phone: data.customer_phone,
      email: data.customer_email,
      address1: data.property_address,
      postalCode: data.property_zip,
      source: data.direction === 'outbound' ? 'Retell Outbound' : 'Retell Inbound',
      tags: [] as string[],
      customFields: {
        roof_issue: data.roof_issue,
        is_storm_damage: data.is_storm_damage ? 'Yes' : 'No',
        has_insurance_claim: data.has_insurance_claim ? 'Yes' : 'No',
        is_homeowner: data.is_homeowner ? 'Yes' : 'No',
        last_call_id: data.call_id,
        last_call_outcome: data.call_outcome,
        last_call_summary: data.call_summary,
        urgency_level: data.urgency_level,
        lead_quality: data.lead_quality,
        recording_url: data.recording_url,
      }
    };

    // Add tags based on lead characteristics
    if (data.is_storm_damage) contactData.tags.push('storm-damage');
    if (data.has_insurance_claim) contactData.tags.push('insurance-claim');
    if (data.appointment_booked) contactData.tags.push('appointment-scheduled');
    if (data.urgency_level === 'emergency') contactData.tags.push('emergency');
    if (data.lead_quality === 'hot') contactData.tags.push('hot-lead');

    if (contact) {
      // Update existing contact
      await ghl.createOrUpdateContact({
        id: contact.id,
        ...contactData
      });
      logger.info(`✅ GHL contact updated: ${contact.id}`);
    } else {
      // Create new contact
      const result = await ghl.createOrUpdateContact(contactData);
      contact = result;
      logger.info(`✅ GHL contact created: ${contact?.id}`);
    }

    // 2. Add note with call summary
    if (contact?.id && data.call_summary) {
      await ghl.addNote(contact.id,
        `## ${data.direction === 'outbound' ? 'Outbound' : 'Inbound'} Call Summary\n\n` +
        `**Outcome:** ${data.call_outcome || 'N/A'}\n` +
        `**Urgency:** ${data.urgency_level || 'normal'}\n` +
        `**Summary:** ${data.call_summary}\n` +
        `**Recording:** ${data.recording_url || 'Not available'}`
      );
    }

    // 3. Update pipeline stage if applicable
    if (contact?.id) {
      let pipelineStage = 'new_lead';
      if (data.appointment_booked) {
        pipelineStage = 'inspection_scheduled';
      } else if (data.call_outcome === 'callback_requested') {
        pipelineStage = 'callback_pending';
      } else if (data.lead_quality === 'hot') {
        pipelineStage = 'hot_lead';
      }

      // Move in pipeline (if configured)
      // await ghl.updatePipelineStage(contact.id, pipelineStage);
    }

    // 4. Store in Supabase
    try {
      await supabase.from('leads').upsert({
        first_name: data.customer_name?.split(' ')[0],
        last_name: data.customer_name?.split(' ').slice(1).join(' ') || '',
        phone: data.customer_phone,
        email: data.customer_email,
        address: data.property_address,
        zip: data.property_zip,
        is_homeowner: data.is_homeowner,
        issue_type: data.roof_issue,
        has_insurance_claim: data.has_insurance_claim || false,
        urgency: data.urgency_level || 'normal',
        appointment_booked: data.appointment_booked || false,
        appointment_date: data.appointment_date,
        appointment_time: data.appointment_time,
        ghl_contact_id: contact?.id,
        ghl_synced: true,
        ghl_synced_at: new Date().toISOString(),
        pipeline_stage: data.appointment_booked ? 'inspection_booked' : 'new_lead',
        lead_score: data.lead_quality === 'hot' ? 90 : data.lead_quality === 'warm' ? 70 : 50,
        sentiment: data.sentiment,
        source: data.direction === 'outbound' ? 'retell_outbound' : 'retell_inbound',
        metadata: {
          call_id: data.call_id,
          call_outcome: data.call_outcome,
          call_summary: data.call_summary,
          recording_url: data.recording_url
        }
      }, {
        onConflict: 'phone'
      });
      logger.info(`✅ Lead stored in Supabase`);
    } catch (dbError: any) {
      logger.warn(`⚠️ Supabase insert failed: ${dbError.message}`);
    }

    res.status(200).json({
      success: true,
      ghl_contact_id: contact?.id,
      synced_at: new Date().toISOString()
    });

  } catch (error: any) {
    logger.error('❌ GHL Sync error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================================================
// WORKFLOW: Create Appointment
// Creates appointment in GHL calendar
// ============================================================================

interface CreateAppointmentRequest {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  property_address: string;
  property_zip?: string;
  appointment_date: string;      // "2024-02-15"
  appointment_time_window: string; // "morning" or "afternoon"
  urgency?: string;
  roof_issue?: string;
  notes?: string;
}

/**
 * POST /api/roofing/n8n/create-appointment
 *
 * Creates an appointment in GHL and sends confirmation SMS
 */
router.post('/create-appointment', async (req: Request, res: Response) => {
  try {
    const data: CreateAppointmentRequest = req.body;

    logger.info(`📅 Creating appointment for ${data.customer_name}`);

    // 1. Find or create GHL contact
    let contact = await ghl.findContact(data.customer_phone);

    if (!contact) {
      contact = await ghl.createOrUpdateContact({
        name: data.customer_name,
        phone: data.customer_phone,
        email: data.customer_email,
        tags: ['appointment-scheduled'],
        customFields: {
          address: data.property_address,
          zip: data.property_zip,
          source: 'Retell Voice'
        }
      });
    }

    if (!contact?.id) {
      throw new Error('Could not create or find GHL contact');
    }

    // 2. Add note with appointment details
    const appointmentNote = `
## Roof Inspection Scheduled

**Date:** ${data.appointment_date}
**Time:** ${data.appointment_time_window}
**Address:** ${data.property_address}
**Issue:** ${data.roof_issue || 'General inspection'}
**Urgency:** ${data.urgency || 'normal'}
**Notes:** ${data.notes || 'N/A'}
    `.trim();

    await ghl.addNote(contact.id, appointmentNote);
    logger.info(`✅ GHL appointment note added to contact: ${contact.id}`);

    // 4. Send SMS confirmation
    const confirmationMessage =
      `Hi ${data.customer_name?.split(' ')[0]}! Your roof inspection with Roofing Pros USA is confirmed for ${data.appointment_date} (${data.appointment_time_window}). ` +
      `A specialist will call you the morning of to confirm. Questions? Call (407) 960-6333.`;

    await ghl.sendSMS(contact.id, confirmationMessage);
    logger.info(`✅ SMS confirmation sent`);

    // 5. Cancel any pending follow-up calls
    await cancelFollowupsForPhone(data.customer_phone);

    res.status(200).json({
      success: true,
      ghl_contact_id: contact.id,
      sms_sent: true
    });

  } catch (error: any) {
    logger.error('❌ Create appointment error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================================================
// WORKFLOW: Schedule Callback Task
// Creates a task in GHL for callback
// ============================================================================

interface ScheduleCallbackRequest {
  customer_name: string;
  customer_phone: string;
  callback_date: string;
  callback_time: string;
  notes?: string;
  priority?: 'low' | 'normal' | 'high';
}

/**
 * POST /api/roofing/n8n/schedule-callback
 *
 * Creates a task in GHL for scheduled callback
 */
router.post('/schedule-callback', async (req: Request, res: Response) => {
  try {
    const data: ScheduleCallbackRequest = req.body;

    logger.info(`📞 Scheduling callback for ${data.customer_name}`);

    // 1. Find contact
    const contact = await ghl.findContact(data.customer_phone);

    if (!contact?.id) {
      logger.warn(`⚠️ Contact not found for ${data.customer_phone}`);
    }

    // 2. Add callback note to contact
    if (contact?.id) {
      const callbackNote = `
## Callback Requested

**Date:** ${data.callback_date}
**Time:** ${data.callback_time}
**Priority:** ${data.priority || 'normal'}
**Notes:** ${data.notes || 'N/A'}
      `.trim();

      await ghl.addNote(contact.id, callbackNote);
      logger.info(`✅ Callback note added to GHL contact`);
    }

    // 3. Notify via Slack
    await slack.sendSlackAlert({
      level: 'info',
      title: 'Callback Scheduled',
      message: `${data.customer_name} requested callback`,
      fields: [
        { name: 'Phone', value: data.customer_phone, inline: true },
        { name: 'Date', value: data.callback_date, inline: true },
        { name: 'Time', value: data.callback_time, inline: true },
        { name: 'Notes', value: data.notes || 'None', inline: false }
      ]
    });

    res.status(200).json({
      success: true,
      ghl_contact_id: contact?.id
    });

  } catch (error: any) {
    logger.error('❌ Schedule callback error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================================================
// WORKFLOW: Trigger Outbound Follow-up Sequence
// Starts automated follow-up cadence for new leads
// ============================================================================

interface TriggerFollowupRequest {
  phone: string;
  customer_name: string;
  email?: string;
  address?: string;
  roof_issue?: string;
  source: string;
  lead_id?: string;
}

/**
 * POST /api/roofing/n8n/trigger-followup
 *
 * Starts the automated outbound follow-up sequence
 */
router.post('/trigger-followup', async (req: Request, res: Response) => {
  try {
    const data: TriggerFollowupRequest = req.body;

    logger.info(`🚀 Triggering follow-up sequence for ${data.phone}`);

    const result = await startFollowupSequence({
      phone: data.phone,
      customerName: data.customer_name,
      email: data.email,
      address: data.address,
      roofIssue: data.roof_issue,
      source: data.source,
      leadId: data.lead_id
    });

    if (result.success) {
      logger.info(`✅ Follow-up sequence started for ${data.phone}`);
    } else {
      logger.error(`❌ Failed to start follow-up: ${result.error}`);
    }

    res.status(result.success ? 200 : 500).json(result);

  } catch (error: any) {
    logger.error('❌ Trigger followup error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================================================
// WORKFLOW: Update Contact Tags
// Adds/removes tags from GHL contact
// ============================================================================

interface UpdateTagsRequest {
  phone: string;
  add_tags?: string[];
  remove_tags?: string[];
}

/**
 * POST /api/roofing/n8n/update-tags
 *
 * Updates tags on a GHL contact
 */
router.post('/update-tags', async (req: Request, res: Response) => {
  try {
    const data: UpdateTagsRequest = req.body;

    logger.info(`🏷️ Updating tags for ${data.phone}`);

    const contact = await ghl.findContact(data.phone);

    if (!contact?.id) {
      return res.status(404).json({
        success: false,
        error: 'Contact not found'
      });
    }

    // Get current tags
    let currentTags = contact.tags || [];

    // Add new tags
    if (data.add_tags?.length) {
      currentTags = [...new Set([...currentTags, ...data.add_tags])];
    }

    // Remove tags
    if (data.remove_tags?.length) {
      currentTags = currentTags.filter(tag => !data.remove_tags!.includes(tag));
    }

    // Update contact
    await ghl.createOrUpdateContact({
      id: contact.id,
      tags: currentTags
    });

    logger.info(`✅ Tags updated for ${contact.id}`);

    res.status(200).json({
      success: true,
      ghl_contact_id: contact.id,
      tags: currentTags
    });

  } catch (error: any) {
    logger.error('❌ Update tags error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================================================
// WORKFLOW: Send Custom SMS
// Sends SMS via GHL
// ============================================================================

interface SendSmsRequest {
  phone: string;
  message: string;
}

/**
 * POST /api/roofing/n8n/send-sms
 *
 * Sends a custom SMS message via GHL
 */
router.post('/send-sms', async (req: Request, res: Response) => {
  try {
    const data: SendSmsRequest = req.body;

    logger.info(`📱 Sending SMS to ${data.phone}`);

    const contact = await ghl.findContact(data.phone);

    if (!contact?.id) {
      return res.status(404).json({
        success: false,
        error: 'Contact not found in GHL'
      });
    }

    await ghl.sendSMS(contact.id, data.message);

    logger.info(`✅ SMS sent to ${data.phone}`);

    res.status(200).json({
      success: true,
      ghl_contact_id: contact.id
    });

  } catch (error: any) {
    logger.error('❌ Send SMS error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================================================
// HEALTH CHECK
// ============================================================================

router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'n8n-workflows',
    endpoints: [
      'POST /ghl-sync',
      'POST /create-appointment',
      'POST /schedule-callback',
      'POST /trigger-followup',
      'POST /update-tags',
      'POST /send-sms'
    ]
  });
});

export default router;
