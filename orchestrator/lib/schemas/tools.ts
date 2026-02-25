import { z } from "zod";

// ── Rover Action Schemas ──

export const navigateSchema = z.object({
  url: z.string().url().describe("Full URL to navigate to on the hotel site"),
});

export const clickElementSchema = z.object({
  selector: z
    .string()
    .describe("CSS selector or natural-language description of the element to click"),
  description: z
    .string()
    .describe("Human-readable description of what is being clicked and why"),
});

export const fillFormSchema = z.object({
  selector: z
    .string()
    .describe("CSS selector or description of the input field"),
  value: z.string().describe("Value to enter"),
  description: z.string().describe("What field is being filled"),
});

export const scrollPageSchema = z.object({
  direction: z.enum(["up", "down"]).describe("Scroll direction"),
  amount: z
    .enum(["small", "medium", "full"])
    .default("medium")
    .describe("Scroll amount"),
});

export const extractContentSchema = z.object({
  query: z
    .string()
    .describe("What information to extract from the current page"),
});

// ── Booking Schemas (require confirmation) ──

export const selectRoomSchema = z.object({
  roomType: z.string().describe("Name/type of room selected"),
  pricePerNight: z.string().describe("Price shown on page"),
  checkIn: z.string().describe("Check-in date"),
  checkOut: z.string().describe("Check-out date"),
  totalPrice: z.string().optional().describe("Total price if shown"),
});

export const confirmBookingSchema = z.object({
  bookingDetails: z.object({
    roomType: z.string(),
    checkIn: z.string(),
    checkOut: z.string(),
    guests: z.number().optional(),
    totalPrice: z.string(),
  }),
  userConsent: z
    .literal(true)
    .describe("Must be true — user has explicitly confirmed"),
  consentMethod: z
    .enum(["verbal", "button", "both"])
    .describe("How the user confirmed"),
});

// ── Agent State Schemas ──

export const sessionStateSchema = z.object({
  sessionKey: z.string(),
  hotelId: z.string(),
  trajectoryId: z.string().optional(),
  currentUrl: z.string().optional(),
  conversationHistory: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system"]),
      content: z.string(),
      timestamp: z.string(),
    })
  ),
  pendingAction: z
    .object({
      type: z.string(),
      details: z.record(z.unknown()),
      awaitingConfirmation: z.boolean(),
    })
    .optional(),
  actionCount: z.number(),
  status: z.enum(["active", "awaiting_confirmation", "completed", "error", "handoff"]),
});

export type SessionState = z.infer<typeof sessionStateSchema>;

// ── Orchestrate Request Schema ──

export const orchestrateRequestSchema = z.object({
  sessionKey: z.string().min(1),
  hotelId: z.string().uuid(),
  userMessage: z.string().min(1).max(2000),
  consentResponse: z
    .object({
      granted: z.boolean(),
      method: z.enum(["verbal", "button", "both"]),
    })
    .optional(),
});

export type OrchestrateRequest = z.infer<typeof orchestrateRequestSchema>;
