import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Product', href: '/#features' },
  {
    label: 'Solutions',
    href: '#',
    dropdown: [
      { label: 'Dealerships', href: '/solutions/dealerships' },
      { label: 'Law Firms', href: '/solutions/law-firms' },
      { label: 'Contractors', href: '/solutions/contractors' },
      { label: 'Agencies', href: '/solutions/agencies' },
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
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-white/90 backdrop-blur-xl border-b border-platinum-200 shadow-sm'
            : 'bg-transparent'
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-navy-900">
                VOXARIS
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div key={link.label} className="relative">
                  {link.dropdown ? (
                    <button
                      className={cn(
                        'flex items-center gap-1 px-4 py-2 text-sm font-medium text-navy-600 hover:text-navy-900 transition-colors rounded-lg hover:bg-navy-50'
                      )}
                      onMouseEnter={() => setOpenDropdown(link.label)}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      {link.label}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  ) : (
                    <Link
                      to={link.href}
                      className="px-4 py-2 text-sm font-medium text-navy-600 hover:text-navy-900 transition-colors rounded-lg hover:bg-navy-50"
                    >
                      {link.label}
                    </Link>
                  )}

                  {/* Dropdown */}
                  {link.dropdown && (
                    <AnimatePresence>
                      {openDropdown === link.label && (
                        <motion.div
                          className="absolute top-full left-0 mt-2 w-48 py-2 bg-white rounded-xl border border-platinum-200 shadow-lg"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          onMouseEnter={() => setOpenDropdown(link.label)}
                          onMouseLeave={() => setOpenDropdown(null)}
                        >
                          {link.dropdown.map((item) => (
                            <Link
                              key={item.label}
                              to={item.href}
                              className="block px-4 py-2 text-sm text-navy-600 hover:text-navy-900 hover:bg-cream-100 transition-colors"
                            >
                              {item.label}
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
                <Button variant="ghost" className="text-navy-600 hover:text-navy-900 hover:bg-navy-50">
                  Login
                </Button>
              </Link>
              <Link to="/demo">
                <Button className="bg-navy-900 hover:bg-navy-800 text-white rounded-full px-6">
                  Book Demo
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-navy-600 hover:text-navy-900"
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
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-cream-100" />
            <motion.div
              className="relative h-full flex flex-col items-center justify-center gap-6 p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              {navLinks.map((link) => (
                <div key={link.label} className="text-center">
                  {link.dropdown ? (
                    <div className="space-y-2">
                      <span className="text-xl font-medium text-navy-400">{link.label}</span>
                      <div className="flex flex-col gap-1">
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.label}
                            to={item.href}
                            className="text-lg text-navy-600 hover:text-navy-900 transition-colors"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-2xl font-medium text-navy-900 hover:text-accent-500 transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}

              <div className="flex flex-col gap-3 mt-6 w-full max-w-xs">
                <Link to="/dashboard" className="w-full">
                  <Button variant="outline" className="w-full border-navy-300 text-navy-900 hover:bg-navy-50">
                    Login
                  </Button>
                </Link>
                <Link to="/demo" className="w-full">
                  <Button className="w-full bg-navy-900 hover:bg-navy-800 text-white">
                    Book Demo
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
