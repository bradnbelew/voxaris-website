import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, ArrowRight, Users, Mail, Globe, Search } from 'lucide-react';

const solutions = [
  {
    label: 'Hiring Intelligence',
    href: '/solutions/hiring-intelligence',
    desc: 'Phone every applicant. Rank the best.',
    icon: Users,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    label: 'Talking Postcards',
    href: '/talking-postcard',
    desc: 'Your mail just got a face and a voice.',
    icon: Mail,
    color: 'text-gold-400',
    bg: 'bg-gold-500/10',
  },
  {
    label: 'Website Redesign',
    href: '/solutions/website-redesign',
    desc: 'A site built to convert. Live in weeks.',
    icon: Globe,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
  },
  {
    label: 'AEO-GEO Optimization',
    href: '/solutions/aeo-geo',
    desc: 'Show up in AI search and local results.',
    icon: Search,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setSolutionsOpen(false);
  }, [location]);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-carbon-900 focus:rounded-lg focus:text-sm focus:font-medium"
      >
        Skip to content
      </a>

      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-black/95 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <nav className="container-wide">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center shrink-0">
              <img src="/voxaris-logo-white-cropped.png" alt="Voxaris" className="h-9 w-auto" />
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">

              {/* Solutions dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setSolutionsOpen(true)}
                onMouseLeave={() => setSolutionsOpen(false)}
              >
                <button
                  className={`flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium transition-all duration-200 ${
                    solutionsOpen ? 'text-white' : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  Solutions
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${solutionsOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {solutionsOpen && (
                    <motion.div
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 p-2 bg-[#0a0a0a] rounded-2xl border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {solutions.map((item) => (
                        <Link key={item.label} to={item.href}>
                          <div className="flex items-center gap-3.5 px-3.5 py-3 rounded-xl hover:bg-white/[0.05] transition-colors group">
                            <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center shrink-0`}>
                              <item.icon className={`w-4 h-4 ${item.color}`} strokeWidth={1.5} />
                            </div>
                            <div>
                              <span className="text-[13px] font-medium text-white/80 group-hover:text-white transition-colors block">{item.label}</span>
                              <span className="text-[11px] text-white/30">{item.desc}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                to="/why-voxaris"
                className={`px-4 py-2 text-[13px] font-medium transition-all duration-200 ${
                  location.pathname === '/why-voxaris' ? 'text-white' : 'text-white/50 hover:text-white/80'
                }`}
              >
                Why Voxaris
              </Link>

              <Link
                to="/blog"
                className={`px-4 py-2 text-[13px] font-medium transition-all duration-200 ${
                  location.pathname === '/blog' ? 'text-white' : 'text-white/50 hover:text-white/80'
                }`}
              >
                Blog
              </Link>
            </div>

            {/* CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                to="/book-demo"
                className="flex items-center gap-2 px-5 h-9 bg-white text-black hover:bg-neutral-100 text-[13px] font-medium transition-all duration-200 group"
                style={{ borderRadius: '4px', boxShadow: '0 1px 0 rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.6)' }}
              >
                See a Live Demo
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 text-white/60 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="h-full flex flex-col pt-16">
              <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8">

                {/* Solutions */}
                <div>
                  <button
                    className="flex items-center justify-between w-full"
                    onClick={() => setMobileSolutionsOpen(!mobileSolutionsOpen)}
                  >
                    <span className="text-2xl font-light text-white">Solutions</span>
                    <ChevronDown className={`w-5 h-5 text-white/40 transition-transform ${mobileSolutionsOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {mobileSolutionsOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden mt-4 space-y-1"
                      >
                        {solutions.map((item) => (
                          <Link key={item.label} to={item.href}>
                            <div className="flex items-center gap-3 py-3 px-3 rounded-xl hover:bg-white/[0.05]">
                              <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center`}>
                                <item.icon className={`w-4 h-4 ${item.color}`} strokeWidth={1.5} />
                              </div>
                              <div>
                                <span className="text-[15px] font-medium text-white/75 block">{item.label}</span>
                                <span className="text-[11px] text-white/30">{item.desc}</span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link to="/why-voxaris" className="block text-2xl font-light text-white">Why Voxaris</Link>
                <Link to="/blog" className="block text-2xl font-light text-white">Blog</Link>
              </div>

              <div className="p-6 border-t border-white/[0.06]">
                <Link to="/book-demo" className="block">
                  <button
                    className="w-full h-12 bg-white text-black font-medium text-[15px] flex items-center justify-center gap-2"
                    style={{ borderRadius: '4px' }}
                  >
                    See a Live Demo <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
