import { Link } from "react-router-dom";
import voxarisLogo from "@/assets/voxaris-logo.png";

const footerLinks = {
  product: [
    { name: "How It Works", href: "/how-it-works" },
    { name: "Why Voxaris", href: "/why-voxaris" },
    { name: "Pricing", href: "/pricing" },
    { name: "Demo", href: "/demo" },
  ],
  solutions: [
    { name: "Marketing Agencies", href: "/solutions/agencies" },
    { name: "Car Dealerships", href: "/solutions/dealerships" },
  ],
  company: [
    { name: "Book a Demo", href: "/book-demo" },
    { name: "Contact", href: "/book-demo" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-wide section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <img 
                src={voxarisLogo} 
                alt="Voxaris" 
                className="h-12 w-auto brightness-0 invert opacity-90"
              />
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed max-w-sm">
              AI sales infrastructure that converts inbound leads into booked appointments — automatically.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4 text-sm tracking-wide uppercase text-primary-foreground/50">
              Product
            </h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="font-semibold mb-4 text-sm tracking-wide uppercase text-primary-foreground/50">
              Solutions
            </h4>
            <ul className="space-y-3">
              {footerLinks.solutions.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-sm tracking-wide uppercase text-primary-foreground/50">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-primary-foreground/10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-primary-foreground/50">
              © {new Date().getFullYear()} Voxaris. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                to="/privacy"
                className="text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors"
              >
                Privacy
              </Link>
              <Link
                to="/terms"
                className="text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
