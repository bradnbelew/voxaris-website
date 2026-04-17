import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1] as const;

export function FounderSection() {
  return (
    <section className="py-24 lg:py-32 bg-black relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 right-0 translate-y-[-50%] w-[700px] h-[500px] opacity-60"
          style={{
            background:
              'radial-gradient(ellipse at 70% 50%, rgba(212,168,67,0.06) 0%, transparent 65%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8">
        <div className="grid lg:grid-cols-[auto_1fr] gap-10 lg:gap-16 items-start">
          {/* Left — signature block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="flex flex-col gap-5"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold-500/20 to-gold-500/5 border border-gold-500/20 flex items-center justify-center">
              <span className="text-2xl font-light text-gold-400">ES</span>
            </div>
            <div>
              <p className="text-[15px] font-medium text-white">Ethan Stopperich</p>
              <p className="text-[12px] font-mono uppercase tracking-[0.15em] text-white/35 mt-1">
                Founder · Orlando, FL
              </p>
            </div>
          </motion.div>

          {/* Right — founder letter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
          >
            <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-gold-400/70 mb-5 block">
              Why I built Voxaris
            </span>
            <div className="space-y-5 text-[16px] lg:text-[17px] text-white/65 leading-[1.7] font-light">
              <p>
                I spent years watching local businesses lose deals to the same three things: a
                lead nobody called back fast enough, an applicant nobody interviewed, and a
                website that looked fine but never actually converted.
              </p>
              <p>
                The fix isn't hiring another BDC rep or paying another agency. The fix is AI
                that picks up the phone in five seconds, interviews every applicant by video,
                and keeps your listings and site in front of the people who are already looking.
              </p>
              <p className="text-white/80">
                That's Voxaris. Built here in Orlando. Designed to do the work your team doesn't
                have time to do — without feeling like a chatbot.
              </p>
            </div>

            <div className="mt-9 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link to="/book-demo">
                <button className="group inline-flex items-center gap-2 h-11 px-6 rounded-full bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-500 hover:via-gold-400 hover:to-gold-500 text-white text-[13px] font-semibold border border-gold-400/30 shadow-gold-btn transition-all duration-300">
                  Talk to me directly
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </Link>
              <a
                href="tel:+14077594100"
                className="text-[13px] text-white/50 hover:text-white transition-colors font-mono tracking-wide"
              >
                Or call (407) 759-4100
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
