"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sessionKey as genSessionKey } from "@/lib/utils/id";

// ── Types ──

interface VoxarisEmbedProps {
  hotelId: string;
  embedKey: string;
  position?: "bottom-right" | "bottom-left";
  brandColor?: string;
}

interface EmbedConfig {
  hotelId: string;
  hotelName: string;
  personaId: string;
  startingUrl: string;
  brandColor: string;
  greeting: string;
  orchestrateEndpoint: string;
}

interface OrchestrateResponse {
  response: string;
  narrations: string[];
  requiresConfirmation: boolean;
  sessionStatus: string;
  actionsTaken: string[];
}

// ── Component ──

export default function VoxarisEmbed({
  hotelId,
  embedKey,
  position = "bottom-right",
  brandColor,
}: VoxarisEmbedProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<EmbedConfig | null>(null);
  const [messages, setMessages] = useState<Array<{ role: string; text: string }>>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sessionKeyRef = useRef(genSessionKey());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load config on mount
  useEffect(() => {
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;

    fetch(`${appUrl}/api/embed/${hotelId}?key=${embedKey}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load config");
        return res.json();
      })
      .then((data: EmbedConfig) => {
        setConfig(data);
        setMessages([{ role: "assistant", text: data.greeting }]);
      })
      .catch((err) => {
        setError("Unable to connect to Voxaris. Please refresh.");
        console.error("Voxaris embed init error:", err);
      });
  }, [hotelId, embedKey]);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message to orchestrator
  const sendMessage = useCallback(
    async (text: string, consentResponse?: { granted: boolean; method: string }) => {
      if (!config || (!text.trim() && !consentResponse)) return;

      if (text.trim()) {
        setMessages((prev) => [...prev, { role: "user", text: text.trim() }]);
      }
      setInput("");
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(config.orchestrateEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionKey: sessionKeyRef.current,
            hotelId: config.hotelId,
            userMessage: text.trim() || "User confirmed action",
            consentResponse,
          }),
        });

        if (!res.ok) {
          const errBody = await res.json().catch(() => ({ error: "Unknown error" }));
          throw new Error(errBody.error ?? `HTTP ${res.status}`);
        }

        const data: OrchestrateResponse = await res.json();

        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: data.response },
        ]);

        setShowConfirmation(data.requiresConfirmation);

        if (data.sessionStatus === "handoff") {
          setMessages((prev) => [
            ...prev,
            {
              role: "system",
              text: "Connecting you to a team member...",
            },
          ]);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Connection error";
        setError(message);
        setMessages((prev) => [
          ...prev,
          {
            role: "system",
            text: "I had trouble processing that. Could you try again?",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [config]
  );

  const handleConfirm = useCallback(
    (granted: boolean) => {
      setShowConfirmation(false);
      sendMessage(
        granted ? "Yes, I confirm" : "No, cancel",
        { granted, method: "button" }
      );
    },
    [sendMessage]
  );

  const resolvedColor = brandColor ?? config?.brandColor ?? "#d4a843";
  const positionClass =
    position === "bottom-left" ? "left-4" : "right-4";

  return (
    <>
      {/* Floating trigger button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-4 ${positionClass} z-[9999] flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110`}
          style={{ backgroundColor: resolvedColor }}
          aria-label="Open Voxaris concierge"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div
          className={`fixed bottom-4 ${positionClass} z-[9999] flex h-[520px] w-[380px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl`}
          role="dialog"
          aria-label="Voxaris AI concierge"
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 text-white"
            style={{ backgroundColor: resolvedColor }}
          >
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-300" />
              <span className="text-sm font-semibold">
                {config?.hotelName ?? "Voxaris"} Concierge
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 transition-colors hover:text-white"
              aria-label="Close"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-3 ${
                  msg.role === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                    msg.role === "user"
                      ? "bg-gray-800 text-white"
                      : msg.role === "system"
                        ? "bg-amber-50 text-amber-800 italic"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="mb-3 text-left">
                <div className="inline-block rounded-xl bg-gray-100 px-4 py-2">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Error banner */}
          {error && (
            <div className="mx-4 mb-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
              {error}
            </div>
          )}

          {/* Confirmation buttons */}
          {showConfirmation && (
            <div className="mx-4 mb-2 flex gap-2">
              <button
                onClick={() => handleConfirm(true)}
                className="flex-1 rounded-lg py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
                style={{ backgroundColor: resolvedColor }}
              >
                Confirm Booking
              </button>
              <button
                onClick={() => handleConfirm(false)}
                className="flex-1 rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex items-center gap-2 border-t border-gray-100 px-4 py-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm outline-none focus:border-gray-400"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors disabled:opacity-50"
              style={{ backgroundColor: resolvedColor }}
              aria-label="Send message"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>

          {/* Powered by */}
          <div className="pb-2 text-center text-[10px] text-gray-400">
            Powered by Voxaris
          </div>
        </div>
      )}
    </>
  );
}
