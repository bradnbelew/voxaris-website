import { motion } from "framer-motion";
import { X, Check } from "lucide-react";

const comparisons = [
  {
    promised: "It'll feel like talking to a person",
    delivered: "It feels like talking to a menu",
  },
  {
    promised: "It'll understand what you need",
    delivered: "It only understands keywords",
  },
  {
    promised: "It'll save you time",
    delivered: "You're still on hold",
  },
  {
    promised: "It'll be just like the real thing",
    delivered: "It's really, really not",
  },
];

export default function GapSection() {
  return (
    <section className="relative section-padding overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
      
      <div className="container-editorial relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="eyebrow mb-4 block">The Problem</span>
          <h2 className="headline-lg text-foreground mb-6 max-w-3xl mx-auto">
            They said it would be easy.
            <br />
            <span className="text-muted-foreground">It wasn't.</span>
          </h2>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto mb-16"
        >
          <div className="glass-card overflow-hidden">
            {/* Header Row */}
            <div className="grid grid-cols-2 gap-4 p-4 border-b border-border/50 bg-card/50">
              <div className="text-sm font-medium text-primary flex items-center gap-2">
                <Check className="w-4 h-4" />
                What They Promised
              </div>
              <div className="text-sm font-medium text-destructive/80 flex items-center gap-2">
                <X className="w-4 h-4" />
                What You Got
              </div>
            </div>

            {/* Comparison Rows */}
            <div className="divide-y divide-border/30">
              {comparisons.map((item, index) => (
                <motion.div
                  key={item.promised}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="grid grid-cols-2 gap-4 p-4"
                >
                  <div className="text-sm text-foreground">{item.promised}</div>
                  <div className="text-sm text-muted-foreground line-through decoration-destructive/30">
                    {item.delivered}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Transition Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <p className="text-xl text-muted-foreground mb-4">
            Most "AI assistants" are just fancy phone trees.
          </p>
          <h3 className="text-2xl font-bold text-foreground">
            Voxaris is different.
          </h3>
          <div className="mt-8 flex justify-center">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2"
            >
              <div className="w-1.5 h-3 rounded-full bg-primary" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
