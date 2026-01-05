import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/sections/HeroSection";
import ProblemSection from "@/components/sections/ProblemSection";
import LiveDemoSection from "@/components/sections/LiveDemoSection";
import SystemOverviewSection from "@/components/sections/SystemOverviewSection";
import MariaSection from "@/components/sections/MariaSection";
import ComparisonSection from "@/components/sections/ComparisonSection";
import DifferentiationSection from "@/components/sections/DifferentiationSection";
import AudienceSection from "@/components/sections/AudienceSection";
import TrustSection from "@/components/sections/TrustSection";
import CTASection from "@/components/sections/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ProblemSection />
      <LiveDemoSection />
      <SystemOverviewSection />
      <MariaSection />
      <ComparisonSection />
      <DifferentiationSection />
      <AudienceSection />
      <TrustSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
