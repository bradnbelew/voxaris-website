import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public API routes (no auth, handled by embed keys / rate limiting)
const PUBLIC_API_PATTERNS = [
  /^\/api\/embed/,
  /^\/api\/orchestrate/,
  /^\/api\/webhooks/,
  /^\/api\/execute/,
  /^\/api\/tavus/,
];

function isPublicApiRoute(pathname: string) {
  return PUBLIC_API_PATTERNS.some((p) => p.test(pathname));
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public API routes: add security headers
  if (isPublicApiRoute(pathname)) {
    const response = NextResponse.next();
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=()"
    );
    return response;
  }

  // Dashboard routes: protect with Clerk if available
  if (pathname.startsWith("/dashboard")) {
    if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
      const { clerkMiddleware, createRouteMatcher } = await import(
        "@clerk/nextjs/server"
      );
      const isDashboard = createRouteMatcher(["/dashboard(.*)"]);
      const handler = clerkMiddleware(async (auth, r) => {
        if (isDashboard(r)) {
          await auth.protect();
        }
        return NextResponse.next();
      });
      return handler(req, {} as never);
    }
    // No Clerk — allow through (dev/demo mode)
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
