import { motion, Transition } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Video, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CVICallSimulator from "@/components/ui/CVICallSimulator";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] } as Transition
  })
};

export default function HeroSection() {
  const [showCallSimulator, setShowCallSimulator] = useState(false);

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
              Introducing Conversational Video Intelligence
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
            The Era of{" "}
            <span className="gradient-text-cyan text-fluid">Conversational Video Intelligence</span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial="hidden"
            animate="visible"
            custom={0.15}
            variants={fadeUp}
            className="text-xl lg:text-2xl text-cyan font-medium mb-6 max-w-3xl"
          >
            Custom Agentic Solutions for High-Stakes Interaction.
          </motion.p>

          {/* Description */}
          <motion.p
            initial="hidden"
            animate="visible"
            custom={0.2}
            variants={fadeUp}
            className="text-lg lg:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed font-normal"
          >
            Your brand doesn't just send messages—it has a face. A real-time video interface that can see, hear, and react. From FaceTime-style consultations to autonomous voice agents, we build the intelligence layer that closes deals.
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
              className="w-full sm:w-auto bg-cyan-glow hover:shadow-cyan transition-all duration-300"
              onClick={() => setShowCallSimulator(true)}
            >
              <Video className="h-5 w-5 mr-2" />
              Simulate CVI Call
            </Button>
            <Link to="/book-demo">
              <Button variant="heroOutline" size="xl" className="w-full sm:w-auto border-cyan/30 hover:border-cyan/60 hover:shadow-cyan/20">
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

      {/* CVI Call Simulator Modal */}
      <CVICallSimulator 
        isOpen={showCallSimulator} 
        onClose={() => setShowCallSimulator(false)} 
      />
    </section>
  );
}
