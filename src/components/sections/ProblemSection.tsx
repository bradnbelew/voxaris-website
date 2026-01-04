import { motion } from "framer-motion";
import { AlertCircle, Clock, TrendingDown, Users, Database, BarChart2 } from "lucide-react";

const problems = [
  {
    icon: AlertCircle,
    title: "Missed calls",
    description: "Every unanswered call is a potential customer lost to a competitor."
  },
  {
    icon: Clock,
    title: "Slow follow-up",
    description: "Leads go cold in minutes, but your team takes hours — or days — to respond."
  },
  {
    icon: TrendingDown,
    title: "Leads going cold",
    description: "Without instant engagement, interested prospects lose momentum and move on."
  },
  {
    icon: Users,
    title: "Inconsistent qualification",
    description: "Different reps ask different questions, leading to unpredictable pipeline quality."
  },
  {
    icon: Database,
    title: "Messy CRM data",
    description: "Incomplete records, missing notes, and duplicate entries make reporting unreliable."
  },
  {
    icon: BarChart2,
    title: "Lost attribution",
    description: "You're spending on ads but can't trace which campaigns actually book appointments."
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
            The reality of lead management today
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Most businesses lose leads before they ever become customers. Not because the leads are bad — but because the response is.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
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
