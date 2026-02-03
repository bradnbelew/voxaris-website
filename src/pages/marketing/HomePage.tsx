import {
  Navbar,
  Hero,
  StatsSection,
  ProblemSolution,
  HowItWorks,
  TechnologyShowcase,
  FeaturesSection,
  CTASection,
  Footer,
} from '@/components/marketing';

export function HomePage() {
  return (
    <div className="min-h-screen bg-cream-100">
      <Navbar />
      <main>
        <Hero />
        <StatsSection />
        <FeaturesSection />
        <TechnologyShowcase />
        <ProblemSolution />
        <HowItWorks />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
