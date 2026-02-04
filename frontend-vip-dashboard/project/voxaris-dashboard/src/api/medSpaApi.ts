// src/api/medSpaApi.ts
// API client for Med Spa analytics dashboard

const API_BASE = 'https://hill-nissan-backend.onrender.com/api/analytics';
const CLIENT_ID = 'orlando-art-of-surgery'; // Hardcoded for single customer

export interface MedSpaAnalyticsResponse {
  success: boolean;
  data?: MedSpaAnalytics;
  error?: string;
}

export interface MedSpaAnalytics {
  summary: {
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
  topConcerns: Array<{
    concern: string;
    count: number;
    percentage: number;
  }>;
  peakHours: Array<{
    hour: number;
    count: number;
  }>;
  charts: {
    dailyVolume: Array<{
      date: string;
      calls: number;
      minutes: number;
    }>;
  };
  recentCalls: MedSpaCall[];
}

export interface MedSpaCall {
  call_id: string;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number;
  summary: string | null;
  sentiment_label: string | null;
  sentiment_score: number | null;
  booking_requested: boolean;
  concerns: string[];
}

export interface MedSpaCallsResponse {
  success: boolean;
  data?: MedSpaCall[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}

export interface UsageMetrics {
  totalCalls: number;
  totalMinutes: number;
  totalHours: number;
  periodStart: string;
  periodEnd: string;
  dailyBreakdown: Array<{
    date: string;
    calls: number;
    minutes: number;
  }>;
}

export interface UsageResponse {
  success: boolean;
  data?: UsageMetrics;
  error?: string;
}

export const medSpaApi = {
  /**
   * Get comprehensive analytics for the med spa client
   */
  getAnalytics: async (days: number = 30): Promise<MedSpaAnalyticsResponse> => {
    try {
      const res = await fetch(`${API_BASE}/medspa/${CLIENT_ID}?days=${days}`);
      return await res.json();
    } catch (error: any) {
      console.error('Failed to fetch analytics:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get paginated list of calls
   */
  getCalls: async (page: number = 1, limit: number = 20): Promise<MedSpaCallsResponse> => {
    try {
      const res = await fetch(`${API_BASE}/medspa/${CLIENT_ID}/calls?page=${page}&limit=${limit}`);
      return await res.json();
    } catch (error: any) {
      console.error('Failed to fetch calls:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get detailed information for a single call
   */
  getCallDetail: async (callId: string): Promise<{ success: boolean; data?: MedSpaCall; error?: string }> => {
    try {
      const res = await fetch(`${API_BASE}/medspa/call/${callId}`);
      return await res.json();
    } catch (error: any) {
      console.error('Failed to fetch call detail:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get usage/billing metrics
   */
  getUsage: async (startDate?: Date, endDate?: Date): Promise<UsageResponse> => {
    try {
      let url = `${API_BASE}/medspa/${CLIENT_ID}/usage`;
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate.toISOString());
      if (endDate) params.append('endDate', endDate.toISOString());
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      return await res.json();
    } catch (error: any) {
      console.error('Failed to fetch usage:', error);
      return { success: false, error: error.message };
    }
  }
};

export default medSpaApi;
