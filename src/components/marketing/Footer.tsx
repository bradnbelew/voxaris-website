import { Link } from 'react-router-dom';

const footerLinks = {
  product: [
    { label: 'V·TEAMS', href: '/technology' },
    { label: 'Video AI', href: '/technology' },
    { label: 'Voice AI', href: '/technology' },
    { label: 'Talking Postcards', href: '/talking-postcard' },
    { label: 'Demo', href: '/demo' },
  ],
  solutions: [
    { label: 'Industries', href: '/solutions/dealerships' },
    { label: 'Direct Mail', href: '/solutions/direct-mail' },
    { label: 'Hotels & Resorts', href: '/solutions/hospitality' },
    { label: 'Home Services', href: '/solutions/contractors' },
    { label: 'White Label', href: '/solutions/white-label' },
  ],
  technology: [
    { label: 'V·FACE', href: '/technology' },
    { label: 'V·SENSE', href: '/technology' },
    { label: 'V·FLOW', href: '/technology' },
    { label: 'How It Works', href: '/how-it-works' },
  ],
  company: [
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/book-demo' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-carbon-950 border-t border-white/[0.04]">
      <div className="container-wide py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="inline-block mb-5">
              <img src="/voxaris-logo-white.png" alt="Voxaris AI" className="h-14 w-auto opacity-50" />
            </Link>
            <p className="text-[13px] text-white/40 mb-8 max-w-xs leading-relaxed">
              AI-powered video and voice agents that engage, qualify, and convert
              your leads — 24/7, at scale.
            </p>
            <div className="flex gap-3">
              {[
                { label: 'X', href: 'https://x.com/estop1025', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ethanstopperich', path: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/20 hover:text-gold-400 hover:bg-gold-500/[0.08] hover:border-gold-500/[0.15] transition-all duration-200"
                  aria-label={social.label}
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-[10px] font-semibold text-white/30 mb-5 uppercase tracking-[0.2em]">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="text-[13px] text-white/40 hover:text-gold-400 transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-4 relative">
          <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-gold-500/10 to-transparent" />
          <p className="text-[11px] text-white/30">
            &copy; {new Date().getFullYear()} Voxaris AI. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-[11px] text-white/30 hover:text-white/50 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-[11px] text-white/30 hover:text-white/50 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
