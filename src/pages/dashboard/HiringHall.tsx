import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, Video, Play, UserPlus, Loader2, Mic } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { FaceTimeAvatar } from '@/components/ui/FaceTimeAvatar';
import { useVoice } from '@/components/voice/VoiceProvider';
import { toast as sonnerToast } from 'sonner';
import type { AgentTemplate, Agent } from '@/types/database';

// Featured agents with video demos
const FEATURED_VIDEO_AGENTS = [
  {
    id: "maria",
    name: "Maria",
    role: "Sales Representative",
    videoUrl: "https://cdn.replica.tavus.io/20283/9de1f64e.mp4",
    description: "High-energy closer. Perfect for inbound lead qualification."
  },
  {
    id: "david",
    name: "David",
    role: "Service Advisor",
    videoUrl: "https://cdn.replica.tavus.io/20283/9de1f64e.mp4",
    description: "Calm, authoritative. Handles service bookings and status updates."
  }
];

const FEATURED_VOICE_AGENTS = [
  { id: "reception", name: "Jessica", role: "Receptionist (Router)" },
  { id: "support", name: "Michael", role: "Support Specialist" },
  { id: "closer", name: "Sarah", role: "Outbound Closer" },
];

// Default templates if none exist in DB
const defaultTemplates: Omit<AgentTemplate, 'id' | 'created_at'>[] = [
  // Voice Agents
  {
    name: 'Acquisition Olivia',
    role_title: 'Buyback Specialist',
    type: 'voice',
    description: 'Specializes in vehicle acquisition calls, trade-in valuations, and buyback campaigns.',
    default_prompt: 'You are Olivia, a friendly and professional buyback specialist...',
    avatar_url: null,
    voice_id: null,
    persona_id: null,
    is_active: true,
  },
  {
    name: 'Service Maria',
    role_title: 'Service Advisor',
    type: 'voice',
    description: 'Handles service appointment scheduling, repair updates, and maintenance reminders.',
    default_prompt: 'You are Maria, a helpful service advisor...',
    avatar_url: null,
    voice_id: null,
    persona_id: null,
    is_active: true,
  },
  {
    name: 'Speed-to-Lead Sam',
    role_title: 'Lead Response Agent',
    type: 'voice',
    description: 'Instant response to internet leads. Qualifies buyers and books appointments.',
    default_prompt: 'You are Sam, a quick and efficient lead response agent...',
    avatar_url: null,
    voice_id: null,
    persona_id: null,
    is_active: true,
  },
  // Video Agents
  {
    name: 'Showroom Host',
    role_title: 'Virtual Showroom Guide',
    type: 'video',
    description: 'Interactive video tours of inventory, feature demonstrations, and virtual walkarounds.',
    default_prompt: 'You are the virtual showroom host...',
    avatar_url: null,
    voice_id: null,
    persona_id: null,
    is_active: true,
  },
  {
    name: 'Visual Appraiser',
    role_title: 'Trade-In Specialist',
    type: 'video',
    description: 'Video-based vehicle appraisals with real-time condition assessment.',
    default_prompt: 'You are the visual appraisal specialist...',
    avatar_url: null,
    voice_id: null,
    persona_id: null,
    is_active: true,
  },
];

export default function HiringHall() {
  const [templates, setTemplates] = useState<AgentTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hiringId, setHiringId] = useState<string | null>(null);
  const { profile } = useAuthContext();
  const { toast } = useToast();
  const { startSession } = useVoice();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTemplates() {
      const { data } = await supabase
        .from('agent_templates')
        .select('*')
        .eq('is_active', true);

      if (data && data.length > 0) {
        setTemplates(data as AgentTemplate[]);
      } else {
        setTemplates(
          defaultTemplates.map((t, i) => ({
            ...t,
            id: `template-${i}`,
            created_at: new Date().toISOString(),
          }))
        );
      }
      setIsLoading(false);
    }

    fetchTemplates();
  }, []);

  const handleDemo = (agentName: string, type: "Video" | "Voice") => {
    sonnerToast.info(`Connecting to ${agentName}...`, {
      description: `Initializing ${type} Interface.`,
    });
    startSession(agentName.toLowerCase());
  };

  const handleHire = async (template: AgentTemplate) => {
    if (!profile?.dealership_id) {
      toast({
        title: 'No dealership assigned',
        description: 'Contact your administrator to get set up.',
        variant: 'destructive',
      });
      return;
    }

    setHiringId(template.id);

    const { data, error } = await supabase
      .from('agents')
      .insert({
        dealership_id: profile.dealership_id,
        name: template.name,
        role_title: template.role_title,
        type: template.type,
        status: 'draft',
        avatar_url: template.avatar_url,
        system_prompt: template.default_prompt,
        voice_id: template.voice_id,
        persona_id: template.persona_id,
      })
      .select()
      .single();

    if (error) {
      toast({
        title: 'Failed to hire agent',
        description: error.message,
        variant: 'destructive',
      });
      setHiringId(null);
      return;
    }

    toast({
      title: 'Agent hired!',
      description: `${template.name} has been added to your staff.`,
    });

    navigate(`/dashboard/agents/${(data as Agent).id}`);
  };

  const voiceTemplates = templates.filter(t => t.type === 'voice');
  const videoTemplates = templates.filter(t => t.type === 'video');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-white/50" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Agent Hiring Hall</h1>
        <p className="text-white/60 mt-1">
          Browse our pre-built AI personas and hire them to join your digital workforce.
        </p>
      </div>

      {/* Featured Video Agents Showcase */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Video className="h-6 w-6 text-purple-400" />
          <h2 className="text-2xl font-semibold text-white">Featured Video Agents (CVI)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURED_VIDEO_AGENTS.map((agent) => (
            <Card 
              key={agent.id} 
              className="relative overflow-hidden bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10 p-8 group hover:border-white/20 transition-all"
            >
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                <FaceTimeAvatar videoUrl={agent.videoUrl} />
                
                <h3 className="text-xl font-bold text-white">{agent.name}</h3>
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                  {agent.role}
                </Badge>
                
                <p className="text-white/60 text-sm max-w-xs">
                  {agent.description}
                </p>

                <Button 
                  onClick={() => handleDemo(agent.name, "Video")} 
                  className="w-full max-w-xs gap-2 bg-purple-600 hover:bg-purple-700" 
                  size="lg"
                >
                  <Video className="h-4 w-4" />
                  Demo Video Call
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Voice Agents */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Mic className="h-6 w-6 text-blue-400" />
          <h2 className="text-2xl font-semibold text-white">Featured Voice Agents</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FEATURED_VOICE_AGENTS.map((agent) => (
            <Card 
              key={agent.id} 
              className="bg-white/5 border-white/10 p-5 group hover:border-white/20 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Mic className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{agent.name}</h4>
                    <p className="text-xs text-white/50">{agent.role}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-white/40 border-white/20 text-xs">Passive</Badge>
              </div>
              
              {/* Audio Visualizer */}
              <div className="flex items-end justify-center gap-1 h-8 mb-4">
                {[...Array(12)].map((_, i) => (
                  <div 
                    key={i}
                    className="w-1.5 bg-blue-500/30 rounded-full"
                    style={{ 
                      height: `${Math.random() * 60 + 20}%`,
                      animation: `pulse ${1 + Math.random()}s ease-in-out infinite`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>

              <Button 
                onClick={() => handleDemo(agent.name, "Voice")} 
                variant="outline" 
                className="w-full gap-2 border-white/20 text-white hover:bg-blue-600 hover:border-blue-600"
              >
                <Phone className="h-4 w-4" />
                Call Now
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* All Voice Templates */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Phone className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">All Voice Templates</h2>
            <p className="text-sm text-white/50">Hire AI-powered phone representatives</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {voiceTemplates.map((template) => (
            <Card key={template.id} className="border-white/10 bg-white/5 overflow-hidden group hover:border-white/20 transition-all">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
                    <Phone className="h-7 w-7 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{template.name}</h3>
                    <Badge variant="secondary" className="mt-1 bg-white/10 text-white/70">{template.role_title}</Badge>
                    <p className="text-sm text-white/50 mt-2 line-clamp-2">{template.description}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-white/[0.02] border-t border-white/10 p-4 flex gap-2">
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={() => handleHire(template)}
                  disabled={hiringId === template.id}
                >
                  {hiringId === template.id ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <UserPlus className="h-4 w-4 mr-2" />
                  )}
                  Hire Agent
                </Button>
                <Button variant="outline" size="icon" title="Preview Voice" className="border-white/20 text-white hover:bg-white/10">
                  <Play className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* All Video Templates */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <Video className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">All Video Templates</h2>
            <p className="text-sm text-white/50">Hire AI-powered video representatives</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videoTemplates.map((template) => (
            <Card key={template.id} className="border-white/10 bg-white/5 overflow-hidden group hover:border-white/20 transition-all">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
                    <Video className="h-7 w-7 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{template.name}</h3>
                    <Badge variant="secondary" className="mt-1 bg-white/10 text-white/70">{template.role_title}</Badge>
                    <p className="text-sm text-white/50 mt-2 line-clamp-2">{template.description}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-white/[0.02] border-t border-white/10 p-4 flex gap-2">
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={() => handleHire(template)}
                  disabled={hiringId === template.id}
                >
                  {hiringId === template.id ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <UserPlus className="h-4 w-4 mr-2" />
                  )}
                  Hire Agent
                </Button>
                <Button variant="outline" size="icon" title="Preview Video" className="border-white/20 text-white hover:bg-white/10">
                  <Play className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
