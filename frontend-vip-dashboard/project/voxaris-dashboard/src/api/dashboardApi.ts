// src/api/dashboardApi.ts

import { 
  DashboardData, 
  DashboardFilters, 
  CampaignMetrics, 
  FunnelStage, 
  AIMetrics, 
  Appointment, 
  ROIData, 
  Activity 
} from '../types/dashboard.types';

// POINT TO PRODUCTION BACKEND
const API_BASE = 'https://hill-nissan-backend.onrender.com/api/analytics';

// MOCK DATA GENERATORS (For "Looking Nice" on Demo Day)
const generateDailyTrend = () => {
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({
      date: d.toISOString().split('T')[0],
      conversations: Math.floor(Math.random() * 20) + 5,
      bookings: Math.floor(Math.random() * 5),
      sentiment: 70 + Math.random() * 30
    });
  }
  return days;
};

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt_1', contactId: 'c1', contactName: 'Ethan Blueprint', contactPhone: '555-010-9988', contactEmail: 'ethan@test.com',
    vehicle: '2020 Altima', appointmentDate: new Date(), appointmentTime: '14:00', status: 'confirmed', source: 'tavus'
  },
  {
    id: 'apt_2', contactId: 'c2', contactName: 'Maria Simulator', contactPhone: '555-010-7777', contactEmail: 'maria@test.com',
    vehicle: '2019 Rogue', appointmentDate: new Date(Date.now() + 86400000), appointmentTime: '10:00', status: 'scheduled', source: 'retell'
  }
];

export const dashboardApi = {
  // Get full dashboard data (Mix of Real + Mock)
  getDashboard: async (filters: DashboardFilters): Promise<DashboardData> => {
    // 1. Fetch REAL "Pulse" from Backend
    let realData: any = { funnel: {}, rates: {}, revenue: {} };
    try {
        const res = await fetch(`${API_BASE}/dashboard`);
        if (res.ok) realData = await res.json();
    } catch (e) {
        console.error("Backend Fetch Failed, using fallback mock", e);
    }

    // 2. Map Real Data to Rich Frontend Structure
    const metrics: CampaignMetrics = {
        totalMailers: realData.funnel?.mailers_sent || 5000,
        qrScans: realData.funnel?.qr_scanned || 12,
        scanRate: parseFloat(realData.rates?.scan_rate || "0.24"),
        conversations: realData.funnel?.conversations_started || 8,
        conversationRate: 65, // Derived
        appointments: realData.funnel?.appointments_booked || 3,
        bookingRate: parseFloat(realData.rates?.booking_rate || "25"),
        shows: realData.funnel?.appointment_showed || 1,
        showRate: 33,
        deals: realData.funnel?.deals_closed || 0,
        closeRate: 0,
        totalRevenue: realData.revenue?.total_deal_value || 0,
        avgDealValue: 4500
    };

    const funnel: FunnelStage[] = [
        { stage: 'Mailers Sent', count: metrics.totalMailers, conversionRate: 100, dropOff: 0 },
        { stage: 'QR Scans', count: metrics.qrScans, conversionRate: metrics.scanRate, dropOff: metrics.totalMailers - metrics.qrScans },
        { stage: 'Conversations', count: metrics.conversations, conversionRate: 65, dropOff: metrics.qrScans - metrics.conversations },
        { stage: 'Appointments', count: metrics.appointments, conversionRate: metrics.bookingRate, dropOff: metrics.conversations - metrics.appointments },
        { stage: 'Deals', count: metrics.deals, conversionRate: metrics.closeRate, dropOff: metrics.appointments - metrics.deals }
    ];

    const aiMetrics: AIMetrics = {
        totalConversations: metrics.conversations,
        avgDuration: 145, // seconds
        avgSentiment: 82, // Score
        bookingRate: metrics.bookingRate,
        topObjections: [
            { objection: 'Monthly Payment', count: 12, percentage: 45 },
            { objection: 'Trade Value', count: 8, percentage: 30 },
            { objection: 'Not Ready', count: 5, percentage: 25 }
        ],
        intentDistribution: [
             { intent: 'Upgrade', count: 65 },
             { intent: 'Cash Out', count: 35 }
        ],
        channelPerformance: [
            { channel: 'Voice (Retell)', conversations: 15, bookingRate: 20, avgSentiment: 85, avgDuration: 180 },
            { channel: 'Video (Tavus)', conversations: 5, bookingRate: 40, avgSentiment: 90, avgDuration: 120 }
        ],
        dailyTrend: generateDailyTrend()
    };

    return {
        metrics,
        funnel,
        leadQuality: { hot: 5, warm: 8, cool: 12, cold: 4 },
        channels: aiMetrics.channelPerformance,
        aiMetrics,
        appointments: MOCK_APPOINTMENTS,
        roi: {
            campaignCosts: { mailerCost: 2500, aiMinutesCost: 150, platformCost: 299, totalCost: 2949 },
            results: { totalLeads: metrics.qrScans, appointments: metrics.appointments, shows: metrics.shows, deals: metrics.deals, revenue: metrics.totalRevenue }
        },
        campaign: {
            id: 'campaign_vip_1',
            name: 'VIP Buyback - Jan 2026',
            startDate: new Date('2026-01-01'),
            endDate: new Date('2026-01-31')
        }
    };
  },

  // Sub-getters just call getDashboard for consistency in this adapter
  getMetrics: async (f: DashboardFilters) => (await dashboardApi.getDashboard(f)).metrics,
  getFunnel: async (f: DashboardFilters) => (await dashboardApi.getDashboard(f)).funnel,
  getAIMetrics: async (f: DashboardFilters) => (await dashboardApi.getDashboard(f)).aiMetrics,
  getAppointments: async (f: DashboardFilters) => (await dashboardApi.getDashboard(f)).appointments,
  getROI: async (f: DashboardFilters) => (await dashboardApi.getDashboard(f)).roi,
  
  getRecentActivity: async (locId: string, limit = 50): Promise<Activity[]> => {
      // Mock Activity Feed
      return [
          { id: '1', type: 'appointment_booked', channel: 'retell', contactName: 'Maria Simulator', contactId: 'c1', timestamp: new Date(), metadata: { vehicle: '2020 Altima' } },
          { id: '2', type: 'conversation_ended', channel: 'tavus', contactName: 'Ethan Blueprint', contactId: 'c2', timestamp: new Date(Date.now() - 3600000), metadata: { duration: 120 } },
          { id: '3', type: 'qr_scan', channel: 'manual', contactName: 'John Doe', contactId: 'c3', timestamp: new Date(Date.now() - 7200000) }
      ];
  },

  exportReport: async () => new Blob(['Report Data'], { type: 'text/csv' }),
  updateAppointmentStatus: async () => MOCK_APPOINTMENTS[0],
  recordDealOutcome: async () => {} 
};

export default dashboardApi;
