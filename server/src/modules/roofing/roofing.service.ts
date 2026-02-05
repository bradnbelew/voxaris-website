/**
 * Roofing Pros USA - Voice Agent Service
 *
 * Business logic for handling roofing voice agent operations:
 * - Post-call data processing
 * - CRM integration (JobNimbus)
 * - Memory management (Mem0)
 * - Follow-up scheduling
 */

import { logger } from '../../lib/logger';
import { mem0 } from '../../lib/mem0';
import { jobNimbus } from '../../lib/jobnimbus';
import { sendRoofingLeadEmail } from '../../lib/resend';
import { supabase } from '../../lib/supabase';
import { retell } from '../../lib/retell';
import { startFollowupSequence, cancelFollowupsForPhone } from '../../queues/roofing-followup.processor';

// ============================================================================
// TYPES
// ============================================================================

export interface CallCompletedData {
    call_id: string;
    agent_id: string;
    call_status: 'ended' | 'transferred' | 'voicemail' | 'error';
    start_timestamp: number;
    end_timestamp: number;
    duration_ms: number;
    from_number: string;
    to_number: string;
    direction: 'inbound' | 'outbound';
    disconnection_reason: string;

    // Custom analysis data extracted from call
    call_analysis?: {
        appointment_scheduled?: boolean;
        customer_name?: string;
        property_address?: string;
        customer_phone?: string;
        customer_email?: string;
        roof_issue?: string;
        storm_damage?: boolean;
        insurance_claim_filed?: boolean;
        wants_insurance_help?: boolean;
        is_homeowner?: boolean;
        urgency_level?: string;
        appointment_date?: string;
        office_location?: string;
        call_outcome?: string;
        call_summary?: string;
        lead_quality?: string;
    };

    // Transcript (if enabled)
    transcript?: string;
    transcript_object?: Array<{
        role: 'agent' | 'user';
        content: string;
        words?: Array<{ word: string; start: number; end: number }>;
    }>;

    // Recording URL (if enabled)
    recording_url?: string;
}

export interface FormSubmissionData {
    source: 'google_ads' | 'facebook' | 'website' | 'other';
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    message?: string;
    roofIssue?: string;
    timestamp: Date;
}

export interface ProcessCallResult {
    success: boolean;
    contactId?: string;
    jobId?: string;
    taskId?: string;
    leadId?: string;
    memoryStored?: boolean;
    emailSent?: boolean;
    error?: string;
}

// Email recipient for lead notifications
const LEAD_NOTIFICATION_EMAIL = process.env.ROOFING_LEAD_EMAIL || 'leads@roofingprosusa.com';

// ============================================================================
// ROOFING SERVICE
// ============================================================================

class RoofingService {

    /**
     * Process a completed inbound or outbound call
     */
    async processCompletedCall(data: CallCompletedData): Promise<ProcessCallResult> {
        const analysis = data.call_analysis || {};
        const phone = data.from_number || data.to_number;

        logger.info(`📞 Processing call ${data.call_id} from ${phone}`);
        logger.info(`   Outcome: ${analysis.call_outcome || 'unknown'}`);
        logger.info(`   Appointment: ${analysis.appointment_scheduled ? 'Yes' : 'No'}`);

        const result: ProcessCallResult = { success: true };

        try {
            // Step 1: Store memory in Mem0 for future calls
            if (phone) {
                const memoryResult = await this.storeCallMemory(phone, data);
                result.memoryStored = memoryResult.success;
            }

            // Step 2: If appointment was scheduled, create in JobNimbus and cancel follow-ups
            if (analysis.appointment_scheduled && analysis.customer_name) {
                const crmResult = await this.createCRMRecords(data);
                result.contactId = crmResult.contactId;
                result.jobId = crmResult.jobId;
                result.taskId = crmResult.taskId;

                if (!crmResult.success) {
                    result.error = crmResult.error;
                }

                // Cancel any pending follow-up calls since appointment is booked
                await cancelFollowupsForPhone(phone);
                logger.info(`🗑️ Cancelled pending follow-ups for ${phone} - appointment scheduled`);
            }

            // Step 3: If call went to voicemail or was unsuccessful, schedule follow-up
            if (data.call_status === 'voicemail' || analysis.call_outcome === 'callback_requested') {
                await this.scheduleFollowUp(phone, data);
            }

            // Step 4: Save lead to Supabase
            const leadResult = await this.saveLeadToDatabase(data);
            result.leadId = leadResult.leadId;

            // Step 5: Send email notification
            const emailResult = await this.sendLeadNotification(data);
            result.emailSent = emailResult.success;

            // Step 6: Log analytics
            await this.logCallAnalytics(data);

            logger.info(`✅ Call ${data.call_id} processed successfully`);
            return result;

        } catch (error: any) {
            logger.error(`❌ Error processing call ${data.call_id}:`, error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Store call details in Mem0 for future reference
     */
    private async storeCallMemory(
        phone: string,
        data: CallCompletedData
    ): Promise<{ success: boolean; error?: string }> {
        const analysis = data.call_analysis || {};

        try {
            const result = await mem0.storeCallSummary(phone, {
                name: analysis.customer_name,
                address: analysis.property_address,
                roofIssue: analysis.roof_issue,
                stormDamage: analysis.storm_damage,
                insuranceClaim: analysis.insurance_claim_filed,
                appointmentScheduled: analysis.appointment_scheduled,
                appointmentDate: analysis.appointment_date,
                outcome: analysis.call_outcome,
                concerns: analysis.roof_issue ? [analysis.roof_issue] : []
            });

            if (result.success) {
                logger.info(`🧠 Mem0: Stored memory for ${phone}`);
            }

            return result;

        } catch (error: any) {
            logger.error('❌ Mem0 storage error:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Create contact, job, and appointment in JobNimbus
     */
    private async createCRMRecords(data: CallCompletedData): Promise<ProcessCallResult> {
        const analysis = data.call_analysis || {};

        if (!analysis.customer_name || !analysis.property_address) {
            logger.warn('⚠️ Missing required fields for CRM creation');
            return { success: false, error: 'Missing customer name or address' };
        }

        // Parse name
        const nameParts = analysis.customer_name.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        // Parse address for city/state/zip
        const addressParts = this.parseAddress(analysis.property_address);

        // Parse appointment date
        let appointmentDate = new Date();
        if (analysis.appointment_date) {
            const parsed = this.parseAppointmentDate(analysis.appointment_date);
            if (parsed) appointmentDate = parsed;
        }

        // Create in JobNimbus
        const result = await jobNimbus.createRoofingLead({
            firstName,
            lastName,
            phone: data.from_number || analysis.customer_phone || '',
            email: analysis.customer_email,
            address: addressParts.street,
            city: addressParts.city,
            state: addressParts.state || 'FL',
            zip: addressParts.zip || '',
            roofIssue: analysis.roof_issue || 'General Inspection',
            stormDamage: analysis.storm_damage || false,
            insuranceClaimFiled: analysis.insurance_claim_filed || false,
            appointmentDate,
            urgency: analysis.urgency_level || 'normal',
            notes: analysis.call_summary
        });

        return result;
    }

    /**
     * Schedule follow-up for voicemail or callback requests
     */
    private async scheduleFollowUp(
        phone: string,
        data: CallCompletedData
    ): Promise<void> {
        logger.info(`📅 Scheduling follow-up for ${phone}`);

        // TODO: Implement BullMQ queue for follow-up cadence
        // Cadence: immediate → 15min → next day → day 3 → day 7

        // For now, just log the intent
        const followUpPlan = {
            phone,
            call_id: data.call_id,
            reason: data.call_status === 'voicemail' ? 'voicemail' : 'callback_requested',
            scheduled_attempts: [
                { delay_minutes: 15, attempt: 1 },
                { delay_minutes: 60 * 24, attempt: 2 },    // Next day
                { delay_minutes: 60 * 24 * 3, attempt: 3 }, // Day 3
                { delay_minutes: 60 * 24 * 7, attempt: 4 }  // Day 7
            ]
        };

        logger.info(`📋 Follow-up plan:`, JSON.stringify(followUpPlan, null, 2));

        // TODO: Add to BullMQ queue
        // await followUpQueue.add('roofing-followup', followUpPlan, {
        //   delay: 15 * 60 * 1000 // 15 minutes
        // });
    }

    /**
     * Save lead to Supabase database
     */
    private async saveLeadToDatabase(data: CallCompletedData): Promise<{ success: boolean; leadId?: string; error?: string }> {
        const analysis = data.call_analysis || {};

        try {
            const leadData = {
                call_id: data.call_id,
                customer_name: analysis.customer_name || null,
                customer_phone: data.from_number || analysis.customer_phone || null,
                customer_email: analysis.customer_email || null,
                property_address: analysis.property_address || null,
                roof_issue: analysis.roof_issue || null,
                storm_damage: analysis.storm_damage || false,
                insurance_claim_filed: analysis.insurance_claim_filed || false,
                wants_insurance_help: analysis.wants_insurance_help || false,
                is_homeowner: analysis.is_homeowner || null,
                urgency_level: analysis.urgency_level || null,
                appointment_scheduled: analysis.appointment_scheduled || false,
                appointment_date: analysis.appointment_date || null,
                office_location: analysis.office_location || null,
                call_outcome: analysis.call_outcome || null,
                call_summary: analysis.call_summary || null,
                lead_quality: analysis.lead_quality || null,
                recording_url: data.recording_url || null,
                direction: data.direction,
                duration_ms: data.duration_ms,
                email_sent: false
            };

            const { data: insertedLead, error } = await supabase
                .from('roofing_leads')
                .insert(leadData)
                .select('id')
                .single();

            if (error) {
                logger.error('❌ Failed to save lead to database:', error.message);
                return { success: false, error: error.message };
            }

            logger.info(`💾 Lead saved to database: ${insertedLead?.id}`);
            return { success: true, leadId: insertedLead?.id };

        } catch (error: any) {
            logger.error('❌ Database error:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Send email notification for new lead
     */
    private async sendLeadNotification(data: CallCompletedData): Promise<{ success: boolean; error?: string }> {
        const analysis = data.call_analysis || {};

        try {
            const emailResult = await sendRoofingLeadEmail({
                to: LEAD_NOTIFICATION_EMAIL,
                customerName: analysis.customer_name,
                customerPhone: data.from_number || analysis.customer_phone,
                customerEmail: analysis.customer_email,
                propertyAddress: analysis.property_address,
                roofIssue: analysis.roof_issue,
                stormDamage: analysis.storm_damage,
                insuranceClaimFiled: analysis.insurance_claim_filed,
                wantsInsuranceHelp: analysis.wants_insurance_help,
                isHomeowner: analysis.is_homeowner,
                urgencyLevel: analysis.urgency_level,
                appointmentScheduled: analysis.appointment_scheduled,
                appointmentDate: analysis.appointment_date,
                officeLocation: analysis.office_location,
                callOutcome: analysis.call_outcome,
                callSummary: analysis.call_summary,
                leadQuality: analysis.lead_quality,
                recordingUrl: data.recording_url,
                callId: data.call_id,
                timestamp: new Date()
            });

            if (emailResult.success) {
                // Update database to mark email as sent
                await supabase
                    .from('roofing_leads')
                    .update({ email_sent: true })
                    .eq('call_id', data.call_id);

                logger.info(`📧 Lead notification email sent`);
            }

            return emailResult;

        } catch (error: any) {
            logger.error('❌ Email notification error:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Log call analytics for dashboard
     */
    private async logCallAnalytics(data: CallCompletedData): Promise<void> {
        const analysis = data.call_analysis || {};

        const analytics = {
            call_id: data.call_id,
            timestamp: new Date().toISOString(),
            direction: data.direction,
            duration_seconds: Math.round(data.duration_ms / 1000),
            outcome: analysis.call_outcome || data.call_status,
            appointment_booked: analysis.appointment_scheduled || false,
            lead_quality: analysis.lead_quality || 'unknown',
            office: analysis.office_location || 'unknown',
            storm_damage: analysis.storm_damage || false,
            has_insurance_claim: analysis.insurance_claim_filed || false
        };

        logger.info(`📊 Call Analytics:`, JSON.stringify(analytics));

        // TODO: Store in Supabase for dashboard
        // await supabase.from('roofing_call_analytics').insert(analytics);
    }

    /**
     * Handle incoming form submission and trigger outbound call
     */
    async handleFormSubmission(data: FormSubmissionData): Promise<{
        success: boolean;
        callId?: string;
        error?: string;
    }> {
        logger.info(`📝 Form submission from ${data.source}: ${data.firstName} ${data.lastName}`);

        try {
            // Step 1: Check Mem0 for existing customer
            const memories = await mem0.getByPhone(data.phone);
            let memoryContext = '';

            if (memories.success && memories.memories && memories.memories.length > 0) {
                memoryContext = mem0.formatMemoriesForAgent(memories.memories);
                logger.info(`🧠 Found existing memories for ${data.phone}`);
            }

            // Step 2: Start the follow-up sequence (6 attempts over 7 days)
            // Cadence: Immediate → 15min → 2 hours → Next day → Day 3 → Day 7
            const followupResult = await startFollowupSequence({
                phone: data.phone,
                customerName: `${data.firstName} ${data.lastName}`,
                email: data.email,
                address: data.address,
                roofIssue: data.roofIssue || data.message,
                source: data.source
            });

            if (followupResult.success) {
                logger.info(`🚀 Follow-up sequence started for ${data.phone}`);
            } else {
                logger.warn(`⚠️ Failed to start follow-up sequence: ${followupResult.error}`);
            }

            return {
                success: followupResult.success,
                error: followupResult.error
            };

        } catch (error: any) {
            logger.error('❌ Error handling form submission:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Make a direct outbound call (for testing/demo)
     */
    async makeOutboundCall(params: {
        toNumber: string;
        customerName?: string;
        context?: string;
    }): Promise<{ success: boolean; callId?: string; error?: string }> {
        logger.info(`📞 Making direct outbound call to ${params.toNumber}`);

        try {
            // Check for existing customer memory
            const memories = await mem0.getByPhone(params.toNumber);
            let memoryContext = params.context || '';

            if (memories.success && memories.memories && memories.memories.length > 0) {
                memoryContext = mem0.formatMemoriesForAgent(memories.memories);
                logger.info(`🧠 Found existing memories for ${params.toNumber}`);
            }

            const callResult = await retell.createOutboundCall({
                fromNumber: process.env.ROOFING_OUTBOUND_PHONE || '+14072891565',
                toNumber: params.toNumber,
                agentId: process.env.ROOFING_OUTBOUND_AGENT_ID || process.env.ROOFING_RETELL_AGENT_ID || '',
                dynamicVariables: {
                    customer_name: params.customerName || 'Valued Customer',
                    memory_context: memoryContext
                }
            });

            if (callResult.success) {
                logger.info(`✅ Outbound call initiated: ${callResult.callId}`);
            } else {
                logger.error(`❌ Failed to initiate call: ${callResult.error}`);
            }

            return callResult;

        } catch (error: any) {
            logger.error('❌ Error making outbound call:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get caller memory context before call starts
     */
    async getCallerContext(phone: string): Promise<string> {
        try {
            const memories = await mem0.getByPhone(phone);

            if (memories.success && memories.memories && memories.memories.length > 0) {
                return mem0.formatMemoriesForAgent(memories.memories);
            }

            return '';

        } catch (error: any) {
            logger.error('❌ Error getting caller context:', error.message);
            return '';
        }
    }

    // ========================================================================
    // UTILITY METHODS
    // ========================================================================

    /**
     * Parse an address string into components
     */
    private parseAddress(address: string): {
        street: string;
        city: string;
        state: string;
        zip: string;
    } {
        // Basic address parsing - can be enhanced with a geocoding service
        const result = {
            street: address,
            city: '',
            state: 'FL',
            zip: ''
        };

        // Try to extract zip code
        const zipMatch = address.match(/\b(\d{5})(?:-\d{4})?\b/);
        if (zipMatch) {
            result.zip = zipMatch[1];
        }

        // Try to extract city, state from comma-separated format
        const parts = address.split(',').map(p => p.trim());
        if (parts.length >= 3) {
            result.street = parts[0];
            result.city = parts[1];
            // State and zip in last part
            const stateZip = parts[2].trim();
            const stateMatch = stateZip.match(/^([A-Z]{2})\s+(\d{5})/);
            if (stateMatch) {
                result.state = stateMatch[1];
                result.zip = stateMatch[2];
            }
        } else if (parts.length === 2) {
            result.street = parts[0];
            result.city = parts[1];
        }

        return result;
    }

    /**
     * Parse appointment date from natural language
     */
    private parseAppointmentDate(dateStr: string): Date | null {
        // Handle common formats
        // "Tuesday, January fifteenth in the morning"
        // "next Monday afternoon"
        // "tomorrow at 9 AM"

        const now = new Date();
        const lowerStr = dateStr.toLowerCase();

        // Morning slot default: 9 AM
        // Afternoon slot default: 1 PM
        let hours = 9;
        if (lowerStr.includes('afternoon')) {
            hours = 13;
        } else if (lowerStr.includes('morning')) {
            hours = 9;
        }

        // Try to parse specific times
        const timeMatch = lowerStr.match(/(\d{1,2})\s*(am|pm)/i);
        if (timeMatch) {
            hours = parseInt(timeMatch[1]);
            if (timeMatch[2].toLowerCase() === 'pm' && hours !== 12) {
                hours += 12;
            }
        }

        // Handle relative dates
        if (lowerStr.includes('tomorrow')) {
            const date = new Date(now);
            date.setDate(date.getDate() + 1);
            date.setHours(hours, 0, 0, 0);
            return date;
        }

        // Handle day of week
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        for (let i = 0; i < days.length; i++) {
            if (lowerStr.includes(days[i])) {
                const date = new Date(now);
                const currentDay = date.getDay();
                let daysUntil = i - currentDay;
                if (daysUntil <= 0) daysUntil += 7; // Next week
                date.setDate(date.getDate() + daysUntil);
                date.setHours(hours, 0, 0, 0);
                return date;
            }
        }

        // Try native Date parsing as fallback
        const parsed = new Date(dateStr);
        if (!isNaN(parsed.getTime())) {
            return parsed;
        }

        // Default to tomorrow at the determined hour
        const defaultDate = new Date(now);
        defaultDate.setDate(defaultDate.getDate() + 1);
        defaultDate.setHours(hours, 0, 0, 0);
        return defaultDate;
    }
}

// Export singleton instance
export const roofingService = new RoofingService();
