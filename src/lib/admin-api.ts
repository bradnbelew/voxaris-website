/**
 * Admin API Client
 *
 * Provides typed access to the Voxaris Admin API endpoints
 * for dealer management, system health, and analytics.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'https://pinho-law-backend.onrender.com';
const ADMIN_API_KEY = import.meta.env.VITE_ADMIN_API_KEY || '';

// ============================================
// TYPES
// ============================================

export interface Dealer {
  id: string;
  business_name: string;
  contact_email?: string;
  contact_phone?: string;
  tavus_persona_id?: string;
  retell_agent_id?: string;
  ghl_location_id?: string;
  system_prompt?: string;
  greeting_message?: string;
  timezone?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DealerWithStats extends Dealer {
  stats?: {
    total_calls: number;
    calls_today: number;
    appointments_booked: number;
  };
}

export interface CreateDealerInput {
  name: string;
  contact_email?: string;
  contact_phone?: string;
  ghl_location_id?: string;
  ghl_api_key?: string;
  system_prompt?: string;
  greeting_message?: string;
  timezone?: string;
}

export interface UpdateDealerInput {
  business_name?: string;
  contact_email?: string;
  contact_phone?: string;
  system_prompt?: string;
  greeting_message?: string;
  timezone?: string;
  active?: boolean;
}

export interface QueueStatus {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down';
  timestamp: string;
  queues: {
    'tavus-webhooks': QueueStatus;
    'retell-webhooks': QueueStatus;
    'ghl-sync': QueueStatus;
  };
  redis: {
    status: 'connected' | 'disconnected';
    memory_used_mb: number | null;
  };
  database: {
    status: 'connected' | 'error';
    response_time_ms: number;
  };
  uptime_seconds: number;
}

export interface FailedJob {
  id: string;
  queue: string;
  dealer_id?: string;
  dealer_name?: string;
  type: string;
  data: Record<string, any>;
  error: string;
  attempts: number;
  failed_at: string;
  can_retry: boolean;
}

export interface DLQResult {
  jobs: FailedJob[];
  counts: {
    [key: string]: number;
    total: number;
  };
  pagination: {
    limit: number;
    offset: number;
    has_more: boolean;
  };
}

export interface IntegrationTestResult {
  tavus?: {
    status: 'ok' | 'error';
    response_time_ms: number;
    persona_name?: string;
    error?: string;
  };
  retell?: {
    status: 'ok' | 'error';
    response_time_ms: number;
    agent_name?: string;
    error?: string;
  };
  ghl?: {
    status: 'ok' | 'error';
    response_time_ms: number;
    error?: string;
  };
}

export interface MetricsData {
  period: {
    start: string;
    end: string;
  };
  conversations: {
    total: number;
    by_platform: {
      tavus: number;
      retell: number;
    };
    by_outcome: Record<string, number>;
  };
  dealers: {
    active: number;
    total_conversations: Array<{
      dealer_id: string;
      name: string;
      count: number;
    }>;
  };
  performance: {
    avg_processing_time_ms: number;
    error_rate_percent: number;
    queue_throughput_per_hour: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

// ============================================
// API CLIENT
// ============================================

class AdminApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'AdminApiError';
  }
}

async function adminFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${ADMIN_API_KEY}`,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  const data = await response.json();

  if (!response.ok || data.success === false) {
    throw new AdminApiError(
      data.error || 'API request failed',
      response.status,
      data.code
    );
  }

  return data.data || data;
}

// ============================================
// EXPORTED API METHODS
// ============================================

export const adminApi = {
  // Health & Status
  getHealth: (): Promise<SystemHealth> =>
    adminFetch('/api/admin/health'),

  // Dealers
  getDealers: (params?: {
    limit?: number;
    offset?: number;
    search?: string;
    active?: boolean;
  }): Promise<{ dealers: DealerWithStats[]; pagination: { total: number; limit: number; offset: number; has_more: boolean } }> => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.offset) searchParams.set('offset', String(params.offset));
    if (params?.search) searchParams.set('search', params.search);
    if (params?.active !== undefined) searchParams.set('active', String(params.active));
    const query = searchParams.toString();
    return adminFetch(`/api/admin/dealers${query ? `?${query}` : ''}`);
  },

  getDealer: (id: string): Promise<DealerWithStats> =>
    adminFetch(`/api/admin/dealers/${id}`),

  createDealer: (data: CreateDealerInput): Promise<Dealer> =>
    adminFetch('/api/admin/dealers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateDealer: (id: string, data: UpdateDealerInput): Promise<Dealer> =>
    adminFetch(`/api/admin/dealers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteDealer: (id: string): Promise<{ message: string }> =>
    adminFetch(`/api/admin/dealers/${id}`, {
      method: 'DELETE',
    }),

  testIntegrations: (id: string): Promise<IntegrationTestResult> =>
    adminFetch(`/api/admin/dealers/${id}/test-integrations`, {
      method: 'POST',
    }),

  // Dead Letter Queue
  getDLQ: (params?: {
    limit?: number;
    offset?: number;
    queue?: string;
  }): Promise<DLQResult> => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.offset) searchParams.set('offset', String(params.offset));
    if (params?.queue) searchParams.set('queue', params.queue);
    const query = searchParams.toString();
    return adminFetch(`/api/admin/dlq${query ? `?${query}` : ''}`);
  },

  retryJobs: (jobIds: string[], queue?: string): Promise<{
    retried: string[];
    failed: string[];
    errors: Record<string, string>;
  }> =>
    adminFetch('/api/admin/dlq/retry', {
      method: 'POST',
      body: JSON.stringify({ job_ids: jobIds, queue }),
    }),

  // Metrics & Analytics
  getMetrics: (params: {
    start_date: string;
    end_date: string;
  }): Promise<MetricsData> => {
    const searchParams = new URLSearchParams({
      start_date: params.start_date,
      end_date: params.end_date,
    });
    return adminFetch(`/api/admin/metrics?${searchParams.toString()}`);
  },
};

export default adminApi;
