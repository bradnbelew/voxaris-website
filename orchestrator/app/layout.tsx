import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Voxaris Orchestrator",
  description:
    "Real-time conversational video AI concierge for hotel websites",
};

async function MaybeClerkProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    const { ClerkProvider } = await import("@clerk/nextjs");
    return <ClerkProvider>{children}</ClerkProvider>;
  }
  return <>{children}</>;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MaybeClerkProvider>
      <html lang="en" className="dark">
        <body className="min-h-screen bg-void text-gray-100 antialiased">
          {children}
        </body>
      </html>
    </MaybeClerkProvider>
  );
}
