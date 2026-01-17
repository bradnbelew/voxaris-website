import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/sections/HeroSection";
import VSuiteSection from "@/components/sections/VSuiteSection";
import TalkingPostcardSection from "@/components/sections/TalkingPostcardSection";
import LivingShowroomSection from "@/components/sections/LivingShowroomSection";
import ComparisonSection from "@/components/sections/ComparisonSection";
import NewCTASection from "@/components/sections/NewCTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <VSuiteSection />
      <TalkingPostcardSection />
      <LivingShowroomSection />
      <ComparisonSection />
      <NewCTASection />
    </Layout>
  );
};

export default Index;
