import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Loader2, Mail, QrCode, Zap, PenLine, Smartphone } from 'lucide-react';
import { Navbar, Footer } from '@/components/marketing';

const API_BASE = '';
const ACCENT = '#d4a843';
const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease },
});

export function TalkingPostcard() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ business: '', gm: '', highlight: '' });
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('loading');
    setErrorMsg('');

    try {
      const res = await fetch(`${API_BASE}/api/voxaris/tavus/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'talking-postcard',
          dealership: form.business,
          gm_name: form.gm,
          highlight: form.highlight,
        }),
      });

      if (!res.ok) throw new Error('Failed to create demo session');
      const data = await res.json();

      if (data.success && data.conversation_url) {
        const params = new URLSearchParams({
          url: data.conversation_url,
          dealership: form.business,
          name: form.gm,
        });
        navigate(`/talking-postcard/demo?${params.toString()}`);
      } else {
        throw new Error(data.error || 'Could not generate demo');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
      setFormState('error');
      setTimeout(() => setFormState('idle'), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Helmet>
        <title>Talking Postcards — Direct Mail That Talks Back | Voxaris</title>
        <meta name="description" content="Handwritten mailers with QR codes that launch a live AI video conversation. Bridge offline marketing to real appointments." />
        <link rel="canonical" href="https://voxaris.io/talking-postcard" />
        <meta property="og:title" content="Talking Postcards | Voxaris" />
        <meta property="og:description" content="Your mail just got a face and a voice. QR codes that launch live AI video — personalized for every recipient." />
        <meta property="og:url" content="https://voxaris.io/talking-postcard" />
        <meta property="og:image" content="https://voxaris.io/og-image.png" />
      </Helmet>

      <Navbar />
      <main id="main-content">
        <TopStrip />
        <Hero
          form={form}
          setForm={setForm}
          formState={formState}
          errorMsg={errorMsg}
          handleSubmit={handleSubmit}
        />
        <ProblemSection />
        <HowItWorks />
        <Mailer />
        <BottomCTA />
      </main>
      <Footer />
    </div>
  );
}

/* ══════════════════════════════════════════════
   Top Strip
═════════════════════════════════════════════ */
function TopStrip() {
  return (
    <div className="border-b border-white/[0.06] bg-black">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 h-11 flex items-center justify-between text-[11px] font-mono text-white/40">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: ACCENT }} />
          <span className="uppercase tracking-[0.18em]">Voxaris · Talking Postcards</span>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <span>02 / 04</span>
          <span className="text-white/25">·</span>
          <span>Direct mail that talks back</span>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   Hero — with inline form (preserves submit logic)
═════════════════════════════════════════════ */
interface HeroProps {
  form: { business: string; gm: string; highlight: string };
  setForm: (v: { business: string; gm: string; highlight: string }) => void;
  formState: 'idle' | 'loading' | 'success' | 'error';
  errorMsg: string;
  handleSubmit: (e: React.FormEvent) => void;
}

function Hero({ form, setForm, formState, errorMsg, handleSubmit }: HeroProps) {
  return (
    <section className="relative pt-20 pb-16 lg:pt-28 lg:pb-24 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-0 right-0 h-[700px]"
          style={{
            background:
              'linear-gradient(135deg, rgba(212,168,67,0.14) 0%, transparent 42%), linear-gradient(225deg, rgba(212,168,67,0.06) 0%, transparent 35%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-16 items-start">
          {/* Left — headline */}
          <div>
            <motion.div
              className="inline-flex items-center gap-2 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-[10px] font-mono uppercase tracking-[0.22em]" style={{ color: ACCENT }}>
                [ Solution · 02 ]
              </span>
              <span className="h-px w-10 bg-white/20" />
              <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-white/40">
                Direct mail
              </span>
            </motion.div>

            <motion.h1
              className="font-light text-white leading-[0.95] tracking-[-0.035em] mb-8"
              style={{
                fontSize: 'clamp(2.5rem, 6.5vw, 5.75rem)',
                fontWeight: 500,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease }}
            >
              Your mail
              <br />
              just got a{' '}
              <span className="font-editorial italic" style={{ color: ACCENT, fontWeight: 400 }}>
                face
              </span>
              <br />
              and a{' '}
              <span className="font-editorial italic" style={{ color: ACCENT, fontWeight: 400 }}>
                voice.
              </span>
            </motion.h1>

            <motion.p
              className="text-[16px] sm:text-[17px] text-white/55 leading-[1.7] max-w-xl mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease }}
            >
              Handwritten letters with a QR code that opens a live AI video conversation — personalized
              for every recipient. Not a flyer. A personal invitation that converts.
            </motion.p>

            {/* Stats rail */}
            <motion.div
              className="grid grid-cols-3 gap-8 border-t border-white/[0.08] pt-7 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.35 }}
            >
              {[
                { num: '6–12%', label: 'response rate' },
                { num: '<3s', label: 'to first video' },
                { num: '45s', label: 'demo setup' },
              ].map((s) => (
                <div key={s.label}>
                  <div
                    className="text-2xl sm:text-3xl font-editorial italic tabular-nums mb-1"
                    style={{ color: ACCENT, fontWeight: 400 }}
                  >
                    {s.num}
                  </div>
                  <div className="text-[11px] text-white/40 uppercase tracking-wider">
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-4 text-[11px] font-mono text-white/35"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {['No credit card', '45-second setup', 'Instant video'].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full" style={{ background: ACCENT }} />
                  {t}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right — form card (editorial dossier style) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease }}
            className="relative"
          >
            {/* Peek card behind */}
            <div
              className="absolute -top-3 -right-3 bottom-3 left-3 bg-white/[0.02] border border-white/[0.06]"
              style={{ transform: 'rotate(1.5deg)' }}
            />

            <div
              className="relative bg-[#f5f0e6] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
              style={{ transform: 'rotate(-1deg)' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-carbon-300">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-40" style={{ background: ACCENT }} />
                    <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: ACCENT }} />
                  </span>
                  <span className="text-[10px] font-mono text-carbon-500 uppercase tracking-[0.15em]">
                    generate-demo · live
                  </span>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-[0.18em] font-mono" style={{ color: ACCENT }}>
                  FREE
                </span>
              </div>

              <div className="px-6 py-6">
                {formState === 'idle' || formState === 'error' ? (
                  <>
                    <div className="mb-6">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-carbon-500 block mb-2">
                        Step 01 — Input
                      </span>
                      <h2 className="text-[24px] font-light text-carbon-900 leading-tight">
                        Get your free demo
                      </h2>
                      <p className="text-[12px] font-mono text-carbon-500 mt-1">
                        See your AI agent in under a minute.
                      </p>
                    </div>

                    {formState === 'error' && (
                      <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-[12px] font-mono text-red-700">
                        {errorMsg}
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div>
                        <label className="block text-[10px] font-mono text-carbon-500 uppercase tracking-[0.15em] mb-2">
                          Business name *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Orlando HVAC Co."
                          value={form.business}
                          onChange={(e) => setForm({ ...form, business: e.target.value })}
                          required
                          className="w-full h-11 bg-transparent border-0 border-b border-carbon-400 text-carbon-900 text-[14px] placeholder:text-carbon-400 focus:outline-none focus:border-carbon-900 transition-colors pb-2"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-carbon-500 uppercase tracking-[0.15em] mb-2">
                          Your name *
                        </label>
                        <input
                          type="text"
                          placeholder="First and last name"
                          value={form.gm}
                          onChange={(e) => setForm({ ...form, gm: e.target.value })}
                          required
                          className="w-full h-11 bg-transparent border-0 border-b border-carbon-400 text-carbon-900 text-[14px] placeholder:text-carbon-400 focus:outline-none focus:border-carbon-900 transition-colors pb-2"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-carbon-500 uppercase tracking-[0.15em] mb-2">
                          Biggest lead challenge or highlight *
                        </label>
                        <textarea
                          rows={3}
                          placeholder='e.g. "We miss 60% of after-hours leads"'
                          value={form.highlight}
                          onChange={(e) => setForm({ ...form, highlight: e.target.value })}
                          required
                          className="w-full bg-transparent border-0 border-b border-carbon-400 text-carbon-900 text-[14px] placeholder:text-carbon-400 focus:outline-none focus:border-carbon-900 transition-colors pb-2 resize-none pt-2"
                        />
                      </div>
                      <button
                        type="submit"
                        className="group w-full flex items-center justify-center gap-3 h-[58px] text-[14px] font-semibold text-black rounded-none border border-gold-400/60 bg-gold-500 hover:bg-gold-400 shadow-[4px_4px_0_0_rgba(0,0,0,0.15)] hover:shadow-[2px_2px_0_0_rgba(0,0,0,0.15)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 mt-2"
                      >
                        <span className="uppercase tracking-[0.14em]">Generate my AI demo</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </form>
                    <p className="text-center text-[10px] font-mono text-carbon-500 mt-4 uppercase tracking-wider">
                      45 seconds · No credit card · Instant video
                    </p>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-14 h-14 mx-auto border-2 border-carbon-900 flex items-center justify-center mb-5">
                      <Loader2 className="w-7 h-7 text-carbon-900 animate-spin" />
                    </div>
                    <h3 className="text-[20px] font-light text-carbon-900 mb-3">
                      Building your agent...
                    </h3>
                    <p className="text-[13px] text-carbon-600 mb-6 max-w-xs mx-auto font-mono">
                      Configuring AI for{' '}
                      <span className="text-carbon-900 font-medium">{form.business}</span>.
                      Redirecting automatically.
                    </p>
                    <span
                      className="inline-flex items-center gap-2 px-4 py-2 border text-[11px] font-mono uppercase tracking-wider"
                      style={{ borderColor: ACCENT, color: ACCENT }}
                    >
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                      Configuring agent...
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Ticker */}
      <motion.div
        className="mt-14 border-y border-white/[0.06] py-4 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 pr-8 text-[11px] font-mono text-white/30 uppercase tracking-[0.15em]">
              <span>· 6–12% response rate</span>
              <span style={{ color: ACCENT }}>◆</span>
              <span>· Handwritten letters</span>
              <span style={{ color: ACCENT }}>◆</span>
              <span>· QR-launched AI video</span>
              <span style={{ color: ACCENT }}>◆</span>
              <span>· Personalized per recipient</span>
              <span style={{ color: ACCENT }}>◆</span>
              <span>· Books live appointments</span>
              <span style={{ color: ACCENT }}>◆</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   Problem Section
═════════════════════════════════════════════ */
function ProblemSection() {
  const problems = [
    { num: '01', text: 'Standard direct mail averages under 1% response. Most of your spend goes straight in the trash.' },
    { num: '02', text: "Digital ads are expensive and ignored. Inbox filters, banner blindness — buyers tune it out." },
    { num: '03', text: 'The good leads you do reach call you back hours later, when your team is closed or slammed.' },
    { num: '04', text: "You've tried postcards, texts, and cold calls. Nothing bridges offline attention to a live conversation." },
  ];

  return (
    <section className="py-24 lg:py-32 bg-[#fafafa]">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-16 lg:gap-24">
          <motion.div {...fadeUp()}>
            <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-carbon-500 mb-4 block">
              The problem
            </span>
            <h2 className="text-4xl sm:text-6xl font-light text-carbon-900 leading-[1.02] tracking-[-0.03em]">
              Mail gets
              <br />
              <span className="text-carbon-400">tossed in 3 seconds.</span>
            </h2>
          </motion.div>

          <div>
            {problems.map((p, i) => (
              <motion.div
                key={p.num}
                className="py-7 border-t border-carbon-200 first:border-t-0 flex gap-6"
                {...fadeUp(i * 0.08)}
              >
                <span className="text-3xl font-editorial italic shrink-0" style={{ color: ACCENT, fontWeight: 400 }}>
                  {p.num}
                </span>
                <p className="text-[17px] text-carbon-700 leading-[1.55] pt-1">{p.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   How It Works — dark
═════════════════════════════════════════════ */
function HowItWorks() {
  const steps = [
    { num: '01', title: 'Personalized mailer', desc: 'Handwritten letter with their name, their situation, your specific offer. It looks and feels personal because it is.' },
    { num: '02', title: 'They scan the QR', desc: 'One tap. No app. No landing page. A live AI video agent opens and greets them by name.' },
    { num: '03', title: 'Live video conversation', desc: 'The agent answers questions, handles objections, qualifies the lead, and books the appointment on the spot.' },
    { num: '04', title: 'Hot lead handoff', desc: "Qualified leads and booked appointments land in your inbox and CRM. You show up warm, not cold." },
  ];

  return (
    <section className="py-24 lg:py-32 bg-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)',
        backgroundSize: '56px 56px',
      }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8">
        <motion.div className="mb-16 max-w-2xl" {...fadeUp()}>
          <span className="text-[11px] font-mono uppercase tracking-[0.22em] mb-4 block" style={{ color: ACCENT }}>
            How it works
          </span>
          <h2 className="text-4xl sm:text-5xl font-light text-white leading-[1.02] tracking-[-0.03em]">
            Mailbox to
            <br />
            <span className="text-white/40">booked appointment.</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.08] border border-white/[0.08]">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              className="bg-black p-8 lg:p-10"
              {...fadeUp(i * 0.08)}
            >
              <div className="text-[60px] font-editorial italic leading-none mb-6" style={{ color: ACCENT, fontWeight: 400 }}>
                {s.num}
              </div>
              <h3 className="text-[18px] font-medium text-white mb-3">{s.title}</h3>
              <p className="text-[13px] text-white/45 leading-[1.6]">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   Mailer showcase — light
═════════════════════════════════════════════ */
function Mailer() {
  const items = [
    { icon: PenLine, title: 'Handwritten, personalized', desc: "Each letter is personalized with the recipient's name, their situation, and your specific offer." },
    { icon: QrCode, title: 'QR opens live AI', desc: 'Scan, and a live AI video agent starts a real conversation — no app, no landing page.' },
    { icon: Smartphone, title: 'Books on the spot', desc: 'The agent qualifies, handles objections, and books the appointment before they hang up.' },
    { icon: Zap, title: '6–12% response rate', desc: 'Standard direct mail is under 1%. A compelling, instant CTA changes the math.' },
  ];

  return (
    <section className="py-24 lg:py-32 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <motion.div className="mb-14 max-w-2xl" {...fadeUp()}>
          <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-carbon-500 mb-4 block">
            The mailer
          </span>
          <h2 className="text-4xl sm:text-5xl font-light text-carbon-900 leading-[1.02] tracking-[-0.03em]">
            This is what lands
            <br />
            <span className="text-carbon-400">in their hands.</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center">
          {/* Polaroid photo of mailer */}
          <motion.div {...fadeUp(0.1)} className="relative">
            <div
              className="relative bg-[#f5f0e6] p-4 pb-10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.2)]"
              style={{ transform: 'rotate(-1.2deg)' }}
            >
              <div className="relative aspect-[4/3] bg-white overflow-hidden border border-carbon-200">
                <img
                  src="/talking-postcard.png"
                  alt="Personalized talking postcard with QR code that launches a live AI video agent"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-2 left-4 right-4 flex items-center justify-between font-mono text-carbon-500">
                <span className="text-[10px] uppercase tracking-wider">mailer · personalized</span>
                <span className="text-[10px]">voxaris/postcard-01</span>
              </div>
            </div>
          </motion.div>

          {/* Features */}
          <div className="grid sm:grid-cols-2 gap-px bg-carbon-200 border border-carbon-200">
            {items.map((item, i) => (
              <motion.div
                key={item.title}
                {...fadeUp(0.15 + i * 0.06)}
                className="bg-white p-6 lg:p-7"
              >
                <item.icon className="w-5 h-5 mb-4" style={{ color: ACCENT }} strokeWidth={1.5} />
                <h3 className="text-[15px] font-semibold text-carbon-900 mb-2">{item.title}</h3>
                <p className="text-[12.5px] text-carbon-500 leading-[1.6]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   Bottom CTA
═════════════════════════════════════════════ */
function BottomCTA() {
  return (
    <section className="py-24 lg:py-32 bg-black relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px]"
          style={{
            background: `radial-gradient(ellipse at 50% 50%, ${ACCENT}18 0%, transparent 65%)`,
          }}
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 sm:px-8 text-center">
        <motion.h2
          className="text-4xl sm:text-6xl font-light text-white leading-[1.02] tracking-[-0.035em] mb-6"
          {...fadeUp()}
        >
          See it on your
          <br />
          <span className="font-editorial italic" style={{ color: ACCENT, fontWeight: 400 }}>
            own mailing list.
          </span>
        </motion.h2>

        <motion.p
          className="text-[16px] sm:text-[18px] text-white/50 leading-relaxed mb-10 max-w-xl mx-auto"
          {...fadeUp(0.1)}
        >
          Generate a free demo above, or book a 30-minute call to see the full system in action.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
          {...fadeUp(0.2)}
        >
          <Link to="/book-demo">
            <button className="group flex items-center gap-3 h-[58px] pl-7 pr-5 text-[14px] font-semibold text-black rounded-none border border-gold-400/60 bg-gold-500 hover:bg-gold-400 shadow-[4px_4px_0_0_rgba(212,168,67,0.35)] hover:shadow-[2px_2px_0_0_rgba(212,168,67,0.35)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200">
              <span className="uppercase tracking-[0.14em]">Book a free demo</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <a
            href="tel:4077594100"
            className="flex items-center h-[58px] px-6 text-[13px] font-medium text-white/60 hover:text-white transition-colors"
          >
            Call 407-759-4100 →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
