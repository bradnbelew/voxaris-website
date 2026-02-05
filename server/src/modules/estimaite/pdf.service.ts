/**
 * EstimAIte - PDF Generation Service
 *
 * Generates professional, branded PDF estimates
 */

import { logger } from '../../lib/logger';
import { Estimate, EstimateOption, EstimAIteClient } from './estimaite.types';

// ============================================================================
// DEFAULT BRANDING
// ============================================================================

const DEFAULT_BRANDING = {
    companyName: 'Roofing Pros USA',
    tagline: "Florida's Largest Reroofing Company",
    primaryColor: '#1a365d', // Navy blue
    secondaryColor: '#2b6cb0', // Lighter blue
    accentColor: '#ed8936', // Orange
    phone: '(407) 289-1565',
    email: 'info@roofingprosusa-fl.com',
    website: 'roofingprosusa-fl.com',
    address: 'Florida Statewide Service',
    logo: null // Would be a URL or base64
};

// ============================================================================
// PDF SERVICE
// ============================================================================

class PDFService {

    /**
     * Generate HTML for estimate PDF
     * This can be converted to PDF using a service like Puppeteer or a PDF API
     */
    generateEstimateHTML(
        estimate: Estimate,
        branding: typeof DEFAULT_BRANDING = DEFAULT_BRANDING
    ): string {
        const recommendedOption = estimate.options.find(o => o.id === estimate.recommendedOptionId)
            || estimate.options.find(o => o.recommended)
            || estimate.options[0];

        const formatCurrency = (amount: number) =>
            new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

        const formatDate = (date: Date) =>
            new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date(date));

        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Roofing Estimate - ${estimate.request.customerName}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #fff;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
        }

        /* Header */
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding-bottom: 30px;
            border-bottom: 3px solid ${branding.primaryColor};
            margin-bottom: 30px;
        }

        .logo-section h1 {
            color: ${branding.primaryColor};
            font-size: 28px;
            font-weight: bold;
        }

        .logo-section .tagline {
            color: ${branding.secondaryColor};
            font-size: 14px;
            font-style: italic;
        }

        .company-info {
            text-align: right;
            font-size: 13px;
            color: #666;
        }

        .company-info strong {
            color: ${branding.primaryColor};
        }

        /* Estimate Header */
        .estimate-header {
            background: linear-gradient(135deg, ${branding.primaryColor} 0%, ${branding.secondaryColor} 100%);
            color: white;
            padding: 25px;
            border-radius: 8px;
            margin-bottom: 30px;
        }

        .estimate-header h2 {
            font-size: 24px;
            margin-bottom: 5px;
        }

        .estimate-meta {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            opacity: 0.9;
        }

        /* Sections */
        .section {
            margin-bottom: 30px;
        }

        .section-title {
            color: ${branding.primaryColor};
            font-size: 18px;
            font-weight: bold;
            padding-bottom: 10px;
            border-bottom: 2px solid #e2e8f0;
            margin-bottom: 15px;
        }

        /* Info Grid */
        .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
        }

        .info-item {
            background: #f7fafc;
            padding: 15px;
            border-radius: 6px;
        }

        .info-item label {
            font-size: 12px;
            color: #718096;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .info-item .value {
            font-size: 16px;
            font-weight: 600;
            color: #2d3748;
            margin-top: 5px;
        }

        /* Analysis Box */
        .analysis-box {
            background: #fffbeb;
            border-left: 4px solid ${branding.accentColor};
            padding: 20px;
            border-radius: 0 8px 8px 0;
        }

        .analysis-box h4 {
            color: ${branding.primaryColor};
            margin-bottom: 10px;
        }

        .condition-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .condition-good { background: #c6f6d5; color: #22543d; }
        .condition-fair { background: #fefcbf; color: #744210; }
        .condition-poor { background: #fed7d7; color: #742a2a; }
        .condition-critical { background: #742a2a; color: white; }

        /* Options Table */
        .options-table {
            width: 100%;
            border-collapse: collapse;
        }

        .options-table th {
            background: ${branding.primaryColor};
            color: white;
            padding: 12px;
            text-align: left;
            font-size: 13px;
        }

        .options-table td {
            padding: 15px 12px;
            border-bottom: 1px solid #e2e8f0;
        }

        .options-table tr.recommended {
            background: #ebf8ff;
        }

        .recommended-badge {
            background: ${branding.accentColor};
            color: white;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: bold;
            margin-left: 8px;
        }

        .option-price {
            font-size: 20px;
            font-weight: bold;
            color: ${branding.primaryColor};
        }

        /* Line Items */
        .line-items {
            margin-top: 20px;
        }

        .line-items-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
        }

        .line-items-table th {
            background: #f7fafc;
            padding: 10px;
            text-align: left;
            border-bottom: 2px solid #e2e8f0;
        }

        .line-items-table td {
            padding: 10px;
            border-bottom: 1px solid #edf2f7;
        }

        .line-items-table .total-row {
            font-weight: bold;
            background: #f7fafc;
        }

        .line-items-table .total-row td {
            border-top: 2px solid ${branding.primaryColor};
        }

        /* Financing */
        .financing-box {
            background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }

        .financing-box h4 {
            font-size: 16px;
            margin-bottom: 10px;
        }

        .financing-amount {
            font-size: 32px;
            font-weight: bold;
        }

        .financing-details {
            font-size: 13px;
            opacity: 0.9;
            margin-top: 5px;
        }

        /* Footer */
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
            font-size: 12px;
            color: #718096;
        }

        .footer .validity {
            background: #fff5f5;
            padding: 10px 15px;
            border-radius: 6px;
            margin-bottom: 15px;
        }

        .footer .contact-cta {
            background: ${branding.primaryColor};
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }

        .footer .contact-cta h4 {
            font-size: 18px;
            margin-bottom: 10px;
        }

        .footer .contact-cta .phone {
            font-size: 24px;
            font-weight: bold;
        }

        /* Print Styles */
        @media print {
            .container {
                padding: 20px;
            }

            .no-print {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="logo-section">
                <h1>${branding.companyName}</h1>
                <div class="tagline">${branding.tagline}</div>
            </div>
            <div class="company-info">
                <strong>${branding.phone}</strong><br>
                ${branding.email}<br>
                ${branding.website}
            </div>
        </div>

        <!-- Estimate Header -->
        <div class="estimate-header">
            <h2>Roofing Estimate</h2>
            <div class="estimate-meta">
                <span>Estimate #${estimate.id.slice(0, 8).toUpperCase()}</span>
                <span>Prepared: ${formatDate(estimate.createdAt)}</span>
            </div>
        </div>

        <!-- Customer & Property Info -->
        <div class="section">
            <h3 class="section-title">Customer & Property Information</h3>
            <div class="info-grid">
                <div class="info-item">
                    <label>Customer Name</label>
                    <div class="value">${estimate.request.customerName}</div>
                </div>
                <div class="info-item">
                    <label>Phone</label>
                    <div class="value">${estimate.request.customerPhone}</div>
                </div>
                <div class="info-item">
                    <label>Property Address</label>
                    <div class="value">${estimate.property.address}</div>
                </div>
                <div class="info-item">
                    <label>Reported Issue</label>
                    <div class="value">${estimate.request.roofIssue || 'General Inspection'}</div>
                </div>
            </div>
        </div>

        <!-- Professional Assessment -->
        <div class="section">
            <h3 class="section-title">Professional Assessment</h3>
            <div class="analysis-box">
                <h4>
                    Roof Condition:
                    <span class="condition-badge condition-${estimate.analysis.condition}">
                        ${estimate.analysis.condition.toUpperCase()}
                    </span>
                </h4>
                <p style="margin-bottom: 15px;">${estimate.analysis.conditionDetails}</p>

                <h4>Our Recommendation: ${this.formatRecommendation(estimate.analysis.recommendation)}</h4>
                <p style="margin-bottom: 15px;">${estimate.analysis.recommendationReason}</p>

                <h4>Urgency Assessment</h4>
                <p>${estimate.analysis.urgencyAssessment}</p>

                ${estimate.analysis.insuranceEligibility ? `
                <h4 style="margin-top: 15px;">Insurance Information</h4>
                <p>${estimate.analysis.insuranceEligibility}</p>
                ` : ''}
            </div>
        </div>

        <!-- Estimate Options -->
        <div class="section">
            <h3 class="section-title">Estimate Options</h3>
            <table class="options-table">
                <thead>
                    <tr>
                        <th>Option</th>
                        <th>Description</th>
                        <th>Warranty</th>
                        <th>Timeline</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${estimate.options.map(option => `
                    <tr class="${option.recommended ? 'recommended' : ''}">
                        <td>
                            ${option.name}
                            ${option.recommended ? '<span class="recommended-badge">RECOMMENDED</span>' : ''}
                        </td>
                        <td>${option.description}</td>
                        <td>${option.warrantyYears} years</td>
                        <td>${option.estimatedDays} days</td>
                        <td class="option-price">${formatCurrency(option.total)}</td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <!-- Recommended Option Details -->
        ${recommendedOption ? `
        <div class="section">
            <h3 class="section-title">Detailed Breakdown - ${recommendedOption.name}</h3>
            <table class="line-items-table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${recommendedOption.lineItems.map(item => `
                    <tr>
                        <td>${item.description}</td>
                        <td>${item.quantity} ${item.unit}</td>
                        <td>${formatCurrency(item.unitPrice)}</td>
                        <td>${formatCurrency(item.totalPrice)}</td>
                    </tr>
                    `).join('')}
                    <tr class="total-row">
                        <td colspan="3">Total Investment</td>
                        <td>${formatCurrency(recommendedOption.total)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        ` : ''}

        <!-- Financing -->
        ${estimate.financing?.available ? `
        <div class="section">
            <h3 class="section-title">Financing Available</h3>
            <div class="financing-box">
                <h4>Affordable Monthly Payments</h4>
                <div class="financing-amount">
                    ${formatCurrency(estimate.financing.monthlyPayment || 0)}/month
                </div>
                <div class="financing-details">
                    ${estimate.financing.term} months at ${((estimate.financing.apr || 0) * 100).toFixed(2)}% APR
                    through ${estimate.financing.provider}
                </div>
            </div>
        </div>
        ` : ''}

        <!-- Footer -->
        <div class="footer">
            <div class="validity">
                <strong>⚠️ Estimate Valid Until:</strong> ${formatDate(estimate.expiresAt)}<br>
                This estimate is based on the information provided and visual inspection. Final pricing may vary based on actual conditions discovered during the project.
            </div>

            <div class="contact-cta">
                <h4>Ready to Get Started?</h4>
                <p>Call us today to schedule your free inspection</p>
                <div class="phone">${branding.phone}</div>
            </div>

            <p style="margin-top: 20px; text-align: center;">
                ${branding.companyName} | ${branding.address} | ${branding.website}<br>
                Licensed & Insured | Serving All of Florida
            </p>
        </div>
    </div>
</body>
</html>
`;
    }

    /**
     * Format recommendation for display
     */
    private formatRecommendation(rec: string): string {
        const map: Record<string, string> = {
            'repair': 'Targeted Repair',
            'partial_replacement': 'Partial Roof Replacement',
            'full_replacement': 'Full Roof Replacement'
        };
        return map[rec] || rec;
    }

    /**
     * Generate PDF from HTML using external service
     * For now, returns HTML that can be rendered client-side
     */
    async generatePDF(estimate: Estimate): Promise<{
        success: boolean;
        html?: string;
        url?: string;
        error?: string;
    }> {
        try {
            const html = this.generateEstimateHTML(estimate);

            // TODO: Integrate with PDF service (Puppeteer, PDFShift, etc.)
            // For now, return HTML
            logger.info(`📄 Generated estimate HTML for ${estimate.id}`);

            return {
                success: true,
                html
            };

        } catch (error: any) {
            logger.error('❌ PDF generation error:', error.message);
            return { success: false, error: error.message };
        }
    }
}

// Export singleton instance
export const pdfService = new PDFService();
