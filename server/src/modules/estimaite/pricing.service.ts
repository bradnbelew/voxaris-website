/**
 * EstimAIte - Pricing Service
 *
 * Handles all pricing calculations for roofing estimates:
 * - Material costs by type and grade
 * - Labor rates by region
 * - Permit and inspection fees
 * - Disposal costs
 * - Margin calculations
 */

import { logger } from '../../lib/logger';
import {
    PropertyData,
    EstimateLineItem,
    EstimateOption,
    MaterialPricing,
    LaborRates,
    PricingConfig
} from './estimaite.types';

// ============================================================================
// DEFAULT PRICING DATA (Florida-based)
// ============================================================================

const DEFAULT_MATERIALS: MaterialPricing[] = [
    // Asphalt Shingles
    { type: 'asphalt_3tab', grade: 'economy', pricePerSquare: 90, warrantyYears: 20, lastUpdated: new Date() },
    { type: 'asphalt_architectural', grade: 'standard', pricePerSquare: 130, brand: 'GAF Timberline', warrantyYears: 30, lastUpdated: new Date() },
    { type: 'asphalt_designer', grade: 'premium', pricePerSquare: 200, brand: 'GAF Grand Canyon', warrantyYears: 50, lastUpdated: new Date() },

    // Metal Roofing
    { type: 'metal_standing_seam', grade: 'standard', pricePerSquare: 350, warrantyYears: 40, lastUpdated: new Date() },
    { type: 'metal_standing_seam', grade: 'premium', pricePerSquare: 500, brand: 'Galvalume Plus', warrantyYears: 50, lastUpdated: new Date() },

    // Tile
    { type: 'concrete_tile', grade: 'standard', pricePerSquare: 400, warrantyYears: 50, lastUpdated: new Date() },
    { type: 'clay_tile', grade: 'premium', pricePerSquare: 600, warrantyYears: 75, lastUpdated: new Date() },

    // Flat Roof
    { type: 'tpo_membrane', grade: 'standard', pricePerSquare: 250, warrantyYears: 20, lastUpdated: new Date() },
    { type: 'epdm_rubber', grade: 'economy', pricePerSquare: 180, warrantyYears: 15, lastUpdated: new Date() },

    // Underlayment
    { type: 'synthetic_underlayment', grade: 'standard', pricePerSquare: 25, warrantyYears: 25, lastUpdated: new Date() },
    { type: 'ice_water_shield', grade: 'premium', pricePerSquare: 45, warrantyYears: 30, lastUpdated: new Date() }
];

const DEFAULT_LABOR_RATES: LaborRates = {
    zipCode: '32801', // Orlando area default
    region: 'Central Florida',
    baseHourlyRate: 45,
    roofingRate: 75, // per square for installation
    tearOffRate: 35, // per square for removal
    repairRate: 85, // per hour for repairs
    emergencyMultiplier: 1.5,
    weekendMultiplier: 1.25,
    lastUpdated: new Date()
};

const DEFAULT_CONFIG: PricingConfig = {
    materials: DEFAULT_MATERIALS,
    laborRates: DEFAULT_LABOR_RATES,
    permitCosts: {
        basePermit: 250,
        inspectionFee: 150
    },
    disposalCosts: {
        perSquare: 25,
        minimumCharge: 300
    },
    overheadMargin: 0.15, // 15%
    profitMargin: 0.20 // 20%
};

// ============================================================================
// PRICING SERVICE
// ============================================================================

class PricingService {
    private config: PricingConfig;

    constructor() {
        this.config = DEFAULT_CONFIG;
    }

    /**
     * Update pricing configuration for a specific client
     */
    setConfig(config: Partial<PricingConfig>): void {
        this.config = { ...this.config, ...config };
    }

    /**
     * Get labor rates for a specific zip code
     */
    getLaborRates(zip: string): LaborRates {
        // Future: Look up rates by zip code from database
        // For now, adjust base rates by region

        const rates = { ...this.config.laborRates };

        // South Florida premium (Miami, Ft. Lauderdale, Palm Beach)
        if (zip.startsWith('33') && parseInt(zip) < 33500) {
            rates.roofingRate *= 1.15;
            rates.tearOffRate *= 1.15;
            rates.repairRate *= 1.15;
            rates.region = 'South Florida';
        }

        // Tampa Bay area
        else if (zip.startsWith('336') || zip.startsWith('337')) {
            rates.roofingRate *= 1.05;
            rates.tearOffRate *= 1.05;
            rates.region = 'Tampa Bay';
        }

        // Jacksonville area
        else if (zip.startsWith('322')) {
            rates.roofingRate *= 1.0;
            rates.tearOffRate *= 1.0;
            rates.region = 'Northeast Florida';
        }

        rates.zipCode = zip;
        return rates;
    }

    /**
     * Get material pricing by type and grade
     */
    getMaterialPricing(
        materialType: string,
        grade: 'economy' | 'standard' | 'premium'
    ): MaterialPricing | null {
        return this.config.materials.find(
            m => m.type === materialType && m.grade === grade
        ) || null;
    }

    /**
     * Calculate full replacement estimate
     */
    calculateFullReplacement(
        property: PropertyData,
        options: {
            materialType: string;
            grade: 'economy' | 'standard' | 'premium';
            includeGutters?: boolean;
            upgradedUnderlayment?: boolean;
        }
    ): EstimateOption {
        const roofSquares = Math.ceil((property.roofSquareFootage || 2000) / 100);
        const laborRates = this.getLaborRates(property.zip);
        const material = this.getMaterialPricing(options.materialType, options.grade);

        if (!material) {
            throw new Error(`Material not found: ${options.materialType} (${options.grade})`);
        }

        const lineItems: EstimateLineItem[] = [];

        // 1. Tear-off existing roof
        lineItems.push({
            category: 'labor',
            description: 'Remove existing roofing materials',
            quantity: roofSquares,
            unit: 'squares',
            unitPrice: laborRates.tearOffRate,
            totalPrice: roofSquares * laborRates.tearOffRate
        });

        // 2. Disposal
        const disposalCost = Math.max(
            roofSquares * this.config.disposalCosts.perSquare,
            this.config.disposalCosts.minimumCharge
        );
        lineItems.push({
            category: 'disposal',
            description: 'Debris removal and dump fees',
            quantity: roofSquares,
            unit: 'squares',
            unitPrice: this.config.disposalCosts.perSquare,
            totalPrice: disposalCost
        });

        // 3. Underlayment
        const underlayment = options.upgradedUnderlayment
            ? this.getMaterialPricing('ice_water_shield', 'premium')
            : this.getMaterialPricing('synthetic_underlayment', 'standard');

        if (underlayment) {
            lineItems.push({
                category: 'materials',
                description: `${underlayment.type.replace(/_/g, ' ')} underlayment`,
                quantity: roofSquares,
                unit: 'squares',
                unitPrice: underlayment.pricePerSquare,
                totalPrice: roofSquares * underlayment.pricePerSquare
            });
        }

        // 4. Primary roofing material
        lineItems.push({
            category: 'materials',
            description: `${material.type.replace(/_/g, ' ')} - ${material.brand || options.grade}`,
            quantity: roofSquares,
            unit: 'squares',
            unitPrice: material.pricePerSquare,
            totalPrice: roofSquares * material.pricePerSquare
        });

        // 5. Installation labor
        lineItems.push({
            category: 'labor',
            description: 'Professional installation',
            quantity: roofSquares,
            unit: 'squares',
            unitPrice: laborRates.roofingRate,
            totalPrice: roofSquares * laborRates.roofingRate
        });

        // 6. Flashing and accessories
        const flashingCost = roofSquares * 15; // ~$15/square for flashing
        lineItems.push({
            category: 'materials',
            description: 'Drip edge, flashing, and vents',
            quantity: 1,
            unit: 'lot',
            unitPrice: flashingCost,
            totalPrice: flashingCost
        });

        // 7. Ridge cap and starter strip
        const ridgeCost = roofSquares * 8;
        lineItems.push({
            category: 'materials',
            description: 'Ridge cap and starter strip',
            quantity: 1,
            unit: 'lot',
            unitPrice: ridgeCost,
            totalPrice: ridgeCost
        });

        // 8. Permits
        lineItems.push({
            category: 'permits',
            description: 'Building permit and inspections',
            quantity: 1,
            unit: 'each',
            unitPrice: this.config.permitCosts.basePermit + this.config.permitCosts.inspectionFee,
            totalPrice: this.config.permitCosts.basePermit + this.config.permitCosts.inspectionFee
        });

        // 9. Optional: Gutters
        if (options.includeGutters) {
            const gutterLinearFeet = Math.sqrt(property.squareFootage || 2000) * 4; // Estimate
            const gutterCost = gutterLinearFeet * 12; // ~$12/linear foot installed
            lineItems.push({
                category: 'materials',
                description: '5" seamless aluminum gutters with downspouts',
                quantity: Math.round(gutterLinearFeet),
                unit: 'linear feet',
                unitPrice: 12,
                totalPrice: gutterCost
            });
        }

        // Calculate totals
        const subtotal = lineItems.reduce((sum, item) => sum + item.totalPrice, 0);
        const withOverhead = subtotal * (1 + this.config.overheadMargin);
        const withProfit = withOverhead * (1 + this.config.profitMargin);
        const tax = 0; // Most states don't tax construction labor

        // Estimate timeline
        const estimatedDays = Math.ceil(roofSquares / 8); // ~8 squares per day

        return {
            id: `full-${options.grade}-${Date.now()}`,
            name: `Full Roof Replacement (${this.capitalizeFirst(options.grade)})`,
            type: 'full_replacement',
            description: `Complete tear-off and replacement with ${material.brand || material.type.replace(/_/g, ' ')}`,
            recommended: options.grade === 'standard',
            warrantyYears: material.warrantyYears,
            lineItems,
            subtotal: Math.round(subtotal),
            tax,
            total: Math.round(withProfit),
            estimatedDays,
            canStartWithin: '1-2 weeks',
            materialGrade: options.grade,
            primaryMaterial: material.type,
            materialBrand: material.brand
        };
    }

    /**
     * Calculate repair estimate
     */
    calculateRepair(
        property: PropertyData,
        options: {
            repairType: 'minor' | 'moderate' | 'major';
            description: string;
            affectedArea?: number; // square feet
        }
    ): EstimateOption {
        const laborRates = this.getLaborRates(property.zip);
        const lineItems: EstimateLineItem[] = [];

        // Determine repair scope
        const repairHours = {
            minor: 2,
            moderate: 4,
            major: 8
        }[options.repairType];

        const materialCost = {
            minor: 150,
            moderate: 400,
            major: 800
        }[options.repairType];

        // Labor
        lineItems.push({
            category: 'labor',
            description: `${this.capitalizeFirst(options.repairType)} roof repair - ${options.description}`,
            quantity: repairHours,
            unit: 'hours',
            unitPrice: laborRates.repairRate,
            totalPrice: repairHours * laborRates.repairRate
        });

        // Materials
        lineItems.push({
            category: 'materials',
            description: 'Replacement shingles and materials',
            quantity: 1,
            unit: 'lot',
            unitPrice: materialCost,
            totalPrice: materialCost
        });

        // Sealant and flashing
        if (options.repairType !== 'minor') {
            lineItems.push({
                category: 'materials',
                description: 'Roofing sealant, caulk, and flashing',
                quantity: 1,
                unit: 'lot',
                unitPrice: 75,
                totalPrice: 75
            });
        }

        const subtotal = lineItems.reduce((sum, item) => sum + item.totalPrice, 0);
        const withMargin = subtotal * (1 + this.config.overheadMargin + this.config.profitMargin);

        return {
            id: `repair-${options.repairType}-${Date.now()}`,
            name: `Roof Repair (${this.capitalizeFirst(options.repairType)})`,
            type: 'repair',
            description: options.description,
            recommended: false,
            warrantyYears: 1,
            lineItems,
            subtotal: Math.round(subtotal),
            tax: 0,
            total: Math.round(withMargin),
            estimatedDays: options.repairType === 'major' ? 2 : 1,
            canStartWithin: '2-3 days',
            materialGrade: 'standard',
            primaryMaterial: 'repair_materials'
        };
    }

    /**
     * Calculate emergency/temporary repair
     */
    calculateEmergencyRepair(property: PropertyData): EstimateOption {
        const laborRates = this.getLaborRates(property.zip);
        const emergencyRate = laborRates.repairRate * laborRates.emergencyMultiplier;

        const lineItems: EstimateLineItem[] = [
            {
                category: 'labor',
                description: 'Emergency response and temporary repair',
                quantity: 3,
                unit: 'hours',
                unitPrice: emergencyRate,
                totalPrice: 3 * emergencyRate
            },
            {
                category: 'materials',
                description: 'Emergency tarp, sealant, and temporary materials',
                quantity: 1,
                unit: 'lot',
                unitPrice: 200,
                totalPrice: 200
            }
        ];

        const subtotal = lineItems.reduce((sum, item) => sum + item.totalPrice, 0);
        const withMargin = subtotal * (1 + this.config.overheadMargin + this.config.profitMargin);

        return {
            id: `emergency-${Date.now()}`,
            name: 'Emergency Temporary Repair',
            type: 'emergency',
            description: 'Immediate response to stop active leaks and prevent further damage. Includes tarp installation and temporary sealing.',
            recommended: false,
            warrantyYears: 0,
            lineItems,
            subtotal: Math.round(subtotal),
            tax: 0,
            total: Math.round(withMargin),
            estimatedDays: 1,
            canStartWithin: 'Same day / 24 hours',
            materialGrade: 'standard',
            primaryMaterial: 'emergency_materials',
            notes: 'This is a temporary solution. A permanent repair or replacement will be needed.'
        };
    }

    /**
     * Generate multiple estimate options for a property
     */
    generateEstimateOptions(
        property: PropertyData,
        issueType: 'repair' | 'replacement' | 'inspection' | 'storm_damage'
    ): EstimateOption[] {
        const options: EstimateOption[] = [];

        switch (issueType) {
            case 'repair':
                // Offer repair options
                options.push(this.calculateRepair(property, {
                    repairType: 'minor',
                    description: 'Patch affected area and reseal'
                }));
                options.push(this.calculateRepair(property, {
                    repairType: 'moderate',
                    description: 'Replace damaged section and surrounding shingles'
                }));
                // Also offer replacement as comparison
                options.push(this.calculateFullReplacement(property, {
                    materialType: 'asphalt_architectural',
                    grade: 'standard'
                }));
                break;

            case 'replacement':
            case 'inspection':
                // Offer tiered replacement options
                options.push(this.calculateFullReplacement(property, {
                    materialType: 'asphalt_3tab',
                    grade: 'economy'
                }));
                options.push(this.calculateFullReplacement(property, {
                    materialType: 'asphalt_architectural',
                    grade: 'standard'
                }));
                options.push(this.calculateFullReplacement(property, {
                    materialType: 'asphalt_designer',
                    grade: 'premium',
                    upgradedUnderlayment: true
                }));
                break;

            case 'storm_damage':
                // Emergency first, then replacement options
                options.push(this.calculateEmergencyRepair(property));
                options.push(this.calculateFullReplacement(property, {
                    materialType: 'asphalt_architectural',
                    grade: 'standard'
                }));
                options.push(this.calculateFullReplacement(property, {
                    materialType: 'asphalt_designer',
                    grade: 'premium',
                    upgradedUnderlayment: true
                }));
                break;
        }

        // Mark the recommended option
        const standardOption = options.find(o =>
            o.materialGrade === 'standard' && o.type === 'full_replacement'
        );
        if (standardOption) {
            standardOption.recommended = true;
        }

        return options;
    }

    /**
     * Calculate financing options
     */
    calculateFinancing(total: number): {
        available: boolean;
        monthlyPayment: number;
        term: number;
        apr: number;
        provider: string;
    } | null {
        // Minimum for financing
        if (total < 3000) {
            return null;
        }

        // Standard 12-month same-as-cash
        const term = total > 10000 ? 60 : total > 5000 ? 36 : 12;
        const apr = 0.0999; // 9.99% APR

        // Monthly payment calculation (simple)
        const monthlyRate = apr / 12;
        const monthlyPayment = total * (monthlyRate * Math.pow(1 + monthlyRate, term)) /
            (Math.pow(1 + monthlyRate, term) - 1);

        return {
            available: true,
            monthlyPayment: Math.round(monthlyPayment * 100) / 100,
            term,
            apr,
            provider: 'GreenSky'
        };
    }

    private capitalizeFirst(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Export singleton instance
export const pricingService = new PricingService();
