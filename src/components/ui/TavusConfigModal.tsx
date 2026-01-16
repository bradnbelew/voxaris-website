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
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          
          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md"
          >
            <div className="bg-background border border-border rounded-xl shadow-lg overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                    <Settings className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">CVI Configuration</h3>
                    <p className="text-sm text-muted-foreground">Enter your Tavus credentials</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-5 space-y-5">
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
                    className="h-10"
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
                    className="h-10"
                  />
                  <p className="text-xs text-muted-foreground">
                    The persona configuration for your CVI agent
                  </p>
                </div>

                {/* Info box */}
                <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary">
                  <Zap className="w-4 h-4 text-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <span className="font-medium text-foreground">Sparrow-1:</span> Human-level conversational timing with real-time voice processing.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={!isValid || isLoading}
                  className="w-full h-11 bg-foreground hover:bg-foreground/90 text-background font-medium rounded-lg"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full"
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
              <div className="px-5 py-3 border-t border-border bg-secondary/50">
                <p className="text-xs text-muted-foreground text-center">
                  Secure connection • Credentials never stored
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
