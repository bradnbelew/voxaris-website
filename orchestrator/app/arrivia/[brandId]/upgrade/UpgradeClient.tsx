"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { CVIProvider } from "@/app/components/cvi/components/cvi-provider";
import { Conversation } from "@/app/components/cvi/components/conversation";

interface Brand {
  name: string;
  logo: string;
  primaryColor: string;
  accentColor: string;
}

interface UpgradeClientProps {
  brandId: string;
  brand: Brand;
  memberContext: Record<string, string>;
}

export default function UpgradeClient({
  brandId,
  brand,
  memberContext,
}: UpgradeClientProps) {
  const [conversationUrl, setConversationUrl] = useState("");
  const [conversationId, setConversationId] = useState("");
  const [status, setStatus] = useState<
    "loading" | "ready" | "error" | "ended"
  >("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [showUpgradeCta, setShowUpgradeCta] = useState(false);

  const memberName = memberContext.member_name ?? "";
  const upgradeLink = memberContext.upgrade_link ?? "";
  const createdRef = useRef(false);

  useEffect(() => {
    // Guard against React Strict Mode double-mount
    if (createdRef.current) return;
    createdRef.current = true;

    async function createConversation() {
      try {
        const response = await fetch("/api/arrivia/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            brand_id: brandId,
            member_name: memberContext.member_name,
            member_email: memberContext.member_email,
            current_tier: memberContext.current_tier,
            target_tier: memberContext.target_tier,
            join_date: memberContext.join_date,
            points_balance: memberContext.points_balance,
            renewal_date: memberContext.renewal_date,
            last_booking_destination:
              memberContext.last_booking_destination || undefined,
            upgrade_link: memberContext.upgrade_link,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to create session (${response.status})`);
        }

        const data = await response.json();
        setConversationUrl(data.conversation_url);
        setConversationId(data.conversation_id);
        setStatus("ready");
      } catch (err) {
        setStatus("error");
        setErrorMessage(
          err instanceof Error ? err.message : "Failed to start video session"
        );
      }
    }

    createConversation();
  }, [brandId, memberContext]);

  const handleLeave = useCallback(() => {
    setStatus("ended");
    setShowUpgradeCta(true);
  }, []);

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4 py-8"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      {/* Brand header */}
      <div className="mb-6 flex items-center gap-3">
        <img
          src={brand.logo}
          alt={brand.name}
          className="h-10 w-auto"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <h1
          className="text-lg font-semibold md:text-xl"
          style={{ color: brand.primaryColor }}
        >
          {brand.name}
        </h1>
      </div>

      {/* Main content area */}
      <div className="w-full max-w-3xl">
        {/* Loading state */}
        {status === "loading" && (
          <div className="flex flex-col items-center justify-center rounded-xl bg-white p-12 shadow-md">
            <div
              className="h-10 w-10 animate-spin rounded-full border-4 border-t-transparent"
              style={{
                borderColor: brand.accentColor,
                borderTopColor: "transparent",
              }}
            />
            <p className="mt-4 text-gray-600">
              Setting up your personalized session...
            </p>
          </div>
        )}

        {/* Error fallback */}
        {status === "error" && (
          <div className="flex flex-col items-center justify-center rounded-xl bg-white p-12 shadow-md">
            <p className="mb-2 text-lg font-medium text-gray-800">
              We couldn&apos;t start your video session
            </p>
            <p className="mb-6 text-center text-sm text-gray-500">
              {errorMessage || "Please try again or use the link below."}
            </p>
            <a
              href={upgradeLink}
              className="inline-block rounded-lg px-8 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: brand.accentColor }}
            >
              View Upgrade Options
            </a>
          </div>
        )}

        {/* Tavus CVI Video Session */}
        {status === "ready" && conversationUrl && (
          <CVIProvider>
            <div
              style={{
                width: "100%",
                height: "100%",
                maxWidth: "900px",
                margin: "0 auto",
              }}
            >
              <Conversation
                conversationUrl={conversationUrl}
                conversationId={conversationId}
                onLeave={handleLeave}
              />
            </div>
          </CVIProvider>
        )}

        {/* Post-conversation ended state */}
        {status === "ended" && (
          <div className="flex flex-col items-center justify-center rounded-xl bg-white p-12 shadow-md">
            <p className="mb-2 text-lg font-medium text-gray-800">
              Thanks for chatting, {memberName}!
            </p>
            <p className="mb-6 text-center text-sm text-gray-500">
              Ready to unlock your upgraded benefits?
            </p>
            <a
              href={upgradeLink}
              className="inline-block rounded-lg px-10 py-4 text-base font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              style={{ backgroundColor: brand.accentColor }}
            >
              Upgrade Now
            </a>
          </div>
        )}
      </div>

      {/* Upgrade CTA — subtle during conversation, prominent after */}
      {(status === "ready" || showUpgradeCta) && (
        <div className="mt-6 text-center">
          <a
            href={upgradeLink}
            className={`inline-block rounded-lg px-6 py-2.5 text-sm font-medium transition-all ${
              showUpgradeCta
                ? "text-white shadow-lg hover:scale-105"
                : "bg-transparent hover:underline"
            }`}
            style={
              showUpgradeCta
                ? { backgroundColor: brand.accentColor }
                : { color: brand.accentColor }
            }
          >
            {showUpgradeCta ? "Upgrade Your Membership" : "View upgrade details"}
          </a>
        </div>
      )}

      {/* Footer */}
      <p className="mt-8 text-xs text-gray-400">
        Powered by {brand.name}. Your personalized membership advisor.
      </p>
    </div>
  );
}
