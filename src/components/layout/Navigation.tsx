import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { Menu, X, Video, PhoneIncoming, PhoneOutgoing, Globe, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import voxarisLogo from "@/assets/voxaris-logo-dark.png";

const products = [
  {
    name: "V·INBOUND",
    tagline: "Inbound Voice AI",
    description: "Answer every call instantly, 24/7",
    icon: PhoneIncoming,
    href: "/solutions/dealerships"
  },
  {
    name: "V·OUTBOUND",
    tagline: "Outbound Voice AI", 
    description: "Proactive calls for recalls & follow-ups",
    icon: PhoneOutgoing,
    href: "/solutions/dealerships"
  },
  {
    name: "V·CVI",
    tagline: "Video AI",
    description: "Face-to-face AI that sees and responds",
    icon: Video,
    href: "/technology"
  },
  {
    name: "V·WEB",
    tagline: "AI Website",
    description: "Your website as an active sales agent",
    icon: Globe,
    href: "/solutions/dealerships"
  }
];

const industries = [
  { name: "Auto Dealerships", href: "/solutions/dealerships" },
  { name: "Law Firms", href: "/solutions/law-firms" },
  { name: "Contractors", href: "/solutions/contractors" },
  { name: "Agencies", href: "/solutions/agencies" },
];

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [vsuiteOpen, setVsuiteOpen] = useState(false);
  const [industriesOpen, setIndustriesOpen] = useState(false);
  const location = useLocation();
  
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsScrolled(latest > 20);
    });
  }, [scrollY]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClick = () => {
      setVsuiteOpen(false);
      setIndustriesOpen(false);
    };
    if (vsuiteOpen || industriesOpen) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [vsuiteOpen, industriesOpen]);

  const closeDropdowns = () => {
    setVsuiteOpen(false);
    setIndustriesOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        {/* Background */}
        <div 
          className={`absolute inset-0 transition-all duration-300 ${
            isScrolled ? 'bg-white border-b border-frost shadow-sm' : 'bg-white'
          }`}
        />
        
        <nav className="container-editorial relative px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center shrink-0">
              <img src={voxarisLogo} alt="Voxaris" className="h-10 w-auto" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              {/* V·Suite Dropdown */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setVsuiteOpen(!vsuiteOpen);
                    setIndustriesOpen(false);
                  }}
                  className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                    vsuiteOpen ? "text-ink" : "text-slate hover:text-ink"
                  }`}
                >
                  V·Suite
                  <ChevronDown className={`w-4 h-4 transition-transform ${vsuiteOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {vsuiteOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[480px] bg-white rounded-2xl border border-frost shadow-xl p-5 z-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="grid grid-cols-2 gap-3">
                        {products.map((product) => (
                          <Link
                            key={product.name}
                            to={product.href}
                            onClick={closeDropdowns}
                            className="p-4 rounded-xl border border-frost hover:border-charcoal/20 hover:bg-snow transition-all group"
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-8 h-8 rounded-lg bg-ink flex items-center justify-center">
                                <product.icon className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <p className="font-semibold text-ink text-sm">{product.name}</p>
                                <p className="text-xs text-slate">{product.tagline}</p>
                              </div>
                            </div>
                            <p className="text-xs text-charcoal">{product.description}</p>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Industries Dropdown */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIndustriesOpen(!industriesOpen);
                    setVsuiteOpen(false);
                  }}
                  className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                    location.pathname.includes('/solutions') || industriesOpen
                      ? "text-ink"
                      : "text-slate hover:text-ink"
                  }`}
                >
                  Industries
                  <ChevronDown className={`w-4 h-4 transition-transform ${industriesOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {industriesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-56 bg-white rounded-xl border border-frost shadow-xl p-2 z-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {industries.map((industry) => (
                        <Link
                          key={industry.name}
                          to={industry.href}
                          onClick={closeDropdowns}
                          className="block px-4 py-3 rounded-lg text-sm text-charcoal hover:text-ink hover:bg-snow transition-all"
                        >
                          {industry.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Static Links */}
              <Link
                to="/technology"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === '/technology'
                    ? "text-ink"
                    : "text-slate hover:text-ink"
                }`}
              >
                Technology
              </Link>
              <Link
                to="/demo"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === '/demo'
                    ? "text-ink"
                    : "text-slate hover:text-ink"
                }`}
              >
                Demo
              </Link>
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center">
              <Link to="/demo">
                <Button 
                  size="sm" 
                  className="bg-ink hover:bg-charcoal text-white font-medium rounded-lg px-5 h-9 text-sm"
                >
                  Talk to Maria
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-mist transition-colors relative z-50"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              type="button"
            >
              {mobileOpen ? <X className="h-6 w-6 text-ink" /> : <Menu className="h-6 w-6 text-ink" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="fixed top-16 left-0 right-0 z-50 md:hidden bg-white border-b border-frost shadow-lg max-h-[80vh] overflow-y-auto"
            >
              <div className="py-8 px-6 space-y-8">
                {/* V·Suite Section */}
                <div>
                  <p className="text-xs font-semibold text-slate uppercase tracking-wider mb-4">V·Suite</p>
                  <div className="space-y-3">
                    {products.map((product) => (
                      <Link
                        key={product.name}
                        to={product.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-start gap-4 p-5 rounded-2xl border border-frost hover:bg-snow transition-colors"
                      >
                        <div className="w-12 h-12 rounded-xl bg-ink flex items-center justify-center flex-shrink-0">
                          <product.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="pt-0.5">
                          <p className="text-base">
                            <span className="font-bold text-ink">{product.name}</span>
                            <span className="text-charcoal"> — {product.tagline}</span>
                          </p>
                          <p className="text-sm text-slate mt-1">{product.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Industries Section */}
                <div>
                  <p className="text-xs font-semibold text-slate uppercase tracking-wider mb-4">Industries</p>
                  <div className="grid grid-cols-2 gap-3">
                    {industries.map((industry) => (
                      <Link
                        key={industry.name}
                        to={industry.href}
                        onClick={() => setMobileOpen(false)}
                        className="px-5 py-4 rounded-xl text-base text-charcoal hover:text-ink hover:bg-snow transition-all border border-frost"
                      >
                        {industry.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Other Links */}
                <div className="space-y-2 pt-4 border-t border-frost">
                  <Link
                    to="/technology"
                    className="block text-base font-medium text-charcoal hover:text-ink transition-colors py-2"
                    onClick={() => setMobileOpen(false)}
                  >
                    Technology
                  </Link>
                  <Link
                    to="/demo"
                    className="block text-base font-medium text-charcoal hover:text-ink transition-colors py-2"
                    onClick={() => setMobileOpen(false)}
                  >
                    Demo
                  </Link>
                </div>
                
                <div className="pt-4">
                  <Link to="/demo" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full bg-ink hover:bg-charcoal text-white font-medium rounded-lg h-12">
                      Talk to Maria
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
