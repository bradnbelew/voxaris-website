import { NextRequest, NextResponse } from "next/server";
import { optionalAuth } from "@/lib/auth";
import { db } from "@/db";
import { auditLogs, sessions, hotelConfigs } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { orgId } = await optionalAuth();
  if (!orgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sessionId = request.nextUrl.searchParams.get("sessionId");
  const hotelId = request.nextUrl.searchParams.get("hotelId");
  const eventType = request.nextUrl.searchParams.get("eventType");
  const limit = Math.min(
    parseInt(request.nextUrl.searchParams.get("limit") ?? "100", 10),
    500
  );

  // Verify access
  if (hotelId) {
    const [hotel] = await db
      .select()
      .from(hotelConfigs)
      .where(and(eq(hotelConfigs.id, hotelId), eq(hotelConfigs.clerkOrgId, orgId)))
      .limit(1);

    if (!hotel) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
    }
  }

  // Build query conditions
  let results;

  if (sessionId) {
    // Verify session belongs to org
    const [session] = await db
      .select({ hotelConfigId: sessions.hotelConfigId })
      .from(sessions)
      .innerJoin(hotelConfigs, eq(sessions.hotelConfigId, hotelConfigs.id))
      .where(and(eq(sessions.id, sessionId), eq(hotelConfigs.clerkOrgId, orgId)))
      .limit(1);

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    results = await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.sessionId, sessionId))
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit);
  } else if (hotelId) {
    results = await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.hotelConfigId, hotelId))
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit);
  } else {
    // All logs for org
    results = await db
      .select({ log: auditLogs, hotelName: hotelConfigs.name })
      .from(auditLogs)
      .innerJoin(hotelConfigs, eq(auditLogs.hotelConfigId, hotelConfigs.id))
      .where(eq(hotelConfigs.clerkOrgId, orgId))
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit);
  }

  return NextResponse.json({ auditLogs: results });
}
