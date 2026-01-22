
import React, { createContext, useContext, useState, useCallback } from "react"
// import { useDaily } from "@daily-co/daily-react" // Commented until installed
import { useToast } from "@/hooks/use-toast" // Adjusted import path for Vite

type VoiceMode = "dormant" | "listening" | "speaking" | "processing"

interface VoiceContextType {
  mode: VoiceMode
  isMicEnabled: boolean
  toggleMic: () => void
  startSession: (contextVariables?: { name?: string; carModel?: string }) => Promise<void>
  endSession: () => void
  transcript: string[]
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined)

export function useVoice() {
  const context = useContext(VoiceContext)
  if (!context) {
    throw new Error("useVoice must be used within a VoiceProvider")
  }
  return context
}

export function VoiceProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<VoiceMode>("dormant")
  const [isMicEnabled, setIsMicEnabled] = useState(false)
  const [transcript, setTranscript] = useState<string[]>([])
  // const daily = useDaily()
  const { toast } = useToast()

  // Mocking the Start Session logic until Daily.co credentials are real
  const startSession = useCallback(async (contextVariables?: { name?: string; carModel?: string }) => {
    try {
      setMode("listening")
      setIsMicEnabled(true)
      toast({ title: "Voice Mode Active", description: "Listening for commands..." })
      
      console.log("🚀 Starting Session with Context:", contextVariables);

      // Call the Supabase function to create conversation
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-tavus-conversation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
           conversation_name: "Hill Nissan Buyback Demo",
           // Inject context variables here if the backend supports it directly or via context string construction
           name: contextVariables?.name,
           carModel: contextVariables?.carModel
        }),
      });

      if (!response.ok) {
          throw new Error("Failed to create Tavus conversation");
      }

      const data = await response.json();
      console.log("✅ Conversation Created:", data);
      
      // Real implementation would be:
      // await daily?.join({ ... })
    } catch (error) {
      console.error("Failed to start voice session", error)
      toast({ title: "Error", description: "Could not start voice session.", variant: "destructive" })
      setMode("dormant")
    }
  }, [toast])

  const endSession = useCallback(() => {
    setMode("dormant")
    setIsMicEnabled(false)
    // daily?.leave()
    toast({ title: "Voice Mode Ended" })
  }, [toast])

  const toggleMic = useCallback(() => {
    setIsMicEnabled((prev) => !prev)
    // daily?.setLocalAudio(!isMicEnabled)
  }, [])

  return (
    <VoiceContext.Provider value={{ mode, isMicEnabled, toggleMic, startSession, endSession, transcript }}>
      {children}
    </VoiceContext.Provider>
  )
}
