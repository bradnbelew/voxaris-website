// src/hooks/useDashboardData.ts

import { useState, useEffect, useCallback } from 'react';
import { dashboardApi } from '../api/dashboardApi';
import { DashboardData, DashboardFilters } from '../types/dashboard.types';

interface UseDashboardDataResult {
  data: DashboardData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useDashboardData(filters: DashboardFilters): UseDashboardDataResult {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await dashboardApi.getDashboard(filters);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch dashboard data'));
    } finally {
      setIsLoading(false);
    }
  }, [filters.locationId, filters.campaignId, filters.startDate.getTime(), filters.endDate.getTime()]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

// src/hooks/useRealtimeUpdates.ts

import { useEffect, useState, useCallback, useRef } from 'react';
import { Activity } from '../types/dashboard.types';

interface UseRealtimeUpdatesResult {
  events: Activity[];
  isConnected: boolean;
  clearEvents: () => void;
}

export function useRealtimeUpdates(locationId: string): UseRealtimeUpdatesResult {
  const [events, setEvents] = useState<Activity[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const reconnectAttempts = useRef(0);

  const connect = useCallback(() => {
    const wsUrl = import.meta.env.VITE_WS_URL || 'wss://api.voxaris.io';
    const token = localStorage.getItem('voxaris_token') || 
                  new URLSearchParams(window.location.search).get('token');
    
    const ws = new WebSocket(`${wsUrl}/ws?locationId=${locationId}&token=${token}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      reconnectAttempts.current = 0;
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        const activity: Activity = {
          id: data.id || crypto.randomUUID(),
          type: data.type,
          channel: data.channel || data.source,
          contactName: data.contactName || data.data?.contactName || 'Unknown',
          contactId: data.contactId || data.data?.contactId,
          vehicle: data.vehicle || data.data?.vehicle,
          timestamp: new Date(data.timestamp || Date.now()),
          metadata: data.data || data.metadata,
        };
        
        setEvents(prev => [activity, ...prev].slice(0, 100));
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
      }
    };

    ws.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason);
      setIsConnected(false);
      
      // Exponential backoff for reconnection
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
      reconnectAttempts.current++;
      
      reconnectTimeoutRef.current = setTimeout(() => {
        console.log(`Attempting to reconnect (attempt ${reconnectAttempts.current})...`);
        connect();
      }, delay);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }, [locationId]);

  useEffect(() => {
    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmounting');
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect]);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  return { events, isConnected, clearEvents };
}

// src/hooks/usePolling.ts
// Fallback for environments without WebSocket support

import { useEffect, useRef, useCallback } from 'react';

export function usePolling(
  callback: () => Promise<void>,
  interval: number = 30000,
  enabled: boolean = true
) {
  const savedCallback = useRef(callback);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const startPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      savedCallback.current();
    }, interval);
  }, [interval]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      // Initial fetch
      savedCallback.current();
      startPolling();
    } else {
      stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, [enabled, startPolling, stopPolling]);

  return { startPolling, stopPolling };
}
