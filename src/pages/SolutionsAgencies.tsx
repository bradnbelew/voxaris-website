import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Megaphone, TrendingUp, Users, Layers, DollarSign, BarChart3, ArrowRight, Zap, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const benefits = [
  {
    icon: TrendingUp,
    title: "Higher conversion rates for clients",
    description: "When leads are responded to instantly and followed up consistently, conversion rates soar. Deliver better results to every client."
  },
  {
    icon: DollarSign,
    title: "New revenue stream",
    description: "Deploy Voxaris as a value-add service or resell it as white-label infrastructure. Either way, it's recurring revenue."
  },
  {
    icon: Layers,
    title: "White-label and semi-white-label options",
    description: "Brand Voxaris as your own solution or co-brand it. Flexible deployment to match your agency model."
  },
  {
    icon: Users,
    title: "Scale across clients effortlessly",
    description: "Deploy the same proven system across 5 clients or 500. Consistent quality, minimal management overhead."
  },
  {
    icon: BarChart3,
    title: "Real attribution data",
    description: "Finally prove which campaigns actually book appointments — not just generate clicks. Close the loop for clients."
  },
  {
    icon: Zap,
    title: "Faster speed-to-lead",
    description: "Your clients' leads get called within seconds of form submission. The difference between winning and losing the sale."
  }
];

const useCases = [
  "Meta and Google Ads campaigns with instant lead follow-up",
  "Mailer and direct mail response automation",
  "Outbound campaign appointment setting",
  "Client onboarding and demo scheduling",
  "Event and webinar registration follow-up"
];

export default function SolutionsAgencies() {
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
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-6">
              <Megaphone className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl lg:text-display-sm font-semibold text-foreground mb-6">
              Voxaris for Marketing Agencies
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Running Meta, Google, or outbound campaigns? Voxaris gives you higher conversion rates for your clients — and a new revenue stream for your agency.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-heading font-semibold text-foreground mb-4">
              Why agencies choose Voxaris
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stop losing leads to slow follow-up. Start delivering infrastructure that actually converts.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded-2xl border border-border p-6"
              >
                <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center mb-4">
                  <benefit.icon className="h-5 w-5 text-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-heading font-semibold mb-6">
                Deploy across all campaign types
              </h2>
              <p className="text-lg text-primary-foreground/70 mb-8">
                Voxaris works with any lead source. Every form submission, every call, every inquiry gets instant, professional response.
              </p>
              <ul className="space-y-4">
                {useCases.map((useCase) => (
                  <li key={useCase} className="flex items-center gap-3">
                    <RefreshCw className="h-5 w-5 text-primary-foreground/60 flex-shrink-0" />
                    <span className="text-primary-foreground/90">{useCase}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-primary-foreground/5 rounded-3xl p-8 lg:p-10"
            >
              <h3 className="text-xl font-semibold mb-4">The Agency Advantage</h3>
              <p className="text-primary-foreground/70 mb-6">
                Most agencies sell marketing services. With Voxaris, you can sell sales infrastructure — a stickier, higher-value offering that creates recurring revenue and deeper client relationships.
              </p>
              <div className="flex items-center gap-4 pt-4 border-t border-primary-foreground/10">
                <div className="text-center flex-1">
                  <div className="text-3xl font-bold mb-1">3x</div>
                  <div className="text-xs text-primary-foreground/60 uppercase tracking-wider">Conversion Lift</div>
                </div>
                <div className="text-center flex-1">
                  <div className="text-3xl font-bold mb-1">&lt;10s</div>
                  <div className="text-xs text-primary-foreground/60 uppercase tracking-wider">Response Time</div>
                </div>
                <div className="text-center flex-1">
                  <div className="text-3xl font-bold mb-1">24/7</div>
                  <div className="text-xs text-primary-foreground/60 uppercase tracking-wider">Availability</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-wide text-center">
          <h2 className="text-3xl lg:text-heading font-semibold text-foreground mb-4">
            Ready to upgrade your agency offering?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            See how Voxaris can help you deliver better results and create new revenue streams.
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
