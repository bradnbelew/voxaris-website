/**
 * Admin API React Query Hooks
 *
 * Provides typed hooks for all admin operations with
 * automatic caching, refetching, and error handling.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  adminApi,
  type Dealer,
  type DealerWithStats,
  type CreateDealerInput,
  type UpdateDealerInput,
  type SystemHealth,
  type DLQResult,
  type IntegrationTestResult,
  type MetricsData,
} from '@/lib/admin-api';

// ============================================
// QUERY KEYS
// ============================================

export const adminQueryKeys = {
  all: ['admin'] as const,
  health: () => [...adminQueryKeys.all, 'health'] as const,
  dealers: () => [...adminQueryKeys.all, 'dealers'] as const,
  dealersList: (params?: { limit?: number; offset?: number; search?: string; active?: boolean }) =>
    [...adminQueryKeys.dealers(), 'list', params] as const,
  dealerDetail: (id: string) => [...adminQueryKeys.dealers(), 'detail', id] as const,
  dlq: () => [...adminQueryKeys.all, 'dlq'] as const,
  dlqList: (params?: { limit?: number; offset?: number; queue?: string }) =>
    [...adminQueryKeys.dlq(), 'list', params] as const,
  metrics: (params: { start_date: string; end_date: string }) =>
    [...adminQueryKeys.all, 'metrics', params] as const,
};

// ============================================
// HEALTH HOOKS
// ============================================

export function useSystemHealth(options?: { refetchInterval?: number }) {
  return useQuery({
    queryKey: adminQueryKeys.health(),
    queryFn: () => adminApi.getHealth(),
    refetchInterval: options?.refetchInterval ?? 30000, // Refresh every 30s by default
    staleTime: 10000,
  });
}

// ============================================
// DEALER HOOKS
// ============================================

export function useDealers(params?: {
  limit?: number;
  offset?: number;
  search?: string;
  active?: boolean;
}) {
  return useQuery({
    queryKey: adminQueryKeys.dealersList(params),
    queryFn: () => adminApi.getDealers(params),
    staleTime: 30000,
  });
}

export function useDealer(id: string) {
  return useQuery({
    queryKey: adminQueryKeys.dealerDetail(id),
    queryFn: () => adminApi.getDealer(id),
    enabled: !!id,
    staleTime: 30000,
  });
}

export function useCreateDealer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDealerInput) => adminApi.createDealer(data),
    onSuccess: () => {
      // Invalidate dealers list to refetch
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.dealers() });
    },
  });
}

export function useUpdateDealer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDealerInput }) =>
      adminApi.updateDealer(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific dealer and list
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.dealerDetail(variables.id) });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.dealers() });
    },
  });
}

export function useDeleteDealer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminApi.deleteDealer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.dealers() });
    },
  });
}

export function useTestIntegrations() {
  return useMutation({
    mutationFn: (dealerId: string) => adminApi.testIntegrations(dealerId),
  });
}

// ============================================
// DLQ HOOKS
// ============================================

export function useDLQ(params?: { limit?: number; offset?: number; queue?: string }) {
  return useQuery({
    queryKey: adminQueryKeys.dlqList(params),
    queryFn: () => adminApi.getDLQ(params),
    refetchInterval: 60000, // Refresh every minute
    staleTime: 30000,
  });
}

export function useRetryJobs() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobIds, queue }: { jobIds: string[]; queue?: string }) =>
      adminApi.retryJobs(jobIds, queue),
    onSuccess: () => {
      // Invalidate DLQ and health to reflect changes
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.dlq() });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.health() });
    },
  });
}

// ============================================
// METRICS HOOKS
// ============================================

export function useMetrics(params: { start_date: string; end_date: string }) {
  return useQuery({
    queryKey: adminQueryKeys.metrics(params),
    queryFn: () => adminApi.getMetrics(params),
    enabled: !!params.start_date && !!params.end_date,
    staleTime: 60000, // Metrics don't change frequently
  });
}

// ============================================
// UTILITY HOOKS
// ============================================

/**
 * Prefetch dealer data for faster navigation
 */
export function usePrefetchDealer() {
  const queryClient = useQueryClient();

  return (dealerId: string) => {
    queryClient.prefetchQuery({
      queryKey: adminQueryKeys.dealerDetail(dealerId),
      queryFn: () => adminApi.getDealer(dealerId),
      staleTime: 30000,
    });
  };
}

/**
 * Get health status color
 */
export function getHealthStatusColor(status: SystemHealth['status']): string {
  switch (status) {
    case 'healthy':
      return 'text-green-400';
    case 'degraded':
      return 'text-yellow-400';
    case 'down':
      return 'text-red-400';
    default:
      return 'text-gray-400';
  }
}

/**
 * Format queue stats for display
 */
export function formatQueueStats(queue: {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
}) {
  return {
    ...queue,
    total: queue.waiting + queue.active + queue.completed + queue.failed,
    successRate:
      queue.completed + queue.failed > 0
        ? Math.round((queue.completed / (queue.completed + queue.failed)) * 100)
        : 100,
  };
}
