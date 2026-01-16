import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Menu, X, ChevronDown, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import voxarisLogo from "@/assets/voxaris-logo.png";

const navLinks = [
  { name: "Agencies", href: "/solutions/agencies" },
  { name: "Dealerships", href: "/solutions/dealerships" },
  { name: "How It Works", href: "/how-it-works" },
  {
    name: "Industries",
    href: "/industries",
    children: [
      { name: "Contractors", href: "/solutions/contractors" },
      { name: "Law Firms", href: "/solutions/law-firms" },
      { name: "Home Services", href: "/solutions/contractors" },
    ],
  },
  { name: "Why Voxaris", href: "/why-voxaris" },
];

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Dynamic background */}
      <motion.div 
        className="absolute inset-0 transition-all duration-500"
        style={{
          backgroundColor: isScrolled ? 'hsl(var(--background) / 0.9)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(24px)' : 'none',
        }}
      />
      <motion.div 
        className="absolute inset-x-0 bottom-0 h-px transition-opacity duration-500"
        style={{
          background: 'linear-gradient(90deg, transparent, hsl(var(--border)), transparent)',
          opacity: isScrolled ? 1 : 0,
        }}
      />
      
      <nav className="container-editorial relative">
        <div className="flex items-center justify-between h-20">
          {/* Brand - Distinctive logo treatment */}
          <Link to="/" className="flex items-center gap-3 text-foreground group">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <img 
                src={voxarisLogo} 
                alt="" 
                className="h-8 w-8 object-contain"
              />
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-full bg-cyan/0 blur-xl transition-all duration-300 group-hover:bg-cyan/30" />
            </motion.div>
            <span className="font-semibold text-sm tracking-[0.25em] uppercase">
              VOXARIS
            </span>
          </Link>

          {/* Desktop Navigation - Minimal, spaced */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <div key={link.name} className="relative">
                {link.children ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 link-reveal">
                      {link.name}
                      <ChevronDown 
                        className="h-3.5 w-3.5 transition-transform duration-200" 
                        style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }} 
                      />
                    </button>
                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="absolute top-full left-1/2 -translate-x-1/2 pt-4"
                        >
                          <div className="glass rounded-2xl border border-border/50 shadow-xl p-2 min-w-[200px]">
                            {link.children.map((child) => (
                              <Link
                                key={child.name}
                                to={child.href}
                                className="flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-xl transition-all duration-200"
                              >
                                <div className="w-1 h-1 rounded-full bg-cyan" />
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
                    className={`text-sm transition-colors duration-200 link-reveal ${
                      location.pathname === link.href
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Desktop CTAs - Distinctive buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Link to="/demo">
              <Button 
                size="sm" 
                className="bg-cyan hover:bg-cyan-glow text-background font-medium rounded-full px-6 h-10 transition-all duration-300 hover:shadow-glow"
              >
                <Play className="h-3.5 w-3.5 mr-2 fill-current" />
                Try Maria Live
              </Button>
            </Link>
            <Link to="/book-demo">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-sm font-medium h-10 px-4 text-muted-foreground hover:text-foreground"
              >
                Book Demo
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="lg:hidden p-2 rounded-xl hover:bg-secondary/50 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {mobileOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </nav>

      {/* Mobile Menu - Full screen takeover */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed inset-0 top-20 bg-background/98 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="container-editorial py-8 space-y-6"
            >
              {navLinks.map((link, i) => (
                <motion.div 
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                >
                  {link.children ? (
                    <div className="space-y-4">
                      <p className="text-lg font-medium text-foreground">{link.name}</p>
                      <div className="pl-4 space-y-3 border-l border-border/50">
                        {link.children.map((child) => (
                          <Link
                            key={child.name}
                            to={child.href}
                            className="block text-muted-foreground hover:text-foreground transition-colors"
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
                      className="block text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.name}
                    </Link>
                  )}
                </motion.div>
              ))}
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="pt-8 space-y-4"
              >
                <Link to="/demo" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full bg-cyan hover:bg-cyan-glow text-background font-medium rounded-full h-12">
                    <Play className="h-4 w-4 mr-2 fill-current" />
                    Try Maria Live
                  </Button>
                </Link>
                <Link to="/book-demo" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full rounded-full h-12 border-border/50">
                    Book a Demo
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
