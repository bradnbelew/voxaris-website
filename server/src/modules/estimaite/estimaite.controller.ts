/**
 * EstimAIte - API Controller
 *
 * REST API endpoints for estimate generation and management
 */

import { Router, Request, Response } from 'express';
import { logger } from '../../lib/logger';
import { estimateService } from './estimate.service';
import { deliveryService } from './delivery.service';
import { pdfService } from './pdf.service';
import { EstimateRequest } from './estimaite.types';

const router = Router();

// ============================================================================
// ESTIMATE GENERATION
// ============================================================================

/**
 * POST /api/estimaite/generate
 *
 * Generate a new AI-powered estimate
 */
router.post('/generate', async (req: Request, res: Response) => {
    try {
        const body = req.body;

        // Validate required fields
        if (!body.customerName || !body.customerPhone || !body.propertyAddress) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: customerName, customerPhone, propertyAddress'
            });
        }

        const request: EstimateRequest = {
            customerName: body.customerName,
            customerPhone: body.customerPhone,
            customerEmail: body.customerEmail,
            propertyAddress: body.propertyAddress,
            roofIssue: body.roofIssue || body.issueDescription,
            issueDescription: body.issueDescription,
            stormDamage: body.stormDamage || false,
            stormDate: body.stormDate ? new Date(body.stormDate) : undefined,
            leakLocation: body.leakLocation,
            urgency: body.urgency,
            hasInsurance: body.hasInsurance,
            insuranceCompany: body.insuranceCompany,
            claimFiled: body.claimFiled,
            claimNumber: body.claimNumber,
            preferredMaterials: body.preferredMaterials,
            budget: body.budget,
            source: body.source || 'api',
            callId: body.callId
        };

        logger.info(`📋 Generating estimate for ${request.customerName}`);

        const estimate = await estimateService.generateEstimate(request);

        res.status(200).json({
            success: true,
            estimate: {
                id: estimate.id,
                status: estimate.status,
                createdAt: estimate.createdAt,
                expiresAt: estimate.expiresAt,
                customer: {
                    name: estimate.request.customerName,
                    phone: estimate.request.customerPhone,
                    email: estimate.request.customerEmail
                },
                property: {
                    address: estimate.property.address,
                    city: estimate.property.city,
                    state: estimate.property.state,
                    zip: estimate.property.zip,
                    roofSize: estimate.property.roofSquareFootage,
                    roofType: estimate.property.roofType
                },
                analysis: estimate.analysis,
                options: estimate.options.map(o => ({
                    id: o.id,
                    name: o.name,
                    type: o.type,
                    description: o.description,
                    recommended: o.recommended,
                    total: o.total,
                    warrantyYears: o.warrantyYears,
                    estimatedDays: o.estimatedDays,
                    canStartWithin: o.canStartWithin
                })),
                recommendedOptionId: estimate.recommendedOptionId,
                financing: estimate.financing,
                confidence: estimate.confidence
            }
        });

    } catch (error: any) {
        logger.error('❌ Estimate generation error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/estimaite/generate-from-call
 *
 * Generate estimate from voice call data
 */
router.post('/generate-from-call', async (req: Request, res: Response) => {
    try {
        const { callId, customerName, customerPhone, customerEmail, propertyAddress, roofIssue, stormDamage, urgency, transcript } = req.body;

        if (!customerPhone) {
            return res.status(400).json({
                success: false,
                error: 'customerPhone is required'
            });
        }

        const estimate = await estimateService.generateFromCall({
            callId,
            customerName,
            customerPhone,
            customerEmail,
            propertyAddress,
            roofIssue,
            stormDamage,
            urgency,
            transcript
        });

        if (!estimate) {
            return res.status(400).json({
                success: false,
                error: 'Could not generate estimate - missing property address'
            });
        }

        res.status(200).json({
            success: true,
            estimateId: estimate.id,
            estimate
        });

    } catch (error: any) {
        logger.error('❌ Call-based estimate error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============================================================================
// ESTIMATE RETRIEVAL
// ============================================================================

/**
 * GET /api/estimaite/estimates/:id
 *
 * Get a specific estimate by ID
 */
router.get('/estimates/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const estimate = await estimateService.getEstimate(id);

        if (!estimate) {
            return res.status(404).json({
                success: false,
                error: 'Estimate not found'
            });
        }

        res.status(200).json({
            success: true,
            estimate
        });

    } catch (error: any) {
        logger.error('❌ Get estimate error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/estimaite/estimates/:id/pdf
 *
 * Get HTML/PDF view for estimate
 */
router.get('/estimates/:id/pdf', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const estimate = await estimateService.getEstimate(id);

        if (!estimate) {
            return res.status(404).json({
                success: false,
                error: 'Estimate not found'
            });
        }

        const result = await pdfService.generatePDF(estimate);

        if (!result.success || !result.html) {
            return res.status(500).json({
                success: false,
                error: result.error || 'Failed to generate PDF'
            });
        }

        // Return HTML that can be printed/saved as PDF
        res.setHeader('Content-Type', 'text/html');
        res.send(result.html);

    } catch (error: any) {
        logger.error('❌ Get estimate PDF error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/estimaite/estimates/:id/send
 *
 * Send estimate to customer via email/SMS
 */
router.post('/estimates/:id/send', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { email = true, sms = true } = req.body;

        const estimate = await estimateService.getEstimate(id);

        if (!estimate) {
            return res.status(404).json({
                success: false,
                error: 'Estimate not found'
            });
        }

        const result = await deliveryService.deliverEstimate(estimate, {
            email,
            sms,
            notify: true
        });

        res.status(200).json({
            success: result.success,
            emailSent: result.emailSent,
            smsSent: result.smsSent,
            errors: result.errors
        });

    } catch (error: any) {
        logger.error('❌ Send estimate error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/estimaite/track/:id/open
 *
 * Track email open (1x1 pixel)
 */
router.get('/track/:id/open', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await deliveryService.trackEstimateView(id);

        // Return 1x1 transparent pixel
        const pixel = Buffer.from(
            'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
            'base64'
        );
        res.setHeader('Content-Type', 'image/gif');
        res.send(pixel);

    } catch (error: any) {
        // Don't fail on tracking errors
        res.status(200).send();
    }
});

// ============================================================================
// ESTIMATE STATUS
// ============================================================================

/**
 * PATCH /api/estimaite/estimates/:id/status
 *
 * Update estimate status
 */
router.patch('/estimates/:id/status', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
            });
        }

        const success = await estimateService.updateStatus(id, status);

        if (!success) {
            return res.status(500).json({
                success: false,
                error: 'Failed to update status'
            });
        }

        res.status(200).json({
            success: true,
            message: `Estimate status updated to: ${status}`
        });

    } catch (error: any) {
        logger.error('❌ Update status error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============================================================================
// QUICK ESTIMATE (No AI - Fast)
// ============================================================================

/**
 * POST /api/estimaite/quick-estimate
 *
 * Get a quick estimate range without full AI analysis
 */
router.post('/quick-estimate', async (req: Request, res: Response) => {
    try {
        const { squareFootage, roofType, issueType } = req.body;

        // Simple calculation without AI
        const sqft = squareFootage || 2000;
        const roofSquares = Math.ceil(sqft * 1.2 / 100); // Estimate roof squares

        // Base pricing ranges
        const ranges = {
            repair: { min: 300, max: 1500 },
            replacement: {
                economy: { perSquare: 350 },
                standard: { perSquare: 500 },
                premium: { perSquare: 750 }
            }
        };

        let estimate;
        if (issueType === 'repair') {
            estimate = {
                type: 'repair',
                range: ranges.repair,
                note: 'Final price depends on repair scope'
            };
        } else {
            estimate = {
                type: 'replacement',
                economy: {
                    total: roofSquares * ranges.replacement.economy.perSquare,
                    description: '3-tab shingles, 20-year warranty'
                },
                standard: {
                    total: roofSquares * ranges.replacement.standard.perSquare,
                    description: 'Architectural shingles, 30-year warranty'
                },
                premium: {
                    total: roofSquares * ranges.replacement.premium.perSquare,
                    description: 'Designer shingles, 50-year warranty'
                },
                roofSquares
            };
        }

        res.status(200).json({
            success: true,
            quickEstimate: estimate,
            disclaimer: 'This is a rough estimate. Final pricing requires an on-site inspection.'
        });

    } catch (error: any) {
        logger.error('❌ Quick estimate error:', error.message);
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
        service: 'estimaite',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

export default router;
