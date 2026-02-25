import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { sessions, hotelConfigs } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { orgId } = await auth();
  if (!orgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const hotelId = request.nextUrl.searchParams.get("hotelId");
  const limit = Math.min(
    parseInt(request.nextUrl.searchParams.get("limit") ?? "50", 10),
    100
  );

  // Verify hotel belongs to org
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

  const query = hotelId
    ? db
        .select()
        .from(sessions)
        .where(eq(sessions.hotelConfigId, hotelId))
        .orderBy(desc(sessions.startedAt))
        .limit(limit)
    : db
        .select({
          session: sessions,
          hotelName: hotelConfigs.name,
        })
        .from(sessions)
        .innerJoin(hotelConfigs, eq(sessions.hotelConfigId, hotelConfigs.id))
        .where(eq(hotelConfigs.clerkOrgId, orgId))
        .orderBy(desc(sessions.startedAt))
        .limit(limit);

  const results = await query;

  return NextResponse.json({ sessions: results });
}
