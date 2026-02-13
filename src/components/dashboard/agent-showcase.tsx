
import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FaceTimeAvatar } from "@/components/ui/facetime-avatar"
import { Mic, Video, Phone, Activity } from "lucide-react"
import { useVoice } from "@/components/voice/VoiceProvider"
import { useToast } from "@/hooks/use-toast"

const VIDEO_AGENTS = [
  {
    id: "maria",
    name: "Maria",
    role: "Sales Representative",
    videoUrl: "https://cdn.replica.tavus.io/40242/2fe8396c.mp4", 
    description: "High-energy closer. Perfect for inbound lead qualification."
  },
  {
    id: "david",
    name: "David",
    role: "Service Advisor",
    videoUrl: "https://cdn.replica.tavus.io/40242/2fe8396c.mp4", 
    description: "Calm, authoritative. Handles service bookings and status updates."
  }
]

const VOICE_AGENTS = [
  { id: "reception", name: "Jessica", role: "Receptionist (Router)", type: "Voice" },
  { id: "support", name: "Michael", role: "Support Specialist", type: "Voice" },
  { id: "closer", name: "Sarah", role: "Outbound Closer", type: "Voice" },
]

export function AgentShowcase() {
  const { startSession } = useVoice()
  const { toast } = useToast()
  const [voiceAgents, setVoiceAgents] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/voice/candidates')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setVoiceAgents(data.data)
        }
      })
      .catch(err => console.error('Failed to fetch agents:', err))
  }, [])

  const handleDemo = (agentName: string, type: "Video" | "Voice") => {
    toast({
      title: `Connecting to ${agentName}...`,
      description: `Initializing ${type} Interface.`,
    })
    startSession()
  }

  return (
    <div className="space-y-12">
      
      {/* SECTION 1: VIDEO AGENTS (Large Cards) */}
      <div>
        <div className="mb-6 flex items-center gap-2">
            <Video className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold tracking-tight">Video Agents (CVI)</h2>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {VIDEO_AGENTS.map((agent) => (
            <Card key={agent.id} className="glass-card relative overflow-hidden p-8 transition-all hover:shadow-hover">
               {/* Background Glow */}
               <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-500/5 blur-3xl" />
               
               <div className="relative z-10 flex flex-col items-center text-center">
                  <FaceTimeAvatar videoUrl={agent.videoUrl} className="mb-6" />
                  
                  <h3 className="text-2xl font-bold">{agent.name}</h3>
                  <Badge variant="secondary" className="mb-4 mt-2">
                    {agent.role}
                  </Badge>
                  
                  <p className="mb-8 max-w-sm text-sm text-muted-foreground">
                    {agent.description}
                  </p>

                  <Button onClick={() => handleDemo(agent.name, "Video")} className="w-full max-w-xs gap-2" size="lg">
                    <Video className="h-4 w-4" />
                    Demo Video Call
                  </Button>
               </div>
            </Card>
          ))}
        </div>
      </div>

      {/* SECTION 2: VOICE AGENTS (Compact Cards) */}
      <div>
        <div className="mb-6 flex items-center gap-2">
            <Mic className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold tracking-tight">Voice Agents (Retell)</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
            {voiceAgents.map((agent) => (
                <Card key={agent.id} className="group relative overflow-hidden border-border/50 bg-card/50 p-6 transition-colors hover:border-primary/20 hover:bg-card">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5 text-primary">
                                <Activity className="h-5 w-5" />
                            </div>
                            <h3 className="font-semibold">{agent.name}</h3>
                            <p className="text-xs text-muted-foreground">{agent.role}</p>
                        </div>
                        <Badge variant="outline" className="opacity-50">Passive</Badge>
                    </div>
                    
                    {/* Visualizer Placeholder */}
                    <div className="my-6 flex items-center justify-center gap-1 opacity-30 group-hover:opacity-100 transition-opacity">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="h-4 w-1 rounded-full bg-primary" style={{ height: Math.random() * 24 + 4 }} />
                        ))}
                    </div>

                    <Button onClick={() => handleDemo(agent.name, "Voice")} variant="outline" className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground">
                        <Phone className="h-3 w-3" />
                        Call Now
                    </Button>
                </Card>
            ))}
        </div>
      </div>

    </div>
  )
}
