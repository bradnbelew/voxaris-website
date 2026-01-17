import { motion } from "framer-motion";
import { Sparkles, Eye, Zap } from "lucide-react";

const features = [
  {
    id: "v-render",
    label: "V-RENDER",
    model: "Phoenix-4",
    title: "Digital Humans That Feel Human",
    description: "Full-face neural rendering with micro-expressions, pixel-perfect lip sync, and identity preservation. The first model that eliminates the uncanny valley.",
    icon: Sparkles,
    stat: "2 min",
    statLabel: "Training time",
    gradient: "from-emerald-500/20 to-transparent",
  },
  {
    id: "v-sense",
    label: "V-SENSE",
    model: "Raven-1",
    title: "AI That Actually Sees You",
    description: "Real-time emotion detection, body language interpretation, and engagement monitoring. Distinguishes politeness from genuine interest.",
    icon: Eye,
    stat: "500ms",
    statLabel: "Perception latency",
    gradient: "from-cyan-500/20 to-transparent",
  },
  {
    id: "v-flow",
    label: "V-FLOW",
    model: "Sparrow-1",
    title: "Conversations That Feel Natural",
    description: "Intelligent turn-taking with sub-second response times. Handles interruptions, knows when to pause, when to speak. Adapts to individual speaking patterns.",
    icon: Zap,
    stat: "50%",
    statLabel: "Engagement lift",
    gradient: "from-violet-500/20 to-transparent",
  },
];

export default function VSuiteSection() {
  return (
    <section id="vsuite" className="relative section-padding overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      
      <div className="container-editorial relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="eyebrow mb-4 block">The V-Suite</span>
          <h2 className="headline-lg text-foreground mb-6">
            Three systems. One human experience.
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powered by the only neural rendering stack that makes AI indistinguishable from real human interaction.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group relative"
            >
              <div className="glass-card p-8 h-full card-hover">
                {/* Gradient glow on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
                
                <div className="relative">
                  {/* Icon & Labels */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:shadow-glow transition-shadow duration-300">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <span className="font-mono text-sm text-primary tracking-widest uppercase font-bold">
                        {feature.label}
                      </span>
                      <p className="text-xs text-muted-foreground font-mono">
                        {feature.model}
                      </p>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-foreground mb-4">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {feature.description}
                  </p>

                  {/* Stat */}
                  <div className="pt-6 border-t border-border/30">
                    <p className="text-3xl font-bold text-primary font-display">
                      {feature.stat}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {feature.statLabel}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 glass-card p-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "~500ms", label: "End-to-End Latency" },
              { value: "30+", label: "Languages Supported" },
              { value: "2B+", label: "Interactions at Scale" },
              { value: "80%", label: "Higher Retention" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="text-center"
              >
                <p className="text-2xl lg:text-3xl font-bold text-foreground font-display">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Compliance badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-4 mt-10"
        >
          {["SOC 2 Certified", "HIPAA Compliant", "GDPR Compliant"].map((badge) => (
            <span key={badge} className="px-4 py-2 glass rounded-full text-xs text-muted-foreground font-medium">
              {badge}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
