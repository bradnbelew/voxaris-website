import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Phone, Globe, PhoneOutgoing, CheckSquare, Calendar, Database, Bell, RefreshCw, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: Phone,
    title: "Inbound Call Handling",
    description: "When a lead calls your business, Voxaris answers instantly — 24/7, 365 days a year. No hold times, no voicemail, no missed opportunities."
  },
  {
    icon: Globe,
    title: "Web Form Response",
    description: "The moment a prospect submits a form, Maria calls them back within seconds. Speed-to-lead is the strongest predictor of conversion."
  },
  {
    icon: PhoneOutgoing,
    title: "AI Outbound Calling",
    description: "For leads that don't answer immediately, Maria makes follow-up calls at optimal times until contact is made."
  },
  {
    icon: CheckSquare,
    title: "Intelligent Qualification",
    description: "Using your custom criteria, Maria qualifies each prospect — asking the right questions, scoring intent, and filtering out non-fits."
  },
  {
    icon: Calendar,
    title: "Appointment Booking",
    description: "Qualified leads are booked directly into your calendar system in real time. No back-and-forth, no scheduling friction."
  },
  {
    icon: Database,
    title: "CRM Integration",
    description: "Every call is logged, summarized, and pushed to your CRM with clean, structured data — no manual entry required."
  },
  {
    icon: Bell,
    title: "Confirmation & Reminders",
    description: "Appointments are confirmed via SMS and email. Reminders are sent automatically to minimize no-shows."
  },
  {
    icon: RefreshCw,
    title: "Persistent Follow-up",
    description: "Leads that don't book on the first call enter automated follow-up sequences until they convert or explicitly decline."
  }
];

export default function HowItWorks() {
  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding bg-secondary/30">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 block">
              How It Works
            </span>
            <h1 className="text-4xl lg:text-display-sm font-semibold text-foreground mb-6">
              One system. Complete lead-to-appointment automation.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Voxaris handles every step from first contact to confirmed appointment — automatically, consistently, and professionally.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="flex gap-6 lg:gap-8 items-start"
              >
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center">
                    <step.icon className="h-6 w-6" />
                  </div>
                </div>
                <div className="flex-1 pb-8 border-b border-border last:border-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm text-muted-foreground font-medium">
                      Step {index + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed max-w-2xl">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-wide text-center">
          <h2 className="text-3xl lg:text-heading font-semibold mb-4">
            Ready to automate your lead-to-appointment process?
          </h2>
          <p className="text-lg text-primary-foreground/70 mb-8 max-w-xl mx-auto">
            See how Voxaris can transform your operations with a personalized demo.
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
    </Layout>
  );
}
