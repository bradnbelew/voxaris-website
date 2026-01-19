import { motion } from "framer-motion";
import { Sparkles, Eye, Zap } from "lucide-react";

const capabilities = [
  {
    id: "render",
    label: "LOOKS REAL",
    subtitle: "You'd never know it's AI",
    description: "Facial expressions, natural movements, lips that actually match the words. It looks like a video call with a real person.",
    icon: Sparkles,
    stat: "500ms",
    statLabel: "response time",
  },
  {
    id: "sense",
    label: "SEES YOU",
    subtitle: "Picks up on how you're feeling",
    description: "Notices when you're confused, interested, or ready to move on—and adjusts in real time.",
    icon: Eye,
    stat: "Real-time",
    statLabel: "reads your reactions",
  },
  {
    id: "flow",
    label: "TALKS NATURALLY",
    subtitle: "No interruptions or weird delays",
    description: "Knows when to talk, when to listen, when to give you a moment. Just like a real conversation.",
    icon: Zap,
    stat: "50%",
    statLabel: "more engaging",
  },
];

export default function TechnologySection() {
  return (
    <section className="section-padding section-dark">
      <div className="container-wide">
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
            How it actually works
          </h2>
          <p className="text-lg text-silver max-w-xl mx-auto">
            Three things that make it feel human.
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
