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
