import { motion } from "framer-motion";
import { Video, Zap, Globe, MessageSquare, Smartphone, Eye } from "lucide-react";

const features = [
  {
    icon: Video,
    title: "Face-to-Face, Anywhere",
    description: "Synchronous dialogue. No scheduling. No waiting."
  },
  {
    icon: Smartphone,
    title: "Outbound Intelligence",
    description: "Messages that respond. Personalized triggers that adapt."
  },
  {
    icon: Eye,
    title: "Visual Understanding",
    description: "Show, don't tell. Context at a glance."
  },
  {
    icon: MessageSquare,
    title: "Natural Latency",
    description: "Sub-second response. Real dialogue rhythm."
  },
  {
    icon: Zap,
    title: "Adaptive Presence",
    description: "Every interaction is contextual. Precision response."
  },
  {
    icon: Globe,
    title: "Universal Delivery",
    description: "Web. Mobile. SMS. QR. Everywhere."
  }
];

export default function CVISection() {
  return (
    <section id="cvi-section" className="section-padding relative bg-secondary/50">
      <div className="container-editorial">
        {/* Section header */}
        <div className="max-w-2xl mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground mb-4">
              <Video className="w-4 h-4" />
              Core Technology
            </span>
            
            <h2 className="headline-lg text-foreground mb-4">
              The Living Interface
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Beyond automation. Beyond chatbots. An intelligent layer that sees, hears, and responds—in real time.
            </p>
          </motion.div>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-6 bg-background rounded-xl border border-border hover:border-foreground/20 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-4">
                <feature.icon className="h-5 w-5 text-foreground" />
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

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            { value: "<200ms", label: "Response Time" },
            { value: "24/7", label: "Always On" },
            { value: "0", label: "Hallucinations" },
            { value: "∞", label: "Scale" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center p-6 bg-background rounded-xl border border-border"
            >
              <p className="text-3xl font-bold text-foreground mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
