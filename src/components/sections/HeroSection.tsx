import { motion, Transition } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Phone, MessageSquare, Calendar, Database, RefreshCw, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: "easeOut" } as Transition
  })
};

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-background to-background" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full bg-secondary/40 blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-accent/30 blur-3xl opacity-40" />

      <div className="container-wide relative">
        <div className="py-24 lg:py-36 max-w-4xl">
          {/* Eyebrow */}
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0}
            variants={fadeUp}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary border border-border text-sm text-muted-foreground mb-8">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              AI Sales Infrastructure
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial="hidden"
            animate="visible"
            custom={0.1}
            variants={fadeUp}
            className="text-4xl sm:text-5xl lg:text-display font-semibold tracking-tight text-foreground mb-6 text-balance"
          >
            AI that converts inbound leads into booked appointments — automatically.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial="hidden"
            animate="visible"
            custom={0.2}
            variants={fadeUp}
            className="text-lg lg:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed"
          >
            Voxaris is a full-stack AI sales and intake system that responds instantly, qualifies prospects, books appointments, and keeps your CRM clean — without adding staff.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0.3}
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link to="/book-demo">
              <Button variant="hero" size="xl" className="w-full sm:w-auto">
                Book a Demo
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button variant="heroOutline" size="xl" className="w-full sm:w-auto">
                See How It Works
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Feature Pills */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={0.5}
          variants={fadeUp}
          className="pb-16 lg:pb-24"
        >
          <div className="flex flex-wrap gap-3">
            {[
              { icon: Phone, label: "Inbound Calls" },
              { icon: MessageSquare, label: "SMS & Web" },
              { icon: Calendar, label: "Appointment Booking" },
              { icon: Database, label: "CRM Updates" },
              { icon: RefreshCw, label: "Follow-up" },
              { icon: BarChart3, label: "Attribution" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-border text-sm text-muted-foreground"
              >
                <Icon className="h-4 w-4" />
                {label}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
