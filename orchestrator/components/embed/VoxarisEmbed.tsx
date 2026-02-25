"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ── Types ──

interface VoxarisEmbedProps {
  /** Tavus persona ID for self-demo mode */
  personaId?: string;
  /** Hotel ID for hotel integration mode */
  hotelId?: string;
  /** Embed key for hotel integration mode */
  embedKey?: string;
  /** Widget position */
  position?: "bottom-right" | "bottom-left";
  /** Auto-open on mount */
  autoOpen?: boolean;
}

// ── Component ──

export default function VoxarisEmbed({
  personaId,
  hotelId,
  embedKey,
  position = "bottom-right",
  autoOpen = false,
}: VoxarisEmbedProps) {
  const [isOpen, setIsOpen] = useState(autoOpen);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversationUrl, setConversationUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "connecting" | "active" | "error">("idle");
  const [caption, setCaption] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Dragging state
  const dragRef = useRef({ dragging: false, offsetX: 0, offsetY: 0 });

  const positionClass = position === "bottom-left" ? "left-6" : "right-6";

  // ── Start Conversation ──
  const startConversation = useCallback(async () => {
    setStatus("connecting");

    try {
      const body = personaId
        ? { persona_id: personaId, mode: "self-demo" as const }
        : { hotel_id: hotelId!, embed_key: embedKey! };

      const res = await fetch("/orchestrator/api/tavus/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown" }));
        throw new Error(err.error ?? `HTTP ${res.status}`);
      }

      const data = await res.json();
      setConversationId(data.conversation_id);
      setConversationUrl(data.conversation_url);
      setStatus("active");
    } catch (err) {
      console.error("[VoxarisEmbed] Start failed:", err);
      setStatus("error");
    }
  }, [personaId, hotelId, embedKey]);

  // ── End Conversation ──
  const endConversation = useCallback(async () => {
    if (!conversationId) return;

    try {
      await fetch(`/orchestrator/api/tavus/conversation/${conversationId}`, {
        method: "DELETE",
      });
    } catch {
      // Best-effort cleanup
    }

    setConversationId(null);
    setConversationUrl(null);
    setStatus("idle");
    setCaption("");
  }, [conversationId]);

  // ── Listen for navigation bridge messages ──
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      const data = e.data;
      if (!data || data.source !== "voxaris-orchestrator") return;

      switch (data.action) {
        case "scroll_to_section": {
          const selectors = (data.selector as string).split(",");
          for (const sel of selectors) {
            const el = document.querySelector(sel.trim());
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "start" });
              (el as HTMLElement).style.transition = "box-shadow .4s";
              (el as HTMLElement).style.boxShadow =
                "0 0 0 3px rgba(212,168,67,.4)";
              setTimeout(() => {
                (el as HTMLElement).style.boxShadow = "";
              }, 2000);
              break;
            }
          }
          break;
        }

        case "highlight_feature": {
          const target = document.querySelector(
            `[data-feature="${data.feature}"]`
          ) as HTMLElement | null;
          if (target) {
            target.style.transition = "all .4s";
            target.style.boxShadow = "0 0 20px rgba(212,168,67,.5)";
            target.style.transform = "scale(1.02)";
            setTimeout(() => {
              target.style.boxShadow = "";
              target.style.transform = "";
            }, 3000);
          }
          break;
        }

        case "navigate_to_page":
          if (data.route) window.location.href = data.route;
          break;

        case "update_caption":
          setCaption(data.text ?? "");
          break;
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  // ── Draggable header ──
  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest("button")) return;
      const rect = panelRef.current?.getBoundingClientRect();
      if (!rect) return;
      dragRef.current = {
        dragging: true,
        offsetX: e.clientX - rect.left,
        offsetY: e.clientY - rect.top,
      };
    },
    []
  );

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragRef.current.dragging || !panelRef.current) return;
      const x = Math.max(
        0,
        Math.min(window.innerWidth - 380, e.clientX - dragRef.current.offsetX)
      );
      const y = Math.max(
        0,
        Math.min(window.innerHeight - 520, e.clientY - dragRef.current.offsetY)
      );
      panelRef.current.style.left = `${x}px`;
      panelRef.current.style.top = `${y}px`;
      panelRef.current.style.right = "auto";
      panelRef.current.style.bottom = "auto";
    };

    const onUp = () => {
      dragRef.current.dragging = false;
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, []);

  // ── Auto-open ──
  useEffect(() => {
    if (autoOpen && status === "idle") {
      setIsOpen(true);
      startConversation();
    }
  }, [autoOpen, status, startConversation]);

  return (
    <>
      {/* Trigger pill */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            if (status === "idle") startConversation();
          }}
          className={`fixed bottom-6 ${positionClass} z-[99998] flex items-center gap-2.5 rounded-full border border-[rgba(212,168,67,0.3)] bg-gradient-to-br from-[#0a0b0d] to-[#131519] px-4 py-2.5 shadow-[0_4px_24px_rgba(0,0,0,0.5),0_0_0_1px_rgba(212,168,67,0.15)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_20px_rgba(212,168,67,0.2)]`}
          aria-label="Talk to Voxaris AI"
        >
          <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border-2 border-[rgba(212,168,67,0.4)] bg-[#1a1c20]">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="20" fill="#1a1c20" />
              <path
                d="M20 8C13.4 8 8 13.4 8 20s5.4 12 12 12 12-5.4 12-12S26.6 8 20 8zm0 4a4 4 0 110 8 4 4 0 010-8zm0 17c-3.3 0-6.2-1.7-7.9-4.2.04-2.6 5.3-4 7.9-4s7.9 1.4 7.9 4A9.5 9.5 0 0120 29z"
                fill="#d4a843"
                opacity="0.6"
              />
            </svg>
            <div className="absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0a0b0d] bg-green-400" />
          </div>
          <span className="whitespace-nowrap text-[13px] font-medium text-[#e5e2d9]">
            Talk to <span className="text-[#d4a843]">Voxaris</span>
          </span>
        </button>
      )}

      {/* Video panel */}
      {isOpen && (
        <div
          ref={panelRef}
          className={`fixed bottom-6 ${positionClass} z-[99999] flex h-[520px] w-[380px] animate-in slide-in-from-bottom-3 flex-col overflow-hidden rounded-[20px] border border-[rgba(212,168,67,0.2)] bg-[#07080a] shadow-[0_12px_48px_rgba(0,0,0,0.7),0_0_0_1px_rgba(212,168,67,0.1)]`}
          role="dialog"
          aria-label="Voxaris AI Video Agent"
        >
          {/* Header — draggable */}
          <div
            onMouseDown={onMouseDown}
            className="flex cursor-grab items-center justify-between border-b border-[rgba(212,168,67,0.15)] bg-gradient-to-br from-[#0f1114] to-[#151820] px-4 py-3 active:cursor-grabbing"
          >
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
              <span className="text-[13px] font-semibold tracking-wide text-[#e5e2d9]">
                Voxaris Agent
              </span>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                endConversation();
              }}
              className="flex items-center justify-center rounded-md p-1 text-[rgba(229,226,217,0.5)] transition-colors hover:bg-white/[0.08] hover:text-[#e5e2d9]"
              aria-label="Close"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Video area */}
          <div className="relative flex-1 bg-[#07080a]">
            {status === "connecting" && (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-[rgba(229,226,217,0.4)]">
                <svg className="animate-spin" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" opacity="0.3" />
                  <path d="M12 2a10 10 0 019.95 9" />
                </svg>
                <span className="text-[13px]">Connecting...</span>
              </div>
            )}

            {status === "error" && (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-[rgba(229,226,217,0.4)]">
                <span className="text-[13px]">Connection failed</span>
                <button
                  onClick={startConversation}
                  className="rounded-lg border border-[rgba(212,168,67,0.3)] px-4 py-2 text-[13px] text-[#d4a843] transition-colors hover:bg-[rgba(212,168,67,0.1)]"
                >
                  Retry
                </button>
              </div>
            )}

            {status === "active" && conversationUrl && (
              <iframe
                ref={iframeRef}
                src={conversationUrl}
                className="h-full w-full border-none"
                allow="camera;microphone;display-capture;autoplay"
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
            )}

            {status === "idle" && (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-[rgba(229,226,217,0.4)]">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="10 8 16 12 10 16" />
                </svg>
                <span className="text-[13px]">Ready to start</span>
              </div>
            )}
          </div>

          {/* Caption bar */}
          <div className="flex min-h-[42px] items-center border-t border-[rgba(212,168,67,0.1)] bg-[rgba(15,17,20,0.95)] px-4 py-2.5">
            <span className="max-h-9 overflow-hidden text-[12px] leading-relaxed text-[rgba(229,226,217,0.8)] transition-all">
              {caption}
            </span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-white/5 bg-[#07080a] px-4 py-2">
            <span className="text-[9px] uppercase tracking-widest text-[rgba(229,226,217,0.25)]">
              Powered by Voxaris
            </span>
          </div>
        </div>
      )}
    </>
  );
}
