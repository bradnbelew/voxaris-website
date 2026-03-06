import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createRequestLogger } from "@/lib/utils/logger";
import { correlationId } from "@/lib/utils/id";
import {
  initiateBookingSchema,
  searchInventorySchema,
  selectPackageSchema,
  generatePurlSchema,
  bookingStatusSchema,
} from "@/lib/schemas/tools-booking";
import { BookingService } from "@/lib/services/booking-service";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * Tool executor + Rover action relay for Tavus-native mode.
 *
 * POST: Tavus Raven calls tools → execute → queue DOM action → return result
 * GET:  Loader polls for pending DOM actions → return + clear queue
 *
 * globalThis.__roverActionQueue is shared within the same Vercel function bundle,
 * so POST (from Tavus) and GET (from loader) share the same in-memory queue.
 */

// ── In-memory action queue (shared within warm function instance) ──
interface RoverAction {
  action: string;
  [key: string]: unknown;
}

declare global {
  // eslint-disable-next-line no-var
  var __roverActionQueue: Map<string, RoverAction[]> | undefined;
  // eslint-disable-next-line no-var
  var __roverQueueCleanup: ReturnType<typeof setInterval> | undefined;
}

function getQueue(): Map<string, RoverAction[]> {
  if (!globalThis.__roverActionQueue) {
    globalThis.__roverActionQueue = new Map();

    // Auto-cleanup stale queues every 5 minutes
    if (!globalThis.__roverQueueCleanup) {
      globalThis.__roverQueueCleanup = setInterval(() => {
        const queue = globalThis.__roverActionQueue;
        if (queue && queue.size > 100) {
          const keys: string[] = Array.from(queue.keys());
          for (let i = 0; i < keys.length - 50; i++) {
            queue.delete(keys[i]!);
          }
        }
      }, 300_000);
    }
  }
  return globalThis.__roverActionQueue;
}

function pushAction(conversationId: string, action: RoverAction) {
  const queue = getQueue();
  const actions = queue.get(conversationId) || [];
  actions.push(action);
  queue.set(conversationId, actions);
}

function popActions(conversationId: string): RoverAction[] {
  const queue = getQueue();
  const actions = queue.get(conversationId) || [];
  queue.delete(conversationId);
  return actions;
}

// ── Schemas ──

const toolCallSchema = z.object({
  conversation_id: z.string(),
  tool_call_id: z.string(),
  tool_name: z.string(),
  tool_input: z.record(z.unknown()),
  timestamp: z.string().optional(),
});

// Section-to-selector mapping for voxaris.io self-demo
const SECTION_SELECTORS: Record<string, string> = {
  hero: "#hero, [data-section='hero'], .hero-section, header",
  features: "#features, [data-section='features'], .features-section",
  "how-it-works": "#how-it-works, [data-section='how-it-works']",
  solutions: "#solutions, [data-section='solutions']",
  technology: "#technology, [data-section='technology']",
  pricing: "#pricing, [data-section='pricing']",
  demo: "#demo, #book-demo, [data-section='demo']",
  contact: "#contact, footer, [data-section='contact']",
  cta: "#cta, [data-section='cta']",
  vface: "#vface, [data-section='vface'], .vface-section",
  vvoice: "#vvoice, [data-section='vvoice'], .vvoice-section",
  vsuite: "#vsuite, [data-section='vsuite'], .vsuite-section",
  "talking-postcard": "#talking-postcard, [data-section='talking-postcard']",
};

const PAGE_ROUTES: Record<string, string> = {
  home: "/",
  technology: "/technology",
  "solutions-dealerships": "/solutions/dealerships",
  "solutions-law-firms": "/solutions/law-firms",
  "solutions-contractors": "/solutions/contractors",
  pricing: "/pricing",
  demo: "/demo",
  "how-it-works": "/how-it-works",
};

// ── GET: Loader polls for pending Rover actions ──
export async function GET(request: NextRequest) {
  const cid = request.nextUrl.searchParams.get("cid");
  if (!cid) {
    return NextResponse.json({ actions: [] }, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store",
      },
    });
  }

  const actions = popActions(cid);

  return NextResponse.json({ actions }, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store",
    },
  });
}

// ── POST: Tavus Raven tool execution ──
export async function POST(request: NextRequest) {
  const corrId = correlationId();
  const log = createRequestLogger(corrId, { route: "execute" });
  const startTime = Date.now();

  try {
    const raw = await request.json();
    const parsed = toolCallSchema.safeParse(raw);

    if (!parsed.success) {
      log.warn({ errors: parsed.error.issues }, "Invalid tool call");
      return NextResponse.json(
        { error: "Invalid tool call format" },
        { status: 400 }
      );
    }

    const { conversation_id, tool_call_id, tool_name, tool_input } = parsed.data;
    log.info({ conversation_id, tool_name, tool_call_id }, "Tool call received from Tavus");

    let result: Record<string, unknown>;

    switch (tool_name) {
      case "scroll_to_section": {
        const section = tool_input.section as string;
        const selector = SECTION_SELECTORS[section];

        if (!selector) {
          result = { success: false, error: `Unknown section: ${section}` };
          break;
        }

        result = {
          success: true,
          action: "scroll_to_section",
          section,
          selector,
          instruction: `Smooth scroll to ${section} section`,
        };

        // Queue DOM action for the loader to pick up
        pushAction(conversation_id, {
          action: "scroll_to_section",
          selector,
          section,
        });

        // If Rover is available (hotel mode), also fire via Rover
        try {
          if (process.env.ROVER_API_KEY) {
            const { getRoverClient } = await import("@/lib/clients/rover");
            const rover = getRoverClient();
            if (rover.isAvailable) {
              const roverResult = await rover.executeAction(
                { input: `Scroll to the ${section} section of the page`, maxSteps: 2 },
                corrId
              );
              result.rover_status = roverResult.status;
            }
          }
        } catch {
          log.warn("Rover scroll failed, falling back to embed bridge");
        }
        break;
      }

      case "highlight_feature": {
        const feature = tool_input.feature as string;
        result = {
          success: true,
          action: "highlight_feature",
          feature,
          instruction: `Highlight the "${feature}" element`,
        };

        // Queue DOM action
        pushAction(conversation_id, {
          action: "highlight_feature",
          feature,
        });
        break;
      }

      case "navigate_to_page": {
        const page = tool_input.page as string;
        const route = PAGE_ROUTES[page];

        if (!route) {
          result = { success: false, error: `Unknown page: ${page}` };
          break;
        }

        result = {
          success: true,
          action: "navigate_to_page",
          page,
          route,
          instruction: `Navigate to ${route}`,
        };

        // Queue DOM action
        pushAction(conversation_id, {
          action: "navigate_to_page",
          route,
        });

        // Fire Rover for hotel sites
        try {
          if (process.env.ROVER_API_KEY) {
            const { getRoverClient } = await import("@/lib/clients/rover");
            const rover = getRoverClient();
            if (rover.isAvailable) {
              const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.voxaris.io";
              const roverResult = await rover.navigate(`${baseUrl}${route}`, undefined, corrId);
              result.rover_status = roverResult.status;
            }
          }
        } catch {
          log.warn("Rover navigation failed, falling back to embed bridge");
        }
        break;
      }

      case "extract_page_content": {
        const query = tool_input.query as string;

        // For self-demo, return known content. For hotels, use Rover.
        try {
          if (process.env.ROVER_API_KEY) {
            const { getRoverClient } = await import("@/lib/clients/rover");
            const rover = getRoverClient();
            if (rover.isAvailable) {
              const roverResult = await rover.extractContent(query, undefined, corrId);
              result = {
                success: true,
                content: roverResult.steps.map((s: { description: string }) => s.description).join("\n"),
              };
              break;
            }
          }
        } catch {
          log.warn("Rover extract failed");
        }

        // Fallback: static site knowledge
        result = {
          success: true,
          content: getStaticSiteContent(query),
        };
        break;
      }

      case "perform_rover_action": {
        const roverAction = tool_input.action as string;
        const target = tool_input.target as string;
        const value = tool_input.value as string | undefined;

        // Map generic rover actions to DOM queue actions
        switch (roverAction) {
          case "scroll_to": {
            // Target can be a CSS selector, section name, or description
            const sectionSelector = SECTION_SELECTORS[target] || target;
            pushAction(conversation_id, {
              action: "scroll_to_section",
              selector: sectionSelector,
              section: target,
            });
            result = { success: true, action: "scroll_to", target, selector: sectionSelector };
            break;
          }
          case "click": {
            pushAction(conversation_id, {
              action: "click_element",
              selector: target,
            });
            result = { success: true, action: "click", target };
            break;
          }
          case "highlight": {
            pushAction(conversation_id, {
              action: "highlight_feature",
              feature: target,
            });
            result = { success: true, action: "highlight", target };
            break;
          }
          case "fill": {
            pushAction(conversation_id, {
              action: "fill_field",
              selector: target,
              value: value || "",
            });
            result = { success: true, action: "fill", target, value };
            break;
          }
          case "select": {
            pushAction(conversation_id, {
              action: "select_option",
              selector: target,
              value: value || "",
            });
            result = { success: true, action: "select", target, value };
            break;
          }
          case "submit": {
            pushAction(conversation_id, {
              action: "click_element",
              selector: target,
            });
            result = { success: true, action: "submit", target };
            break;
          }
          default: {
            result = { success: false, error: `Unknown rover action: ${roverAction}` };
          }
        }
        break;
      }

      case "request_demo_booking": {
        result = {
          success: true,
          action: "request_demo_booking",
          requires_confirmation: true,
          message: "Demo booking request received. Please confirm by clicking the 'Book Demo' button.",
          details: tool_input,
        };

        // Queue action to scroll to CTA section
        pushAction(conversation_id, {
          action: "scroll_to_section",
          selector: "#cta, [data-section='cta'], #demo, [data-section='demo']",
          section: "cta",
        });
        break;
      }

      // ── Booking Orchestration Tools ──

      case "initiate_booking": {
        const parsed_ib = initiateBookingSchema.safeParse(tool_input);
        if (!parsed_ib.success) {
          result = {
            success: false,
            error: "Invalid booking input",
            details: parsed_ib.error.issues.map((i) => i.message),
          };
          break;
        }

        try {
          const booking = await BookingService.initiateBooking(
            parsed_ib.data,
            conversation_id,
            corrId
          );

          result = {
            success: true,
            action: "initiate_booking",
            sessionId: booking.sessionId,
            message: booking.message,
            instruction: `Booking session started for ${parsed_ib.data.travelType}. Session ID: ${booking.sessionId}`,
          };
        } catch (error) {
          const msg = error instanceof Error ? error.message : "Unknown error";
          log.error({ error: msg }, "initiate_booking failed");
          result = { success: false, error: msg };
        }
        break;
      }

      case "search_inventory": {
        const parsed_si = searchInventorySchema.safeParse(tool_input);
        if (!parsed_si.success) {
          result = {
            success: false,
            error: "Invalid search input",
            details: parsed_si.error.issues.map((i) => i.message),
          };
          break;
        }

        try {
          const searchResult = await BookingService.searchInventory(
            parsed_si.data,
            corrId
          );

          // Format results for the agent to read back to the member
          const formattedResults = searchResult.results.map((r, i) => ({
            option: i + 1,
            packageId: r.packageId,
            name: r.name,
            destination: r.destination,
            dates: `${r.departureDate} to ${r.returnDate}`,
            pricePerPerson: `$${r.pricePerPerson.toLocaleString()}`,
            totalPrice: `$${r.totalPrice.toLocaleString()}`,
            cabinClass: r.cabinClass ?? "standard",
            highlights: r.highlights.join(", "),
            availableSlots: r.availableSlots,
          }));

          result = {
            success: true,
            action: "search_inventory",
            resultCount: searchResult.totalCount,
            page: searchResult.page,
            results: formattedResults,
            instruction: `Found ${searchResult.totalCount} options. Present the top results to the member and ask which they prefer.`,
          };
        } catch (error) {
          const msg = error instanceof Error ? error.message : "Unknown error";
          log.error({ error: msg }, "search_inventory failed");
          result = { success: false, error: msg };
        }
        break;
      }

      case "select_package": {
        const parsed_sp = selectPackageSchema.safeParse(tool_input);
        if (!parsed_sp.success) {
          result = {
            success: false,
            error: "Invalid selection input",
            details: parsed_sp.error.issues.map((i) => i.message),
          };
          break;
        }

        try {
          const selection = await BookingService.selectPackage(
            parsed_sp.data,
            corrId
          );

          result = {
            success: selection.success,
            action: "select_package",
            message: selection.message,
            instruction: selection.success
              ? "Package locked. Ask the member how they'd like to receive their booking link (text, email, or show on screen)."
              : "Member must confirm selection before proceeding.",
          };
        } catch (error) {
          const msg = error instanceof Error ? error.message : "Unknown error";
          log.error({ error: msg }, "select_package failed");
          result = { success: false, error: msg };
        }
        break;
      }

      case "generate_purl": {
        const parsed_gp = generatePurlSchema.safeParse(tool_input);
        if (!parsed_gp.success) {
          result = {
            success: false,
            error: "Invalid PURL input",
            details: parsed_gp.error.issues.map((i) => i.message),
          };
          break;
        }

        try {
          const purlResult = await BookingService.generatePurl(
            parsed_gp.data,
            corrId
          );

          result = {
            success: true,
            action: "generate_purl",
            purl: purlResult.purl,
            deliveryMethod: purlResult.deliveryMethod,
            message: purlResult.message,
            instruction: "Read the delivery confirmation message to the member. If display mode, the PURL will be shown on screen.",
          };

          // If delivery method includes display, queue a DOM action
          // to show the booking link in the conversation UI
          if (parsed_gp.data.deliveryMethod === "display" || parsed_gp.data.deliveryMethod === "all") {
            pushAction(conversation_id, {
              action: "show_booking_link",
              purl: purlResult.purl,
              message: purlResult.message,
            });
          }
        } catch (error) {
          const msg = error instanceof Error ? error.message : "Unknown error";
          log.error({ error: msg }, "generate_purl failed");
          result = { success: false, error: msg };
        }
        break;
      }

      case "booking_status": {
        const parsed_bs = bookingStatusSchema.safeParse(tool_input);
        if (!parsed_bs.success) {
          result = {
            success: false,
            error: "Invalid status request",
            details: parsed_bs.error.issues.map((i) => i.message),
          };
          break;
        }

        try {
          const status = await BookingService.getStatus(
            parsed_bs.data,
            corrId
          );

          result = {
            success: true,
            action: "booking_status",
            status: status.status,
            sessionId: status.sessionId,
            message: status.summary,
            instruction: `Current booking status: ${status.status}. Relay the summary to the member.`,
          };
        } catch (error) {
          const msg = error instanceof Error ? error.message : "Unknown error";
          log.error({ error: msg }, "booking_status failed");
          result = { success: false, error: msg };
        }
        break;
      }

      default: {
        result = { success: false, error: `Unknown tool: ${tool_name}` };
      }
    }

    const durationMs = Date.now() - startTime;
    log.info({ tool_name, durationMs, success: result.success }, "Tool execution complete");

    return NextResponse.json({
      tool_call_id,
      result,
      duration_ms: durationMs,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    log.error({ error: msg }, "Tool execution failed");

    return NextResponse.json(
      { error: msg, fallback: "I had a small technical issue. Let me try again." },
      { status: 500 }
    );
  }
}

// Static site content for self-demo when Rover isn't available
function getStaticSiteContent(query: string): string {
  const q = query.toLowerCase();

  if (q.includes("price") || q.includes("cost"))
    return "Pricing is custom per business. V\u00B7VOICE starts at competitive rates for 24/7 AI phone coverage. V\u00B7FACE and V\u00B7SUITE pricing depends on usage and integration scope. Best to book a demo call for a personalized quote.";

  if (q.includes("vface") || q.includes("video"))
    return "V\u00B7FACE is our photorealistic video AI agent \u2014 exactly what you're talking to right now. It uses Tavus CVI with Phoenix-4 rendering, Raven-1 multimodal perception, and Sparrow-1 turn-taking for sub-600ms response times.";

  if (q.includes("vvoice") || q.includes("voice") || q.includes("phone"))
    return "V\u00B7VOICE is our AI phone agent. It answers calls 24/7, books appointments, qualifies leads, and handles common questions. Built on Retell AI with natural voice quality, it replaces the need for after-hours answering services.";

  if (q.includes("vsuite") || q.includes("dashboard"))
    return "V\u00B7SUITE is the command center \u2014 a dashboard where businesses manage all their AI employees. Monitor calls, view analytics, train agents, and configure workflows all in one place.";

  if (q.includes("talking") || q.includes("postcard") || q.includes("direct mail"))
    return "Talking Postcards combine direct mail with AI video. Businesses send physical postcards with QR codes. When scanned, recipients get a personalized AI video conversation \u2014 10x engagement vs traditional mailers.";

  if (q.includes("dealer") || q.includes("automotive") || q.includes("car"))
    return "For dealerships, Voxaris handles inbound calls (service, sales, BDC), outbound follow-ups, website video chat, and Talking Postcard campaigns for conquest and retention.";

  return "Voxaris builds AI employees for businesses \u2014 voice agents, video agents, and a full management suite. We serve dealerships, law firms, contractors, and medical spas across the US.";
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
