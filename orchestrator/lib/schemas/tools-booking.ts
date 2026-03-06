import { z } from "zod";

// ── Booking Tool Schemas ──
// These follow the same Zod pattern as the existing tools.ts schemas.

/**
 * initiate_booking — Called by V·FACE when the member expresses
 * intent to book travel. Captures the conversational context so
 * the backend can kick off inventory search.
 */
export const initiateBookingSchema = z.object({
  memberName: z
    .string()
    .min(1)
    .describe("Full name of the member as stated in conversation"),
  memberId: z
    .string()
    .optional()
    .describe("Loyalty / membership ID if the member provided it"),
  travelType: z
    .enum(["cruise", "hotel", "flight", "vacation_package", "car_rental"])
    .describe("Type of travel the member is interested in"),
  destination: z
    .string()
    .optional()
    .describe("Desired destination (e.g., 'Caribbean', 'Alaska', 'Cancun')"),
  departureWindow: z
    .string()
    .optional()
    .describe("Preferred travel dates or window (e.g., 'March 2026', 'spring break')"),
  travelers: z
    .number()
    .int()
    .min(1)
    .max(20)
    .default(2)
    .describe("Number of travelers"),
  budgetRange: z
    .string()
    .optional()
    .describe("Budget preference if mentioned (e.g., 'under $3000', 'luxury')"),
  specialRequests: z
    .string()
    .optional()
    .describe("Any special requests (e.g., 'balcony cabin', 'ocean view', 'all-inclusive')"),
});

export type InitiateBookingInput = z.infer<typeof initiateBookingSchema>;

/**
 * search_inventory — Called after initiate_booking to query
 * the inventory API for matching packages.
 */
export const searchInventorySchema = z.object({
  sessionId: z
    .string()
    .uuid()
    .describe("Booking session ID returned by initiate_booking"),
  filters: z
    .object({
      travelType: z.enum(["cruise", "hotel", "flight", "vacation_package", "car_rental"]),
      destination: z.string().optional(),
      departureAfter: z.string().optional().describe("ISO 8601 date string"),
      departureBefore: z.string().optional().describe("ISO 8601 date string"),
      maxPrice: z.number().optional(),
      minPrice: z.number().optional(),
      travelers: z.number().int().min(1).max(20).optional(),
      cabinClass: z
        .enum(["inside", "ocean_view", "balcony", "suite", "any"])
        .optional()
        .describe("Cruise cabin class preference"),
      starRating: z.number().int().min(1).max(5).optional(),
    })
    .describe("Search filters derived from the conversation"),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(10).default(5),
});

export type SearchInventoryInput = z.infer<typeof searchInventorySchema>;

/**
 * select_package — Called when the member chooses a specific
 * package from search results. Locks the selection and prepares
 * for PURL generation.
 */
export const selectPackageSchema = z.object({
  sessionId: z
    .string()
    .uuid()
    .describe("Booking session ID"),
  packageId: z
    .string()
    .describe("ID of the selected inventory package"),
  packageSummary: z
    .string()
    .describe("Human-readable summary the agent read to the member"),
  memberConfirmed: z
    .boolean()
    .describe("Whether the member verbally confirmed this selection"),
});

export type SelectPackageInput = z.infer<typeof selectPackageSchema>;

/**
 * generate_purl — Called after selection to create a
 * Personalized URL that pre-fills the member's context
 * into the booking portal. This is the handoff from
 * conversational AI → self-service portal.
 */
export const generatePurlSchema = z.object({
  sessionId: z
    .string()
    .uuid()
    .describe("Booking session ID"),
  deliveryMethod: z
    .enum(["sms", "email", "display", "all"])
    .default("display")
    .describe("How to deliver the PURL to the member"),
  memberEmail: z
    .string()
    .email()
    .optional()
    .describe("Member email for email delivery"),
  memberPhone: z
    .string()
    .optional()
    .describe("Member phone for SMS delivery (E.164 format)"),
});

export type GeneratePurlInput = z.infer<typeof generatePurlSchema>;

/**
 * booking_status — Called to check the status of a booking
 * session (e.g., if the member asks "did my booking go through?").
 */
export const bookingStatusSchema = z.object({
  sessionId: z
    .string()
    .uuid()
    .describe("Booking session ID to check"),
});

export type BookingStatusInput = z.infer<typeof bookingStatusSchema>;
