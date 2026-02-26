import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const MARIA_VIDEO = "https://cdn.replica.tavus.io/40242/2fe8396c.mp4";

export function FloatingMaria() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating bubble */}
      <AnimatePresence>
        {!open && (
          <motion.button
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 group"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4, delay: 2 }}
          >
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full animate-ping bg-slate-400/20" style={{ animationDuration: '3s' }} />
            <span className="absolute -inset-1 rounded-full bg-gradient-to-br from-slate-200/40 to-transparent group-hover:from-slate-200/60 transition-all duration-500" />

            {/* Avatar */}
            <div className="relative w-16 h-16 rounded-full overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.12)] ring-[3px] ring-white group-hover:ring-slate-100 transition-all duration-300 group-hover:scale-105">
              <video
                src={MARIA_VIDEO}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>

            {/* Live indicator */}
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white" />
            </span>

            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="bg-slate-900 text-white text-[11px] font-medium px-3 py-2 rounded-xl whitespace-nowrap shadow-lg">
                Talk to Maria
                <div className="absolute top-full right-6 w-2 h-2 bg-slate-900 rotate-45 -mt-1" />
              </div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expanded modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-6 right-6 z-50 w-[340px] sm:w-[380px]"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-slate-200/80 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-slate-100">
                    <video
                      src={MARIA_VIDEO}
                      className="w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-slate-900">Maria</div>
                    <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Online now
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-slate-50 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Video area */}
              <div className="aspect-[4/3] bg-slate-900 relative">
                <video
                  src={MARIA_VIDEO}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent" />
                <div className="absolute bottom-3 left-3 text-white text-[10px] font-medium flex items-center gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                  </span>
                  V·GUIDE Preview
                </div>
              </div>

              {/* Message area */}
              <div className="p-5">
                <p className="text-[13px] text-slate-600 leading-relaxed mb-4">
                  Hi! I'm Maria, your V·GUIDE agent. I can walk you through how I'd work on your website — scrolling, booking, everything. Want to see a live demo?
                </p>
                <a
                  href="/book-demo"
                  className="block w-full text-center bg-slate-900 hover:bg-black text-white text-[13px] font-semibold py-3 rounded-xl transition-all duration-300 hover:shadow-lg"
                >
                  Book a Personalized Demo
                </a>
                <a
                  href="tel:+14077594100"
                  className="block w-full text-center text-slate-500 hover:text-slate-700 text-[12px] font-medium py-2.5 mt-2 transition-colors"
                >
                  Or call (407) 759-4100
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
