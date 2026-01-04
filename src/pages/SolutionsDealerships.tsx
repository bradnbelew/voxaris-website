import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Car, Phone, Calendar, Users, Bell, Database, ArrowRight, Clock, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const benefits = [
  {
    icon: Phone,
    title: "Every lead gets a call within seconds",
    description: "When a prospect submits a form or calls your dealership, Maria responds instantly — before they can call your competitor."
  },
  {
    icon: Clock,
    title: "Missed-call recovery",
    description: "Calls that go unanswered are automatically called back. No lead left behind, no opportunity wasted."
  },
  {
    icon: Calendar,
    title: "Appointment booking and confirmation",
    description: "Qualified leads are booked directly into your showroom calendar. SMS confirmations reduce no-shows."
  },
  {
    icon: Users,
    title: "Consistent qualification",
    description: "Every prospect gets asked the right questions. Budget, timeline, vehicle preferences — all captured automatically."
  },
  {
    icon: Database,
    title: "Clean CRM data",
    description: "All calls are logged with summaries, outcomes, and structured data. No manual entry, no missing information."
  },
  {
    icon: Bell,
    title: "Automated reminders",
    description: "Appointment reminders via SMS and email ensure prospects show up ready to buy."
  }
];

const stats = [
  { value: "78%", label: "of leads go to the first responder" },
  { value: "5 min", label: "response time drops conversion by 80%" },
  { value: "35%", label: "of dealership calls go unanswered" }
];

export default function SolutionsDealerships() {
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
              <Car className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl lg:text-display-sm font-semibold text-foreground mb-6">
              Voxaris for Car Dealerships
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              New or used, single rooftop or dealer group — Voxaris puts more appointments on your board and more buyers in your showroom.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b border-border">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
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
              More showroom traffic, less manual work
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Voxaris handles the entire intake process so your team can focus on closing deals.
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

      {/* Scale */}
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
                Perfect for dealer groups
              </h2>
              <p className="text-lg text-primary-foreground/70 mb-8">
                Whether you have 3 rooftops or 30, Voxaris deploys with consistent quality across every location. Same AI, same process, same results.
              </p>
              <ul className="space-y-4">
                {[
                  "Centralized management, decentralized execution",
                  "Location-specific calendars and routing",
                  "Unified reporting across all dealerships",
                  "Consistent brand experience for every caller"
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-primary-foreground/60 flex-shrink-0" />
                    <span className="text-primary-foreground/90">{item}</span>
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
              <h3 className="text-xl font-semibold mb-4">Ideal for staffed events</h3>
              <p className="text-primary-foreground/70 mb-6">
                Running tent sales or offsite events? Voxaris can handle all lead intake and appointment setting, letting your event staff focus on what they do best.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-primary-foreground/80">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  Instant response to every event lead
                </div>
                <div className="flex items-center gap-3 text-sm text-primary-foreground/80">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  Showroom appointments booked on the spot
                </div>
                <div className="flex items-center gap-3 text-sm text-primary-foreground/80">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  Follow-up continues after the event ends
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
            Ready to fill your showroom?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            See how Voxaris can transform your dealership's lead response and appointment booking.
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
