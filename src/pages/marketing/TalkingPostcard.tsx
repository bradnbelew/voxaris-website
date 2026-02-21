import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
    <div className="min-h-screen bg-carbon-950 text-white overflow-hidden">
      {/* ═══════════════════════════════════════════════════
          HERO — Above the fold: Headline + Form
         ═══════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center">
        {/* Background texture */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
            }}
          />
          {/* Radial glow — top right */}
          <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-orange-500/[0.04] blur-[120px]" />
          {/* Radial glow — bottom left */}
          <div className="absolute -bottom-60 -left-40 w-[500px] h-[500px] rounded-full bg-orange-600/[0.03] blur-[100px]" />
        </div>

        <div className="relative w-full max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-16 pt-24 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left — Copy */}
            <div>
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/[0.06] mb-8"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
                </span>
                <span className="text-[11px] font-semibold text-orange-400 uppercase tracking-[0.2em]">
                  Free Instant Demo
                </span>
              </motion.div>

              <motion.h1
                className="text-[clamp(2.2rem,5.5vw,4.2rem)] font-bold leading-[1.05] tracking-tight mb-6"
                style={{ fontFamily: "'Satoshi', 'Inter', system-ui, sans-serif" }}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={1}
              >
                Watch Your Own AI Agent Answer Leads{' '}
                <span className="text-orange-500">in Under 3 Seconds</span>
              </motion.h1>

              <motion.p
                className="text-lg text-carbon-400 leading-relaxed mb-8 max-w-xl"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={2}
              >
                Enter your dealership name and one inventory highlight. We'll instantly create
                a photorealistic video of your personal AI agent answering real customer leads
                — so you can see the magic for yourself.
              </motion.p>

              {/* Trust badges */}
              <motion.div
                className="flex flex-wrap items-center gap-6 text-sm text-carbon-500"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={3}
              >
                <span className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-orange-500/70" /> No credit card
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-orange-500/70" /> 60-second setup
                </span>
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-orange-500/70" /> 6%+ response rate
                </span>
              </motion.div>
            </div>

            {/* Right — Form card */}
            <motion.div
              className="relative"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
            >
              {/* Glow behind card */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-orange-500/20 via-orange-600/10 to-transparent blur-xl opacity-60" />

              <div className="relative bg-carbon-900/80 backdrop-blur-xl border border-carbon-800/80 rounded-2xl p-8 sm:p-10 shadow-2xl">
                {!submitted ? (
                  <>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                        <Play className="w-5 h-5 text-orange-500" />
                      </div>
                      <h2
                        className="text-xl font-bold"
                        style={{ fontFamily: "'Satoshi', 'Inter', system-ui, sans-serif" }}
                      >
                        Get Your Free Demo
                      </h2>
                    </div>
                    <p className="text-sm text-carbon-400 mb-6">
                      See your personalized AI agent in action. Takes 30 seconds.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-carbon-300 mb-1.5">
                          Dealership Name <span className="text-orange-500">*</span>
                        </label>
                        <Input
                          placeholder="e.g. Sunrise Honda of Orlando"
                          value={form.dealership}
                          onChange={(e) => setForm({ ...form, dealership: e.target.value })}
                          required
                          className="bg-carbon-950/60 border-carbon-700/60 text-white placeholder:text-carbon-600 h-12 focus:border-orange-500/50 focus:ring-orange-500/20 rounded-xl"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-carbon-300 mb-1.5">
                          GM Name <span className="text-carbon-600">(optional)</span>
                        </label>
                        <Input
                          placeholder="e.g. Mike Johnson"
                          value={form.gm}
                          onChange={(e) => setForm({ ...form, gm: e.target.value })}
                          className="bg-carbon-950/60 border-carbon-700/60 text-white placeholder:text-carbon-600 h-12 focus:border-orange-500/50 focus:ring-orange-500/20 rounded-xl"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-carbon-300 mb-1.5">
                          Inventory Highlight or Pain Point <span className="text-orange-500">*</span>
                        </label>
                        <Input
                          placeholder='e.g. "2024 F-150 Lightning stock" or "struggling with after-hours leads"'
                          value={form.highlight}
                          onChange={(e) => setForm({ ...form, highlight: e.target.value })}
                          required
                          className="bg-carbon-950/60 border-carbon-700/60 text-white placeholder:text-carbon-600 h-12 focus:border-orange-500/50 focus:ring-orange-500/20 rounded-xl"
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-14 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white rounded-xl shadow-lg shadow-orange-600/20 hover:shadow-orange-500/30 transition-all text-base font-semibold tracking-wide mt-2"
                      >
                        Generate My Free Talking Postcard Demo Now
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>

                      <p className="text-[11px] text-carbon-600 text-center pt-1">
                        Your demo is generated instantly. No sales call required.
                      </p>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 mx-auto rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mb-5">
                      <CheckCircle2 className="w-8 h-8 text-orange-500" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Your demo is being generated.</h3>
                    <p className="text-carbon-400 mb-6 max-w-sm mx-auto">
                      We're building a personalized AI agent for{' '}
                      <span className="text-white font-medium">{form.dealership}</span>. You'll
                      receive a link to your live demo within 60 seconds.
                    </p>
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-carbon-800 border border-carbon-700 text-sm text-carbon-300">
                      <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
                      Building your agent...
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          HOW IT WORKS — 3 Steps
         ═══════════════════════════════════════════════════ */}
      <AnimatedSection className="py-24 bg-carbon-900/50 border-t border-carbon-800/50">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="text-[11px] font-semibold text-orange-500/80 uppercase tracking-[0.25em]">
              How It Works
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold mt-3 mb-4"
              style={{ fontFamily: "'Satoshi', 'Inter', system-ui, sans-serif" }}
            >
              Three steps. Zero friction.
            </h2>
            <p className="text-carbon-400 text-lg max-w-2xl mx-auto">
              From mailbox to booked appointment in under two minutes — no app downloads, no
              logins, no waiting on hold.
            </p>
          </div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {[
              {
                step: '01',
                icon: MessageSquare,
                title: 'Customer Scans the Postcard',
                body: 'A personalized QR code on your direct mail piece takes them to a custom landing page — their name, their vehicle, their offer.',
              },
              {
                step: '02',
                icon: Users,
                title: 'AI Agent Greets Them Live',
                body: "A photorealistic video agent opens the conversation in real time. It knows their name, their car, and what you're offering. They can ask questions, explore inventory, or voice objections — and it responds instantly.",
              },
              {
                step: '03',
                icon: CalendarCheck,
                title: 'Appointment Booked Automatically',
                body: 'The agent qualifies the lead, captures contact info, and books an appointment directly into your CRM. Your team gets a hot lead notification. Zero manual follow-up.',
              },
            ].map((item) => (
              <motion.div key={item.step} variants={fadeUp}>
                <div className="relative bg-carbon-900/60 border border-carbon-800/60 rounded-2xl p-8 h-full group hover:border-orange-500/20 transition-colors duration-500">
                  <span className="text-6xl font-black text-carbon-800/40 absolute top-5 right-6 select-none group-hover:text-orange-500/10 transition-colors duration-500">
                    {item.step}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-5">
                    <item.icon className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-carbon-400 leading-relaxed text-[15px]">{item.body}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════════
          SOCIAL PROOF — Stats + Logos
         ═══════════════════════════════════════════════════ */}
      <AnimatedSection className="py-24 border-t border-carbon-800/50">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          {/* Stats row */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
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
                <div
                  className="text-4xl sm:text-5xl font-black text-orange-500 mb-2"
                  style={{ fontFamily: "'Satoshi', 'Inter', system-ui, sans-serif" }}
                >
                  {s.value}
                </div>
                <div className="text-white font-semibold text-sm mb-0.5">{s.label}</div>
                <div className="text-carbon-500 text-xs">{s.sub}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Dealer logos placeholder */}
          <div className="text-center">
            <p className="text-[11px] font-semibold text-carbon-500 uppercase tracking-[0.25em] mb-8">
              Trusted by forward-thinking dealerships
            </p>
            <div className="flex flex-wrap items-center justify-center gap-10 opacity-30">
              {['Porsche Jackson', 'Greenway Ford', 'Toyota of Orlando', 'Hill Nissan', 'Suncoast Sports'].map(
                (name) => (
                  <span
                    key={name}
                    className="text-lg font-bold text-carbon-400 tracking-wide"
                    style={{ fontFamily: "'Satoshi', 'Inter', system-ui, sans-serif" }}
                  >
                    {name}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════════
          WHY IT WORKS — Benefits
         ═══════════════════════════════════════════════════ */}
      <AnimatedSection className="py-24 bg-carbon-900/50 border-t border-carbon-800/50">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="text-[11px] font-semibold text-orange-500/80 uppercase tracking-[0.25em]">
              Why It Works
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold mt-3 mb-4"
              style={{ fontFamily: "'Satoshi', 'Inter', system-ui, sans-serif" }}
            >
              Every lead answered. Every time.
            </h2>
            <p className="text-carbon-400 text-lg max-w-2xl mx-auto">
              Your BDC closes at 5 PM. Your AI agent never does.
            </p>
          </div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
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
                className="bg-carbon-900/60 border border-carbon-800/60 rounded-2xl p-7 hover:border-orange-500/20 transition-colors duration-500"
                variants={fadeUp}
              >
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-carbon-400 text-[15px] leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════════
          FAQ
         ═══════════════════════════════════════════════════ */}
      <AnimatedSection className="py-24 border-t border-carbon-800/50">
        <div className="max-w-3xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <span className="text-[11px] font-semibold text-orange-500/80 uppercase tracking-[0.25em]">
              FAQ
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold mt-3"
              style={{ fontFamily: "'Satoshi', 'Inter', system-ui, sans-serif" }}
            >
              Common questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border border-carbon-800/60 rounded-xl overflow-hidden bg-carbon-900/40"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="font-semibold text-[15px] pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-carbon-500 shrink-0 transition-transform duration-300 ${
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
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════════
          FINAL CTA
         ═══════════════════════════════════════════════════ */}
      <section className="relative py-28 border-t border-carbon-800/50 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-orange-500/[0.05] blur-[100px]" />
        </div>

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
          >
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 leading-tight"
              style={{ fontFamily: "'Satoshi', 'Inter', system-ui, sans-serif" }}
            >
              Your competitors are still leaving voicemails.{' '}
              <span className="text-orange-500">You don't have to.</span>
            </h2>
            <p className="text-carbon-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Generate your free demo in 30 seconds. See exactly what your customers will
              experience when they scan your Talking Postcard.
            </p>
            <a href="#top">
              <Button className="h-14 px-10 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white rounded-xl shadow-lg shadow-orange-600/20 hover:shadow-orange-500/30 transition-all text-base font-semibold">
                Generate My Free Demo Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
            <p className="text-carbon-600 text-sm mt-4">
              No credit card. No sales call. Just your AI agent, live in 60 seconds.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Minimal footer for ad landing page */}
      <footer className="border-t border-carbon-800/50 py-8">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span
            className="text-lg font-bold tracking-tight text-carbon-500"
            style={{ fontFamily: "'Satoshi', 'Inter', system-ui, sans-serif" }}
          >
            Voxaris
          </span>
          <span className="text-xs text-carbon-600">
            &copy; {new Date().getFullYear()} Voxaris. AI agents for the automotive industry.
          </span>
        </div>
      </footer>
    </div>
  );
}

/* ─── helper: section wrapper with scroll-triggered animation ─── */
function AnimatedSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className={className}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </section>
  );
}
