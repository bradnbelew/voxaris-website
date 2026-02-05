/**
 * EstimAIte - Property Intelligence Service
 *
 * Enriches property data from multiple sources:
 * - Address parsing and geocoding
 * - Property records (county data)
 * - Weather/storm history
 * - Roof analysis from satellite imagery (future)
 */

import axios from 'axios';
import { logger } from '../../lib/logger';
import { PropertyData, WeatherHistory, StormEvent } from './estimaite.types';

// ============================================================================
// TYPES
// ============================================================================

interface GeocodingResult {
    lat: number;
    lng: number;
    formattedAddress: string;
    streetNumber?: string;
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    county?: string;
}

// ============================================================================
// PROPERTY SERVICE
// ============================================================================

class PropertyService {
    private googleMapsApiKey: string;
    private openWeatherApiKey: string;

    constructor() {
        this.googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY || '';
        this.openWeatherApiKey = process.env.OPENWEATHER_API_KEY || '';
    }

    /**
     * Get comprehensive property data for an address
     */
    async getPropertyData(address: string): Promise<PropertyData> {
        logger.info(`🏠 Fetching property data for: ${address}`);

        // Step 1: Parse and geocode address
        const parsed = this.parseAddress(address);
        let geocoded: GeocodingResult | null = null;

        if (this.googleMapsApiKey) {
            geocoded = await this.geocodeAddress(address);
        }

        // Step 2: Build property data object
        const propertyData: PropertyData = {
            address: geocoded?.formattedAddress || address,
            street: geocoded?.street || parsed.street,
            city: geocoded?.city || parsed.city,
            state: geocoded?.state || parsed.state,
            zip: geocoded?.zip || parsed.zip,
            county: geocoded?.county,
            latitude: geocoded?.lat,
            longitude: geocoded?.lng
        };

        // Step 3: Estimate roof details based on location
        const roofEstimates = this.estimateRoofDetails(propertyData);
        Object.assign(propertyData, roofEstimates);

        // Step 4: Get regional factors
        const regionalFactors = this.getRegionalFactors(propertyData.state, propertyData.zip);
        Object.assign(propertyData, regionalFactors);

        logger.info(`✅ Property data enriched for ${propertyData.city}, ${propertyData.state}`);

        return propertyData;
    }

    /**
     * Get weather and storm history for a location
     */
    async getWeatherHistory(
        lat: number,
        lng: number,
        zip: string
    ): Promise<WeatherHistory> {
        logger.info(`🌦️ Fetching weather history for ${zip}`);

        // For MVP, use regional storm data based on state/zone
        // Future: Integrate with NOAA Storm Events Database API
        const recentStorms = await this.getRecentStorms(zip);

        // Get regional risk factors
        const hailRisk = this.getHailRisk(zip);
        const hurricaneZone = this.isHurricaneZone(zip);

        return {
            recentStorms,
            averageWindSpeed: this.getAverageWindSpeed(zip),
            annualRainfall: this.getAnnualRainfall(zip),
            hailRisk,
            hurricaneZone
        };
    }

    /**
     * Parse address string into components
     */
    parseAddress(address: string): {
        street: string;
        city: string;
        state: string;
        zip: string;
    } {
        const result = {
            street: address,
            city: '',
            state: '',
            zip: ''
        };

        // Extract zip code
        const zipMatch = address.match(/\b(\d{5})(?:-\d{4})?\b/);
        if (zipMatch) {
            result.zip = zipMatch[1];
        }

        // Try to parse comma-separated format
        const parts = address.split(',').map(p => p.trim());

        if (parts.length >= 3) {
            result.street = parts[0];
            result.city = parts[1];

            // State and zip in last part
            const stateZipMatch = parts[2].match(/^([A-Z]{2})\s*(\d{5})?/i);
            if (stateZipMatch) {
                result.state = stateZipMatch[1].toUpperCase();
                if (stateZipMatch[2]) result.zip = stateZipMatch[2];
            }
        } else if (parts.length === 2) {
            result.street = parts[0];
            result.city = parts[1];
        }

        // Default state for Florida roofing company
        if (!result.state) {
            result.state = 'FL';
        }

        return result;
    }

    /**
     * Geocode address using Google Maps API
     */
    private async geocodeAddress(address: string): Promise<GeocodingResult | null> {
        if (!this.googleMapsApiKey) {
            logger.warn('⚠️ Google Maps API key not configured');
            return null;
        }

        try {
            const response = await axios.get(
                'https://maps.googleapis.com/maps/api/geocode/json',
                {
                    params: {
                        address,
                        key: this.googleMapsApiKey
                    }
                }
            );

            if (response.data.status !== 'OK' || !response.data.results[0]) {
                logger.warn(`⚠️ Geocoding failed for: ${address}`);
                return null;
            }

            const result = response.data.results[0];
            const components = result.address_components;

            const getComponent = (type: string) => {
                const comp = components.find((c: any) => c.types.includes(type));
                return comp?.long_name || comp?.short_name || '';
            };

            return {
                lat: result.geometry.location.lat,
                lng: result.geometry.location.lng,
                formattedAddress: result.formatted_address,
                streetNumber: getComponent('street_number'),
                street: `${getComponent('street_number')} ${getComponent('route')}`.trim(),
                city: getComponent('locality') || getComponent('sublocality'),
                state: getComponent('administrative_area_level_1'),
                zip: getComponent('postal_code'),
                county: getComponent('administrative_area_level_2')
            };

        } catch (error: any) {
            logger.error('❌ Geocoding error:', error.message);
            return null;
        }
    }

    /**
     * Estimate roof details based on property location and type
     */
    private estimateRoofDetails(property: PropertyData): Partial<PropertyData> {
        // Regional defaults for Florida
        const floridaDefaults = {
            roofType: 'asphalt_shingle' as const,
            roofPitch: 'medium' as const,
            stories: 1
        };

        // Estimate roof square footage
        // Typical ratio: roof sqft = home sqft * 1.1-1.5 (depending on pitch)
        const pitchMultiplier = {
            flat: 1.0,
            low: 1.1,
            medium: 1.25,
            steep: 1.4
        };

        const pitch = floridaDefaults.roofPitch;
        const multiplier = pitchMultiplier[pitch];

        // If we have home square footage, estimate roof
        // Otherwise use regional average (~2000 sqft home in FL)
        const homeSqft = property.squareFootage || 2000;
        const roofSqft = Math.round(homeSqft * multiplier);

        return {
            ...floridaDefaults,
            roofSquareFootage: roofSqft,
            squareFootage: homeSqft
        };
    }

    /**
     * Get regional factors (wind zone, flood zone, etc.)
     */
    private getRegionalFactors(state: string, zip: string): Partial<PropertyData> {
        // Florida-specific wind zones
        // This is simplified - real implementation would use FEMA data
        const floridaHighWindZips = [
            '33101', '33109', '33125', '33129', '33130', '33131', '33132', '33133',
            '33134', '33135', '33136', '33137', '33138', '33139', '33140', '33141',
            '33142', '33143', '33144', '33145', '33146', '33147', '33149', '33150',
            '33154', '33155', '33156', '33157', '33158', '33160', '33161', '33162'
        ];

        const isHighWind = floridaHighWindZips.some(z => zip.startsWith(z.slice(0, 3)));

        return {
            windZone: isHighWind ? 'HVHZ' : 'Standard',
            floodZone: 'Unknown' // Would need FEMA API
        };
    }

    /**
     * Get recent storms for a zip code
     */
    private async getRecentStorms(zip: string): Promise<StormEvent[]> {
        // For MVP, return mock data based on Florida storm history
        // Future: Integrate with NOAA Storm Events Database

        const mockStorms: StormEvent[] = [];

        // Florida typically has storm season June-November
        const now = new Date();
        const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

        // Add some realistic Florida storm events
        if (now.getMonth() >= 5 && now.getMonth() <= 10) {
            mockStorms.push({
                date: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
                type: 'severe_thunderstorm',
                severity: 'moderate',
                windSpeed: 65,
                location: `${zip} area`
            });
        }

        // Check for recent hurricane season
        if (now.getMonth() >= 7 && now.getMonth() <= 10) {
            mockStorms.push({
                date: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
                type: 'wind',
                severity: 'moderate',
                windSpeed: 55,
                location: `${zip} area`
            });
        }

        return mockStorms;
    }

    /**
     * Get hail risk for a zip code
     */
    private getHailRisk(zip: string): 'low' | 'medium' | 'high' {
        // Florida generally has low-medium hail risk
        // Central Florida has higher risk than coastal areas
        const centralFloridaZips = ['32', '33', '34'];
        const isCentralFL = centralFloridaZips.some(prefix => zip.startsWith(prefix));

        return isCentralFL ? 'medium' : 'low';
    }

    /**
     * Check if location is in hurricane zone
     */
    private isHurricaneZone(zip: string): boolean {
        // All of Florida is in hurricane zone
        return zip.startsWith('32') || zip.startsWith('33') || zip.startsWith('34');
    }

    /**
     * Get average wind speed for region
     */
    private getAverageWindSpeed(zip: string): number {
        // Florida averages 8-12 mph
        return 10;
    }

    /**
     * Get annual rainfall for region
     */
    private getAnnualRainfall(zip: string): number {
        // Florida averages 50-65 inches
        return 54;
    }

    /**
     * Calculate roof complexity factor
     */
    calculateComplexityFactor(property: PropertyData): number {
        let factor = 1.0;

        // Pitch adjustment
        if (property.roofPitch === 'steep') factor += 0.15;
        if (property.roofPitch === 'flat') factor -= 0.05;

        // Stories adjustment
        if (property.stories && property.stories >= 2) factor += 0.1;
        if (property.stories && property.stories >= 3) factor += 0.15;

        // High wind zone adjustment
        if (property.windZone === 'HVHZ') factor += 0.1;

        return factor;
    }
}

// Export singleton instance
export const propertyService = new PropertyService();
