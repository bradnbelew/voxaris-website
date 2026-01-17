import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
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
          custom_greeting: "Hello! I'm Maria from Voxaris. How can I help you today?",
          conversational_context: "You are Maria, a helpful Voxaris CVI agent demonstrating real-time video AI capabilities. Be professional, friendly, and helpful."
        }
      });

      if (error) throw error;

      if (data?.conversation_url) {
        window.open(data.conversation_url, '_blank');
        toast.success("CVI call started! Check your new tab.");
      } else {
        throw new Error("No conversation URL returned");
      }
    } catch (error) {
      console.error("Error starting CVI call:", error);
      toast.error("Failed to start CVI call. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut" as const,
      },
    }),
  };

  const headlineWords = ["The", "Intelligence", "Layer"];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden mesh-gradient noise-overlay">
      {/* Ambient glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/3 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container-editorial relative py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left column - Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Eyebrow */}
            <motion.div variants={itemVariants} className="mb-6">
              <span className="eyebrow">Conversational Video Intelligence</span>
            </motion.div>

            {/* Main Headline - Word by word reveal */}
            <div className="mb-6">
              <h1 className="headline-xl text-foreground">
                {headlineWords.map((word, i) => (
                  <motion.span
                    key={word}
                    custom={i}
                    variants={wordVariants}
                    initial="hidden"
                    animate="visible"
                    className={`inline-block mr-4 ${word === "Intelligence" ? "text-primary" : ""}`}
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>
            </div>

            {/* Subheadline */}
            <motion.p
              variants={itemVariants}
              className="text-xl lg:text-2xl text-muted-foreground max-w-lg mb-8 leading-relaxed"
            >
              Face-to-face AI that qualifies, books, and converts — while you sleep.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full px-8 h-14 text-base shadow-glow hover:shadow-glow-lg transition-all duration-300"
                onClick={handleStartDemo}
                disabled={isLoading}
              >
                <Play className="h-5 w-5 mr-2 fill-current" />
                {isLoading ? "Connecting..." : "Talk to Maria Now"}
              </Button>
              <Link to="/technology">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="rounded-full px-8 h-14 text-base border-border/50 bg-white/[0.02] hover:bg-white/[0.05] hover:border-primary/30 transition-all duration-300"
                >
                  See It in Action
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div
              variants={itemVariants}
              className="flex gap-10 mt-14 pt-10 border-t border-border/30"
            >
              {[
                { value: "<200ms", label: "Latency" },
                { value: "24/7", label: "Availability" },
                { value: "0", label: "Hallucinations" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-bold text-foreground font-display">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right column - Video Demo Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative"
          >
            {/* Glow behind video */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-3xl blur-2xl opacity-60" />
            
            {/* Video container */}
            <div 
              onClick={handleStartDemo}
              className={`relative glass-card overflow-hidden aspect-[4/3] cursor-pointer group ${isLoading ? 'pointer-events-none opacity-75' : ''}`}
            >
              {/* Dark gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-card via-card to-background" />
              
              {/* Grid pattern overlay */}
              <div 
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                                    linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
                  backgroundSize: '40px 40px',
                }}
              />

              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Pulsing ring */}
                  <div className="absolute inset-0 w-24 h-24 rounded-full border-2 border-primary/30 animate-ping" style={{ animationDuration: '2s' }} />
                  
                  {/* Main play button */}
                  <div className="relative w-24 h-24 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                    <div className="w-0 h-0 border-t-[14px] border-t-transparent border-l-[24px] border-l-primary border-b-[14px] border-b-transparent ml-2" />
                  </div>
                </div>
              </div>
              
              {/* Avatar placeholder */}
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-muted to-card border-2 border-border/50 shadow-lg" />
              </div>

              {/* Live indicator */}
              <div className="absolute top-5 left-5 flex items-center gap-2 px-3 py-1.5 glass rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                <span className="text-xs font-medium text-foreground uppercase tracking-wider">Live Demo</span>
              </div>

              {/* Bottom gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/80 to-transparent" />
              
              {/* CTA text */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
                <span className="text-muted-foreground text-sm font-medium group-hover:text-foreground transition-colors">
                  Click to start a conversation with Maria
                </span>
              </div>

              {/* Tech labels */}
              <div className="absolute top-5 right-5 flex flex-col gap-2">
                {["V-SYNC", "V-SIGHT", "V-FLOW"].map((label, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.1, duration: 0.4 }}
                    className="px-2 py-1 glass rounded text-[10px] font-mono text-primary uppercase tracking-widest"
                  >
                    {label}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom pillars */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-24 pt-10 border-t border-border/30"
        >
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { label: "The V-Suite", href: "#vsuite" },
              { label: "Talking Postcards", href: "#talking-postcard" },
              { label: "Living Showrooms", href: "#living-showroom" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-5 py-2.5 rounded-full glass text-sm text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-300"
              >
                {item.label}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
