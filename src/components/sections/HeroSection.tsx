import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Video, MessageSquare, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import TavusConfigModal from "@/components/ui/TavusConfigModal";

export default function HeroSection() {
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartCall = async (replicaId: string, personaId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-tavus-conversation', {
        body: {
          replica_id: replicaId,
          persona_id: personaId,
          custom_greeting: "Hello! I'm your Voxaris CVI agent. How can I help you today?",
          conversational_context: "You are a helpful Voxaris CVI agent demonstrating real-time video AI capabilities. Be professional, friendly, and helpful."
        }
      });

      if (error) throw error;

      if (data?.conversation_url) {
        window.open(data.conversation_url, '_blank');
        setShowConfigModal(false);
        toast.success("CVI call started! Check your new tab.");
      } else {
        throw new Error("No conversation URL returned");
      }
    } catch (error) {
      console.error("Error starting CVI call:", error);
      toast.error("Failed to start CVI call. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative min-h-[calc(100vh-80px)] flex items-center">
      <div className="container-editorial relative py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column - Content */}
          <div>
            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="headline-xl text-foreground mb-6"
            >
              Your Brand.
              <br />
              A Living Interface.
            </motion.h1>

            {/* Slogan */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl lg:text-2xl text-muted-foreground mb-6"
            >
              Personalizing Your Outreach.
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed"
            >
              Not chatbots. Not call centers. We build the intelligence layer that transforms how your customers engage—face to face, in real time.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Button 
                size="lg" 
                className="bg-foreground hover:bg-foreground/90 text-background font-medium rounded-full px-6"
                onClick={() => setShowConfigModal(true)}
              >
                <Video className="h-4 w-4 mr-2" />
                Start CVI Demo
              </Button>
              <Link to="/book-demo">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="rounded-full px-6 border-border hover:bg-secondary"
                >
                  Book a Demo
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex gap-8 mt-12 pt-8 border-t border-border"
            >
              <div>
                <p className="text-2xl font-bold text-foreground">&lt;200ms</p>
                <p className="text-sm text-muted-foreground">Response</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">24/7</p>
                <p className="text-sm text-muted-foreground">Available</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">0</p>
                <p className="text-sm text-muted-foreground">Hallucinations</p>
              </div>
            </motion.div>
          </div>

          {/* Right column - Video Demo Preview - Full size like Tavus.io */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative lg:min-h-[500px]"
          >
            {/* Video container - larger with click to start */}
            <div 
              onClick={() => setShowConfigModal(true)}
              className="relative bg-foreground rounded-2xl overflow-hidden aspect-video cursor-pointer group shadow-2xl"
            >
              {/* Placeholder video area - dark like Tavus */}
              <div className="absolute inset-0 flex items-center justify-center bg-foreground">
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-background border-b-[12px] border-b-transparent ml-1" />
                  </div>
                </div>
                
                {/* Avatar placeholder in center */}
                <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 translate-y-1/2">
                  <div className="w-32 h-32 rounded-full bg-muted-foreground/20 border-4 border-muted-foreground/30" />
                </div>
              </div>

              {/* Live indicator */}
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-background/10 backdrop-blur-sm rounded-full">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-medium text-background uppercase tracking-wider">Live Demo</span>
              </div>

              {/* Bottom gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />
              
              {/* CTA text */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                <span className="text-background/80 text-sm font-medium group-hover:text-background transition-colors">
                  Click to talk with Maria
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom section - Pillars */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 pt-8 border-t border-border"
        >
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: "Interactive CVI", href: "#cvi-section" },
              { label: "Autonomous Agents", href: "/solutions/agencies" },
              { label: "Agentic Web Ecosystems", href: "/solutions/dealerships" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-4 py-2 rounded-full border border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Tavus Config Modal */}
      <TavusConfigModal 
        isOpen={showConfigModal} 
        onClose={() => setShowConfigModal(false)}
        onStartCall={handleStartCall}
        isLoading={isLoading}
      />
    </section>
  );
}
