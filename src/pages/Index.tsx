import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/sections/HeroSection";
import ProblemSection from "@/components/sections/ProblemSection";
import DeliverablesSection from "@/components/sections/DeliverablesSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import SolutionsSplitSection from "@/components/sections/SolutionsSplitSection";
import MariaSection from "@/components/sections/MariaSection";
import FAQSection from "@/components/sections/FAQSection";
import TrustSection from "@/components/sections/TrustSection";
import CTASection from "@/components/sections/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ProblemSection />
      <DeliverablesSection />
      <HowItWorksSection />
      <SolutionsSplitSection />
      <MariaSection />
      <FAQSection />
      <TrustSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
