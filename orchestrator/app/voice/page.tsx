import {
  Phone,
  CheckCircle,
  Clock,
  TrendingUp,
  DollarSign,
  Target,
} from "lucide-react";
import StatCard from "@/components/voice/StatCard";
import OutcomeChart from "@/components/voice/OutcomeChart";
import { MOCK_STATS, MOCK_OUTCOMES } from "@/lib/voice/mock-data";

function fmtDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${s}s`;
}

export default function VoiceOverviewPage() {
  const s = MOCK_STATS;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Voice Campaign Overview</h1>
        <p className="text-sm text-gray-500">
          Real-time analytics for Movvix voice upgrade campaigns
        </p>
      </div>

      {/* Stat cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          icon={<Phone className="h-4 w-4" />}
          label="Total Calls"
          value={s.totalCalls.toLocaleString()}
          accent="gold"
        />
        <StatCard
          icon={<CheckCircle className="h-4 w-4" />}
          label="Completed"
          value={s.completedCalls.toLocaleString()}
          accent="emerald"
        />
        <StatCard
          icon={<Clock className="h-4 w-4" />}
          label="Avg Duration"
          value={fmtDuration(s.avgDurationSec)}
          accent="blue"
        />
        <StatCard
          icon={<TrendingUp className="h-4 w-4" />}
          label="Conversion Rate"
          value={`${s.conversionRate}%`}
          accent="emerald"
        />
        <StatCard
          icon={<DollarSign className="h-4 w-4" />}
          label="Total Cost"
          value={`$${s.totalCost.toFixed(2)}`}
          accent="gold"
        />
        <StatCard
          icon={<Target className="h-4 w-4" />}
          label="Cost / Conversion"
          value={`$${s.costPerConversion.toFixed(2)}`}
          accent="emerald"
        />
      </div>

      {/* Outcome chart */}
      <div className="max-w-2xl">
        <OutcomeChart data={MOCK_OUTCOMES} />
      </div>
    </div>
  );
}
