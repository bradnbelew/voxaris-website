import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1] as const;

/* Cycling verticals — the word that swaps out mid-headline */
const verticals = [
  'dealerships',
  'roofers',
  'law firms',
  'medspas',
  'dentists',
  'contractors',
  'realtors',
];

/* Product slides — the stack that rotates */
const slides = [
  {
    id: 'hiring',
    label: 'Hiring Intelligence',
    meta: 'AI video interview · Live',
    image: '/maria-hero.png',
    accent: '#60a5fa',
    timecode: '00:02:14',
  },
  {
    id: 'postcards',
    label: 'Talking Postcards',
    meta: 'QR scan · booking appt',
    image: '/talking-postcard.png',
    accent: '#d4a843',
    timecode: '00:00:47',
  },
  {
    id: 'website',
    label: 'Website Redesign',
    meta: 'Deploy · 48h build',
    image: '/roofing-hero.png',
    accent: '#a78bfa',
    timecode: '48:00:00',
  },
  {
    id: 'aeo',
    label: 'AEO-GEO Optimization',
    meta: 'AI citation · ranked',
    image: '/direct-mail-hero.png',
    accent: '#34d399',
    timecode: '00:03:02',
  },
];

/* Ticker items — what the product does, in a conversational log */
const tickerItems = [
  '· Lead answered in 4 seconds',
  '· Candidate interviewed & scored',
  '· Postcard scanned → appointment booked',
  '· Site shipped in under 48 hours',
  '· Cited by ChatGPT',
  '· Applicant ranked #1 fit',
  '· Local pack · position 2',
  '· 9× search citations this week',
];

export function Hero() {
  const [wordIndex, setWordIndex] = useState(0);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const a = setInterval(() => setWordIndex((i) => (i + 1) % verticals.length), 2200);
    const b = setInterval(() => setSlideIndex((i) => (i + 1) % slides.length), 4600);
    return () => {
      clearInterval(a);
      clearInterval(b);
    };
  }, []);

  const cur = slides[slideIndex];
  const next = slides[(slideIndex + 1) % slides.length];

  return (
    <section
      data-section="hero"
      className="relative overflow-hidden bg-black"
    >
      {/* Textured background layers */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Diagonal gold wash */}
        <div
          className="absolute -top-40 -left-40 w-[900px] h-[900px] rotate-12"
          style={{
            background:
              'radial-gradient(ellipse at 30% 30%, rgba(212,168,67,0.14) 0%, rgba(212,168,67,0.04) 30%, transparent 65%)',
          }}
        />
        {/* Secondary warm wash bottom-right */}
        <div
          className="absolute -bottom-60 -right-40 w-[700px] h-[700px]"
          style={{
            background:
              'radial-gradient(ellipse at 70% 70%, rgba(236,174,74,0.08) 0%, transparent 60%)',
          }}
        />
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.9) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
        {/* Film grain */}
        <div
          className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.9'/></svg>\")",
          }}
        />
      </div>

      {/* Eyebrow strip — mono, ticker-style */}
      <div className="relative z-10 border-b border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-4 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400/60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[10.5px] font-mono uppercase tracking-[0.2em] text-white/50">
              Voxaris · Live production
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-[10.5px] font-mono uppercase tracking-[0.2em] text-white/30">
            <span>v·01</span>
            <span>Orlando, FL</span>
            <span className="text-white/50">{new Date().getFullYear()}</span>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 pt-16 lg:pt-24 pb-20 lg:pb-28">
        <div className="grid lg:grid-cols-[1.25fr_1fr] gap-10 lg:gap-16 items-start">
          {/* LEFT — editorial headline */}
          <div className="relative">
            {/* Big headline */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease }}
              className="text-white leading-[0.92] tracking-[-0.04em]"
              style={{ fontSize: 'clamp(3rem, 8.5vw, 7.25rem)', fontWeight: 500 }}
            >
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.05, ease }}
                className="block"
              >
                AI video agents
              </motion.span>

              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.18, ease }}
                className="block text-white/55"
              >
                for{' '}
                <span className="inline-block relative align-baseline">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={verticals[wordIndex]}
                      initial={{ opacity: 0, y: 24, rotateX: -45 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      exit={{ opacity: 0, y: -24, rotateX: 45 }}
                      transition={{ duration: 0.5, ease }}
                      className="inline-block text-gold-400 italic font-editorial"
                      style={{ fontWeight: 400 }}
                    >
                      {verticals[wordIndex]}.
                    </motion.span>
                  </AnimatePresence>
                </span>
              </motion.span>
            </motion.h1>

            {/* Subhead + asymmetric CTA */}
            <div className="mt-10 lg:mt-14 grid sm:grid-cols-[1fr_auto] gap-8 sm:gap-10 items-end max-w-2xl">
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35, ease }}
                className="text-[16px] sm:text-[17px] text-white/55 leading-[1.55] max-w-md"
              >
                We build the AI that answers your leads, interviews your applicants,
                and turns direct mail into live conversations.{' '}
                <span className="text-white/80">You run the shop.</span>
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-col gap-3 shrink-0"
              >
                <Link to="/book-demo">
                  <button className="group relative flex items-center gap-3 h-[58px] pl-7 pr-5 rounded-none border border-gold-400/60 bg-gold-500 hover:bg-gold-400 text-black text-[14px] font-semibold tracking-tight transition-all duration-200 hover:translate-x-[-2px] hover:translate-y-[-2px] shadow-[4px_4px_0_0_rgba(212,168,67,0.35)] hover:shadow-[6px_6px_0_0_rgba(212,168,67,0.5)]">
                    See one live
                    <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={2} />
                  </button>
                </Link>
                <a
                  href="tel:+14077594100"
                  className="text-[12px] font-mono text-white/45 hover:text-white/80 tracking-wide transition-colors text-center sm:text-right"
                >
                  or call (407) 759-4100 →
                </a>
              </motion.div>
            </div>

            {/* Sidebar mono stats — editorial rail */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="mt-14 grid grid-cols-3 gap-6 pt-7 border-t border-white/[0.08] max-w-2xl"
            >
              {[
                { n: '< 5s', l: 'Answer time' },
                { n: '10×', l: 'Candidates screened' },
                { n: '48h', l: 'Site deploy' },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-3xl lg:text-4xl font-editorial italic text-gold-400 leading-none mb-2" style={{ fontWeight: 400 }}>
                    {s.n}
                  </div>
                  <div className="text-[10.5px] font-mono uppercase tracking-[0.18em] text-white/35">
                    {s.l}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — offset "polaroid" product stack */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease }}
            className="relative lg:pt-12"
          >
            {/* Peek card behind */}
            <AnimatePresence mode="wait">
              <motion.div
                key={next.id + '-peek'}
                initial={{ opacity: 0, rotate: 0 }}
                animate={{ opacity: 0.45, rotate: 3.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease }}
                className="absolute top-[-12px] right-[-22px] w-[75%] aspect-[4/5] bg-carbon-900 border border-white/[0.08] origin-top-right"
                style={{
                  boxShadow: '0 20px 60px -10px rgba(0,0,0,0.8)',
                }}
              >
                <img
                  src={next.image}
                  alt=""
                  className="w-full h-full object-cover opacity-50 grayscale"
                  aria-hidden
                />
              </motion.div>
            </AnimatePresence>

            {/* Front card — the polaroid */}
            <motion.div
              animate={{ rotate: -2.2 }}
              transition={{ duration: 0.6, ease }}
              className="relative bg-[#f5f0e6] p-4 pb-10"
              style={{
                boxShadow:
                  '0 30px 80px -15px rgba(0,0,0,0.95), 0 0 0 1px rgba(255,255,255,0.04)',
              }}
            >
              {/* Top bar — mono label */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: cur.accent }}
                  />
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-carbon-700">
                    Now playing
                  </span>
                </div>
                <span className="text-[10px] font-mono text-carbon-500 tabular-nums">
                  {cur.timecode}
                </span>
              </div>

              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-carbon-200">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={cur.id}
                    src={cur.image}
                    alt={cur.label}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease }}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="eager"
                  />
                </AnimatePresence>

                {/* Corner code */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 bg-black/80 backdrop-blur-sm">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                  </span>
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/90">
                    REC
                  </span>
                </div>

                {/* Progress */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black/30">
                  <motion.div
                    key={cur.id + '-bar'}
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 4.6, ease: 'linear' }}
                    className="h-full"
                    style={{ background: cur.accent }}
                  />
                </div>
              </div>

              {/* Bottom caption — handwritten-feel */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={cur.id + '-cap'}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mt-4 flex items-baseline justify-between gap-3"
                >
                  <span className="font-editorial italic text-[20px] text-carbon-900 leading-none" style={{ fontWeight: 400 }}>
                    {cur.label}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-carbon-500 shrink-0">
                    {cur.meta}
                  </span>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Slide indicator dots */}
            <div className="absolute -bottom-6 left-4 flex items-center gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setSlideIndex(i)}
                  aria-label={`View ${s.label}`}
                  className={`h-1 transition-all duration-300 ${
                    i === slideIndex ? 'w-8 bg-gold-400' : 'w-3 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Ticker strip at base */}
      <div className="relative z-10 border-y border-white/[0.08] bg-black/40 backdrop-blur-sm overflow-hidden">
        <div
          className="flex py-4"
          style={{
            maskImage:
              'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
          }}
        >
          {[0, 1].map((dup) => (
            <div
              key={dup}
              className="flex shrink-0 items-center gap-10 pr-10 animate-marquee"
              style={{ ['--gap' as string]: '2.5rem' }}
              aria-hidden={dup === 1}
            >
              {tickerItems.map((t, i) => (
                <span
                  key={`${dup}-${i}`}
                  className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/40 whitespace-nowrap"
                >
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
