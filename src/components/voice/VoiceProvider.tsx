import { createContext, useContext, useState, ReactNode } from "react";

interface VoiceContextType {
  isActive: boolean;
  isConnecting: boolean;
  agentId: string | null;
  startSession: (agentId?: string) => void;
  endSession: () => void;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export function VoiceProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [agentId, setAgentId] = useState<string | null>(null);

  const startSession = (id?: string) => {
    setIsConnecting(true);
    setAgentId(id || null);
    
    // Simulate connection delay
    setTimeout(() => {
      setIsConnecting(false);
      setIsActive(true);
    }, 1500);
  };

  const endSession = () => {
    setIsActive(false);
    setAgentId(null);
  };

  return (
    <VoiceContext.Provider value={{ isActive, isConnecting, agentId, startSession, endSession }}>
      {children}
    </VoiceContext.Provider>
  );
}

export function useVoice() {
  const context = useContext(VoiceContext);
  if (context === undefined) {
    throw new Error("useVoice must be used within a VoiceProvider");
  }
  return context;
}
