"use client";

import { useEffect, useState } from "react";

interface SessionRecord {
  id: string;
  sessionKey: string;
  status: string;
  actionCount: number;
  currentUrl: string | null;
  startedAt: string;
  endedAt: string | null;
  hotelName?: string;
}

export default function SessionViewer({ hotelId }: { hotelId?: string | undefined }) {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = hotelId
      ? `/api/dashboard/sessions?hotelId=${hotelId}`
      : "/api/dashboard/sessions";

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        const list = data.sessions ?? [];
        setSessions(
          list.map((s: unknown) => {
            const obj = s as Record<string, unknown>;
            if ("session" in obj && typeof obj.session === "object" && obj.session !== null) {
              return Object.assign({} as SessionRecord, obj.session, { hotelName: String(obj.hotelName ?? "") });
            }
            return obj as unknown as SessionRecord;
          })
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [hotelId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-amber-500" />
      </div>
    );
  }

  const statusColor: Record<string, string> = {
    active: "bg-emerald-500/20 text-emerald-400",
    completed: "bg-gray-500/20 text-gray-400",
    error: "bg-red-500/20 text-red-400",
    handoff: "bg-amber-500/20 text-amber-400",
    awaiting_confirmation: "bg-blue-500/20 text-blue-400",
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-800 text-xs uppercase text-gray-500">
            <th className="px-4 py-3">Session</th>
            {!hotelId && <th className="px-4 py-3">Hotel</th>}
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
            <th className="px-4 py-3">Started</th>
            <th className="px-4 py-3">Duration</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s) => {
            const duration = s.endedAt
              ? Math.round(
                  (new Date(s.endedAt).getTime() - new Date(s.startedAt).getTime()) / 1000
                )
              : null;

            return (
              <tr key={s.id} className="border-b border-gray-800/50 hover:bg-gray-900/40">
                <td className="px-4 py-3 font-mono text-xs text-gray-300">
                  {s.sessionKey.slice(0, 12)}...
                </td>
                {!hotelId && (
                  <td className="px-4 py-3 text-gray-300">
                    {(s as SessionRecord & { hotelName?: string }).hotelName ?? "—"}
                  </td>
                )}
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      statusColor[s.status] ?? "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400">{s.actionCount}</td>
                <td className="px-4 py-3 text-gray-400">
                  {new Date(s.startedAt).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {duration ? `${duration}s` : "Active"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {sessions.length === 0 && (
        <p className="py-8 text-center text-sm text-gray-500">No sessions yet.</p>
      )}
    </div>
  );
}
