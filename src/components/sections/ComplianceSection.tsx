import { motion } from "framer-motion";
import { Shield, Lock, Globe, Clock } from "lucide-react";

const badges = [
  { icon: Shield, label: "SOC 2" },
  { icon: Lock, label: "HIPAA" },
  { icon: Globe, label: "GDPR" },
  { icon: Clock, label: "99.9% Uptime" },
];

export default function ComplianceSection() {
  return (
    <section className="section-padding bg-background">
      <div className="container-editorial">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="headline-md text-foreground mb-2">
            Enterprise-ready from day one.
          </h2>
          <p className="text-muted-foreground">
            Security and compliance built into every layer.
          </p>
        </motion.div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-6"
        >
          {badges.map((badge, index) => (
            <div
              key={badge.label}
              className="flex items-center gap-3 px-6 py-4 bg-mist rounded-lg border border-frost"
            >
              <badge.icon className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium text-foreground">{badge.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
