import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Phone,
  PhoneCall,
  PhoneOff,
  UserCheck,
  MessageSquare,
  CalendarCheck,
  Database,
  Clock,
  Users,
  Building2,
  Target,
  AlertTriangle,
  CheckCircle2,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar, Footer } from '@/components/marketing';

const ease = [0.22, 1, 0.36, 1] as const;

export function SolutionDealerships() {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>AI Dealership Call Team That Books Appointments | Voxaris</title>
        <meta name="description" content="V·TEAMS — a coordinated squad of AI agents that answer inbound dealership calls, qualify leads with warm transfers, and book appointments 24/7. No dropped leads." />
        <meta name="keywords" content="ai bdc dealership, V·TEAMS multi-agent, warm transfer AI, ai voice agent car dealership, ai appointment setter dealership, dealership AI sales team, ai bdc software, 24/7 ai for car dealership, inbound call AI dealership" />
        <link rel="canonical" href="https://voxaris.io/solutions/dealerships" />
        <meta property="og:title" content="AI Dealership Call Team That Books Appointments | Voxaris" />
        <meta property="og:description" content="V·TEAMS — a coordinated squad of AI agents that answer inbound dealership calls, qualify leads, and book appointments 24/7 with warm transfers and full context." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://voxaris.io/solutions/dealerships" />
        <meta property="og:image" content="https://voxaris.io/og-image.png" />
        <meta name="twitter:image" content="https://voxaris.io/og-image.png" />
      </Helmet>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-28 pb-20 overflow-hidden bg-carbon-50">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-carbon-200 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-[11px] font-semibold text-carbon-500 uppercase tracking-[0.15em]">Auto Dealerships</span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-carbon-900 mb-6 font-display leading-[1.05]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Your missed calls are your competitor's appointments.
          </motion.h1>

          <motion.p
            className="max-w-2xl mx-auto text-lg text-carbon-400 mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            V·TEAMS answers every inbound sales call in under 5 seconds — after hours, weekends, overflow — with a full AI sales team that qualifies, transfers with context, and books appointments. No hold music. No voicemail. No dropped leads.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link to="/book-demo">
              <Button size="lg" className="bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-700 hover:via-gold-600 hover:to-gold-700 text-white px-8 h-12 rounded-full font-medium group shadow-gold-btn border border-gold-400/30">
                Book a Demo
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
            <Link to="/demo">
              <Button size="lg" variant="outline" className="border-carbon-300 text-carbon-700 px-8 h-12 rounded-full font-medium group">
                <Phone className="w-4 h-4 mr-2" />
                Hear a Live Call
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* The Problem — operator language */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[11px] font-semibold text-carbon-400 uppercase tracking-[0.2em] mb-4 block">The Reality</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-carbon-900 mb-8 font-display">
              You know exactly where the leads are dying.
            </h2>
          </motion.div>

          <div className="space-y-4">
            {[
              { problem: 'Missed inbound sales calls', detail: 'After-hours, weekends, lunch rush — every unanswered call is a lead walking to the dealer down the road.' },
              { problem: 'After-hours lead loss', detail: 'Your BDC goes home at 6 PM. Half your internet leads come in after hours. They submit forms to three dealers and take the first callback.' },
              { problem: 'Overflow BDC gaps', detail: 'When your team is slammed, the phones ring out. No one notices until the leads are gone.' },
              { problem: 'Slow handoff to the wrong person', detail: 'Caller gets transferred, repeats everything, gets transferred again. Trust dies on the second transfer.' },
              { problem: 'Appointment no-shows', detail: 'No confirmation, no reminder, no follow-up. 30% of booked appointments never walk through the door.' },
              { problem: 'CRM mess after the call', detail: 'Reps forget to log, summarize wrong, or skip it entirely. Your data is only as good as the last person who touched it.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="flex gap-4 p-5 rounded-xl bg-carbon-50 border border-carbon-200"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
                  <X className="w-3 h-3 text-red-500" />
                </div>
                <div>
                  <div className="text-[15px] font-medium text-carbon-800">{item.problem}</div>
                  <div className="text-[13px] text-carbon-400 mt-1">{item.detail}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The V·TEAMS Solution */}
      <section className="py-20 bg-carbon-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[11px] font-semibold text-carbon-400 uppercase tracking-[0.2em] mb-4 block">The V·TEAMS Solution</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-carbon-900 mb-6 font-display">
              Not one bot. A full AI sales team.
            </h2>
            <p className="max-w-3xl text-[16px] text-carbon-500 leading-[1.8]">
              V·TEAMS deploys four specialized AI agents on every inbound call. Each one has a focused job, clear handoff triggers, and access to everything the previous agent learned.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                role: 'Receptionist',
                icon: PhoneCall,
                color: 'bg-emerald-500',
                desc: 'Answers in under 5 seconds. Greets naturally, captures caller name, identifies intent (sales, test drive, service), and routes cleanly with a full summary.',
              },
              {
                role: 'Qualifier',
                icon: UserCheck,
                color: 'bg-blue-500',
                desc: 'Gathers vehicle interest, timeline, trade-in and financing context. Determines if the caller is ready to book now or needs specialist help first.',
              },
              {
                role: 'Specialist',
                icon: MessageSquare,
                color: 'bg-amber-500',
                desc: 'Handles consultative questions about process, availability, trade-in flow, and appointment expectations. Reduces hesitation without making things up.',
              },
              {
                role: 'Closer',
                icon: CalendarCheck,
                color: 'bg-rose-500',
                desc: 'Secures the appointment. Confirms date, time, contact details, and location. Triggers CRM sync, confirmation message, and transcript storage.',
              },
            ].map((agent, i) => (
              <motion.div
                key={agent.role}
                className="p-7 rounded-2xl bg-white border border-carbon-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl ${agent.color} flex items-center justify-center`}>
                    <agent.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-carbon-900 font-display">{agent.role}</h3>
                </div>
                <p className="text-carbon-500 text-[14px] leading-[1.8]">{agent.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[11px] font-semibold text-carbon-400 uppercase tracking-[0.2em] mb-4 block">Built For</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-carbon-900 font-display">
              Dealerships that are done losing leads to slow follow-up.
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: Building2, title: 'Dealer Principals & GMs', desc: 'Who need to reduce BDC overhead while increasing appointment volume and after-hours coverage.' },
              { icon: Phone, title: 'BDC Managers', desc: 'Drowning in lead volume and watching after-hours inquiries die on the vine.' },
              { icon: Target, title: 'Internet Sales Managers', desc: 'Who know speed-to-lead is the difference between a sold unit and a lost opportunity.' },
              { icon: Clock, title: 'Fixed Ops Directors', desc: 'Looking to automate service appointment booking and recall follow-up at scale.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                className="flex gap-4 p-6 rounded-2xl bg-carbon-50 border border-carbon-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="w-10 h-10 rounded-xl bg-carbon-900 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-carbon-900 mb-1">{item.title}</h3>
                  <p className="text-carbon-400 text-[14px] leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What Gets Logged */}
      <section className="py-20 bg-carbon-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[11px] font-semibold text-carbon-400 uppercase tracking-[0.2em] mb-4 block">CRM Sync</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-carbon-900 mb-4 font-display">
              Every call writes to your CRM. Automatically.
            </h2>
            <p className="max-w-2xl text-[16px] text-carbon-500 leading-[1.8]">
              Contact record, intent, squad path, transcript summary, appointment status, booked time, unanswered questions, and follow-up owner — all synced in real time.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-3">
            {[
              'Contact record created',
              'Source: inbound call',
              'Intent identified',
              'Squad path tracked',
              'Full transcript saved',
              'Appointment booked',
              'Confirmation sent',
              'Follow-up task created',
              'Unanswered questions logged',
            ].map((item, i) => (
              <motion.div
                key={item}
                className="flex items-center gap-2 p-3 rounded-lg bg-white border border-carbon-200"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-[13px] text-carbon-700">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Implementation */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[11px] font-semibold text-carbon-400 uppercase tracking-[0.2em] mb-4 block">Implementation</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-carbon-900 mb-4 font-display">
              Live in days. Not months.
            </h2>
          </motion.div>

          <div className="space-y-4">
            {[
              { step: '1', title: 'Discovery call', desc: 'We learn your process, your hours, your routing rules, and your CRM.' },
              { step: '2', title: 'Configuration', desc: 'We configure V·TEAMS with your squad prompts, handoff triggers, and CRM integration.' },
              { step: '3', title: 'Testing', desc: 'We run 20+ internal test calls covering sales, service, edge cases, and failure states.' },
              { step: '4', title: 'Go live', desc: 'V·TEAMS starts answering your inbound calls. Every call logged, every appointment booked.' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                className="flex gap-4 p-5 rounded-xl bg-carbon-50 border border-carbon-200"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="w-8 h-8 rounded-full bg-carbon-900 text-white flex items-center justify-center text-sm font-bold shrink-0">{item.step}</div>
                <div>
                  <div className="text-[15px] font-semibold text-carbon-800">{item.title}</div>
                  <div className="text-[13px] text-carbon-400 mt-1">{item.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-carbon-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-white mb-4 font-display"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            See V·TEAMS handle a live inbound call for your dealership.
          </motion.h2>
          <motion.p
            className="text-white/50 text-lg mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            15-minute demo. Your process, your inventory, your brand. We'll show you exactly how V·TEAMS would work inside your store.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/book-demo">
              <Button size="lg" className="bg-white hover:bg-white/90 text-carbon-900 px-10 h-14 rounded-full font-semibold group shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                Book a Demo
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
            <Link to="/demo">
              <Button size="lg" variant="ghost" className="text-white/60 hover:text-white border border-white/20 hover:border-white/30 px-8 h-14 rounded-full font-medium">
                <Phone className="w-4 h-4 mr-2" />
                Hear a Live Call
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
