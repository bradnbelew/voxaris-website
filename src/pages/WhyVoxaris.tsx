import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Target, Layers, TrendingUp, Users, Zap, BarChart3, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const reasons = [
  {
    icon: Target,
    title: "We sell outcomes, not tools",
    description: "While others sell AI minutes and dashboard access, Voxaris delivers booked appointments and clean pipelines. You pay for results."
  },
  {
    icon: Layers,
    title: "End-to-end system, not point solution",
    description: "Voxaris owns the entire lead-to-appointment lifecycle. No integrating five tools. No gaps. One system handles everything."
  },
  {
    icon: TrendingUp,
    title: "Designed, installed, and managed",
    description: "This isn't DIY automation software. We configure Voxaris for your business, deploy it, and maintain it. You get infrastructure, not homework."
  },
  {
    icon: Users,
    title: "Built for scale",
    description: "Whether you're an agency with 50 clients or a dealer group with 30 rooftops, Voxaris scales with consistent quality across every deployment."
  },
  {
    icon: Zap,
    title: "Real AI, not decision trees",
    description: "Maria handles natural conversations with nuance and intelligence — not scripted robotic responses that frustrate prospects."
  },
  {
    icon: BarChart3,
    title: "True attribution and reporting",
    description: "Finally know which campaigns, channels, and sources actually book appointments — not just generate leads."
  }
];

export default function WhyVoxaris() {
  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding bg-secondary/30">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 block">
              Why Voxaris
            </span>
            <h1 className="text-4xl lg:text-display-sm font-semibold text-foreground mb-6">
              Infrastructure that delivers outcomes, not just features
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Voxaris is fundamentally different from chatbots, basic voice tools, and DIY automation platforms. Here's why serious operators choose us.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Reasons */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reasons.map((reason, index) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded-2xl border border-border p-8"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-5">
                  <reason.icon className="h-6 w-6 text-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {reason.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {reason.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-heading font-semibold mb-4">
              What you get with Voxaris
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-primary-foreground/5 rounded-2xl p-8">
              <h3 className="text-lg font-semibold mb-4 text-primary-foreground/50">
                What others sell
              </h3>
              <ul className="space-y-3">
                {["AI minutes", "Dashboard access", "DIY automation builder", "Scripts and templates", "Support tickets"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-primary-foreground/60">
                    <span className="w-4 h-px bg-primary-foreground/30" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-primary-foreground/10 rounded-2xl p-8 border border-primary-foreground/20">
              <h3 className="text-lg font-semibold mb-4">
                What Voxaris delivers
              </h3>
              <ul className="space-y-3">
                {["Booked appointments", "Clean CRM pipelines", "Instant lead response", "Automated follow-up", "Real attribution data"].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-wide text-center">
          <h2 className="text-3xl lg:text-heading font-semibold text-foreground mb-4">
            See the difference for yourself
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Book a demo to experience how Voxaris transforms lead response into booked revenue.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book-demo">
              <Button variant="hero" size="xl">
                Book a Demo
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/demo">
              <Button variant="heroOutline" size="xl">
                Try the Live Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
