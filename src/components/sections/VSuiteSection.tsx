import { motion } from "framer-motion";
import { Eye, Brain, Waves } from "lucide-react";

const features = [
  {
    id: "v-sync",
    label: "V-SYNC",
    title: "3D Neural Rendering",
    subtitle: "The Face",
    description: "Captures micro-expressions, cheek movements, and ocular crinkles. Eliminates the uncanny valley—your digital twin is indistinguishable from the real person.",
    icon: Waves,
    gradient: "from-emerald-500/20 to-transparent",
  },
  {
    id: "v-sight",
    label: "V-SIGHT",
    title: "Real-Time AI Vision",
    subtitle: "The Eyes",
    description: "Your AI agent 'sees' the customer. Detects engagement, eye contact, and emotional cues. Pivots the conversation if they look confused or uninterested.",
    icon: Eye,
    gradient: "from-cyan-500/20 to-transparent",
  },
  {
    id: "v-flow",
    label: "V-FLOW",
    title: "Transformer Conversation",
    subtitle: "The Brain",
    description: "Manages the human flow of conversation. Handles interruptions naturally and masters the meaningful pause. Fluid, not robotic.",
    icon: Brain,
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
            Conversational Video Intelligence
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three integrated neural engines. One intelligent experience.
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
                  {/* Label */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-mono text-xs text-primary tracking-widest uppercase">
                      {feature.label}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  
                  {/* Subtitle */}
                  <p className="text-sm text-primary/80 font-medium mb-4">
                    {feature.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
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
              { value: "3", label: "Neural Engines" },
              { value: "<200ms", label: "End-to-End Latency" },
              { value: "30+", label: "Languages Supported" },
              { value: "100%", label: "Knowledge Grounded" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl lg:text-4xl font-bold text-primary font-display">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
