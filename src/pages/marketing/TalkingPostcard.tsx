import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { Navbar, Footer } from '@/components/marketing';

const API_BASE = '';
const ease = [0.22, 1, 0.36, 1] as const;

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
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Talking Postcards — AI Video on Direct Mail | Voxaris</title>
        <meta name="description" content="QR-code postcards that launch a live AI video conversation. Bridge offline marketing to online engagement with photorealistic AI." />
        <meta name="keywords" content="talking postcards, AI video postcard, QR code AI video, direct mail AI, interactive postcard, personalized AI video mailer" />
        <link rel="canonical" href="https://voxaris.io/talking-postcard" />
        <meta property="og:title" content="Talking Postcards — AI Video on Direct Mail | Voxaris" />
        <meta property="og:description" content="QR-code postcards that launch a live AI video conversation. Bridge offline marketing to online engagement with photorealistic AI." />
        <meta property="og:url" content="https://voxaris.io/talking-postcard" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://voxaris.io/og-image.png" />
        <meta name="twitter:image" content="https://voxaris.io/og-image.png" />
      </Helmet>

      <Navbar />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-white pt-20">
        {/* Background */}
        <div className="absolute inset-0">
          <div
            className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1600px] h-[1000px]"
            style={{ background: 'radial-gradient(ellipse at 50% 35%, rgba(212,168,67,0.04) 0%, rgba(148,163,184,0.04) 30%, transparent 60%)' }}
          />
          <div className="absolute inset-0 grid-pattern opacity-[0.02]" />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white/80" />
          <div className="absolute inset-0 noise-overlay opacity-40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 w-full py-12 lg:py-0">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left — Copy */}
            <div className="max-w-xl">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease }}
                className="mb-8"
              >
                <span className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-gold-200/60 bg-gold-50/50 backdrop-blur-sm shadow-gold-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400/60 opacity-60" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500" />
                  </span>
                  <span className="text-[11px] font-semibold text-gold-700 uppercase tracking-[0.15em]">Instant &bull; Personalized &bull; Real</span>
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                className="headline-hero text-slate-900 mb-6 overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease }}
              >
                Watch your AI agent{' '}
                <span className="text-gold-gradient">book appointments</span>{' '}
                <span className="text-slate-400">while you sleep.</span>
              </motion.h1>

              {/* Sub */}
              <motion.p
                className="text-lg sm:text-xl text-slate-600 max-w-lg leading-relaxed mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease }}
              >
                Enter your dealership name and one key highlight.
                We'll instantly create a photorealistic video of{' '}
                <strong className="text-slate-800">your own AI agent</strong> answering real customer leads.
              </motion.p>

              {/* Trust signals */}
              <motion.div
                className="flex flex-wrap items-center gap-6 text-sm text-slate-400 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25, ease }}
              >
                {[
                  'No credit card',
                  '45-second setup',
                  '6%+ response rate',
                ].map((text) => (
                  <span key={text} className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-gold-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold shrink-0">
                      &#10003;
                    </span>
                    {text}
                  </span>
                ))}
              </motion.div>

              {/* Metrics */}
              <motion.div
                className="pt-8 border-t border-slate-200 flex items-center gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                {[
                  { value: '6-12%', label: 'Response rate' },
                  { value: '<3s', label: 'First response' },
                  { value: '47', label: 'Appts week one' },
                ].map((stat, i) => (
                  <div key={stat.label} className="flex items-center gap-8">
                    <div>
                      <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-display tracking-tight">{stat.value}</div>
                      <div className="text-[11px] text-slate-400 mt-1 tracking-wide uppercase">{stat.label}</div>
                    </div>
                    {i < 2 && <div className="w-px h-8 bg-slate-200" />}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — Form card */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease }}
            >
              {/* Glow behind card */}
              <div
                className="absolute -inset-8 rounded-[3rem] -z-10"
                style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(212,168,67,0.06) 0%, transparent 60%)' }}
              />

              <div className="bg-white rounded-3xl shadow-card-luxury border border-slate-200/80 p-8 sm:p-10">
                {formState === 'idle' || formState === 'error' ? (
                  <>
                    <div className="text-center mb-6">
                      <span className="inline-block bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-white text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                        Response Time &lt;3s
                      </span>
                    </div>
                    <h2 className="text-3xl font-bold text-center mb-8 tracking-tight text-slate-900 font-display">
                      Get Your Free Demo
                    </h2>

                    {formState === 'error' && (
                      <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-600 text-center">
                        {errorMsg}
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <input
                        type="text"
                        placeholder="Dealership Name *"
                        value={form.business}
                        onChange={(e) => setForm({ ...form, business: e.target.value })}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-[16px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-100 transition-all"
                      />
                      <input
                        type="text"
                        placeholder="Your Name *"
                        value={form.gm}
                        onChange={(e) => setForm({ ...form, gm: e.target.value })}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-[16px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-100 transition-all"
                      />
                      <textarea
                        rows={3}
                        placeholder='Biggest lead problem or inventory highlight * (e.g. "We miss 60% of after-hours leads")'
                        value={form.highlight}
                        onChange={(e) => setForm({ ...form, highlight: e.target.value })}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-[16px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-100 transition-all resize-none"
                      />
                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-700 hover:via-gold-600 hover:to-gold-700 text-white font-semibold text-[16px] py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-500 shadow-gold-btn hover:shadow-[0_8px_32px_rgba(212,168,67,0.30)] hover:-translate-y-0.5 border border-gold-400/30"
                      >
                        Generate My Free AI Agent Demo
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </form>
                    <p className="text-center text-[11px] text-slate-400 mt-5">
                      Takes 45 seconds &bull; No credit card &bull; Instant video
                    </p>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gold-50 border border-gold-200 flex items-center justify-center mb-5">
                      <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3 font-display">Building your agent...</h3>
                    <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                      Creating a personalized AI agent for{' '}
                      <span className="text-slate-900 font-medium">{form.business}</span>.
                      You'll be redirected automatically.
                    </p>
                    <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold-50 border border-gold-200/60 text-sm text-gold-700">
                      <Sparkles className="w-4 h-4 text-gold-500 animate-pulse" />
                      Configuring your AI agent...
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-white" />
      </section>

      {/* ── THE ACTUAL MAILER ── */}
      <section className="py-20 lg:py-28 bg-carbon-50">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
          >
            <span className="text-[11px] font-semibold text-gold-600 uppercase tracking-[0.2em] mb-4 block">The Mailer</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-carbon-900 mb-4 font-display">
              This is what lands in their mailbox.
            </h2>
            <p className="text-lg text-carbon-400 max-w-2xl mx-auto">
              A handwritten letter — personalized with their name, their vehicle, and a QR code that launches a live AI video conversation. Not a generic flyer. A personal invitation.
            </p>
          </motion.div>

          <motion.div
            className="max-w-md mx-auto"
            initial={{ opacity: 0, y: 30, rotate: -1 }}
            whileInView={{ opacity: 1, y: 0, rotate: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
          >
            <div className="rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.15)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.20)] transition-all duration-500 hover:rotate-0">
              <img
                src="/handwritten-mailer.png"
                alt="Handwritten Talking Postcard — personalized buyback letter addressed to Mary with a QR code that launches a live AI video agent conversation with Julia"
                className="w-full h-auto"
              />
            </div>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center gap-6 mt-10 text-sm text-carbon-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {[
              'Personalized to each recipient',
              'Handwritten feel — not mass-printed',
              'QR code launches live AI agent',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                {item}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
