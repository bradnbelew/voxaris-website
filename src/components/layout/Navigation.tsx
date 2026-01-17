import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { Menu, X, ChevronDown, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import voxarisLogo from "@/assets/voxaris-logo-square.png";

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
      
      <nav className="container-editorial relative">
        <div className="flex items-center justify-between h-20">
          {/* Brand - Using logo image */}
          <Link to="/" className="flex items-center">
            <img 
              src={voxarisLogo} 
              alt="Voxaris" 
              className="h-[1000px] w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <div key={link.name} className="relative">
                {link.children ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.name}
                      <ChevronDown 
                        className="h-3.5 w-3.5 transition-transform duration-200" 
                        style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }} 
                      />
                    </button>
                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 pt-3"
                        >
                          <div className="bg-background border border-border rounded-lg shadow-lg p-2 min-w-[180px]">
                            {link.children.map((child) => (
                              <Link
                                key={child.name}
                                to={child.href}
                                className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors"
                              >
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
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/demo">
              <Button 
                size="sm" 
                className="bg-foreground hover:bg-foreground/90 text-background font-medium rounded-full px-5 h-9"
              >
                <Play className="h-3.5 w-3.5 mr-1.5 fill-current" />
                Try Maria Live
              </Button>
            </Link>
            <Link to="/book-demo">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-sm font-medium h-9 px-4 text-muted-foreground hover:text-foreground"
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
