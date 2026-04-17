import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Mail, Globe, Search } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1] as const;

const slides = [
  {
    id: 'hiring',
    label: 'Hiring Intelligence',
    caption: 'AI video-interviewing every applicant.',
    image: '/maria-hero.png',
    icon: Users,
    accent: '#60a5fa',
  },
  {
    id: 'postcards',
    label: 'Talking Postcards',
    caption: 'Your mail just got a face and a voice.',
    image: '/talking-postcard.png',
    icon: Mail,
    accent: '#d4a843',
  },
  {
    id: 'website',
    label: 'Website Redesign',
    caption: 'A site built to convert. Live in 48 hours.',
    image: '/roofing-hero.png',
    icon: Globe,
    accent: '#a78bfa',
  },
  {
    id: 'aeo',
    label: 'AEO-GEO Optimization',
    caption: 'Show up in AI search. Dominate local.',
    image: '/direct-mail-hero.png',
    icon: Search,
    accent: '#34d399',
  },
];

export function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4200);
    return () => clearInterval(id);
  }, []);

  const current = slides[index];

  return (
    <section
      data-section="hero"
      className="relative overflow-hidden pt-28 pb-16 lg:pt-32 lg:pb-24"
      style={{ background: '#000' }}
    >
      {/* Soft amber wash top-left */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-20 -left-20 w-[600px] h-[500px]"
          style={{
            background:
              'radial-gradient(ellipse at 30% 30%, rgba(212,168,67,0.10) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.7) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-center">
          {/* LEFT — copy */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease }}
              className="font-semibold text-white leading-[1.02] mb-6"
              style={{
                fontSize: 'clamp(2.5rem, 5.6vw, 4.75rem)',
                letterSpacing: '-0.035em',
              }}
            >
              AI video agents{' '}
              <span className="text-gold-400">for dealerships</span>{' '}
              and local business.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease }}
              className="text-[17px] sm:text-[19px] text-white/55 leading-[1.6] mb-9 max-w-xl"
            >
              We build the AI that answers your leads, interviews your applicants,
              and turns direct mail into live conversations. You run the shop.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-10"
            >
              <Link to="/book-demo" className="w-full sm:w-auto">
                <button className="group flex w-full sm:w-auto items-center justify-center gap-2 h-[52px] px-9 text-[14px] font-semibold text-white rounded-full bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-500 hover:via-gold-400 hover:to-gold-500 border border-gold-400/30 shadow-gold-btn transition-all duration-300 hover:-translate-y-0.5">
                  See one live
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <a href="tel:+14077594100" className="w-full sm:w-auto">
                <button className="flex w-full sm:w-auto items-center justify-center h-[52px] px-8 text-[14px] font-medium text-white/60 hover:text-white rounded-full border border-white/[0.12] hover:border-white/[0.25] transition-all duration-200">
                  Call (407) 759-4100
                </button>
              </a>
            </motion.div>

            {/* Tab pills for the carousel */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="flex flex-wrap gap-2"
            >
              {slides.map((s, i) => {
                const active = i === index;
                return (
                  <button
                    key={s.id}
                    onClick={() => setIndex(i)}
                    className={`flex items-center gap-2 h-9 px-4 rounded-full border transition-all duration-300 text-[12px] font-medium ${
                      active
                        ? 'bg-white/[0.06] border-white/[0.18] text-white'
                        : 'bg-transparent border-white/[0.08] text-white/45 hover:text-white/75 hover:border-white/[0.14]'
                    }`}
                  >
                    <s.icon
                      className="w-3.5 h-3.5"
                      strokeWidth={1.75}
                      style={{ color: active ? s.accent : undefined }}
                    />
                    {s.label}
                  </button>
                );
              })}
            </motion.div>
          </div>

          {/* RIGHT — rotating product carousel */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
            className="relative"
          >
            <div
              className="relative aspect-[4/3] overflow-hidden border border-white/[0.08] rounded-xl"
              style={{
                boxShadow:
                  '0 30px 80px -20px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.03) inset',
              }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={current.id}
                  src={current.image}
                  alt={current.caption}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease }}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="eager"
                />
              </AnimatePresence>

              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10">
                <motion.div
                  key={current.id}
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 4.2, ease: 'linear' }}
                  className="h-full"
                  style={{ background: current.accent }}
                />
              </div>

              {/* Live badge */}
              <div
                className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/10"
                style={{ borderRadius: '6px' }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400/50" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[10px] font-mono text-white/70 uppercase tracking-[0.15em]">
                  Live
                </span>
              </div>

              {/* Caption */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id + '-cap'}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease }}
                  className="absolute bottom-4 left-4 right-4 flex items-center gap-2.5"
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: current.accent }}
                  />
                  <span className="text-[11px] sm:text-[12px] font-mono uppercase tracking-[0.15em] text-white/75">
                    {current.caption}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
