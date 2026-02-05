/**
 * EstimAIte - Type Definitions
 *
 * All types for the AI-powered roofing estimate generation system
 */

// ============================================================================
// PROPERTY TYPES
// ============================================================================

export interface PropertyData {
    address: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    county?: string;

    // Property details
    squareFootage?: number;
    yearBuilt?: number;
    stories?: number;
    propertyType?: 'single_family' | 'multi_family' | 'commercial' | 'townhouse' | 'condo';
    propertyValue?: number;

    // Roof details
    roofSquareFootage?: number;
    roofType?: 'asphalt_shingle' | 'metal' | 'tile' | 'slate' | 'flat' | 'wood_shake' | 'unknown';
    roofPitch?: 'low' | 'medium' | 'steep' | 'flat';
    roofAge?: number;
    lastRoofPermit?: Date;

    // Location factors
    latitude?: number;
    longitude?: number;
    elevation?: number;
    windZone?: string;
    floodZone?: string;
}

export interface WeatherHistory {
    recentStorms: StormEvent[];
    averageWindSpeed: number;
    annualRainfall: number;
    hailRisk: 'low' | 'medium' | 'high';
    hurricaneZone: boolean;
}

export interface StormEvent {
    date: Date;
    type: 'hail' | 'wind' | 'hurricane' | 'tornado' | 'severe_thunderstorm';
    severity: 'minor' | 'moderate' | 'severe';
    hailSize?: number; // in inches
    windSpeed?: number; // in mph
    location: string;
}

// ============================================================================
// ESTIMATE TYPES
// ============================================================================

export interface EstimateRequest {
    // Customer info
    customerId?: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;

    // Property
    propertyAddress: string;

    // Issue details
    roofIssue?: string;
    issueDescription?: string;
    stormDamage?: boolean;
    stormDate?: Date;
    leakLocation?: string;
    urgency?: 'low' | 'medium' | 'high' | 'emergency';

    // Insurance
    hasInsurance?: boolean;
    insuranceCompany?: string;
    claimFiled?: boolean;
    claimNumber?: string;

    // Preferences
    preferredMaterials?: string[];
    budget?: 'economy' | 'standard' | 'premium';

    // Source
    source?: 'voice_call' | 'web_form' | 'manual' | 'api';
    callId?: string;
}

export interface EstimateLineItem {
    category: 'labor' | 'materials' | 'permits' | 'disposal' | 'equipment' | 'other';
    description: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    totalPrice: number;
    notes?: string;
}

export interface EstimateOption {
    id: string;
    name: string;
    type: 'repair' | 'partial_replacement' | 'full_replacement' | 'emergency';
    description: string;
    recommended: boolean;
    warrantyYears: number;

    // Pricing
    lineItems: EstimateLineItem[];
    subtotal: number;
    tax: number;
    total: number;

    // Timeline
    estimatedDays: number;
    canStartWithin: string;

    // Materials
    materialGrade: 'economy' | 'standard' | 'premium';
    primaryMaterial: string;
    materialBrand?: string;

    // Optional notes
    notes?: string;
}

export interface Estimate {
    id: string;
    createdAt: Date;
    expiresAt: Date;
    status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired';

    // Request info
    request: EstimateRequest;

    // Property analysis
    property: PropertyData;
    weatherHistory?: WeatherHistory;

    // AI Analysis
    analysis: {
        condition: 'good' | 'fair' | 'poor' | 'critical';
        conditionDetails: string;
        recommendation: 'repair' | 'partial_replacement' | 'full_replacement';
        recommendationReason: string;
        urgencyAssessment: string;
        insuranceEligibility?: string;
        additionalNotes?: string;
    };

    // Estimate options
    options: EstimateOption[];
    recommendedOptionId: string;

    // Financing
    financing?: {
        available: boolean;
        monthlyPayment?: number;
        term?: number;
        apr?: number;
        provider?: string;
    };

    // Metadata
    generatedBy: 'ai' | 'manual';
    aiModel?: string;
    aiThinkingTokens?: number;
    confidence: number; // 0-100
    version: string;
}

// ============================================================================
// PRICING TYPES
// ============================================================================

export interface MaterialPricing {
    type: string;
    grade: 'economy' | 'standard' | 'premium';
    pricePerSquare: number; // per 100 sq ft
    brand?: string;
    warrantyYears: number;
    lastUpdated: Date;
}

export interface LaborRates {
    zipCode: string;
    region: string;
    baseHourlyRate: number;
    roofingRate: number; // per square
    tearOffRate: number; // per square
    repairRate: number; // per hour
    emergencyMultiplier: number;
    weekendMultiplier: number;
    lastUpdated: Date;
}

export interface PricingConfig {
    materials: MaterialPricing[];
    laborRates: LaborRates;
    permitCosts: {
        basePermit: number;
        inspectionFee: number;
    };
    disposalCosts: {
        perSquare: number;
        minimumCharge: number;
    };
    overheadMargin: number; // percentage
    profitMargin: number; // percentage
}

// ============================================================================
// DELIVERY TYPES
// ============================================================================

export interface EstimateDelivery {
    estimateId: string;
    deliveredAt: Date;
    channels: {
        email?: {
            sent: boolean;
            sentAt?: Date;
            opened?: boolean;
            openedAt?: Date;
        };
        sms?: {
            sent: boolean;
            sentAt?: Date;
            clicked?: boolean;
            clickedAt?: Date;
        };
        pdf?: {
            generated: boolean;
            url?: string;
            downloadCount?: number;
        };
    };
}

// ============================================================================
// CLIENT/TENANT TYPES
// ============================================================================

export interface EstimAIteClient {
    id: string;
    name: string;
    slug: string;

    // Branding
    branding: {
        companyName: string;
        logo?: string;
        primaryColor: string;
        secondaryColor: string;
        accentColor: string;
        tagline?: string;
        website?: string;
        phone: string;
        email: string;
        address: string;
    };

    // Pricing config
    pricing: PricingConfig;

    // Usage
    subscription: {
        plan: 'starter' | 'professional' | 'enterprise';
        maxUsers: number;
        maxEstimatesPerMonth: number;
        currentMonthEstimates: number;
        billingCycleStart: Date;
    };

    // Integration
    integrations?: {
        crm?: 'jobnimbus' | 'salesforce' | 'hubspot';
        crmApiKey?: string;
    };
}
