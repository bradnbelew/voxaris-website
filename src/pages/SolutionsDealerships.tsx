import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Phone, PhoneOutgoing, PhoneIncoming, Video, Globe, ArrowRight, CheckCircle2, Car, Wrench, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import VIcon from "@/components/ui/VIcon";

const products = [
  {
    icon: PhoneIncoming,
    name: "V·INBOUND",
    tagline: "Inbound Voice AI",
    description: "Answers every call instantly. Handles inquiries, checks real-time DMS inventory, and books appointments on the spot. No hold times, no missed calls.",
    features: ["Real-time DMS inventory check", "Instant appointment booking", "24/7 call handling"],
    cta: "Best for: Service scheduling, sales inquiries"
  },
  {
    icon: PhoneOutgoing,
    name: "V·OUTBOUND",
    tagline: "Outbound Voice AI",
    description: "Proactively calls your customers for recalls, service reminders, and follow-ups. 'Do you have a blue Altima on the lot?' — handled automatically.",
    features: ["Recall & service campaigns", "Lead follow-up in <5 seconds", "Inventory-specific requests"],
    cta: "Best for: Recalls, service reminders, lead response"
  },
  {
    icon: Video,
    name: "V·CVI",
    tagline: "Conversational Video Intelligence",
    description: "Face-to-face AI your customers can see and talk to. Perfect for showroom kiosks, website embeds, and QR codes on mailers. Reads emotions and builds trust.",
    features: ["Sees and responds to facial cues", "Kiosk & website embedded", "QR code activated"],
    cta: "Best for: High-touch showroom experience"
  },
  {
    icon: Globe,
    name: "V·WEB",
    tagline: "AI-Powered Website",
    description: "Your website becomes an active sales agent. Embedded video widgets, real-time inventory integration, and intelligent lead capture that works 24/7.",
    features: ["Living showroom experience", "Real-time inventory display", "Intelligent lead capture"],
    cta: "Best for: Website conversion optimization"
  }
];

const benefits = [
  { stat: "<5s", label: "Response Time", description: "We call while interest is hottest" },
  { stat: "47%", label: "Appointment Rate", description: "On contacted leads" },
  { stat: "24/7", label: "Availability", description: "Never miss a lead again" }
];

const departments = [
  { icon: Car, title: "Sales", description: "Qualify buyers on budget, timeline, and trade-in. Book showroom appointments that actually show." },
  { icon: Wrench, title: "Service", description: "Handle simple to complex repair inquiries with deep mechanical awareness. Knows your shop hours, amenities, and booking logic." },
  { icon: FileText, title: "Parts", description: "Route parts inquiries to the right counter, check availability, and schedule pickup or delivery." }
];

const integrations = ["CDK", "Reynolds", "VinSolutions", "DealerSocket", "AutoTrader", "Cars.com", "Facebook Ads", "Google Ads"];

export default function SolutionsDealerships() {
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
              <span className="eyebrow">Auto Dealerships</span>
            </div>
            
            <h1 className="headline-xl text-ink mb-6">
              The complete AI solution for auto dealerships
            </h1>
            
            <p className="text-xl text-charcoal leading-relaxed mb-10">
              Four products that cover every touchpoint: <strong className="text-ink">Inbound</strong> and <strong className="text-ink">Outbound</strong> voice AI, <strong className="text-ink">face-to-face video AI</strong>, and <strong className="text-ink">intelligent websites</strong>.
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

      {/* Product Differentiation - THE KEY SECTION */}
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
              Every customer touchpoint handled by AI that works 24/7.
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

      {/* Departments */}
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
              Handle every department
            </h2>
            <p className="text-lg text-charcoal max-w-2xl mx-auto">
              Stop losing revenue to voicemail or unanswered phone calls. Voxaris answers 24/7.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {departments.map((dept, index) => (
              <motion.div
                key={dept.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-8 rounded-2xl border border-frost hover:border-charcoal/20 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-snow flex items-center justify-center mb-6">
                  <dept.icon className="h-6 w-6 text-ink" />
                </div>
                <h3 className="text-xl font-semibold text-ink mb-3">{dept.title}</h3>
                <p className="text-charcoal leading-relaxed">{dept.description}</p>
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
            
            <h2 className="headline-xl text-white mb-6">Ready to fill your showroom?</h2>
            
            <p className="text-lg text-silver max-w-xl mx-auto mb-10">
              See how Voxaris works on YOUR dealership's leads. No commitment.
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
