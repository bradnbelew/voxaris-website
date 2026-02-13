import {
  Navbar,
  Hero,
  StatsSection,
  FeaturesSection,
  TechnologyShowcase,
  VSuiteSection,
  ProblemSolution,
  HowItWorks,
  CTASection,
  Footer,
} from '@/components/marketing';

export function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main>
        <Hero />
        <StatsSection />
        <TechnologyShowcase />
        <VSuiteSection />
        <FeaturesSection />
        <ProblemSolution />
        <HowItWorks />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
