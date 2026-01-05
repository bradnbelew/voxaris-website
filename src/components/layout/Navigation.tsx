import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import voxarisLogo from "@/assets/voxaris-logo.png";

const navLinks = [
  { name: "How It Works", href: "/how-it-works" },
  {
    name: "Solutions",
    href: "/solutions",
    children: [
      { name: "Marketing Agencies", href: "/solutions/agencies" },
      { name: "Car Dealerships", href: "/solutions/dealerships" },
    ],
  },
  { name: "Why Voxaris", href: "/why-voxaris" },
  { name: "Pricing", href: "/pricing" },
];

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Elegant glass effect */}
      <div className="absolute inset-0 bg-background/90 backdrop-blur-2xl" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <nav className="container-wide relative">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo - Prominent & Clean */}
          <Link to="/" className="flex items-center">
            <img 
              src={voxarisLogo} 
              alt="Voxaris" 
              className="h-8 w-auto"
            />
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div key={link.name} className="relative">
                {link.children ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setSolutionsOpen(true)}
                    onMouseLeave={() => setSolutionsOpen(false)}
                  >
                    <button className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-all duration-200 rounded-lg hover:bg-secondary/50">
                      {link.name}
                      <ChevronDown 
                        className="h-3.5 w-3.5 transition-transform duration-200" 
                        style={{ transform: solutionsOpen ? 'rotate(180deg)' : 'rotate(0)' }} 
                      />
                    </button>
                    <AnimatePresence>
                      {solutionsOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          className="absolute top-full left-1/2 -translate-x-1/2 pt-3"
                        >
                          <div className="bg-card/95 backdrop-blur-xl rounded-xl border border-border/80 shadow-xl p-1.5 min-w-[220px]">
                            {link.children.map((child) => (
                              <Link
                                key={child.name}
                                to={child.href}
                                className="flex items-center gap-3 px-4 py-3 text-[13px] text-muted-foreground hover:text-foreground hover:bg-secondary/60 rounded-lg transition-all duration-150"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-border" />
                                {child.name}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    to={link.href}
                    className={`px-4 py-2 text-[13px] font-medium transition-all duration-200 rounded-lg ${
                      location.pathname === link.href
                        ? "text-foreground bg-secondary/50"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    }`}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/demo">
              <Button variant="ghost" size="sm" className="text-[13px] font-medium h-9 px-4">
                Try Demo
              </Button>
            </Link>
            <Link to="/book-demo">
              <Button variant="hero" size="sm" className="text-[13px] font-medium h-9 px-5 shadow-md">
                Book a Demo
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-secondary/50 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-background/95 backdrop-blur-xl border-b border-border"
          >
            <div className="container-wide py-6 space-y-4">
              {navLinks.map((link) => (
                <div key={link.name}>
                  {link.children ? (
                    <div className="space-y-2">
                      <p className="text-[13px] font-medium text-foreground">
                        {link.name}
                      </p>
                      <div className="pl-4 space-y-2">
                        {link.children.map((child) => (
                          <Link
                            key={child.name}
                            to={child.href}
                            className="block text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => setMobileOpen(false)}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={link.href}
                      className="block text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}
              <div className="pt-4 space-y-3">
                <Link to="/demo" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full text-[13px]">
                    Try Demo
                  </Button>
                </Link>
                <Link to="/book-demo" onClick={() => setMobileOpen(false)}>
                  <Button variant="hero" className="w-full text-[13px]">
                    Book a Demo
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}