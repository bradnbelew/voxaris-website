import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/sections/HeroSection";
import ProblemSection from "@/components/sections/ProblemSection";
import TechnologySection from "@/components/sections/TechnologySection";
import UseCaseSection from "@/components/sections/UseCaseSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import ComplianceSection from "@/components/sections/ComplianceSection";
import FinalCTASection from "@/components/sections/FinalCTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ProblemSection />
      <TechnologySection />
      <UseCaseSection />
      <HowItWorksSection />
      <ComplianceSection />
      <FinalCTASection />
    </Layout>
  );
};

export default Index;
