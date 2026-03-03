"use client";

import { useState, useMemo } from "react";
import type { CallRecord } from "@/lib/voice/mock-data";
import TranscriptPanel from "./TranscriptPanel";

const statusColor: Record<string, string> = {
  completed: "bg-emerald-500/20 text-emerald-400",
  active: "bg-blue-500/20 text-blue-400",
  failed: "bg-red-500/20 text-red-400",
  "no-answer": "bg-gray-500/20 text-gray-400",
};

const outcomeLabel: Record<string, string> = {
  upgrade_intent: "Upgrade Intent",
  follow_up: "Follow-up",
  declined: "Declined",
  transfer: "Transfer",
  no_answer: "No Answer",
};

function formatDuration(sec: number): string {
  if (sec === 0) return "—";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function CallTable({ calls }: { calls: CallRecord[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [directionFilter, setDirectionFilter] = useState<"all" | "inbound" | "outbound">("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return calls.filter((c) => {
      if (directionFilter !== "all" && c.direction !== directionFilter) return false;
      if (search && !c.member_name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [calls, directionFilter, search]);

  return (
    <div>
      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex gap-1 rounded-lg bg-gray-800 p-0.5">
          {(["all", "inbound", "outbound"] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDirectionFilter(d)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                directionFilter === d
                  ? "bg-gold text-void"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {d === "all" ? "All" : d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search member..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm text-gray-200 placeholder-gray-500 outline-none focus:border-gold"
        />

        <span className="ml-auto text-xs text-gray-500">
          {filtered.length} call{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-800 bg-gray-900/60">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-xs uppercase text-gray-500">
              <th className="px-4 py-3">Member</th>
              <th className="px-4 py-3">Direction</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Outcome</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Cost</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((call) => (
              <>
                <tr
                  key={call.call_id}
                  onClick={() =>
                    setExpandedId(expandedId === call.call_id ? null : call.call_id)
                  }
                  className={`cursor-pointer border-b border-gray-800/50 transition-colors hover:bg-gray-800/40 ${
                    expandedId === call.call_id ? "bg-gray-800/30" : ""
                  }`}
                >
                  <td className="px-4 py-3 font-medium text-gray-200">
                    {call.member_name}
                    <div className="text-xs text-gray-500">{call.caller_number}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        call.direction === "inbound"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-gold/20 text-gold"
                      }`}
                    >
                      {call.direction}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        statusColor[call.status] ?? "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {call.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {call.outcome ? outcomeLabel[call.outcome] ?? call.outcome : "—"}
                  </td>
                  <td className="px-4 py-3 font-mono text-gray-400">
                    {formatDuration(call.duration_seconds)}
                  </td>
                  <td className="px-4 py-3 font-mono text-gray-400">
                    ${call.cost_usd.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(call.started_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>

                {expandedId === call.call_id && (
                  <tr key={`${call.call_id}-transcript`}>
                    <td colSpan={7} className="border-b border-gray-800/50 bg-gray-900/80 px-6 py-2">
                      <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
                        Transcript
                      </div>
                      <TranscriptPanel messages={call.transcript} />
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-500">No calls match your filters.</p>
        )}
      </div>
    </div>
  );
}
