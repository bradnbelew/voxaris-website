import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Wrench, Phone, Calendar, Clock, Database, Bell, ArrowRight, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const problems = [
  {
    icon: Clock,
    title: "Emergency calls after hours",
    description: "Your best leads call at 9 PM when they notice a leak. You lose them by morning."
  },
  {
    icon: Phone,
    title: "Can't answer while on job sites",
    description: "Your phone rings while you're on a ladder. By the time you call back, they've called three competitors."
  },
  {
    icon: Calendar,
    title: "Every estimate counts",
    description: "Getting someone to commit to an on-site estimate is half the battle. You can't afford no-shows."
  },
  {
    icon: AlertTriangle,
    title: "Seasonal demand spikes",
    description: "Storm season hits and you're drowning in leads. By the time you respond, half have already booked someone else."
  }
];

const benefits = [
  {
    icon: Phone,
    title: "Answer every call, every time",
    description: "AI picks up in under 3 seconds. After hours, weekends, holidays — every lead gets immediate response."
  },
  {
    icon: CheckCircle2,
    title: "Qualify for job type and urgency",
    description: "Is it emergency water damage or a planned kitchen remodel? AI asks the right questions and prioritizes your calendar."
  },
  {
    icon: Calendar,
    title: "Book estimates directly",
    description: "No phone tag. Maria syncs with your calendar and books estimate appointments while prospect is on the phone."
  },
  {
    icon: Bell,
    title: "Send confirmations & reminders",
    description: "Automated SMS with appointment details, directions. Reduces no-shows by 40%+."
  },
  {
    icon: Database,
    title: "Track lead source automatically",
    description: "Know exactly which yard sign, truck wrap, or Google ad drove the call. Attribution flows to CRM automatically."
  },
  {
    icon: Wrench,
    title: "Handle multiple trades",
    description: "Route plumbing calls differently than HVAC. Each service line gets its own qualification flow."
  }
];

const useCases = [
  {
    title: "Emergency services",
    description: "Water damage, no heat, electrical hazards — AI triages urgency and fast-tracks your calendar"
  },
  {
    title: "Planned projects",
    description: "Kitchen remodels, HVAC replacements, new roof — qualify budget and timeline before the estimate"
  },
  {
    title: "Seasonal campaigns",
    description: "Storm chasers, AC tune-up season, winterization — handle volume spikes without extra staff"
  }
];

const industries = [
  "Roofing",
  "HVAC",
  "Plumbing",
  "Electrical",
  "Water Restoration",
  "Kitchen & Bath Remodeling",
  "General Contracting"
];

const integrations = {
  crm: ["Jobber", "ServiceTitan", "Housecall Pro", "BuildOps"],
  calendars: ["Google Calendar", "Outlook", "Apple Calendar"],
  payments: ["Stripe", "Square"]
};

export default function SolutionsContractors() {
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
              For Contractors
            </span>
            <h1 className="text-4xl lg:text-display-sm font-semibold text-foreground mb-6">
              Stop losing emergency calls and last-minute jobs
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Voxaris answers every inbound lead 24/7, qualifies the job type and urgency, and books estimate appointments into your calendar — even when you're on a roof or crawling under a house.
            </p>
            
            {/* Industry pills */}
            <div className="flex flex-wrap gap-2">
              {industries.map((industry) => (
                <span 
                  key={industry}
                  className="px-3 py-1.5 bg-card rounded-full border border-border text-sm text-muted-foreground"
                >
                  {industry}
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
              The contractor problem
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              You're great at your trade. But you can't be on a job site AND answering your phone at the same time.
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
              What Voxaris does for contractors
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Never miss a lead. Never play phone tag. Never lose a job to a faster competitor.
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
              { step: "1", title: "Lead comes in", description: "Phone, SMS, web form, Google Local Services" },
              { step: "2", title: "AI qualifies", description: "Job type, urgency, property details, timeline" },
              { step: "3", title: "Books estimate", description: "Syncs with your calendar, books the site visit" },
              { step: "4", title: "Confirms & reminds", description: "SMS with details and what to expect" }
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
                Contractor use cases
              </h2>
              <p className="text-lg text-primary-foreground/70 mb-8">
                Whether it's a burst pipe at midnight or a planned renovation, Voxaris handles it all.
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
                  <h4 className="text-sm uppercase tracking-wider text-primary-foreground/50 mb-3">CRM & Field Service</h4>
                  <div className="flex flex-wrap gap-2">
                    {integrations.crm.map((item) => (
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
            See Voxaris handle a contractor lead in real-time
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Try our live demo or book a personalized walkthrough for your contracting business.
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
