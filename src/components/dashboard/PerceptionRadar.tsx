import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, PolarRadiusAxis } from 'recharts';

const data = [
  { subject: 'Eye Contact', A: 92, fullMark: 100 },
  { subject: 'Attention', A: 88, fullMark: 100 },
  { subject: 'Positivity', A: 75, fullMark: 100 },
  { subject: 'Engagement', A: 95, fullMark: 100 },
  { subject: 'Clarity', A: 85, fullMark: 100 },
];

export const PerceptionRadar = () => {
  return (
    <div className="w-full h-full min-h-[300px] flex items-center justify-center relative">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#3f3f46" strokeWidth={1} />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#a1a1aa', fontSize: 11, fontFamily: 'monospace', fontWeight: 600 }} 
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Subject"
            dataKey="A"
            stroke="#06b6d4"
            strokeWidth={3}
            fill="#06b6d4"
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
      
      {/* Central Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none"></div>

      <div className="absolute bottom-4 left-4 flex gap-4">
        <div>
          <div className="text-[10px] uppercase text-zinc-500 font-mono tracking-wider">Focus Interest</div>
          <div className="text-xl font-bold text-white font-mono">High</div>
        </div>
      </div>
    </div>
  );
};
