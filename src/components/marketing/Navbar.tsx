import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { label: 'Product', href: '/#features' },
  { label: 'Industries', href: '/solutions/dealerships' },
  { label: 'Demo', href: '/demo' },
  { label: 'Why Voxaris', href: '/why-voxaris' },
  {
    label: 'More',
    href: '#',
    dropdown: [
      { label: 'Direct Mail', href: '/solutions/direct-mail', desc: 'Talking Postcards that convert' },
      { label: 'Hotels & Resorts', href: '/solutions/hospitality', desc: 'AI concierge for direct bookings' },
      { label: 'Home Services', href: '/solutions/contractors', desc: 'Lead capture & booking' },
      { label: 'White Label', href: '/solutions/white-label', desc: 'Your brand, our AI engine' },
      { label: 'Technology', href: '/technology', desc: 'Under the hood' },
      { label: 'Blog', href: '/blog', desc: 'Insights & updates' },
    ],
  },
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
          isScrolled ? 'bg-white/80 backdrop-blur-2xl border-b border-black/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.04)]' : 'bg-transparent'
        }`}
        initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <nav className="container-wide">
          <div className="flex items-center justify-between h-[80px]">
            <Link to="/" className="flex items-center shrink-0">
              <img src="/voxaris-logo-white.png" alt="Voxaris AI" className="h-20 w-auto brightness-0" />
            </Link>
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div key={link.label} className="relative">
                  {link.dropdown ? (
                    <button
                      className={`flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium transition-all duration-200 ${openDropdown === link.label ? 'text-carbon-900' : 'text-carbon-400 hover:text-carbon-700'}`}
                      onMouseEnter={() => setOpenDropdown(link.label)} onMouseLeave={() => setOpenDropdown(null)}
                    >
                      {link.label}
                      <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${openDropdown === link.label ? 'rotate-180' : ''}`} />
                    </button>
                  ) : (
                    <Link to={link.href} className={`px-4 py-2 text-[13px] font-medium transition-all duration-200 ${location.pathname === link.href ? 'text-gold-600' : 'text-carbon-400 hover:text-carbon-700'}`}>
                      {link.label}
                    </Link>
                  )}
                  {link.dropdown && (
                    <AnimatePresence>
                      {openDropdown === link.label && (
                        <motion.div
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 p-2 bg-white rounded-2xl border border-black/[0.06] shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
                          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.15 }}
                          onMouseEnter={() => setOpenDropdown(link.label)} onMouseLeave={() => setOpenDropdown(null)}
                        >
                          {link.dropdown.map((item) => (
                            <Link key={item.label} to={item.href} className="flex flex-col px-4 py-3 rounded-xl hover:bg-carbon-50 transition-colors group">
                              <span className="text-[13px] font-medium text-carbon-800">{item.label}</span>
                              <span className="text-[11px] text-carbon-400">{item.desc}</span>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </div>
            <div className="hidden lg:flex items-center gap-4">
              <Link to="/book-demo"><Button className="bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-700 hover:via-gold-600 hover:to-gold-700 text-white rounded-full px-6 h-9 font-medium text-[13px] group shadow-gold-sm hover:shadow-gold border border-gold-400/30 transition-all duration-300">Book Demo <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-0.5 transition-transform" /></Button></Link>
            </div>
            <button className="lg:hidden p-2 text-carbon-500" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>{isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
          </div>
        </nav>
      </motion.header>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div className="fixed inset-0 z-40 lg:hidden bg-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="h-full flex flex-col pt-20">
              <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
                {navLinks.map((link) => (
                  <div key={link.label}>
                    {link.dropdown ? (
                      <div className="space-y-3">
                        <span className="text-[11px] font-semibold text-carbon-400 uppercase tracking-[0.2em]">{link.label}</span>
                        <div className="grid gap-2 pl-1">{link.dropdown.map((item) => (<Link key={item.label} to={item.href} className="block py-2 text-lg text-carbon-600 hover:text-carbon-900 transition-colors">{item.label}</Link>))}</div>
                      </div>
                    ) : (<Link to={link.href} className="block text-2xl font-medium text-carbon-900">{link.label}</Link>)}
                  </div>
                ))}
              </div>
              <div className="p-6 border-t border-carbon-100 space-y-3">
                <Link to="/book-demo" className="block"><Button className="w-full bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-white h-12 rounded-full font-medium border border-gold-400/30 shadow-gold-sm">Book Demo <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
