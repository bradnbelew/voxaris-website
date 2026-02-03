import { useSystemHealth, getHealthStatusColor, formatQueueStats } from '@/hooks/useAdminApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  RefreshCcw,
  Server,
  Database,
  Wifi,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Zap,
  Activity,
} from 'lucide-react';

export default function SystemHealth() {
  const { data: health, isLoading, refetch, dataUpdatedAt } = useSystemHealth({ refetchInterval: 10000 });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'connected':
        return <CheckCircle2 className="h-5 w-5 text-green-400" />;
      case 'degraded':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      default:
        return <XCircle className="h-5 w-5 text-red-400" />;
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">System Health</h1>
          <p className="text-gray-400 mt-1">Monitor infrastructure and queue status</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            Last updated: {dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : 'Never'}
          </span>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="border-gray-700">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overall Status */}
      {health && (
        <Card className={`border-2 ${
          health.status === 'healthy' ? 'border-green-500/50 bg-green-500/10' :
          health.status === 'degraded' ? 'border-yellow-500/50 bg-yellow-500/10' :
          'border-red-500/50 bg-red-500/10'
        }`}>
          <CardContent className="flex items-center justify-between py-6">
            <div className="flex items-center gap-4">
              {getStatusIcon(health.status)}
              <div>
                <h2 className={`text-2xl font-bold ${getHealthStatusColor(health.status)}`}>
                  System {health.status.charAt(0).toUpperCase() + health.status.slice(1)}
                </h2>
                <p className="text-gray-400">All services operational</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{formatUptime(health.uptime_seconds)}</p>
                <p className="text-sm text-gray-400">Uptime</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{health.database.response_time_ms}ms</p>
                <p className="text-sm text-gray-400">DB Latency</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Infrastructure Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Redis */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Redis</CardTitle>
            <Wifi className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xl font-bold ${
                  health?.redis.status === 'connected' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {health?.redis.status === 'connected' ? 'Connected' : 'Disconnected'}
                </p>
                {health?.redis.memory_used_mb && (
                  <p className="text-sm text-gray-400">
                    {health.redis.memory_used_mb.toFixed(1)} MB used
                  </p>
                )}
              </div>
              {getStatusIcon(health?.redis.status ?? 'disconnected')}
            </div>
          </CardContent>
        </Card>

        {/* Database */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Database</CardTitle>
            <Database className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xl font-bold ${
                  health?.database.status === 'connected' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {health?.database.status === 'connected' ? 'Connected' : 'Error'}
                </p>
                <p className="text-sm text-gray-400">
                  {health?.database.response_time_ms ?? 0}ms response
                </p>
              </div>
              {getStatusIcon(health?.database.status ?? 'error')}
            </div>
          </CardContent>
        </Card>

        {/* Server */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Server</CardTitle>
            <Server className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-bold text-green-400">Running</p>
                <p className="text-sm text-gray-400">
                  {formatUptime(health?.uptime_seconds ?? 0)} uptime
                </p>
              </div>
              <CheckCircle2 className="h-5 w-5 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Queue Status */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-400" />
            Queue Status
          </CardTitle>
          <CardDescription>Job processing pipeline health</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {health?.queues && Object.entries(health.queues).map(([name, stats]) => {
            const formatted = formatQueueStats(stats);
            const total = formatted.total || 1;

            return (
              <div key={name} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-white">{name}</h4>
                    <p className="text-sm text-gray-400">
                      {formatted.completed.toLocaleString()} processed
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {formatted.failed > 0 && (
                      <Badge variant="destructive">{formatted.failed} failed</Badge>
                    )}
                    <Badge variant="outline">{formatted.successRate}% success</Badge>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-yellow-400">{formatted.waiting}</p>
                    <p className="text-xs text-gray-400">Waiting</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-blue-400">{formatted.active}</p>
                    <p className="text-xs text-gray-400">Active</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-green-400">{formatted.completed}</p>
                    <p className="text-xs text-gray-400">Completed</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-red-400">{formatted.failed}</p>
                    <p className="text-xs text-gray-400">Failed</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex h-2 rounded-full overflow-hidden bg-gray-800">
                    <div
                      className="bg-green-500"
                      style={{ width: `${(formatted.completed / (formatted.completed + formatted.failed || 1)) * 100}%` }}
                    />
                    <div
                      className="bg-red-500"
                      style={{ width: `${(formatted.failed / (formatted.completed + formatted.failed || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="text-center text-gray-400 py-8">
              <Activity className="h-8 w-8 animate-pulse mx-auto mb-2" />
              Loading queue status...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
