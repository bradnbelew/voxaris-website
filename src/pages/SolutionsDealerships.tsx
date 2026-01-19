import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Phone, Calendar, Clock, Users, Zap, ArrowRight, CheckCircle2, Car, Wrench, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import VIcon from "@/components/ui/VIcon";

const painPoints = [
  "Weekend leads sit cold until Monday",
  "BDC teams burn out on repetitive calls",
  "Slow response times lose hot buyers",
  "Event leads overwhelm your team"
];

const benefits = [
  {
    stat: "22s",
    label: "Response Time",
    description: "We call while interest is hottest"
  },
  {
    stat: "47%",
    label: "Appointment Rate",
    description: "On contacted leads"
  },
  {
    stat: "24/7",
    label: "Availability",
    description: "Never miss a lead again"
  }
];

const departments = [
  {
    icon: Car,
    title: "Sales",
    description: "Qualify buyers on budget, timeline, trade-in, and financing. Book showroom appointments that actually show."
  },
  {
    icon: Wrench,
    title: "Service",
    description: "Handle complex repair inquiries with deep mechanical awareness. Knows your shop hours, amenities, and booking logic."
  },
  {
    icon: FileText,
    title: "Parts",
    description: "Route parts inquiries to the right counter, check availability, and schedule pickup or delivery."
  }
];

const integrations = [
  "CDK", "Reynolds", "VinSolutions", "DealerSocket", 
  "AutoTrader", "Cars.com", "Facebook Ads", "Google Ads"
];

export default function SolutionsDealerships() {
  return (
    <Layout>
      {/* Hero - Clean White */}
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
              Stop losing buyers to slow response times
            </h1>
            
            <p className="text-xl text-charcoal leading-relaxed mb-10">
              Voxaris calls every lead in <strong className="text-ink">22 seconds</strong>—qualifying interest and booking confirmed appointments directly into your CRM.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-ink hover:bg-charcoal text-white rounded-full px-8 h-14">
                <Link to="/book-demo">
                  Get a Free Audit
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 h-14 border-frost">
                <Link to="/demo">Watch Demo</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="bg-white pb-20">
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

      {/* Problem Section */}
      <section className="section-padding bg-white border-t border-frost">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="headline-lg text-ink mb-6">
                "Our leads die on weekends"
              </h2>
              <p className="text-lg text-charcoal mb-8">
                Sound familiar? Every hour a lead waits, your chances of closing drop dramatically. And your BDC team can't be everywhere at once.
              </p>
              <ul className="space-y-4">
                {painPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-ink mt-0.5 flex-shrink-0" />
                    <span className="text-charcoal">{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-snow rounded-2xl p-10"
            >
              <p className="text-lg text-charcoal leading-relaxed">
                <span className="text-ink font-semibold">Voxaris changes that.</span> Our AI Sales Agent contacts every lead instantly—nights, weekends, holidays. It qualifies for budget, timeline, trade-in, and financing, then books the appointment directly into your CRM.
              </p>
              <p className="text-lg text-charcoal leading-relaxed mt-6">
                Your sales team shows up to a hot lead who's ready to buy. Not a cold callback.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="section-padding bg-white">
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
              Stop losing revenue to voicemail. Voxaris answers 24/7, intelligently routing across your entire dealership.
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
                <h3 className="text-xl font-semibold text-ink mb-3">
                  {dept.title}
                </h3>
                <p className="text-charcoal leading-relaxed">
                  {dept.description}
                </p>
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
            <h2 className="headline-lg text-ink mb-4">
              Works with your stack
            </h2>
            <p className="text-charcoal">
              We connect in hours, not weeks. No IT headache.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            {integrations.map((integration) => (
              <span
                key={integration}
                className="px-5 py-3 bg-white rounded-full border border-frost text-ink font-medium"
              >
                {integration}
              </span>
            ))}
          </motion.div>
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
            
            <h2 className="headline-xl text-white mb-6">
              Ready to fill your showroom?
            </h2>
            
            <p className="text-lg text-silver max-w-xl mx-auto mb-10">
              See how Voxaris works on YOUR dealership's leads. Free audit, no commitment.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-white hover:bg-snow text-ink font-semibold rounded-full px-10 h-16 text-lg">
                <Link to="/book-demo">
                  Get Free Audit
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-10 h-16 text-lg border-white/20 text-white hover:bg-white/10">
                <Link to="/demo">Watch Demo</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
