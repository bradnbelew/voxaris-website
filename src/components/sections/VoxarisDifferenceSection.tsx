import { motion } from "framer-motion";
import { Megaphone, Zap, Target, Settings, Eye, Check, X } from "lucide-react";

const differentiators = [
  {
    icon: Megaphone,
    title: "Campaign-First Design",
    description: "Built for promotions, not just daily operations. Every conversation can reference your specific campaign."
  },
  {
    icon: Zap,
    title: "Speed Architecture",
    description: "Engineered for 22-second response, not 22-minute. Speed is in our DNA, not an afterthought."
  },
  {
    icon: Target,
    title: "Vertical Intelligence",
    description: "Industry-specific conversation patterns. We know how car buyers talk differently than HVAC emergencies."
  },
  {
    icon: Settings,
    title: "Flexible Workflows",
    description: "Adapts to YOUR process, not forces ours. Custom qualification logic, routing rules, and handoff procedures."
  },
  {
    icon: Eye,
    title: "Transparent Results",
    description: "See every call, transcript, and outcome. No black box — full visibility into every interaction."
  }
];

const comparisonPoints = [
  { feature: "22-second response time", voxaris: true, generic: false },
  { feature: "Campaign-aware conversations", voxaris: true, generic: false },
  { feature: "Industry-specific scripts", voxaris: true, generic: false },
  { feature: "Managed service (not DIY)", voxaris: true, generic: false },
  { feature: "After-hours coverage", voxaris: true, generic: true },
  { feature: "CRM integration", voxaris: true, generic: true },
  { feature: "Custom qualification logic", voxaris: true, generic: false },
  { feature: "Show-up confirmation", voxaris: true, generic: false },
];

export default function VoxarisDifferenceSection() {
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
            Why We're Not Another Generic AI Bot
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Most AI solutions are built for answering service. Voxaris is built for converting campaigns.
          </p>
        </motion.div>

        {/* Differentiators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {differentiators.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Comparison table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-card rounded-2xl border border-border overflow-hidden"
        >
          <div className="p-6 lg:p-8 border-b border-border">
            <h3 className="text-xl font-semibold text-foreground">
              Voxaris vs. Generic AI Solutions
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left p-4 font-medium text-foreground">Feature</th>
                  <th className="text-center p-4 font-medium text-foreground w-32">Voxaris</th>
                  <th className="text-center p-4 font-medium text-muted-foreground w-32">Generic AI</th>
                </tr>
              </thead>
              <tbody>
                {comparisonPoints.map((point, index) => (
                  <tr key={point.feature} className={index % 2 === 0 ? "bg-transparent" : "bg-secondary/20"}>
                    <td className="p-4 text-foreground">{point.feature}</td>
                    <td className="p-4 text-center">
                      {point.voxaris ? (
                        <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/20">
                          <Check className="w-4 h-4 text-primary" />
                        </div>
                      ) : (
                        <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-destructive/20">
                          <X className="w-4 h-4 text-destructive" />
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {point.generic ? (
                        <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-muted">
                          <Check className="w-4 h-4 text-muted-foreground" />
                        </div>
                      ) : (
                        <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-destructive/10">
                          <X className="w-4 h-4 text-destructive/70" />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
