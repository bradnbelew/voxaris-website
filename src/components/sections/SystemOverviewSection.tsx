import { motion } from "framer-motion";
import { Phone, Globe, PhoneOutgoing, CheckSquare, Calendar, Database, Bell, RefreshCw } from "lucide-react";

const steps = [
  { icon: Phone, label: "Inbound Calls", description: "Answer every call instantly" },
  { icon: Globe, label: "Web Forms", description: "Capture and respond in seconds" },
  { icon: PhoneOutgoing, label: "Outbound AI Calls", description: "Maria calls leads automatically" },
  { icon: CheckSquare, label: "Qualification", description: "Custom logic, consistent results" },
  { icon: Calendar, label: "Appointment Booking", description: "Real-time calendar sync" },
  { icon: Database, label: "CRM Updates", description: "Clean, structured data" },
  { icon: Bell, label: "Confirmations", description: "SMS and email reminders" },
  { icon: RefreshCw, label: "Follow-up", description: "Until conversion or closure" },
];

export default function SystemOverviewSection() {
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
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 block">
            One Unified System
          </span>
          <h2 className="text-3xl lg:text-heading font-semibold text-foreground mb-4">
            From first contact to booked appointment
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Voxaris owns the entire lead-to-appointment lifecycle. Every touchpoint is handled automatically, consistently, and professionally.
          </p>
        </motion.div>

        {/* System Flow */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-border -translate-y-1/2" />
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mb-3 relative z-10">
                  <step.icon className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-medium text-foreground mb-1">
                  {step.label}
                </h4>
                <p className="text-xs text-muted-foreground leading-tight">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
