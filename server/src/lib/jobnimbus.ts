/**
 * JobNimbus CRM API Client
 *
 * Integrates with JobNimbus CRM for Roofing Pros USA
 * Handles contact creation, job management, and appointment scheduling.
 *
 * API Documentation: https://documenter.getpostman.com/view/3919598/S11PpG4x
 */

import axios, { AxiosInstance } from 'axios';
import { logger } from './logger';

// ============================================================================
// TYPES
// ============================================================================

export interface JobNimbusContact {
    jnid?: string;
    first_name: string;
    last_name: string;
    display_name?: string;
    company?: string;
    email?: string;
    home_phone?: string;
    mobile_phone?: string;
    work_phone?: string;
    fax_number?: string;
    address_line1?: string;
    address_line2?: string;
    city?: string;
    state_text?: string;
    zip?: string;
    country?: string;
    source_name?: string;
    status_name?: string;
    tags?: string[];
    description?: string;
    date_created?: number;
    date_updated?: number;
}

export interface JobNimbusJob {
    jnid?: string;
    name?: string;
    number?: string;
    description?: string;
    status_name?: string;
    primary?: string; // Contact jnid
    sales_rep?: string;
    address_line1?: string;
    address_line2?: string;
    city?: string;
    state_text?: string;
    zip?: string;
    source_name?: string;
    tags?: string[];
    date_start?: number;
    date_end?: number;
    record_type_name?: string;
    date_created?: number;
    date_updated?: number;
}

export interface JobNimbusTask {
    jnid?: string;
    title: string;
    description?: string;
    is_completed?: boolean;
    date_start?: number;
    date_end?: number;
    primary?: string; // Contact or Job jnid
    related?: string[]; // Related record jnids
    assigned?: string[]; // User jnids
    reminder?: number;
    record_type_name?: string;
}

export interface CreateContactParams {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    source?: string;
    tags?: string[];
    notes?: string;
}

export interface CreateJobParams {
    contactId: string;
    name?: string;
    description?: string;
    status?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    source?: string;
    tags?: string[];
}

export interface CreateTaskParams {
    title: string;
    contactId?: string;
    jobId?: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    assignedTo?: string[];
}

// ============================================================================
// JOBNIMBUS SERVICE
// ============================================================================

class JobNimbusService {
    private client: AxiosInstance;
    private apiKey: string;
    private baseUrl: string = 'https://app.jobnimbus.com/api1';

    constructor() {
        this.apiKey = process.env.JOBNIMBUS_API_KEY || '';
        this.client = axios.create({
            baseURL: this.baseUrl,
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            }
        });
    }

    /**
     * Check if JobNimbus is configured
     */
    isConfigured(): boolean {
        return !!this.apiKey;
    }

    // ========================================================================
    // CONTACTS
    // ========================================================================

    /**
     * Create a new contact in JobNimbus
     */
    async createContact(params: CreateContactParams): Promise<{
        success: boolean;
        contact?: JobNimbusContact;
        error?: string;
    }> {
        if (!this.isConfigured()) {
            logger.warn('⚠️ JOBNIMBUS_API_KEY not configured. Contact not created.');
            return { success: false, error: 'JOBNIMBUS_API_KEY not configured' };
        }

        try {
            const payload: Partial<JobNimbusContact> = {
                first_name: params.firstName,
                last_name: params.lastName,
                mobile_phone: this.formatPhone(params.phone),
                email: params.email,
                address_line1: params.address,
                city: params.city,
                state_text: params.state,
                zip: params.zip,
                source_name: params.source || 'AI Voice Agent',
                tags: params.tags || ['AI Lead'],
                description: params.notes
            };

            const response = await this.client.post('/contacts', payload);

            logger.info(`✅ JobNimbus: Created contact ${response.data.jnid}`);
            return { success: true, contact: response.data };

        } catch (error: any) {
            logger.error('❌ JobNimbus createContact error:', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data?.message || error.message
            };
        }
    }

    /**
     * Search for a contact by phone number
     */
    async findContactByPhone(phone: string): Promise<{
        success: boolean;
        contact?: JobNimbusContact;
        error?: string;
    }> {
        if (!this.isConfigured()) {
            return { success: false, error: 'JOBNIMBUS_API_KEY not configured' };
        }

        try {
            const formattedPhone = this.formatPhone(phone);
            // JobNimbus search syntax
            const response = await this.client.get('/contacts', {
                params: {
                    filter: `mobile_phone:${formattedPhone} OR home_phone:${formattedPhone}`
                }
            });

            const contacts = response.data.results || [];
            if (contacts.length > 0) {
                logger.info(`✅ JobNimbus: Found contact ${contacts[0].jnid}`);
                return { success: true, contact: contacts[0] };
            }

            return { success: true, contact: undefined };

        } catch (error: any) {
            logger.error('❌ JobNimbus findContactByPhone error:', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data?.message || error.message
            };
        }
    }

    /**
     * Update an existing contact
     */
    async updateContact(
        contactId: string,
        updates: Partial<CreateContactParams>
    ): Promise<{ success: boolean; contact?: JobNimbusContact; error?: string }> {
        if (!this.isConfigured()) {
            return { success: false, error: 'JOBNIMBUS_API_KEY not configured' };
        }

        try {
            const payload: Partial<JobNimbusContact> = {};

            if (updates.firstName) payload.first_name = updates.firstName;
            if (updates.lastName) payload.last_name = updates.lastName;
            if (updates.phone) payload.mobile_phone = this.formatPhone(updates.phone);
            if (updates.email) payload.email = updates.email;
            if (updates.address) payload.address_line1 = updates.address;
            if (updates.city) payload.city = updates.city;
            if (updates.state) payload.state_text = updates.state;
            if (updates.zip) payload.zip = updates.zip;
            if (updates.tags) payload.tags = updates.tags;
            if (updates.notes) payload.description = updates.notes;

            const response = await this.client.put(`/contacts/${contactId}`, payload);

            logger.info(`✅ JobNimbus: Updated contact ${contactId}`);
            return { success: true, contact: response.data };

        } catch (error: any) {
            logger.error('❌ JobNimbus updateContact error:', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data?.message || error.message
            };
        }
    }

    // ========================================================================
    // JOBS
    // ========================================================================

    /**
     * Create a new job (project) linked to a contact
     */
    async createJob(params: CreateJobParams): Promise<{
        success: boolean;
        job?: JobNimbusJob;
        error?: string;
    }> {
        if (!this.isConfigured()) {
            return { success: false, error: 'JOBNIMBUS_API_KEY not configured' };
        }

        try {
            const payload: Partial<JobNimbusJob> = {
                primary: params.contactId,
                name: params.name || 'Roof Inspection',
                description: params.description,
                status_name: params.status || 'Inspection Scheduled',
                address_line1: params.address,
                city: params.city,
                state_text: params.state,
                zip: params.zip,
                source_name: params.source || 'AI Voice Agent',
                tags: params.tags || ['AI Lead', 'Inspection'],
                record_type_name: 'job'
            };

            const response = await this.client.post('/jobs', payload);

            logger.info(`✅ JobNimbus: Created job ${response.data.jnid}`);
            return { success: true, job: response.data };

        } catch (error: any) {
            logger.error('❌ JobNimbus createJob error:', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data?.message || error.message
            };
        }
    }

    /**
     * Update job status
     */
    async updateJobStatus(
        jobId: string,
        status: string
    ): Promise<{ success: boolean; job?: JobNimbusJob; error?: string }> {
        if (!this.isConfigured()) {
            return { success: false, error: 'JOBNIMBUS_API_KEY not configured' };
        }

        try {
            const response = await this.client.put(`/jobs/${jobId}`, {
                status_name: status
            });

            logger.info(`✅ JobNimbus: Updated job ${jobId} status to ${status}`);
            return { success: true, job: response.data };

        } catch (error: any) {
            logger.error('❌ JobNimbus updateJobStatus error:', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data?.message || error.message
            };
        }
    }

    // ========================================================================
    // TASKS (Appointments)
    // ========================================================================

    /**
     * Create a task/appointment
     */
    async createTask(params: CreateTaskParams): Promise<{
        success: boolean;
        task?: JobNimbusTask;
        error?: string;
    }> {
        if (!this.isConfigured()) {
            return { success: false, error: 'JOBNIMBUS_API_KEY not configured' };
        }

        try {
            const related: string[] = [];
            if (params.contactId) related.push(params.contactId);
            if (params.jobId) related.push(params.jobId);

            const payload: Partial<JobNimbusTask> = {
                title: params.title,
                description: params.description,
                primary: params.jobId || params.contactId,
                related: related,
                is_completed: false,
                record_type_name: 'task'
            };

            // Convert dates to Unix timestamps
            if (params.startDate) {
                payload.date_start = Math.floor(params.startDate.getTime() / 1000);
            }
            if (params.endDate) {
                payload.date_end = Math.floor(params.endDate.getTime() / 1000);
            }

            if (params.assignedTo && params.assignedTo.length > 0) {
                payload.assigned = params.assignedTo;
            }

            const response = await this.client.post('/tasks', payload);

            logger.info(`✅ JobNimbus: Created task ${response.data.jnid}`);
            return { success: true, task: response.data };

        } catch (error: any) {
            logger.error('❌ JobNimbus createTask error:', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data?.message || error.message
            };
        }
    }

    // ========================================================================
    // CONVENIENCE METHODS FOR ROOFING
    // ========================================================================

    /**
     * Complete workflow: Create contact, job, and inspection appointment
     */
    async createRoofingLead(data: {
        firstName: string;
        lastName: string;
        phone: string;
        email?: string;
        address: string;
        city?: string;
        state?: string;
        zip: string;
        roofIssue: string;
        stormDamage: boolean;
        insuranceClaimFiled: boolean;
        appointmentDate: Date;
        appointmentEndDate?: Date;
        urgency: string;
        notes?: string;
    }): Promise<{
        success: boolean;
        contactId?: string;
        jobId?: string;
        taskId?: string;
        error?: string;
    }> {
        // Step 1: Check for existing contact
        let contactId: string | undefined;
        const existingContact = await this.findContactByPhone(data.phone);

        if (existingContact.success && existingContact.contact && existingContact.contact.jnid) {
            contactId = existingContact.contact.jnid;
            logger.info(`📋 Found existing contact: ${contactId}`);

            // Update with latest info
            await this.updateContact(contactId as string, {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                address: data.address,
                city: data.city,
                state: data.state,
                zip: data.zip
            });
        } else {
            // Create new contact
            const tags = ['AI Lead'];
            if (data.stormDamage) tags.push('Storm Damage');
            if (data.urgency === 'emergency') tags.push('Emergency');
            if (data.insuranceClaimFiled) tags.push('Insurance Claim');

            const contactResult = await this.createContact({
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
                email: data.email,
                address: data.address,
                city: data.city,
                state: data.state,
                zip: data.zip,
                source: 'AI Voice Agent - Inbound',
                tags,
                notes: data.notes
            });

            if (!contactResult.success) {
                return { success: false, error: contactResult.error };
            }
            contactId = contactResult.contact?.jnid;
        }

        if (!contactId) {
            return { success: false, error: 'Failed to create or find contact' };
        }

        // Step 2: Create job
        const jobTags = ['AI Lead', 'Inspection'];
        if (data.stormDamage) jobTags.push('Storm Damage');

        const jobDescription = [
            `Issue: ${data.roofIssue}`,
            `Storm Damage: ${data.stormDamage ? 'Yes' : 'No'}`,
            `Insurance Claim: ${data.insuranceClaimFiled ? 'Filed' : 'Not Filed'}`,
            `Urgency: ${data.urgency}`,
            data.notes ? `Notes: ${data.notes}` : ''
        ].filter(Boolean).join('\n');

        const jobResult = await this.createJob({
            contactId,
            name: `Roof Inspection - ${data.firstName} ${data.lastName}`,
            description: jobDescription,
            status: 'Inspection Scheduled',
            address: data.address,
            city: data.city,
            state: data.state,
            zip: data.zip,
            tags: jobTags
        });

        if (!jobResult.success) {
            return {
                success: false,
                contactId,
                error: jobResult.error
            };
        }

        const jobId = jobResult.job?.jnid;

        // Step 3: Create inspection appointment
        const endDate = data.appointmentEndDate ||
            new Date(data.appointmentDate.getTime() + 45 * 60 * 1000); // 45 min default

        const taskResult = await this.createTask({
            title: `Roof Inspection - ${data.address}`,
            contactId,
            jobId,
            description: `Free roof inspection scheduled via AI Voice Agent.\n\n${jobDescription}`,
            startDate: data.appointmentDate,
            endDate
        });

        return {
            success: true,
            contactId,
            jobId,
            taskId: taskResult.task?.jnid,
            error: taskResult.error
        };
    }

    // ========================================================================
    // UTILITIES
    // ========================================================================

    /**
     * Format phone number for JobNimbus (E.164)
     */
    private formatPhone(phone: string): string {
        const digits = phone.replace(/\D/g, '');
        if (digits.length === 10) {
            return `+1${digits}`;
        }
        if (digits.length === 11 && digits.startsWith('1')) {
            return `+${digits}`;
        }
        return phone; // Return original if can't parse
    }

    /**
     * Determine office location from zip code
     */
    getOfficeFromZip(zip: string): string {
        const prefix = zip.substring(0, 3);

        const zipMapping: Record<string, string> = {
            '322': 'jacksonville',
            '328': 'orlando',
            '327': 'orlando',
            '347': 'orlando',
            '336': 'tampa',
            '335': 'tampa',
            '346': 'tampa',
            '325': 'pensacola',
            '334': 'west_palm_beach',
            '331': 'west_palm_beach',
            '321': 'daytona_beach',
            '320': 'daytona_beach',
            '329': 'melbourne'
        };

        return zipMapping[prefix] || 'jacksonville'; // Default to Jacksonville
    }
}

// Export singleton instance
export const jobNimbus = new JobNimbusService();
