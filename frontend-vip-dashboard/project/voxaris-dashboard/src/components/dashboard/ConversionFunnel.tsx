import React from 'react';
import {
  FunnelChart,
  Funnel,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';
import { FunnelStage } from '../../types/dashboard.types';

interface ConversionFunnelProps {
  data: FunnelStage[];
}

const ConversionFunnel: React.FC<ConversionFunnelProps> = ({ data }) => {
  const COLORS = [
    '#3B82F6', // blue
    '#6366F1', // indigo
    '#8B5CF6', // purple
    '#A855F7', // violet
    '#EC4899', // pink
    '#22C55E', // green
  ];

  const funnelData = [
    { name: 'Mailers Sent', value: data[0]?.count || 0, fill: COLORS[0] },
    { name: 'QR Scanned', value: data[1]?.count || 0, fill: COLORS[1] },
    { name: 'AI Conversation', value: data[2]?.count || 0, fill: COLORS[2] },
    { name: 'Appt Booked', value: data[3]?.count || 0, fill: COLORS[3] },
    { name: 'Showed Up', value: data[4]?.count || 0, fill: COLORS[4] },
    { name: 'Deal Closed', value: data[5]?.count || 0, fill: COLORS[5] },
  ];

  const getConversionRateColor = (rate: number) => {
    if (rate >= 50) return 'text-green-600';
    if (rate >= 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Conversion Funnel
      </h3>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <FunnelChart>
            <Tooltip
              formatter={(value: number, name: string) => [
                `${value.toLocaleString()} contacts`,
                name,
              ]}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
            />
            <Funnel dataKey="value" data={funnelData} isAnimationActive>
              <LabelList
                position="right"
                fill="#374151"
                stroke="none"
                dataKey="name"
                fontSize={12}
              />
              <LabelList
                position="center"
                fill="#fff"
                stroke="none"
                dataKey="value"
                formatter={(value: number) => value.toLocaleString()}
                fontSize={14}
                fontWeight="bold"
              />
              {funnelData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>

      {/* Conversion Rates */}
      <div className="mt-4 grid grid-cols-5 gap-2">
        {data.slice(1).map((stage, index) => (
          <div
            key={stage.stage}
            className="text-center p-2 bg-gray-50 rounded-lg"
          >
            <div className="text-xs text-gray-500 truncate" title={`${data[index]?.stage} → ${stage.stage}`}>
              Stage {index + 1} → {index + 2}
            </div>
            <div
              className={`text-lg font-semibold ${getConversionRateColor(
                stage.conversionRate
              )}`}
            >
              {stage.conversionRate.toFixed(0)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversionFunnel;
