import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, ClipboardCheck, CloudLightning, Timer, Database, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar, Footer } from '@/components/marketing';

const stats = [
  { value: '< 1 second', label: 'Response time on every call' },
  { value: '24/7/365', label: 'Coverage — storm season, weekends, holidays' },
  { value: '16 data points', label: 'Captured and synced per call, automatically' },
  { value: '$50,000+/mo', label: 'In revenue recovered from previously missed calls' },
];

export function SolutionContractors() {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>AI Voice Agents for Contractors | Voxaris</title>
        <meta name="description" content="Never miss another call. V·SENSE AI voice agents answer 24/7, qualify leads, book jobs & send texts. Perfect for plumbers, HVAC, roofers, home services." />
        <meta name="keywords" content="ai voice agent missed calls, ai receptionist contractor, ai call answering home services, missed call recovery ai, ai phone agent plumber, 24/7 ai receptionist hvac, ai booking agent contractor, virtual receptionist home services, ai that answers contractor calls, contractor ai answering service, ai lead capture missed calls, ai missed call text back" />
        <link rel="canonical" href="https://voxaris.io/solutions/contractors" />
        <meta property="og:title" content="AI Voice Agents for Contractors | Voxaris" />
        <meta property="og:description" content="Never miss another call. V·SENSE AI voice agents answer 24/7, qualify leads, book jobs & send texts. Built for home services." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://voxaris.io/solutions/contractors" />
      </Helmet>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-carbon-50">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-carbon-200 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-[11px] font-semibold text-carbon-500 uppercase tracking-[0.15em]">Roofing Contractors</span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-carbon-900 mb-6 font-display leading-[1.05]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Every missed call is{' '}
            <span className="text-carbon-400">a roof you didn't close.</span>
          </motion.h1>

          <motion.p
            className="max-w-2xl mx-auto text-lg text-carbon-400 mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            AI voice agents that answer every call, qualify every lead, and book every inspection — 24/7, through storm season and beyond. Syncs directly to JobNimbus.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link to="/book-demo">
              <Button size="lg" className="bg-carbon-900 hover:bg-carbon-800 text-white px-8 h-12 rounded-full font-medium group">
                Book a Demo
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Hero Image */}
      <section className="relative">
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="aspect-[21/9] rounded-2xl overflow-hidden shadow-elevated">
            <img
              src="/roofing-hero.png"
              alt="Roofing crew on a residential roof at golden hour"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </section>

      {/* The Problem */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[11px] font-semibold text-carbon-400 uppercase tracking-[0.2em] mb-4 block">The Reality</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-carbon-900 mb-8 font-display">
              27% of your calls go unanswered. 85% of those never call back.
            </h2>
          </motion.div>

          <motion.div
            className="space-y-6 text-[16px] text-carbon-500 leading-[1.8]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <p>
              When a storm rolls through, your phone lights up. But your crew is on a roof, your office manager is juggling three things, and the calls stack up faster than anyone can answer them. By the time someone calls back, the homeowner already booked with the contractor who picked up first.
            </p>
            <p>
              It's not just storm season. It's the Tuesday night leak call that goes to voicemail. It's the Saturday morning inquiry that sits until Monday. It's the follow-up that never happens because nobody wrote down the details.
            </p>
            <p>
              The math is brutal: <strong className="text-carbon-900">100 calls a month, 27 missed, 5 lost jobs, $50,000 in revenue</strong> that walked away. Every month.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Meet Maria */}
      <section className="py-20 bg-carbon-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[11px] font-semibold text-carbon-400 uppercase tracking-[0.2em] mb-4 block">Meet Your AI Receptionist</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-carbon-900 mb-6 font-display">
              Her name is Maria. She never misses a call.
            </h2>
            <p className="max-w-3xl text-[16px] text-carbon-500 leading-[1.8]">
              Voxaris CVI (Conversational Voice Intelligence) puts an AI-powered voice agent on your phone line that answers every inbound call instantly, qualifies leads using your exact process, books inspections, and syncs every data point directly to JobNimbus — no manual entry required.
            </p>
            <p className="max-w-3xl text-[16px] text-carbon-500 leading-[1.8] mt-4">
              Maria sounds like a helpful neighbor, not a robot. She responds in under one second, handles objections, answers common roofing questions, and knows when to transfer to a real person. She's available 24 hours a day, 7 days a week, 365 days a year.
            </p>
          </motion.div>

          <div className="grid gap-4">
            {/* 7-Step Qualification Flow */}
            <motion.div
              className="p-8 rounded-2xl bg-white border border-carbon-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-carbon-900 flex items-center justify-center">
                  <ClipboardCheck className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-carbon-900">7-Step Qualification Flow</h3>
              </div>
              <p className="text-carbon-500 text-[15px] leading-[1.8]">
                Maria captures the full picture on every call — property address, roof issue, storm damage status, insurance claim progress, timeline urgency, homeowner confirmation, and preferred inspection window. 16 data points collected and synced automatically.
              </p>
            </motion.div>

            {/* Storm & Insurance Intelligence */}
            <motion.div
              className="p-8 rounded-2xl bg-white border border-carbon-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-carbon-900 flex items-center justify-center">
                  <CloudLightning className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-carbon-900">Storm & Insurance Intelligence</h3>
              </div>
              <p className="text-carbon-500 text-[15px] leading-[1.8]">
                Florida-specific: Maria asks every caller about storm damage and insurance claim status. High-value insurance leads are flagged and prioritized before your team even sees them.
              </p>
            </motion.div>

            {/* Smart Follow-Up Cadence */}
            <motion.div
              className="p-8 rounded-2xl bg-white border border-carbon-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.16 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-carbon-900 flex items-center justify-center">
                  <Timer className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-carbon-900">Smart Follow-Up Cadence</h3>
              </div>
              <p className="text-carbon-500 text-[15px] leading-[1.8]">
                Maria doesn't just answer inbound calls. She follows up with leads who requested quotes on an automated cadence — immediate, 15 minutes, 2 hours, 24 hours, Day 3, Day 7 — with full memory of previous conversations.
              </p>
            </motion.div>

            {/* JobNimbus Integration */}
            <motion.div
              className="p-8 rounded-2xl bg-white border border-carbon-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.24 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-carbon-900 flex items-center justify-center">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-carbon-900">JobNimbus Integration</h3>
              </div>
              <p className="text-carbon-500 text-[15px] leading-[1.8]">
                Auto contact creation, auto task generation, full call transcripts, and AI-generated summaries attached to every record. Your team opens JobNimbus and the work is already done.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The ROI */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[11px] font-semibold text-carbon-400 uppercase tracking-[0.2em] mb-4 block">The Math</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-carbon-900 mb-8 font-display">
              Recover $10,000–$20,000/month in lost revenue.
            </h2>
          </motion.div>

          <motion.div
            className="text-[16px] text-carbon-500 leading-[1.8]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <p>
              The average Central Florida roof replacement is $8,000–$15,000. If you're missing 27 calls a month and losing 5 jobs because of it, that's <strong className="text-carbon-900">$50,000 walking out the door</strong>. Recovering even 30% of those missed calls puts 1–2 extra jobs on your board every single month.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-carbon-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="p-6 rounded-2xl bg-white/5 border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-2xl font-bold text-white mb-2 font-display">{stat.value}</div>
                <p className="text-white/40 text-[13px] leading-relaxed">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="py-20 bg-carbon-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[11px] font-semibold text-carbon-400 uppercase tracking-[0.2em] mb-4 block">Trust & Safety</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-carbon-900 mb-8 font-display">
              Built with guardrails your team will appreciate.
            </h2>
          </motion.div>

          <motion.div
            className="text-[16px] text-carbon-500 leading-[1.8]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <p>
              Maria never quotes prices, never promises insurance approval, never gives legal or technical roofing advice. If a caller insists on speaking with a human, she transfers immediately and gracefully. Emergency calls — active leaks, structural concerns — are flagged as priority with a 24–48 hour response commitment.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-carbon-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-white/50 text-[16px] leading-[1.8] mb-8 max-w-2xl mx-auto">
              Stop losing jobs to voicemail. Book a 15-minute demo and hear Maria handle a live roofing call — qualification, booking, and JobNimbus sync included.
            </p>
            <Link to="/book-demo">
              <Button size="lg" className="bg-white hover:bg-white/90 text-carbon-900 px-10 h-14 rounded-full font-semibold group shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                Book a Demo
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
