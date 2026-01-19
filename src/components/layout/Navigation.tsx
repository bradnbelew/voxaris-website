import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { Menu, X, Video, Phone, PhoneIncoming, PhoneOutgoing, Globe, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import voxarisLogo from "@/assets/voxaris-logo-dark.png";

const navLinks = [
  { name: "Technology", href: "/technology" },
  { name: "Industries", href: "/solutions/dealerships", hasDropdown: true },
  { name: "Demo", href: "/demo" },
  { name: "Contact", href: "/book-demo" },
];

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
  const [industriesOpen, setIndustriesOpen] = useState(false);
  const location = useLocation();
  
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsScrolled(latest > 20);
    });
  }, [scrollY]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = () => setIndustriesOpen(false);
    if (industriesOpen) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [industriesOpen]);

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
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                link.hasDropdown ? (
                  <div key={link.name} className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIndustriesOpen(!industriesOpen);
                      }}
                      className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                        location.pathname.includes('/solutions')
                          ? "text-ink"
                          : "text-slate hover:text-ink"
                      }`}
                    >
                      {link.name}
                      <ChevronDown className={`w-4 h-4 transition-transform ${industriesOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                      {industriesOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[520px] bg-white rounded-2xl border border-frost shadow-xl p-6"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Products */}
                          <div className="mb-6">
                            <p className="text-xs font-semibold text-slate uppercase tracking-wider mb-3">Products</p>
                            <div className="grid grid-cols-2 gap-3">
                              {products.map((product) => (
                                <Link
                                  key={product.name}
                                  to={product.href}
                                  onClick={() => setIndustriesOpen(false)}
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
                          </div>
                          
                          {/* Industries */}
                          <div>
                            <p className="text-xs font-semibold text-slate uppercase tracking-wider mb-3">Industries</p>
                            <div className="grid grid-cols-2 gap-2">
                              {industries.map((industry) => (
                                <Link
                                  key={industry.name}
                                  to={industry.href}
                                  onClick={() => setIndustriesOpen(false)}
                                  className="px-3 py-2 rounded-lg text-sm text-charcoal hover:text-ink hover:bg-snow transition-all"
                                >
                                  {industry.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`text-sm font-medium transition-colors ${
                      location.pathname === link.href
                        ? "text-ink"
                        : "text-slate hover:text-ink"
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center">
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
              className="lg:hidden p-2 rounded-lg hover:bg-mist transition-colors relative z-50"
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
              className="fixed inset-0 bg-black/20 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="fixed top-16 left-0 right-0 z-50 lg:hidden bg-white border-b border-frost shadow-lg max-h-[80vh] overflow-y-auto"
            >
              <div className="container-editorial py-6 space-y-6 px-4">
                {/* Products Section */}
                <div>
                  <p className="text-xs font-semibold text-slate uppercase tracking-wider mb-3">Products</p>
                  <div className="space-y-3">
                    {products.map((product) => (
                      <Link
                        key={product.name}
                        to={product.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-4 p-4 rounded-xl border border-frost"
                      >
                        <div className="w-10 h-10 rounded-lg bg-ink flex items-center justify-center flex-shrink-0">
                          <product.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-ink">{product.name} <span className="font-normal text-slate">— {product.tagline}</span></p>
                          <p className="text-sm text-charcoal">{product.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Industries Section */}
                <div>
                  <p className="text-xs font-semibold text-slate uppercase tracking-wider mb-3">Industries</p>
                  <div className="grid grid-cols-2 gap-2">
                    {industries.map((industry) => (
                      <Link
                        key={industry.name}
                        to={industry.href}
                        onClick={() => setMobileOpen(false)}
                        className="px-4 py-3 rounded-lg text-sm text-charcoal hover:text-ink hover:bg-snow transition-all border border-frost"
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
                  <Link
                    to="/book-demo"
                    className="block text-base font-medium text-charcoal hover:text-ink transition-colors py-2"
                    onClick={() => setMobileOpen(false)}
                  >
                    Contact
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
