interface OutcomeRow {
  label: string;
  count: number;
  color: string;
}

export default function OutcomeChart({ data }: { data: OutcomeRow[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
        Call Outcomes
      </h3>
      <div className="space-y-3">
        {data.map((row) => (
          <div key={row.label}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-gray-300">{row.label}</span>
              <span className="font-mono text-gray-500">{row.count}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-800">
              <div
                className={`h-full rounded-full ${row.color} transition-all duration-500`}
                style={{ width: `${(row.count / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
