import { NextRequest, NextResponse } from "next/server";
import { orchestrate, OrchestrateError } from "@/lib/orchestrator";
import { orchestrateRequestSchema } from "@/lib/schemas/tools";
import { sessionRateLimit } from "@/lib/utils/rate-limit";
import { createRequestLogger } from "@/lib/utils/logger";
import { correlationId } from "@/lib/utils/id";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Dual-mode orchestration endpoint.
 *
 * BRAIN_MODE=tavus  → Raven-1 handles reasoning, tool_calls route to /api/execute
 *                     This endpoint is only used for Claude-mode fallback.
 * BRAIN_MODE=claude → Full Claude ReAct loop with 8 tools + Rover
 */

export async function POST(request: NextRequest) {
  const brainMode = process.env.BRAIN_MODE ?? "tavus";
  const corrId = correlationId();
  const log = createRequestLogger(corrId, { route: "orchestrate", brainMode });

  // In Tavus-native mode, this endpoint is a fallback.
  // Primary path: Raven-1 → tool_call webhook → /api/execute
  if (brainMode === "tavus") {
    log.info("Tavus-native mode — orchestrate endpoint used as fallback");
  }

  try {
    const raw = await request.json();
    const parsed = orchestrateRequestSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { sessionKey, hotelId, userMessage, consentResponse } = parsed.data;

    // Rate limit per session
    const { success: rateLimitOk } = await sessionRateLimit.limit(sessionKey);
    if (!rateLimitOk) {
      log.warn({ sessionKey }, "Session rate limit exceeded");
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { status: 429 }
      );
    }

    // Sanitize user message — strip control characters
    const sanitizedMessage = userMessage
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
      .trim();

    if (!sanitizedMessage) {
      return NextResponse.json(
        { error: "Message cannot be empty" },
        { status: 400 }
      );
    }

    // In Tavus mode, we don't have Claude — return a simple ack
    if (brainMode === "tavus") {
      return NextResponse.json({
        response: "This endpoint is for Claude-mode fallback. In Tavus-native mode, Raven-1 handles all reasoning. Tool calls route to /api/execute.",
        narrations: [],
        requiresConfirmation: false,
        sessionStatus: "active",
        actionsTaken: [],
      });
    }

    // Claude mode — full ReAct orchestration
    const result = await orchestrate(
      sessionKey,
      hotelId,
      sanitizedMessage,
      consentResponse
    );

    log.info(
      {
        sessionKey,
        actionsTaken: result.actionsTaken.length,
        requiresConfirmation: result.requiresConfirmation,
      },
      "Orchestration complete"
    );

    return NextResponse.json(result, {
      headers: {
        "X-Correlation-Id": corrId,
        "X-Brain-Mode": brainMode,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    if (error instanceof OrchestrateError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    log.error({ error }, "Orchestration failed");

    return NextResponse.json(
      { error: "An internal error occurred. Please try again." },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
