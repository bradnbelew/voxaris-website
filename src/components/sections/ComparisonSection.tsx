import { motion } from "framer-motion";
import { Check, X, Minus } from "lucide-react";

type FeatureValue = boolean | "partial";

interface Feature {
  name: string;
  chatbots: FeatureValue;
  voiceAI: FeatureValue;
  voxaris: FeatureValue;
}

const features: Feature[] = [
  { name: "Sees the customer", chatbots: false, voiceAI: false, voxaris: true },
  { name: "Reads body language", chatbots: false, voiceAI: false, voxaris: true },
  { name: "Face-to-face interaction", chatbots: false, voiceAI: false, voxaris: true },
  { name: "Knowledge-grounded", chatbots: "partial", voiceAI: true, voxaris: true },
  { name: "Books appointments", chatbots: "partial", voiceAI: true, voxaris: true },
  { name: "24/7 availability", chatbots: true, voiceAI: true, voxaris: true },
  { name: "Natural conversation flow", chatbots: false, voiceAI: "partial", voxaris: true },
  { name: "Multi-language support", chatbots: true, voiceAI: "partial", voxaris: true },
];

function FeatureIndicator({ value }: { value: FeatureValue }) {
  if (value === true) {
    return (
      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
        <Check className="w-4 h-4 text-primary" />
      </div>
    );
  }
  if (value === "partial") {
    return (
      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
        <Minus className="w-4 h-4 text-muted-foreground" />
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
      <X className="w-4 h-4 text-destructive/70" />
    </div>
  );
}

export default function ComparisonSection() {
  return (
    <section className="relative section-padding">
      <div className="container-editorial">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="eyebrow mb-4 block">The Difference</span>
          <h2 className="headline-lg text-foreground mb-6">
            Not a chatbot. Not a voicemail.
            <br />
            <span className="text-primary">Intelligence.</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how Voxaris CVI compares to traditional solutions.
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card overflow-hidden"
        >
          {/* Header Row */}
          <div className="grid grid-cols-4 gap-4 p-6 border-b border-border/50 bg-card/50">
            <div className="text-sm font-medium text-muted-foreground">Feature</div>
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Chatbots</p>
              <p className="text-xs text-muted-foreground/60">Traditional</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Voice AI</p>
              <p className="text-xs text-muted-foreground/60">Competitors</p>
            </div>
            <div className="text-center relative">
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-primary text-primary-foreground text-[10px] font-medium rounded-full uppercase tracking-wider">
                Best
              </div>
              <p className="text-sm font-bold text-primary mt-2">Voxaris CVI</p>
              <p className="text-xs text-primary/60">Intelligence Layer</p>
            </div>
          </div>

          {/* Feature Rows */}
          <div className="divide-y divide-border/30">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                className="grid grid-cols-4 gap-4 p-6 hover:bg-card/30 transition-colors"
              >
                <div className="text-sm text-foreground font-medium flex items-center">
                  {feature.name}
                </div>
                <div className="flex justify-center items-center">
                  <FeatureIndicator value={feature.chatbots} />
                </div>
                <div className="flex justify-center items-center">
                  <FeatureIndicator value={feature.voiceAI} />
                </div>
                <div className="flex justify-center items-center">
                  <FeatureIndicator value={feature.voxaris} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center text-muted-foreground mt-10"
        >
          Voxaris isn't competing with voice AI companies — we're creating a new category.
        </motion.p>
      </div>
    </section>
  );
}
