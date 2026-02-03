import {
  Navbar,
  Hero,
  ProblemSolution,
  HowItWorks,
  TechnologyShowcase,
  FeaturesSection,
  CTASection,
  Footer,
} from '@/components/marketing';

export function HomePage() {
  return (
    <div className="min-h-screen bg-navy-900">
      <Navbar />
      <main>
        <Hero />
        <ProblemSolution />
        <HowItWorks />
        <TechnologyShowcase />
        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
