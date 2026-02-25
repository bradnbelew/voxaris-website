import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require Clerk authentication
const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);

// Public API routes (no auth, handled by embed keys / rate limiting)
const isPublicApiRoute = createRouteMatcher([
  "/api/embed(.*)",
  "/api/orchestrate",
  "/api/webhooks(.*)",
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  // Dashboard routes require sign-in
  if (isDashboardRoute(req)) {
    await auth.protect();
  }

  // Public API routes: add security headers + CORS
  if (isPublicApiRoute(req)) {
    const response = NextResponse.next();

    // Security headers
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=()"
    );

    return response;
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip static files and Next.js internals
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
