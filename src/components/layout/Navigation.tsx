import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import voxarisLogo from "@/assets/voxaris-logo-dark.png";

const navLinks = [
  { name: "Technology", href: "/technology" },
  { name: "Industries", href: "/solutions/dealerships" },
  { name: "Demo", href: "/demo" },
  { name: "Contact", href: "/book-demo" },
];

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsScrolled(latest > 20);
    });
  }, [scrollY]);

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

      {/* Mobile Menu - Outside header for proper stacking */}
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
              className="fixed top-16 left-0 right-0 z-50 lg:hidden bg-white border-b border-frost shadow-lg"
            >
              <div className="container-editorial py-6 space-y-4 px-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="block text-base font-medium text-slate hover:text-ink transition-colors py-3 border-b border-frost last:border-0"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                
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
