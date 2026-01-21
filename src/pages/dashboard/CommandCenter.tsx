import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Launchpad } from '@/components/dashboard/Launchpad';
import {
  Phone, 
  Video, 
  UserPlus, 
  ArrowRight, 
  MessageSquare, 
  Users, 
  Zap,
  Globe,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import type { Agent } from '@/types/database';

// Featured personas for the carousel
const featuredPersonas = [
  {
    id: 'olivia',
    name: 'Acquisition Olivia',
    role: 'Inbound Sales Specialist',
    description: 'Handles incoming leads with a warm, consultative approach. Converts inquiries into appointments.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
    type: 'voice' as const,
  },
  {
    id: 'maria',
    name: 'Service Maria',
    role: 'Service Department Rep',
    description: 'Books service appointments and handles recall notifications with empathy and efficiency.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
    type: 'video' as const,
  },
  {
    id: 'james',
    name: 'Follow-up James',
    role: 'Outbound Specialist',
    description: 'Re-engages cold leads and nurtures prospects through the sales funnel.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    type: 'voice' as const,
  },
];

const quickActions = [
  {
    title: 'Hire Agent',
    description: 'Browse the Hiring Hall',
    icon: UserPlus,
    href: '/dashboard/hiring-hall',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
  },
  {
    title: 'My Staff',
    description: 'Manage your workforce',
    icon: Users,
    href: '/dashboard/my-staff',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'Test Agent',
    description: 'Preview in Test Lab',
    icon: Zap,
    href: '/dashboard/agent-test',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    title: 'Integrations',
    description: 'Connect your CRM',
    icon: Globe,
    href: '/dashboard/integrations',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
];

export default function CommandCenter() {
  const { profile } = useAuthContext();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);

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

  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % featuredPersonas.length);
  };

  const prevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + featuredPersonas.length) % featuredPersonas.length);
  };

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
      {/* Launchpad Onboarding */}
      <Launchpad agentCount={activeAgents.length} hasIntegration={false} />

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-ink via-charcoal to-ink p-8 lg:p-10">
        {/* Background pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Gradient overlay */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-500/20 to-transparent" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-medium mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              V·SUITE
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
              Command Center
            </h1>
            <p className="text-lg text-white/70">
              Welcome back, {profile?.display_name || 'User'}. Deploy and manage your AI workforce from one place.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Button asChild className="bg-emerald-500 hover:bg-emerald-600 text-white">
                <Link to="/dashboard/hiring-hall">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Hire New Agent
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Link to="/dashboard/agent-test">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex gap-6 lg:gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{voiceAgents.length}</p>
              <p className="text-sm text-white/50">Voice Agents</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{videoAgents.length}</p>
              <p className="text-sm text-white/50">Video Agents</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">&lt;500ms</p>
              <p className="text-sm text-white/50">Response</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Personas Carousel */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Explore Available Personas</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={prevSlide} className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextSlide} className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredPersonas.map((persona, index) => (
            <Link 
              key={persona.id}
              to="/dashboard/hiring-hall"
              className="group relative overflow-hidden rounded-xl aspect-[4/3] bg-ink"
            >
              <img 
                src={persona.image} 
                alt={persona.name}
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-center gap-2 mb-2">
                  {persona.type === 'voice' ? (
                    <Phone className="h-4 w-4 text-blue-400" />
                  ) : (
                    <Video className="h-4 w-4 text-purple-400" />
                  )}
                  <span className="text-xs text-white/60 uppercase tracking-wider">{persona.type}</span>
                </div>
                <h3 className="text-lg font-semibold text-white">{persona.name}</h3>
                <p className="text-sm text-white/70 line-clamp-2">{persona.description}</p>
                <div className="flex items-center gap-1 mt-3 text-white/60 group-hover:text-white transition-colors">
                  <span className="text-sm">View details</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Link key={action.title} to={action.href}>
            <Card className="border-frost hover:border-charcoal/30 hover:shadow-md transition-all group h-full">
              <CardContent className="p-5">
                <div className={`w-10 h-10 rounded-xl ${action.bgColor} flex items-center justify-center mb-4`}>
                  <action.icon className={`h-5 w-5 ${action.color}`} />
                </div>
                <div className="flex items-center gap-1">
                  <h3 className="font-medium">{action.title}</h3>
                  <ArrowRight className="h-4 w-4 text-slate opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-sm text-slate mt-1">{action.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Active Agents Section */}
      {activeAgents.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Active Workforce</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/my-staff" className="text-slate hover:text-foreground">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeAgents.slice(0, 3).map((agent) => (
              <Card key={agent.id} className="border-frost">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-mist flex items-center justify-center">
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
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs text-slate">Live</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
