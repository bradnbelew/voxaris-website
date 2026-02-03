import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Youtube } from 'lucide-react';

const footerLinks = {
  product: [
    { label: 'Features', href: '/#features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Demo', href: '/demo' },
    { label: 'API', href: '/technology' },
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
    <footer className="bg-cream-200 border-t border-platinum-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-bold text-navy-900">
                VOXARIS
              </span>
            </Link>
            <p className="text-sm text-platinum-600 mb-4">
              Personalizing Your Outreach
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-platinum-500 hover:text-navy-900 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-platinum-500 hover:text-navy-900 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-platinum-500 hover:text-navy-900 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-navy-900 mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-platinum-600 hover:text-navy-900 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-sm font-semibold text-navy-900 mb-4">Solutions</h4>
            <ul className="space-y-3">
              {footerLinks.solutions.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-platinum-600 hover:text-navy-900 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-navy-900 mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-platinum-600 hover:text-navy-900 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-navy-900 mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-platinum-600 hover:text-navy-900 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-platinum-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-platinum-600">
            &copy; {new Date().getFullYear()} Voxaris. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="#" className="text-sm text-platinum-600 hover:text-navy-900 transition-colors">
              Privacy Policy
            </Link>
            <Link to="#" className="text-sm text-platinum-600 hover:text-navy-900 transition-colors">
              Terms of Service
            </Link>
            <Link to="#" className="text-sm text-platinum-600 hover:text-navy-900 transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
