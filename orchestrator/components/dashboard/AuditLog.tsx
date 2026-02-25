"use client";

import { useEffect, useState } from "react";

interface AuditEntry {
  id: string;
  correlationId: string;
  eventType: string;
  actor: string;
  payload: Record<string, unknown>;
  durationMs: number | null;
  createdAt: string;
}

const EVENT_COLORS: Record<string, string> = {
  utterance_in: "text-blue-400",
  utterance_out: "text-emerald-400",
  tool_call: "text-amber-400",
  tool_result: "text-amber-300",
  rover_action: "text-purple-400",
  booking_confirmed: "text-green-400",
  consent_requested: "text-orange-400",
  consent_granted: "text-green-300",
  consent_denied: "text-red-300",
  error: "text-red-400",
  handoff_requested: "text-yellow-400",
};

export default function AuditLog({ sessionId }: { sessionId?: string | undefined }) {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    const url = sessionId
      ? `/api/dashboard/audit?sessionId=${sessionId}`
      : "/api/dashboard/audit?limit=50";

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        const entries = data.auditLogs ?? [];
        setLogs(
          entries.map((e: Record<string, unknown>) => ("log" in e ? e.log : e))
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [sessionId]);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {logs.map((entry) => (
        <div
          key={entry.id}
          className="rounded-lg border border-gray-800/50 bg-gray-900/30 transition-colors hover:border-gray-700"
        >
          <button
            onClick={() => toggleExpand(entry.id)}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm"
          >
            <span className="w-16 shrink-0 text-xs text-gray-500">
              {new Date(entry.createdAt).toLocaleTimeString()}
            </span>
            <span
              className={`w-32 shrink-0 font-mono text-xs ${
                EVENT_COLORS[entry.eventType] ?? "text-gray-400"
              }`}
            >
              {entry.eventType}
            </span>
            <span className="w-12 shrink-0 text-xs text-gray-500">
              {entry.actor}
            </span>
            <span className="min-w-0 flex-1 truncate text-xs text-gray-300">
              {getPreview(entry)}
            </span>
            {entry.durationMs != null && (
              <span className="shrink-0 text-xs text-gray-600">
                {entry.durationMs}ms
              </span>
            )}
            <svg
              className={`h-4 w-4 shrink-0 text-gray-500 transition-transform ${
                expanded.has(entry.id) ? "rotate-180" : ""
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {expanded.has(entry.id) && (
            <div className="border-t border-gray-800/50 px-4 py-3">
              <pre className="overflow-x-auto whitespace-pre-wrap text-xs text-gray-400">
                {JSON.stringify(entry.payload, null, 2)}
              </pre>
              <p className="mt-2 text-xs text-gray-600">
                Correlation: {entry.correlationId}
              </p>
            </div>
          )}
        </div>
      ))}

      {logs.length === 0 && (
        <p className="py-8 text-center text-sm text-gray-500">No audit logs yet.</p>
      )}
    </div>
  );
}

function getPreview(entry: AuditEntry): string {
  const p = entry.payload;
  if ("text" in p && typeof p.text === "string") return p.text.slice(0, 80);
  if ("tool" in p && typeof p.tool === "string") return p.tool as string;
  if ("action" in p && typeof p.action === "string") return `${p.action}: ${(p.target ?? p.url ?? "") as string}`;
  if ("reason" in p && typeof p.reason === "string") return p.reason as string;
  return JSON.stringify(p).slice(0, 60);
}
