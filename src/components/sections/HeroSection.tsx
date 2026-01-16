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

          {/* Right column - Video Demo Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            {/* Video container with Tavus-style interface */}
            <div className="relative bg-secondary rounded-2xl overflow-hidden aspect-[4/3] border border-border">
              {/* Header bar */}
              <div className="absolute top-0 left-0 right-0 z-10 flex items-center gap-2 px-4 py-3 bg-background/90 backdrop-blur-sm border-b border-border">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-sm font-medium text-foreground uppercase tracking-wider">Face-to-Face Video</span>
                <div className="flex-1 h-px bg-border ml-4" />
              </div>

              {/* Placeholder video area */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-secondary to-muted">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-foreground/10 flex items-center justify-center">
                    <Video className="w-10 h-10 text-foreground/40" />
                  </div>
                  <p className="text-muted-foreground text-sm">Click to start a live demo</p>
                </div>
              </div>

              {/* Bottom controls */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-background rounded-full border border-border shadow-lg">
                <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                  <MessageSquare className="w-4 h-4 text-foreground" />
                </button>
                <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                  <Video className="w-4 h-4 text-foreground" />
                </button>
                <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                  <Phone className="w-4 h-4 text-foreground" />
                </button>
              </div>
            </div>

            {/* Floating label */}
            <div className="absolute -bottom-4 left-4 right-4 flex justify-center">
              <span className="px-4 py-2 bg-background border border-border rounded-full text-xs text-muted-foreground shadow-sm">
                Powered by real-time AI with human-level conversational timing
              </span>
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
