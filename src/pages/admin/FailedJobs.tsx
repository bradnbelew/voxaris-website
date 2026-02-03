import { useState } from 'react';
import { useDLQ, useRetryJobs } from '@/hooks/useAdminApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import {
  RefreshCcw,
  AlertTriangle,
  RotateCcw,
  ChevronDown,
  ChevronRight,
  Inbox,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

export default function FailedJobs() {
  const { toast } = useToast();
  const [selectedJobs, setSelectedJobs] = useState<Set<string>>(new Set());
  const [expandedJobs, setExpandedJobs] = useState<Set<string>>(new Set());

  const { data, isLoading, refetch } = useDLQ({ limit: 50 });
  const retryJobs = useRetryJobs();

  const toggleJob = (jobId: string) => {
    const newSelected = new Set(selectedJobs);
    if (newSelected.has(jobId)) {
      newSelected.delete(jobId);
    } else {
      newSelected.add(jobId);
    }
    setSelectedJobs(newSelected);
  };

  const toggleExpand = (jobId: string) => {
    const newExpanded = new Set(expandedJobs);
    if (newExpanded.has(jobId)) {
      newExpanded.delete(jobId);
    } else {
      newExpanded.add(jobId);
    }
    setExpandedJobs(newExpanded);
  };

  const selectAll = () => {
    if (selectedJobs.size === data?.jobs.length) {
      setSelectedJobs(new Set());
    } else {
      setSelectedJobs(new Set(data?.jobs.map((j) => j.id) ?? []));
    }
  };

  const handleRetry = async (jobIds?: string[]) => {
    const idsToRetry = jobIds ?? Array.from(selectedJobs);
    if (idsToRetry.length === 0) {
      toast({ title: 'No jobs selected', description: 'Select jobs to retry', variant: 'destructive' });
      return;
    }

    try {
      const result = await retryJobs.mutateAsync({ jobIds: idsToRetry });
      toast({
        title: 'Retry Complete',
        description: `${result.retried.length} retried, ${result.failed.length} failed`,
      });
      setSelectedJobs(new Set());
      refetch();
    } catch (error: any) {
      toast({ title: 'Retry Failed', description: error.message, variant: 'destructive' });
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Failed Jobs</h1>
          <p className="text-gray-400 mt-1">Dead Letter Queue - jobs that failed after max retries</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} className="border-gray-700">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          {selectedJobs.size > 0 && (
            <Button
              onClick={() => handleRetry()}
              disabled={retryJobs.isPending}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              {retryJobs.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RotateCcw className="h-4 w-4 mr-2" />
              )}
              Retry {selectedJobs.size} Job{selectedJobs.size > 1 ? 's' : ''}
            </Button>
          )}
        </div>
      </div>

      {/* Queue Summary */}
      {data && data.counts.total > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(data.counts)
            .filter(([key]) => key !== 'total')
            .map(([queue, count]) => (
              <Card key={queue} className="bg-gray-900/50 border-gray-800">
                <CardContent className="pt-4">
                  <p className="text-sm text-gray-400">{queue}</p>
                  <p className="text-2xl font-bold text-red-400">{count}</p>
                </CardContent>
              </Card>
            ))}
          <Card className="bg-red-500/10 border-red-500/30">
            <CardContent className="pt-4">
              <p className="text-sm text-red-400">Total Failed</p>
              <p className="text-2xl font-bold text-red-400">{data.counts.total}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Jobs Table */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="text-center text-gray-400 py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
              Loading failed jobs...
            </div>
          ) : data?.jobs.length === 0 ? (
            <div className="text-center py-16">
              <CheckCircle2 className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">All Clear!</h3>
              <p className="text-gray-400">No failed jobs in the queue</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800 hover:bg-transparent">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedJobs.size === data?.jobs.length && data?.jobs.length > 0}
                      onCheckedChange={selectAll}
                    />
                  </TableHead>
                  <TableHead className="text-gray-400">Job</TableHead>
                  <TableHead className="text-gray-400">Queue</TableHead>
                  <TableHead className="text-gray-400">Dealer</TableHead>
                  <TableHead className="text-gray-400">Attempts</TableHead>
                  <TableHead className="text-gray-400">Failed At</TableHead>
                  <TableHead className="text-gray-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.jobs.map((job) => (
                  <Collapsible key={job.id} open={expandedJobs.has(job.id)}>
                    <TableRow className="border-gray-800 hover:bg-gray-800/50">
                      <TableCell>
                        <Checkbox
                          checked={selectedJobs.has(job.id)}
                          onCheckedChange={() => toggleJob(job.id)}
                          disabled={!job.can_retry}
                        />
                      </TableCell>
                      <TableCell>
                        <CollapsibleTrigger
                          className="flex items-center gap-2 cursor-pointer"
                          onClick={() => toggleExpand(job.id)}
                        >
                          {expandedJobs.has(job.id) ? (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-500" />
                          )}
                          <div>
                            <p className="font-medium text-white">{job.type}</p>
                            <p className="text-xs text-gray-500 font-mono">{job.id.slice(0, 20)}...</p>
                          </div>
                        </CollapsibleTrigger>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{job.queue}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-300">{job.dealer_name || 'Unknown'}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{job.attempts} attempts</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-400">{formatDate(job.failed_at)}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRetry([job.id])}
                          disabled={!job.can_retry || retryJobs.isPending}
                        >
                          <RotateCcw className="h-4 w-4 mr-1" />
                          Retry
                        </Button>
                      </TableCell>
                    </TableRow>
                    <CollapsibleContent asChild>
                      <TableRow className="border-gray-800 bg-gray-800/30">
                        <TableCell colSpan={7} className="py-4">
                          <div className="space-y-3 px-6">
                            <div>
                              <p className="text-sm font-medium text-red-400 mb-1">Error:</p>
                              <pre className="text-sm text-gray-300 bg-gray-900 p-3 rounded overflow-x-auto">
                                {job.error}
                              </pre>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-400 mb-1">Job Data:</p>
                              <pre className="text-xs text-gray-400 bg-gray-900 p-3 rounded overflow-x-auto max-h-40">
                                {JSON.stringify(job.data, null, 2)}
                              </pre>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
