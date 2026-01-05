import { motion, Transition } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Phone, MessageSquare, Calendar, Database, RefreshCw, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] } as Transition
  })
};

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20" />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />
      
      {/* Elegant decorative orbs */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-secondary/60 to-transparent blur-3xl" />
      <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-accent/40 to-transparent blur-3xl" />

      <div className="container-wide relative w-full">
        <div className="pt-8 pb-16 lg:pt-12 lg:pb-20">
          {/* Tagline */}
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0}
            variants={fadeUp}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground font-medium tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              AI Sales Infrastructure
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial="hidden"
            animate="visible"
            custom={0.1}
            variants={fadeUp}
            className="text-[2.75rem] sm:text-5xl lg:text-6xl xl:text-[4rem] font-semibold tracking-[-0.02em] text-foreground mb-7 max-w-4xl leading-[1.1]"
          >
            AI that converts inbound leads into booked appointments — <span className="text-muted-foreground">automatically.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial="hidden"
            animate="visible"
            custom={0.2}
            variants={fadeUp}
            className="text-lg lg:text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed font-normal"
          >
            Voxaris is a full-stack AI sales and intake system that responds instantly, qualifies prospects, books appointments, and keeps your CRM clean — without adding staff.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0.3}
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4 mb-20"
          >
            <Link to="/book-demo">
              <Button variant="hero" size="xl" className="w-full sm:w-auto shadow-lg shadow-primary/10">
                Book a Demo
                <ArrowRight className="h-5 w-5 ml-1" />
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button variant="heroOutline" size="xl" className="w-full sm:w-auto">
                See How It Works
              </Button>
            </Link>
          </motion.div>

          {/* Feature Pills - Refined */}
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0.5}
            variants={fadeUp}
          >
            <p className="text-xs uppercase tracking-widest text-muted-foreground/60 font-medium mb-4">
              Full-Stack Capabilities
            </p>
            <div className="flex flex-wrap gap-2.5">
              {[
                { icon: Phone, label: "Inbound Calls" },
                { icon: MessageSquare, label: "SMS & Web" },
                { icon: Calendar, label: "Booking" },
                { icon: Database, label: "CRM Sync" },
                { icon: RefreshCw, label: "Follow-up" },
                { icon: BarChart3, label: "Attribution" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-4 py-2.5 bg-card/60 backdrop-blur-sm rounded-full border border-border/60 text-[13px] text-muted-foreground font-medium hover:bg-card hover:border-border transition-all duration-200"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
