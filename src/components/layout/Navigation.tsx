import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { Menu, X, ChevronDown, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import voxarisLogo from "@/assets/voxaris-logo-banner.svg";

const navLinks = [
  {
    name: "Platform",
    href: "/technology",
    children: [
      { name: "The Living Interface", href: "/technology", description: "Our core neural architecture" },
      { name: "How It Works", href: "/how-it-works", description: "See Voxaris in action" },
      { name: "Why Voxaris", href: "/why-voxaris", description: "What sets us apart" },
    ],
  },
  {
    name: "Industries",
    href: "/industries",
    children: [
      { name: "Agencies", href: "/solutions/agencies", description: "Scale client engagement" },
      { name: "Dealerships", href: "/solutions/dealerships", description: "Sell more vehicles" },
      { name: "Contractors", href: "/solutions/contractors", description: "Never miss a lead" },
      { name: "Law Firms", href: "/solutions/law-firms", description: "Qualify cases 24/7" },
    ],
  },
];

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();
  
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsScrolled(latest > 20);
    });
  }, [scrollY]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Background */}
      <div 
        className={`absolute inset-0 transition-all duration-300 ${
          isScrolled ? 'bg-background border-b border-border' : 'bg-background'
        }`}
      />
      
      <nav className="container-editorial relative px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand - Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <img src={voxarisLogo} alt="Voxaris" className="h-9 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <div key={link.name} className="relative">
                {link.children ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(link.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.name}
                      <ChevronDown 
                        className="h-3.5 w-3.5 transition-transform duration-200" 
                        style={{ transform: activeDropdown === link.name ? 'rotate(180deg)' : 'rotate(0)' }} 
                      />
                    </button>
                    <AnimatePresence>
                      {activeDropdown === link.name && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 pt-3"
                        >
                          <div className="bg-background border border-border rounded-xl shadow-lg p-2 min-w-[220px]">
                            {link.children.map((child) => (
                              <Link
                                key={child.name}
                                to={child.href}
                                className="block px-4 py-3 hover:bg-secondary rounded-lg transition-colors group"
                              >
                                <span className="block text-sm font-medium text-foreground group-hover:text-foreground">
                                  {child.name}
                                </span>
                                {'description' in child && (
                                  <span className="block text-xs text-muted-foreground mt-0.5">
                                    {child.description}
                                  </span>
                                )}
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
                    className={`text-sm transition-colors ${
                      location.pathname === link.href
                        ? "text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-2">
            <Link to="/demo">
              <Button 
                size="sm" 
                className="bg-foreground hover:bg-foreground/90 text-background font-medium rounded-full px-4 h-8 text-xs"
              >
                <Play className="h-3 w-3 mr-1 fill-current" />
                Try Maria Live
              </Button>
            </Link>
            <Link to="/book-demo">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs font-medium h-8 px-3 text-muted-foreground hover:text-foreground"
              >
                Book Demo
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-background border-b border-border"
          >
            <div className="container-editorial py-6 space-y-4">
              {navLinks.map((link) => (
                <div key={link.name}>
                  {link.children ? (
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-foreground">{link.name}</p>
                      <div className="pl-4 space-y-2 border-l border-border">
                        {link.children.map((child) => (
                          <Link
                            key={child.name}
                            to={child.href}
                            className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
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
                      className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}
              
              <div className="pt-4 space-y-3">
                <Link to="/demo" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full bg-foreground hover:bg-foreground/90 text-background font-medium rounded-full h-11">
                    <Play className="h-4 w-4 mr-2 fill-current" />
                    Try Maria Live
                  </Button>
                </Link>
                <Link to="/book-demo" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full rounded-full h-11">
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
