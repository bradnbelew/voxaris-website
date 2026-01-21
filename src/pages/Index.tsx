import Layout from "@/components/layout/Layout";
import Hero3DSection from "@/components/sections/Hero3DSection";
import ProblemSection from "@/components/sections/ProblemSection";
import TechnologySection from "@/components/sections/TechnologySection";
import TalkingPostcardSection from "@/components/sections/TalkingPostcardSection";
import ComparisonSection from "@/components/sections/ComparisonSection";
import LivingShowroomSection from "@/components/sections/LivingShowroomSection";
import FinalCTASection from "@/components/sections/FinalCTASection";

const Index = () => {
  return (
    <>
      <Hero3DSection />
      <Layout>
        <ProblemSection />
        <TechnologySection />
        <TalkingPostcardSection />
        <ComparisonSection />
        <LivingShowroomSection />
        <FinalCTASection />
      </Layout>
    </>
  );
};

export default Index;
