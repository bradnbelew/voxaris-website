// src/App.tsx
import React, { useState } from 'react';
import { subDays } from 'date-fns';
import DashboardLayout from './components/dashboard/DashboardLayout';
import MedSpaDashboard from './pages/MedSpaDashboard';

function App() {
  // Get params from URL
  const urlParams = new URLSearchParams(window.location.search);
  const dashboardType = urlParams.get('type');
  const locationId = urlParams.get('locationId') || 'default_location';
  const campaignId = urlParams.get('campaignId') || undefined;

  const [dateRange, setDateRange] = useState({
    start: subDays(new Date(), 30),
    end: new Date()
  });

  // Route to MedSpa Dashboard if type=medspa
  if (dashboardType === 'medspa') {
    return <MedSpaDashboard />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardLayout
        locationId={locationId}
        campaignId={campaignId}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />
    </div>
  );
}

export default App;
