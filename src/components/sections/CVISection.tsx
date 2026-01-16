import { motion } from "framer-motion";
import { Video, Zap, Globe, MessageSquare, Smartphone, Eye } from "lucide-react";

const features = [
  {
    icon: Video,
    title: "Face-to-Face, Anywhere",
    description: "A synchronous layer that brings your brand into real-time dialogue. No scheduling. No waiting."
  },
  {
    icon: Smartphone,
    title: "Outbound Intelligence",
    description: "Your messages don't just arrive—they respond. Personalized triggers that adapt to each interaction."
  },
  {
    icon: Eye,
    title: "See What They See",
    description: "Visual understanding built in. Show, don't tell. The interface comprehends context at a glance."
  },
  {
    icon: MessageSquare,
    title: "Natural Latency",
    description: "Conversation that flows. Sub-second response creates the rhythm of real dialogue."
  },
  {
    icon: Zap,
    title: "Adaptive Presence",
    description: "Every interaction is contextual. The interface reads, interprets, and responds with precision."
  },
  {
    icon: Globe,
    title: "Universal Delivery",
    description: "Web. Mobile. SMS. QR. Embedded. Wherever your customers are, the interface follows."
  }
];

export default function CVISection() {
  return (
    <section id="cvi-section" className="section-padding relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-cyan/5 blur-3xl" />

      <div className="container-wide relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm text-cyan font-medium mb-6">
            <Video className="w-4 h-4" />
            Core Technology
          </span>
          
          <h2 className="text-3xl lg:text-heading font-semibold text-foreground mb-4">
            The <span className="gradient-text-cyan">Living Interface</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Beyond automation. Beyond chatbots. An intelligent layer that sees, hears, and responds—in real time.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group glass rounded-2xl p-6 hover:border-cyan/30 hover:shadow-cyan/10 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan/10 flex items-center justify-center mb-4 group-hover:bg-cyan/20 transition-colors">
                <feature.icon className="h-6 w-6 text-cyan" />
              </div>
              
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CVI Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 glass-strong rounded-2xl p-8"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold gradient-text-cyan mb-1">&lt;200ms</p>
              <p className="text-sm text-muted-foreground">Response Latency</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold gradient-text-cyan mb-1">24/7</p>
              <p className="text-sm text-muted-foreground">Availability</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold gradient-text-cyan mb-1">0</p>
              <p className="text-sm text-muted-foreground">Hallucinations</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold gradient-text-cyan mb-1">∞</p>
              <p className="text-sm text-muted-foreground">Concurrent Calls</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
