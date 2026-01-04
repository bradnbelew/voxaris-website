import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/sections/HeroSection";
import ProblemSection from "@/components/sections/ProblemSection";
import SystemOverviewSection from "@/components/sections/SystemOverviewSection";
import DifferentiationSection from "@/components/sections/DifferentiationSection";
import AudienceSection from "@/components/sections/AudienceSection";
import MariaSection from "@/components/sections/MariaSection";
import TrustSection from "@/components/sections/TrustSection";
import CTASection from "@/components/sections/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ProblemSection />
      <SystemOverviewSection />
      <MariaSection />
      <DifferentiationSection />
      <AudienceSection />
      <TrustSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
