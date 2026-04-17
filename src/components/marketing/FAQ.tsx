import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1] as const;

const faqs = [
  {
    q: 'How is this different from a chatbot?',
    a: "Chatbots live in a little window and type text. Voxaris agents are video: a photorealistic person makes eye contact, speaks naturally, and handles the call or the interview the way a human would. Every conversation is recorded, transcribed, and scored so you can watch exactly what was said.",
  },
  {
    q: 'Will it sound robotic to my customers?',
    a: "No. The voice, phrasing, and timing are tuned per business — your tone, your offers, your script. If a call gets off-script or needs a human, the agent hands it off. Most customers don't realize they were talking to AI until we tell them.",
  },
  {
    q: 'How fast can you get something live?',
    a: "A new website ships in 48 hours. Hiring Intelligence and Talking Postcards can be running within a week once we have your voice, offers, and brand set up. The AEO-GEO audit is instant and free at audit.voxaris.io.",
  },
  {
    q: 'Do I have to use all four products?',
    a: "No. Most clients start with one — usually Hiring Intelligence or a new website — and add the others once they see the returns. Each product stands on its own. They just get more valuable when combined.",
  },
  {
    q: 'What happens to my current website, phone system, or CRM?',
    a: "We work alongside them. Voxaris plugs into your existing CRM (GoHighLevel, HubSpot, VinSolutions, etc.), your phone number stays yours, and we can rebuild your site or keep the current one — your call.",
  },
  {
    q: 'How much does it cost?',
    a: "It depends on which products and volume. A live demo takes 15 minutes and gets you a real quote — no slides, no pressure. Call (407) 759-4100 or book at the link above.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 lg:py-32 bg-[#fafafa]">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="mb-12 text-center"
        >
          <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-carbon-500 mb-3 block">
            Questions
          </span>
          <h2 className="text-3xl sm:text-5xl font-light text-carbon-900 leading-[1.05]">
            The things we always get asked.
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((item, i) => {
            const isOpen = i === openIndex;
            return (
              <motion.div
                key={item.q}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.05, ease }}
                className="border border-carbon-200 rounded-xl bg-white overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-6 px-6 py-5 text-left hover:bg-carbon-50 transition-colors"
                >
                  <span className="text-[15px] sm:text-[16px] font-medium text-carbon-900">
                    {item.q}
                  </span>
                  <Plus
                    className={`w-4 h-4 text-carbon-500 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-45' : ''
                    }`}
                    strokeWidth={2}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-[14px] text-carbon-600 leading-relaxed">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
