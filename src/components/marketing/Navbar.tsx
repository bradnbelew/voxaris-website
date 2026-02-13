import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import voxarisLogo from '@/assets/voxaris-logo-dark.png';

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
            ? 'bg-white/90 backdrop-blur-xl border-b border-neutral-200/50 shadow-subtle'
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <nav className="container-wide">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <Link to="/" className="flex items-center shrink-0">
              <img src={voxarisLogo} alt="Voxaris" className="h-9 w-auto" />
            </Link>

            {/* Desktop nav — centered */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div key={link.label} className="relative">
                  {link.dropdown ? (
                    <button
                      className={`flex items-center gap-1.5 px-4 py-2 text-[14px] font-medium transition-colors ${
                        openDropdown === link.label ? 'text-navy-900' : 'text-platinum-500 hover:text-navy-900'
                      }`}
                      onMouseEnter={() => setOpenDropdown(link.label)}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      {link.label}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === link.label ? 'rotate-180' : ''}`} />
                    </button>
                  ) : (
                    <Link
                      to={link.href}
                      className={`px-4 py-2 text-[14px] font-medium transition-colors ${
                        location.pathname === link.href ? 'text-navy-900' : 'text-platinum-500 hover:text-navy-900'
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
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 p-2 bg-white rounded-2xl border border-neutral-200/60 shadow-elevated"
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
                              className="flex flex-col px-4 py-3 rounded-xl hover:bg-neutral-50 transition-colors group"
                            >
                              <span className="text-[14px] font-medium text-navy-900 group-hover:text-navy-800">
                                {item.label}
                              </span>
                              <span className="text-xs text-platinum-400">
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
            <div className="hidden lg:flex items-center gap-3">
              <Link to="/dashboard">
                <Button
                  variant="ghost"
                  className="text-platinum-500 hover:text-navy-900 hover:bg-transparent font-medium text-[14px]"
                >
                  Sign in
                </Button>
              </Link>
              <Link to="/book-demo">
                <Button className="bg-navy-900 hover:bg-navy-800 text-white rounded-xl px-6 h-10 font-medium text-[14px] shadow-glow-navy hover:shadow-glow-navy-lg transition-all duration-300 group">
                  Get Started
                  <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              className="lg:hidden p-2 text-navy-900"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden bg-white"
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
                          <span className="text-xs font-semibold text-platinum-400 uppercase tracking-[0.15em]">
                            {link.label}
                          </span>
                          <div className="grid gap-2 pl-1">
                            {link.dropdown.map((item) => (
                              <Link
                                key={item.label}
                                to={item.href}
                                className="block py-2 text-lg text-navy-900 hover:text-navy-700 transition-colors"
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <Link
                          to={link.href}
                          className="block text-2xl font-medium text-navy-900"
                        >
                          {link.label}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 border-t border-neutral-100 space-y-3">
                <Link to="/book-demo" className="block">
                  <Button className="w-full bg-navy-900 hover:bg-navy-800 text-white h-12 rounded-xl font-medium">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/dashboard" className="block">
                  <Button variant="outline" className="w-full border-neutral-200 text-navy-900 h-12 rounded-xl font-medium">
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
