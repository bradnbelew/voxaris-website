"use client";

import { useState } from "react";

interface VideoEmbedProps {
  conversationUrl: string;
  conversationId: string;
  memberName: string;
  brandColor: string;
  onConversationEnd?: () => void;
}

export default function VideoEmbed({
  conversationUrl,
  conversationId,
  memberName,
  brandColor,
  onConversationEnd,
}: VideoEmbedProps) {
  const [status, setStatus] = useState<"loading" | "joined" | "error">(
    "loading"
  );

  return (
    <div className="relative w-full">
      {/* Loading overlay — hides once iframe loads */}
      {status === "loading" && (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl"
          style={{ backgroundColor: brandColor + "15" }}
        >
          <div
            className="h-10 w-10 animate-spin rounded-full border-4 border-t-transparent"
            style={{ borderColor: brandColor, borderTopColor: "transparent" }}
          />
          <p className="mt-4 text-sm text-gray-600">
            Connecting you with your advisor, {memberName}...
          </p>
        </div>
      )}

      {/* Error state */}
      {status === "error" && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl bg-gray-50">
          <p className="mb-2 text-lg font-medium text-gray-800">
            Connection Issue
          </p>
          <p className="mb-4 max-w-sm text-center text-sm text-gray-500">
            We had trouble connecting to the video session.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg px-6 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: brandColor }}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Direct iframe embed — Tavus conversation_url is a Daily room URL */}
      <iframe
        src={conversationUrl}
        data-conversation-id={conversationId}
        className="aspect-video w-full overflow-hidden rounded-xl shadow-lg"
        style={{ minHeight: 300, border: "none" }}
        allow="camera; microphone; autoplay; display-capture"
        onLoad={() => setStatus("joined")}
        onError={() => setStatus("error")}
      />
    </div>
  );
}
