import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { PhoneIncoming, PhoneOutgoing, Video, Globe, ArrowRight, CheckCircle2, Layers, BarChart3, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import VIcon from "@/components/ui/VIcon";

const products = [
  {
    icon: PhoneIncoming,
    name: "V·INBOUND",
    tagline: "Inbound Voice AI",
    description: "White-label AI that answers your clients' leads instantly. Each client gets their own custom scripts, qualification logic, and calendar integration.",
    features: ["Per-client customization", "Custom qualification scripts", "Calendar integration"],
    cta: "Best for: Lead qualification, intake"
  },
  {
    icon: PhoneOutgoing,
    name: "V·OUTBOUND",
    tagline: "Outbound Voice AI",
    description: "Proactive follow-up that converts more of the leads you generate. Your clients get better results, you get less churn.",
    features: ["Lead follow-up automation", "Appointment confirmations", "Re-engagement campaigns"],
    cta: "Best for: Lead nurturing, follow-up"
  },
  {
    icon: Video,
    name: "V·CVI",
    tagline: "Conversational Video Intelligence",
    description: "Face-to-face AI your clients can deploy on their websites, kiosks, and QR codes. Premium positioning for premium pricing.",
    features: ["White-label deployment", "Multi-client management", "Premium upsell opportunity"],
    cta: "Best for: High-value client offerings"
  },
  {
    icon: Globe,
    name: "V·WEB",
    tagline: "AI-Powered Website",
    description: "AI sales infrastructure for every client website. Intelligent lead capture that actually converts — not just form fills.",
    features: ["Website conversion optimization", "Intelligent lead capture", "Real-time qualification"],
    cta: "Best for: Website services upsell"
  }
];

const benefits = [
  { stat: "3x", label: "Conversion Lift", description: "Average client improvement" },
  { stat: "<10s", label: "Response Time", description: "Every lead, every time" },
  { stat: "48hr", label: "Deployment", description: "New client to live" }
];

const agencyBenefits = [
  { icon: Layers, title: "White-Label Everything", description: "Your brand, your domain, your client portal. We're invisible to your clients." },
  { icon: BarChart3, title: "Agency Dashboard", description: "See performance across all clients. Which industries convert best, which scripts work, real-time analytics." },
  { icon: DollarSign, title: "Recurring Revenue", description: "You bill the client monthly. We bill you wholesale. Your margin, your pricing." }
];

const integrations = ["GoHighLevel", "HubSpot", "Salesforce", "Pipedrive", "AgencyAnalytics", "DashThis"];

export default function SolutionsAgencies() {
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
              <span className="eyebrow">Agencies</span>
            </div>
            
            <h1 className="headline-xl text-ink mb-6">
              White-label AI sales infrastructure for your clients
            </h1>
            
            <p className="text-xl text-charcoal leading-relaxed mb-10">
              Four products you can resell under your brand: <strong className="text-ink">Inbound</strong> and <strong className="text-ink">Outbound</strong> voice AI, <strong className="text-ink">face-to-face video AI</strong>, and <strong className="text-ink">intelligent websites</strong>.
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
              Stop losing leads to slow follow-up. Start delivering infrastructure that actually converts.
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

      {/* Agency Benefits */}
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
              Built for agencies
            </h2>
            <p className="text-lg text-charcoal max-w-2xl mx-auto">
              We handle the tech. You own the client relationship and margin.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {agencyBenefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-8 rounded-2xl border border-frost hover:border-charcoal/20 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-snow flex items-center justify-center mb-6">
                  <benefit.icon className="h-6 w-6 text-ink" />
                </div>
                <h3 className="text-xl font-semibold text-ink mb-3">{benefit.title}</h3>
                <p className="text-charcoal leading-relaxed">{benefit.description}</p>
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
            <p className="text-charcoal">We integrate with whatever your clients use.</p>
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
            
            <h2 className="headline-xl text-white mb-6">Ready to upgrade your agency offering?</h2>
            
            <p className="text-lg text-silver max-w-xl mx-auto mb-10">
              See how Voxaris can help you deliver better results and create new revenue streams.
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
