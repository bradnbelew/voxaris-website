import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  Video, 
  UserPlus, 
  Loader2, 
  MoreVertical,
  Pencil,
  Pause,
  Play,
  Trash2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Agent, AgentStatus } from '@/types/database';

export default function MyStaff() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { profile } = useAuthContext();
  const { toast } = useToast();

  useEffect(() => {
    fetchAgents();
  }, [profile?.dealership_id]);

  async function fetchAgents() {
    if (!profile?.dealership_id) {
      setIsLoading(false);
      return;
    }

    const { data } = await supabase
      .from('agents')
      .select('*')
      .eq('dealership_id', profile.dealership_id)
      .order('created_at', { ascending: false });

    setAgents((data as Agent[]) || []);
    setIsLoading(false);
  }

  const updateAgentStatus = async (agentId: string, status: AgentStatus) => {
    const { error } = await supabase
      .from('agents')
      .update({ status })
      .eq('id', agentId);

    if (error) {
      toast({
        title: 'Failed to update agent',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    setAgents(agents.map(a => a.id === agentId ? { ...a, status } : a));
    toast({
      title: 'Agent updated',
      description: `Agent status changed to ${status}.`,
    });
  };

  const deleteAgent = async (agentId: string) => {
    const { error } = await supabase
      .from('agents')
      .delete()
      .eq('id', agentId);

    if (error) {
      toast({
        title: 'Failed to delete agent',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    setAgents(agents.filter(a => a.id !== agentId));
    toast({
      title: 'Agent removed',
      description: 'The agent has been removed from your staff.',
    });
  };

  const getStatusColor = (status: AgentStatus) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'paused':
        return 'bg-amber-500';
      case 'draft':
        return 'bg-slate';
      default:
        return 'bg-slate';
    }
  };

  const getStatusLabel = (status: AgentStatus) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'paused':
        return 'Paused';
      case 'draft':
        return 'Draft';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-slate" />
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Staff</h1>
          <p className="text-slate mt-1">Manage your AI workforce</p>
        </div>

        <div className="max-w-md mx-auto text-center py-16">
          <div className="w-20 h-20 rounded-full bg-mist flex items-center justify-center mx-auto mb-6">
            <UserPlus className="h-10 w-10 text-slate" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Hire Your First Digital Employee</h2>
          <p className="text-slate mb-6">
            Visit the Agent Hiring Hall to browse our pre-built AI personas and add them to your team.
          </p>
          <Button asChild size="lg">
            <Link to="/dashboard/hiring-hall">
              <UserPlus className="h-5 w-5 mr-2" />
              Go to Hiring Hall
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Staff</h1>
          <p className="text-slate mt-1">
            {agents.length} agent{agents.length !== 1 ? 's' : ''} in your workforce
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard/hiring-hall">
            <UserPlus className="h-4 w-4 mr-2" />
            Hire More
          </Link>
        </Button>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <Card key={agent.id} className="border-frost overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    agent.type === 'voice' 
                      ? 'bg-gradient-to-br from-blue-100 to-blue-50' 
                      : 'bg-gradient-to-br from-purple-100 to-purple-50'
                  }`}>
                    {agent.type === 'voice' ? (
                      <Phone className="h-6 w-6 text-blue-600" />
                    ) : (
                      <Video className="h-6 w-6 text-purple-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{agent.name}</h3>
                    <p className="text-sm text-slate">{agent.role_title}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to={`/dashboard/agents/${agent.id}`}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Agent
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {agent.status === 'active' ? (
                      <DropdownMenuItem onClick={() => updateAgentStatus(agent.id, 'paused')}>
                        <Pause className="h-4 w-4 mr-2" />
                        Pause Agent
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => updateAgentStatus(agent.id, 'active')}>
                        <Play className="h-4 w-4 mr-2" />
                        Activate Agent
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => deleteAgent(agent.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove Agent
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center justify-between">
                <Badge variant="outline" className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)} ${
                    agent.status === 'active' ? 'animate-pulse' : ''
                  }`} />
                  {getStatusLabel(agent.status)}
                </Badge>
                <Badge variant="secondary">
                  {agent.type === 'voice' ? 'Voice' : 'Video'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
