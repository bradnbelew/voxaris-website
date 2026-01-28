// src/types/dashboard.types.ts

export interface DateRange {
  start: Date;
  end: Date;
}

export interface CampaignMetrics {
  totalMailers: number;
  qrScans: number;
  scanRate: number;
  conversations: number;
  conversationRate: number;
  appointments: number;
  bookingRate: number;
  shows: number;
  showRate: number;
  deals: number;
  closeRate: number;
  totalRevenue: number;
  avgDealValue: number;
  previousPeriod?: {
    scanRate: number;
    bookingRate: number;
    closeRate: number;
    revenue: number;
  };
}

export interface FunnelStage {
  stage: string;
  count: number;
  conversionRate: number;
  dropOff: number;
}

export interface LeadQualityData {
  hot: number;
  warm: number;
  cool: number;
  cold: number;
}

export interface ChannelData {
  channel: string;
  conversations: number;
  bookingRate: number;
  avgSentiment: number;
  avgDuration: number;
}

export interface AIMetrics {
  totalConversations: number;
  avgDuration: number;
  avgSentiment: number;
  bookingRate: number;
  topObjections: Array<{
    objection: string;
    count: number;
    percentage: number;
  }>;
  intentDistribution: Array<{
    intent: string;
    count: number;
  }>;
  channelPerformance: ChannelData[];
  dailyTrend: Array<{
    date: string;
    conversations: number;
    bookings: number;
    sentiment: number;
  }>;
}

export interface Appointment {
  id: string;
  contactId: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  vehicle: string;
  appointmentDate: Date;
  appointmentTime: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'no_show' | 'cancelled' | 'rescheduled';
  source: 'tavus' | 'retell' | 'ghl_voice' | 'ghl_chat' | 'manual';
  notes?: string;
}

export interface ROIData {
  campaignCosts: {
    mailerCost: number;
    aiMinutesCost: number;
    platformCost: number;
    totalCost: number;
  };
  results: {
    totalLeads: number;
    appointments: number;
    shows: number;
    deals: number;
    revenue: number;
  };
}

export interface Activity {
  id: string;
  type: 
    | 'qr_scan' 
    | 'conversation_started' 
    | 'conversation_ended' 
    | 'appointment_booked' 
    | 'appointment_showed' 
    | 'appointment_no_show' 
    | 'deal_closed' 
    | 'deal_lost';
  channel: 'tavus' | 'retell' | 'ghl_voice' | 'ghl_chat' | 'manual';
  contactName: string;
  contactId: string;
  vehicle?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface DashboardData {
  metrics: CampaignMetrics;
  funnel: FunnelStage[];
  leadQuality: LeadQualityData;
  channels: ChannelData[];
  aiMetrics: AIMetrics;
  appointments: Appointment[];
  roi: ROIData;
  campaign?: {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
  };
}

export interface DashboardFilters {
  locationId: string;
  campaignId?: string;
  startDate: Date;
  endDate: Date;
}
