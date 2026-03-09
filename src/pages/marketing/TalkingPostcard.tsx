import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Loader2,
} from 'lucide-react';

// Use the Vercel serverless function on the same domain (not the Render backend)
const API_BASE = '';


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
      const res = await fetch(`${API_BASE}/api/voxaris/tavus/talking-postcard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealership: form.business,
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
    <div className="min-h-screen bg-[#0a0a0a] text-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
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
                Enter your business name and one key highlight.
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
                        placeholder="Business Name *"
                        value={form.business}
                        onChange={(e) => setForm({ ...form, business: e.target.value })}
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
                      <span className="text-white font-medium">{form.business}</span>.
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
