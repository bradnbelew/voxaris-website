import { motion, Transition } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Video, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import TavusConfigModal from "@/components/ui/TavusConfigModal";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] } as Transition
  })
};

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
        // Open the Tavus conversation in a new tab
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
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Deep obsidian gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/30" />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--cyan) / 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--cyan) / 0.3) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }}
      />
      
      {/* Cyan glow orbs */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-cyan/10 to-transparent blur-3xl" />
      <div className="absolute bottom-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-cyan/5 to-transparent blur-3xl" />
      <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] rounded-full bg-cyan/5 blur-2xl animate-pulse" />

      <div className="container-wide relative w-full">
        <div className="py-16 lg:py-24">
          {/* Tagline */}
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0}
            variants={fadeUp}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm text-muted-foreground font-medium tracking-wide">
              <Sparkles className="w-4 h-4 text-cyan" />
              Beyond Automation
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial="hidden"
            animate="visible"
            custom={0.1}
            variants={fadeUp}
            className="text-[2.75rem] sm:text-5xl lg:text-6xl xl:text-[4.5rem] font-semibold tracking-[-0.02em] text-foreground mb-4 max-w-5xl leading-[1.05]"
          >
            Your Brand.{" "}
            <span className="gradient-text-cyan text-fluid">A Living Interface.</span>
          </motion.h1>

          {/* Slogan */}
          <motion.p
            initial="hidden"
            animate="visible"
            custom={0.15}
            variants={fadeUp}
            className="text-xl lg:text-2xl text-accent font-medium mb-6 max-w-3xl"
          >
            Personalizing Your Outreach.
          </motion.p>

          {/* Description */}
          <motion.p
            initial="hidden"
            animate="visible"
            custom={0.2}
            variants={fadeUp}
            className="text-lg lg:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed font-normal"
          >
            We build the intelligence layer that transforms how your customers engage. Not chatbots. Not call centers. Something new.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0.3}
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4 mb-5"
          >
            <Button 
              variant="hero" 
              size="xl" 
              className="w-full sm:w-auto bg-accent hover:bg-accent/90 transition-all duration-300"
              onClick={() => setShowConfigModal(true)}
            >
              <Video className="h-5 w-5 mr-2" />
              Start CVI Demo
            </Button>
            <Link to="/book-demo">
              <Button variant="heroOutline" size="xl" className="w-full sm:w-auto border-accent/30 hover:border-accent/60">
                Book a Demo
                <ArrowRight className="h-5 w-5 ml-1" />
              </Button>
            </Link>
          </motion.div>

          {/* Data grounding note */}
          <motion.p
            initial="hidden"
            animate="visible"
            custom={0.4}
            variants={fadeUp}
            className="text-sm text-muted-foreground/70 mb-16"
          >
            All Voxaris agents are grounded in proprietary client data for zero-hallucination accuracy.
          </motion.p>

          {/* Product Pillars */}
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0.5}
            variants={fadeUp}
          >
            <p className="text-xs uppercase tracking-widest text-muted-foreground/60 font-medium mb-4">
              Our Pillars
            </p>
            <div className="flex flex-wrap gap-3">
              <a 
                href="#cvi-section"
                className="px-5 py-2.5 glass rounded-full border-cyan/30 text-[13px] text-foreground font-medium hover:border-cyan/60 hover:shadow-cyan/10 transition-all duration-200"
              >
                <span className="text-cyan mr-2">●</span>
                Interactive CVI
              </a>
              <Link 
                to="/solutions/agencies"
                className="px-5 py-2.5 glass rounded-full border-border/60 text-[13px] text-foreground font-medium hover:border-cyan/40 transition-all duration-200"
              >
                Autonomous Agents
              </Link>
              <Link 
                to="/solutions/dealerships"
                className="px-5 py-2.5 glass rounded-full border-border/60 text-[13px] text-foreground font-medium hover:border-cyan/40 transition-all duration-200"
              >
                Agentic Web Ecosystems
              </Link>
            </div>
          </motion.div>
        </div>
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
