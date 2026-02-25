import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "Voxaris Orchestrator",
  description:
    "Real-time conversational video AI concierge for hotel websites",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className="min-h-screen bg-void text-gray-100 antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
