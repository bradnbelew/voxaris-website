import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createRequestLogger } from "@/lib/utils/logger";
import { correlationId } from "@/lib/utils/id";

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
                { goal: `Scroll to the ${section} section of the page`, maxSteps: 2, timeout: 8000 },
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
