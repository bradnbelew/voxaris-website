/**
 * EstimAIte - Core Estimate Generation Service
 *
 * AI-powered estimate generation using Claude Opus 4.6:
 * - Property analysis
 * - Damage assessment
 * - Estimate generation with multiple options
 * - Smart recommendations
 */

import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../lib/logger';
import { claude } from '../../lib/claude';
import { supabase } from '../../lib/supabase';
import { propertyService } from './property.service';
import { pricingService } from './pricing.service';
import {
    EstimateRequest,
    Estimate,
    EstimateOption,
    PropertyData,
    WeatherHistory
} from './estimaite.types';

// ============================================================================
// ESTIMATE SERVICE
// ============================================================================

class EstimateService {

    /**
     * Generate a complete estimate from a request
     */
    async generateEstimate(request: EstimateRequest): Promise<Estimate> {
        logger.info(`📋 Generating estimate for ${request.customerName} at ${request.propertyAddress}`);

        const startTime = Date.now();

        try {
            // Step 1: Enrich property data
            const property = await propertyService.getPropertyData(request.propertyAddress);

            // Step 2: Get weather history if coordinates available
            let weatherHistory: WeatherHistory | undefined;
            if (property.latitude && property.longitude) {
                weatherHistory = await propertyService.getWeatherHistory(
                    property.latitude,
                    property.longitude,
                    property.zip
                );
            }

            // Step 3: Determine issue type for pricing
            const issueType = this.determineIssueType(request);

            // Step 4: Generate pricing options
            const pricingOptions = pricingService.generateEstimateOptions(property, issueType);

            // Step 5: AI Analysis - Claude Opus 4.6 with extended thinking
            const aiAnalysis = await this.performAIAnalysis(request, property, weatherHistory, pricingOptions);

            // Step 6: Calculate financing for recommended option
            const recommendedOption = pricingOptions.find(o => o.recommended) || pricingOptions[0];
            const financing = pricingService.calculateFinancing(recommendedOption.total);

            // Step 7: Build final estimate
            const estimate: Estimate = {
                id: uuidv4(),
                createdAt: new Date(),
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                status: 'draft',
                request,
                property,
                weatherHistory,
                analysis: aiAnalysis,
                options: pricingOptions,
                recommendedOptionId: recommendedOption.id,
                financing: financing || undefined,
                generatedBy: 'ai',
                aiModel: 'claude-opus-4-6',
                confidence: aiAnalysis.confidence || 85,
                version: '1.0.0'
            };

            // Step 8: Save to database
            await this.saveEstimate(estimate);

            const duration = Date.now() - startTime;
            logger.info(`✅ Estimate ${estimate.id} generated in ${duration}ms`);

            return estimate;

        } catch (error: any) {
            logger.error('❌ Estimate generation failed:', error.message);
            throw error;
        }
    }

    /**
     * Perform AI analysis using Claude Opus 4.6
     */
    private async performAIAnalysis(
        request: EstimateRequest,
        property: PropertyData,
        weather: WeatherHistory | undefined,
        options: EstimateOption[]
    ): Promise<Estimate['analysis'] & { confidence: number }> {

        const systemPrompt = `You are an expert roofing estimator AI for a professional roofing company in Florida.
Analyze the property and customer information to provide:
1. Assessment of roof condition based on available data
2. Clear recommendation (repair vs partial vs full replacement)
3. Reasoning for your recommendation
4. Urgency assessment
5. Insurance eligibility notes if storm damage is mentioned

Be professional, accurate, and helpful. Your analysis will be shown to customers.
Base your assessment on: roof age, reported issues, storm history, and regional factors.`;

        const prompt = `Analyze this roofing estimate request and provide your professional assessment.

## Customer Information
- Name: ${request.customerName}
- Phone: ${request.customerPhone}
- Email: ${request.customerEmail || 'Not provided'}

## Property Information
- Address: ${property.address}
- City: ${property.city}, ${property.state} ${property.zip}
- Estimated Square Footage: ${property.squareFootage || 'Unknown'}
- Estimated Roof Size: ${property.roofSquareFootage || 'Unknown'} sq ft
- Roof Type: ${property.roofType || 'Unknown'}
- Roof Pitch: ${property.roofPitch || 'Unknown'}
- Estimated Roof Age: ${property.roofAge ? `${property.roofAge} years` : 'Unknown'}
- Wind Zone: ${property.windZone || 'Standard'}

## Reported Issue
- Issue: ${request.roofIssue || request.issueDescription || 'General inspection requested'}
- Storm Damage Reported: ${request.stormDamage ? 'Yes' : 'No'}
${request.stormDate ? `- Storm Date: ${request.stormDate}` : ''}
${request.leakLocation ? `- Leak Location: ${request.leakLocation}` : ''}
- Urgency: ${request.urgency || 'Not specified'}

## Recent Weather History
${weather ? `
- Recent Storms: ${weather.recentStorms.length > 0 ? weather.recentStorms.map(s => `${s.type} (${s.severity}) on ${s.date}`).join(', ') : 'None recorded'}
- Hail Risk: ${weather.hailRisk}
- Hurricane Zone: ${weather.hurricaneZone ? 'Yes' : 'No'}
` : 'Weather data not available'}

## Insurance Information
- Has Insurance: ${request.hasInsurance ? 'Yes' : 'Unknown'}
${request.insuranceCompany ? `- Insurance Company: ${request.insuranceCompany}` : ''}
- Claim Filed: ${request.claimFiled ? 'Yes' : 'No'}

## Available Estimate Options
${options.map(o => `- ${o.name}: $${o.total.toLocaleString()} (${o.warrantyYears} year warranty)`).join('\n')}

---

Provide your analysis in the following JSON format:
{
    "condition": "good|fair|poor|critical",
    "conditionDetails": "2-3 sentence explanation of the roof's likely condition",
    "recommendation": "repair|partial_replacement|full_replacement",
    "recommendationReason": "2-3 sentence explanation of why you recommend this option",
    "urgencyAssessment": "1-2 sentence assessment of how urgent the work is",
    "insuranceEligibility": "1-2 sentences about insurance claim potential (if storm damage mentioned)",
    "additionalNotes": "Any other relevant observations",
    "confidence": 85
}`;

        try {
            const response = await claude.generateJSON<{
                condition: 'good' | 'fair' | 'poor' | 'critical';
                conditionDetails: string;
                recommendation: 'repair' | 'partial_replacement' | 'full_replacement';
                recommendationReason: string;
                urgencyAssessment: string;
                insuranceEligibility?: string;
                additionalNotes?: string;
                confidence: number;
            }>(prompt, {
                systemPrompt,
                effort: 'high', // Use deep thinking for estimate analysis
                enableThinking: true,
                maxTokens: 4096
            });

            if (response.success && response.data) {
                logger.info(`🧠 AI Analysis complete - Condition: ${response.data.condition}, Recommendation: ${response.data.recommendation}`);
                return response.data;
            }

            // Fallback if AI fails
            logger.warn('⚠️ AI analysis failed, using defaults');
            return this.getDefaultAnalysis(request, property);

        } catch (error: any) {
            logger.error('❌ AI analysis error:', error.message);
            return this.getDefaultAnalysis(request, property);
        }
    }

    /**
     * Get default analysis if AI fails
     */
    private getDefaultAnalysis(
        request: EstimateRequest,
        property: PropertyData
    ): Estimate['analysis'] & { confidence: number } {
        const hasStormDamage = request.stormDamage || false;
        const isUrgent = request.urgency === 'high' || request.urgency === 'emergency';

        return {
            condition: hasStormDamage ? 'poor' : 'fair',
            conditionDetails: `Based on the reported ${request.roofIssue || 'issue'}, a professional inspection is recommended to assess the full extent of any damage.`,
            recommendation: hasStormDamage ? 'full_replacement' : 'repair',
            recommendationReason: hasStormDamage
                ? 'Storm damage often affects more of the roof than is visible. A full replacement ensures long-term protection and may be covered by insurance.'
                : 'Based on the reported issue, a targeted repair may resolve the problem. An inspection will confirm the best approach.',
            urgencyAssessment: isUrgent
                ? 'This should be addressed as soon as possible to prevent further damage.'
                : 'We recommend scheduling an inspection within the next 1-2 weeks.',
            insuranceEligibility: hasStormDamage
                ? 'Storm damage is typically covered by homeowner\'s insurance. We can assist with the claims process.'
                : undefined,
            confidence: 60
        };
    }

    /**
     * Determine issue type from request
     */
    private determineIssueType(request: EstimateRequest): 'repair' | 'replacement' | 'inspection' | 'storm_damage' {
        if (request.stormDamage) {
            return 'storm_damage';
        }

        const issue = (request.roofIssue || request.issueDescription || '').toLowerCase();

        if (issue.includes('replace') || issue.includes('new roof') || issue.includes('old')) {
            return 'replacement';
        }

        if (issue.includes('leak') || issue.includes('repair') || issue.includes('damage') || issue.includes('missing')) {
            return 'repair';
        }

        return 'inspection';
    }

    /**
     * Save estimate to database
     */
    private async saveEstimate(estimate: Estimate): Promise<void> {
        try {
            const { error } = await supabase
                .from('estimates')
                .insert({
                    id: estimate.id,
                    customer_name: estimate.request.customerName,
                    customer_phone: estimate.request.customerPhone,
                    customer_email: estimate.request.customerEmail,
                    property_address: estimate.property.address,
                    property_city: estimate.property.city,
                    property_state: estimate.property.state,
                    property_zip: estimate.property.zip,
                    roof_issue: estimate.request.roofIssue,
                    storm_damage: estimate.request.stormDamage || false,
                    condition: estimate.analysis.condition,
                    recommendation: estimate.analysis.recommendation,
                    recommended_option_id: estimate.recommendedOptionId,
                    options: estimate.options,
                    total_min: Math.min(...estimate.options.map(o => o.total)),
                    total_max: Math.max(...estimate.options.map(o => o.total)),
                    status: estimate.status,
                    expires_at: estimate.expiresAt,
                    source: estimate.request.source,
                    call_id: estimate.request.callId,
                    ai_confidence: estimate.confidence,
                    created_at: estimate.createdAt
                });

            if (error) {
                logger.error('❌ Failed to save estimate:', error.message);
            } else {
                logger.info(`💾 Estimate saved: ${estimate.id}`);
            }

        } catch (error: any) {
            logger.error('❌ Database error saving estimate:', error.message);
        }
    }

    /**
     * Get estimate by ID
     */
    async getEstimate(id: string): Promise<Estimate | null> {
        try {
            const { data, error } = await supabase
                .from('estimates')
                .select('*')
                .eq('id', id)
                .single();

            if (error || !data) {
                return null;
            }

            // Reconstruct estimate from database
            return this.reconstructEstimate(data);

        } catch (error: any) {
            logger.error('❌ Error fetching estimate:', error.message);
            return null;
        }
    }

    /**
     * Update estimate status
     */
    async updateStatus(id: string, status: Estimate['status']): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('estimates')
                .update({ status, updated_at: new Date() })
                .eq('id', id);

            if (error) {
                logger.error('❌ Failed to update estimate status:', error.message);
                return false;
            }

            logger.info(`📝 Estimate ${id} status updated to: ${status}`);
            return true;

        } catch (error: any) {
            logger.error('❌ Error updating estimate:', error.message);
            return false;
        }
    }

    /**
     * Generate estimate from voice call data
     */
    async generateFromCall(callData: {
        callId: string;
        customerName?: string;
        customerPhone: string;
        customerEmail?: string;
        propertyAddress?: string;
        roofIssue?: string;
        stormDamage?: boolean;
        urgency?: string;
        transcript?: string;
    }): Promise<Estimate | null> {

        // If we have a transcript, extract more details
        let extractedData = {};
        if (callData.transcript) {
            extractedData = await this.extractFromTranscript(callData.transcript);
        }

        const request: EstimateRequest = {
            customerName: callData.customerName || 'Customer',
            customerPhone: callData.customerPhone,
            customerEmail: callData.customerEmail,
            propertyAddress: callData.propertyAddress || '',
            roofIssue: callData.roofIssue,
            stormDamage: callData.stormDamage,
            urgency: callData.urgency as any,
            source: 'voice_call',
            callId: callData.callId,
            ...extractedData
        };

        if (!request.propertyAddress) {
            logger.warn('⚠️ Cannot generate estimate without property address');
            return null;
        }

        return this.generateEstimate(request);
    }

    /**
     * Extract estimate details from call transcript
     */
    private async extractFromTranscript(transcript: string): Promise<Partial<EstimateRequest>> {
        const extractionPrompt = `Extract the following information from this roofing company call transcript.
Return a JSON object with any of these fields you can find:
- customerName
- propertyAddress
- roofIssue (description of the problem)
- stormDamage (true/false)
- leakLocation
- urgency (low/medium/high/emergency)
- hasInsurance (true/false)
- insuranceCompany

Only include fields where you found clear information. Return empty object {} if nothing found.`;

        try {
            const response = await claude.generateJSON<Partial<EstimateRequest>>(
                `${extractionPrompt}\n\nTranscript:\n${transcript}`,
                {
                    model: 'claude-sonnet-4-5-20260115', // Use Sonnet for extraction
                    effort: 'low',
                    enableThinking: false
                }
            );

            return response.data || {};

        } catch (error: any) {
            logger.error('❌ Transcript extraction error:', error.message);
            return {};
        }
    }

    /**
     * Reconstruct full estimate from database record
     */
    private reconstructEstimate(data: any): Estimate {
        return {
            id: data.id,
            createdAt: new Date(data.created_at),
            expiresAt: new Date(data.expires_at),
            status: data.status,
            request: {
                customerName: data.customer_name,
                customerPhone: data.customer_phone,
                customerEmail: data.customer_email,
                propertyAddress: data.property_address,
                roofIssue: data.roof_issue,
                stormDamage: data.storm_damage,
                source: data.source,
                callId: data.call_id
            },
            property: {
                address: data.property_address,
                street: '',
                city: data.property_city,
                state: data.property_state,
                zip: data.property_zip
            },
            analysis: {
                condition: data.condition,
                conditionDetails: '',
                recommendation: data.recommendation,
                recommendationReason: '',
                urgencyAssessment: ''
            },
            options: data.options || [],
            recommendedOptionId: data.recommended_option_id,
            generatedBy: 'ai',
            confidence: data.ai_confidence || 85,
            version: '1.0.0'
        };
    }
}

// Export singleton instance
export const estimateService = new EstimateService();
