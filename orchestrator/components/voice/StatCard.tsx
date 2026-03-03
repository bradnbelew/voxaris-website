import type { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  accent?: "gold" | "emerald" | "rose" | "blue";
}

const accentMap: Record<string, string> = {
  gold: "text-gold",
  emerald: "text-emerald-vox",
  rose: "text-rose-vox",
  blue: "text-blue-400",
};

export default function StatCard({ icon, label, value, accent = "gold" }: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
      <div className="mb-3 flex items-center gap-2 text-gray-500">
        <span className={accentMap[accent]}>{icon}</span>
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className={`text-2xl font-bold ${accentMap[accent]}`}>{value}</p>
    </div>
  );
}
