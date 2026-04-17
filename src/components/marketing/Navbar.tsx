import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
  {
    label: 'Products',
    href: '#',
    dropdown: [
      { label: 'V·TEAMS', href: '#vteams', desc: 'AI inbound call squads — 24/7', badge: '' },
      { label: 'Talking Postcards', href: '/talking-postcard', desc: 'QR mail → AI video → booked appt', badge: '' },
      { label: 'AI Hiring Agents', href: '/hiring-agents', desc: 'Screen every applicant by phone', badge: '' },
      { label: 'Presence', href: '/presence', desc: 'Web builder + AEO optimization', badge: 'New' },
    ],
  },
  {
    label: 'Solutions',
    href: '#',
    dropdown: [
      { label: 'Auto Dealerships', href: '/solutions/dealerships', desc: 'Buyback campaigns + BDC AI' },
      { label: 'Direct Mail', href: '/solutions/direct-mail', desc: 'AI-powered mailers that convert' },
      { label: 'Hotels & Resorts', href: '/solutions/hospitality', desc: 'AI concierge for direct bookings' },
      { label: 'Home Services', href: '/solutions/contractors', desc: 'Lead capture & booking' },
      { label: 'White Label', href: '/solutions/white-label', desc: 'Your brand, our AI engine' },
    ],
  },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Blog', href: '/blog' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [location]);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-carbon-900 focus:rounded-lg focus:shadow-md focus:text-sm focus:font-medium"
      >
        Skip to content
      </a>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-carbon-950/95 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
            : 'bg-carbon-950/90 backdrop-blur-xl'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <nav className="container-wide">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center shrink-0">
              <img src="/voxaris-logo-white-cropped.png" alt="Voxaris AI" className="h-10 w-auto" />
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.dropdown && setOpenDropdown(link.label)}
                  onMouseLeave={() => link.dropdown && setOpenDropdown(null)}
                >
                  {link.dropdown ? (
                    <>
                      <button className={`flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium transition-all duration-200 ${openDropdown === link.label ? 'text-white' : 'text-white/50 hover:text-white/80'}`}>
                        {link.label}
                        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${openDropdown === link.label ? 'rotate-180' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {openDropdown === link.label && (
                          <motion.div
                            className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 p-2 bg-carbon-900 rounded-2xl border border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{ duration: 0.15 }}
                          >
                            {link.dropdown.map((item) => {
                              const inner = (
                                <div className="flex items-start justify-between px-4 py-3 rounded-xl hover:bg-white/[0.05] transition-colors group cursor-pointer">
                                  <div>
                                    <span className="text-[13px] font-medium text-white/80 block">{item.label}</span>
                                    <span className="text-[11px] text-white/30">{item.desc}</span>
                                  </div>
                                  {'badge' in item && item.badge && (
                                    <span className="text-[9px] font-bold text-gold-400 bg-gold-500/10 border border-gold-500/20 px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 mt-0.5">
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                              );

                              return item.href.startsWith('#') ? (
                                <a key={item.label} href={item.href}>{inner}</a>
                              ) : (
                                <Link key={item.label} to={item.href}>{inner}</Link>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      to={link.href}
                      className={`px-4 py-2 text-[13px] font-medium transition-all duration-200 ${
                        location.pathname === link.href
                          ? 'text-gold-400'
                          : link.label === 'Pricing'
                            ? 'text-white/60 hover:text-gold-400'
                            : 'text-white/50 hover:text-white/80'
                      }`}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="hidden lg:flex items-center gap-4">
              <Link to="/book-demo">
                <Button className="bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-700 hover:via-gold-600 hover:to-gold-700 text-white rounded-full px-6 h-9 font-medium text-[13px] group shadow-gold-sm hover:shadow-gold border border-gold-400/30 transition-all duration-300">
                  Book Demo
                  <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 text-white/60 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
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
            className="fixed inset-0 z-40 lg:hidden bg-carbon-950"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="h-full flex flex-col pt-16">
              <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
                {navLinks.map((link) => (
                  <div key={link.label}>
                    {link.dropdown ? (
                      <div className="space-y-3">
                        <span className="text-[11px] font-semibold text-white/30 uppercase tracking-[0.2em]">{link.label}</span>
                        <div className="grid gap-1 pl-1">
                          {link.dropdown.map((item) => {
                            const inner = (
                              <div className="py-2.5 px-3 rounded-xl hover:bg-white/[0.05] transition-colors">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg font-medium text-white/60 hover:text-white transition-colors">{item.label}</span>
                                  {'badge' in item && item.badge && (
                                    <span className="text-[9px] font-bold text-gold-400 bg-gold-500/10 border border-gold-500/20 px-1.5 py-0.5 rounded-full uppercase">{item.badge}</span>
                                  )}
                                </div>
                              </div>
                            );
                            return item.href.startsWith('#') ? (
                              <a key={item.label} href={item.href}>{inner}</a>
                            ) : (
                              <Link key={item.label} to={item.href}>{inner}</Link>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <Link to={link.href} className="block text-2xl font-medium text-white">{link.label}</Link>
                    )}
                  </div>
                ))}
              </div>
              <div className="p-6 border-t border-white/[0.06] space-y-3">
                <Link to="/book-demo" className="block">
                  <Button className="w-full bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-white h-12 rounded-full font-medium border border-gold-400/30 shadow-gold-sm">
                    Book Demo <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
