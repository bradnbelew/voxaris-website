// src/components/medspa/PeakHoursChart.tsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface PeakHoursChartProps {
  data?: Array<{
    hour: number;
    count: number;
  }>;
  isLoading?: boolean;
}

export function PeakHoursChart({ data, isLoading }: PeakHoursChartProps) {
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
        <h3 className="text-white font-semibold text-lg mb-4">Peak Hours</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          No peak hours data yet
        </div>
      </div>
    );
  }

  // Format hours for display (e.g., "9 AM", "2 PM")
  const formatHour = (hour: number): string => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
  };

  // Find max count for color intensity
  const maxCount = Math.max(...data.map(d => d.count));

  const chartData = data.map((item) => ({
    ...item,
    displayHour: formatHour(item.hour),
    intensity: item.count / maxCount // 0-1 for color scaling
  }));

  // Color based on intensity
  const getColor = (intensity: number): string => {
    if (intensity > 0.8) return '#00D4FF';
    if (intensity > 0.5) return '#06B6D4';
    if (intensity > 0.3) return '#0EA5E9';
    return '#1E3A5F';
  };

  return (
    <div className="bg-[#0A1628] border border-[#1E3A5F]/30 rounded-xl p-6">
      <h3 className="text-white font-semibold text-lg mb-4">Peak Consultation Hours</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <XAxis
              dataKey="displayHour"
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              tickLine={false}
              interval={1}
            />
            <YAxis
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                border: '1px solid #1E3A5F',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value: number) => [`${value} consultation${value !== 1 ? 's' : ''}`, 'Volume']}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={40}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.intensity)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-[#1E3A5F]" />
          <span className="text-gray-500">Low</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-[#0EA5E9]" />
          <span className="text-gray-500">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-[#00D4FF]" />
          <span className="text-gray-500">Peak</span>
        </div>
      </div>
    </div>
  );
}

export default PeakHoursChart;
