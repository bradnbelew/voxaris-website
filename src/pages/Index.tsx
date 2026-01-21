import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/sections/HeroSection";
import ProblemSection from "@/components/sections/ProblemSection";
import TechnologySection from "@/components/sections/TechnologySection";
import TalkingPostcardSection from "@/components/sections/TalkingPostcardSection";
import ComparisonSection from "@/components/sections/ComparisonSection";
import LivingShowroomSection from "@/components/sections/LivingShowroomSection";
import FinalCTASection from "@/components/sections/FinalCTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ProblemSection />
      <TechnologySection />
      <TalkingPostcardSection />
      <ComparisonSection />
      <LivingShowroomSection />
      <FinalCTASection />
    </Layout>
  );
};

export default Index;
