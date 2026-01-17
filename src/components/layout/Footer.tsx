import { Link } from "react-router-dom";
import voxarisLogo from "@/assets/voxaris-logo.png";

const footerLinks = {
  product: [
    { name: "How It Works", href: "/how-it-works" },
    { name: "Technology", href: "/technology" },
    { name: "Demo", href: "/demo" },
  ],
  industries: [
    { name: "Automotive", href: "/solutions/dealerships" },
    { name: "Contractors", href: "/solutions/contractors" },
    { name: "Law Firms", href: "/solutions/law-firms" },
  ],
  company: [
    { name: "Contact", href: "/book-demo" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-obsidian text-white">
      <div className="container-editorial py-16 lg:py-20">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12 lg:gap-16 mb-12">
          {/* Brand */}
          <div className="lg:max-w-sm">
            <Link to="/" className="inline-block mb-4">
              <img 
                src={voxarisLogo} 
                alt="Voxaris" 
                className="h-6 w-auto brightness-0 invert opacity-90"
              />
            </Link>
            <p className="text-silver text-sm leading-relaxed">
              Face-to-face AI that sees, speaks, and converts.
            </p>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 lg:gap-16">
            {/* Product */}
            <div>
              <h4 className="font-medium mb-4 text-xs tracking-wide uppercase text-silver">
                Product
              </h4>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-silver hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Industries */}
            <div>
              <h4 className="font-medium mb-4 text-xs tracking-wide uppercase text-silver">
                Industries
              </h4>
              <ul className="space-y-3">
                {footerLinks.industries.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-silver hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-medium mb-4 text-xs tracking-wide uppercase text-silver">
                Company
              </h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-silver hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-silver">
              © {new Date().getFullYear()} Voxaris. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                to="/privacy"
                className="text-xs text-silver hover:text-white transition-colors"
              >
                Privacy
              </Link>
              <Link
                to="/terms"
                className="text-xs text-silver hover:text-white transition-colors"
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
