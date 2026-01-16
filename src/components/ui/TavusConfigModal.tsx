import { motion, AnimatePresence } from "framer-motion";
import { X, Settings, Play, Zap } from "lucide-react";
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
          {/* Backdrop with blur */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-2xl" 
          />
          
          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative w-full max-w-md"
          >
            {/* Glow effect behind card */}
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan/20 via-cyan/10 to-cyan/20 rounded-[2rem] blur-2xl opacity-50" />
            
            <div className="relative glass rounded-3xl overflow-hidden border border-border/50">
              {/* Accent line */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan to-transparent" />
              
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border/30">
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-2xl bg-cyan/10 flex items-center justify-center">
                    <Settings className="w-5 h-5 text-cyan" />
                    <div className="absolute inset-0 rounded-2xl bg-cyan/20 blur-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-semibold text-foreground">CVI Configuration</h3>
                    <p className="text-sm text-muted-foreground">Enter your Tavus credentials</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-secondary/50 transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </motion.button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="replica_id" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan" />
                    Replica ID
                  </Label>
                  <Input
                    id="replica_id"
                    type="text"
                    placeholder="r_xxxxxxxx"
                    value={replicaId}
                    onChange={(e) => setReplicaId(e.target.value)}
                    className="h-12 bg-secondary/30 border-border/30 rounded-xl focus:border-cyan focus:ring-cyan/20 transition-all"
                  />
                  <p className="text-xs text-muted-foreground pl-3">
                    Your Tavus replica identifier
                  </p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="persona_id" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan" />
                    Persona ID
                  </Label>
                  <Input
                    id="persona_id"
                    type="text"
                    placeholder="p_xxxxxxxx"
                    value={personaId}
                    onChange={(e) => setPersonaId(e.target.value)}
                    className="h-12 bg-secondary/30 border-border/30 rounded-xl focus:border-cyan focus:ring-cyan/20 transition-all"
                  />
                  <p className="text-xs text-muted-foreground pl-3">
                    The persona configuration for your CVI agent
                  </p>
                </div>

                {/* Info box with distinctive styling */}
                <div className="relative p-5 rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan/10 via-cyan/5 to-transparent" />
                  <div className="absolute inset-0 border border-cyan/20 rounded-2xl" />
                  <div className="relative flex items-start gap-3">
                    <Zap className="w-5 h-5 text-cyan mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      <span className="font-semibold text-cyan">Sparrow-1:</span> Human-level conversational timing with real-time voice processing for natural interactions.
                    </p>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={!isValid || isLoading}
                  className="w-full h-14 bg-cyan hover:bg-cyan-glow text-background font-semibold rounded-2xl transition-all duration-300 hover:shadow-glow disabled:opacity-50"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full"
                    />
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2 fill-current" />
                      Start CVI Call
                    </>
                  )}
                </Button>
              </form>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-border/30 bg-secondary/10">
                <p className="text-xs text-muted-foreground text-center">
                  🔒 Secure connection • Credentials never stored
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
