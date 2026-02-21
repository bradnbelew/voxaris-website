import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Play,
  Clock,
  TrendingUp,
  Users,
  Zap,
  MessageSquare,
  CalendarCheck,
  ChevronDown,
  CheckCircle2,
  Sparkles,
  Phone,
  BarChart3,
  Shield,
  Link2,
  Check,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Navbar, Footer } from '@/components/marketing';

/* ─── animation presets ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

/* ─── FAQ data ─── */
const faqs = [
  {
    q: 'What exactly is a Talking Postcard?',
    a: 'A physical direct mail piece with a personalized QR code. When a prospect scans it, they land on a custom page where a photorealistic AI video agent greets them by name, answers their questions live, and books an appointment — all without a single human on your team lifting a finger.',
  },
  {
    q: 'How is this different from a regular video message?',
    a: "This isn't a pre-recorded video. It's a live, interactive AI agent that responds to the customer in real time. They can ask questions, get inventory details, negotiate trade-in values, and book service appointments — 24/7, even at 2 AM on a Sunday.",
  },
  {
    q: 'What response rates are dealers seeing?',
    a: 'Dealers using Talking Postcards are seeing 6-12% response rates on direct mail, compared to the industry average of 1-2%. One dealer booked 47 appointments in the first week alone.',
  },
  {
    q: 'How long does it take to set up?',
    a: 'We can have your personalized AI agent live within 48 hours. The demo you generate on this page is instant — you will see your agent in under 60 seconds.',
  },
  {
    q: 'Does it integrate with my CRM?',
    a: 'Yes. Every conversation is transcribed, scored, and synced to GoHighLevel, DealerSocket, VinSolutions, or any CRM with an API. Leads are tagged, appointments are booked, and follow-ups are automatic.',
  },
  {
    q: "What if the customer asks something the AI doesn't know?",
    a: 'The agent is trained on your specific inventory, pricing, promotions, and dealership policies. If it encounters something outside its scope, it seamlessly offers to connect the customer with a human team member or schedules a callback.',
  },
];

export function TalkingPostcard() {
  const [form, setForm] = useState({ dealership: '', gm: '', highlight: '' });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // TODO: POST to API to generate demo
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ═══════════════════════════════════════════════════
          HERO — Above the fold: Headline + Form
         ═══════════════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-white">
        {/* Background — matching main site */}
        <div className="absolute inset-0">
          <div
            className="absolute top-[-30%] left-1/2 -translate-x-1/2 w-[1400px] h-[900px]"
            style={{
              background: 'radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0.015) 0%, transparent 55%)',
            }}
          />
          <div
            className="absolute top-[10%] right-[5%] w-[600px] h-[600px]"
            style={{
              background: 'radial-gradient(circle, rgba(0,0,0,0.01) 0%, transparent 50%)',
            }}
          />
          <div className="absolute inset-0 grid-pattern opacity-[0.04]" />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white/60" />
        </div>

        <div className="relative z-10 container-hero w-full pt-28 pb-12 lg:pt-36 lg:pb-16">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-20 items-center">
            {/* Left — Copy */}
            <div className="max-w-2xl">
              {/* Eyebrow badge */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="mb-10"
              >
                <span className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-carbon-200 bg-carbon-50">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400/60 opacity-60" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400/80" />
                  </span>
                  <span className="text-[11px] font-semibold text-carbon-500 uppercase tracking-[0.2em]">Free Instant Demo</span>
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                className="headline-hero text-carbon-900 mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                Watch your AI agent
                <br />
                <span className="text-carbon-900">answer leads</span>
                <br />
                <span className="text-carbon-400">in under 3 seconds.</span>
              </motion.h1>

              {/* Sub */}
              <motion.p
                className="text-lg sm:text-xl text-carbon-400 leading-relaxed mb-12 max-w-lg"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                Enter your dealership name and one inventory highlight. We'll instantly create
                a photorealistic video of your personal AI agent answering real customer leads.
              </motion.p>

              {/* Trust signals */}
              <motion.div
                className="flex flex-wrap items-center gap-8 text-[13px] text-carbon-400"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                {[
                  { icon: Shield, text: 'No credit card' },
                  { icon: Clock, text: '60-second setup' },
                  { icon: TrendingUp, text: '6%+ response rate' },
                ].map(({ icon: Icon, text }) => (
                  <span key={text} className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-carbon-300" />
                    {text}
                  </span>
                ))}
              </motion.div>

              {/* Metrics bar */}
              <motion.div
                className="mt-16 pt-10 border-t border-carbon-100 flex items-center gap-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                {[
                  { value: '6%+', label: 'Response rate' },
                  { value: '<3s', label: 'First response' },
                  { value: '47', label: 'Appts week one' },
                ].map((stat, i) => (
                  <div key={stat.label} className="flex items-center gap-12">
                    <div>
                      <div className="text-2xl font-bold text-carbon-900 font-display tracking-tight">{stat.value}</div>
                      <div className="text-[11px] text-carbon-400 mt-1 tracking-wide">{stat.label}</div>
                    </div>
                    {i < 2 && <div className="w-px h-8 bg-carbon-100" />}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — Form card */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative w-full max-w-md lg:max-w-[440px] mx-auto">
                {/* Subtle glow behind form */}
                <div className="absolute -inset-12 opacity-10 blur-3xl"
                  style={{ background: 'radial-gradient(circle, rgba(0,0,0,0.08) 0%, transparent 65%)' }}
                />

                <div className="relative bg-white rounded-[24px] border border-carbon-200 p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
                  {!submitted ? (
                    <>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-2xl bg-carbon-50 border border-carbon-200 flex items-center justify-center">
                          <Play className="w-5 h-5 text-carbon-500" />
                        </div>
                        <h2 className="text-xl font-bold text-carbon-900 font-display">
                          Get Your Free Demo
                        </h2>
                      </div>
                      <p className="text-sm text-carbon-400 mb-6">
                        See your personalized AI agent in action. Takes 30 seconds.
                      </p>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-carbon-700 mb-1.5">
                            Dealership Name <span className="text-red-400">*</span>
                          </label>
                          <Input
                            placeholder="e.g. Sunrise Honda of Orlando"
                            value={form.dealership}
                            onChange={(e) => setForm({ ...form, dealership: e.target.value })}
                            required
                            className="bg-carbon-50 border-carbon-200 text-carbon-900 placeholder:text-carbon-300 h-12 focus:border-carbon-400 focus:ring-carbon-200 rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-carbon-700 mb-1.5">
                            GM Name <span className="text-carbon-300">(optional)</span>
                          </label>
                          <Input
                            placeholder="e.g. Mike Johnson"
                            value={form.gm}
                            onChange={(e) => setForm({ ...form, gm: e.target.value })}
                            className="bg-carbon-50 border-carbon-200 text-carbon-900 placeholder:text-carbon-300 h-12 focus:border-carbon-400 focus:ring-carbon-200 rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-carbon-700 mb-1.5">
                            Inventory Highlight or Pain Point <span className="text-red-400">*</span>
                          </label>
                          <Input
                            placeholder='e.g. "2024 F-150 Lightning stock"'
                            value={form.highlight}
                            onChange={(e) => setForm({ ...form, highlight: e.target.value })}
                            required
                            className="bg-carbon-50 border-carbon-200 text-carbon-900 placeholder:text-carbon-300 h-12 focus:border-carbon-400 focus:ring-carbon-200 rounded-xl"
                          />
                        </div>

                        <Button
                          type="submit"
                          size="lg"
                          className="w-full bg-carbon-900 hover:bg-carbon-800 text-white h-14 text-[15px] font-semibold rounded-full group shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] transition-all duration-500 hover:-translate-y-0.5 mt-2"
                        >
                          Generate My Free Demo
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>

                        <p className="text-[11px] text-carbon-400 text-center pt-1">
                          Your demo is generated instantly. No sales call required.
                        </p>
                      </form>
                    </>
                  ) : (
                    <div className="text-center py-6">
                      <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-5">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-carbon-900 mb-3 font-display">Your demo is being generated.</h3>
                      <p className="text-carbon-400 mb-6 max-w-sm mx-auto">
                        We're building a personalized AI agent for{' '}
                        <span className="text-carbon-900 font-medium">{form.dealership}</span>. You'll
                        receive a link to your live demo within 60 seconds.
                      </p>
                      <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-carbon-50 border border-carbon-200 text-sm text-carbon-500">
                        <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
                        Building your agent...
                      </div>
                    </div>
                  )}
                </div>

                {/* Floating tag — top left */}
                <motion.div
                  className="absolute -top-3 -left-3 lg:-left-6 bg-white backdrop-blur-xl rounded-2xl px-5 py-3.5 border border-carbon-200 shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                  initial={{ opacity: 0, x: -20, y: 10 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 }}
                >
                  <div className="text-[10px] text-carbon-400 uppercase tracking-[0.15em] mb-1">Response</div>
                  <div className="text-lg font-bold text-carbon-900 font-display">&lt;3s</div>
                </motion.div>

                {/* Floating tag — bottom right */}
                <motion.div
                  className="absolute -bottom-3 -right-3 lg:-right-6 bg-white backdrop-blur-xl rounded-2xl px-5 py-3.5 border border-carbon-200 shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                  initial={{ opacity: 0, x: 20, y: -10 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.1 }}
                >
                  <div className="text-[10px] text-carbon-400 uppercase tracking-[0.15em] mb-1">Direct Mail</div>
                  <div className="text-lg font-bold text-carbon-900 font-display">6%+</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-white" />
      </section>

      {/* ═══════════════════════════════════════════════════
          HOW IT WORKS — 3 Steps
         ═══════════════════════════════════════════════════ */}
      <section className="section-padding-lg bg-white relative">
        <div className="container-wide">
          {/* Header */}
          <motion.div
            className="text-center mb-12 lg:mb-14"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="eyebrow mb-6 block">How It Works</span>
            <h2 className="headline-xl text-carbon-900 mb-6">
              Mailbox to booked appointment.
              <br className="hidden sm:block" />
              <span className="text-carbon-400">Under two minutes.</span>
            </h2>
            <p className="text-carbon-400 max-w-xl mx-auto text-lg">
              No app downloads, no logins, no waiting on hold.
            </p>
          </motion.div>

          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                number: '01',
                icon: MessageSquare,
                title: 'Customer Scans the Postcard',
                description: 'A personalized QR code on your direct mail piece takes them to a custom landing page — their name, their vehicle, their offer.',
              },
              {
                number: '02',
                icon: Users,
                title: 'AI Agent Greets Them Live',
                description: "A photorealistic video agent opens the conversation in real time. It knows their name, their car, and what you're offering.",
              },
              {
                number: '03',
                icon: CalendarCheck,
                title: 'Appointment Booked Automatically',
                description: 'The agent qualifies the lead, captures contact info, and books an appointment directly into your CRM. Zero manual follow-up.',
              },
            ].map((step, index) => (
              <motion.div
                key={step.title}
                className="relative group"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {index < 2 && (
                  <div className="hidden md:block absolute top-20 left-[calc(50%+60px)] w-[calc(100%-120px)] h-px">
                    <div className="w-full h-full bg-gradient-to-r from-carbon-200 to-carbon-100" />
                  </div>
                )}

                <div className="h-full p-8 lg:p-10 rounded-[20px] bg-carbon-50 border border-carbon-200 transition-all duration-500 hover:bg-carbon-100 hover:border-carbon-300">
                  <div className="mb-8">
                    <span className="text-carbon-200 text-[52px] font-bold font-display leading-none">{step.number}</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-carbon-100 border border-carbon-200 flex items-center justify-center mb-7 group-hover:bg-carbon-200 transition-colors duration-300">
                    <step.icon className="w-5 h-5 text-carbon-500 group-hover:text-carbon-600 transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-carbon-900 font-display mb-3 tracking-tight">{step.title}</h3>
                  <p className="text-[14px] text-carbon-400 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          PROBLEM / SOLUTION — Without vs With Voxaris
         ═══════════════════════════════════════════════════ */}
      <section className="section-padding-lg bg-carbon-50">
        <div className="container-editorial">
          <motion.div
            className="text-center mb-10 lg:mb-12"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="eyebrow mb-6 block">The Problem</span>
            <h2 className="headline-xl text-carbon-900 mb-6">
              You're losing revenue
              <br className="hidden sm:block" />
              <span className="text-carbon-400">while you sleep.</span>
            </h2>
            <p className="text-carbon-400 max-w-xl mx-auto text-lg">
              80% of dealership leads come in after business hours. Traditional direct mail gets a 1-2% response rate. It doesn't have to be this way.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="text-center">
                <span className="text-[11px] font-medium text-carbon-300 uppercase tracking-[0.2em]">Without Voxaris</span>
              </div>
              <div className="text-center">
                <span className="text-[11px] font-medium text-carbon-500 uppercase tracking-[0.2em]">With Talking Postcard</span>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { without: 'Direct mail gets tossed — 1-2% response', with: '6-12% response rate with interactive AI' },
                { without: 'Leads go cold in 5+ minutes', with: 'Every lead engaged in under 3 seconds' },
                { without: 'Sales team unavailable after hours', with: '24/7 coverage — nights, weekends, holidays' },
                { without: 'Lost opportunities every single day', with: 'Every lead captured, qualified, and booked' },
              ].map((item, index) => (
                <motion.div
                  key={item.without}
                  className="grid grid-cols-2 gap-3"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex items-center gap-3 p-5 rounded-2xl bg-white border border-carbon-200">
                    <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-red-50 flex items-center justify-center">
                      <X className="w-3 h-3 text-red-400" />
                    </div>
                    <span className="text-[13px] text-carbon-400">{item.without}</span>
                  </div>
                  <div className="flex items-center gap-3 p-5 rounded-2xl bg-white border border-carbon-300">
                    <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
                      <Check className="w-3 h-3 text-emerald-500" />
                    </div>
                    <span className="text-[13px] text-carbon-700">{item.with}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SOCIAL PROOF — Stats
         ═══════════════════════════════════════════════════ */}
      <section className="section-padding-lg bg-white">
        <div className="container-editorial">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="eyebrow mb-6 block">Results</span>
            <h2 className="headline-xl text-carbon-900 mb-6">
              Real numbers.
              <br className="hidden sm:block" />
              <span className="text-carbon-400">Real dealerships.</span>
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {[
              { value: '6%+', label: 'Response Rate', sub: 'vs 1-2% industry avg' },
              { value: '47', label: 'Appointments', sub: 'Week one, one dealer' },
              { value: '<3s', label: 'First Response', sub: 'AI answers instantly' },
              { value: '24/7', label: 'Always On', sub: 'No missed leads, ever' },
            ].map((s) => (
              <motion.div key={s.label} className="text-center" variants={fadeUp}>
                <div className="stat-number mb-2">{s.value}</div>
                <div className="text-carbon-700 font-semibold text-sm mb-0.5">{s.label}</div>
                <div className="text-carbon-400 text-xs">{s.sub}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Dealer logos placeholder */}
          <div className="text-center">
            <p className="eyebrow mb-8">
              Trusted by forward-thinking dealerships
            </p>
            <div className="flex flex-wrap items-center justify-center gap-10 opacity-20">
              {['Porsche Jackson', 'Greenway Ford', 'Toyota of Orlando', 'Hill Nissan', 'Suncoast Sports'].map(
                (name) => (
                  <span key={name} className="text-lg font-bold text-carbon-500 font-display tracking-wide">
                    {name}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          WHY IT WORKS — Benefits
         ═══════════════════════════════════════════════════ */}
      <section className="section-padding-lg bg-carbon-50">
        <div className="container-wide">
          <motion.div
            className="text-center mb-12 lg:mb-14"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="eyebrow mb-6 block">Why It Works</span>
            <h2 className="headline-xl text-carbon-900 mb-6">
              Every lead answered.
              <br className="hidden sm:block" />
              <span className="text-carbon-400">Every time.</span>
            </h2>
            <p className="text-carbon-400 max-w-xl mx-auto text-lg">
              Your BDC closes at 5 PM. Your AI agent never does.
            </p>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {[
              {
                icon: Zap,
                title: 'Instant Engagement',
                body: 'Leads that wait more than 5 minutes are 10x less likely to convert. Your AI agent answers in under 3 seconds — every time.',
              },
              {
                icon: Phone,
                title: 'After-Hours Coverage',
                body: '80% of dealership leads come in after business hours. Your agent works nights, weekends, and holidays without overtime.',
              },
              {
                icon: BarChart3,
                title: '6x Higher Response Rate',
                body: 'Talking Postcards consistently outperform traditional direct mail by 3-6x because they create a live, interactive experience.',
              },
              {
                icon: Users,
                title: 'Personalized at Scale',
                body: "Every customer gets a unique experience — their name, their vehicle, their offer. It feels 1:1 even when you're sending 10,000 mailers.",
              },
              {
                icon: CalendarCheck,
                title: 'Auto-Booked Appointments',
                body: 'No phone tag. No follow-up emails. The agent qualifies the lead and books them directly into your calendar.',
              },
              {
                icon: TrendingUp,
                title: 'Full CRM Sync',
                body: 'Every conversation is transcribed, scored, and pushed to your CRM with contact info, intent signals, and next steps.',
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                className="bg-white border border-carbon-200 rounded-[20px] p-8 hover:border-carbon-300 hover:bg-carbon-100 transition-all duration-500 group"
                variants={fadeUp}
              >
                <div className="w-12 h-12 rounded-2xl bg-carbon-100 border border-carbon-200 flex items-center justify-center mb-7 group-hover:bg-carbon-200 transition-colors duration-300">
                  <item.icon className="w-5 h-5 text-carbon-500 group-hover:text-carbon-600 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-carbon-900 font-display mb-3 tracking-tight">{item.title}</h3>
                <p className="text-[14px] text-carbon-400 leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FAQ
         ═══════════════════════════════════════════════════ */}
      <section className="section-padding-lg bg-white">
        <div className="container-narrow">
          <motion.div
            className="text-center mb-12 lg:mb-14"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="eyebrow mb-6 block">FAQ</span>
            <h2 className="headline-xl text-carbon-900">
              Common questions
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                className="border border-carbon-200 rounded-[16px] overflow-hidden bg-white hover:border-carbon-300 transition-colors"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="font-semibold text-[15px] text-carbon-900 pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-carbon-300 shrink-0 transition-transform duration-300 ${
                      openFaq === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="px-6 pb-5 text-carbon-400 text-[15px] leading-relaxed">{faq.a}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FINAL CTA — matching main site CTASection
         ═══════════════════════════════════════════════════ */}
      <section className="relative py-20 lg:py-28 bg-carbon-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px]"
            style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 55%)' }}
          />
        </div>

        <div className="container-narrow text-center relative z-10">
          <motion.div
            className="flex flex-col items-center mb-14"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <img src="/voxaris-logo-white.png" alt="Voxaris AI" className="h-32 w-auto opacity-60" />
          </motion.div>

          <motion.h2
            className="headline-xl text-white mb-7"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            Your competitors are still
            <br />
            <span className="text-white/60">leaving voicemails.</span>
          </motion.h2>

          <motion.p
            className="text-lg text-white/40 mb-14 max-w-lg mx-auto"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            Generate your free demo in 30 seconds. See exactly what your customers will
            experience when they scan your Talking Postcard.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <a href="#top">
              <Button
                size="lg"
                className="bg-white hover:bg-white/90 text-carbon-900 h-14 px-10 text-[15px] font-semibold rounded-full group shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-500 hover:-translate-y-0.5"
              >
                Generate My Free Demo
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
            <Link to="/book-demo">
              <Button
                size="lg"
                variant="ghost"
                className="text-white/60 hover:text-white hover:bg-white/[0.06] h-14 px-8 text-[15px] font-medium rounded-full border border-white/20 hover:border-white/30 transition-all duration-300"
              >
                Talk to Sales
              </Button>
            </Link>
          </motion.div>

          <motion.div
            className="flex flex-wrap items-center justify-center gap-8 text-[13px] text-white/30"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            {['No credit card required', 'Setup in 60 seconds', 'Cancel anytime'].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-500/40" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {item}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
