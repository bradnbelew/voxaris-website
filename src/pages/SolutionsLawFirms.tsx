import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { PhoneIncoming, PhoneOutgoing, Video, Globe, ArrowRight, CheckCircle2, Scale, Shield, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import VIcon from "@/components/ui/VIcon";

const products = [
  {
    icon: PhoneIncoming,
    name: "V·INBOUND",
    tagline: "Inbound Voice AI",
    description: "Answers every potential client call 24/7. Conducts initial intake screening, checks for conflicts, and books consultations with the right attorney.",
    features: ["24/7 intake availability", "Practice area routing", "Conflict checking integration"],
    cta: "Best for: Client intake, consultation booking"
  },
  {
    icon: PhoneOutgoing,
    name: "V·OUTBOUND",
    tagline: "Outbound Voice AI",
    description: "Proactive follow-up on consultations, case updates, and appointment reminders. Never let a potential client slip through the cracks.",
    features: ["Consultation follow-up", "Case status updates", "Appointment reminders"],
    cta: "Best for: Client follow-up, retention"
  },
  {
    icon: Video,
    name: "V·CVI",
    tagline: "Conversational Video Intelligence",
    description: "Face-to-face AI for sensitive client conversations. Builds trust before the first meeting with empathetic, professional interaction.",
    features: ["Empathetic response training", "Practice area awareness", "Trust-building interaction"],
    cta: "Best for: High-value client acquisition"
  },
  {
    icon: Globe,
    name: "V·WEB",
    tagline: "AI-Powered Website",
    description: "Your website captures and qualifies leads 24/7. Intelligent intake forms that route to the right attorney based on practice area and case type.",
    features: ["Intelligent intake forms", "Practice area routing", "Urgency detection"],
    cta: "Best for: Website lead conversion"
  }
];

const benefits = [
  { stat: "<3s", label: "Answer Time", description: "Every potential client gets immediate response" },
  { stat: "24/7", label: "Availability", description: "Nights, weekends, holidays" },
  { stat: "100%", label: "Intake Consistency", description: "Every call screened properly" }
];

const practiceAreas = [
  { icon: Scale, title: "Personal Injury", description: "Accident details, injury severity, insurance info, statute check — books consultations with the right attorney." },
  { icon: Shield, title: "Family Law", description: "Divorce, custody, support — screens for conflicts with emotional sensitivity training." },
  { icon: Clock, title: "Criminal Defense", description: "Arrest details, charges, court dates — urgent booking priority for time-sensitive matters." }
];

const integrations = ["Clio", "MyCase", "PracticePanther", "Smokeball", "Google Calendar", "LawPay"];

export default function SolutionsLawFirms() {
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
              <span className="eyebrow">Law Firms</span>
            </div>
            
            <h1 className="headline-xl text-ink mb-6">
              Never miss an intake call. Every consultation booked automatically.
            </h1>
            
            <p className="text-xl text-charcoal leading-relaxed mb-10">
              Four products that cover every client touchpoint: <strong className="text-ink">Inbound</strong> and <strong className="text-ink">Outbound</strong> voice AI, <strong className="text-ink">face-to-face video AI</strong>, and <strong className="text-ink">intelligent websites</strong>.
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
              Professional intake, 24/7 availability, automatic conflict checks, and seamless booking.
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

      {/* Practice Areas */}
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
              Handle every practice area
            </h2>
            <p className="text-lg text-charcoal max-w-2xl mx-auto">
              Potential clients don't wait. If they can't reach you immediately, they'll call the next firm.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {practiceAreas.map((area, index) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-8 rounded-2xl border border-frost hover:border-charcoal/20 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-snow flex items-center justify-center mb-6">
                  <area.icon className="h-6 w-6 text-ink" />
                </div>
                <h3 className="text-xl font-semibold text-ink mb-3">{area.title}</h3>
                <p className="text-charcoal leading-relaxed">{area.description}</p>
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
            
            <h2 className="headline-xl text-white mb-6">Ready to grow your practice?</h2>
            
            <p className="text-lg text-silver max-w-xl mx-auto mb-10">
              See how Voxaris works on YOUR firm's intake.
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
