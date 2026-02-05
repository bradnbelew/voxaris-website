/**
 * Roofing Pros USA - Webhook Controller
 *
 * Handles webhooks from:
 * - Retell AI (call completed, call started, voicemail)
 * - Form submissions (Google Ads, Facebook, Website)
 */

import { Router, Request, Response } from 'express';
import Retell from 'retell-sdk';
import { logger } from '../../lib/logger';
import { roofingService, CallCompletedData, FormSubmissionData } from './roofing.service';
import { mem0 } from '../../lib/mem0';
import { supabase } from '../../lib/supabase';

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

        // Validate webhook signature (recommended for production)
        // const isValid = Retell.verify(
        //   JSON.stringify(req.body),
        //   process.env.RETELL_WEBHOOK_SECRET!,
        //   req.headers['x-retell-signature'] as string
        // );
        // if (!isValid) {
        //   logger.warn('⚠️ Invalid webhook signature');
        //   return res.status(401).json({ error: 'Invalid signature' });
        // }

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
    } else {
        logger.error(`❌ Call processing failed: ${result.error}`);
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
router.post('/forms/roofing', async (req: Request, res: Response) => {
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
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/webhooks/forms/roofing/google-ads
 *
 * Specific handler for Google Ads lead form extensions
 */
router.post('/forms/roofing/google-ads', async (req: Request, res: Response) => {
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
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/webhooks/forms/roofing/facebook
 *
 * Specific handler for Facebook Lead Ads
 */
router.post('/forms/roofing/facebook', async (req: Request, res: Response) => {
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
// HEALTH CHECK
// ============================================================================

/**
 * GET /api/roofing/health
 */
router.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'ok',
        service: 'roofing-voice-agent',
        timestamp: new Date().toISOString(),
        config: {
            mem0Configured: mem0.isConfigured(),
            retellConfigured: !!process.env.RETELL_API_KEY,
            jobNimbusConfigured: !!process.env.JOBNIMBUS_API_KEY
        }
    });
});

export default router;
