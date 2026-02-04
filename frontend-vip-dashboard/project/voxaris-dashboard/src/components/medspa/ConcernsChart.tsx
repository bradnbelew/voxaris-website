// src/components/medspa/ConcernsChart.tsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ConcernsChartProps {
  data?: Array<{
    concern: string;
    count: number;
    percentage: number;
  }>;
  isLoading?: boolean;
}

export function ConcernsChart({ data, isLoading }: ConcernsChartProps) {
  const colors = ['#00D4FF', '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1'];

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
        <h3 className="text-white font-semibold text-lg mb-4">Top Concerns</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          No concerns data yet
        </div>
      </div>
    );
  }

  // Format data for horizontal bar chart
  const chartData = data.slice(0, 5).map((item) => ({
    ...item,
    name: item.concern.length > 20 ? item.concern.slice(0, 20) + '...' : item.concern
  }));

  return (
    <div className="bg-[#0A1628] border border-[#1E3A5F]/30 rounded-xl p-6">
      <h3 className="text-white font-semibold text-lg mb-4">Top Concerns Discussed</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <XAxis
              type="number"
              stroke="#64748b"
              tickFormatter={(value) => `${value}`}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#64748b"
              width={95}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                border: '1px solid #1E3A5F',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value: number, name: string, props: any) => [
                `${value} mentions (${props.payload.percentage}%)`,
                'Count'
              ]}
              labelFormatter={(label) => chartData.find(d => d.name === label)?.concern || label}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ConcernsChart;
