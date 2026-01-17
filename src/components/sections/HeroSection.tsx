import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Hardcoded Tavus credentials for demo
const REPLICA_ID = "r9fa0878977a";
const PERSONA_ID = "p5332d853291";

export default function HeroSection() {
  const [isLoading, setIsLoading] = useState(false);

  const handleStartDemo = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-tavus-conversation', {
        body: {
          replica_id: REPLICA_ID,
          persona_id: PERSONA_ID,
          custom_greeting: "Hello! I'm here to help. What can I do for you today?",
          conversational_context: "You are a helpful Voxaris CVI agent demonstrating real-time video AI capabilities. Be professional, friendly, and helpful."
        }
      });

      if (error) throw error;

      if (data?.conversation_url) {
        window.open(data.conversation_url, '_blank');
        toast.success("Conversation started! Check your new tab.");
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

  return (
    <section className="min-h-screen flex flex-col justify-center bg-white">
      <div className="container-editorial py-16 lg:py-24">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <span className="eyebrow">Conversational Video Intelligence</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="headline-xl text-ink text-center mb-6"
        >
          The Human Interface
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="text-xl text-charcoal text-center max-w-2xl mx-auto mb-10"
        >
          Face-to-face AI that sees, speaks, and converts.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <Button 
            size="lg" 
            className="bg-ink hover:bg-charcoal text-white font-medium rounded-full px-8 h-14 text-base transition-colors duration-200"
            onClick={handleStartDemo}
            disabled={isLoading}
          >
            {isLoading ? "Connecting..." : "Talk to Maria"}
          </Button>
          <Link to="/how-it-works" className="group">
            <span className="text-slate font-medium hover:text-ink transition-colors duration-200 flex items-center gap-1">
              See How It Works
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>
        </motion.div>

        {/* Video Demo Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
          className="max-w-[800px] mx-auto mb-12"
        >
          <div 
            onClick={handleStartDemo}
            className={`video-frame aspect-video relative cursor-pointer group shadow-lg ${isLoading ? 'pointer-events-none opacity-75' : ''}`}
          >
            {/* Placeholder content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {/* Live badge */}
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-frost shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <span className="text-xs font-medium text-ink">LIVE</span>
              </div>

              {/* Play button */}
              <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300 border border-frost">
                <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-ink border-b-[12px] border-b-transparent ml-1.5" />
              </div>
              
              <p className="mt-4 text-sm text-slate">
                {isLoading ? "Connecting..." : "Click to start a live conversation"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
          className="flex flex-wrap justify-center gap-8 lg:gap-16"
        >
          {[
            { value: "500ms", label: "Response Time" },
            { value: "24/7", label: "Availability" },
            { value: "0%", label: "Hallucinations" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold text-ink font-display">{stat.value}</p>
              <p className="text-sm text-slate mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
