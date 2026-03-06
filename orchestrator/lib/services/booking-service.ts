import { nanoid } from "nanoid";
import { db } from "@/db";
import { bookingSessions, purlRecords } from "@/db/schema-booking";
import { eq } from "drizzle-orm";
import { PurlService } from "./purl-service";
import { createRequestLogger } from "@/lib/utils/logger";
import type {
  InitiateBookingInput,
  SearchInventoryInput,
  SelectPackageInput,
  GeneratePurlInput,
  BookingStatusInput,
} from "@/lib/schemas/tools-booking";

// ── Booking Service ──
// Bridges the V·FACE conversation → inventory search → PURL generation.
// This is the core business logic layer that the execute-route cases call.

// ── Types ──

interface InventoryResult {
  packageId: string;
  name: string;
  description: string;
  travelType: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  pricePerPerson: number;
  totalPrice: number;
  currency: string;
  cabinClass?: string;
  starRating?: number;
  highlights: string[];
  availableSlots: number;
  provider: string;
  deepLink?: string;
}

interface SearchResult {
  results: InventoryResult[];
  totalCount: number;
  page: number;
  pageSize: number;
  searchId: string;
}

export type BookingSessionStatus =
  | "initiated"
  | "searching"
  | "results_presented"
  | "package_selected"
  | "purl_generated"
  | "purl_clicked"
  | "booking_completed"
  | "expired"
  | "cancelled";

// ── Inventory Client ──
// Abstraction over the partner inventory API (Arrivia, etc.)
// Replace the mock with actual API calls when connecting to Arrivia's system.

class InventoryClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor() {
    this.baseUrl = process.env.INVENTORY_API_URL ?? "https://api.arrivia.com/v1";
    this.apiKey = process.env.INVENTORY_API_KEY ?? "";
  }

  async search(
    filters: SearchInventoryInput["filters"],
    page: number,
    pageSize: number,
    correlationId: string
  ): Promise<SearchResult> {
    const log = createRequestLogger(correlationId, { service: "inventory" });

    // ── Production: call the partner inventory API ──
    if (this.apiKey) {
      log.info({ filters, page }, "Querying inventory API");

      const response = await fetch(`${this.baseUrl}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          travel_type: filters.travelType,
          destination: filters.destination,
          departure_after: filters.departureAfter,
          departure_before: filters.departureBefore,
          max_price: filters.maxPrice,
          min_price: filters.minPrice,
          travelers: filters.travelers,
          cabin_class: filters.cabinClass,
          star_rating: filters.starRating,
          page,
          page_size: pageSize,
        }),
        signal: AbortSignal.timeout(15_000),
      });

      if (!response.ok) {
        const body = await response.text();
        log.error({ status: response.status, body }, "Inventory API error");
        throw new Error(`Inventory API returned ${response.status}: ${body}`);
      }

      const data = (await response.json()) as {
        results: InventoryResult[];
        total_count: number;
        search_id: string;
      };

      return {
        results: data.results,
        totalCount: data.total_count,
        page,
        pageSize,
        searchId: data.search_id,
      };
    }

    // ── Demo mode: return mock results ──
    log.info("Using demo inventory results (no INVENTORY_API_KEY set)");
    return this.mockSearch(filters, page, pageSize);
  }

  private mockSearch(
    filters: SearchInventoryInput["filters"],
    page: number,
    pageSize: number
  ): SearchResult {
    const mockResults: InventoryResult[] = [
      {
        packageId: "pkg_cruise_carib_001",
        name: "7-Night Western Caribbean Cruise",
        description:
          "Depart from Miami with stops in Cozumel, Grand Cayman, and Jamaica. All meals included.",
        travelType: "cruise",
        destination: "Western Caribbean",
        departureDate: "2026-04-15",
        returnDate: "2026-04-22",
        pricePerPerson: 1299,
        totalPrice: 2598,
        currency: "USD",
        cabinClass: "ocean_view",
        highlights: [
          "Ocean view cabin",
          "All meals included",
          "2 shore excursions",
          "Complimentary spa credit",
        ],
        availableSlots: 12,
        provider: "Royal Caribbean",
      },
      {
        packageId: "pkg_cruise_carib_002",
        name: "10-Night Eastern Caribbean Cruise",
        description:
          "Roundtrip from Fort Lauderdale visiting St. Thomas, St. Maarten, and the Bahamas.",
        travelType: "cruise",
        destination: "Eastern Caribbean",
        departureDate: "2026-04-20",
        returnDate: "2026-04-30",
        pricePerPerson: 1899,
        totalPrice: 3798,
        currency: "USD",
        cabinClass: "balcony",
        highlights: [
          "Private balcony cabin",
          "Beverage package included",
          "3 shore excursions",
          "Priority boarding",
        ],
        availableSlots: 5,
        provider: "Celebrity Cruises",
      },
      {
        packageId: "pkg_cruise_alaska_001",
        name: "7-Night Alaska Inside Passage",
        description:
          "Sail from Seattle through Juneau, Skagway, and Ketchikan with glacier viewing.",
        travelType: "cruise",
        destination: "Alaska",
        departureDate: "2026-06-10",
        returnDate: "2026-06-17",
        pricePerPerson: 1599,
        totalPrice: 3198,
        currency: "USD",
        cabinClass: "balcony",
        highlights: [
          "Glacier viewing",
          "Balcony cabin",
          "Wildlife excursion",
          "All meals included",
        ],
        availableSlots: 8,
        provider: "Holland America",
      },
    ];

    // Filter by destination if specified
    let filtered = mockResults;
    if (filters.destination) {
      const dst = filters.destination.toLowerCase();
      filtered = mockResults.filter(
        (r) =>
          r.destination.toLowerCase().includes(dst) ||
          r.name.toLowerCase().includes(dst)
      );
    }
    if (filters.maxPrice) {
      filtered = filtered.filter((r) => r.pricePerPerson <= filters.maxPrice!);
    }

    return {
      results: filtered.slice((page - 1) * pageSize, page * pageSize),
      totalCount: filtered.length,
      page,
      pageSize,
      searchId: `search_${nanoid(12)}`,
    };
  }
}

// ── Singleton ──
let _inventoryClient: InventoryClient | undefined;
function getInventoryClient(): InventoryClient {
  if (!_inventoryClient) _inventoryClient = new InventoryClient();
  return _inventoryClient;
}

// ── Booking Service ──

export class BookingService {
  /**
   * Step 1: Initiate a booking session.
   * Creates a DB record to track the full booking lifecycle.
   */
  static async initiateBooking(
    input: InitiateBookingInput,
    conversationId: string,
    correlationId: string
  ): Promise<{ sessionId: string; message: string }> {
    const log = createRequestLogger(correlationId, { service: "booking" });
    const sessionId = crypto.randomUUID();

    await db.insert(bookingSessions).values({
      id: sessionId,
      conversationId,
      memberName: input.memberName,
      memberId: input.memberId ?? null,
      travelType: input.travelType,
      destination: input.destination ?? null,
      departureWindow: input.departureWindow ?? null,
      travelers: input.travelers,
      budgetRange: input.budgetRange ?? null,
      specialRequests: input.specialRequests ?? null,
      status: "initiated",
      correlationId,
    });

    log.info({ sessionId, travelType: input.travelType, destination: input.destination }, "Booking session initiated");

    return {
      sessionId,
      message: `Booking session created. I'll search for ${input.travelType} options${input.destination ? ` to ${input.destination}` : ""} for ${input.travelers} traveler${input.travelers > 1 ? "s" : ""}.`,
    };
  }

  /**
   * Step 2: Search inventory.
   * Calls the partner inventory API and stores results in the session.
   */
  static async searchInventory(
    input: SearchInventoryInput,
    correlationId: string
  ): Promise<SearchResult> {
    const log = createRequestLogger(correlationId, { service: "booking" });

    // Update session status
    await db
      .update(bookingSessions)
      .set({ status: "searching" })
      .where(eq(bookingSessions.id, input.sessionId));

    const client = getInventoryClient();
    const results = await client.search(input.filters, input.page, input.pageSize, correlationId);

    // Store search results in session
    await db
      .update(bookingSessions)
      .set({
        status: "results_presented",
        lastSearchId: results.searchId,
        lastSearchResults: JSON.stringify(results.results.map((r) => ({
          packageId: r.packageId,
          name: r.name,
          pricePerPerson: r.pricePerPerson,
          totalPrice: r.totalPrice,
        }))),
      })
      .where(eq(bookingSessions.id, input.sessionId));

    log.info(
      { sessionId: input.sessionId, resultCount: results.totalCount, page: results.page },
      "Inventory search complete"
    );

    return results;
  }

  /**
   * Step 3: Member selects a package.
   * Locks the selection and prepares for PURL generation.
   */
  static async selectPackage(
    input: SelectPackageInput,
    correlationId: string
  ): Promise<{ success: boolean; message: string }> {
    const log = createRequestLogger(correlationId, { service: "booking" });

    if (!input.memberConfirmed) {
      return {
        success: false,
        message: "The member must verbally confirm their selection before proceeding.",
      };
    }

    await db
      .update(bookingSessions)
      .set({
        status: "package_selected",
        selectedPackageId: input.packageId,
        selectedPackageSummary: input.packageSummary,
      })
      .where(eq(bookingSessions.id, input.sessionId));

    log.info({ sessionId: input.sessionId, packageId: input.packageId }, "Package selected");

    return {
      success: true,
      message: `Package locked in. Ready to generate your personalized booking link.`,
    };
  }

  /**
   * Step 4: Generate PURL.
   * Creates a signed personalized URL and optionally delivers it via SMS/email.
   */
  static async generatePurl(
    input: GeneratePurlInput,
    correlationId: string
  ): Promise<{ purl: string; deliveryMethod: string; message: string }> {
    const log = createRequestLogger(correlationId, { service: "booking" });

    // Fetch session for context
    const [session] = await db
      .select()
      .from(bookingSessions)
      .where(eq(bookingSessions.id, input.sessionId))
      .limit(1);

    if (!session) {
      throw new Error(`Booking session not found: ${input.sessionId}`);
    }

    if (!session.selectedPackageId) {
      throw new Error("No package selected — call select_package first");
    }

    // Generate the PURL
    const purl = PurlService.generate(
      {
        sessionId: session.id,
        memberName: session.memberName,
        memberId: session.memberId ?? undefined,
        packageId: session.selectedPackageId,
        travelType: session.travelType,
        destination: session.destination ?? undefined,
        travelers: session.travelers,
        departureDate: undefined, // Will be on the package details
        memberEmail: input.memberEmail,
        ttlMinutes: 120,
      },
      correlationId
    );

    // Store PURL record
    await db.insert(purlRecords).values({
      id: crypto.randomUUID(),
      bookingSessionId: session.id,
      purl,
      deliveryMethod: input.deliveryMethod,
      memberEmail: input.memberEmail ?? null,
      memberPhone: input.memberPhone ?? null,
      expiresAt: new Date(Date.now() + 120 * 60 * 1000), // 2 hours
    });

    // Update session
    await db
      .update(bookingSessions)
      .set({ status: "purl_generated" })
      .where(eq(bookingSessions.id, input.sessionId));

    // ── Delivery ──
    let deliveryMessage: string;

    switch (input.deliveryMethod) {
      case "sms":
        if (input.memberPhone) {
          await deliverViaSms(purl, input.memberPhone, session.memberName, correlationId);
          deliveryMessage = `I've sent a text message to your phone with your personalized booking link. It'll be valid for the next 2 hours.`;
        } else {
          deliveryMessage = `I have your booking link ready, but I'll need your phone number to text it to you. For now, here it is on screen.`;
        }
        break;

      case "email":
        if (input.memberEmail) {
          await deliverViaEmail(purl, input.memberEmail, session.memberName, session.selectedPackageSummary ?? "", correlationId);
          deliveryMessage = `I've sent the personalized booking link to your email at ${maskEmail(input.memberEmail)}. It'll be valid for 2 hours.`;
        } else {
          deliveryMessage = `I have your booking link ready, but I'll need your email to send it. For now, here it is on screen.`;
        }
        break;

      case "all":
        if (input.memberEmail) {
          await deliverViaEmail(purl, input.memberEmail, session.memberName, session.selectedPackageSummary ?? "", correlationId);
        }
        if (input.memberPhone) {
          await deliverViaSms(purl, input.memberPhone, session.memberName, correlationId);
        }
        deliveryMessage = `I've sent your personalized booking link to ${[
          input.memberEmail ? `your email` : "",
          input.memberPhone ? `your phone` : "",
        ]
          .filter(Boolean)
          .join(" and ")}. The link is valid for 2 hours.`;
        break;

      default:
        deliveryMessage = `Here's your personalized booking link. It's valid for the next 2 hours. You can click it to complete your booking with all your preferences already filled in.`;
    }

    log.info(
      { sessionId: input.sessionId, deliveryMethod: input.deliveryMethod },
      "PURL generated and delivered"
    );

    return {
      purl,
      deliveryMethod: input.deliveryMethod,
      message: deliveryMessage,
    };
  }

  /**
   * Check status of a booking session.
   */
  static async getStatus(
    input: BookingStatusInput,
    correlationId: string
  ): Promise<{
    status: BookingSessionStatus;
    sessionId: string;
    summary: string;
  }> {
    const [session] = await db
      .select()
      .from(bookingSessions)
      .where(eq(bookingSessions.id, input.sessionId))
      .limit(1);

    if (!session) {
      return {
        status: "expired",
        sessionId: input.sessionId,
        summary: "I couldn't find that booking session. It may have expired.",
      };
    }

    const statusMessages: Record<BookingSessionStatus, string> = {
      initiated: "Your booking session is active. We're ready to search for options.",
      searching: "I'm currently searching for available packages.",
      results_presented: "I've found some options for you. Would you like to hear about them?",
      package_selected: `You've selected a package. Ready to generate your booking link.`,
      purl_generated: "Your personalized booking link has been created and sent.",
      purl_clicked: "You've opened the booking link. Complete the booking on the portal.",
      booking_completed: "Your booking has been confirmed.",
      expired: "This booking session has expired. I can start a new one for you.",
      cancelled: "This booking session was cancelled.",
    };

    return {
      status: session.status as BookingSessionStatus,
      sessionId: session.id,
      summary: statusMessages[session.status as BookingSessionStatus] ?? "Unknown status.",
    };
  }
}

// ── Delivery Helpers ──
// Stub implementations — wire to your SMS/email providers.

async function deliverViaSms(
  purl: string,
  phone: string,
  memberName: string,
  correlationId: string
): Promise<void> {
  const log = createRequestLogger(correlationId, { service: "sms" });

  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`;
    const response = await fetch(twilioUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
        ).toString("base64")}`,
      },
      body: new URLSearchParams({
        To: phone,
        From: process.env.TWILIO_PHONE_NUMBER ?? "",
        Body: `Hi ${memberName}, here's your personalized booking link: ${purl} — This link expires in 2 hours.`,
      }),
    });

    if (!response.ok) {
      log.error({ status: response.status }, "Twilio SMS delivery failed");
    } else {
      log.info({ phone: maskPhone(phone) }, "SMS delivered via Twilio");
    }
    return;
  }

  log.info({ phone: maskPhone(phone) }, "SMS delivery skipped — no Twilio credentials");
}

async function deliverViaEmail(
  purl: string,
  email: string,
  memberName: string,
  packageSummary: string,
  correlationId: string
): Promise<void> {
  const log = createRequestLogger(correlationId, { service: "email" });

  if (process.env.RESEND_API_KEY) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: process.env.BOOKING_FROM_EMAIL ?? "bookings@voxaris.io",
        to: email,
        subject: "Your Personalized Booking Link",
        html: buildBookingEmailHtml(memberName, packageSummary, purl),
      }),
    });

    if (!response.ok) {
      log.error({ status: response.status }, "Resend email delivery failed");
    } else {
      log.info({ email: maskEmail(email) }, "Email delivered via Resend");
    }
    return;
  }

  log.info({ email: maskEmail(email) }, "Email delivery skipped — no Resend credentials");
}

function buildBookingEmailHtml(
  memberName: string,
  packageSummary: string,
  purl: string
): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #1B2A4A;">Your Personalized Booking Link</h2>
  <p>Hi ${memberName},</p>
  <p>Great news — I've prepared everything for your booking:</p>
  <div style="background: #f8f9fa; border-left: 4px solid #C5A55A; padding: 16px; margin: 20px 0; border-radius: 4px;">
    <p style="margin: 0; color: #1B2A4A;">${packageSummary}</p>
  </div>
  <p>Click below to complete your booking. Your preferences and details are already filled in:</p>
  <a href="${purl}" style="display: inline-block; background: #1B2A4A; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600;">Complete Your Booking</a>
  <p style="color: #888; font-size: 13px; margin-top: 24px;">This link expires in 2 hours. If you have questions, just reply to this email.</p>
</body>
</html>`;
}

// ── Utility ──

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return "***@***";
  return `${local[0]}***@${domain}`;
}

function maskPhone(phone: string): string {
  if (phone.length < 4) return "***";
  return `***${phone.slice(-4)}`;
}
