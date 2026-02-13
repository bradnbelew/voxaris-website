import { motion } from 'framer-motion';

const logos = [
  'GoHighLevel',
  'HubSpot',
  'Salesforce',
  'Zapier',
  'Twilio',
  'Google',
];

export function LogoStrip() {
  return (
    <section className="py-10 bg-white border-t border-carbon-100">
      <div className="container-wide">
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[11px] font-medium text-carbon-300 uppercase tracking-[0.25em] mb-8">
            Integrates with the tools you already use
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {logos.map((name) => (
              <span
                key={name}
                className="text-[15px] font-semibold text-carbon-200 tracking-tight font-display select-none"
              >
                {name}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
