import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ease = [0.22, 1, 0.36, 1] as const;

const TAVUS_VIDEO_URL = "https://cdn.replica.tavus.io/40242/2fe8396c.mp4";

export function TechnologyShowcase() {
  return (
    <section data-section="technology" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-14 lg:mb-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
        >
          <span className="eyebrow mb-6 block">Complete AI Conversation Platform</span>
          <h2 className="headline-xl text-carbon-900 mb-6">
            Four products.
            <br className="hidden sm:block" />
            <span className="text-carbon-400">One intelligent ecosystem.</span>
          </h2>
          <p className="text-carbon-400 max-w-md mx-auto text-lg">
            From first touch to closed deal — every lead now gets a guide that actually works.
          </p>
        </motion.div>

        {/* Product grid — V·GUIDE flagship + 3 others */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* V·GUIDE — Flagship (spans 5 cols) */}
          <motion.div
            data-feature="V·GUIDE"
            className="lg:col-span-5 bg-white border border-carbon-200 rounded-[24px] overflow-hidden group hover:border-carbon-300 transition-all duration-500"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          >
            {/* Video preview */}
            <div className="aspect-[16/10] relative overflow-hidden bg-carbon-50">
              <video
                src={TAVUS_VIDEO_URL}
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-700"
                autoPlay
                loop
                muted
                playsInline
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <div className="bg-white/90 backdrop-blur-xl rounded-full px-3 py-1 border border-carbon-200">
                  <span className="text-[9px] font-semibold text-carbon-700 uppercase tracking-[0.15em]">Flagship</span>
                </div>
                <div className="bg-amber-50 rounded-full px-2.5 py-1 border border-amber-200">
                  <span className="text-[9px] font-semibold text-amber-700 uppercase tracking-[0.12em]">New</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 lg:p-10">
              <h3 className="text-3xl lg:text-4xl font-bold text-carbon-900 font-display tracking-tight mb-5">V·GUIDE</h3>
              <p className="text-carbon-400 text-[15px] leading-relaxed mb-8">
                The world's first embodied real-time video agent. Add one {'<script>'} tag and watch a photorealistic avatar visibly control your live website — scrolling, filtering, filling forms, and completing bookings while talking naturally with every visitor.
              </p>
              <div className="pt-6 border-t border-carbon-100 flex items-center justify-between">
                <span className="text-[12px] text-carbon-300">Tavus video · Rover DOM control</span>
                <Link to="/demo" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-carbon-900 hover:text-carbon-600 transition-colors group/link">
                  See it move your site
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Other three products (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">

            {/* Static Video Agents — V·FACE */}
            <motion.div
              data-feature="V·FACE"
              className="bg-white border border-carbon-200 rounded-[24px] p-7 lg:p-8 hover:border-carbon-300 transition-all duration-500 flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.08, ease }}
            >
              <div className="w-12 h-12 rounded-2xl bg-carbon-50 border border-carbon-200 flex items-center justify-center text-2xl mb-6">
                📹
              </div>
              <h4 className="text-lg font-bold text-carbon-900 font-display mb-3">Static Video Agents</h4>
              <p className="text-carbon-400 text-[14px] leading-relaxed mb-auto">
                Photorealistic video conversations embedded anywhere. Perfect for always-on welcome experiences.
              </p>
              <div className="mt-8 pt-5 border-t border-carbon-100">
                <span className="text-[10px] uppercase tracking-[0.2em] text-carbon-300 font-medium">V·FACE</span>
              </div>
            </motion.div>

            {/* Voice Agents — V·SENSE */}
            <motion.div
              data-feature="V·SENSE"
              className="bg-white border border-carbon-200 rounded-[24px] p-7 lg:p-8 hover:border-carbon-300 transition-all duration-500 flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.16, ease }}
            >
              <div className="w-12 h-12 rounded-2xl bg-carbon-50 border border-carbon-200 flex items-center justify-center text-2xl mb-6">
                ☎️
              </div>
              <h4 className="text-lg font-bold text-carbon-900 font-display mb-3">Inbound &amp; Outbound Voice</h4>
              <p className="text-carbon-400 text-[14px] leading-relaxed mb-auto">
                Human-quality calls that qualify, book, and sync to your CRM in real time.
              </p>
              <div className="mt-8 pt-5 border-t border-carbon-100">
                <span className="text-[10px] uppercase tracking-[0.2em] text-carbon-300 font-medium">V·SENSE</span>
              </div>
            </motion.div>

            {/* Talking Postcards */}
            <motion.div
              data-feature="Talking Postcard"
              className="bg-white border border-carbon-200 rounded-[24px] p-7 lg:p-8 hover:border-carbon-300 transition-all duration-500 flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.24, ease }}
            >
              <div className="w-12 h-12 rounded-2xl bg-carbon-50 border border-carbon-200 flex items-center justify-center text-2xl mb-6">
                ✉️
              </div>
              <h4 className="text-lg font-bold text-carbon-900 font-display mb-3">Talking Postcards</h4>
              <p className="text-carbon-400 text-[14px] leading-relaxed mb-auto">
                Physical mailers with QR codes that launch personalized video conversations the moment they're opened.
              </p>
              <div className="mt-8 pt-5 border-t border-carbon-100">
                <span className="text-[10px] uppercase tracking-[0.2em] text-carbon-300 font-medium">Physical + Digital</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
