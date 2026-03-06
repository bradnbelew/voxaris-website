import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { purlRecords, bookingSessions } from "@/db/schema-booking";
import { eq, and } from "drizzle-orm";
import { PurlService } from "@/lib/services/purl-service";
import { createRequestLogger } from "@/lib/utils/logger";
import { correlationId } from "@/lib/utils/id";
import crypto from "node:crypto";

// ── PURL Landing Route ──
// When a member clicks their personalized booking link,
// this route:
// 1. Verifies the HMAC signature
// 2. Checks expiry
// 3. Records the click for analytics
// 4. Redirects to the partner booking portal with pre-filled params

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const corrId = correlationId();
  const log = createRequestLogger(corrId, { route: "purl" });
  const { token } = await params;

  if (!token) {
    return NextResponse.json({ error: "Missing PURL token" }, { status: 400 });
  }

  // Decode and verify
  const decoded = PurlService.decode(token, corrId);

  if (!decoded.valid) {
    if (decoded.expired) {
      log.info({ sessionId: decoded.payload?.sid }, "Expired PURL accessed");
      return renderExpiredPage(decoded.payload?.mn ?? "Member");
    }

    log.warn("Invalid PURL accessed");
    return NextResponse.json(
      { error: "Invalid or tampered booking link" },
      { status: 403 }
    );
  }

  const payload = decoded.payload!;

  // Record the click
  try {
    const [purlRecord] = await db
      .select()
      .from(purlRecords)
      .where(eq(purlRecords.bookingSessionId, payload.sid))
      .limit(1);

    if (purlRecord) {
      const hashedIp = crypto
        .createHash("sha256")
        .update(request.headers.get("x-forwarded-for") ?? "unknown")
        .digest("hex")
        .slice(0, 16);

      await db
        .update(purlRecords)
        .set({
          clickedAt: purlRecord.clickedAt ?? new Date(),
          clickCount: (purlRecord.clickCount ?? 0) + 1,
          userAgent: request.headers.get("user-agent")?.slice(0, 512) ?? null,
          ipAddress: hashedIp,
        })
        .where(eq(purlRecords.id, purlRecord.id));
    }

    // Update booking session status
    await db
      .update(bookingSessions)
      .set({ status: "purl_clicked" })
      .where(
        and(
          eq(bookingSessions.id, payload.sid),
          eq(bookingSessions.status, "purl_generated")
        )
      );
  } catch (error) {
    // Click tracking should never block the redirect
    log.error({ error }, "Failed to record PURL click");
  }

  // Build the redirect URL to the partner booking portal.
  // These query params pre-fill the booking form.
  const portalBaseUrl =
    process.env.BOOKING_PORTAL_URL ?? "https://membertravelprivileges.com/book";

  const redirectParams = new URLSearchParams({
    ref: payload.sid,
    pkg: payload.pkg,
    name: payload.mn,
    pax: String(payload.pax),
    tt: payload.tt,
    ...(payload.mid && { mid: payload.mid }),
    ...(payload.dst && { dst: payload.dst }),
    ...(payload.dep && { dep: payload.dep }),
    ...(payload.em && { em: payload.em }),
    utm_source: "voxaris",
    utm_medium: "ai_agent",
    utm_campaign: "vface_booking",
  });

  const redirectUrl = `${portalBaseUrl}?${redirectParams.toString()}`;
  log.info({ sessionId: payload.sid, redirectUrl }, "PURL redirect");

  return NextResponse.redirect(redirectUrl, 302);
}

/**
 * Render a friendly expired-PURL page instead of a raw error.
 */
function renderExpiredPage(memberName: string): NextResponse {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Booking Link Expired</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f8f9fa;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      color: #1B2A4A;
    }
    .container {
      background: white;
      border-radius: 12px;
      padding: 48px;
      max-width: 480px;
      text-align: center;
      box-shadow: 0 4px 24px rgba(27, 42, 74, 0.08);
    }
    h1 { font-size: 24px; margin-bottom: 16px; }
    p { color: #666; line-height: 1.6; margin-bottom: 24px; }
    .icon { font-size: 48px; margin-bottom: 16px; }
    a {
      display: inline-block;
      background: #1B2A4A;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
    }
    a:hover { background: #2a3f6a; }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">&#x23F0;</div>
    <h1>Booking Link Expired</h1>
    <p>Hi ${memberName}, this personalized booking link has expired for your security. Don't worry — just start a new conversation and we'll get you set up again in seconds.</p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://www.voxaris.io"}/demo">Start New Conversation</a>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    status: 410,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
