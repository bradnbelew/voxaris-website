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
        <title>{`Voxaris | V·TEAMS Multi-Agent AI Platform for Automotive Dealerships`}</title>
        <meta name="description" content="V·TEAMS by Voxaris — a coordinated squad of AI voice and video agents that qualify leads, warm-transfer to specialists, and book appointments 24/7." />
        <meta name="keywords" content="V·TEAMS, multi-agent AI, AI agent squad, warm transfer AI, coordinated AI agents, automotive AI, dealership AI, conversational AI, AI BDC agent, lead qualification" />
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
