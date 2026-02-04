// src/components/medspa/SummaryStats.tsx
import { Phone, Clock, Calendar, TrendingUp } from 'lucide-react';

interface SummaryStatsProps {
  data?: {
    totalCalls: number;
    totalMinutes: number;
    totalHours: number;
    avgDurationSeconds: number;
    bookingRate: number;
    bookingsRequested: number;
    sentimentBreakdown: {
      positive: number;
      neutral: number;
      negative: number;
    };
  };
  isLoading?: boolean;
}

export function SummaryStats({ data, isLoading }: SummaryStatsProps) {
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const stats = [
    {
      label: 'Total Consultations',
      value: data?.totalCalls ?? 0,
      icon: Phone,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-400/10',
      borderColor: 'border-cyan-400/20'
    },
    {
      label: 'Minutes Used',
      value: `${data?.totalMinutes?.toFixed(1) ?? '0'} min`,
      subtext: data?.totalHours ? `(${data.totalHours.toFixed(1)} hours)` : undefined,
      icon: Clock,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-400/10',
      borderColor: 'border-emerald-400/20'
    },
    {
      label: 'Booking Rate',
      value: `${(data?.bookingRate ?? 0).toFixed(0)}%`,
      subtext: `${data?.bookingsRequested ?? 0} bookings requested`,
      icon: Calendar,
      color: 'text-violet-400',
      bgColor: 'bg-violet-400/10',
      borderColor: 'border-violet-400/20'
    },
    {
      label: 'Avg. Duration',
      value: formatDuration(data?.avgDurationSeconds ?? 0),
      icon: TrendingUp,
      color: 'text-amber-400',
      bgColor: 'bg-amber-400/10',
      borderColor: 'border-amber-400/20'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-[#0A1628] border border-[#1E3A5F]/30 rounded-xl p-6 animate-pulse"
          >
            <div className="h-4 bg-[#1E3A5F] rounded w-1/2 mb-4" />
            <div className="h-8 bg-[#1E3A5F] rounded w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`bg-[#0A1628] border ${stat.borderColor} rounded-xl p-6 hover:border-opacity-50 transition-all`}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-sm font-medium">{stat.label}</span>
            <div className={`${stat.bgColor} p-2 rounded-lg`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </div>
          <div className={`text-3xl font-bold ${stat.color}`}>
            {stat.value}
          </div>
          {stat.subtext && (
            <div className="text-gray-500 text-sm mt-1">
              {stat.subtext}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default SummaryStats;
