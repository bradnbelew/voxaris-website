import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Car, Phone, Calendar, Users, Bell, Database, ArrowRight, Clock, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const problems = [
  {
    icon: Clock,
    title: "Internet leads go cold in minutes",
    description: "Your BDC is in meetings or on other calls. By the time they follow up, the lead has already test-driven at two other dealerships."
  },
  {
    icon: Phone,
    title: "After-hours leads lost to competitors",
    description: "Your best leads come in at 8 PM on Sunday. They're calling three dealers. Whoever answers first gets the appointment."
  },
  {
    icon: AlertTriangle,
    title: "Inconsistent qualification",
    description: "Some BDC reps ask about trade-ins, some don't. Some pre-qualify financing, some skip it. Your CRM data is a mess."
  },
  {
    icon: TrendingUp,
    title: "Can't track lead source ROI",
    description: "You're spending $50K/month on marketing but can't definitively say which campaigns drive showroom visits vs tire-kickers."
  }
];

const benefits = [
  {
    icon: Phone,
    title: "Answer every call in under 3 seconds",
    description: "Phone, SMS, or web chat. AI picks up instantly while your lead is hot. No hold music, no voicemail."
  },
  {
    icon: Users,
    title: "Qualify by budget, timeline, and trade",
    description: "Is this a cash buyer looking this weekend or 'just browsing' for 6 months? Maria asks the questions your BDC would ask."
  },
  {
    icon: Calendar,
    title: "Book test drives and appointments",
    description: "Syncs with your BDC calendar in real-time. Books test drives, appraisal appointments, finance consultations."
  },
  {
    icon: Bell,
    title: "Send automated confirmations",
    description: "Instant SMS with appointment details, salesperson name, directions, and what to bring. Reduces no-shows by 40%."
  },
  {
    icon: TrendingUp,
    title: "Perfect lead attribution",
    description: "Every call is tagged with source: Google Ad, Facebook, AutoTrader, billboard. You know your CAC per appointment down to the dollar."
  },
  {
    icon: Database,
    title: "Handle inventory questions",
    description: "Maria knows your live inventory feed. 'Do you have a white F-150 with leather?' She can answer before booking the test drive."
  }
];

const useCases = [
  {
    title: "New car sales",
    description: "Qualify new vehicle buyers, match to inventory, book test drives"
  },
  {
    title: "Used car sales",
    description: "Handle trade-in appraisals, schedule inspections, manage pre-owned inventory questions"
  },
  {
    title: "Service department",
    description: "Book maintenance appointments, handle recall notifications, schedule warranty work"
  }
];

const stats = [
  { value: "78%", label: "of leads go to the first responder" },
  { value: "5 min", label: "response time drops conversion by 80%" },
  { value: "35%", label: "of dealership calls go unanswered" }
];

const integrations = {
  crm: ["DealerSocket", "VinSolutions", "Elead", "CDK"],
  inventory: ["AutoTrader", "Cars.com", "CarGurus"],
  calendars: ["Google Calendar", "Outlook", "Apple Calendar"],
  communications: ["Twilio", "GoHighLevel"]
};

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
            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground font-medium tracking-wide mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              For Car Dealerships
            </span>
            <h1 className="text-4xl lg:text-display-sm font-semibold text-foreground mb-6">
              Convert every internet lead into a showroom appointment
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Voxaris answers inbound calls and web leads 24/7, qualifies buyers by budget and timeline, and books test drives directly into your BDC calendar — without adding headcount.
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

      {/* Problem Section */}
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
              The dealership problem
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Speed to lead is everything. But your BDC can only handle so many calls at once.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {problems.map((problem, index) => (
              <motion.div
                key={problem.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded-2xl border border-border p-6"
              >
                <div className="w-11 h-11 rounded-xl bg-destructive/10 flex items-center justify-center mb-4">
                  <problem.icon className="h-5 w-5 text-destructive" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {problem.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {problem.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding bg-secondary/30">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-heading font-semibold text-foreground mb-4">
              What Voxaris does for dealerships
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              More showroom traffic, less manual work. Voxaris handles the entire intake process.
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
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <benefit.icon className="h-5 w-5 text-primary" />
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

      {/* How It Works */}
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
              How it works
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Lead comes in", description: "Phone, SMS, web chat, Facebook Messenger" },
              { step: "2", title: "AI qualifies instantly", description: "Budget, timeline, trade-in, financing needs" },
              { step: "3", title: "Books appointment", description: "Test drive or appraisal into your BDC calendar" },
              { step: "4", title: "Confirms & reminds", description: "SMS confirmations, 24hr reminders, reduces no-shows" }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-lg font-semibold">
                  {item.step}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases & Integrations */}
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
                Dealership use cases
              </h2>
              <p className="text-lg text-primary-foreground/70 mb-8">
                From new car sales to service appointments, Voxaris handles it all.
              </p>
              <ul className="space-y-6">
                {useCases.map((useCase) => (
                  <li key={useCase.title}>
                    <h4 className="font-semibold mb-1">{useCase.title}</h4>
                    <p className="text-primary-foreground/70 text-sm">{useCase.description}</p>
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
              <h3 className="text-xl font-semibold mb-6">Integrations</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm uppercase tracking-wider text-primary-foreground/50 mb-3">CRMs</h4>
                  <div className="flex flex-wrap gap-2">
                    {integrations.crm.map((item) => (
                      <span key={item} className="px-3 py-1.5 bg-primary-foreground/10 rounded-full text-sm">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm uppercase tracking-wider text-primary-foreground/50 mb-3">Inventory</h4>
                  <div className="flex flex-wrap gap-2">
                    {integrations.inventory.map((item) => (
                      <span key={item} className="px-3 py-1.5 bg-primary-foreground/10 rounded-full text-sm">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm uppercase tracking-wider text-primary-foreground/50 mb-3">Calendars</h4>
                  <div className="flex flex-wrap gap-2">
                    {integrations.calendars.map((item) => (
                      <span key={item} className="px-3 py-1.5 bg-primary-foreground/10 rounded-full text-sm">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Scale */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-heading font-semibold text-foreground mb-6">
                Perfect for dealer groups
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
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
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-secondary/50 rounded-3xl p-8 lg:p-10"
            >
              <h3 className="text-xl font-semibold text-foreground mb-4">Ideal for staffed events</h3>
              <p className="text-muted-foreground mb-6">
                Running tent sales or offsite events? Voxaris can handle all lead intake and appointment setting, letting your event staff focus on what they do best.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Instant response to every event lead
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Showroom appointments booked on the spot
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Follow-up continues after the event ends
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-secondary/30">
        <div className="container-wide text-center">
          <h2 className="text-3xl lg:text-heading font-semibold text-foreground mb-4">
            See Voxaris handle a dealership lead in real-time
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Try our live demo or book a personalized walkthrough for your dealership.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/demo">
              <Button variant="hero" size="xl">
                <Phone className="h-5 w-5 mr-2" />
                Try Live Demo
              </Button>
            </Link>
            <Link to="/book-demo">
              <Button variant="heroOutline" size="xl">
                Book a Demo
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
