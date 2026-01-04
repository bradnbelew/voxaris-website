import { motion } from "framer-motion";
import { Target, Wrench, Zap, Scale, Mic } from "lucide-react";

const differentiators = [
  {
    icon: Target,
    title: "Outcome-driven, not tool-driven",
    description: "We don't sell AI minutes or dashboard access. We deliver booked appointments and clean pipelines."
  },
  {
    icon: Wrench,
    title: "Designed, installed, and managed",
    description: "Not another DIY tool. Voxaris is configured for your business and maintained by our team."
  },
  {
    icon: Zap,
    title: "Standardized workflows that convert",
    description: "Proven processes refined across hundreds of implementations, not guesswork."
  },
  {
    icon: Scale,
    title: "Built for scale",
    description: "Deploy across multiple clients, locations, or rooftops with consistent quality."
  },
  {
    icon: Mic,
    title: "Real voice AI, not scripts",
    description: "Maria handles natural conversations, not robotic decision trees."
  }
];

export default function DifferentiationSection() {
  return (
    <section className="section-padding bg-primary text-primary-foreground">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-heading font-semibold mb-4">
            Why Voxaris is different
          </h2>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto">
            Most platforms sell tools. Voxaris delivers outcomes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {differentiators.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`${index === 4 ? 'lg:col-start-2' : ''}`}
            >
              <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center mb-4">
                <item.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {item.title}
              </h3>
              <p className="text-primary-foreground/70 text-sm leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
