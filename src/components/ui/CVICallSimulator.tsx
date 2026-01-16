import { motion, AnimatePresence } from "framer-motion";
import { Phone, PhoneOff, Video, Mic, MicOff, User } from "lucide-react";
import { useState, useEffect } from "react";

interface CVICallSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
}

type CallState = "incoming" | "connecting" | "active" | "ended";

export default function CVICallSimulator({ isOpen, onClose }: CVICallSimulatorProps) {
  const [callState, setCallState] = useState<CallState>("incoming");
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCallState("incoming");
      setCallDuration(0);
    }
  }, [isOpen]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (callState === "active") {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callState]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswer = () => {
    setCallState("connecting");
    setTimeout(() => setCallState("active"), 2000);
  };

  const handleDecline = () => {
    setCallState("ended");
    setTimeout(onClose, 1000);
  };

  const handleEndCall = () => {
    setCallState("ended");
    setTimeout(onClose, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && callState !== "active" && onClose()}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/90 backdrop-blur-xl" />
          
          {/* Call UI Container */}
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative w-full max-w-sm"
          >
            {/* iOS-style call card */}
            <div className="glass-strong rounded-[2.5rem] overflow-hidden shadow-elegant">
              {/* Top gradient bar */}
              <div className="h-1 bg-gradient-to-r from-cyan via-cyan-glow to-cyan" />
              
              <div className="p-8 text-center">
                {/* Avatar */}
                <motion.div
                  animate={callState === "incoming" ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ repeat: callState === "incoming" ? Infinity : 0, duration: 2 }}
                  className="w-28 h-28 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan/20 to-cyan/5 border-2 border-cyan/30 flex items-center justify-center shadow-cyan"
                >
                  {callState === "active" ? (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
                      <User className="w-12 h-12 text-cyan" />
                    </div>
                  ) : (
                    <Video className="w-12 h-12 text-cyan" />
                  )}
                </motion.div>

                {/* Caller info */}
                <h3 className="text-2xl font-semibold text-foreground mb-1">
                  Voxaris CVI
                </h3>
                <p className="text-muted-foreground mb-2">
                  {callState === "incoming" && "Incoming Video Call..."}
                  {callState === "connecting" && "Connecting..."}
                  {callState === "active" && formatDuration(callDuration)}
                  {callState === "ended" && "Call Ended"}
                </p>
                
                {callState === "active" && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-cyan"
                  >
                    AI Persona Active
                  </motion.p>
                )}

                {/* Demo conversation preview for active call */}
                {callState === "active" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 p-4 glass rounded-2xl text-left"
                  >
                    <p className="text-xs text-muted-foreground mb-2">AI TRANSCRIPT</p>
                    <p className="text-sm text-foreground leading-relaxed">
                      "Hi there! I'm your Voxaris CVI agent. I can see you, hear you, and respond in real-time. How can I assist you today?"
                    </p>
                  </motion.div>
                )}

                {/* Call actions */}
                <div className="mt-8">
                  {callState === "incoming" && (
                    <div className="flex justify-center gap-8">
                      {/* Decline */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleDecline}
                        className="w-16 h-16 rounded-full bg-destructive flex items-center justify-center shadow-lg"
                      >
                        <PhoneOff className="w-7 h-7 text-destructive-foreground" />
                      </motion.button>
                      
                      {/* Answer */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        onClick={handleAnswer}
                        className="w-16 h-16 rounded-full bg-cyan-glow flex items-center justify-center shadow-cyan"
                      >
                        <Video className="w-7 h-7 text-background" />
                      </motion.button>
                    </div>
                  )}

                  {callState === "connecting" && (
                    <div className="flex justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-12 h-12 rounded-full border-2 border-cyan/30 border-t-cyan"
                      />
                    </div>
                  )}

                  {callState === "active" && (
                    <div className="flex justify-center gap-6">
                      {/* Mute */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsMuted(!isMuted)}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                          isMuted ? "bg-muted" : "glass"
                        }`}
                      >
                        {isMuted ? (
                          <MicOff className="w-6 h-6 text-muted-foreground" />
                        ) : (
                          <Mic className="w-6 h-6 text-foreground" />
                        )}
                      </motion.button>
                      
                      {/* End Call */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleEndCall}
                        className="w-14 h-14 rounded-full bg-destructive flex items-center justify-center"
                      >
                        <PhoneOff className="w-6 h-6 text-destructive-foreground" />
                      </motion.button>
                    </div>
                  )}

                  {callState === "ended" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-muted-foreground"
                    >
                      <Phone className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Call ended</p>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Bottom info bar */}
              <div className="px-8 py-4 border-t border-border/50 text-center">
                <p className="text-xs text-muted-foreground">
                  CVI Demo • Real-time Video Intelligence
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
