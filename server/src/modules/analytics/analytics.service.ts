import axios from 'axios';
import { supabase } from '../../lib/supabase';

// Interface for Call Data
export interface CallData {
  call_id: string;
  agent_id: string;
  call_status: string;
  start_timestamp: number;
  end_timestamp?: number;
  duration_ms?: number;
  transcript?: string;
  recording_url?: string;
  public_log_url?: string;
  customer_number?: string;
  sentiment?: 'positive' | 'neutral' | 'negative' | 'unknown';
  summary?: string;
  custom_analysis_data?: Record<string, any>;
}

export class AnalyticsService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.RETELL_API_KEY || '';
  }

  async listCalls(limit: number = 20): Promise<CallData[]> {
    try {
        if (!this.apiKey) {
            console.warn('RETELL_API_KEY is missing. Returning mock data.');
            return this.getMockCalls(limit);
        }

        const response = await axios.get('https://api.retellai.com/v2/list-calls', {
            headers: {
                'Authorization': `Bearer ${this.apiKey}`
            },
            params: {
                limit: limit
            }
        });

        // Map Retell response to our internal CallData format
        return response.data.map((call: any) => ({
            call_id: call.call_id,
            agent_id: call.agent_id,
            call_status: call.call_status,
            start_timestamp: call.start_timestamp,
            end_timestamp: call.end_timestamp,
            duration_ms: call.end_timestamp - call.start_timestamp,
            transcript: call.transcript,
            recording_url: call.recording_url,
            public_log_url: call.public_log_url,
            customer_number: call.from_number,
            sentiment: call.call_analysis?.sentiment || 'unknown',
            summary: call.call_analysis?.call_summary || '',
            custom_analysis_data: call.call_analysis?.custom_analysis_data || {}
        }));

    } catch (error) {
        console.error('Error fetching calls from Retell:', error);
        // Fallback to mock data on error so dashboard doesn't break
        return this.getMockCalls(limit);
    }
  }

  async getCall(callId: string): Promise<CallData | null> {
      try {
        if (!this.apiKey) return this.getMockCall(callId);

        const response = await axios.get(`https://api.retellai.com/v2/get-call/${callId}`, {
            headers: {
                'Authorization': `Bearer ${this.apiKey}`
            }
        });
        const call = response.data;
        return {
             call_id: call.call_id,
            agent_id: call.agent_id,
            call_status: call.call_status,
            start_timestamp: call.start_timestamp,
            end_timestamp: call.end_timestamp,
            duration_ms: call.end_timestamp - call.start_timestamp,
            transcript: call.transcript,
            recording_url: call.recording_url,
            public_log_url: call.public_log_url,
            customer_number: call.from_number,
            sentiment: call.call_analysis?.sentiment || 'unknown',
            summary: call.call_analysis?.call_summary || ''
        };

      } catch (error) {
          console.error(`Error fetching call ${callId}:`, error);
          return this.getMockCall(callId);
      }
  }

  // MOCK DATA GENERATOR
  private getMockCalls(limit: number): CallData[] {
      return Array.from({ length: limit }).map((_, i) => ({
          call_id: `call_mock_${i}`,
          agent_id: 'agent_jessica_123',
          call_status: i === 0 ? 'ongoing' : 'ended', // First one live
          start_timestamp: Date.now() - (i * 1000 * 60 * 5), // 5 mins apart
          duration_ms: 120000,
          customer_number: '+1 (555) 012-3456',
          sentiment: i % 3 === 0 ? 'positive' : i % 3 === 1 ? 'neutral' : 'negative',
          summary: "Customer asked about service hours and booked an appointment.",
          transcript: "Agent: Hello, Hill Nissan. How can I help?\nCustomer: Hi, I need an oil change.",
          recording_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" // Public placeholder
      }));
  }

  private getMockCall(callId: string): CallData {
      return {
          call_id: callId,
          agent_id: 'agent_jessica_123',
          call_status: 'ended',
          start_timestamp: Date.now() - 360000,
          duration_ms: 180000,
          customer_number: '+1 (555) 012-3456',
          sentiment: 'positive',
          summary: "Detailed mock summary for specific call.",
          transcript: "Agent: Thank you for calling.\nCustomer: I have a question about my warranty.\nAgent: I can help with that.",
          recording_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
      };
  }
  /* -------------------------------------------------------------------------- */
  /*                            RETELL ANALYTICS                                */
  /* -------------------------------------------------------------------------- */

  async getRetellAnalytics(days: number = 7) {
    try {
        // 1. Fetch recent calls (limit to 1000 for summary)
        const calls = await this.listCalls(1000);
        
        // 2. Filter by date range
        const horizon = Date.now() - (days * 24 * 60 * 60 * 1000);
        const recentCalls = calls.filter(c => c.start_timestamp > horizon);

        // 3. Compute Metrics
        const totalCalls = recentCalls.length;
        
        const totalDuration = recentCalls.reduce((sum, c) => sum + (c.duration_ms || 0), 0);
        const avgDuration = totalCalls > 0 ? Math.round(totalDuration / totalCalls / 1000) : 0; // in seconds

        // 4. Sentiment Breakdown
        const sentimentCounts = { positive: 0, neutral: 0, negative: 0, unknown: 0 };
        recentCalls.forEach(c => {
            const s = c.sentiment || 'unknown';
            sentimentCounts[s] = (sentimentCounts[s] || 0) + 1;
        });

        // 5. Daily Volume (for Bar Chart)
        const dailyVolume: Record<string, number> = {};
        recentCalls.forEach(c => {
            const date = new Date(c.start_timestamp).toISOString().split('T')[0];
            dailyVolume[date] = (dailyVolume[date] || 0) + 1;
        });

        const dailySeries = Object.entries(dailyVolume)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([date, count]) => ({ date, count }));

        // 6. Custom Analysis Aggregation (Dynamic)
        const customStats: Record<string, Record<string, number>> = {};
        recentCalls.forEach(c => {
            if (c.custom_analysis_data) {
                Object.entries(c.custom_analysis_data).forEach(([key, value]) => {
                    if (!customStats[key]) customStats[key] = {};
                    const valStr = String(value);
                    customStats[key][valStr] = (customStats[key][valStr] || 0) + 1;
                });
            }
        });

        return {
            summary: {
                total_calls: totalCalls,
                avg_duration_seconds: avgDuration,
                sentiment_breakdown: sentimentCounts
            },
            custom_analysis: customStats,
            charts: {
                daily_volume: dailySeries
            }
        };

    } catch (error) {
        console.error('Error computing Retell analytics:', error);
        // Return safe mock metrics
        return {
            summary: { total_calls: 0, avg_duration_seconds: 0, sentiment_breakdown: { positive: 0, neutral: 0, negative: 0, unknown: 0 } },
            charts: { daily_volume: [] }
        };
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                              TAVUS VIDEO API                               */
  /* -------------------------------------------------------------------------- */

  private getTavusHeaders() {
      return {
          'x-api-key': process.env.TAVUS_API_KEY || '',
          'Content-Type': 'application/json'
      };
  }

  async listTavusConversations(limit: number = 10): Promise<any[]> {
    try {
        // TAVUS API: GET https://api.tavus.io/v2/conversations
        if (!process.env.TAVUS_API_KEY) return this.getMockTavusConversations(limit);

        const response = await axios.get('https://api.tavus.io/v2/conversations', {
            headers: this.getTavusHeaders(),
            params: { limit }
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching Tavus conversations:', error);
        return this.getMockTavusConversations(limit);
    }
  }

  async getTavusConversation(conversationId: string): Promise<any | null> {
    try {
        // TAVUS API: GET https://api.tavus.io/v2/conversations/:id
        if (!process.env.TAVUS_API_KEY) return this.getMockTavusConversation(conversationId);

        const response = await axios.get(`https://api.tavus.io/v2/conversations/${conversationId}`, {
             headers: this.getTavusHeaders()
        });
        
        return response.data;
    } catch (error) {
        console.error(`Error fetching Tavus conversation ${conversationId}:`, error);
        return this.getMockTavusConversation(conversationId);
    }
  }

  // --- TAVUS MOCKS ---
  private getMockTavusConversations(limit: number) {
      return Array.from({ length: limit }).map((_, i) => ({
          conversation_id: `tavus_mock_${i}`,
          replica_id: 'r9fa0878977a',
          status: 'ended',
          created_at: new Date(Date.now() - i * 86400000).toISOString(),
          conversation_name: `Sales Call ${i+1}`,
          preview_image_url: "https://mintcdn.com/retellai/zL2HeUqUnagEN9eK/images/analytics-dashboard.png?fit=max&auto=format"
      }));
  }

  private getMockTavusConversation(id: string) {
      return {
          conversation_id: id,
          status: "ended",
          conversation_name: "Mock Sales Interaction",
          recording_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
          analysis: {
              user_appearance: "Young male, casual attire, brightly lit room.",
              behavior_engagement: "Maintains direct eye contact, frequent nodding, highly engaged.",
              emotional_state: "Calm, thoughtful, neutral-to-positive.",
              screen_activities: "None detected."
          }
      };
  }

  /* -------------------------------------------------------------------------- */
  /*                         MED SPA ANALYTICS (Supabase)                       */
  /* -------------------------------------------------------------------------- */

  /**
   * Get comprehensive analytics for a med spa client
   * Fetches from Supabase `calls` table where platform = 'tavus'
   */
  async getMedSpaAnalytics(clientId: string, days: number = 30) {
    try {
      const horizon = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

      const { data: calls, error } = await supabase
        .from('calls')
        .select('*')
        .eq('client_id', clientId)
        .eq('platform', 'tavus')
        .gte('started_at', horizon)
        .order('started_at', { ascending: false });

      if (error) {
        console.error('Error fetching med spa analytics:', error);
        return this.getEmptyMedSpaAnalytics();
      }

      if (!calls || calls.length === 0) {
        return this.getEmptyMedSpaAnalytics();
      }

      // Calculate metrics
      const totalCalls = calls.length;
      const totalDuration = calls.reduce((sum, c) => sum + (c.duration_seconds || 0), 0);
      const avgDuration = totalCalls > 0 ? Math.round(totalDuration / totalCalls) : 0;
      const totalMinutes = Math.round(totalDuration / 60);
      const totalHours = Math.round((totalDuration / 3600) * 10) / 10; // 1 decimal place

      // Sentiment breakdown
      const sentimentBreakdown = { positive: 0, neutral: 0, negative: 0 };
      calls.forEach(c => {
        const score = c.sentiment_score || 50;
        if (score >= 70) sentimentBreakdown.positive++;
        else if (score >= 40) sentimentBreakdown.neutral++;
        else sentimentBreakdown.negative++;
      });

      // Booking conversion rate
      const bookingsRequested = calls.filter(c =>
        c.metadata?.booking_requested || c.metadata?.consultation_booked
      ).length;
      const bookingRate = totalCalls > 0 ? Math.round((bookingsRequested / totalCalls) * 100) : 0;

      // Extract top concerns from metadata
      const concernCounts: Record<string, number> = {};
      calls.forEach(c => {
        const concerns = c.metadata?.concerns || [];
        concerns.forEach((concern: string) => {
          concernCounts[concern] = (concernCounts[concern] || 0) + 1;
        });
      });
      const topConcerns = Object.entries(concernCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([concern, count]) => ({ concern, count }));

      // Daily volume for chart
      const dailyVolume: Record<string, number> = {};
      calls.forEach(c => {
        const date = new Date(c.started_at).toISOString().split('T')[0];
        dailyVolume[date] = (dailyVolume[date] || 0) + 1;
      });
      const dailySeries = Object.entries(dailyVolume)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([date, count]) => ({ date, count }));

      // Peak hours
      const hourCounts: Record<number, number> = {};
      calls.forEach(c => {
        const hour = new Date(c.started_at).getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      });
      const peakHours = Object.entries(hourCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([hour, count]) => ({
          hour: parseInt(hour),
          count,
          label: `${parseInt(hour) > 12 ? parseInt(hour) - 12 : parseInt(hour)}${parseInt(hour) >= 12 ? 'PM' : 'AM'}`
        }));

      // Recent calls for list view
      const recentCalls = calls.slice(0, 10).map(c => ({
        id: c.call_id,
        date: c.started_at,
        duration: c.duration_seconds,
        summary: c.summary,
        sentiment: c.sentiment_score >= 70 ? 'positive' : c.sentiment_score >= 40 ? 'neutral' : 'negative',
        sentimentScore: c.sentiment_score,
        bookingRequested: c.metadata?.booking_requested || false,
        visitorName: c.metadata?.visitor_name,
        concerns: c.metadata?.concerns || []
      }));

      return {
        summary: {
          totalCalls,
          totalMinutes,
          totalHours,
          avgDurationSeconds: avgDuration,
          bookingRate,
          bookingsRequested,
          sentimentBreakdown
        },
        topConcerns,
        peakHours,
        charts: {
          dailyVolume: dailySeries
        },
        recentCalls
      };

    } catch (error) {
      console.error('Error computing med spa analytics:', error);
      return this.getEmptyMedSpaAnalytics();
    }
  }

  /**
   * Get a single call detail from Supabase
   */
  async getMedSpaCallDetail(callId: string) {
    try {
      const { data, error } = await supabase
        .from('calls')
        .select('*')
        .eq('call_id', callId)
        .eq('platform', 'tavus')
        .single();

      if (error || !data) {
        console.error('Error fetching call detail:', error);
        return null;
      }

      return {
        id: data.call_id,
        clientId: data.client_id,
        startedAt: data.started_at,
        endedAt: data.ended_at,
        duration: data.duration_seconds,
        summary: data.summary,
        sentiment: data.sentiment_score >= 70 ? 'positive' : data.sentiment_score >= 40 ? 'neutral' : 'negative',
        sentimentScore: data.sentiment_score,
        transcript: data.transcript,
        metadata: data.metadata,
        visitorName: data.metadata?.visitor_name,
        visitorPhone: data.metadata?.visitor_phone,
        visitorEmail: data.metadata?.visitor_email,
        bookingRequested: data.metadata?.booking_requested,
        concerns: data.metadata?.concerns || [],
        recordingUrl: data.metadata?.recording_url
      };

    } catch (error) {
      console.error('Error fetching med spa call detail:', error);
      return null;
    }
  }

  /**
   * List all calls for a client (paginated)
   */
  async listMedSpaCalls(clientId: string, page: number = 1, limit: number = 20) {
    try {
      const offset = (page - 1) * limit;

      const { data: calls, error, count } = await supabase
        .from('calls')
        .select('*', { count: 'exact' })
        .eq('client_id', clientId)
        .eq('platform', 'tavus')
        .order('started_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error listing med spa calls:', error);
        return { calls: [], total: 0, page, limit };
      }

      const formattedCalls = (calls || []).map(c => ({
        id: c.call_id,
        date: c.started_at,
        duration: c.duration_seconds,
        summary: c.summary,
        sentiment: c.sentiment_score >= 70 ? 'positive' : c.sentiment_score >= 40 ? 'neutral' : 'negative',
        sentimentScore: c.sentiment_score,
        bookingRequested: c.metadata?.booking_requested || false,
        visitorName: c.metadata?.visitor_name,
        concerns: c.metadata?.concerns || []
      }));

      return {
        calls: formattedCalls,
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit)
      };

    } catch (error) {
      console.error('Error listing med spa calls:', error);
      return { calls: [], total: 0, page, limit };
    }
  }

  private getEmptyMedSpaAnalytics() {
    return {
      summary: {
        totalCalls: 0,
        totalMinutes: 0,
        totalHours: 0,
        avgDurationSeconds: 0,
        bookingRate: 0,
        bookingsRequested: 0,
        sentimentBreakdown: { positive: 0, neutral: 0, negative: 0 }
      },
      topConcerns: [],
      peakHours: [],
      charts: {
        dailyVolume: []
      },
      recentCalls: []
    };
  }

  /**
   * Get usage/billing metrics for a client
   * Useful for tracking minutes consumed for billing purposes
   */
  async getUsageMetrics(clientId: string, startDate?: Date, endDate?: Date) {
    try {
      const start = startDate || new Date(new Date().getFullYear(), new Date().getMonth(), 1); // First of current month
      const end = endDate || new Date();

      const { data: calls, error } = await supabase
        .from('calls')
        .select('duration_seconds, started_at, platform')
        .eq('client_id', clientId)
        .gte('started_at', start.toISOString())
        .lte('started_at', end.toISOString());

      if (error || !calls) {
        console.error('Error fetching usage metrics:', error);
        return this.getEmptyUsageMetrics();
      }

      // Separate by platform
      const tavusCalls = calls.filter(c => c.platform === 'tavus');
      const retellCalls = calls.filter(c => c.platform === 'retell');

      const tavusSeconds = tavusCalls.reduce((sum, c) => sum + (c.duration_seconds || 0), 0);
      const retellSeconds = retellCalls.reduce((sum, c) => sum + (c.duration_seconds || 0), 0);
      const totalSeconds = tavusSeconds + retellSeconds;

      // Calculate daily breakdown for the period
      const dailyMinutes: Record<string, { tavus: number; retell: number; total: number }> = {};
      calls.forEach(c => {
        const date = new Date(c.started_at).toISOString().split('T')[0];
        if (!dailyMinutes[date]) {
          dailyMinutes[date] = { tavus: 0, retell: 0, total: 0 };
        }
        const mins = Math.round((c.duration_seconds || 0) / 60);
        if (c.platform === 'tavus') {
          dailyMinutes[date].tavus += mins;
        } else {
          dailyMinutes[date].retell += mins;
        }
        dailyMinutes[date].total += mins;
      });

      const dailyUsage = Object.entries(dailyMinutes)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([date, usage]) => ({ date, ...usage }));

      return {
        period: {
          start: start.toISOString(),
          end: end.toISOString()
        },
        totals: {
          calls: calls.length,
          seconds: totalSeconds,
          minutes: Math.round(totalSeconds / 60),
          hours: Math.round((totalSeconds / 3600) * 10) / 10
        },
        byPlatform: {
          tavus: {
            calls: tavusCalls.length,
            seconds: tavusSeconds,
            minutes: Math.round(tavusSeconds / 60),
            hours: Math.round((tavusSeconds / 3600) * 10) / 10
          },
          retell: {
            calls: retellCalls.length,
            seconds: retellSeconds,
            minutes: Math.round(retellSeconds / 60),
            hours: Math.round((retellSeconds / 3600) * 10) / 10
          }
        },
        dailyUsage
      };

    } catch (error) {
      console.error('Error computing usage metrics:', error);
      return this.getEmptyUsageMetrics();
    }
  }

  private getEmptyUsageMetrics() {
    return {
      period: { start: '', end: '' },
      totals: { calls: 0, seconds: 0, minutes: 0, hours: 0 },
      byPlatform: {
        tavus: { calls: 0, seconds: 0, minutes: 0, hours: 0 },
        retell: { calls: 0, seconds: 0, minutes: 0, hours: 0 }
      },
      dailyUsage: []
    };
  }
}
