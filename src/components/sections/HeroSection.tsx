import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import TavusConfigModal from "@/components/ui/TavusConfigModal";

export default function HeroSection() {
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

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
    <section ref={containerRef} className="relative min-h-screen overflow-hidden noise-overlay">
      {/* Abstract background elements */}
      <div className="absolute inset-0">
        {/* Large gradient orb - top right */}
        <motion.div 
          style={{ y }}
          className="absolute -top-1/4 -right-1/4 w-[80vw] h-[80vw] max-w-[1200px] max-h-[1200px]"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan/20 via-cyan/5 to-transparent blur-3xl animate-glow-pulse" />
        </motion.div>
        
        {/* Accent orb - bottom left */}
        <div className="absolute -bottom-1/4 -left-1/4 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px]">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange/10 via-orange/5 to-transparent blur-3xl animate-glow-pulse animation-delay-2000" />
        </div>

        {/* Floating geometric shapes */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 right-1/3 w-[400px] h-[400px] opacity-[0.03]"
        >
          <div className="w-full h-full border border-foreground rounded-full" />
        </motion.div>
        
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/3 left-1/4 w-[300px] h-[300px] opacity-[0.02]"
        >
          <div className="w-full h-full border border-cyan rounded-full" />
        </motion.div>
      </div>

      <motion.div style={{ opacity }} className="container-editorial relative pt-40 pb-24 lg:pt-48 lg:pb-32">
        {/* Editorial asymmetric layout */}
        <div className="grid grid-cols-12 gap-4 lg:gap-8">
          {/* Left column - Main content */}
          <div className="col-span-12 lg:col-span-8 xl:col-span-7">
            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="mb-8"
            >
              <span className="pill-accent">
                <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
                Conversational Video Intelligence
              </span>
            </motion.div>

            {/* Main Headline - Bold typography */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="headline-xl text-foreground mb-6"
            >
              Your Brand.
              <br />
              <span className="gradient-text-accent">A Living</span>
              <br />
              <span className="gradient-text-accent">Interface.</span>
            </motion.h1>

            {/* Slogan with signature styling */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="mb-8"
            >
              <p className="text-2xl lg:text-3xl font-medium text-muted-foreground">
                Personalizing Your{" "}
                <span className="text-foreground relative">
                  Outreach
                  <motion.span 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                    className="absolute -bottom-1 left-0 w-full h-[3px] bg-gradient-to-r from-cyan to-cyan-glow origin-left"
                  />
                </span>
              </p>
            </motion.div>

            {/* Description with max width for readability */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-lg lg:text-xl text-muted-foreground max-w-xl mb-12 leading-relaxed"
            >
              Not chatbots. Not call centers. We build the intelligence layer that transforms how your customers engage—face to face, in real time.
            </motion.p>

            {/* CTAs with distinctive styling */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button 
                size="xl" 
                className="group bg-cyan hover:bg-cyan-glow text-background font-semibold rounded-full px-8 transition-all duration-300 hover:shadow-glow"
                onClick={() => setShowConfigModal(true)}
              >
                <Video className="h-5 w-5 mr-2" />
                Start CVI Demo
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
              <Link to="/book-demo">
                <Button 
                  variant="outline" 
                  size="xl" 
                  className="rounded-full px-8 border-border/50 hover:border-foreground/30 hover:bg-secondary/50"
                >
                  Book a Demo
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right column - Stats/Visual element */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="col-span-12 lg:col-span-4 xl:col-span-5 flex items-center justify-center lg:justify-end mt-16 lg:mt-0"
          >
            <div className="relative">
              {/* Decorative ring */}
              <div className="absolute inset-0 -m-8 rounded-full border border-border/30 animate-[spin_60s_linear_infinite]" />
              <div className="absolute inset-0 -m-16 rounded-full border border-border/20 animate-[spin_90s_linear_infinite_reverse]" />
              
              {/* Stats card */}
              <div className="relative glass-glow rounded-3xl p-8 lg:p-12">
                <div className="text-center">
                  <p className="stat-number">&lt;200</p>
                  <p className="text-lg text-muted-foreground mt-2">milliseconds response</p>
                </div>
                
                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-8" />
                
                <div className="grid grid-cols-2 gap-8 text-center">
                  <div>
                    <p className="text-3xl font-bold text-foreground">24/7</p>
                    <p className="text-sm text-muted-foreground mt-1">Availability</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">0</p>
                    <p className="text-sm text-muted-foreground mt-1">Hallucinations</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom section - Pillars */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-24 lg:mt-40"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-border" />
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
              Our Pillars
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-border to-border" />
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { label: "Interactive CVI", href: "#cvi-section", accent: true },
              { label: "Autonomous Agents", href: "/solutions/agencies" },
              { label: "Agentic Web Ecosystems", href: "/solutions/dealerships" },
            ].map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
                className={`group px-6 py-3 rounded-full border text-sm font-medium transition-all duration-300 ${
                  item.accent 
                    ? 'border-cyan/40 text-cyan hover:border-cyan hover:bg-cyan/10' 
                    : 'border-border/50 text-foreground hover:border-foreground/30 hover:bg-secondary/50'
                }`}
              >
                {item.accent && <span className="inline-block w-2 h-2 rounded-full bg-cyan mr-2 animate-pulse" />}
                {item.label}
                <ArrowRight className="inline-block ml-2 h-3 w-3 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </motion.div>

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
