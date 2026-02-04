// src/components/medspa/SentimentBreakdown.tsx
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { TrendingUp, Minus, TrendingDown } from 'lucide-react';

interface SentimentBreakdownProps {
  data?: {
    positive: number;
    neutral: number;
    negative: number;
  };
  isLoading?: boolean;
}

export function SentimentBreakdown({ data, isLoading }: SentimentBreakdownProps) {
  if (isLoading) {
    return (
      <div className="bg-[#0A1628] border border-[#1E3A5F]/30 rounded-xl p-6">
        <div className="h-6 bg-[#1E3A5F] rounded w-1/3 mb-6 animate-pulse" />
        <div className="h-64 bg-[#1E3A5F]/50 rounded animate-pulse" />
      </div>
    );
  }

  const total = (data?.positive || 0) + (data?.neutral || 0) + (data?.negative || 0);

  if (!data || total === 0) {
    return (
      <div className="bg-[#0A1628] border border-[#1E3A5F]/30 rounded-xl p-6">
        <h3 className="text-white font-semibold text-lg mb-4">Sentiment Analysis</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          No sentiment data yet
        </div>
      </div>
    );
  }

  const chartData = [
    { name: 'Positive', value: data.positive, color: '#10B981', icon: TrendingUp },
    { name: 'Neutral', value: data.neutral, color: '#F59E0B', icon: Minus },
    { name: 'Negative', value: data.negative, color: '#EF4444', icon: TrendingDown }
  ].filter(item => item.value > 0);

  const getPercentage = (value: number) => ((value / total) * 100).toFixed(0);

  return (
    <div className="bg-[#0A1628] border border-[#1E3A5F]/30 rounded-xl p-6">
      <h3 className="text-white font-semibold text-lg mb-4">Visitor Sentiment</h3>
      <div className="flex items-center gap-6">
        <div className="h-48 w-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  border: '1px solid #1E3A5F',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value: number, name: string) => [
                  `${value} (${getPercentage(value)}%)`,
                  name
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-4">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <div className="flex items-center gap-2">
                  <item.icon
                    className="w-4 h-4"
                    style={{ color: item.color }}
                  />
                  <span className="text-gray-300">{item.name}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-white font-semibold">{item.value}</span>
                <span className="text-gray-500 text-sm ml-2">
                  ({getPercentage(item.value)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-[#1E3A5F]/30">
        <div className="text-center">
          <span className="text-gray-400 text-sm">Overall Score: </span>
          <span className="text-white font-semibold">
            {total > 0 ?
              Math.round(((data.positive * 100) + (data.neutral * 50)) / total) : 0
            }/100
          </span>
        </div>
      </div>
    </div>
  );
}

export default SentimentBreakdown;
