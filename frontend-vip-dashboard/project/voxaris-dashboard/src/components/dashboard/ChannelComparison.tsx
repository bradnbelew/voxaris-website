import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { ChannelData } from '../../types/dashboard.types';

interface ChannelComparisonProps {
  data: ChannelData[];
}

const ChannelComparison: React.FC<ChannelComparisonProps> = ({ data }) => {
  const getBarColor = (channel: string) => {
    switch (channel) {
      case 'Voice (Retell)':
        return '#22C55E';
      case 'Video (Tavus)':
        return '#8B5CF6';
      case 'Chat':
        return '#3B82F6';
      default:
        return '#9CA3AF';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Channel Performance
      </h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" />
            <YAxis 
              dataKey="channel" 
              type="category" 
              width={100} 
              tick={{ fontSize: 12 }} 
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
            />
            <Legend />
            <Bar dataKey="bookingRate" name="Booking Rate (%)" fill="#8884d8" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.channel)} />
                ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChannelComparison;
