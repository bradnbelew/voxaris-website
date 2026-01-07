import { motion, Transition } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Phone, Zap, Clock, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] } as Transition
  })
};

const stats = [
  { value: "22", unit: "sec", label: "Avg Response Time" },
  { value: "47", unit: "%", label: "Appointment Rate" },
  { value: "24/7", unit: "", label: "Always Available" },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/30" />
      
      {/* Animated grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }}
      />
      
      {/* Elegant decorative orbs */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/5 to-transparent blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-secondary/60 to-transparent blur-3xl" />

      <div className="container-wide relative w-full">
        <div className="py-16 lg:py-20">
          {/* Speed indicator badge */}
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0}
            variants={fadeUp}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-sm text-foreground font-medium">
              <Zap className="w-4 h-4 text-primary" />
              The 22-Second Advantage
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial="hidden"
            animate="visible"
            custom={0.1}
            variants={fadeUp}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4.5rem] font-semibold tracking-[-0.02em] text-foreground mb-6 max-w-4xl leading-[1.08]"
          >
            What If Every Lead Got Called in{" "}
            <span className="relative inline-block">
              <span className="text-primary">22 Seconds</span>
              <motion.span 
                className="absolute -bottom-1 left-0 w-full h-1 bg-primary/20 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              />
            </span>
            ?
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial="hidden"
            animate="visible"
            custom={0.2}
            variants={fadeUp}
            className="text-lg lg:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed"
          >
            Voxaris is the AI Sales Agent built for campaigns and promotions. We instantly contact leads from your events, ads, or mailers — qualifying and booking appointments so your team only works real opportunities.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0.3}
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4 mb-10"
          >
            <Link to="/book-demo">
              <Button variant="hero" size="xl" className="w-full sm:w-auto shadow-lg shadow-primary/10">
                Get Your Free Lead Audit
                <ArrowRight className="h-5 w-5 ml-1" />
              </Button>
            </Link>
            <Link to="/demo">
              <Button variant="heroOutline" size="xl" className="w-full sm:w-auto">
                <Phone className="h-5 w-5 mr-1" />
                Try Maria Live
              </Button>
            </Link>
          </motion.div>

          {/* Trust stats */}
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0.4}
            variants={fadeUp}
            className="flex flex-wrap gap-8 lg:gap-12 mb-12"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-baseline gap-1">
                <span className="text-3xl lg:text-4xl font-semibold text-foreground">
                  {stat.value}
                </span>
                <span className="text-lg font-medium text-primary">{stat.unit}</span>
                <span className="text-sm text-muted-foreground ml-2">{stat.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Pilot availability */}
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0.5}
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl bg-card/60 border border-border/60 backdrop-blur-sm max-w-xl"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-foreground">Pilot Program Open</span>
            </div>
            <span className="text-sm text-muted-foreground">
              Free 30-day trial on your next campaign. Early adopters get lifetime pricing.
            </span>
          </motion.div>

          {/* Industry focus - Automotive primary */}
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0.6}
            variants={fadeUp}
            className="mt-16"
          >
            <p className="text-xs uppercase tracking-widest text-muted-foreground/60 font-medium mb-4">
              Built For Time-Sensitive Businesses
            </p>
            <div className="flex flex-wrap gap-3">
              <Link 
                to="/solutions/dealerships"
                className="px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-[13px] font-medium hover:bg-primary/90 transition-all duration-200"
              >
                🚗 Auto Dealerships
              </Link>
              <Link 
                to="/solutions/contractors"
                className="px-5 py-2.5 bg-card/60 backdrop-blur-sm rounded-full border border-border/60 text-[13px] text-foreground font-medium hover:bg-card hover:border-border transition-all duration-200"
              >
                Home Services
              </Link>
              <Link 
                to="/solutions/agencies"
                className="px-5 py-2.5 bg-card/60 backdrop-blur-sm rounded-full border border-border/60 text-[13px] text-foreground font-medium hover:bg-card hover:border-border transition-all duration-200"
              >
                Marketing Agencies
              </Link>
              <span className="px-5 py-2.5 bg-secondary/40 backdrop-blur-sm rounded-full border border-border/40 text-[13px] text-muted-foreground">
                + Real Estate, Events, Law Firms
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
