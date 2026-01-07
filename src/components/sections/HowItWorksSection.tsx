import { motion } from "framer-motion";
import { PhoneIncoming, Headphones, Calendar, Database, RefreshCw } from "lucide-react";

const steps = [
  {
    icon: PhoneIncoming,
    step: "1",
    title: "Lead comes in",
    description: "Calls, forms, ads, or QR codes — any source."
  },
  {
    icon: Headphones,
    step: "2",
    title: "Maria answers or calls immediately",
    description: "Under 3 seconds for inbound. Instant outbound on form submit."
  },
  {
    icon: Calendar,
    step: "3",
    title: "Qualification and booking",
    description: "Maria asks the right questions and books directly to your calendar."
  },
  {
    icon: Database,
    step: "4",
    title: "Data pushed to CRM",
    description: "Contact created in GoHighLevel with structured fields and tags."
  },
  {
    icon: RefreshCw,
    step: "5",
    title: "Follow-up workflows run automatically",
    description: "Automated sequences until booked or closed."
  }
];

export default function HowItWorksSection() {
  return (
    <section className="section-padding bg-secondary/30">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-heading font-semibold text-foreground mb-4">
            How it works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A complete system from lead capture to booked appointment. Installed and managed — not DIY.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection line - desktop only */}
          <div className="hidden lg:block absolute top-24 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative text-center"
              >
                {/* Step circle */}
                <div className="relative inline-flex items-center justify-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center shadow-sm">
                    <item.icon className="h-7 w-7 text-foreground" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                
                <h3 className="font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Managed service callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-card border border-border">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-sm font-medium text-foreground">Installed and managed. Not DIY.</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
