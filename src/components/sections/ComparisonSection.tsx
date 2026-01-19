import { motion } from "framer-motion";
import { Check, X, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type FeatureValue = boolean | "partial";

interface Feature {
  name: string;
  voiceAI: FeatureValue;
  voxaris: FeatureValue;
}

const features: Feature[] = [
  { name: "Can see you", voiceAI: false, voxaris: true },
  { name: "Knows when you're confused", voiceAI: false, voxaris: true },
  { name: "Reacts to your expressions", voiceAI: false, voxaris: true },
  { name: "Doesn't interrupt you", voiceAI: "partial", voxaris: true },
  { name: "Books appointments for you", voiceAI: true, voxaris: true },
  { name: "Available anytime", voiceAI: true, voxaris: true },
  { name: "Works from a QR code", voiceAI: false, voxaris: true },
];

function FeatureIndicator({ value }: { value: FeatureValue }) {
  if (value === true) {
    return (
      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
        <Check className="w-4 h-4 text-green-600" />
      </div>
    );
  }
  if (value === "partial") {
    return (
      <div className="w-8 h-8 rounded-full bg-mist flex items-center justify-center">
        <Minus className="w-4 h-4 text-slate" />
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-mist flex items-center justify-center">
      <X className="w-4 h-4 text-slate" />
    </div>
  );
}

export default function ComparisonSection() {
  return (
    <section className="section-padding bg-mist">
      <div className="container-wide max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="headline-lg text-ink">
            Why face-to-face matters
          </h2>
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
          <div className="grid grid-cols-3 gap-4 p-6 border-b border-frost bg-mist">
            <div className="text-sm font-medium text-slate uppercase tracking-wide">Feature</div>
            <div className="text-center">
              <p className="text-sm font-medium text-slate uppercase tracking-wide">Voice AI</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-ink uppercase tracking-wide">Voxaris</p>
            </div>
          </div>

          {/* Feature Rows */}
          <div className="divide-y divide-frost">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                className={`grid grid-cols-3 gap-4 py-4 px-6 ${index % 2 === 0 ? 'bg-white' : 'bg-snow'}`}
              >
                <div className="text-sm text-ink font-medium flex items-center">
                  {feature.name}
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

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-10"
        >
          <Link to="/demo">
            <Button className="bg-ink hover:bg-charcoal text-white rounded-full px-8 h-12 font-medium">
              Experience the difference
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
