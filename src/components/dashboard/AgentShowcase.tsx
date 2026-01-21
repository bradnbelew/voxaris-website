import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaceTimeAvatar } from "@/components/ui/FaceTimeAvatar";
import { Mic, Video, Phone, Activity } from "lucide-react";
import { useVoice } from "@/components/voice/VoiceProvider";
import { toast } from "sonner";

const VIDEO_AGENTS = [
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

const VOICE_AGENTS = [
  { id: "reception", name: "Jessica", role: "Receptionist (Router)", type: "Voice" as const },
  { id: "support", name: "Michael", role: "Support Specialist", type: "Voice" as const },
  { id: "closer", name: "Sarah", role: "Outbound Closer", type: "Voice" as const },
];

export function AgentShowcase() {
  const { startSession } = useVoice();

  const handleDemo = (agentName: string, type: "Video" | "Voice") => {
    toast.info(`Connecting to ${agentName}...`, {
      description: `Initializing ${type} Interface.`,
    });
    startSession(agentName.toLowerCase());
  };

  return (
    <div className="space-y-12">
      
      {/* SECTION 1: VIDEO AGENTS (Large Cards) */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Video className="h-6 w-6 text-purple-400" />
          <h2 className="text-2xl font-semibold text-white">Video Agents (CVI)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {VIDEO_AGENTS.map((agent) => (
            <Card 
              key={agent.id} 
              className="relative overflow-hidden bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10 p-8 group hover:border-white/20 transition-all"
            >
              {/* Background Glow */}
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                <FaceTimeAvatar videoUrl={agent.videoUrl} size="lg" />
                
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

      {/* SECTION 2: VOICE AGENTS (Compact Cards) */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Mic className="h-6 w-6 text-blue-400" />
          <h2 className="text-2xl font-semibold text-white">Voice Agents (Retell)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {VOICE_AGENTS.map((agent) => (
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
              
              {/* Audio Visualizer Placeholder */}
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
                className="w-full gap-2 border-white/20 text-white hover:bg-blue-600 hover:border-blue-600 hover:text-white"
              >
                <Phone className="h-4 w-4" />
                Call Now
              </Button>
            </Card>
          ))}
        </div>
      </section>

    </div>
  );
}
