import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Phone, Calendar, Clock, TrendingDown, Users, Tent, Zap, Target, BarChart3, Play, Headphones, ArrowRight, CheckCircle2, PhoneIncoming, MessageSquare, Database, Handshake, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const painPoints = [
  {
    icon: Phone,
    title: "Weekend & After-Hours Leads",
    description: "Leads that come in after 5PM or on weekends sit cold until Monday."
  },
  {
    icon: Clock,
    title: "Slow Response Times",
    description: "Even during business hours, leads wait 30+ minutes for contact."
  },
  {
    icon: TrendingDown,
    title: "BDC Turnover & Burnout",
    description: "Good BDC reps burn out on repetitive qualification calls."
  },
  {
    icon: Users,
    title: "Event Lead Overload",
    description: "Tent sales and promotions flood your BDC with unqualified leads."
  }
];

const workflowSteps = [
  { icon: PhoneIncoming, step: "1", title: "Lead Comes In", description: "From ads, website, events, or third-party leads" },
  { icon: Zap, step: "2", title: "AI Calls in 22 Seconds", description: "Not 22 minutes. We contact while interest is hottest." },
  { icon: MessageSquare, step: "3", title: "Dealer-Specific Conversation", description: "Qualifies for budget, timeline, trade-in, and financing." },
  { icon: Database, step: "4", title: "Appointment Books to CRM", description: "Confirmed appointment lands in CDK/Reynolds automatically." },
  { icon: Handshake, step: "5", title: "Your Team Closes", description: "Sales team gets hot leads, not cold call-backs." }
];

const campaignFeatures = [
  {
    icon: Tent,
    title: "Event & Promotion Mode",
    description: "Frame every conversation around your specific event: \"Our Tent Sale ends Sunday...\""
  },
  {
    icon: Zap,
    title: "22-Second Speed Architecture",
    description: "Engineered for automotive where first contact decides the sale."
  },
  {
    icon: Calendar,
    title: "CRM Native Integration",
    description: "Works with CDK, Reynolds, VinSolutions, DealerSocket, and more."
  },
  {
    icon: Bell,
    title: "Team Notification System",
    description: "Sales managers get SMS/email alerts for booked appointments."
  }
];

const proofPoints = [
  {
    icon: Zap,
    title: "Speed Matters Most",
    description: "Calling in 5 minutes vs. 5 seconds can mean a 10x difference in contact rate."
  },
  {
    icon: Target,
    title: "Built for Automotive",
    description: "We understand trade-in questions, financing concerns, and inventory urgency."
  },
  {
    icon: BarChart3,
    title: "Measurable ROI",
    description: "Every call is tracked. Every appointment measured. You see the exact ROI."
  }
];

const integrations = [
  "CDK", "Reynolds", "VinSolutions", "DealerSocket", 
  "AutoTrader", "Cars.com", "Facebook Ads", "Google Ads"
];

const pilotBenefits = [
  "Free 30-day trial on one lead source",
  "CRM integration setup by our team",
  "Dealer-specific AI training for your brand",
  "Live dashboard showing every call & appointment",
  "Founder-level support during trial"
];

const performanceMetrics = [
  "22-second avg. response time",
  "94% contact attempt rate",
  "47% appointment rate on contacted leads",
  "24/7/365 availability"
];

export default function SolutionsDealerships() {
  const [monthlyLeads, setMonthlyLeads] = useState(300);
  const [showRate, setShowRate] = useState(15);

  // Calculate ROI metrics
  const voxarisShowRate = 47;
  const currentAppointments = Math.round(monthlyLeads * (showRate / 100));
  const voxarisAppointments = Math.round(monthlyLeads * (voxarisShowRate / 100));
  const additionalAppointments = voxarisAppointments - currentAppointments;
  const additionalRevenue = additionalAppointments * 1500;

  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding bg-secondary/30">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground font-medium tracking-wide mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              For Auto Dealerships
            </span>
            <h1 className="text-4xl lg:text-display-sm font-semibold text-foreground mb-6">
              Stop Losing Car Buyers to Slow Response Times
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Voxaris is the AI Sales Agent built specifically for automotive campaigns. We call every lead in <strong className="text-foreground">22 seconds</strong>—qualifying interest and booking confirmed appointments directly into your CRM.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="bg-card rounded-xl border border-border px-5 py-3">
                <span className="text-foreground font-semibold">22-second</span>
                <span className="text-muted-foreground text-sm ml-1">avg. response</span>
              </div>
              <div className="bg-card rounded-xl border border-border px-5 py-3">
                <span className="text-foreground font-semibold">47%</span>
                <span className="text-muted-foreground text-sm ml-1">appointment rate</span>
              </div>
              <div className="bg-card rounded-xl border border-border px-5 py-3">
                <span className="text-foreground font-semibold">24/7/365</span>
                <span className="text-muted-foreground text-sm ml-1">availability</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button asChild variant="hero" size="lg">
                <Link to="/book-demo">
                  Get Free Dealership Audit
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/demo">Watch 90-Second Demo</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pain Points */}
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
              "Our Leads Die on Weekends"<br />
              <span className="text-muted-foreground">Sound Familiar?</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {painPoints.map((point, index) => (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded-2xl border border-border p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <point.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {point.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {point.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
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
              How Voxaris Works for Your Dealership
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {workflowSteps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative text-center"
              >
                <div className="relative inline-flex items-center justify-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center shadow-sm">
                    <item.icon className="h-7 w-7 text-foreground" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Listen to AI Section */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground font-medium tracking-wide mb-4">
                <Headphones className="h-4 w-4" />
                Real Call Recording
              </div>
              <h2 className="text-3xl lg:text-heading font-semibold text-foreground mb-4">
                Hear Our AI Talk to Car Buyers
              </h2>
            </div>
            
            <div className="bg-card rounded-2xl border border-border p-6 lg:p-8 mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Play className="h-6 w-6 text-primary ml-0.5" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-foreground">Facebook Ad Lead → Appointment</h3>
                  <p className="text-sm text-muted-foreground">Live dealership lead qualification</p>
                </div>
              </div>
              
              <audio 
                controls 
                className="w-full h-12 mb-6"
                preload="metadata"
              >
                <source src="/audio/maria-dealership-demo.wav" type="audio/wav" />
                Your browser does not support the audio element.
              </audio>

              {/* Example Transcript */}
              <div className="bg-secondary/50 rounded-xl p-5 space-y-3">
                <p className="text-sm">
                  <strong className="text-foreground">AI:</strong> <span className="text-muted-foreground">"Hi John, this is Alex from [Dealership]. I saw you were looking at the 2023 F-150 on our Facebook ad. Are you still considering that model?"</span>
                </p>
                <p className="text-sm">
                  <strong className="text-foreground">Lead:</strong> <span className="text-muted-foreground">"Yeah, I was just browsing."</span>
                </p>
                <p className="text-sm">
                  <strong className="text-foreground">AI:</strong> <span className="text-muted-foreground">"Perfect. We have a special event pricing ending tomorrow. Would you prefer to come in today or tomorrow for a quick test drive?"</span>
                </p>
                <p className="text-sm">
                  <strong className="text-foreground">Lead:</strong> <span className="text-muted-foreground">"Tomorrow afternoon works."</span>
                </p>
                <p className="text-sm">
                  <strong className="text-foreground">AI:</strong> <span className="text-muted-foreground">"Great, I've scheduled you for 2 PM. You'll meet with our Ford specialist, Mike. I'll text you the details now."</span>
                </p>
                <p className="text-sm font-medium text-primary mt-4">
                  Result: Appointment booked in 87 seconds
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Campaign Features */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-heading font-semibold mb-4">
              Your Secret Weapon for Sales Events
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {campaignFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-primary-foreground/5 rounded-2xl p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-primary-foreground/70 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-heading font-semibold text-foreground mb-4">
              Plays Nice With Your Stack
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mb-8"
          >
            {integrations.map((integration) => (
              <span
                key={integration}
                className="px-5 py-3 bg-card rounded-xl border border-border text-foreground font-medium"
              >
                {integration}
              </span>
            ))}
          </motion.div>

          <p className="text-center text-muted-foreground">
            We connect in hours, not weeks. No IT headache.
          </p>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="section-padding bg-secondary/30">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-heading font-semibold text-foreground mb-4">
                How Many Cars Are You Losing?
              </h2>
            </div>

            <div className="bg-card rounded-2xl border border-border p-8">
              <div className="space-y-8 mb-8">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-foreground">Monthly Leads:</label>
                    <span className="text-sm font-semibold text-foreground">{monthlyLeads}</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="2000"
                    step="50"
                    value={monthlyLeads}
                    onChange={(e) => setMonthlyLeads(parseInt(e.target.value))}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-foreground">Current Show Rate:</label>
                    <span className="text-sm font-semibold text-foreground">{showRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="1"
                    value={showRate}
                    onChange={(e) => setShowRate(parseInt(e.target.value))}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </div>

              <div className="bg-primary text-primary-foreground rounded-xl p-6">
                <h3 className="font-semibold mb-4">With Voxaris:</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-3xl font-bold">+{additionalAppointments}</div>
                    <div className="text-sm text-primary-foreground/70">More appointments/month</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">+${additionalRevenue.toLocaleString()}</div>
                    <div className="text-sm text-primary-foreground/70">Potential revenue/month*</div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-4 text-center">
                *Based on $1,500 average front-end profit
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pilot Program */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-heading font-semibold text-foreground">
                Join Our Exclusive Dealer Pilot Program
              </h2>
            </div>

            <div className="bg-card rounded-2xl border border-border p-8 lg:p-10">
              <h3 className="text-xl font-semibold text-foreground mb-6">What You Get:</h3>
              <ul className="space-y-4 mb-8">
                {pilotBenefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="bg-secondary/50 rounded-xl p-6 text-center">
                <h4 className="font-semibold text-foreground mb-4">Limited to 10 dealerships</h4>
                <Button asChild variant="hero" size="lg" className="w-full sm:w-auto">
                  <Link to="/book-demo">
                    Apply for Pilot Program
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <p className="text-sm text-muted-foreground mt-4">No contract. Cancel anytime.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Dealers Are Switching */}
      <section className="section-padding bg-secondary/30">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-heading font-semibold text-foreground">
              Why Dealers Are Switching
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {proofPoints.map((point, index) => (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <point.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{point.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{point.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-card rounded-2xl border border-border p-8 max-w-2xl mx-auto"
          >
            <h3 className="font-semibold text-foreground mb-4 text-center">Our Performance Metrics:</h3>
            <div className="grid grid-cols-2 gap-4">
              {performanceMetrics.map((metric) => (
                <div key={metric} className="bg-secondary/50 rounded-lg px-4 py-3 text-center">
                  <span className="text-sm text-foreground">{metric}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-heading font-semibold mb-4">
              Ready to Fill Your Showroom Floor?
            </h2>
            <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto">
              Stop losing weekend leads and event opportunities. See how Voxaris works on YOUR dealership's leads.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-primary-foreground/5 rounded-2xl p-8"
            >
              <h3 className="text-xl font-semibold mb-4">Option 1: Free Lead Audit</h3>
              <p className="text-primary-foreground/70 text-sm mb-6 leading-relaxed">
                Send us your last 30 days of dead leads. We'll show you which ones we would have contacted and how many appointments you might have booked.
              </p>
              <Button asChild variant="secondary" size="lg" className="w-full">
                <Link to="/book-demo">
                  Request Free Audit
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-primary-foreground/5 rounded-2xl p-8"
            >
              <h3 className="text-xl font-semibold mb-4">Option 2: Live Demo</h3>
              <p className="text-primary-foreground/70 text-sm mb-6 leading-relaxed">
                20-minute walkthrough showing our AI contacting real leads and booking appointments into a CRM just like yours.
              </p>
              <Button asChild variant="outline" size="lg" className="w-full border-primary-foreground/20 hover:bg-primary-foreground/10">
                <Link to="/demo">Schedule Live Demo</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
