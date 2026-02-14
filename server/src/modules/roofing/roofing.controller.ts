/**
 * Roofing Pros USA - Webhook Controller
 *
 * Handles webhooks from:
 * - Retell AI (call completed, call started, voicemail)
 * - Form submissions (Google Ads, Facebook, Website)
 */

import { Router, Request, Response } from 'express';
import Retell from 'retell-sdk';
import rateLimit from 'express-rate-limit';
import { logger } from '../../lib/logger';
import { roofingService, CallCompletedData, FormSubmissionData } from './roofing.service';
import { mem0 } from '../../lib/mem0';
import { supabase } from '../../lib/supabase';
import slack from '../../lib/slack';
import { sendRoofingLeadEmail } from '../../lib/resend';
import { cancelFollowupsForPhone } from '../../queues/roofing-followup.processor';
import {
    triggerOutboundCall,
    addToDncList,
    removeFromDncList,
    checkDncList,
    checkTcpaCompliance,
    getDncStats,
    getTcpaStatus
} from '../../services/outbound.service';

// Email recipient for lead notifications
const LEAD_NOTIFICATION_EMAIL = process.env.ROOFING_LEAD_EMAIL || 'leads@roofingprosusa.com';

// Rate limiter for form submissions - 10 requests per minute per IP
const formRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 requests per window
    message: { error: 'Too many form submissions, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger.warn(`🚫 Rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({ error: 'Too many form submissions, please try again later' });
    }
});

const router = Router();

// ============================================================================
// RETELL AI WEBHOOK
// ============================================================================

/**
 * POST /api/webhooks/retell/roofing
 *
 * Receives webhooks from Retell AI for call events
 */
router.post('/retell/roofing', async (req: Request, res: Response) => {
    try {
        const event = req.body;
        logger.info(`📞 Retell webhook received: ${event.event}`);

        // Validate webhook signature (production security)
        if (process.env.RETELL_WEBHOOK_SECRET) {
            const isValid = Retell.verify(
                JSON.stringify(req.body),
                process.env.RETELL_WEBHOOK_SECRET,
                req.headers['x-retell-signature'] as string
            );
            if (!isValid) {
                logger.warn('⚠️ Invalid webhook signature');
                await slack.alertWebhookFailed('Retell', new Error('Invalid webhook signature'), { event: event.event });
                return res.status(401).json({ error: 'Invalid signature' });
            }
        } else {
            logger.warn('⚠️ RETELL_WEBHOOK_SECRET not configured - skipping signature validation');
        }

        switch (event.event) {
            case 'call_started':
                await handleCallStarted(event);
                break;

            case 'call_ended':
                await handleCallEnded(event);
                break;

            case 'call_analyzed':
                await handleCallAnalyzed(event);
                break;

            default:
                logger.info(`📋 Unhandled event type: ${event.event}`);
        }

        res.status(200).json({ received: true });

    } catch (error: any) {
        logger.error('❌ Retell webhook error:', error.message);
        await slack.alertWebhookFailed('Retell', error, { body: req.body });
        res.status(500).json({ error: error.message });
    }
});

/**
 * Handle call started event - inject memory context if available
 */
async function handleCallStarted(event: any): Promise<void> {
    const phone = event.call?.from_number || event.call?.to_number;

    if (phone) {
        logger.info(`📞 Call started from ${phone}`);

        // Get memory context for returning callers
        const context = await roofingService.getCallerContext(phone);

        if (context) {
            logger.info(`🧠 Returning caller detected - memory context available`);
            // Note: Retell webhooks are fire-and-forget, but you can use
            // Retell's dynamic variables feature to inject context before call
        }
    }
}

/**
 * Handle call ended event
 */
async function handleCallEnded(event: any): Promise<void> {
    logger.info(`📞 Call ended: ${event.call_id}`);
    logger.info(`   Status: ${event.call_status}`);
    logger.info(`   Disconnection: ${event.disconnection_reason}`);

    // If post-call analysis is enabled, we'll get a separate call_analyzed event
    // For immediate processing of calls without analysis:
    if (!event.call_analysis && event.call_status !== 'voicemail') {
        // Basic call without analysis - just log it
        logger.info(`📋 Call ${event.call_id} ended without analysis data`);
    }
}

/**
 * Handle call analyzed event - full processing with extracted data
 */
async function handleCallAnalyzed(event: any): Promise<void> {
    logger.info(`📊 Call analysis received: ${event.call_id}`);

    const callData: CallCompletedData = {
        call_id: event.call_id,
        agent_id: event.agent_id,
        call_status: event.call_status,
        start_timestamp: event.start_timestamp,
        end_timestamp: event.end_timestamp,
        duration_ms: event.duration_ms || (event.end_timestamp - event.start_timestamp),
        from_number: event.from_number,
        to_number: event.to_number,
        direction: event.direction || 'inbound',
        disconnection_reason: event.disconnection_reason,
        call_analysis: event.call_analysis,
        transcript: event.transcript,
        transcript_object: event.transcript_object,
        recording_url: event.recording_url
    };

    // Process the call (store memory, create CRM records, etc.)
    const result = await roofingService.processCompletedCall(callData);

    if (result.success) {
        logger.info(`✅ Call processed: Contact=${result.contactId}, Job=${result.jobId}`);

        // Send Slack alerts for hot leads and appointments
        const analysis = event.call_analysis?.custom_analysis_data || {};
        const name = analysis.customer_name || 'Unknown';
        const phone = event.from_number || event.to_number || 'Unknown';

        if (analysis.lead_quality === 'hot') {
            await slack.alertHotLead(name, phone, analysis.roof_issue || 'Not specified');
        }

        if (analysis.appointment_scheduled && analysis.appointment_date) {
            await slack.alertAppointmentBooked(
                name,
                phone,
                analysis.appointment_date,
                analysis.office_location || 'TBD'
            );
        }
    } else {
        logger.error(`❌ Call processing failed: ${result.error}`);
        await slack.alertWebhookFailed('Call Processing', new Error(result.error || 'Unknown error'), { call_id: event.call_id });
    }
}

// ============================================================================
// FORM SUBMISSION WEBHOOKS
// ============================================================================

/**
 * POST /api/webhooks/forms/roofing
 *
 * Receives form submissions from various sources and triggers outbound calls
 */
router.post('/forms/roofing', formRateLimiter, async (req: Request, res: Response) => {
    try {
        const body = req.body;
        logger.info(`📝 Form submission received from ${body.source || 'unknown'}`);

        // Validate required fields
        if (!body.phone || !body.firstName) {
            return res.status(400).json({
                error: 'Missing required fields: phone, firstName'
            });
        }

        const formData: FormSubmissionData = {
            source: body.source || 'website',
            firstName: body.firstName || body.first_name,
            lastName: body.lastName || body.last_name || '',
            phone: body.phone,
            email: body.email,
            address: body.address,
            city: body.city,
            state: body.state || 'FL',
            zip: body.zip || body.zipCode,
            message: body.message || body.comments,
            roofIssue: body.roofIssue || body.roof_issue || body.issue,
            timestamp: new Date()
        };

        // Handle form submission (queue outbound call)
        const result = await roofingService.handleFormSubmission(formData);

        res.status(200).json({
            success: result.success,
            message: result.success
                ? 'Form received, outbound call will be placed shortly'
                : result.error,
            callId: result.callId
        });

    } catch (error: any) {
        logger.error('❌ Form webhook error:', error.message);
        await slack.alertWebhookFailed('Form Submission', error, { body: req.body });
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/webhooks/forms/roofing/google-ads
 *
 * Specific handler for Google Ads lead form extensions
 */
router.post('/forms/roofing/google-ads', formRateLimiter, async (req: Request, res: Response) => {
    try {
        const body = req.body;
        logger.info(`📊 Google Ads lead form received`);

        // Google Ads lead form format
        const formData: FormSubmissionData = {
            source: 'google_ads',
            firstName: body.user_data?.first_name || body.firstName || '',
            lastName: body.user_data?.last_name || body.lastName || '',
            phone: body.user_data?.phone_number || body.phone || '',
            email: body.user_data?.email || body.email || '',
            address: body.lead_form_data?.address || '',
            city: body.lead_form_data?.city || '',
            state: body.lead_form_data?.state || 'FL',
            zip: body.lead_form_data?.postal_code || '',
            message: body.lead_form_data?.question_text || '',
            timestamp: new Date()
        };

        if (!formData.phone) {
            return res.status(400).json({ error: 'Phone number required' });
        }

        const result = await roofingService.handleFormSubmission(formData);

        res.status(200).json({
            success: result.success,
            source: 'google_ads'
        });

    } catch (error: any) {
        logger.error('❌ Google Ads webhook error:', error.message);
        await slack.alertWebhookFailed('Google Ads Form', error, { body: req.body });
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/webhooks/forms/roofing/facebook
 *
 * Specific handler for Facebook Lead Ads
 */
router.post('/forms/roofing/facebook', formRateLimiter, async (req: Request, res: Response) => {
    try {
        const body = req.body;
        logger.info(`📘 Facebook Lead Ad received`);

        // Facebook Lead Ads format
        const leadData = body.entry?.[0]?.changes?.[0]?.value?.leadgen_id
            ? body.entry[0].changes[0].value
            : body;

        // Note: Facebook requires fetching lead data from their API
        // This is a simplified version assuming data is included
        const formData: FormSubmissionData = {
            source: 'facebook',
            firstName: leadData.first_name || body.first_name || '',
            lastName: leadData.last_name || body.last_name || '',
            phone: leadData.phone_number || body.phone || '',
            email: leadData.email || body.email || '',
            address: leadData.street_address || '',
            city: leadData.city || '',
            state: leadData.state || 'FL',
            zip: leadData.zip_code || '',
            message: leadData.custom_disclaimer_responses || '',
            timestamp: new Date()
        };

        if (!formData.phone) {
            return res.status(400).json({ error: 'Phone number required' });
        }

        const result = await roofingService.handleFormSubmission(formData);

        res.status(200).json({
            success: result.success,
            source: 'facebook'
        });

    } catch (error: any) {
        logger.error('❌ Facebook webhook error:', error.message);
        await slack.alertWebhookFailed('Facebook Form', error, { body: req.body });
        res.status(500).json({ error: error.message });
    }
});

// ============================================================================
// MEMORY/CONTEXT ENDPOINTS
// ============================================================================

/**
 * GET /api/roofing/memory/:phone
 *
 * Get memory context for a phone number (for testing/debugging)
 */
router.get('/memory/:phone', async (req: Request, res: Response) => {
    try {
        const phone = req.params.phone;
        const context = await roofingService.getCallerContext(phone);

        res.status(200).json({
            phone,
            hasMemory: !!context,
            context: context || null
        });

    } catch (error: any) {
        logger.error('❌ Memory lookup error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/roofing/memory/:phone
 *
 * Manually add memory for a phone number (for testing)
 */
router.post('/memory/:phone', async (req: Request, res: Response) => {
    try {
        const phone = req.params.phone;
        const { facts } = req.body;

        if (!facts || !Array.isArray(facts)) {
            return res.status(400).json({ error: 'facts array required' });
        }

        const result = await mem0.addByPhone(phone, facts);

        res.status(200).json({
            success: result.success,
            error: result.error
        });

    } catch (error: any) {
        logger.error('❌ Memory add error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// ============================================================================
// LEADS DASHBOARD API
// ============================================================================

/**
 * GET /api/roofing/leads
 *
 * Get all roofing leads for the dashboard
 */
router.get('/leads', async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string) || 50;
        const offset = parseInt(req.query.offset as string) || 0;

        // First, try to reload the schema cache by calling pg_notify
        try {
            await supabase.rpc('reload_schema_cache');
        } catch (e) {
            // Ignore - function might not exist
        }

        // Try direct query
        const { data: leads, error } = await supabase
            .from('roofing_leads')
            .select('*')
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) {
            logger.error('❌ Failed to fetch leads:', error.message);

            // If schema cache issue, return instructions
            if (error.message.includes('schema cache')) {
                return res.status(200).json({
                    success: true,
                    leads: [],
                    total: 0,
                    limit,
                    offset,
                    schemaRefreshNeeded: true,
                    message: 'Run this SQL in Supabase: NOTIFY pgrst, \'reload schema\''
                });
            }

            return res.status(500).json({
                success: false,
                error: error.message
            });
        }

        res.status(200).json({
            success: true,
            leads: leads || [],
            total: leads?.length || 0,
            limit,
            offset
        });

    } catch (error: any) {
        logger.error('❌ Leads fetch error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/roofing/leads/:id
 *
 * Get a single lead by ID
 */
router.get('/leads/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const { data: lead, error } = await supabase
            .from('roofing_leads')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            logger.error('❌ Failed to fetch lead:', error.message);
            return res.status(404).json({
                success: false,
                error: 'Lead not found'
            });
        }

        res.status(200).json({
            success: true,
            lead
        });

    } catch (error: any) {
        logger.error('❌ Lead fetch error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/roofing/leads/stats
 *
 * Get lead statistics for dashboard
 */
router.get('/leads/stats', async (req: Request, res: Response) => {
    try {
        // Get total leads
        const { count: totalLeads } = await supabase
            .from('roofing_leads')
            .select('*', { count: 'exact', head: true });

        // Get appointments booked
        const { count: appointmentsBooked } = await supabase
            .from('roofing_leads')
            .select('*', { count: 'exact', head: true })
            .eq('appointment_scheduled', true);

        // Get hot leads
        const { count: hotLeads } = await supabase
            .from('roofing_leads')
            .select('*', { count: 'exact', head: true })
            .eq('lead_quality', 'hot');

        // Get storm damage leads
        const { count: stormDamageLeads } = await supabase
            .from('roofing_leads')
            .select('*', { count: 'exact', head: true })
            .eq('storm_damage', true);

        res.status(200).json({
            success: true,
            stats: {
                totalLeads: totalLeads || 0,
                appointmentsBooked: appointmentsBooked || 0,
                hotLeads: hotLeads || 0,
                stormDamageLeads: stormDamageLeads || 0
            }
        });

    } catch (error: any) {
        logger.error('❌ Stats fetch error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============================================================================
// OUTBOUND CALL ENDPOINTS
// ============================================================================

/**
 * POST /api/roofing/call
 *
 * Trigger an outbound call directly (for testing/demo)
 */
router.post('/call', async (req: Request, res: Response) => {
    try {
        const { toNumber, customerName, context } = req.body;

        if (!toNumber) {
            return res.status(400).json({
                success: false,
                error: 'toNumber is required'
            });
        }

        logger.info(`📞 Direct outbound call requested to ${toNumber}`);

        const result = await roofingService.makeOutboundCall({
            toNumber,
            customerName,
            context
        });

        res.status(result.success ? 200 : 500).json(result);

    } catch (error: any) {
        logger.error('❌ Outbound call error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/roofing/call/:callId
 *
 * Get call status by call ID
 */
router.get('/call/:callId', async (req: Request, res: Response) => {
    try {
        const { callId } = req.params;
        const { retell } = await import('../../lib/retell');

        const callDetails = await retell.getCall(callId);

        if (!callDetails) {
            return res.status(404).json({
                success: false,
                error: 'Call not found'
            });
        }

        res.status(200).json({
            success: true,
            call: callDetails
        });

    } catch (error: any) {
        logger.error('❌ Get call error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============================================================================
// RETELL CUSTOM FUNCTION ENDPOINTS
// Called directly by Retell agent during calls
// ============================================================================

/**
 * POST /api/roofing/functions/book-inspection
 *
 * Called by Retell agent when customer confirms appointment.
 * This endpoint is called IN REAL-TIME during the call.
 */
router.post('/functions/book-inspection', async (req: Request, res: Response) => {
    try {
        const {
            customer_name,
            phone,
            email,
            property_address,
            zip_code,
            roof_issue,
            is_storm_damage,
            has_insurance_claim,
            is_homeowner,
            appointment_date,
            appointment_time_window,
            urgency,
            call_source
        } = req.body;

        logger.info(`📅 Booking inspection for ${customer_name} at ${property_address}`);
        logger.info(`   Date: ${appointment_date} (${appointment_time_window})`);

        // Validate required fields
        if (!customer_name || !phone || !property_address || !appointment_date || !appointment_time_window) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: customer_name, phone, property_address, appointment_date, appointment_time_window'
            });
        }

        // Determine office location from zip
        const officeLocation = getOfficeFromZip(zip_code || '');

        // Store in database (leads table when migration is applied)
        const leadData = {
            first_name: customer_name.split(' ')[0],
            last_name: customer_name.split(' ').slice(1).join(' ') || '',
            phone,
            email: email || null,
            address: property_address,
            zip: zip_code,
            is_homeowner: is_homeowner ?? true,
            issue_type: roof_issue,
            has_insurance_claim: has_insurance_claim ?? false,
            urgency: urgency || 'normal',
            appointment_booked: true,
            appointment_date,
            appointment_time: appointment_time_window,
            pipeline_stage: 'inspection_booked',
            source: call_source || 'retell_inbound',
            tags: is_storm_damage ? ['storm-damage'] : [],
            metadata: {
                office_location: officeLocation,
                booked_at: new Date().toISOString()
            }
        };

        // Try to insert into leads table (will fail gracefully if table doesn't exist)
        let leadId = null;
        try {
            const { data, error } = await supabase
                .from('leads')
                .insert(leadData)
                .select('id')
                .single();

            if (!error && data) {
                leadId = data.id;
                logger.info(`✅ Lead created in Supabase: ${leadId}`);
            }
        } catch (dbError: any) {
            logger.warn(`⚠️ Could not insert lead to Supabase: ${dbError.message}`);
        }

        // Send email notification
        try {
            await sendRoofingLeadEmail({
                to: LEAD_NOTIFICATION_EMAIL,
                customerName: customer_name,
                customerPhone: phone,
                customerEmail: email || 'Not provided',
                propertyAddress: property_address,
                roofIssue: roof_issue || 'Not specified',
                appointmentScheduled: true,
                appointmentDate: `${appointment_date} (${appointment_time_window})`,
                urgencyLevel: urgency || 'normal',
                stormDamage: is_storm_damage || false,
                insuranceClaimFiled: has_insurance_claim || false,
                officeLocation,
                callId: `booking-${Date.now()}`,
                timestamp: new Date()
            });
            logger.info(`✅ Lead email sent to ${LEAD_NOTIFICATION_EMAIL}`);
        } catch (emailError: any) {
            logger.error(`❌ Email send failed: ${emailError.message}`);
        }

        // Send Slack notification
        try {
            await slack.alertAppointmentBooked(
                customer_name,
                phone,
                `${appointment_date} (${appointment_time_window})`,
                officeLocation
            );
        } catch (slackError: any) {
            logger.error(`❌ Slack notification failed: ${slackError.message}`);
        }

        // Return success to Retell (agent will speak confirmation)
        res.status(200).json({
            success: true,
            message: `Inspection booked for ${appointment_date} in the ${appointment_time_window}`,
            lead_id: leadId,
            office_location: officeLocation,
            confirmation_number: `RP-${Date.now().toString(36).toUpperCase()}`
        });

    } catch (error: any) {
        logger.error('❌ Book inspection error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to book inspection. Please try again.'
        });
    }
});

/**
 * POST /api/roofing/functions/schedule-callback
 *
 * Called by outbound agent when customer requests callback at specific time.
 */
router.post('/functions/schedule-callback', async (req: Request, res: Response) => {
    try {
        const {
            customer_name,
            callback_date,
            callback_time,
            notes
        } = req.body;

        logger.info(`📞 Scheduling callback for ${customer_name} on ${callback_date} at ${callback_time}`);

        if (!callback_date || !callback_time) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: callback_date, callback_time'
            });
        }

        // Store callback request (would integrate with GHL task creation)
        // For now, just send Slack notification
        try {
            await slack.sendSlackAlert({
                level: 'info',
                title: 'Callback Scheduled',
                message: `${customer_name || 'Unknown'} requested callback on ${callback_date} at ${callback_time}`,
                fields: [
                    { name: 'Customer', value: customer_name || 'Unknown', inline: true },
                    { name: 'Date', value: callback_date, inline: true },
                    { name: 'Time', value: callback_time, inline: true },
                    { name: 'Notes', value: notes || 'None', inline: false }
                ]
            });
        } catch (slackError: any) {
            logger.error(`❌ Slack notification failed: ${slackError.message}`);
        }

        res.status(200).json({
            success: true,
            message: `Callback scheduled for ${callback_date} at ${callback_time}`
        });

    } catch (error: any) {
        logger.error('❌ Schedule callback error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to schedule callback'
        });
    }
});

/**
 * POST /api/roofing/functions/add-dnc
 *
 * Called by outbound agent when customer requests removal from call list.
 * TCPA COMPLIANCE - Must be processed immediately.
 */
router.post('/functions/add-dnc', async (req: Request, res: Response) => {
    try {
        const {
            phone_number,
            customer_name,
            reason
        } = req.body;

        logger.info(`🚫 Adding to DNC list: ${phone_number}`);

        if (!phone_number) {
            return res.status(400).json({
                success: false,
                error: 'phone_number is required'
            });
        }

        // Normalize phone number
        const normalizedPhone = phone_number.replace(/\D/g, '');

        // Add to DNC list in database
        try {
            const { error } = await supabase
                .from('dnc_list')
                .insert({
                    phone: normalizedPhone,
                    reason: reason || 'customer_request',
                    added_by: 'retell_agent'
                });

            if (error && !error.message.includes('duplicate')) {
                logger.error(`❌ DNC insert failed: ${error.message}`);
            } else {
                logger.info(`✅ Added ${normalizedPhone} to DNC list`);
            }
        } catch (dbError: any) {
            logger.warn(`⚠️ Could not insert to DNC list: ${dbError.message}`);
        }

        // Cancel any pending follow-up calls
        try {
            await cancelFollowupsForPhone(normalizedPhone);
            logger.info(`✅ Cancelled pending follow-ups for ${normalizedPhone}`);
        } catch (cancelError: any) {
            logger.warn(`⚠️ Could not cancel follow-ups: ${cancelError.message}`);
        }

        // Send Slack notification for compliance tracking
        try {
            await slack.sendSlackAlert({
                level: 'warning',
                title: 'DNC Request',
                message: `${phone_number} added to Do Not Call list`,
                fields: [
                    { name: 'Phone', value: phone_number, inline: true },
                    { name: 'Customer', value: customer_name || 'Unknown', inline: true },
                    { name: 'Reason', value: reason || 'Customer request', inline: false }
                ]
            });
        } catch (slackError: any) {
            logger.error(`❌ Slack notification failed: ${slackError.message}`);
        }

        res.status(200).json({
            success: true,
            message: 'Phone number has been removed from our call list'
        });

    } catch (error: any) {
        logger.error('❌ Add DNC error:', error.message);
        // Still return success to agent - we don't want call to fail
        res.status(200).json({
            success: true,
            message: 'Your request has been noted'
        });
    }
});

/**
 * Helper: Get office location from zip code
 */
function getOfficeFromZip(zip: string): string {
    const prefix = zip.substring(0, 3);
    const zipMap: Record<string, string> = {
        '322': 'Jacksonville',
        '328': 'Orlando',
        '327': 'Orlando',
        '347': 'Orlando',
        '336': 'Tampa',
        '335': 'Tampa',
        '346': 'Tampa',
        '325': 'Pensacola',
        '334': 'West Palm Beach',
        '331': 'West Palm Beach',
        '321': 'Daytona Beach',
        '320': 'Daytona Beach',
        '329': 'Melbourne',
    };
    return zipMap[prefix] || 'Casselberry HQ';
}

// ============================================================================
// TCPA-COMPLIANT OUTBOUND CALL API
// ============================================================================

/**
 * POST /api/roofing/outbound/trigger
 *
 * Trigger a TCPA-compliant outbound call with all safety checks:
 * - DNC list check
 * - TCPA time window (8 AM - 9 PM local)
 * - 24-hour cooldown
 * - Max 3 attempts per lead
 */
router.post('/outbound/trigger', async (req: Request, res: Response) => {
    try {
        const {
            phone,
            customerName,
            email,
            address,
            zipCode,
            roofIssue,
            scenario,
            source,
            leadId
        } = req.body;

        if (!phone || !customerName || !scenario) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: phone, customerName, scenario'
            });
        }

        // Validate scenario
        const validScenarios = ['new_lead', 'estimate_sent', 'no_show', 'review_request'];
        if (!validScenarios.includes(scenario)) {
            return res.status(400).json({
                success: false,
                error: `Invalid scenario. Must be one of: ${validScenarios.join(', ')}`
            });
        }

        const result = await triggerOutboundCall({
            phone,
            customerName,
            email,
            address,
            zipCode,
            roofIssue,
            scenario,
            source,
            leadId
        });

        if (result.success) {
            logger.info(`✅ Outbound call triggered: ${result.callId}`);
            res.status(200).json(result);
        } else {
            logger.info(`⚠️ Outbound call blocked: ${result.reason} - ${result.error}`);
            res.status(result.reason === 'DNC_LISTED' ? 403 : 200).json(result);
        }

    } catch (error: any) {
        logger.error('❌ Outbound trigger error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/roofing/outbound/dnc
 *
 * Add a phone number to the Do Not Call list
 */
router.post('/outbound/dnc', async (req: Request, res: Response) => {
    try {
        const { phone, reason, source, addedBy } = req.body;

        if (!phone) {
            return res.status(400).json({
                success: false,
                error: 'phone is required'
            });
        }

        const result = await addToDncList({
            phone,
            reason: reason || 'manual_addition',
            source: source || 'api',
            addedBy,
            addedAt: new Date()
        });

        res.status(result.success ? 200 : 500).json(result);

    } catch (error: any) {
        logger.error('❌ DNC add error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * DELETE /api/roofing/outbound/dnc/:phone
 *
 * Remove a phone number from the DNC list
 */
router.delete('/outbound/dnc/:phone', async (req: Request, res: Response) => {
    try {
        const { phone } = req.params;

        const result = await removeFromDncList(phone);

        res.status(result.success ? 200 : 500).json(result);

    } catch (error: any) {
        logger.error('❌ DNC remove error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/roofing/outbound/dnc/:phone
 *
 * Check if a phone number is on the DNC list
 */
router.get('/outbound/dnc/:phone', async (req: Request, res: Response) => {
    try {
        const { phone } = req.params;

        const result = await checkDncList(phone);

        res.status(200).json({
            phone,
            ...result
        });

    } catch (error: any) {
        logger.error('❌ DNC check error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/roofing/outbound/dnc
 *
 * Get DNC list statistics
 */
router.get('/outbound/dnc', async (req: Request, res: Response) => {
    try {
        const stats = await getDncStats();

        res.status(200).json({
            success: true,
            ...stats
        });

    } catch (error: any) {
        logger.error('❌ DNC stats error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/roofing/outbound/tcpa-status
 *
 * Get current TCPA calling window status
 */
router.get('/outbound/tcpa-status', (req: Request, res: Response) => {
    try {
        const status = getTcpaStatus();

        res.status(200).json({
            success: true,
            ...status
        });

    } catch (error: any) {
        logger.error('❌ TCPA status error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/roofing/outbound/can-call/:phone
 *
 * Check if we can call a specific phone number right now
 * (Combines all compliance checks)
 */
router.get('/outbound/can-call/:phone', async (req: Request, res: Response) => {
    try {
        const { phone } = req.params;
        const { zipCode } = req.query;

        const checks: Record<string, { pass: boolean; reason?: string }> = {};

        // 1. DNC Check
        const dncResult = await checkDncList(phone);
        checks.dnc = {
            pass: !dncResult.isOnDnc,
            reason: dncResult.isOnDnc ? `On DNC list: ${dncResult.reason}` : undefined
        };

        // 2. TCPA Time Check
        const tcpaResult = checkTcpaCompliance(zipCode as string);
        checks.tcpa = {
            pass: tcpaResult.canCall,
            reason: tcpaResult.canCall ? undefined : tcpaResult.reason
        };

        // Determine overall result
        const canCall = checks.dnc.pass && checks.tcpa.pass;
        const blockedBy = !canCall
            ? Object.entries(checks)
                .filter(([_, v]) => !v.pass)
                .map(([k]) => k)
                .join(', ')
            : undefined;

        res.status(200).json({
            phone,
            canCall,
            blockedBy,
            checks,
            currentTime: getTcpaStatus().currentTime
        });

    } catch (error: any) {
        logger.error('❌ Can-call check error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============================================================================
// HEALTH CHECK
// ============================================================================

/**
 * GET /api/roofing/health
 * Basic health check - just returns OK
 */
router.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'ok',
        service: 'roofing-voice-agent',
        timestamp: new Date().toISOString(),
        config: {
            mem0Configured: mem0.isConfigured(),
            retellConfigured: !!process.env.RETELL_API_KEY,
            jobNimbusConfigured: !!process.env.JOBNIMBUS_API_KEY,
            slackConfigured: !!process.env.SLACK_WEBHOOK_URL
        }
    });
});

/**
 * GET /api/roofing/health/deep
 * Deep health check - tests all external service connections
 */
router.get('/health/deep', async (req: Request, res: Response) => {
    const startTime = Date.now();
    const checks: Record<string, { status: 'ok' | 'error' | 'not_configured'; latency?: number; error?: string }> = {};

    // Check Supabase
    try {
        const dbStart = Date.now();
        const { error } = await supabase.from('roofing_leads').select('id').limit(1);
        checks.supabase = error
            ? { status: 'error', error: error.message }
            : { status: 'ok', latency: Date.now() - dbStart };
    } catch (e: any) {
        checks.supabase = { status: 'error', error: e.message };
    }

    // Check Retell API
    try {
        const retellStart = Date.now();
        const response = await fetch('https://api.retellai.com/v2/agent', {
            headers: { 'Authorization': `Bearer ${process.env.RETELL_API_KEY}` }
        });
        checks.retell = response.ok
            ? { status: 'ok', latency: Date.now() - retellStart }
            : { status: 'error', error: `HTTP ${response.status}` };
    } catch (e: any) {
        checks.retell = { status: 'error', error: e.message };
    }

    // Check Mem0 API
    if (process.env.MEM0_API_KEY) {
        try {
            const mem0Start = Date.now();
            const response = await fetch('https://api.mem0.ai/v1/memories/?user_id=health_check&limit=1', {
                headers: { 'Authorization': `Token ${process.env.MEM0_API_KEY}` }
            });
            checks.mem0 = response.ok
                ? { status: 'ok', latency: Date.now() - mem0Start }
                : { status: 'error', error: `HTTP ${response.status}` };
        } catch (e: any) {
            checks.mem0 = { status: 'error', error: e.message };
        }
    } else {
        checks.mem0 = { status: 'not_configured' };
    }

    // Check JobNimbus API
    if (process.env.JOBNIMBUS_API_KEY) {
        try {
            const jnStart = Date.now();
            const response = await fetch('https://app.jobnimbus.com/api1/contacts?limit=1', {
                headers: { 'Authorization': `Bearer ${process.env.JOBNIMBUS_API_KEY}` }
            });
            checks.jobnimbus = response.ok
                ? { status: 'ok', latency: Date.now() - jnStart }
                : { status: 'error', error: `HTTP ${response.status}` };
        } catch (e: any) {
            checks.jobnimbus = { status: 'error', error: e.message };
        }
    } else {
        checks.jobnimbus = { status: 'not_configured' };
    }

    // Check Redis/Queue
    try {
        const { getQueues } = await import('../../queues');
        const queues = getQueues();
        checks.redis = queues
            ? { status: 'ok' }
            : { status: 'error', error: 'Queue not initialized' };
    } catch (e: any) {
        checks.redis = { status: 'error', error: e.message };
    }

    // Determine overall status
    const hasErrors = Object.values(checks).some(c => c.status === 'error');
    const allOk = Object.values(checks).every(c => c.status === 'ok' || c.status === 'not_configured');

    // Alert if there are errors
    if (hasErrors) {
        const failedServices = Object.entries(checks)
            .filter(([_, v]) => v.status === 'error')
            .map(([k, v]) => `${k}: ${v.error}`)
            .join(', ');
        await slack.alertHealthIssue('Multiple Services', failedServices);
    }

    res.status(allOk ? 200 : 503).json({
        status: allOk ? 'healthy' : 'degraded',
        service: 'roofing-voice-agent',
        timestamp: new Date().toISOString(),
        totalLatency: Date.now() - startTime,
        checks
    });
});

export default router;
