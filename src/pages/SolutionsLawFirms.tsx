import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Scale, Phone, Calendar, Clock, Database, Shield, ArrowRight, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const problems = [
  {
    icon: Clock,
    title: "After-hours calls go to voicemail",
    description: "Accidents happen at 2 AM. By the time you call back Monday morning, they've signed with another firm."
  },
  {
    icon: Phone,
    title: "Intake coordinators are bottlenecked",
    description: "Your best attorney is on a call when a $500K PI case phones in. You lose it to phone tag."
  },
  {
    icon: Shield,
    title: "Conflict checks delay intake",
    description: "You can't book a consult until you run conflicts. AI can check against your case management system instantly."
  },
  {
    icon: AlertTriangle,
    title: "Inconsistent screening",
    description: "Not every intake coordinator asks about statute of limitations, prior counsel, or opposing parties. Data quality suffers."
  }
];

const benefits = [
  {
    icon: Clock,
    title: "24/7 intake availability",
    description: "AI answers every call in under 3 seconds. Nights, weekends, holidays. No potential client goes to voicemail."
  },
  {
    icon: Scale,
    title: "Practice area qualification",
    description: "Routes PI differently than family law. Asks case-specific questions based on the practice area."
  },
  {
    icon: Shield,
    title: "Conflict checking",
    description: "Integrates with Clio, MyCase, PracticePanther. Flags conflicts before booking consultation."
  },
  {
    icon: Calendar,
    title: "Books consultations",
    description: "Syncs with attorney calendars. Books initial consultations based on practice area and availability."
  },
  {
    icon: AlertTriangle,
    title: "Statute of limitations awareness",
    description: "For time-sensitive cases, AI prioritizes urgent bookings and sends immediate alerts to attorneys."
  },
  {
    icon: Database,
    title: "Secure & compliant",
    description: "All calls recorded and logged for compliance. Transcript sent to case management system."
  }
];

const useCases = [
  {
    title: "Personal injury",
    description: "Accident details, injury severity, insurance info, statute check → books consult"
  },
  {
    title: "Family law",
    description: "Divorce, custody, support → screens for conflicts, emotional sensitivity training"
  },
  {
    title: "Criminal defense",
    description: "Arrest details, charges, court dates → urgent booking priority"
  }
];

const practiceAreas = [
  "Personal Injury",
  "Family Law",
  "Criminal Defense",
  "Immigration",
  "Estate Planning",
  "Employment Law",
  "Business Law"
];

const integrations = {
  caseManagement: ["Clio", "MyCase", "PracticePanther", "Smokeball"],
  calendars: ["Google Calendar", "Outlook"],
  forms: ["Typeform", "JotForm"],
  payments: ["LawPay"]
};

export default function SolutionsLawFirms() {
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
              For Law Firms
            </span>
            <h1 className="text-4xl lg:text-display-sm font-semibold text-foreground mb-6">
              Never miss an intake call. Every consultation booked automatically.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Voxaris answers every potential client call 24/7, conducts initial intake screening, checks for conflicts, and books consultations directly with the right attorney — without adding paralegals or intake coordinators.
            </p>
            
            {/* Practice area pills */}
            <div className="flex flex-wrap gap-2">
              {practiceAreas.map((area) => (
                <span 
                  key={area}
                  className="px-3 py-1.5 bg-card rounded-full border border-border text-sm text-muted-foreground"
                >
                  {area}
                </span>
              ))}
            </div>
          </motion.div>
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
              The law firm problem
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Potential clients don't wait. If they can't reach you immediately, they'll call the next firm on their list.
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
              What Voxaris does for law firms
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional intake, 24/7 availability, automatic conflict checks, and seamless booking.
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
              { step: "1", title: "Lead calls", description: "Potential client calls your firm number" },
              { step: "2", title: "AI screens", description: "Practice area, case details, opposing parties, statute" },
              { step: "3", title: "Conflict check", description: "Automated check against case management system" },
              { step: "4", title: "Books consultation", description: "Attorney calendar sync, sends confirmation" }
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
                Law firm use cases
              </h2>
              <p className="text-lg text-primary-foreground/70 mb-8">
                From urgent criminal matters to complex family situations, Voxaris handles intake with sensitivity and precision.
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
                  <h4 className="text-sm uppercase tracking-wider text-primary-foreground/50 mb-3">Case Management</h4>
                  <div className="flex flex-wrap gap-2">
                    {integrations.caseManagement.map((item) => (
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
                <div>
                  <h4 className="text-sm uppercase tracking-wider text-primary-foreground/50 mb-3">Payments</h4>
                  <div className="flex flex-wrap gap-2">
                    {integrations.payments.map((item) => (
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

      {/* CTA */}
      <section className="section-padding">
        <div className="container-wide text-center">
          <h2 className="text-3xl lg:text-heading font-semibold text-foreground mb-4">
            See Voxaris handle a legal intake in real-time
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Try our live demo or book a personalized walkthrough for your law firm.
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
