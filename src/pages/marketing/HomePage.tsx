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

export function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <LogoStrip />
        <TechnologyShowcase />
        <VSuiteSection />
        <ProblemSolution />
        <HowItWorks />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
