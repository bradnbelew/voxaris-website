// src/components/medspa/UsageCard.tsx
import { Clock, TrendingUp, Calendar } from 'lucide-react';
import { UsageMetrics } from '../../api/medSpaApi';

interface UsageCardProps {
  data?: UsageMetrics;
  isLoading?: boolean;
  minutesIncluded?: number; // Monthly plan minutes (e.g., 500)
}

export function UsageCard({ data, isLoading, minutesIncluded }: UsageCardProps) {
  if (isLoading) {
    return (
      <div className="bg-[#0A1628] border border-[#1E3A5F]/30 rounded-xl p-6">
        <div className="h-6 bg-[#1E3A5F] rounded w-1/3 mb-6 animate-pulse" />
        <div className="h-32 bg-[#1E3A5F]/50 rounded animate-pulse" />
      </div>
    );
  }

  const usedMinutes = data?.totalMinutes || 0;
  const usedHours = data?.totalHours || 0;
  const percentage = minutesIncluded ? Math.min((usedMinutes / minutesIncluded) * 100, 100) : 0;

  const formatPeriod = (): string => {
    if (!data?.periodStart || !data?.periodEnd) return 'Current Period';
    const start = new Date(data.periodStart);
    const end = new Date(data.periodEnd);
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  return (
    <div className="bg-gradient-to-br from-[#0A1628] to-[#0F2847] border border-[#1E3A5F]/30 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-semibold text-lg">Usage This Period</h3>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Calendar className="w-4 h-4" />
          <span>{formatPeriod()}</span>
        </div>
      </div>

      {/* Main Stats */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="text-4xl font-bold text-cyan-400">
            {usedMinutes.toFixed(1)}
            <span className="text-lg text-gray-400 font-normal ml-2">min</span>
          </div>
          <div className="text-gray-400 text-sm mt-1">
            ({usedHours.toFixed(2)} hours)
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">
            {data?.totalCalls || 0}
          </div>
          <div className="text-gray-400 text-sm">consultations</div>
        </div>
      </div>

      {/* Progress Bar (if plan has minutes limit) */}
      {minutesIncluded && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-400">Plan Usage</span>
            <span className="text-white">
              {usedMinutes.toFixed(0)} / {minutesIncluded} min
            </span>
          </div>
          <div className="h-3 bg-[#1E3A5F]/50 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                percentage > 90 ? 'bg-red-500' :
                percentage > 70 ? 'bg-amber-500' :
                'bg-gradient-to-r from-cyan-500 to-emerald-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs mt-2">
            <span className="text-gray-500">
              {(minutesIncluded - usedMinutes).toFixed(0)} min remaining
            </span>
            <span className={`font-medium ${
              percentage > 90 ? 'text-red-400' :
              percentage > 70 ? 'text-amber-400' :
              'text-emerald-400'
            }`}>
              {percentage.toFixed(0)}% used
            </span>
          </div>
        </div>
      )}

      {/* Average per consultation */}
      <div className="pt-4 border-t border-[#1E3A5F]/30">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <TrendingUp className="w-4 h-4" />
            <span>Avg. per consultation</span>
          </div>
          <span className="text-white font-medium">
            {data?.totalCalls && data.totalCalls > 0
              ? (usedMinutes / data.totalCalls).toFixed(1)
              : '0'} min
          </span>
        </div>
      </div>
    </div>
  );
}

export default UsageCard;
