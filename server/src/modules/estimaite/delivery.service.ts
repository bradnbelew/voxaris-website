/**
 * EstimAIte - Delivery Service
 *
 * Handles multi-channel delivery of estimates:
 * - Email with branded HTML
 * - SMS with short link
 * - Dashboard notification
 */

import { Resend } from 'resend';
import { logger } from '../../lib/logger';
import { supabase } from '../../lib/supabase';
import { Estimate } from './estimaite.types';
import { pdfService } from './pdf.service';

// ============================================================================
// DELIVERY SERVICE
// ============================================================================

class DeliveryService {
    private resend: Resend;
    private fromEmail: string;
    private baseUrl: string;

    constructor() {
        this.resend = new Resend(process.env.RESEND_API_KEY);
        this.fromEmail = process.env.RESEND_FROM_EMAIL || 'Roofing Pros USA <estimates@voxaris.io>';
        this.baseUrl = process.env.APP_BASE_URL || 'https://roofingprosusa-fl.com';
    }

    /**
     * Deliver estimate via all configured channels
     */
    async deliverEstimate(
        estimate: Estimate,
        options: {
            email?: boolean;
            sms?: boolean;
            notify?: boolean;
        } = { email: true, sms: true, notify: true }
    ): Promise<{
        success: boolean;
        emailSent?: boolean;
        smsSent?: boolean;
        notificationSent?: boolean;
        errors?: string[];
    }> {
        const errors: string[] = [];
        const results = {
            success: true,
            emailSent: false,
            smsSent: false,
            notificationSent: false,
            errors
        };

        // Send email
        if (options.email && estimate.request.customerEmail) {
            const emailResult = await this.sendEstimateEmail(estimate);
            results.emailSent = emailResult.success;
            if (!emailResult.success) {
                errors.push(`Email: ${emailResult.error}`);
            }
        }

        // Send SMS
        if (options.sms && estimate.request.customerPhone) {
            const smsResult = await this.sendEstimateSMS(estimate);
            results.smsSent = smsResult.success;
            if (!smsResult.success) {
                errors.push(`SMS: ${smsResult.error}`);
            }
        }

        // Send internal notification
        if (options.notify) {
            const notifyResult = await this.sendInternalNotification(estimate);
            results.notificationSent = notifyResult.success;
            if (!notifyResult.success) {
                errors.push(`Notification: ${notifyResult.error}`);
            }
        }

        // Update estimate status
        if (results.emailSent || results.smsSent) {
            await this.updateEstimateDelivery(estimate.id, {
                status: 'sent',
                emailSent: results.emailSent,
                smsSent: results.smsSent
            });
        }

        results.success = errors.length === 0;
        return results;
    }

    /**
     * Send estimate via email
     */
    async sendEstimateEmail(estimate: Estimate): Promise<{
        success: boolean;
        messageId?: string;
        error?: string;
    }> {
        if (!estimate.request.customerEmail) {
            return { success: false, error: 'No email address provided' };
        }

        try {
            // Generate HTML content
            const { html } = await pdfService.generatePDF(estimate);

            if (!html) {
                return { success: false, error: 'Failed to generate email content' };
            }

            // Get recommended option for subject line
            const recommended = estimate.options.find(o => o.recommended) || estimate.options[0];
            const priceRange = this.formatPriceRange(estimate);

            const response = await this.resend.emails.send({
                from: this.fromEmail,
                to: estimate.request.customerEmail,
                subject: `Your Roofing Estimate - ${priceRange}`,
                html: this.wrapEmailHTML(html, estimate),
                tags: [
                    { name: 'type', value: 'estimate' },
                    { name: 'estimate_id', value: estimate.id }
                ]
            });

            if (response.error) {
                logger.error('❌ Email send error:', response.error);
                return { success: false, error: response.error.message };
            }

            logger.info(`📧 Estimate email sent to ${estimate.request.customerEmail}`);
            return { success: true, messageId: response.data?.id };

        } catch (error: any) {
            logger.error('❌ Email delivery error:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Send estimate via SMS
     */
    async sendEstimateSMS(estimate: Estimate): Promise<{
        success: boolean;
        error?: string;
    }> {
        try {
            // Generate short link for estimate view
            const estimateLink = `${this.baseUrl}/estimate/${estimate.id}`;

            const priceRange = this.formatPriceRange(estimate);

            const message = `Hi ${estimate.request.customerName.split(' ')[0]}! Your roofing estimate (${priceRange}) from Roofing Pros USA is ready. View it here: ${estimateLink} - Questions? Call (407) 289-1565`;

            // TODO: Integrate with SMS provider (Twilio, etc.)
            // For now, log the message
            logger.info(`📱 SMS would be sent to ${estimate.request.customerPhone}: ${message}`);

            // Placeholder - would integrate with Twilio or similar
            return { success: true };

        } catch (error: any) {
            logger.error('❌ SMS delivery error:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Send internal notification to sales team
     */
    async sendInternalNotification(estimate: Estimate): Promise<{
        success: boolean;
        error?: string;
    }> {
        try {
            const notificationEmail = process.env.ROOFING_LEAD_EMAIL || 'leads@roofingprosusa.com';
            const recommended = estimate.options.find(o => o.recommended) || estimate.options[0];

            const html = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .header { background: #1a365d; color: white; padding: 20px; }
        .content { padding: 20px; }
        .highlight { background: #ebf8ff; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .price { font-size: 24px; font-weight: bold; color: #1a365d; }
        .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
        .badge-hot { background: #fed7d7; color: #742a2a; }
        .badge-warm { background: #fefcbf; color: #744210; }
        .badge-cold { background: #e2e8f0; color: #4a5568; }
    </style>
</head>
<body>
    <div class="header">
        <h2>🏠 New Estimate Generated</h2>
    </div>
    <div class="content">
        <div class="highlight">
            <strong>Customer:</strong> ${estimate.request.customerName}<br>
            <strong>Phone:</strong> ${estimate.request.customerPhone}<br>
            <strong>Email:</strong> ${estimate.request.customerEmail || 'Not provided'}<br>
            <strong>Address:</strong> ${estimate.property.address}
        </div>

        <h3>Estimate Summary</h3>
        <p class="price">${this.formatPriceRange(estimate)}</p>
        <p><strong>Recommended:</strong> ${recommended?.name}</p>
        <p><strong>Condition:</strong> ${estimate.analysis.condition.toUpperCase()}</p>
        <p><strong>Recommendation:</strong> ${estimate.analysis.recommendation.replace('_', ' ')}</p>

        <div class="highlight">
            <strong>Issue:</strong> ${estimate.request.roofIssue || 'General Inspection'}<br>
            <strong>Storm Damage:</strong> ${estimate.request.stormDamage ? 'Yes' : 'No'}<br>
            <strong>Urgency:</strong> ${estimate.request.urgency || 'Normal'}
        </div>

        <p><strong>AI Confidence:</strong> ${estimate.confidence}%</p>

        <h3>Analysis</h3>
        <p>${estimate.analysis.conditionDetails}</p>
        <p><em>${estimate.analysis.recommendationReason}</em></p>

        <p style="margin-top: 20px;">
            <a href="${this.baseUrl}/admin/estimates/${estimate.id}" style="background: #1a365d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                View Full Estimate
            </a>
        </p>
    </div>
</body>
</html>`;

            const response = await this.resend.emails.send({
                from: this.fromEmail,
                to: notificationEmail,
                subject: `[EstimAIte] New Estimate: ${estimate.request.customerName} - ${this.formatPriceRange(estimate)}`,
                html,
                tags: [
                    { name: 'type', value: 'internal_notification' },
                    { name: 'estimate_id', value: estimate.id }
                ]
            });

            if (response.error) {
                return { success: false, error: response.error.message };
            }

            logger.info(`📧 Internal notification sent for estimate ${estimate.id}`);
            return { success: true };

        } catch (error: any) {
            logger.error('❌ Internal notification error:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Update estimate delivery status in database
     */
    private async updateEstimateDelivery(
        estimateId: string,
        updates: {
            status?: string;
            emailSent?: boolean;
            smsSent?: boolean;
        }
    ): Promise<void> {
        try {
            const { error } = await supabase
                .from('estimates')
                .update({
                    ...updates,
                    sent_at: new Date(),
                    updated_at: new Date()
                })
                .eq('id', estimateId);

            if (error) {
                logger.error('❌ Failed to update estimate delivery status:', error.message);
            }

        } catch (error: any) {
            logger.error('❌ Database error updating delivery:', error.message);
        }
    }

    /**
     * Track when estimate is viewed
     */
    async trackEstimateView(estimateId: string): Promise<void> {
        try {
            const { error } = await supabase
                .from('estimates')
                .update({
                    status: 'viewed',
                    viewed_at: new Date(),
                    updated_at: new Date()
                })
                .eq('id', estimateId)
                .eq('status', 'sent'); // Only update if currently 'sent'

            if (!error) {
                logger.info(`👁️ Estimate ${estimateId} marked as viewed`);
            }

        } catch (error: any) {
            logger.error('❌ Error tracking estimate view:', error.message);
        }
    }

    /**
     * Format price range for display
     */
    private formatPriceRange(estimate: Estimate): string {
        const prices = estimate.options.map(o => o.total).sort((a, b) => a - b);
        const min = prices[0];
        const max = prices[prices.length - 1];

        const format = (n: number) => new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(n);

        if (min === max) {
            return format(min);
        }

        return `${format(min)} - ${format(max)}`;
    }

    /**
     * Wrap estimate HTML in email container
     */
    private wrapEmailHTML(estimateHTML: string, estimate: Estimate): string {
        // Add email-specific wrapper with tracking pixel and action buttons
        return `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f7fafc;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7fafc; padding: 20px 0;">
        <tr>
            <td align="center">
                <table width="100%" style="max-width: 800px; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <tr>
                        <td>
                            ${estimateHTML}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px; background: #1a365d; text-align: center;">
                            <a href="${this.baseUrl}/estimate/${estimate.id}/accept"
                               style="display: inline-block; background: #48bb78; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px; margin: 0 10px;">
                                ✓ Accept Estimate
                            </a>
                            <a href="${this.baseUrl}/estimate/${estimate.id}"
                               style="display: inline-block; background: #2b6cb0; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px; margin: 0 10px;">
                                View Online
                            </a>
                        </td>
                    </tr>
                </table>

                <table width="100%" style="max-width: 800px; padding: 20px;">
                    <tr>
                        <td style="text-align: center; color: #718096; font-size: 12px;">
                            <p>This estimate was generated by EstimAIte™ AI technology.</p>
                            <p>Roofing Pros USA | Florida's Largest Reroofing Company</p>
                            <p>
                                <a href="${this.baseUrl}/unsubscribe?email=${estimate.request.customerEmail}" style="color: #718096;">Unsubscribe</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <!-- Tracking pixel -->
    <img src="${this.baseUrl}/api/estimaite/track/${estimate.id}/open" width="1" height="1" style="display:none;" />
</body>
</html>`;
    }
}

// Export singleton instance
export const deliveryService = new DeliveryService();
