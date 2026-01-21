import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, Video, Play, UserPlus, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { AgentTemplate, Agent } from '@/types/database';

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
  {
    name: 'Receptionist Rachel',
    role_title: 'Virtual Receptionist',
    type: 'voice',
    description: 'Professional call routing, message taking, and basic inquiries.',
    default_prompt: 'You are Rachel, the virtual receptionist...',
    avatar_url: null,
    voice_id: null,
    persona_id: null,
    is_active: true,
  },
  {
    name: 'Spanish Specialist',
    role_title: 'Bilingual Agent',
    type: 'voice',
    description: 'Fluent Spanish and English support for all customer interactions.',
    default_prompt: 'You are a bilingual customer service specialist...',
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
  {
    name: 'Event VIP Host',
    role_title: 'Special Events Concierge',
    type: 'video',
    description: 'Personalized invitations and VIP treatment for sales events.',
    default_prompt: 'You are the VIP event host...',
    avatar_url: null,
    voice_id: null,
    persona_id: null,
    is_active: true,
  },
  {
    name: 'Service Advisor Pro',
    role_title: 'Video Service Consultant',
    type: 'video',
    description: 'Visual explanations of repairs, maintenance recommendations, and service updates.',
    default_prompt: 'You are the video service advisor...',
    avatar_url: null,
    voice_id: null,
    persona_id: null,
    is_active: true,
  },
  {
    name: 'Finance Manager',
    role_title: 'F&I Specialist',
    type: 'video',
    description: 'Video presentations for financing options, warranties, and protection packages.',
    default_prompt: 'You are the finance and insurance specialist...',
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
        // Use default templates with generated IDs
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

    // Create a new agent from the template
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

    // Navigate to the agent editor
    navigate(`/dashboard/agents/${(data as Agent).id}`);
  };

  const voiceTemplates = templates.filter(t => t.type === 'voice');
  const videoTemplates = templates.filter(t => t.type === 'video');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-slate" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Agent Hiring Hall</h1>
        <p className="text-slate mt-1">
          Browse our pre-built AI personas and hire them to join your digital workforce.
        </p>
      </div>

      {/* Voice Agents */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Phone className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Voice Agents</h2>
            <p className="text-sm text-slate">AI-powered phone representatives</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {voiceTemplates.map((template) => (
            <Card key={template.id} className="border-frost overflow-hidden group">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center shrink-0">
                    <Phone className="h-7 w-7 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{template.name}</h3>
                    <Badge variant="secondary" className="mt-1">{template.role_title}</Badge>
                    <p className="text-sm text-slate mt-2 line-clamp-2">{template.description}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-mist/50 p-4 flex gap-2">
                <Button
                  className="flex-1"
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
                <Button variant="outline" size="icon" title="Preview Voice">
                  <Play className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Video Agents */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
            <Video className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Video Agents</h2>
            <p className="text-sm text-slate">AI-powered video representatives</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videoTemplates.map((template) => (
            <Card key={template.id} className="border-frost overflow-hidden group">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center shrink-0">
                    <Video className="h-7 w-7 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{template.name}</h3>
                    <Badge variant="secondary" className="mt-1">{template.role_title}</Badge>
                    <p className="text-sm text-slate mt-2 line-clamp-2">{template.description}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-mist/50 p-4 flex gap-2">
                <Button
                  className="flex-1"
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
                <Button variant="outline" size="icon" title="Preview Video">
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
