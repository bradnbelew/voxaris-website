import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Navbar, Footer } from "@/components/marketing";
import { Phone, Globe, PhoneOutgoing, CheckSquare, Calendar, Database, Bell, RefreshCw, ArrowRight, Zap, Shield, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const coreFeatures = [
  {
    icon: Phone,
    title: "Inbound Call Handling",
    description: "Instant 24/7 call answering with zero hold times. Every call is professionally handled, qualified, and routed — no voicemails, no missed opportunities.",
    highlights: ["24/7/365 availability", "Instant pickup", "Professional greeting"]
  },
  {
    icon: Globe,
    title: "Web Form Response",
    description: "Automatic callback within seconds of form submission. Speed-to-lead technology that dramatically increases conversion rates.",
    highlights: ["Sub-60 second response", "Multi-channel capture", "Smart prioritization"]
  },
  {
    icon: PhoneOutgoing,
    title: "AI Outbound Calling",
    description: "Intelligent follow-up calls at optimal times until contact is made. Persistent but respectful outreach that maximizes connection rates.",
    highlights: ["Smart timing optimization", "Multi-attempt sequences", "Voicemail detection"]
  }
];

const qualificationFeatures = [
  {
    icon: CheckSquare,
    title: "Intelligent Qualification",
    description: "Custom qualification criteria powered by conversational AI. Ask the right questions, score intent, and filter prospects automatically.",
    highlights: ["Custom question flows", "Intent scoring", "Lead filtering"]
  },
  {
    icon: Calendar,
    title: "Real-Time Booking",
    description: "Qualified leads are booked directly into your calendar. No back-and-forth, no scheduling friction — just confirmed appointments.",
    highlights: ["Calendar integration", "Availability sync", "Instant confirmation"]
  },
  {
    icon: Database,
    title: "CRM Synchronization",
    description: "Every interaction is logged, summarized, and pushed to your CRM with structured data. Complete visibility, zero manual entry.",
    highlights: ["Auto-logging", "Call summaries", "Data enrichment"]
  }
];

const automationFeatures = [
  {
    icon: Bell,
    title: "Confirmation & Reminders",
    description: "Automated appointment confirmations via SMS and email. Smart reminder sequences that minimize no-shows and maximize show rates.",
    highlights: ["SMS confirmations", "Email reminders", "No-show reduction"]
  },
  {
    icon: RefreshCw,
    title: "Persistent Follow-up",
    description: "Leads that don't book enter automated nurture sequences. Multi-touch follow-up until conversion or explicit opt-out.",
    highlights: ["Nurture sequences", "Re-engagement", "Smart persistence"]
  }
];

const capabilities = [
  {
    icon: Zap,
    title: "Speed",
    stat: "<60s",
    description: "Average response time to new leads"
  },
  {
    icon: Shield,
    title: "Reliability",
    stat: "99.9%",
    description: "Uptime with enterprise infrastructure"
  },
  {
    icon: BarChart3,
    title: "Performance",
    stat: "3x",
    description: "Typical increase in booked appointments"
  }
];

const FeatureCard = ({ feature, index }: { feature: typeof coreFeatures[0], index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="bg-card border border-border rounded-2xl p-6 lg:p-8 hover:border-primary/30 transition-colors"
  >
    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
      <feature.icon className="h-6 w-6" />
    </div>
    <h3 className="text-xl font-semibold text-foreground mb-3">
      {feature.title}
    </h3>
    <p className="text-muted-foreground leading-relaxed mb-5">
      {feature.description}
    </p>
    <div className="flex flex-wrap gap-2">
      {feature.highlights.map((highlight) => (
        <span 
          key={highlight}
          className="text-xs font-medium px-3 py-1 rounded-full bg-secondary text-secondary-foreground"
        >
          {highlight}
        </span>
      ))}
    </div>
  </motion.div>
);

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Helmet>
        <title>How Voxaris Works | AI-Powered Lead Automation Platform</title>
        <meta name="description" content="Voxaris handles every touchpoint from first contact to confirmed appointment with AI-powered precision. Inbound calls, outbound follow-up, qualification, and booking \u2014 all automated." />
        <meta name="keywords" content="AI lead automation, AI call handling, automated lead qualification, AI appointment booking, CRM integration, conversational AI platform" />
        <link rel="canonical" href="https://voxaris.io/how-it-works" />
        <meta property="og:title" content="How Voxaris Works | AI-Powered Lead Automation" />
        <meta property="og:description" content="A unified platform that handles every touchpoint \u2014 from first contact to confirmed appointment \u2014 with AI-powered precision." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://voxaris.io/how-it-works" />
        <meta property="og:image" content="https://voxaris.io/og-image.png" />
        <meta name="twitter:image" content="https://voxaris.io/og-image.png" />      </Helmet>
      {/* Hero */}
      <section className="pt-28 pb-16 lg:pb-20 bg-secondary/30">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 block">
              Platform Features
            </span>
            <h1 className="text-4xl lg:text-display-sm font-semibold text-foreground mb-6">
              Everything you need for complete lead automation
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              A unified platform that handles every touchpoint — from first contact to confirmed appointment — with AI-powered precision.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b border-border">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {capabilities.map((cap, index) => (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                  <cap.icon className="h-5 w-5" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-foreground mb-1">
                  {cap.stat}
                </div>
                <div className="text-sm text-muted-foreground">
                  {cap.description}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <span className="text-sm font-medium text-primary uppercase tracking-wider mb-3 block">
              Lead Capture
            </span>
            <h2 className="text-3xl lg:text-heading font-semibold text-foreground mb-4">
              Capture every lead, every channel
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Multi-channel lead capture that responds instantly — whether they call, submit a form, or need follow-up.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreFeatures.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Qualification Features */}
      <section className="section-padding bg-secondary/30">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <span className="text-sm font-medium text-primary uppercase tracking-wider mb-3 block">
              Qualification & Booking
            </span>
            <h2 className="text-3xl lg:text-heading font-semibold text-foreground mb-4">
              Qualify and book automatically
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Intelligent qualification that filters prospects and books appointments in real-time — no human intervention required.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {qualificationFeatures.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Automation Features */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <span className="text-sm font-medium text-primary uppercase tracking-wider mb-3 block">
              Automation & Follow-up
            </span>
            <h2 className="text-3xl lg:text-heading font-semibold text-foreground mb-4">
              Never let a lead slip away
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Automated confirmations, reminders, and follow-up sequences that maximize show rates and re-engage cold leads.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            {automationFeatures.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-wide text-center">
          <h2 className="text-3xl lg:text-heading font-semibold mb-4">
            Ready to see these features in action?
          </h2>
          <p className="text-lg text-primary-foreground/70 mb-8 max-w-xl mx-auto">
            Get a personalized demo and see how Voxaris can transform your lead conversion.
          </p>
          <Link to="/book-demo">
            <Button 
              variant="secondary" 
              size="xl" 
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              Book a Demo
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
