import { motion } from "framer-motion";
import { Sparkles, Eye, Zap } from "lucide-react";

const capabilities = [
  {
    id: "render",
    label: "RENDER",
    subtitle: "Neural Video Generation",
    description: "Full-face rendering with micro-expressions and pixel-perfect lip sync. No uncanny valley.",
    icon: Sparkles,
    stat: "500ms",
    statLabel: "response time",
  },
  {
    id: "sense",
    label: "SENSE",
    subtitle: "Visual Perception",
    description: "Real-time emotion detection. Reads engagement, confusion, interest — and adapts.",
    icon: Eye,
    stat: "Real-time",
    statLabel: "analysis",
  },
  {
    id: "flow",
    label: "FLOW",
    subtitle: "Conversational Timing",
    description: "Knows when to speak, when to listen, when to pause. Natural turn-taking.",
    icon: Zap,
    stat: "50%",
    statLabel: "engagement lift",
  },
];

export default function TechnologySection() {
  return (
    <section className="section-padding section-dark">
      <div className="container-editorial">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-silver mb-4 block">
            The Technology
          </span>
          <h2 className="headline-lg text-white mb-4">
            Conversational Video Intelligence
          </h2>
          <p className="text-lg text-silver max-w-xl mx-auto">
            Three systems working together.
          </p>
        </motion.div>

        {/* Capability Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {capabilities.map((cap, index) => (
            <motion.div
              key={cap.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-8"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mb-6">
                <cap.icon className="w-6 h-6 text-white" />
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-white mb-1 tracking-wide">
                {cap.label}
              </h3>
              <p className="text-sm text-silver mb-4">
                {cap.subtitle}
              </p>

              {/* Description */}
              <p className="text-silver leading-relaxed mb-8">
                {cap.description}
              </p>

              {/* Stat */}
              <div className="pt-6 border-t border-white/10">
                <p className="text-2xl font-bold text-white">
                  {cap.stat}
                </p>
                <p className="text-sm text-silver mt-1">
                  {cap.statLabel}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
