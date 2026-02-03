import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TAVUS_VIDEO_URL = "https://cdn.replica.tavus.io/20283/9de1f64e.mp4";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-white overflow-hidden">
      {/* Minimal background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-mist/50 to-white" />

      {/* Content */}
      <div className="relative z-10 container-hero w-full pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left side - Text content */}
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <span className="eyebrow">The Future of Sales Automation</span>
            </motion.div>

            {/* Headline - Premium Satoshi */}
            <motion.h1
              className="headline-xl text-ink mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              AI agents that{' '}
              <span className="text-charcoal">close deals</span>
              <br />
              while you sleep
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              className="text-lg sm:text-xl text-slate leading-relaxed mb-10 max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Deploy photorealistic video and voice AI agents that engage leads,
              qualify prospects, and book appointments — 24/7.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row items-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link to="/demo">
                <Button
                  size="lg"
                  className="btn-primary h-14 px-8 text-base rounded-lg group"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/demo">
                <Button
                  size="lg"
                  variant="ghost"
                  className="h-14 px-6 text-base text-charcoal hover:text-ink hover:bg-mist rounded-lg group"
                >
                  <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </Button>
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div
              className="mt-12 pt-8 border-t border-frost"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="flex items-center gap-8">
                <div>
                  <div className="text-2xl font-bold text-ink">500+</div>
                  <div className="text-sm text-slate">Active agents</div>
                </div>
                <div className="w-px h-10 bg-frost" />
                <div>
                  <div className="text-2xl font-bold text-ink">2M+</div>
                  <div className="text-sm text-slate">Conversations</div>
                </div>
                <div className="w-px h-10 bg-frost" />
                <div>
                  <div className="text-2xl font-bold text-ink">98%</div>
                  <div className="text-sm text-slate">Satisfaction</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right side - Video Agent Showcase */}
          <motion.div
            className="relative flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative w-full max-w-md lg:max-w-lg">
              {/* Main video container - Clean, premium frame */}
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-mist border border-frost shadow-card">
                {/* Video */}
                <video
                  src={TAVUS_VIDEO_URL}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />

                {/* Gradient overlay at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Agent info overlay */}
                <div className="absolute bottom-0 inset-x-0 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                        </span>
                        <span className="text-xs font-medium text-white/80 uppercase tracking-wider">Live</span>
                      </div>
                      <div className="text-lg font-semibold text-white">VAgent</div>
                      <div className="text-sm text-white/70">Sales Assistant</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">&lt;3s</div>
                      <div className="text-xs text-white/70">Response time</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating stats cards */}
              <motion.div
                className="absolute -top-4 -left-4 lg:-left-8 glass-card px-5 py-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <div className="text-3xl font-bold text-ink">24/7</div>
                <div className="text-xs text-slate">Always available</div>
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -right-4 lg:-right-8 glass-card px-5 py-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <div className="text-3xl font-bold text-ink">3-4x</div>
                <div className="text-xs text-slate">More conversions</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
