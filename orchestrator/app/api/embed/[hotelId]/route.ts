import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { hotelConfigs, embeds } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { apiRateLimit } from "@/lib/utils/rate-limit";
import { createRequestLogger } from "@/lib/utils/logger";
import { correlationId } from "@/lib/utils/id";

export const runtime = "edge";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ hotelId: string }> }
) {
  const { hotelId } = await params;
  const corrId = correlationId();
  const log = createRequestLogger(corrId, { route: "embed-config" });

  // Rate limit by IP
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const { success } = await apiRateLimit.limit(ip);
  if (!success) {
    return NextResponse.json({ error: "Rate limited" }, { status: 429 });
  }

  // Validate embed key from query
  const embedKey = request.nextUrl.searchParams.get("key");
  if (!embedKey) {
    return NextResponse.json({ error: "Missing embed key" }, { status: 400 });
  }

  try {
    // Verify embed key and load hotel config
    const [embed] = await db
      .select()
      .from(embeds)
      .where(and(eq(embeds.embedKey, embedKey), eq(embeds.isActive, true)))
      .limit(1);

    if (!embed || embed.hotelConfigId !== hotelId) {
      return NextResponse.json({ error: "Invalid embed key" }, { status: 403 });
    }

    // Check origin
    const origin = request.headers.get("origin") ?? "";
    if (
      embed.allowedOrigins.length > 0 &&
      !embed.allowedOrigins.some((ao) => origin.includes(ao))
    ) {
      log.warn({ origin, allowedOrigins: embed.allowedOrigins }, "Origin not allowed");
      return NextResponse.json({ error: "Origin not allowed" }, { status: 403 });
    }

    // Load hotel config
    const [hotel] = await db
      .select()
      .from(hotelConfigs)
      .where(and(eq(hotelConfigs.id, hotelId), eq(hotelConfigs.isActive, true)))
      .limit(1);

    if (!hotel) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://orchestrator.voxaris.io";

    return NextResponse.json(
      {
        hotelId: hotel.id,
        hotelName: hotel.name,
        personaId: hotel.personaId ?? process.env.TAVUS_PERSONA_ID,
        startingUrl: hotel.startingUrl,
        brandColor: hotel.brandColor,
        greeting: hotel.greeting,
        orchestrateEndpoint: `${appUrl}/api/orchestrate`,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": origin || "*",
          "Cache-Control": "public, max-age=300, stale-while-revalidate=60",
        },
      }
    );
  } catch (error) {
    log.error({ error }, "Failed to load embed config");
    return NextResponse.json(
      { error: "Failed to load configuration" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
