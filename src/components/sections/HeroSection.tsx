import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, X } from "lucide-react";
import FaceTimeCallButtons from "@/components/ui/FaceTimeCallButtons";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Conversation } from "@/components/cvi";

// Hardcoded Tavus credentials for demo
const REPLICA_ID = "r9fa0878977a";
const PERSONA_ID = "p5332d853291";

export default function HeroSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [conversationUrl, setConversationUrl] = useState<string | null>(null);
  const [isInCall, setIsInCall] = useState(false);

  const handleStartDemo = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-tavus-conversation', {
        body: {
          replica_id: REPLICA_ID,
          persona_id: PERSONA_ID,
          custom_greeting: "Hello! I'm Maria from Voxaris. How can I help you today?",
          conversational_context: "You are Maria, a friendly and professional Voxaris CVI agent demonstrating real-time video AI capabilities. You help visitors understand how Conversational Video Intelligence works."
        }
      });

      if (error) throw error;

      if (data?.conversation_url) {
        setConversationUrl(data.conversation_url);
        setIsInCall(true);
        toast.success("Connected! Say hello to Maria.");
      } else {
        throw new Error("No conversation URL returned");
      }
    } catch (error) {
      console.error("Error starting CVI call:", error);
      toast.error("Failed to start conversation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveCall = () => {
    setIsInCall(false);
    setConversationUrl(null);
  };

  return (
    <section className="bg-white pt-20 pb-16 md:pt-20 md:pb-20">
      <div className="container-hero">
        {/* Two Column Layout - side by side on md+ screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-center">
          {/* Left Column - CVI Video Demo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="w-full"
          >
            <div className="video-frame aspect-[4/3] md:aspect-video relative shadow-xl overflow-hidden rounded-2xl">
              <AnimatePresence mode="wait">
                {isInCall && conversationUrl ? (
                  <motion.div
                    key="conversation"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0"
                  >
                    <Conversation 
                      conversationUrl={conversationUrl} 
                      onLeave={handleLeaveCall}
                    />
                    {/* Close button */}
                    <button
                      onClick={handleLeaveCall}
                      className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors z-10"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0"
                  >
                    {/* Full-frame video */}
                    <video 
                      src="https://cdn.replica.tavus.io/20283/9de1f64e.mp4" 
                      className="w-full h-full object-cover"
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                    />
                    
                    {/* Live badge */}
                    <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-frost shadow-sm">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                      </span>
                      <span className="text-xs font-medium text-ink">LIVE</span>
                    </div>

                    {/* Answer button overlay at bottom */}
                    <div className="absolute bottom-6 left-0 right-0">
                      <FaceTimeCallButtons 
                        onAccept={handleStartDemo}
                        onDecline={() => {}}
                        isConnecting={isLoading}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Right Column - Content */}
          <div className="w-full">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mb-6"
            >
              <span className="eyebrow">Conversational Video Intelligence</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="headline-xl text-ink mb-6"
            >
              The Human Interface
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-xl text-charcoal max-w-lg mb-8"
            >
              AI you can actually talk to—face-to-face. It sees you, hears you, and helps you. Available 24/7.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="mb-12"
            >
              <Link to="/how-it-works">
                <Button 
                  size="lg" 
                  className="bg-ink hover:bg-charcoal text-white font-medium rounded-full px-8 h-14 text-base transition-colors duration-200"
                >
                  See How It Works
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
              className="flex flex-wrap gap-8 lg:gap-12"
            >
              {[
                { value: "<500ms", label: "Response Time" },
                { value: "24/7", label: "Availability" },
                { value: "0%", label: "Hallucinations" },
              ].map((stat) => (
                <div key={stat.label} className="text-left">
                  <p className="text-2xl font-bold text-ink font-display">{stat.value}</p>
                  <p className="text-sm text-slate mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
