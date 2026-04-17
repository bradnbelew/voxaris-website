import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Mail, Globe, Search, CheckCircle2 } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1] as const;

const tabs = [
  {
    id: 'hiring',
    label: 'Hiring',
    icon: Phone,
    accent: 'text-blue-400',
    accentBg: 'bg-blue-500/10',
    headline: 'Every applicant interviewed within minutes.',
    body: 'When a candidate applies, an AI video agent calls them, asks the questions your hiring manager would ask, scores fit, and drops a ranked shortlist on your desk. No more resume piles. No more ghosted applicants.',
    bullets: [
      'Calls every applicant automatically',
      'Video interview — not just a phone screen',
      'Full transcript + AI fit score per candidate',
    ],
    cta: { label: 'See Hiring Intelligence', href: '/solutions/hiring-intelligence' },
    image: '/maria-hero.png',
    imageCaption: 'Recruiter dashboard — one live candidate interview in progress.',
  },
  {
    id: 'postcards',
    label: 'Direct Mail',
    icon: Mail,
    accent: 'text-gold-400',
    accentBg: 'bg-gold-500/10',
    headline: 'Postcards that pick up the phone for you.',
    body: 'A personalized postcard hits their mailbox. They scan the QR code and an AI video agent greets them by name, references their exact offer, and books the appointment — often before they put the card down.',
    bullets: [
      'Greets by name, references their specific offer',
      'Books the appointment in under two minutes',
      'Every scan + conversation logged to your CRM',
    ],
    cta: { label: 'See Talking Postcards', href: '/talking-postcard' },
    image: '/talking-postcard.png',
    imageCaption: 'One postcard. One QR. One live video conversation.',
  },
  {
    id: 'website',
    label: 'Website',
    icon: Globe,
    accent: 'text-violet-400',
    accentBg: 'bg-violet-500/10',
    headline: 'A site that converts. Live in 48 hours.',
    body: 'Most small-business sites are slow, cluttered, and built to look pretty — not to book appointments. We build fast, mobile-first, conversion-optimized sites with real local-SEO foundations. You approve, we ship.',
    bullets: [
      'Launched in 48 hours — not six months',
      'Mobile-first, PageSpeed 90+',
      'Contact forms, maps, local-SEO ready on day one',
    ],
    cta: { label: 'See Website Redesign', href: '/solutions/website-redesign' },
    image: '/roofing-hero.png',
    imageCaption: 'Conversion-ready site — built for the phone first.',
  },
  {
    id: 'aeo',
    label: 'AI Search',
    icon: Search,
    accent: 'text-emerald-400',
    accentBg: 'bg-emerald-500/10',
    headline: 'Get cited by ChatGPT, Perplexity, and Google AI.',
    body: 'Your future customers are asking AI for recommendations — not Google. We optimize your site, schema, and local signals so AI answers cite you as the best option. Free audit first, then monthly work that keeps you ahead.',
    bullets: [
      'Free audit at audit.voxaris.io',
      'Optimized for ChatGPT, Perplexity & Google AI Overviews',
      'Monthly updates + ranking reports',
    ],
    cta: { label: 'See AEO-GEO Optimization', href: '/solutions/aeo-geo' },
    image: '/direct-mail-hero.png',
    imageCaption: 'AI search citations — tracked, measured, ranked.',
  },
];

export function TabbedScenarios() {
  const [activeId, setActiveId] = useState(tabs[0].id);
  const active = tabs.find((t) => t.id === activeId)!;

  return (
    <section className="py-24 lg:py-32 bg-[#fafafa]">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="mb-12"
        >
          <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-carbon-500 mb-3 block">
            See it in action
          </span>
          <h2 className="text-3xl sm:text-5xl font-light text-carbon-900 leading-[1.05] max-w-2xl">
            Four tools. Each one closes
            <br />
            <span className="text-carbon-400">a different leak.</span>
          </h2>
        </motion.div>

        {/* Tab bar */}
        <div className="flex flex-wrap gap-2 mb-10 border-b border-carbon-200">
          {tabs.map((t) => {
            const isActive = t.id === activeId;
            return (
              <button
                key={t.id}
                onClick={() => setActiveId(t.id)}
                className={`flex items-center gap-2 px-5 h-12 -mb-px border-b-2 transition-all duration-200 text-[13px] font-medium ${
                  isActive
                    ? 'border-gold-500 text-carbon-900'
                    : 'border-transparent text-carbon-500 hover:text-carbon-800'
                }`}
              >
                <t.icon className={`w-4 h-4 ${isActive ? t.accent : ''}`} strokeWidth={1.75} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Active panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease }}
            className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center"
          >
            {/* Copy */}
            <div>
              <div
                className={`inline-flex items-center gap-2 h-7 px-3 rounded-full ${active.accentBg} mb-5`}
              >
                <active.icon className={`w-3.5 h-3.5 ${active.accent}`} strokeWidth={2} />
                <span className={`text-[11px] font-medium ${active.accent} tracking-wide`}>
                  {active.label}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-light text-carbon-900 leading-tight mb-5">
                {active.headline}
              </h3>

              <p className="text-[15px] text-carbon-600 leading-relaxed mb-7">{active.body}</p>

              <ul className="space-y-3 mb-9">
                {active.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-[14px] text-carbon-700">
                    <CheckCircle2
                      className={`w-4 h-4 ${active.accent} shrink-0 mt-0.5`}
                      strokeWidth={2}
                    />
                    {b}
                  </li>
                ))}
              </ul>

              <Link to={active.cta.href}>
                <button className="group inline-flex items-center gap-2 h-11 px-6 rounded-full bg-carbon-900 hover:bg-carbon-800 text-white text-[13px] font-semibold transition-all duration-200">
                  {active.cta.label}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </Link>
            </div>

            {/* Image */}
            <div className="relative">
              <div
                className="relative aspect-[4/3] overflow-hidden rounded-xl bg-carbon-100 border border-carbon-200"
                style={{ boxShadow: '0 30px 60px -20px rgba(0,0,0,0.25)' }}
              >
                <img
                  src={active.image}
                  alt={active.imageCaption}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-4 text-[12px] font-mono text-carbon-500 tracking-wide">
                {active.imageCaption}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
