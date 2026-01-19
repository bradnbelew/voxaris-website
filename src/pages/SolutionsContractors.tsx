import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { PhoneIncoming, PhoneOutgoing, Video, Globe, ArrowRight, CheckCircle2, Wrench, Zap, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import VIcon from "@/components/ui/VIcon";

const products = [
  {
    icon: PhoneIncoming,
    name: "V·INBOUND",
    tagline: "Inbound Voice AI",
    description: "Answers every call instantly — even when you're on a roof or under a house. Qualifies job type, urgency, and books estimates directly into your calendar.",
    features: ["24/7 emergency call handling", "Job type qualification", "Direct calendar booking"],
    cta: "Best for: Emergency calls, estimate scheduling"
  },
  {
    icon: PhoneOutgoing,
    name: "V·OUTBOUND",
    tagline: "Outbound Voice AI",
    description: "Proactive follow-up on quotes, appointment reminders, and seasonal campaigns. Never lose a job to a faster competitor again.",
    features: ["Quote follow-up automation", "Appointment confirmations", "Seasonal campaign calls"],
    cta: "Best for: Quote follow-up, seasonal campaigns"
  },
  {
    icon: Video,
    name: "V·CVI",
    tagline: "Conversational Video Intelligence",
    description: "Face-to-face AI for your website or marketing materials. QR codes on trucks, yard signs, and mailers connect customers directly to your AI.",
    features: ["QR code activation", "Truck & yard sign integration", "Visual job descriptions"],
    cta: "Best for: High-touch customer experience"
  },
  {
    icon: Globe,
    name: "V·WEB",
    tagline: "AI-Powered Website",
    description: "Your website becomes a 24/7 sales rep. Captures leads, qualifies jobs, and books estimates while you sleep.",
    features: ["Intelligent lead capture", "Service area verification", "Instant estimate booking"],
    cta: "Best for: Website lead conversion"
  }
];

const benefits = [
  { stat: "<3s", label: "Answer Time", description: "We pick up while they're still interested" },
  { stat: "40%", label: "Fewer No-Shows", description: "Automated reminders that work" },
  { stat: "24/7", label: "Availability", description: "Nights, weekends, holidays" }
];

const serviceTypes = [
  { icon: Zap, title: "Emergency Services", description: "Water damage, no heat, electrical hazards — AI triages urgency and fast-tracks your calendar." },
  { icon: Wrench, title: "Planned Projects", description: "Kitchen remodels, HVAC replacements, new roofs — qualify budget and timeline before the estimate." },
  { icon: Clock, title: "Seasonal Campaigns", description: "Storm season, AC tune-ups, winterization — handle volume spikes without extra staff." }
];

const integrations = ["Jobber", "ServiceTitan", "Housecall Pro", "BuildOps", "Google Calendar", "QuickBooks"];

export default function SolutionsContractors() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-white pt-24 pb-16">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <VIcon size="md" variant="gradient" />
              <span className="eyebrow">Contractors</span>
            </div>
            
            <h1 className="headline-xl text-ink mb-6">
              Stop losing emergency calls and last-minute jobs
            </h1>
            
            <p className="text-xl text-charcoal leading-relaxed mb-10">
              Four products that work while you're on the job: <strong className="text-ink">Inbound</strong> and <strong className="text-ink">Outbound</strong> voice AI, <strong className="text-ink">face-to-face video AI</strong>, and <strong className="text-ink">intelligent websites</strong>.
            </p>

            <Button asChild size="lg" className="bg-ink hover:bg-charcoal text-white rounded-full px-8 h-14">
              <Link to="/book-demo">
                Book a Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Product Differentiation */}
      <section className="bg-snow py-20">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="headline-lg text-ink mb-4">
              Four products. Complete coverage.
            </h2>
            <p className="text-lg text-charcoal max-w-2xl mx-auto">
              Never miss a lead. Never play phone tag. Never lose a job to a faster competitor.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl border border-frost p-8 hover:border-charcoal/20 transition-colors"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-ink flex items-center justify-center">
                    <product.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-ink">{product.name}</h3>
                    <p className="text-sm text-charcoal">{product.tagline}</p>
                  </div>
                </div>
                
                <p className="text-charcoal leading-relaxed mb-6">
                  {product.description}
                </p>
                
                <ul className="space-y-3 mb-6">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-ink flex-shrink-0" />
                      <span className="text-charcoal">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <p className="text-sm font-semibold text-ink bg-snow rounded-lg px-4 py-3">
                  {product.cta}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="bg-white py-20">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-8 rounded-2xl border border-frost"
              >
                <p className="text-4xl font-bold text-ink font-display mb-2">{benefit.stat}</p>
                <p className="text-sm font-semibold text-ink uppercase tracking-wider mb-2">{benefit.label}</p>
                <p className="text-sm text-slate">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Types */}
      <section className="section-padding bg-white border-t border-frost">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="headline-lg text-ink mb-4">
              Handle every service type
            </h2>
            <p className="text-lg text-charcoal max-w-2xl mx-auto">
              Whether it's a burst pipe at midnight or a planned renovation, Voxaris handles it all.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {serviceTypes.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-8 rounded-2xl border border-frost hover:border-charcoal/20 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-snow flex items-center justify-center mb-6">
                  <service.icon className="h-6 w-6 text-ink" />
                </div>
                <h3 className="text-xl font-semibold text-ink mb-3">{service.title}</h3>
                <p className="text-charcoal leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="section-padding bg-snow">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="headline-lg text-ink mb-4">Works with your stack</h2>
            <p className="text-charcoal">We connect in hours, not weeks. No IT headache.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mb-8"
          >
            {integrations.map((integration) => (
              <span key={integration} className="px-5 py-3 bg-white rounded-full border border-frost text-ink font-medium">
                {integration}
              </span>
            ))}
          </motion.div>

          <p className="text-center text-charcoal">
            Don't see yours? <Link to="/book-demo" className="text-ink font-medium underline underline-offset-2 hover:no-underline">Let us know</Link> — we'll make it work.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding-lg section-dark">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex justify-center mb-8">
              <VIcon size="xl" variant="outline" className="border-white/30 text-white" />
            </div>
            
            <h2 className="headline-xl text-white mb-6">Ready to book more jobs?</h2>
            
            <p className="text-lg text-silver max-w-xl mx-auto mb-10">
              See how Voxaris works on YOUR contracting leads.
            </p>

            <Button asChild size="lg" className="bg-white hover:bg-snow text-ink font-semibold rounded-full px-10 h-16 text-lg">
              <Link to="/book-demo">
                Book a Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
