import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Loader2, Mail, QrCode, Zap } from 'lucide-react';
import { Navbar, Footer } from '@/components/marketing';

const API_BASE = '';
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

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px]"
            style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(212,168,67,0.10) 0%, rgba(212,168,67,0.03) 35%, transparent 65%)' }}
          />
          <div className="absolute inset-0 noise-overlay opacity-[0.08]" />
        </div>

        <div className="max-w-6xl mx-auto px-6 sm:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease }}
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-xl bg-gold-500/10 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-gold-400" strokeWidth={1.5} />
                </div>
                <span className="text-[10px] font-mono text-gold-400/70 uppercase tracking-[0.15em]">Talking Postcards</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-light text-white leading-[1.05] tracking-[-0.03em] mb-6">
                Your mail just got
                <br />
                <span className="text-gold-400">a face and a voice.</span>
              </h1>

              <p className="text-[17px] text-white/50 leading-[1.8] mb-8 max-w-lg">
                Handwritten letters — personalized with their name, their situation, a QR code that launches
                a live AI video conversation. Not a flyer. A personal invitation that converts.
              </p>

              <div className="flex flex-wrap gap-6 mb-8">
                {[
                  { value: '6–12%', label: 'Response rate' },
                  { value: '<3s', label: 'First response' },
                  { value: '45s', label: 'Setup time' },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-[22px] font-light text-gold-400">{s.value}</div>
                    <div className="text-[10px] font-mono text-white/25 uppercase tracking-wider mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                {['No credit card', '45-second setup', 'Instant video'].map((t) => (
                  <span key={t} className="flex items-center gap-1.5 text-[12px] font-mono text-white/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-500/50" />
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Right — form */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease }}
            >
              <div className="rounded-2xl border border-gold-500/20 bg-gold-500/[0.03] overflow-hidden">
                {/* Card header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gold-500/10">
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400/40" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500" />
                    </span>
                    <span className="text-[11px] font-mono text-gold-400/60">generate-your-demo.sh</span>
                  </div>
                  <span className="text-[9px] font-bold text-gold-400/30 uppercase tracking-[0.15em] font-mono">FREE</span>
                </div>

                <div className="p-6">
                  {formState === 'idle' || formState === 'error' ? (
                    <>
                      <div className="mb-6">
                        <h2 className="text-[18px] font-light text-white mb-1">Get Your Free Demo</h2>
                        <p className="text-[12px] font-mono text-white/25">See your AI agent in under a minute.</p>
                      </div>

                      {formState === 'error' && (
                        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-[12px] font-mono text-red-400">
                          {errorMsg}
                        </div>
                      )}

                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                          <label className="block text-[10px] font-mono text-white/25 uppercase tracking-[0.15em] mb-2">
                            Business Name *
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Orlando HVAC Co."
                            value={form.business}
                            onChange={(e) => setForm({ ...form, business: e.target.value })}
                            required
                            className="w-full h-11 bg-transparent border-0 border-b border-white/[0.12] text-white text-[14px] placeholder:text-white/20 focus:outline-none focus:border-gold-400/40 transition-colors pb-2"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-white/25 uppercase tracking-[0.15em] mb-2">
                            Your Name *
                          </label>
                          <input
                            type="text"
                            placeholder="First and last name"
                            value={form.gm}
                            onChange={(e) => setForm({ ...form, gm: e.target.value })}
                            required
                            className="w-full h-11 bg-transparent border-0 border-b border-white/[0.12] text-white text-[14px] placeholder:text-white/20 focus:outline-none focus:border-gold-400/40 transition-colors pb-2"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-white/25 uppercase tracking-[0.15em] mb-2">
                            Biggest lead challenge or highlight *
                          </label>
                          <textarea
                            rows={3}
                            placeholder='e.g. "We miss 60% of after-hours leads" or "We have summer specials running"'
                            value={form.highlight}
                            onChange={(e) => setForm({ ...form, highlight: e.target.value })}
                            required
                            className="w-full bg-transparent border-0 border-b border-white/[0.12] text-white text-[14px] placeholder:text-white/20 focus:outline-none focus:border-gold-400/40 transition-colors pb-2 resize-none pt-2"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full flex items-center justify-center gap-2 h-12 rounded-full bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-white text-[14px] font-semibold border border-gold-400/30 shadow-gold-sm transition-all duration-300 hover:-translate-y-0.5 group mt-2"
                        >
                          Generate my AI agent demo
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </form>
                      <p className="text-center text-[11px] font-mono text-white/20 mt-4">
                        Takes 45 seconds · No credit card · Instant video
                      </p>
                    </>
                  ) : (
                    <div className="text-center py-10">
                      <div className="w-14 h-14 mx-auto rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-5">
                        <Loader2 className="w-7 h-7 text-gold-400 animate-spin" />
                      </div>
                      <h3 className="text-[18px] font-light text-white mb-3">Building your agent...</h3>
                      <p className="text-[13px] text-white/35 mb-6 max-w-xs mx-auto font-mono">
                        Configuring AI for{' '}
                        <span className="text-white/60">{form.business}</span>.
                        Redirecting automatically.
                      </p>
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/15 text-[12px] font-mono text-gold-400/70">
                        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                        Configuring your AI agent...
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 lg:py-28 bg-carbon-950 relative overflow-hidden">
        <div className="absolute inset-0 noise-overlay opacity-[0.06] pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 sm:px-8 relative z-10">
          <motion.div className="text-center mb-14" {...fadeUp()}>
            <span className="eyebrow mb-3 block">The mailer</span>
            <h2 className="text-3xl sm:text-4xl font-light text-white">
              This is what lands in their mailbox.
              <br />
              <span className="text-white/35">Then in their hands. Then in their head.</span>
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div
              {...fadeUp(0.1)}
              className="relative"
            >
              <div
                className="absolute -inset-4 rounded-3xl pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(212,168,67,0.06) 0%, transparent 70%)' }}
              />
              <div className="rounded-2xl overflow-hidden border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                <img
                  src="/handwritten-mailer.png"
                  alt="Personalized handwritten talking postcard with QR code that launches a live AI video agent"
                  className="w-full h-auto"
                />
              </div>
            </motion.div>

            <div className="space-y-5">
              {[
                {
                  icon: Mail,
                  title: 'Handwritten, personalized',
                  desc: "Not mass-printed. Each letter is personalized with the recipient's name, their vehicle or situation, and your specific offer.",
                  color: 'text-gold-400',
                  bg: 'bg-gold-500/10',
                },
                {
                  icon: QrCode,
                  title: 'QR code launches live AI',
                  desc: 'They scan the code. A live AI video agent starts a real conversation — answering questions, handling objections, booking appointments.',
                  color: 'text-violet-400',
                  bg: 'bg-violet-500/10',
                },
                {
                  icon: Zap,
                  title: '6–12% response rate',
                  desc: 'Standard direct mail averages under 1%. Talking Postcards average 6–12% because the call to action is compelling and instant.',
                  color: 'text-emerald-400',
                  bg: 'bg-emerald-500/10',
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  {...fadeUp(0.15 + i * 0.08)}
                  className="flex gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]"
                >
                  <div className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                    <item.icon className={`w-4 h-4 ${item.color}`} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-[12px] text-white/35 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-black">
        <div className="max-w-2xl mx-auto px-6 sm:px-8 text-center">
          <motion.div {...fadeUp()}>
            <h2 className="text-3xl font-light text-white mb-4">
              Ready to see it for your business?
            </h2>
            <p className="text-[14px] text-white/35 mb-8">
              Generate a free demo above, or book a 30-minute call to see the full system.
            </p>
            <Link to="/book-demo">
              <button className="flex items-center gap-2 px-8 h-12 rounded-full bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-white text-[14px] font-semibold border border-gold-400/30 shadow-gold-sm transition-all duration-300 hover:-translate-y-0.5 mx-auto group">
                Book a free demo <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
