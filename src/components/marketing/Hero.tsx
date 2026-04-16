import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, PhoneCall, Mail, Users, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ease = [0.22, 1, 0.36, 1] as const;

const products = [
  {
    id: 'vteams',
    name: 'V·TEAMS',
    tagline: 'Inbound call squads',
    desc: '4 AI agents. Warm transfers. 24/7 coverage.',
    icon: PhoneCall,
    gradient: 'from-blue-500/10 to-blue-600/5',
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-400',
    border: 'border-blue-500/15 hover:border-blue-400/30',
    href: '#vteams',
  },
  {
    id: 'postcard',
    name: 'Talking Postcards',
    tagline: 'Direct mail that converts',
    desc: 'QR scan → AI video agent → appointment.',
    icon: Mail,
    gradient: 'from-gold-500/10 to-gold-600/5',
    iconBg: 'bg-gold-500/10',
    iconColor: 'text-gold-400',
    border: 'border-gold-500/15 hover:border-gold-400/30',
    href: '/talking-postcard',
  },
  {
    id: 'hiring',
    name: 'AI Hiring Agents',
    tagline: 'Phone-based screening',
    desc: 'AI interviews every applicant. You review the best.',
    icon: Users,
    gradient: 'from-emerald-500/10 to-emerald-600/5',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-400',
    border: 'border-emerald-500/15 hover:border-emerald-400/30',
    href: '/hiring-agents',
  },
  {
    id: 'presence',
    name: 'Presence',
    tagline: 'Web builder + AEO',
    desc: 'Build your site. Dominate AI search.',
    icon: Globe,
    gradient: 'from-violet-500/10 to-violet-600/5',
    iconBg: 'bg-violet-500/10',
    iconColor: 'text-violet-400',
    border: 'border-violet-500/15 hover:border-violet-400/30',
    href: '/presence',
  },
];

export function Hero() {
  return (
    <section data-section="hero" className="relative min-h-screen flex items-center overflow-hidden bg-carbon-950 pt-16">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[700px]"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(212,168,67,0.09) 0%, transparent 60%)' }}
        />
        <div
          className="absolute bottom-0 right-0 w-[600px] h-[500px]"
          style={{ background: 'radial-gradient(ellipse at 100% 100%, rgba(139,92,246,0.04) 0%, transparent 60%)' }}
        />
        <div className="absolute inset-0 noise-overlay opacity-[0.15]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 w-full py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — copy */}
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="mb-8"
            >
              <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-gold-500/20 bg-gold-500/[0.07]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400/50" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500" />
                </span>
                <span className="text-[11px] font-semibold text-gold-400 uppercase tracking-[0.18em]">AI Platform · 4 Products</span>
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-white leading-[1.05] tracking-tight mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease }}
            >
              AI agents that run
              <br />
              <span className="text-gold-gradient">your whole business.</span>
            </motion.h1>

            <motion.p
              className="text-lg text-white/50 mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease }}
            >
              Answer every call. Convert every mailer. Screen every candidate. Own your web presence. Four AI products built for businesses that can't afford to miss an opportunity.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease }}
            >
              <Link to="/book-demo">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-500 hover:via-gold-400 hover:to-gold-500 text-white h-14 px-10 text-[15px] font-semibold rounded-full group shadow-gold-btn border border-gold-400/30 transition-all duration-500 hover:-translate-y-0.5"
                >
                  Book a Demo
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <a href="#products">
                <Button
                  size="lg"
                  variant="ghost"
                  className="h-14 px-8 text-[15px] text-white/40 hover:text-white hover:bg-white/[0.06] rounded-full border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  See All Products
                </Button>
              </a>
            </motion.div>

            <motion.div
              className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-white/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {['Live in 48 hours', 'No contracts', 'Works with any CRM'].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-gold-500/50" />
                  {item}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — product cards grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {products.map((product, i) => {
                const Inner = (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.4 + i * 0.1, ease }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  >
                    <div className={`group relative p-5 rounded-2xl bg-gradient-to-br ${product.gradient} border ${product.border} transition-all duration-300 cursor-pointer`}>
                      <div className={`w-9 h-9 rounded-xl ${product.iconBg} flex items-center justify-center mb-4`}>
                        <product.icon className={`w-[18px] h-[18px] ${product.iconColor}`} strokeWidth={1.5} />
                      </div>
                      <div className="text-[14px] font-bold text-white mb-1 leading-tight">{product.name}</div>
                      <div className="text-[11px] text-white/35 leading-snug">{product.desc}</div>
                      <div className="mt-3 flex items-center gap-1 text-[10px] font-semibold text-white/20 group-hover:text-gold-400 transition-colors uppercase tracking-wider">
                        Learn more <ArrowRight className="w-2.5 h-2.5" />
                      </div>
                    </div>
                  </motion.div>
                );

                return product.href.startsWith('#') ? (
                  <a key={product.id} href={product.href}>{Inner}</a>
                ) : (
                  <Link key={product.id} to={product.href}>{Inner}</Link>
                );
              })}
            </div>
            {/* Glow behind cards */}
            <div
              className="absolute inset-0 -z-10 blur-3xl opacity-30 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(212,168,67,0.2), transparent 70%)' }}
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-carbon-950 pointer-events-none" />
    </section>
  );
}
