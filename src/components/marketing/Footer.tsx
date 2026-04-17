import { Link } from 'react-router-dom';

const footerLinks = {
  products: [
    { label: 'V·TEAMS', href: '/#vteams' },
    { label: 'Talking Postcards', href: '/talking-postcard' },
    { label: 'AI Hiring Agents', href: '/hiring-agents' },
    { label: 'Presence', href: '/presence' },
    { label: 'Pricing', href: '/pricing' },
  ],
  solutions: [
    { label: 'Auto Dealerships', href: '/solutions/dealerships' },
    { label: 'Direct Mail', href: '/solutions/direct-mail' },
    { label: 'Hotels & Resorts', href: '/solutions/hospitality' },
    { label: 'Home Services', href: '/solutions/contractors' },
    { label: 'White Label', href: '/solutions/white-label' },
  ],
  company: [
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/book-demo' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-carbon-950 border-t border-white/[0.04]">
      <div className="container-wide py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-5">
              <img
                src="/voxaris-logo-white.png"
                alt="Voxaris — AI agents for calls, hiring, direct mail, and web presence"
                className="h-10 w-auto opacity-60"
              />
            </Link>
            <p className="text-[13px] text-white/40 mb-8 max-w-xs leading-relaxed">
              Four AI products. One platform. Answer every call, convert every mailer, screen every candidate, and own your web presence.
            </p>
            <div className="flex gap-3">
              {[
                {
                  label: 'X',
                  href: 'https://x.com/estop1025',
                  path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
                },
                {
                  label: 'LinkedIn',
                  href: 'https://www.linkedin.com/company/voxaris',
                  path: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z',
                },
                {
                  label: 'Instagram',
                  href: 'https://www.instagram.com/voxaris_ai/',
                  path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
                },
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

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-[10px] font-semibold text-white/30 mb-5 uppercase tracking-[0.2em]">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-[13px] text-white/40 hover:text-gold-400 transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-4 relative">
          <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-gold-500/10 to-transparent" />
          <p className="text-[11px] text-white/30">
            &copy; {new Date().getFullYear()} Voxaris AI. All rights reserved.
          </p>
          <p className="text-[11px] text-white/20">
            Powered by AI &middot; Built for business &middot; Orlando, FL
          </p>
        </div>
      </div>
    </footer>
  );
}
