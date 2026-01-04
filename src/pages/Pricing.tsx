import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Starter",
    description: "For businesses testing AI sales automation",
    price: "Custom",
    features: [
      "Up to 500 calls/month",
      "Single location",
      "Standard qualification logic",
      "CRM integration",
      "Email support"
    ],
    cta: "Get Started",
    featured: false
  },
  {
    name: "Growth",
    description: "For established businesses scaling operations",
    price: "Custom",
    features: [
      "Up to 2,500 calls/month",
      "Up to 5 locations",
      "Custom qualification workflows",
      "Advanced CRM integration",
      "SMS confirmations & reminders",
      "Priority support",
      "Monthly performance reviews"
    ],
    cta: "Get Started",
    featured: true
  },
  {
    name: "Enterprise",
    description: "For agencies and multi-location operators",
    price: "Custom",
    features: [
      "Unlimited calls",
      "Unlimited locations",
      "White-label options",
      "Custom AI training",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantee",
      "Quarterly business reviews"
    ],
    cta: "Contact Sales",
    featured: false
  }
];

export default function Pricing() {
  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding bg-secondary/30">
        <div className="container-wide text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl lg:text-display-sm font-semibold text-foreground mb-6">
              Simple, outcome-based pricing
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Voxaris pricing is customized based on your volume, locations, and requirements. Every plan includes full deployment and ongoing management.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Plans */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`rounded-3xl p-8 ${
                  plan.featured 
                    ? 'bg-primary text-primary-foreground border-2 border-primary' 
                    : 'bg-card border border-border'
                }`}
              >
                <h3 className={`text-xl font-semibold mb-2 ${
                  plan.featured ? 'text-primary-foreground' : 'text-foreground'
                }`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-6 ${
                  plan.featured ? 'text-primary-foreground/70' : 'text-muted-foreground'
                }`}>
                  {plan.description}
                </p>
                <div className={`text-3xl font-bold mb-6 ${
                  plan.featured ? 'text-primary-foreground' : 'text-foreground'
                }`}>
                  {plan.price}
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                        plan.featured ? 'text-primary-foreground/80' : 'text-foreground'
                      }`} />
                      <span className={`text-sm ${
                        plan.featured ? 'text-primary-foreground/90' : 'text-muted-foreground'
                      }`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link to="/book-demo">
                  <Button 
                    variant={plan.featured ? "secondary" : "hero"}
                    className={`w-full ${
                      plan.featured 
                        ? 'bg-primary-foreground text-primary hover:bg-primary-foreground/90' 
                        : ''
                    }`}
                    size="lg"
                  >
                    {plan.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-secondary/30">
        <div className="container-wide max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-semibold text-foreground mb-4">
              Common questions
            </h2>
          </motion.div>

          <div className="space-y-8">
            {[
              {
                q: "How is pricing determined?",
                a: "Pricing is based on your expected call volume, number of locations, and specific requirements. We'll provide a custom quote during your demo."
              },
              {
                q: "Is there a setup fee?",
                a: "Setup and deployment are included in all plans. We handle the configuration, integration, and training — you just provide access to your systems."
              },
              {
                q: "What's included in ongoing management?",
                a: "All plans include monitoring, maintenance, and optimization. Enterprise plans include a dedicated account manager and quarterly business reviews."
              },
              {
                q: "Can I change plans?",
                a: "Yes. As your volume or needs change, we can adjust your plan accordingly. Upgrades take effect immediately."
              },
              {
                q: "What integrations are included?",
                a: "We integrate with major CRMs, calendar systems, and communication platforms. Custom integrations are available on Enterprise plans."
              }
            ].map((faq, index) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="border-b border-border pb-6 last:border-0"
              >
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {faq.q}
                </h3>
                <p className="text-muted-foreground">
                  {faq.a}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-wide text-center">
          <h2 className="text-3xl lg:text-heading font-semibold text-foreground mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Book a demo to discuss your requirements and get a custom quote.
          </p>
          <Link to="/book-demo">
            <Button variant="hero" size="xl">
              Book a Demo
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
