import { Helmet } from 'react-helmet-async';
import {
  Navbar,
  Hero,
  TechnologyShowcase,
  VSuiteSection,
  ProblemSolution,
  HowItWorks,
  CTASection,
  Footer,
} from '@/components/marketing';
import { LogoStrip } from '@/components/marketing/LogoStrip';
import { DemoSection } from '@/components/marketing/DemoSection';
import { FloatingMaria } from '@/components/marketing/FloatingMaria';

export function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{`Voxaris | V\u00b7GUIDE Embodied AI Agents for Automotive Dealerships`}</title>
        <meta name="description" content="V\u00b7GUIDE by Voxaris \u2014 embodied video AI agents that greet every website visitor with a face, a voice, and a real conversation. 24/7 lead engagement for automotive dealerships." />
        <meta name="keywords" content="AI voice agent, AI video agent, V\u00b7GUIDE, automotive AI, dealership AI, conversational AI, missed call recovery, AI BDC agent, virtual sales agent, lead recovery" />
        <link rel="canonical" href="https://voxaris.io/" />
      </Helmet>
      <Navbar />
      <main>
        <Hero />
        <LogoStrip />
        <TechnologyShowcase />
        <DemoSection />
        <VSuiteSection />
        <ProblemSolution />
        <HowItWorks />
        <CTASection />
      </main>
      <Footer />
      <FloatingMaria />
    </div>
  );
}
