import { motion } from 'framer-motion';

// Industry labels — real verticals Voxaris serves.
// No fake customer logos. Instead, display the categories of businesses using the product.
const verticals = [
  'Auto Dealerships',
  'Roofing & Home Services',
  'Dental & Medical',
  'HVAC',
  'Real Estate',
  'Law Firms',
  'Hospitality',
  'Local Agencies',
];

export function LogoMarquee() {
  return (
    <section className="py-14 bg-black border-y border-white/[0.04] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-[11px] font-mono uppercase tracking-[0.22em] text-white/35 mb-8"
        >
          Built for the businesses that actually close deals
        </motion.p>

        <div
          className="relative flex overflow-hidden"
          style={{
            maskImage:
              'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
          }}
        >
          {[0, 1].map((dup) => (
            <div
              key={dup}
              className="flex shrink-0 items-center gap-12 pr-12 animate-marquee"
              style={{ ['--gap' as string]: '3rem' }}
              aria-hidden={dup === 1}
            >
              {verticals.map((v) => (
                <div
                  key={`${dup}-${v}`}
                  className="flex items-center gap-3 whitespace-nowrap"
                >
                  <span className="h-1 w-1 rounded-full bg-gold-500/60" />
                  <span className="text-[15px] font-light text-white/40 tracking-tight">
                    {v}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
