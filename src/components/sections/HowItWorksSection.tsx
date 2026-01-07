import { motion } from "framer-motion";
import { 
  PhoneIncoming, 
  Zap, 
  MessageSquare, 
  Calendar, 
  Users,
  ArrowRight
} from "lucide-react";

const steps = [
  {
    icon: PhoneIncoming,
    step: "1",
    title: "Lead Comes In",
    description: "From any source: Facebook ads, website forms, mailers, events, inbound calls.",
    highlight: "Any lead source"
  },
  {
    icon: Zap,
    step: "2",
    title: "AI Contacts in 22 Seconds",
    description: "Outbound call placed instantly. SMS sent simultaneously. No lead waits.",
    highlight: "22-second response"
  },
  {
    icon: MessageSquare,
    step: "3",
    title: "Conversation Adapts",
    description: "Pre-built scripts for your industry. Maria knows your promotions, inventory, and offers.",
    highlight: "Industry-specific AI"
  },
  {
    icon: Calendar,
    step: "4",
    title: "Qualifies & Books",
    description: "Asks the right questions, handles objections, and books directly into your calendar.",
    highlight: "Direct booking"
  },
  {
    icon: Users,
    step: "5",
    title: "Your Team Closes",
    description: "Sales gets warm, qualified appointments. AI handles all follow-up until they show.",
    highlight: "Ready-to-close leads"
  }
];

export default function HowItWorksSection() {
  return (
    <section className="section-padding">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 text-sm text-primary font-medium tracking-wide mb-4">
            <Zap className="w-4 h-4" />
            The 22-Second Advantage
          </span>
          <h2 className="text-3xl lg:text-heading font-semibold text-foreground mb-4">
            How Voxaris Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From lead capture to booked appointment in minutes, not hours. Here's the system that's changing how campaigns convert.
          </p>
        </motion.div>

        {/* Steps timeline */}
        <div className="relative">
          {/* Connection line - desktop */}
          <div className="hidden lg:block absolute top-[72px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-border to-transparent" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative text-center lg:text-left"
              >
                {/* Step indicator */}
                <div className="relative inline-flex items-center justify-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center shadow-subtle">
                    <item.icon className="h-7 w-7 text-foreground" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shadow-lg">
                    {item.step}
                  </span>
                </div>
                
                {/* Content */}
                <div className="lg:pr-4">
                  <div className="text-xs uppercase tracking-wider text-primary font-medium mb-2">
                    {item.highlight}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 text-lg">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Arrow connector for mobile */}
                {index < steps.length - 1 && (
                  <div className="flex lg:hidden justify-center my-4">
                    <ArrowRight className="h-5 w-5 text-border rotate-90" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Key differentiator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 px-6 py-4 rounded-2xl bg-card border border-border">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-sm font-medium text-foreground">Installed and managed</span>
            </div>
            <span className="hidden sm:block text-border">•</span>
            <span className="text-sm text-muted-foreground">Not DIY. Not another tool to learn. We build and run it for you.</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
