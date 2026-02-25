/**
 * Optional Clerk auth wrapper.
 * Returns { userId, orgId } when Clerk is configured,
 * or { userId: "demo", orgId: "demo" } in demo mode.
 */
export async function optionalAuth(): Promise<{
  userId: string | null;
  orgId: string | null;
}> {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    // Demo mode — no Clerk configured
    return { userId: "demo", orgId: "demo" };
  }

  const { auth } = await import("@clerk/nextjs/server");
  const result = await auth();
  return {
    userId: result.userId ?? null,
    orgId: result.orgId ?? null,
  };
}
