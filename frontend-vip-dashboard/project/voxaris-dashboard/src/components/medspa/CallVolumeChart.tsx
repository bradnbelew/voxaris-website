// src/components/medspa/CallVolumeChart.tsx
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface CallVolumeChartProps {
  data?: Array<{
    date: string;
    calls: number;
    minutes: number;
  }>;
  isLoading?: boolean;
}

export function CallVolumeChart({ data, isLoading }: CallVolumeChartProps) {
  if (isLoading) {
    return (
      <div className="bg-[#0A1628] border border-[#1E3A5F]/30 rounded-xl p-6">
        <div className="h-6 bg-[#1E3A5F] rounded w-1/3 mb-6 animate-pulse" />
        <div className="h-64 bg-[#1E3A5F]/50 rounded animate-pulse" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-[#0A1628] border border-[#1E3A5F]/30 rounded-xl p-6">
        <h3 className="text-white font-semibold text-lg mb-4">Call Volume</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          No call data yet
        </div>
      </div>
    );
  }

  // Format dates for display
  const chartData = data.map((item) => ({
    ...item,
    displayDate: new Date(item.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }));

  return (
    <div className="bg-[#0A1628] border border-[#1E3A5F]/30 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-lg">Call Volume</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-400" />
            <span className="text-gray-400">Calls</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
            <span className="text-gray-400">Minutes</span>
          </div>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="callsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="minutesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E3A5F" vertical={false} />
            <XAxis
              dataKey="displayDate"
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                border: '1px solid #1E3A5F',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value: number, name: string) => [
                name === 'calls' ? `${value} calls` : `${value.toFixed(1)} min`,
                name === 'calls' ? 'Consultations' : 'Duration'
              ]}
              labelFormatter={(label) => {
                const item = chartData.find(d => d.displayDate === label);
                return item ? new Date(item.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                }) : label;
              }}
            />
            <Area
              type="monotone"
              dataKey="calls"
              stroke="#00D4FF"
              strokeWidth={2}
              fill="url(#callsGradient)"
            />
            <Area
              type="monotone"
              dataKey="minutes"
              stroke="#10B981"
              strokeWidth={2}
              fill="url(#minutesGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default CallVolumeChart;
