import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
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
  Check,
  X,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const API_BASE = import.meta.env.VITE_API_URL || '';

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
    a: 'A physical direct mail piece with a personalized QR code. When a prospect scans it, they land on a custom page where a photorealistic AI video agent greets them by name, answers questions in real time, and books an appointment — without a single human on your team lifting a finger.',
  },
  {
    q: 'How is this different from a pre-recorded video?',
    a: "This isn't a video blast. It's a live, interactive AI agent that responds in real time. Customers can ask questions, explore inventory, voice objections — and the agent handles all of it, 24/7, even at 2 AM on a Sunday.",
  },
  {
    q: 'What response rates are dealers seeing?',
    a: 'Dealers using Talking Postcards are seeing 6-12% response rates on direct mail, compared to the industry average of 1-2%. One dealer booked 47 appointments in the first week.',
  },
  {
    q: 'How long does setup take?',
    a: 'Your personalized AI agent can be live within 48 hours. The demo you generate on this page is instant — you see your agent in under 60 seconds.',
  },
  {
    q: 'Does it integrate with my CRM?',
    a: 'Yes. Every conversation is transcribed, scored, and synced to GoHighLevel, DealerSocket, VinSolutions, or any CRM with an API. Leads are tagged, appointments are booked, follow-ups are automatic.',
  },
  {
    q: "What if the AI can't answer a question?",
    a: "The agent is trained on your specific inventory, pricing, promotions, and policies. If it hits something outside its scope, it seamlessly offers to connect the customer with your team or schedules a callback. No dead ends.",
  },
];

export function TalkingPostcard() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ dealership: '', gm: '', highlight: '' });
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('loading');
    setErrorMsg('');

    try {
      const res = await fetch(`${API_BASE}/api/voxaris/tavus/talking-postcard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealership: form.dealership,
          gm_name: form.gm,
          highlight: form.highlight,
        }),
      });

      if (!res.ok) throw new Error('Failed to create demo session');
      const data = await res.json();

      if (data.success && data.conversation_url) {
        // Redirect to the embed page with session data
        const params = new URLSearchParams({
          url: data.conversation_url,
          dealership: form.dealership,
          name: form.gm,
        });
        navigate(`/talking-postcard/demo?${params.toString()}`);
      } else {
        throw new Error(data.error || 'Could not generate demo');
      }
    } catch (err: any) {
      console.error('Demo generation error:', err);
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
      setFormState('error');
      setTimeout(() => setFormState('idle'), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ═══════════════════════════════════════════════════
          HERO — Dark, punchy, Hormozi Grand Slam
         ═══════════════════════════════════════════════════ */}
      <section
        id="top"
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #111111 100%)' }}
      >
        {/* Subtle radial glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[1200px] h-[800px] opacity-20"
            style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.04) 0%, transparent 60%)' }}
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 w-full py-24 md:py-32">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* Left — Copy */}
            <div>
              {/* Eyebrow badge */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="mb-8"
              >
                <span className="inline-flex items-center gap-3 bg-zinc-900 border border-zinc-800 px-5 py-2.5 rounded-full">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400/60 opacity-60" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                  <span className="uppercase tracking-[0.2em] text-[11px] font-semibold text-zinc-400">Instant &bull; Personalized &bull; Real</span>
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter leading-[0.95] mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                Watch your AI agent
                <br />
                <span className="text-white">book appointments</span>
                <br />
                <span className="text-zinc-500">while you sleep.</span>
              </motion.h1>

              {/* Sub */}
              <motion.p
                className="text-xl sm:text-2xl text-zinc-400 max-w-lg leading-relaxed mb-10"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                Enter your dealership name and one inventory highlight.
                We'll instantly create a photorealistic video of{' '}
                <strong className="text-white">your own AI agent</strong> answering real customer leads.
              </motion.p>

              {/* Trust signals */}
              <motion.div
                className="flex flex-wrap items-center gap-8 text-sm text-zinc-400"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                {[
                  'No credit card',
                  '45-second setup',
                  '6%+ response rate',
                ].map((text) => (
                  <span key={text} className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold shrink-0">
                      &#10003;
                    </span>
                    {text}
                  </span>
                ))}
              </motion.div>

              {/* Metrics */}
              <motion.div
                className="mt-14 pt-10 border-t border-zinc-800 flex items-center gap-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                {[
                  { value: '6-12%', label: 'Response rate' },
                  { value: '<3s', label: 'First response' },
                  { value: '47', label: 'Appts week one' },
                ].map((stat, i) => (
                  <div key={stat.label} className="flex items-center gap-10">
                    <div>
                      <div className="text-2xl font-bold text-white tracking-tight">{stat.value}</div>
                      <div className="text-[11px] text-zinc-500 mt-1 tracking-wide uppercase">{stat.label}</div>
                    </div>
                    {i < 2 && <div className="w-px h-8 bg-zinc-800" />}
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
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 sm:p-10">
                {formState === 'idle' || formState === 'error' ? (
                  <>
                    <div className="text-center mb-6">
                      <span className="inline-block bg-white text-black text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                        Response Time &lt;3s
                      </span>
                    </div>
                    <h2 className="text-3xl font-bold text-center mb-8 tracking-tight">
                      Get Your Free Demo
                    </h2>

                    {formState === 'error' && (
                      <div className="mb-4 p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 text-center">
                        {errorMsg}
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <input
                        type="text"
                        placeholder="Dealership Name *"
                        value={form.dealership}
                        onChange={(e) => setForm({ ...form, dealership: e.target.value })}
                        required
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-5 text-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                      />
                      <input
                        type="text"
                        placeholder="Your Name *"
                        value={form.gm}
                        onChange={(e) => setForm({ ...form, gm: e.target.value })}
                        required
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-5 text-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                      />
                      <textarea
                        rows={3}
                        placeholder='Biggest lead problem or inventory highlight * (e.g. "We miss 60% of after-hours leads")'
                        value={form.highlight}
                        onChange={(e) => setForm({ ...form, highlight: e.target.value })}
                        required
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-5 text-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors resize-none"
                      />
                      <button
                        type="submit"
                        className="w-full bg-white hover:bg-zinc-100 text-black font-semibold text-lg py-5 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(255,255,255,0.1)] hover:-translate-y-0.5"
                      >
                        Generate My Free AI Agent Demo
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </form>
                    <p className="text-center text-[11px] text-zinc-600 mt-5">
                      Takes 45 seconds &bull; No credit card &bull; Instant video
                    </p>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-5">
                      <Loader2 className="w-8 h-8 text-zinc-400 animate-spin" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Building your agent...</h3>
                    <p className="text-zinc-500 mb-6 max-w-sm mx-auto">
                      Creating a personalized AI agent for{' '}
                      <span className="text-white font-medium">{form.dealership}</span>.
                      You'll be redirected automatically.
                    </p>
                    <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-800 border border-zinc-700 text-sm text-zinc-400">
                      <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                      Configuring V&middot;FACE agent...
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          GUARANTEE — Risk reversal bar
         ═══════════════════════════════════════════════════ */}
      <section className="py-10 bg-zinc-900/50 border-y border-zinc-800">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-5 text-center sm:text-left"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6 text-zinc-400" />
            </div>
            <div>
              <p className="text-[15px] text-white font-semibold">
                If the demo doesn't blow you away, reply and we'll rebuild it — free, no questions asked.
              </p>
              <p className="text-[13px] text-zinc-500 mt-0.5">
                We've never had to. But the guarantee stands.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          HOW IT WORKS — 3 Steps
         ═══════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-500 mb-6 block">How It Works</span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-5">
              Three fields. 45 seconds.
              <br className="hidden sm:block" />
              <span className="text-zinc-500">Your AI agent, live.</span>
            </h2>
            <p className="text-zinc-500 max-w-xl mx-auto text-lg">
              No app downloads. No logins. No waiting on hold.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                number: '01',
                icon: MessageSquare,
                title: 'Customer Scans the Postcard',
                description: 'A personalized QR code on your direct mail takes them to a custom page — their name, their vehicle, their offer. All pre-loaded.',
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
                title: 'Appointment Booked. Lead Captured.',
                description: 'The agent qualifies the lead, captures contact info, and books directly into your CRM. Zero manual follow-up.',
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
                <div className="h-full p-8 lg:p-10 rounded-2xl bg-zinc-900 border border-zinc-800 transition-all duration-500 hover:border-zinc-700">
                  <div className="mb-8">
                    <span className="text-zinc-800 text-[52px] font-bold leading-none">{step.number}</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-7 group-hover:bg-zinc-700 transition-colors duration-300">
                    <step.icon className="w-5 h-5 text-zinc-400 group-hover:text-zinc-300 transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{step.title}</h3>
                  <p className="text-[14px] text-zinc-500 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          PROBLEM / SOLUTION — Without vs With
         ═══════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-zinc-900/30">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-500 mb-6 block">The Problem</span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-5">
              Every hour your phones are off,
              <br className="hidden sm:block" />
              <span className="text-zinc-500">you're paying for leads you'll never close.</span>
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="text-center">
                <span className="text-[11px] font-medium text-zinc-600 uppercase tracking-[0.2em]">Without Voxaris</span>
              </div>
              <div className="text-center">
                <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-[0.2em]">With Talking Postcard</span>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { without: 'Direct mail gets tossed — 1-2% response', with: '6-12% response with interactive AI' },
                { without: 'Leads go cold in 5+ minutes', with: 'Every lead engaged in under 3 seconds' },
                { without: 'BDC closes at 5 PM', with: '24/7 — nights, weekends, holidays' },
                { without: "Manual follow-up that doesn't scale", with: '1,000+ simultaneous conversations' },
                { without: 'Lost opportunities every single day', with: 'Every lead captured, qualified, booked' },
              ].map((item, index) => (
                <motion.div
                  key={item.without}
                  className="grid grid-cols-2 gap-3"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex items-center gap-3 p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                    <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-red-500/10 flex items-center justify-center">
                      <X className="w-3 h-3 text-red-400" />
                    </div>
                    <span className="text-[13px] text-zinc-500">{item.without}</span>
                  </div>
                  <div className="flex items-center gap-3 p-5 rounded-2xl bg-zinc-900/50 border border-zinc-700">
                    <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <Check className="w-3 h-3 text-emerald-400" />
                    </div>
                    <span className="text-[13px] text-zinc-300">{item.with}</span>
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
      <section className="py-20 lg:py-28 bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-500 mb-6 block">Results</span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-5">
              Real numbers.
              <br className="hidden sm:block" />
              <span className="text-zinc-500">Real dealerships.</span>
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
              { value: '6-12%', label: 'Response Rate', sub: 'vs 1-2% industry avg' },
              { value: '47', label: 'Appointments', sub: 'Week one, one dealer' },
              { value: '<3s', label: 'First Response', sub: 'AI answers instantly' },
              { value: '24/7', label: 'Always On', sub: 'No missed leads, ever' },
            ].map((s) => (
              <motion.div key={s.label} className="text-center" variants={fadeUp}>
                <div className="text-5xl md:text-6xl font-bold text-white mb-2 tracking-tight">{s.value}</div>
                <div className="text-zinc-300 font-semibold text-sm mb-0.5">{s.label}</div>
                <div className="text-zinc-600 text-xs">{s.sub}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Dealer logos */}
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-600 mb-8">
              Trusted by forward-thinking dealerships
            </p>
            <div className="flex flex-wrap items-center justify-center gap-10 opacity-30">
              {['Porsche Jackson', 'Greenway Ford', 'Toyota of Orlando', 'Hill Nissan', 'Suncoast Sports'].map(
                (name) => (
                  <span key={name} className="text-lg font-bold text-zinc-400 tracking-wide">
                    {name}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          WHY IT WORKS — Benefits grid
         ═══════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-500 mb-6 block">Why It Works</span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-5">
              Your BDC closes at 5.
              <br className="hidden sm:block" />
              <span className="text-zinc-500">Your AI agent never does.</span>
            </h2>
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
                body: 'Leads that wait more than 5 minutes are 10x less likely to convert. Your AI answers in under 3 seconds — every single time.',
              },
              {
                icon: Phone,
                title: 'After-Hours Coverage',
                body: '80% of leads come in after hours. Your agent works nights, weekends, and holidays. No overtime. No callbacks. No excuses.',
              },
              {
                icon: BarChart3,
                title: '6x Higher Response Rate',
                body: 'Talking Postcards outperform traditional direct mail by 3-6x because they create a live, interactive experience.',
              },
              {
                icon: Users,
                title: 'Personalized at Scale',
                body: "Every customer gets their name, their vehicle, their offer. It feels 1:1 even when you're sending 10,000 mailers.",
              },
              {
                icon: CalendarCheck,
                title: 'Auto-Booked Appointments',
                body: 'No phone tag. No follow-up emails. The agent qualifies, books, and notifies your team. Hot leads, delivered.',
              },
              {
                icon: TrendingUp,
                title: 'Full CRM Sync',
                body: 'Every conversation transcribed, scored, and pushed to your CRM with contact info, intent signals, and next steps.',
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition-all duration-500 group"
                variants={fadeUp}
              >
                <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-7 group-hover:bg-zinc-700 transition-colors duration-300">
                  <item.icon className="w-5 h-5 text-zinc-400 group-hover:text-zinc-300 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{item.title}</h3>
                <p className="text-[14px] text-zinc-500 leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FAQ
         ═══════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-500 mb-6 block">FAQ</span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
              Common questions
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900/30 hover:border-zinc-700 transition-colors"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="font-semibold text-[15px] text-white pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-zinc-600 shrink-0 transition-transform duration-300 ${
                      openFaq === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="px-6 pb-5 text-zinc-500 text-[15px] leading-relaxed">{faq.a}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FINAL CTA
         ═══════════════════════════════════════════════════ */}
      <section className="relative py-24 lg:py-32 overflow-hidden border-t border-zinc-800">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] opacity-30"
            style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.02) 0%, transparent 55%)' }}
          />
        </div>

        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <motion.div
            className="flex flex-col items-center mb-12"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <img src="/voxaris-logo-white.png" alt="Voxaris AI" className="h-28 w-auto opacity-40" />
          </motion.div>

          <motion.h2
            className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-7"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            Your competitors are still
            <br />
            <span className="text-zinc-500">leaving voicemails.</span>
          </motion.h2>

          <motion.p
            className="text-lg text-zinc-500 mb-14 max-w-lg mx-auto"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            45 seconds to generate your demo. Then decide for yourself
            whether this is the future of speed-to-lead at your dealership.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <a href="#top">
              <button className="bg-white hover:bg-zinc-100 text-black font-semibold text-lg py-5 px-10 rounded-2xl inline-flex items-center gap-3 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(255,255,255,0.1)] hover:-translate-y-0.5">
                Generate My AI Agent Demo
                <ArrowRight className="w-5 h-5" />
              </button>
            </a>
            <Link to="/book-demo">
              <button className="text-zinc-500 hover:text-white border border-zinc-700 hover:border-zinc-500 font-medium text-lg py-5 px-8 rounded-2xl transition-all duration-300">
                Talk to Sales
              </button>
            </Link>
          </motion.div>

          <motion.div
            className="flex flex-wrap items-center justify-center gap-8 text-[13px] text-zinc-600"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            {['No credit card required', '45-second setup', "Don't like it? We rebuild free"].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <span className="w-4 h-4 bg-emerald-500/20 rounded-full flex items-center justify-center text-[8px] text-emerald-400">
                  &#10003;
                </span>
                {item}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Minimal footer */}
      <footer className="py-8 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-zinc-600 text-sm">&copy; {new Date().getFullYear()} Voxaris AI. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-zinc-600 hover:text-zinc-400 text-sm transition-colors">Home</Link>
            <Link to="/book-demo" className="text-zinc-600 hover:text-zinc-400 text-sm transition-colors">Book Demo</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
