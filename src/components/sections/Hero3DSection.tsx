import { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';

const NeuralHeroScene = lazy(() => import('@/components/three/NeuralHeroScene'));

export default function Hero3DSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-ink">
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<div className="w-full h-full bg-ink" />}>
          <NeuralHeroScene />
        </Suspense>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-ink/50 via-transparent to-ink pointer-events-none" />

      {/* Content Overlay */}
      <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm text-white/80 font-medium tracking-wide">
            Phoenix-4 Engine Active
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight uppercase mb-6">
          Voxaris
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-green-400 tracking-[0.3em] uppercase mb-4">
          Intelligence Reimagined
        </p>

        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10">
          Deploy AI voice and video agents that convert leads while you sleep. 
          200ms response time. Zero hallucinations. Enterprise-ready.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            asChild
            size="xl"
            className="bg-green-500 hover:bg-green-400 text-black font-semibold shadow-[0_0_30px_rgba(0,255,0,0.3)] hover:shadow-[0_0_40px_rgba(0,255,0,0.5)] transition-all duration-300"
          >
            <Link to="/book-demo">
              Book a Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="xl"
            className="border-white/20 text-white hover:bg-white/10 hover:border-white/30"
          >
            <Link to="/demo">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Link>
          </Button>
        </div>

        {/* Stats Bar */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-400">200ms</p>
            <p className="text-sm text-white/50 mt-1">Response Time</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-400">0%</p>
            <p className="text-sm text-white/50 mt-1">Hallucination</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-400">24/7</p>
            <p className="text-sm text-white/50 mt-1">Availability</p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 rounded-full bg-green-400 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
