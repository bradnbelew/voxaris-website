import { motion } from "framer-motion";
import { PhoneMissed, Clock, Snowflake, Users, Database, RefreshCcw } from "lucide-react";

const problems = [
  {
    icon: PhoneMissed,
    title: "Missed calls",
    description: "Inbound calls go unanswered. Potential customers move on."
  },
  {
    icon: Clock,
    title: "Slow speed-to-lead",
    description: "Minutes matter. Your team responds in hours — or days."
  },
  {
    icon: Users,
    title: "Inconsistent qualification",
    description: "Different reps ask different questions. Pipeline quality varies."
  },
  {
    icon: Snowflake,
    title: "Leads go cold",
    description: "Without instant engagement, interested prospects lose momentum."
  },
  {
    icon: Database,
    title: "Messy CRM records",
    description: "Incomplete data, missing notes, duplicate entries."
  },
  {
    icon: RefreshCcw,
    title: "No consistent follow-up",
    description: "Leads slip through the cracks. No system to re-engage."
  }
];

export default function ProblemSection() {
  return (
    <section className="section-padding bg-secondary/30">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-heading font-semibold text-foreground mb-4">
            The reality of lead management
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Most businesses lose leads before they ever become customers — not because the leads are bad, but because the response is.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="bg-card rounded-2xl p-6 border border-border hover:border-border/80 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4">
                <problem.icon className="h-6 w-6 text-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {problem.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
