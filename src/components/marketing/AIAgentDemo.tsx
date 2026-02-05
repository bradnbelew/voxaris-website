import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Video, X, Mic, MicOff, PhoneOff, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ============================================================
// AI AGENT DEMO COMPONENT
// Embeds both Retell voice and Tavus video agents for voxaris.io
// ============================================================

// Config - these would typically come from env
const RETELL_AGENT_ID = 'agent_696226322fb18bfca2e43d5111';

interface AIAgentDemoProps {
  className?: string;
  variant?: 'floating' | 'inline';
}

export function AIAgentDemo({ className, variant = 'floating' }: AIAgentDemoProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeAgent, setActiveAgent] = useState<'voice' | 'video' | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [retellClient, setRetellClient] = useState<any>(null);

  // Load Retell SDK
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.RetellWebClient) {
      const script = document.createElement('script');
      script.src = 'https://cdn.retellai.com/retell-web-client.min.js';
      script.async = true;
      script.onload = () => {
        console.log('Retell SDK loaded');
      };
      document.body.appendChild(script);
    }
  }, []);

  // Initialize Retell client when opening voice
  const initRetellCall = async () => {
    if (!window.RetellWebClient) {
      console.error('Retell SDK not loaded');
      return;
    }

    try {
      // Get access token from your backend
      const response = await fetch('/api/retell/web-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent_id: RETELL_AGENT_ID })
      });

      if (!response.ok) {
        throw new Error('Failed to create web call');
      }

      const { access_token } = await response.json();

      const client = new window.RetellWebClient();

      client.on('call_started', () => {
        console.log('Call started');
        setIsCallActive(true);
      });

      client.on('call_ended', () => {
        console.log('Call ended');
        setIsCallActive(false);
        setActiveAgent(null);
      });

      client.on('error', (error: any) => {
        console.error('Retell error:', error);
        setIsCallActive(false);
      });

      await client.startCall({ accessToken: access_token });
      setRetellClient(client);

    } catch (error) {
      console.error('Error starting call:', error);
    }
  };

  const endCall = () => {
    if (retellClient) {
      retellClient.stopCall();
      setRetellClient(null);
    }
    setIsCallActive(false);
    setActiveAgent(null);
  };

  const toggleMute = () => {
    if (retellClient) {
      if (isMuted) {
        retellClient.unmuteMicrophone();
      } else {
        retellClient.muteMicrophone();
      }
      setIsMuted(!isMuted);
    }
  };

  const openVoiceAgent = () => {
    setActiveAgent('voice');
    setIsOpen(true);
    initRetellCall();
  };

  const openVideoAgent = () => {
    setActiveAgent('video');
    setIsOpen(true);
    // Video agent loads in iframe
  };

  const closeModal = () => {
    if (isCallActive) {
      endCall();
    }
    setIsOpen(false);
    setActiveAgent(null);
  };

  // Floating trigger buttons
  if (variant === 'floating') {
    return (
      <>
        {/* Floating Action Buttons */}
        <div className={cn("fixed bottom-6 right-6 z-50 flex flex-col gap-3", className)}>
          <motion.button
            onClick={openVideoAgent}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:shadow-xl flex items-center justify-center group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Talk to our Video AI"
          >
            <Video className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </motion.button>

          <motion.button
            onClick={openVoiceAgent}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-navy-600 to-navy-900 text-white shadow-lg hover:shadow-xl flex items-center justify-center group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Talk to our Voice AI"
          >
            <Phone className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </motion.button>
        </div>

        {/* Modal */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            >
              <motion.div
                className="relative bg-white rounded-3xl shadow-2xl overflow-hidden max-w-lg w-full mx-4"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-navy-900 to-navy-700 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {activeAgent === 'voice' ? (
                      <Phone className="w-5 h-5 text-white" />
                    ) : (
                      <Video className="w-5 h-5 text-white" />
                    )}
                    <div>
                      <h3 className="text-white font-semibold">
                        {activeAgent === 'voice' ? 'Alex' : 'Emma'}
                      </h3>
                      <p className="text-white/70 text-sm">
                        {activeAgent === 'voice' ? 'Voice Agent' : 'Video Agent'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  {activeAgent === 'voice' ? (
                    <VoiceAgentUI
                      isCallActive={isCallActive}
                      isMuted={isMuted}
                      onEndCall={endCall}
                      onToggleMute={toggleMute}
                    />
                  ) : (
                    <VideoAgentUI />
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Inline variant for embedding in page
  return (
    <div className={cn("grid md:grid-cols-2 gap-6", className)}>
      <AgentCard
        type="voice"
        name="Alex"
        description="Talk to our AI voice agent"
        onClick={openVoiceAgent}
      />
      <AgentCard
        type="video"
        name="Emma"
        description="See our AI video agent in action"
        onClick={openVideoAgent}
      />
    </div>
  );
}

// Voice Agent UI Component
function VoiceAgentUI({
  isCallActive,
  isMuted,
  onEndCall,
  onToggleMute
}: {
  isCallActive: boolean;
  isMuted: boolean;
  onEndCall: () => void;
  onToggleMute: () => void;
}) {
  return (
    <div className="text-center">
      {/* Avatar */}
      <div className="relative w-32 h-32 mx-auto mb-6">
        <div className={cn(
          "w-full h-full rounded-full bg-gradient-to-br from-navy-500 to-navy-700 flex items-center justify-center",
          isCallActive && "animate-pulse"
        )}>
          <span className="text-4xl font-bold text-white">A</span>
        </div>
        {isCallActive && (
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-green-500"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </div>

      {/* Status */}
      <div className="mb-6">
        {isCallActive ? (
          <div className="flex items-center justify-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-green-600 font-medium">Connected</span>
          </div>
        ) : (
          <span className="text-platinum-500">Connecting...</span>
        )}
      </div>

      {/* Sound visualization */}
      {isCallActive && (
        <div className="flex items-center justify-center gap-1 mb-6 h-8">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-navy-500 rounded-full"
              animate={{
                height: [8, 24, 8],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>
      )}

      {/* Controls */}
      {isCallActive && (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={onToggleMute}
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
              isMuted
                ? "bg-red-100 text-red-600"
                : "bg-platinum-100 text-platinum-600 hover:bg-platinum-200"
            )}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            onClick={onEndCall}
            className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
          >
            <PhoneOff className="w-6 h-6" />
          </button>

          <button className="w-12 h-12 rounded-full bg-platinum-100 text-platinum-600 hover:bg-platinum-200 flex items-center justify-center transition-colors">
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}

// Video Agent UI Component
function VideoAgentUI() {
  // In production, this would be the Tavus conversation URL
  const tavusConversationUrl = 'about:blank'; // Replace with actual conversation URL

  return (
    <div className="aspect-[4/5] w-full bg-platinum-100 rounded-2xl overflow-hidden relative">
      {tavusConversationUrl !== 'about:blank' ? (
        <iframe
          src={tavusConversationUrl}
          className="w-full h-full"
          allow="camera; microphone"
          style={{ border: 'none' }}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
          <Video className="w-16 h-16 text-platinum-400 mb-4" />
          <h4 className="text-lg font-semibold text-navy-900 mb-2">Video Agent Demo</h4>
          <p className="text-platinum-500 text-sm">
            Video agent setup in progress. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
}

// Agent Card Component
function AgentCard({
  type,
  name,
  description,
  onClick
}: {
  type: 'voice' | 'video';
  name: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <motion.div
      className="bg-white rounded-2xl border border-platinum-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
      whileHover={{ y: -4 }}
    >
      <div className={cn(
        "w-14 h-14 rounded-xl flex items-center justify-center mb-4",
        type === 'voice'
          ? "bg-navy-100 text-navy-600"
          : "bg-purple-100 text-purple-600"
      )}>
        {type === 'voice' ? <Phone className="w-6 h-6" /> : <Video className="w-6 h-6" />}
      </div>
      <h3 className="text-xl font-semibold text-navy-900 mb-2">Talk to {name}</h3>
      <p className="text-platinum-600">{description}</p>
      <Button className="mt-4 w-full" variant="outline">
        Start Conversation
      </Button>
    </motion.div>
  );
}

// TypeScript declaration for Retell SDK
declare global {
  interface Window {
    RetellWebClient: any;
  }
}

export default AIAgentDemo;
