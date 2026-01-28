import React from 'react';
import { CampaignMetrics } from '../../types/dashboard.types';

interface CampaignOverviewProps {
  metrics: CampaignMetrics;
}

const CampaignOverview: React.FC<CampaignOverviewProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-xl border shadow-sm">
        <p className="text-sm text-gray-500">Total Mailers</p>
        <p className="text-2xl font-bold">{metrics.totalMailers.toLocaleString()}</p>
      </div>
      <div className="bg-white p-4 rounded-xl border shadow-sm">
        <p className="text-sm text-gray-500">QR Scans</p>
        <p className="text-2xl font-bold">{metrics.qrScans}</p>
        <p className="text-xs text-green-600">{metrics.scanRate}% Conv.</p>
      </div>
      <div className="bg-white p-4 rounded-xl border shadow-sm">
        <p className="text-sm text-gray-500">Conversations</p>
        <p className="text-2xl font-bold">{metrics.conversations}</p>
      </div>
      <div className="bg-white p-4 rounded-xl border shadow-sm">
        <p className="text-sm text-gray-500">Revenue</p>
        <p className="text-2xl font-bold text-green-600">${metrics.totalRevenue.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default CampaignOverview;
