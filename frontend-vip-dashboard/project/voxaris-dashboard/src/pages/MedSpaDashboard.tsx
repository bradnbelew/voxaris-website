// src/pages/MedSpaDashboard.tsx
import { useState, useEffect } from 'react';
import { Activity, RefreshCw, Shield } from 'lucide-react';
import { medSpaApi, MedSpaAnalytics, UsageMetrics, MedSpaCall } from '../api/medSpaApi';
import {
  SummaryStats,
  ConcernsChart,
  CallVolumeChart,
  SentimentBreakdown,
  PeakHoursChart,
  RecentCallsTable,
  UsageCard
} from '../components/medspa';

// Simple token-based authentication
const VALID_TOKEN = 'oaos-secure-token-2026';

export function MedSpaDashboard() {
  const [analytics, setAnalytics] = useState<MedSpaAnalytics | null>(null);
  const [usage, setUsage] = useState<UsageMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState(30);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Check authentication
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    setIsAuthenticated(token === VALID_TOKEN);
  }, []);

  // Fetch data
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [analyticsRes, usageRes] = await Promise.all([
        medSpaApi.getAnalytics(dateRange),
        medSpaApi.getUsage()
      ]);

      if (analyticsRes.success && analyticsRes.data) {
        setAnalytics(analyticsRes.data);
      } else {
        throw new Error(analyticsRes.error || 'Failed to load analytics');
      }

      if (usageRes.success && usageRes.data) {
        setUsage(usageRes.data);
      }

      setLastUpdated(new Date());
    } catch (err: any) {
      console.error('Dashboard error:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, dateRange]);

  // Access denied screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400 max-w-sm">
            This dashboard requires authentication. Please use the link provided by your account manager.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712]">
      {/* Header */}
      <header className="bg-[#0A1628] border-b border-[#1E3A5F]/30 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Logo */}
              <img
                src="https://voxaris.io/Voxaris%20Logo%20v2.png"
                alt="Voxaris"
                className="h-8"
              />
              <div className="h-6 w-px bg-[#1E3A5F]" />
              <div>
                <h1 className="text-white font-semibold">Orlando Art of Surgery</h1>
                <p className="text-gray-400 text-sm">AI Consultation Analytics</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Date Range Selector */}
              <select
                value={dateRange}
                onChange={(e) => setDateRange(Number(e.target.value))}
                className="bg-[#0A1628] border border-[#1E3A5F]/50 text-white px-4 py-2 rounded-lg text-sm focus:outline-none focus:border-cyan-400"
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </select>

              {/* Refresh Button */}
              <button
                onClick={fetchData}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-[#1E3A5F]/30 text-white rounded-lg hover:bg-[#1E3A5F]/50 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="text-sm">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {error ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchData}
              className="px-6 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Last Updated */}
            {lastUpdated && (
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
                <Activity className="w-4 h-4" />
                <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
              </div>
            )}

            {/* Summary Stats */}
            <SummaryStats data={analytics?.summary} isLoading={isLoading} />

            {/* Usage Card + Volume Chart Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-1">
                <UsageCard
                  data={usage || undefined}
                  isLoading={isLoading}
                  minutesIncluded={500} // Example: 500 min/month plan
                />
              </div>
              <div className="lg:col-span-2">
                <CallVolumeChart data={analytics?.charts?.dailyVolume} isLoading={isLoading} />
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <SentimentBreakdown data={analytics?.summary?.sentimentBreakdown} isLoading={isLoading} />
              <ConcernsChart data={analytics?.topConcerns} isLoading={isLoading} />
            </div>

            {/* Peak Hours */}
            <div className="mb-6">
              <PeakHoursChart data={analytics?.peakHours} isLoading={isLoading} />
            </div>

            {/* Recent Calls */}
            <RecentCallsTable calls={analytics?.recentCalls} isLoading={isLoading} />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#0A1628] border-t border-[#1E3A5F]/30 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="https://voxaris.io/Voxaris%20Logo%20v2.png"
              alt="Voxaris"
              className="h-6 opacity-50"
            />
            <span className="text-gray-500 text-sm">Powered by Voxaris AI</span>
          </div>
          <div className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Voxaris. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MedSpaDashboard;
