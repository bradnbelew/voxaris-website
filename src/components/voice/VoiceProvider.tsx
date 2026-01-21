
import React, { createContext, useContext, useState, useCallback } from "react"
// import { useDaily } from "@daily-co/daily-react" // Commented until installed
import { useToast } from "@/hooks/use-toast" // Adjusted import path for Vite

type VoiceMode = "dormant" | "listening" | "speaking" | "processing"

interface VoiceContextType {
  mode: VoiceMode
  isMicEnabled: boolean
  toggleMic: () => void
  startSession: () => Promise<void>
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
  const startSession = useCallback(async () => {
    try {
      setMode("listening")
      setIsMicEnabled(true)
      toast({ title: "Voice Mode Active", description: "Listening for commands..." })
      
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
