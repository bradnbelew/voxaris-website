import { motion, AnimatePresence } from "framer-motion";
import { X, Settings, Play } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TavusConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartCall: (replicaId: string, personaId: string) => void;
  isLoading?: boolean;
}

export default function TavusConfigModal({ 
  isOpen, 
  onClose, 
  onStartCall,
  isLoading = false 
}: TavusConfigModalProps) {
  const [replicaId, setReplicaId] = useState("");
  const [personaId, setPersonaId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (replicaId.trim() && personaId.trim()) {
      onStartCall(replicaId.trim(), personaId.trim());
    }
  };

  const isValid = replicaId.trim() && personaId.trim();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/90 backdrop-blur-xl" />
          
          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative w-full max-w-md"
          >
            <div className="glass-strong rounded-2xl overflow-hidden shadow-elegant">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Settings className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">CVI Configuration</h3>
                    <p className="text-sm text-muted-foreground">Enter your Tavus credentials</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="replica_id" className="text-sm font-medium text-foreground">
                    Replica ID
                  </Label>
                  <Input
                    id="replica_id"
                    type="text"
                    placeholder="r_xxxxxxxx"
                    value={replicaId}
                    onChange={(e) => setReplicaId(e.target.value)}
                    className="h-11 bg-secondary/30 border-border/50 focus:border-accent"
                  />
                  <p className="text-xs text-muted-foreground">
                    Your Tavus replica identifier
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="persona_id" className="text-sm font-medium text-foreground">
                    Persona ID
                  </Label>
                  <Input
                    id="persona_id"
                    type="text"
                    placeholder="p_xxxxxxxx"
                    value={personaId}
                    onChange={(e) => setPersonaId(e.target.value)}
                    className="h-11 bg-secondary/30 border-border/50 focus:border-accent"
                  />
                  <p className="text-xs text-muted-foreground">
                    The persona configuration for your CVI agent
                  </p>
                </div>

                {/* Info box */}
                <div className="p-4 rounded-xl bg-accent/5 border border-accent/20">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <span className="font-medium text-accent">Powered by Sparrow-1:</span> Human-level conversational timing with real-time voice processing for natural, seamless interactions.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={!isValid || isLoading}
                  className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-medium"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full"
                    />
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Start CVI Call
                    </>
                  )}
                </Button>
              </form>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-border/50 bg-secondary/20">
                <p className="text-xs text-muted-foreground text-center">
                  Secure connection • Your credentials are never stored
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
