import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { LeadQualityData } from '../../types/dashboard.types';

interface LeadQualityChartProps {
  data: LeadQualityData;
}

const LeadQualityChart: React.FC<LeadQualityChartProps> = ({ data }) => {
  const chartData = [
    { name: 'Hot', value: data.hot, color: '#EF4444' },
    { name: 'Warm', value: data.warm, color: '#F59E0B' },
    { name: 'Cool', value: data.cool, color: '#3B82F6' },
    { name: 'Cold', value: data.cold, color: '#9CA3AF' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Quality</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LeadQualityChart;
