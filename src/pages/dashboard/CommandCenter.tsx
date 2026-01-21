import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Video, Clock, Calendar, UserPlus, TrendingUp, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import type { Agent } from '@/types/database';

export default function CommandCenter() {
  const { profile } = useAuthContext();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAgents() {
      if (!profile?.dealership_id) {
        setIsLoading(false);
        return;
      }

      const { data } = await supabase
        .from('agents')
        .select('*')
        .eq('dealership_id', profile.dealership_id);

      setAgents((data as Agent[]) || []);
      setIsLoading(false);
    }

    fetchAgents();
  }, [profile?.dealership_id]);

  const activeAgents = agents.filter(a => a.status === 'active');
  const voiceAgents = activeAgents.filter(a => a.type === 'voice');
  const videoAgents = activeAgents.filter(a => a.type === 'video');

  const stats = [
    {
      title: 'Active Voice Agents',
      value: voiceAgents.length,
      icon: Phone,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Active Video Agents',
      value: videoAgents.length,
      icon: Video,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Total Minutes Used',
      value: '0',
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Appointments Booked',
      value: '0',
      icon: Calendar,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
  ];

  if (!profile?.dealership_id) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="w-16 h-16 rounded-full bg-mist flex items-center justify-center mx-auto mb-6">
          <UserPlus className="h-8 w-8 text-slate" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Welcome to V·Suite</h1>
        <p className="text-slate mb-6">
          Your account hasn't been assigned to a dealership yet. Contact your administrator to get set up.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Command Center</h1>
        <p className="text-slate mt-1">
          Welcome back, {profile?.display_name || 'User'}. Here's your AI workforce overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-frost">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-slate">{stat.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Staff Preview */}
        <Card className="border-frost">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>My Staff</CardTitle>
              <CardDescription>Your active AI agents</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/my-staff">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {activeAgents.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-mist flex items-center justify-center mx-auto mb-4">
                  <UserPlus className="h-6 w-6 text-slate" />
                </div>
                <p className="text-slate mb-4">No active agents yet</p>
                <Button asChild>
                  <Link to="/dashboard/hiring-hall">
                    Hire Your First Agent
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {activeAgents.slice(0, 3).map((agent) => (
                  <div
                    key={agent.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-mist"
                  >
                    <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
                      {agent.type === 'voice' ? (
                        <Phone className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Video className="h-5 w-5 text-purple-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{agent.name}</p>
                      <p className="text-sm text-slate truncate">{agent.role_title}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs text-slate">Active</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Preview */}
        <Card className="border-frost">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Performance</CardTitle>
              <CardDescription>This month's activity</CardDescription>
            </div>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-slate">
                Performance metrics will appear here once your agents start handling calls.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
