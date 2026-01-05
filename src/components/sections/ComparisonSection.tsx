import { motion } from "framer-motion";
import { Check, X, AlertCircle } from "lucide-react";

const comparisons = [
  {
    feature: "Response time",
    manual: "Minutes to hours",
    otherAI: "Text-only, delayed",
    voxaris: "Under 3 seconds"
  },
  {
    feature: "Channels",
    manual: "Phone only during hours",
    otherAI: "Text/chat only",
    voxaris: "Voice + SMS + Web chat"
  },
  {
    feature: "Appointment booking",
    manual: "Manual calendar entry",
    otherAI: "Basic or none",
    voxaris: "Direct calendar integration"
  },
  {
    feature: "CRM integration",
    manual: "Manual data entry",
    otherAI: "Basic logging",
    voxaris: "Deep CRM sync"
  },
  {
    feature: "Lead attribution",
    manual: "Spreadsheet tracking",
    otherAI: "None",
    voxaris: "Full source attribution"
  },
  {
    feature: "Setup time",
    manual: "2-4 weeks to hire & train",
    otherAI: "DIY configuration",
    voxaris: "48-hour deployment"
  },
  {
    feature: "Annual cost",
    manual: "$35K-$50K+ per person",
    otherAI: "Varies widely",
    voxaris: "Custom, outcome-based"
  }
];

export default function ComparisonSection() {
  return (
    <section className="section-padding bg-secondary/30">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-heading font-semibold text-foreground mb-4">
            Voxaris vs. the alternatives
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how Voxaris compares to manual processes and other AI tools.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="overflow-x-auto"
        >
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 font-medium text-muted-foreground"></th>
                <th className="text-center py-4 px-4 font-medium text-muted-foreground">Manual Process</th>
                <th className="text-center py-4 px-4 font-medium text-muted-foreground">Other AI Tools</th>
                <th className="text-center py-4 px-4 font-semibold text-primary">Voxaris</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((row, index) => (
                <tr key={row.feature} className="border-b border-border/50">
                  <td className="py-4 px-4 font-medium text-foreground">{row.feature}</td>
                  <td className="py-4 px-4 text-center text-sm text-muted-foreground">{row.manual}</td>
                  <td className="py-4 px-4 text-center text-sm text-muted-foreground">{row.otherAI}</td>
                  <td className="py-4 px-4 text-center text-sm font-medium text-foreground bg-primary/5">{row.voxaris}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
