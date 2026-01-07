import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/sections/HeroSection";
import ProblemSection from "@/components/sections/ProblemSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import CampaignModeSection from "@/components/sections/CampaignModeSection";
import ConversationIntelligenceSection from "@/components/sections/ConversationIntelligenceSection";
import IntegrationsSection from "@/components/sections/IntegrationsSection";
import VoxarisDifferenceSection from "@/components/sections/VoxarisDifferenceSection";
import PilotProgramSection from "@/components/sections/PilotProgramSection";
import FAQSection from "@/components/sections/FAQSection";
import CTASection from "@/components/sections/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ProblemSection />
      <HowItWorksSection />
      <CampaignModeSection />
      <ConversationIntelligenceSection />
      <VoxarisDifferenceSection />
      <IntegrationsSection />
      <PilotProgramSection />
      <FAQSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
