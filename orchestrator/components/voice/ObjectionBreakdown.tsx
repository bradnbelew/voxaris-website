import type { ObjectionData } from "@/lib/voice/mock-data";

const typeColor: Record<string, string> = {
  price: "bg-rose-vox",
  timing: "bg-gold",
  value: "bg-blue-400",
  comparison: "bg-emerald-vox",
  satisfaction: "bg-purple-400",
};

export default function ObjectionBreakdown({ data }: { data: ObjectionData[] }) {
  return (
    <div className="space-y-4">
      {data.map((obj) => (
        <div
          key={obj.type}
          className="rounded-xl border border-gray-800 bg-gray-900/60 p-5"
        >
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-200">{obj.label}</h4>
            <span className="font-mono text-xs text-gray-500">
              {obj.count} occurrences ({obj.percentage}%)
            </span>
          </div>

          <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-gray-800">
            <div
              className={`h-full rounded-full ${typeColor[obj.type] ?? "bg-gray-500"} transition-all duration-500`}
              style={{ width: `${obj.percentage}%` }}
            />
          </div>

          <p className="text-xs leading-relaxed text-gray-400">{obj.insight}</p>
        </div>
      ))}
    </div>
  );
}
