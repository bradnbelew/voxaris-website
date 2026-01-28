import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  MessageSquare,
  Phone,
  Video,
  Calendar,
  CheckCircle,
  XCircle,
  User,
  DollarSign,
} from 'lucide-react';
import { Activity } from '../../types/dashboard.types';

interface LiveActivityFeedProps {
  events: Activity[];
  maxHeight?: string;
}

const LiveActivityFeed: React.FC<LiveActivityFeedProps> = ({
  events,
  maxHeight = '400px',
}) => {
  const getActivityIcon = (type: Activity['type'], channel: Activity['channel']) => {
    const iconClass = 'w-4 h-4';

    switch (type) {
      case 'qr_scan':
        return <User className={`${iconClass} text-blue-500`} />;
      case 'conversation_started':
      case 'conversation_ended':
        if (channel === 'tavus')
          return <Video className={`${iconClass} text-purple-500`} />;
        if (channel === 'retell' || channel === 'ghl_voice')
          return <Phone className={`${iconClass} text-green-500`} />;
        return <MessageSquare className={`${iconClass} text-blue-500`} />;
      case 'appointment_booked':
        return <Calendar className={`${iconClass} text-indigo-500`} />;
      case 'appointment_showed':
        return <CheckCircle className={`${iconClass} text-green-500`} />;
      case 'appointment_no_show':
        return <XCircle className={`${iconClass} text-red-500`} />;
      case 'deal_closed':
        return <DollarSign className={`${iconClass} text-green-500`} />;
      case 'deal_lost':
        return <XCircle className={`${iconClass} text-gray-500`} />;
      default:
        return <MessageSquare className={`${iconClass} text-gray-500`} />;
    }
  };

  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case 'qr_scan':
        return 'scanned QR code';
      case 'conversation_started':
        return `started ${activity.channel === 'tavus' ? 'video' : 'voice'} call`;
      case 'conversation_ended':
        return `completed ${activity.channel === 'tavus' ? 'video' : 'voice'} call`;
      case 'appointment_booked':
        return `booked appointment${
          activity.metadata?.appointmentTime
            ? ` for ${activity.metadata.appointmentTime}`
            : ''
        }`;
      case 'appointment_showed':
        return 'showed up for appointment';
      case 'appointment_no_show':
        return 'missed appointment';
      case 'deal_closed':
        return `closed deal${
          activity.metadata?.dealValue
            ? ` - $${activity.metadata.dealValue.toLocaleString()}`
            : ''
        }`;
      case 'deal_lost':
        return 'deal lost';
      default:
        return activity.type.replace(/_/g, ' ');
    }
  };

  const getChannelBadge = (channel: Activity['channel']) => {
    const badges: Record<string, { label: string; color: string }> = {
      tavus: { label: 'Video', color: 'bg-purple-100 text-purple-700' },
      retell: { label: 'Retell', color: 'bg-green-100 text-green-700' },
      ghl_voice: { label: 'Voice AI', color: 'bg-blue-100 text-blue-700' },
      ghl_chat: { label: 'Chat', color: 'bg-gray-100 text-gray-700' },
      manual: { label: 'Manual', color: 'bg-gray-100 text-gray-700' },
    };

    const badge = badges[channel] || badges.manual;

    return (
      <span className={`text-xs px-2 py-0.5 rounded-full ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  const getActivityBgColor = (type: Activity['type']) => {
    switch (type) {
      case 'deal_closed':
        return 'bg-green-50';
      case 'appointment_booked':
        return 'bg-indigo-50';
      case 'appointment_no_show':
      case 'deal_lost':
        return 'bg-red-50';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Live Activity</h3>
        <span className="flex items-center gap-2 text-sm text-green-600">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Live
        </span>
      </div>

      <div
        className="overflow-y-auto"
        style={{ maxHeight }}
      >
        {events.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No activity yet</p>
            <p className="text-sm">Waiting for events...</p>
          </div>
        ) : (
          <div className="divide-y">
            {events.map((activity) => (
              <div
                key={activity.id}
                className={`p-4 hover:bg-gray-50 transition-colors ${getActivityBgColor(
                  activity.type
                )}`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getActivityIcon(activity.type, activity.channel)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-gray-900 truncate">
                        {activity.contactName}
                      </span>
                      {getChannelBadge(activity.channel)}
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {getActivityText(activity)}
                    </p>
                    {activity.vehicle && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {activity.vehicle}
                      </p>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 whitespace-nowrap">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveActivityFeed;
