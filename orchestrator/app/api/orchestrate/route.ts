import { NextRequest, NextResponse } from "next/server";
import { orchestrate, OrchestrateError } from "@/lib/orchestrator";
import { orchestrateRequestSchema } from "@/lib/schemas/tools";
import { sessionRateLimit } from "@/lib/utils/rate-limit";
import { createRequestLogger } from "@/lib/utils/logger";
import { correlationId } from "@/lib/utils/id";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const corrId = correlationId();
  const log = createRequestLogger(corrId, { route: "orchestrate" });

  try {
    // Parse and validate request body
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

    // Run orchestrator
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
