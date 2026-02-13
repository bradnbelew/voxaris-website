import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { label: 'Product', href: '/#features' },
  {
    label: 'Solutions',
    href: '#',
    dropdown: [
      { label: 'Auto Dealerships', href: '/solutions/dealerships', desc: 'AI sales agents for auto' },
      { label: 'Law Firms', href: '/solutions/law-firms', desc: 'Intake automation' },
      { label: 'Contractors', href: '/solutions/contractors', desc: 'Lead qualification' },
      { label: 'Agencies', href: '/solutions/agencies', desc: 'White-label platform' },
    ],
  },
  { label: 'Technology', href: '/technology' },
  { label: 'Demo', href: '/demo' },
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
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-black/80 backdrop-blur-2xl border-b border-white/[0.04]'
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <nav className="container-wide">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <Link to="/" className="flex items-center shrink-0">
              <img src="/voxaris-logo-white.png" alt="Voxaris" className="h-7 w-auto" />
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div key={link.label} className="relative">
                  {link.dropdown ? (
                    <button
                      className={`flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium transition-all duration-200 ${
                        openDropdown === link.label ? 'text-white' : 'text-white/40 hover:text-white/80'
                      }`}
                      onMouseEnter={() => setOpenDropdown(link.label)}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      {link.label}
                      <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${openDropdown === link.label ? 'rotate-180' : ''}`} />
                    </button>
                  ) : (
                    <Link
                      to={link.href}
                      className={`px-4 py-2 text-[13px] font-medium transition-all duration-200 ${
                        location.pathname === link.href ? 'text-white' : 'text-white/40 hover:text-white/80'
                      }`}
                    >
                      {link.label}
                    </Link>
                  )}

                  {/* Dropdown */}
                  {link.dropdown && (
                    <AnimatePresence>
                      {openDropdown === link.label && (
                        <motion.div
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 p-2 bg-carbon-900/95 backdrop-blur-2xl rounded-2xl border border-white/[0.06] shadow-elevated"
                          initial={{ opacity: 0, y: 8, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.97 }}
                          transition={{ duration: 0.15 }}
                          onMouseEnter={() => setOpenDropdown(link.label)}
                          onMouseLeave={() => setOpenDropdown(null)}
                        >
                          {link.dropdown.map((item) => (
                            <Link
                              key={item.label}
                              to={item.href}
                              className="flex flex-col px-4 py-3 rounded-xl hover:bg-white/[0.04] transition-colors group"
                            >
                              <span className="text-[13px] font-medium text-white/90 group-hover:text-white">
                                {item.label}
                              </span>
                              <span className="text-[11px] text-white/30">
                                {item.desc}
                              </span>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-4">
              <Link to="/dashboard">
                <Button
                  variant="ghost"
                  className="text-white/40 hover:text-white hover:bg-transparent font-medium text-[13px] px-0"
                >
                  Sign in
                </Button>
              </Link>
              <Link to="/book-demo">
                <Button className="bg-white hover:bg-white/90 text-black rounded-full px-6 h-9 font-medium text-[13px] transition-all duration-300 hover:shadow-glow group">
                  Get Started
                  <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              className="lg:hidden p-2 text-white/60"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
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
          >
            <div className="h-full flex flex-col pt-20">
              <div className="flex-1 overflow-y-auto px-6 py-8">
                <div className="space-y-6">
                  {navLinks.map((link) => (
                    <div key={link.label}>
                      {link.dropdown ? (
                        <div className="space-y-3">
                          <span className="text-[11px] font-medium text-white/30 uppercase tracking-[0.2em]">
                            {link.label}
                          </span>
                          <div className="grid gap-2 pl-1">
                            {link.dropdown.map((item) => (
                              <Link
                                key={item.label}
                                to={item.href}
                                className="block py-2 text-lg text-white/70 hover:text-white transition-colors"
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <Link
                          to={link.href}
                          className="block text-2xl font-medium text-white/90"
                        >
                          {link.label}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 border-t border-white/[0.06] space-y-3">
                <Link to="/book-demo" className="block">
                  <Button className="w-full bg-white hover:bg-white/90 text-black h-12 rounded-full font-medium">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/dashboard" className="block">
                  <Button variant="outline" className="w-full border-white/10 text-white/70 h-12 rounded-full font-medium bg-transparent hover:bg-white/[0.04]">
                    Sign in
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
