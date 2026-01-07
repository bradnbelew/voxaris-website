import { motion } from "framer-motion";
import { Clock, Car, Wrench, Home, Calendar, DollarSign } from "lucide-react";

const industryProblems = [
  {
    icon: Car,
    industry: "Auto Dealerships",
    problem: "Weekend leads dying before Monday",
    description: "Sales events generate hundreds of leads that go cold waiting for BDC teams to return."
  },
  {
    icon: Wrench,
    industry: "Home Services",
    problem: "Emergency calls going to competitors",
    description: "When the AC breaks at 2 AM, the first company to answer wins the job."
  },
  {
    icon: Home,
    industry: "Real Estate",
    problem: "Open house leads cooling before follow-up",
    description: "By the time you call back, they've toured three other properties."
  },
  {
    icon: Calendar,
    industry: "Event Promoters",
    problem: "Ticket inquiries unanswered for hours",
    description: "Limited-time offers expire while potential buyers wait for responses."
  }
];

const lostRevenueStats = [
  { stat: "78%", description: "of leads go to the first responder" },
  { stat: "5 min", description: "response time drops conversion by 80%" },
  { stat: "35-50%", description: "of sales go to vendor that responds first" }
];

export default function ProblemSection() {
  return (
    <section className="section-padding bg-secondary/30">
      <div className="container-wide">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 text-sm font-medium text-destructive mb-4">
            <DollarSign className="w-4 h-4" />
            Revenue Leak Alert
          </div>
          <h2 className="text-3xl lg:text-heading font-semibold text-foreground mb-4">
            Are You Losing Money to Slow Response Times?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every industry that runs campaigns faces the same problem: leads cool fast. Speed-to-lead isn't a nice-to-have — it's the difference between winning and losing.
          </p>
        </motion.div>

        {/* Industry-specific problems grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {industryProblems.map((item, index) => (
            <motion.div
              key={item.industry}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="bg-card rounded-2xl p-6 lg:p-8 border border-border hover:border-destructive/30 transition-colors group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center flex-shrink-0 group-hover:bg-destructive/15 transition-colors">
                  <item.icon className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                    {item.industry}
                  </span>
                  <h3 className="text-lg font-semibold text-foreground mt-1 mb-2">
                    "{item.problem}"
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-card rounded-2xl border border-border p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {lostRevenueStats.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <span className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                  {item.stat}
                </span>
                <span className="text-sm text-muted-foreground">
                  {item.description}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Solution teaser */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-primary/5 border border-primary/10">
            <Clock className="h-5 w-5 text-primary" />
            <span className="text-foreground font-medium">
              Voxaris solves this with instant 24/7 contact. We're your always-on first touch.
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
