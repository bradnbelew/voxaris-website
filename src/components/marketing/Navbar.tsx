import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Product', href: '/#features' },
  {
    label: 'Solutions',
    href: '#',
    dropdown: [
      { label: 'Dealerships', href: '/solutions/dealerships', desc: 'AI sales agents for auto' },
      { label: 'Law Firms', href: '/solutions/law-firms', desc: 'Intake automation' },
      { label: 'Contractors', href: '/solutions/contractors', desc: 'Lead qualification' },
      { label: 'Agencies', href: '/solutions/agencies', desc: 'White-label platform' },
    ],
  },
  { label: 'Technology', href: '/technology' },
  { label: 'Pricing', href: '/pricing' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [location]);

  return (
    <>
      <motion.nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled
            ? 'bg-white/95 backdrop-blur-xl border-b border-platinum-200 shadow-sm'
            : 'bg-transparent'
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="container-wide">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-navy-900 tracking-tight">
                VOXARIS
              </span>
            </Link>

            {/* Desktop Navigation - Centered */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div key={link.label} className="relative">
                  {link.dropdown ? (
                    <button
                      className={cn(
                        'flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors',
                        'text-platinum-600 hover:text-navy-900'
                      )}
                      onMouseEnter={() => setOpenDropdown(link.label)}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      {link.label}
                      <ChevronDown className={cn(
                        'w-3.5 h-3.5 transition-transform duration-200',
                        openDropdown === link.label && 'rotate-180'
                      )} />
                    </button>
                  ) : (
                    <Link
                      to={link.href}
                      className="px-4 py-2 text-sm font-medium text-platinum-600 hover:text-navy-900 transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}

                  {/* Premium Dropdown */}
                  {link.dropdown && (
                    <AnimatePresence>
                      {openDropdown === link.label && (
                        <motion.div
                          className="absolute top-full left-0 mt-2 w-64 p-2 bg-white rounded-2xl border border-platinum-200 shadow-elevated"
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          onMouseEnter={() => setOpenDropdown(link.label)}
                          onMouseLeave={() => setOpenDropdown(null)}
                        >
                          {link.dropdown.map((item) => (
                            <Link
                              key={item.label}
                              to={item.href}
                              className="flex flex-col px-4 py-3 rounded-xl hover:bg-platinum-50 transition-colors group"
                            >
                              <span className="text-sm font-medium text-navy-900 group-hover:text-navy-800">
                                {item.label}
                              </span>
                              <span className="text-xs text-platinum-500">
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
                  className="text-platinum-600 hover:text-navy-900 hover:bg-transparent font-medium"
                >
                  Sign in
                </Button>
              </Link>
              <Link to="/demo">
                <Button className="bg-navy-900 hover:bg-navy-800 text-white rounded-xl px-6 h-11 font-medium shadow-glow-navy hover:shadow-glow-navy-lg transition-all duration-200 group">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-navy-900"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
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
                          <span className="text-sm font-medium text-platinum-500 uppercase tracking-wider">
                            {link.label}
                          </span>
                          <div className="grid gap-2 pl-4">
                            {link.dropdown.map((item) => (
                              <Link
                                key={item.label}
                                to={item.href}
                                className="text-lg text-navy-900 hover:text-navy-700 transition-colors"
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

              <div className="p-6 border-t border-platinum-200 space-y-3">
                <Link to="/demo" className="block">
                  <Button className="w-full bg-navy-900 hover:bg-navy-800 text-white h-12 rounded-xl font-medium">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/dashboard" className="block">
                  <Button variant="outline" className="w-full border-platinum-300 text-navy-900 h-12 rounded-xl font-medium">
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
