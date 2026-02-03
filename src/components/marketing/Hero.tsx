import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TAVUS_VIDEO_URL = "https://cdn.replica.tavus.io/20283/9de1f64e.mp4";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-cream-200">
      {/* Subtle decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-accent-100 rounded-full blur-3xl opacity-40" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent-50 rounded-full blur-3xl opacity-30" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left side - Text content */}
          <div className="text-center lg:text-left">
            {/* Small Label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-50 border border-accent-200 mb-8"
            >
              <span className="text-xs font-medium tracking-widest uppercase text-navy-700">
                New Standards for AI Automation
              </span>
            </motion.div>

            {/* Headline - Serif style like Dribbble */}
            <motion.h1
              className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight mb-6 text-navy-900"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="block">AI agents that</span>
              <span className="block italic text-navy-600">close deals</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              className="max-w-xl text-lg sm:text-xl text-platinum-600 mb-10 font-sans"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Deploy photorealistic video and voice AI agents that engage leads,
              qualify prospects, and book appointments 24/7
            </motion.p>

            {/* CTAs - Clean outlined style */}
            <motion.div
              className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link to="/demo">
                <Button
                  size="lg"
                  className="bg-navy-900 hover:bg-navy-800 text-white px-8 h-12 text-base font-medium rounded-full"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/demo">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-navy-300 text-navy-700 hover:bg-navy-50 px-8 h-12 text-base font-medium rounded-full"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Watch Demo
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right side - Tavus Video Agent Showcase */}
          <motion.div
            className="relative flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="relative">
              {/* Video container with elegant frame */}
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
                {/* Decorative ring */}
                <div className="absolute inset-0 rounded-full border-2 border-accent-200 animate-pulse" style={{ animationDuration: '3s' }} />
                <div className="absolute inset-4 rounded-full border border-accent-300/50" />

                {/* Video */}
                <div className="absolute inset-8 rounded-full overflow-hidden shadow-2xl bg-white">
                  <video
                    src={TAVUS_VIDEO_URL}
                    className="w-full h-full object-cover scale-110"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>

                {/* Live indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <span className="text-sm font-medium text-navy-900">AI Agent Live</span>
                </div>
              </div>

              {/* Floating stats cards */}
              <motion.div
                className="absolute -top-4 -left-4 bg-white rounded-xl shadow-lg px-4 py-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <div className="text-2xl font-serif font-semibold text-navy-900">&lt;3s</div>
                <div className="text-xs text-platinum-500">Response</div>
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg px-4 py-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <div className="text-2xl font-serif font-semibold text-navy-900">24/7</div>
                <div className="text-xs text-platinum-500">Available</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
