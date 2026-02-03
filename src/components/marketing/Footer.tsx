import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Youtube } from 'lucide-react';
import { VoxarisLogo } from './VoxarisLogo';

const footerLinks = {
  product: [
    { label: 'VVideo', href: '/technology' },
    { label: 'VVoice', href: '/technology' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Demo', href: '/demo' },
  ],
  solutions: [
    { label: 'Dealerships', href: '/solutions/dealerships' },
    { label: 'Law Firms', href: '/solutions/law-firms' },
    { label: 'Contractors', href: '/solutions/contractors' },
    { label: 'Agencies', href: '/solutions/agencies' },
  ],
  resources: [
    { label: 'Documentation', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Case Studies', href: '#' },
    { label: 'Help Center', href: '#' },
  ],
  company: [
    { label: 'About', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: '#' },
    { label: 'Partners', href: '#' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-white border-t border-frost">
      <div className="container-wide py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="col-span-2">
            <Link to="/" className="inline-block mb-4">
              <VoxarisLogo size="md" showTagline />
            </Link>
            <p className="text-sm text-slate mb-6 max-w-xs">
              AI-powered sales automation that works 24/7 to convert your leads into customers.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate hover:text-ink transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate hover:text-ink transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate hover:text-ink transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-ink mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-slate hover:text-ink transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-sm font-semibold text-ink mb-4">Solutions</h4>
            <ul className="space-y-3">
              {footerLinks.solutions.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-slate hover:text-ink transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-ink mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-slate hover:text-ink transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-ink mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-slate hover:text-ink transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-frost flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate">
            &copy; {new Date().getFullYear()} Voxaris. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="#" className="text-sm text-slate hover:text-ink transition-colors">
              Privacy Policy
            </Link>
            <Link to="#" className="text-sm text-slate hover:text-ink transition-colors">
              Terms of Service
            </Link>
            <Link to="#" className="text-sm text-slate hover:text-ink transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
