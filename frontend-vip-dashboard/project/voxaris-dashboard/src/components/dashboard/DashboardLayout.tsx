// src/components/dashboard/DashboardLayout.tsx

import React, { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import { useDashboardData, useRealtimeUpdates } from '../../hooks';
import { DateRange } from '../../types/dashboard.types';
import CampaignOverview from './CampaignOverview';
import LiveActivityFeed from './LiveActivityFeed';
import ConversionFunnel from './ConversionFunnel';
import AIPerformanceMetrics from './AIPerformanceMetrics';
import AppointmentCalendar from './AppointmentCalendar';
import LeadQualityChart from './LeadQualityChart';
import ChannelComparison from './ChannelComparison';
import ROICalculator from './ROICalculator';
import DateRangePicker from './DateRangePicker';
import LoadingSpinner from './LoadingSpinner';
import ErrorState from './ErrorState';

interface DashboardLayoutProps {
  locationId: string;
  campaignId?: string;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

type TabType = 'overview' | 'ai' | 'calendar' | 'roi';

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  locationId,
  campaignId,
  dateRange,
  onDateRangeChange,
}) => {
  const [selectedTab, setSelectedTab] = useState<TabType>('overview');

  // Fetch dashboard data
  const { data, isLoading, error, refetch } = useDashboardData({
    locationId,
    campaignId,
    startDate: dateRange.start,
    endDate: dateRange.end,
  });

  // Real-time updates via WebSocket
  const { events, isConnected } = useRealtimeUpdates(locationId);

  // Refetch on significant events
  useEffect(() => {
    const significantEvents = ['appointment_booked', 'deal_closed', 'appointment_showed'];
    const hasSignificantEvent = events.some(
      (e) => significantEvents.includes(e.type) && 
             Date.now() - e.timestamp.getTime() < 5000
    );
    
    if (hasSignificantEvent) {
      refetch();
    }
  }, [events, refetch]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  if (!data) {
    return <ErrorState error={new Error('No data available')} onRetry={refetch} />;
  }

  const tabs: { id: TabType; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'ai', label: 'AI Performance' },
    { id: 'calendar', label: 'Appointments' },
    { id: 'roi', label: 'ROI Analysis' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                VIP Buyback Dashboard
              </h1>
              <p className="text-sm text-gray-500">
                {campaignId && data.campaign
                  ? `Campaign: ${data.campaign.name}`
                  : 'All Campaigns'}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Connection Status */}
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                  }`}
                />
                <span className="text-sm text-gray-500">
                  {isConnected ? 'Live' : 'Offline'}
                </span>
              </div>

              {/* Date Range Picker */}
              <DateRangePicker
                value={dateRange}
                onChange={onDateRangeChange}
              />
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="mt-4 flex gap-2 overflow-x-auto pb-2 -mb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {selectedTab === 'overview' && (
          <div className="space-y-6">
            {/* Top Metrics */}
            <CampaignOverview metrics={data.metrics} />

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Funnel - 2 columns */}
              <div className="lg:col-span-2">
                <ConversionFunnel data={data.funnel} />
              </div>

              {/* Live Feed - 1 column */}
              <div className="lg:col-span-1">
                <LiveActivityFeed events={events} maxHeight="400px" />
              </div>
            </div>

            {/* Lead Quality + Channel Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LeadQualityChart data={data.leadQuality} />
              <ChannelComparison data={data.channels} />
            </div>
          </div>
        )}

        {selectedTab === 'ai' && (
          <AIPerformanceMetrics data={data.aiMetrics} />
        )}

        {selectedTab === 'calendar' && (
          <AppointmentCalendar
            appointments={data.appointments}
            onStatusChange={refetch}
          />
        )}

        {selectedTab === 'roi' && (
          <ROICalculator data={data.roi} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-8 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>Powered by Voxaris</span>
            <span>
              Last updated: {format(new Date(), 'MMM d, yyyy h:mm a')}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;
