import { motion } from "framer-motion";
import { 
  Zap, 
  UserCheck, 
  PhoneOutgoing, 
  Database, 
  FileText, 
  RefreshCw, 
  Bell, 
  BarChart3 
} from "lucide-react";

const deliverables = [
  {
    icon: Zap,
    title: "Instant response to inbound leads",
    description: "Every call answered immediately. No hold times, no voicemail."
  },
  {
    icon: UserCheck,
    title: "Maria qualifies and guides to booking",
    description: "Professional qualification with custom logic built for your business."
  },
  {
    icon: PhoneOutgoing,
    title: "Speed-to-lead outbound calling",
    description: "Calls placed within seconds of form submission."
  },
  {
    icon: Database,
    title: "Clean CRM records and stages",
    description: "Structured data pushed directly to your CRM with proper tagging."
  },
  {
    icon: FileText,
    title: "Call summaries and data capture",
    description: "Every conversation documented with key fields extracted."
  },
  {
    icon: RefreshCw,
    title: "Automated follow-up until booked",
    description: "Persistent, respectful follow-up sequences that convert."
  },
  {
    icon: Bell,
    title: "Internal team notifications",
    description: "Real-time alerts when appointments are booked or action is needed."
  },
  {
    icon: BarChart3,
    title: "Reliable reporting and visibility",
    description: "Clear metrics on calls, bookings, and pipeline movement."
  }
];

export default function DeliverablesSection() {
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
          <h2 className="text-3xl lg:text-heading font-semibold text-foreground mb-4">
            What you get with Voxaris
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Outcomes, not features. Everything your team needs to convert more leads into booked appointments.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {deliverables.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2 leading-snug">
                {item.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
