import { useNavigate } from 'react-router-dom';
import { useSystemHealth, useDealers, useDLQ, getHealthStatusColor, formatQueueStats } from '@/hooks/useAdminApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Activity,
  Building2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCcw,
  Plus,
  ArrowRight,
  Server,
  Database,
  Zap,
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { data: health, isLoading: healthLoading, refetch: refetchHealth } = useSystemHealth();
  const { data: dealersData, isLoading: dealersLoading } = useDealers({ limit: 5 });
  const { data: dlqData, isLoading: dlqLoading } = useDLQ({ limit: 5 });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'connected':
      case 'ok':
        return <CheckCircle2 className="h-5 w-5 text-green-400" />;
      case 'degraded':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'down':
      case 'disconnected':
      case 'error':
        return <XCircle className="h-5 w-5 text-red-400" />;
      default:
        return <Activity className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400 mt-1">System overview and quick actions</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetchHealth()}
          className="border-gray-700"
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* System Status Banner */}
      {health && (
        <Card className={`border-l-4 ${
          health.status === 'healthy' ? 'border-l-green-500 bg-green-500/10' :
          health.status === 'degraded' ? 'border-l-yellow-500 bg-yellow-500/10' :
          'border-l-red-500 bg-red-500/10'
        }`}>
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              {getStatusIcon(health.status)}
              <div>
                <p className={`font-semibold ${getHealthStatusColor(health.status)}`}>
                  System {health.status.charAt(0).toUpperCase() + health.status.slice(1)}
                </p>
                <p className="text-sm text-gray-400">
                  Uptime: {Math.floor(health.uptime_seconds / 3600)}h {Math.floor((health.uptime_seconds % 3600) / 60)}m
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard/admin/health')}
            >
              View Details
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Dealers */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Dealers</CardTitle>
            <Building2 className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {dealersLoading ? '...' : dealersData?.pagination.total ?? 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Active accounts</p>
          </CardContent>
        </Card>

        {/* Queue Status */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Active Jobs</CardTitle>
            <Zap className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {healthLoading ? '...' :
                Object.values(health?.queues ?? {}).reduce((sum, q) => sum + (q?.active ?? 0), 0)
              }
            </div>
            <p className="text-xs text-gray-500 mt-1">Processing now</p>
          </CardContent>
        </Card>

        {/* Failed Jobs */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Failed Jobs</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {dlqLoading ? '...' : dlqData?.counts.total ?? 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {(dlqData?.counts.total ?? 0) > 0 ? 'Needs attention' : 'All clear'}
            </p>
          </CardContent>
        </Card>

        {/* Database Status */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Database</CardTitle>
            <Database className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {healthLoading ? '...' : `${health?.database.response_time_ms ?? 0}ms`}
            </div>
            <p className="text-xs text-gray-500 mt-1">Response time</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Queue Status */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Queue Status</CardTitle>
                <CardDescription>Processing pipeline health</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard/admin/health')}
              >
                <Server className="h-4 w-4 mr-2" />
                Details
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {health?.queues && Object.entries(health.queues).map(([name, stats]) => {
              const formatted = formatQueueStats(stats);
              return (
                <div key={name} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                  <div>
                    <p className="text-sm font-medium text-white">{name}</p>
                    <p className="text-xs text-gray-400">
                      {formatted.waiting} waiting · {formatted.active} active
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {formatted.failed > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {formatted.failed} failed
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {formatted.successRate}% success
                    </Badge>
                  </div>
                </div>
              );
            })}
            {healthLoading && (
              <div className="text-center text-gray-400 py-4">Loading...</div>
            )}
          </CardContent>
        </Card>

        {/* Recent Dealers */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Recent Dealers</CardTitle>
                <CardDescription>Latest dealer accounts</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard/admin/dealers')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Dealer
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {dealersData?.dealers.slice(0, 5).map((dealer) => (
              <div
                key={dealer.id}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 cursor-pointer hover:bg-gray-800 transition-colors"
                onClick={() => navigate(`/dashboard/admin/dealers/${dealer.id}`)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${dealer.active ? 'bg-green-400' : 'bg-gray-500'}`} />
                  <div>
                    <p className="text-sm font-medium text-white">{dealer.business_name}</p>
                    <p className="text-xs text-gray-400">{dealer.contact_email || 'No email'}</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-500" />
              </div>
            ))}
            {dealersLoading && (
              <div className="text-center text-gray-400 py-4">Loading...</div>
            )}
            {!dealersLoading && dealersData?.dealers.length === 0 && (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No dealers yet</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => navigate('/dashboard/admin/dealers')}
                >
                  Add First Dealer
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Failed Jobs Alert */}
      {dlqData && dlqData.counts.total > 0 && (
        <Card className="bg-red-500/10 border-red-500/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <div>
                  <CardTitle className="text-red-400">Failed Jobs Detected</CardTitle>
                  <CardDescription>{dlqData.counts.total} jobs need attention</CardDescription>
                </div>
              </div>
              <Button
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                onClick={() => navigate('/dashboard/admin/dlq')}
              >
                View & Retry
              </Button>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button
          variant="outline"
          className="h-auto py-4 flex flex-col items-center gap-2 border-gray-700 hover:border-cyan-500/50"
          onClick={() => navigate('/dashboard/admin/dealers')}
        >
          <Building2 className="h-5 w-5 text-cyan-400" />
          <span>Manage Dealers</span>
        </Button>
        <Button
          variant="outline"
          className="h-auto py-4 flex flex-col items-center gap-2 border-gray-700 hover:border-green-500/50"
          onClick={() => navigate('/dashboard/admin/health')}
        >
          <Activity className="h-5 w-5 text-green-400" />
          <span>System Health</span>
        </Button>
        <Button
          variant="outline"
          className="h-auto py-4 flex flex-col items-center gap-2 border-gray-700 hover:border-yellow-500/50"
          onClick={() => navigate('/dashboard/admin/dlq')}
        >
          <AlertTriangle className="h-5 w-5 text-yellow-400" />
          <span>Failed Jobs</span>
        </Button>
        <Button
          variant="outline"
          className="h-auto py-4 flex flex-col items-center gap-2 border-gray-700 hover:border-purple-500/50"
          onClick={() => navigate('/dashboard/admin/analytics')}
        >
          <Zap className="h-5 w-5 text-purple-400" />
          <span>Analytics</span>
        </Button>
      </div>
    </div>
  );
}
