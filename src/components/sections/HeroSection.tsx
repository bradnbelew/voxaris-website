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
    <section ref={containerRef} className="relative min-h-screen overflow-hidden">
      {/* Minimal background */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Subtle accent element */}
      <motion.div 
        style={{ y }}
        className="absolute -top-1/2 -right-1/4 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] opacity-30"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent/10 to-transparent blur-3xl" />
      </motion.div>

      <motion.div style={{ opacity }} className="container-editorial relative pt-28 pb-20 lg:pt-32 lg:pb-28">
        <div className="grid grid-cols-12 gap-4 lg:gap-8">
          {/* Left column - Main content */}
          <div className="col-span-12 lg:col-span-8 xl:col-span-7">
            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              className="headline-xl text-foreground mb-6"
            >
              Your Brand.
              <br />
              <span className="text-accent">A Living</span>
              <br />
              <span className="text-accent">Interface.</span>
            </motion.h1>

            {/* Slogan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="mb-8"
            >
              <p className="text-2xl lg:text-3xl font-medium text-muted-foreground">
                Personalizing Your{" "}
                <span className="text-foreground">Outreach.</span>
              </p>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-lg lg:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed"
            >
              Not chatbots. Not call centers. We build the intelligence layer that transforms how your customers engage—face to face, in real time.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button 
                size="xl" 
                className="group bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full px-8 transition-all duration-300"
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
                  className="rounded-full px-8 border-border hover:border-foreground/30 hover:bg-secondary/50"
                >
                  Book a Demo
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right column - Stats */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="col-span-12 lg:col-span-4 xl:col-span-5 flex items-center justify-center lg:justify-end mt-12 lg:mt-0"
          >
            <div className="relative">
              {/* Stats card */}
              <div className="relative bg-secondary/50 border border-border rounded-2xl p-8 lg:p-10">
                <div className="text-center">
                  <p className="text-5xl lg:text-6xl font-bold text-foreground tracking-tight">&lt;200</p>
                  <p className="text-base text-muted-foreground mt-2">milliseconds response</p>
                </div>
                
                <div className="h-px bg-border my-6" />
                
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <p className="text-2xl font-bold text-foreground">24/7</p>
                    <p className="text-sm text-muted-foreground mt-1">Availability</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">0</p>
                    <p className="text-sm text-muted-foreground mt-1">Hallucinations</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom section - Pillars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-20 lg:mt-32"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
              Our Pillars
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: "Interactive CVI", href: "#cvi-section", accent: true },
              { label: "Autonomous Agents", href: "/solutions/agencies" },
              { label: "Agentic Web Ecosystems", href: "/solutions/dealerships" },
            ].map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                className={`group px-5 py-2.5 rounded-full border text-sm font-medium transition-all duration-300 ${
                  item.accent 
                    ? 'border-accent text-accent hover:bg-accent hover:text-accent-foreground' 
                    : 'border-border text-foreground hover:border-foreground/50 hover:bg-secondary'
                }`}
              >
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
