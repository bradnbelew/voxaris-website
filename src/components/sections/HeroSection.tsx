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
    <section className="min-h-screen flex flex-col justify-center bg-background">
      <div className="container-editorial py-16 lg:py-24">
        {/* Video Demo - The Star */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-[800px] mx-auto mb-12"
        >
          <div 
            onClick={handleStartDemo}
            className={`video-frame aspect-video bg-mist relative cursor-pointer group ${isLoading ? 'pointer-events-none opacity-75' : ''}`}
          >
            {/* Placeholder content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {/* Live badge */}
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-background/90 rounded-full border border-frost">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <span className="text-xs font-medium text-foreground">LIVE</span>
              </div>

              {/* Central placeholder */}
              <div className="w-20 h-20 rounded-full bg-frost flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-foreground border-b-[12px] border-b-transparent ml-1.5" />
              </div>
              
              <p className="mt-4 text-sm text-muted-foreground">
                {isLoading ? "Connecting..." : "CVI Demo — Click to start"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Content Below Video */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Headline */}
          <h1 className="headline-xl text-foreground mb-4 tracking-[0.08em] uppercase">
            The Human Interface
          </h1>

          {/* Subheadline */}
          <p className="text-subheading text-charcoal mb-10">
            Face-to-face AI that sees, speaks, and converts.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-foreground hover:bg-obsidian text-background font-medium rounded-lg px-8 h-14 text-base transition-colors duration-200"
              onClick={handleStartDemo}
              disabled={isLoading}
            >
              {isLoading ? "Connecting..." : "Start a Conversation"}
            </Button>
            <Link to="/how-it-works" className="group">
              <span className="text-charcoal font-medium hover:text-foreground transition-colors duration-200 flex items-center gap-1">
                How It Works
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
