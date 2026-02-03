import {
  Navbar,
  Hero,
  StatsSection,
  FeaturesSection,
  TechnologyShowcase,
  ProblemSolution,
  HowItWorks,
  CTASection,
  Footer,
} from '@/components/marketing';

export function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <StatsSection />
        <TechnologyShowcase />
        <FeaturesSection />
        <ProblemSolution />
        <HowItWorks />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
