import { Link } from "react-router-dom";
import { Phone } from "lucide-react";
import voxarisLogo from "@/assets/voxaris-logo-dark.png";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-frost">
      <div className="container-editorial py-12">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          {/* Logo */}
          <Link to="/" className="shrink-0">
            <img src={voxarisLogo} alt="Voxaris" className="h-5 w-auto" />
          </Link>

          {/* Phone Number */}
          <a
            href="tel:+14077594100"
            className="flex items-center gap-2 text-sm font-medium text-ink hover:text-charcoal transition-colors"
          >
            <Phone className="w-4 h-4" />
            (407) 759-4100
          </a>

          {/* Links */}
          <div className="flex flex-wrap justify-center items-center gap-6">
            {[
              { name: "Technology", href: "/technology" },
              { name: "Industries", href: "/solutions/dealerships" },
              { name: "Demo", href: "/demo" },
              { name: "Contact", href: "/book-demo" },
              { name: "Privacy", href: "/privacy" },
              { name: "Terms", href: "/terms" },
            ].map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm text-slate hover:text-ink transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-sm text-slate">
            © {new Date().getFullYear()} Voxaris
          </p>
        </div>
      </div>
    </footer>
  );
}
