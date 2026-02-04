// src/components/medspa/RecentCallsTable.tsx
import { useState } from 'react';
import { Clock, Calendar, MessageCircle, ChevronDown, ChevronUp, CheckCircle, XCircle } from 'lucide-react';
import { MedSpaCall } from '../../api/medSpaApi';

interface RecentCallsTableProps {
  calls?: MedSpaCall[];
  isLoading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export function RecentCallsTable({ calls, isLoading, onLoadMore, hasMore }: RecentCallsTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getSentimentColor = (label: string | null): string => {
    switch (label?.toLowerCase()) {
      case 'positive':
        return 'text-emerald-400 bg-emerald-400/10';
      case 'negative':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-amber-400 bg-amber-400/10';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#0A1628] border border-[#1E3A5F]/30 rounded-xl p-6">
        <div className="h-6 bg-[#1E3A5F] rounded w-1/4 mb-6 animate-pulse" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-[#1E3A5F]/50 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!calls || calls.length === 0) {
    return (
      <div className="bg-[#0A1628] border border-[#1E3A5F]/30 rounded-xl p-6">
        <h3 className="text-white font-semibold text-lg mb-4">Recent Consultations</h3>
        <div className="h-48 flex items-center justify-center text-gray-500">
          No consultations yet
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0A1628] border border-[#1E3A5F]/30 rounded-xl p-6">
      <h3 className="text-white font-semibold text-lg mb-4">Recent Consultations</h3>
      <div className="space-y-3">
        {calls.map((call) => (
          <div
            key={call.call_id}
            className="border border-[#1E3A5F]/30 rounded-lg overflow-hidden hover:border-[#1E3A5F]/60 transition-colors"
          >
            {/* Main Row */}
            <div
              className="p-4 cursor-pointer flex items-center justify-between"
              onClick={() => setExpandedId(expandedId === call.call_id ? null : call.call_id)}
            >
              <div className="flex items-center gap-6">
                {/* Date & Time */}
                <div className="min-w-[100px]">
                  <div className="flex items-center gap-2 text-white">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{formatDate(call.started_at)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-xs mt-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(call.started_at)}</span>
                  </div>
                </div>

                {/* Duration */}
                <div className="min-w-[60px]">
                  <div className="text-cyan-400 font-mono text-sm">
                    {formatDuration(call.duration_seconds)}
                  </div>
                  <div className="text-gray-500 text-xs">duration</div>
                </div>

                {/* Sentiment */}
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getSentimentColor(call.sentiment_label)}`}>
                  {call.sentiment_label || 'Unknown'}
                </div>

                {/* Booking Status */}
                <div className="flex items-center gap-2">
                  {call.booking_requested ? (
                    <div className="flex items-center gap-1 text-emerald-400 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Booking Requested</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <XCircle className="w-4 h-4" />
                      <span>No Booking</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Expand Toggle */}
              <div className="text-gray-500">
                {expandedId === call.call_id ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </div>
            </div>

            {/* Expanded Details */}
            {expandedId === call.call_id && (
              <div className="px-4 pb-4 pt-2 border-t border-[#1E3A5F]/30 bg-[#0A1628]/50">
                {/* Summary */}
                {call.summary && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                      <MessageCircle className="w-4 h-4" />
                      <span>Conversation Summary</span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {call.summary}
                    </p>
                  </div>
                )}

                {/* Concerns */}
                {call.concerns && call.concerns.length > 0 && (
                  <div>
                    <div className="text-gray-400 text-sm mb-2">Areas Discussed:</div>
                    <div className="flex flex-wrap gap-2">
                      {call.concerns.map((concern, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-[#1E3A5F]/30 border border-[#1E3A5F]/50 rounded-full text-sm text-gray-300"
                        >
                          {concern}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sentiment Score */}
                {call.sentiment_score !== null && (
                  <div className="mt-3 text-gray-500 text-xs">
                    Sentiment Score: {call.sentiment_score}/100
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="mt-4 text-center">
          <button
            onClick={onLoadMore}
            className="px-6 py-2 text-sm text-cyan-400 border border-cyan-400/30 rounded-lg hover:bg-cyan-400/10 transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

export default RecentCallsTable;
