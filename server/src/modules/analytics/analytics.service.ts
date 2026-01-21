import axios from 'axios';

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
}
