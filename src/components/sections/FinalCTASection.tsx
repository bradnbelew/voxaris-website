import { motion } from "framer-motion";
import VIcon from "@/components/ui/VIcon";
import VoxarisLivingInterface from "@/components/ui/VoxarisLivingInterface";

export default function FinalCTASection() {
  return (
    <section className="section-padding-lg section-dark">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          {/* V Icon */}
          <div className="flex justify-center mb-8">
            <VIcon size="xl" variant="outline" className="border-white/30 text-white" />
          </div>

          {/* Headline */}
          <h2 className="headline-xl text-white mb-6">
            Experience it yourself.
          </h2>

          {/* Subheadline */}
          <p className="text-lg text-silver max-w-xl mx-auto mb-12">
            Talk to Maria. See the V·Suite in action. Make your decision.
          </p>

          {/* Embedded Demo Experience */}
          <VoxarisLivingInterface />

          {/* Phone number */}
          <p className="mt-8 text-silver text-sm">
            or call <a href="tel:+14078195809" className="text-white hover:underline">(407) 819-5809</a> for a human
          </p>
        </motion.div>
      </div>
    </section>
  );
}
