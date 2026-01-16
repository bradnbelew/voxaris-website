import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/sections/HeroSection";
import CVISection from "@/components/sections/CVISection";
import ProductMatrixSection from "@/components/sections/ProductMatrixSection";
import ProblemSection from "@/components/sections/ProblemSection";
import DeliverablesSection from "@/components/sections/DeliverablesSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import MariaSection from "@/components/sections/MariaSection";
import FAQSection from "@/components/sections/FAQSection";
import TrustSection from "@/components/sections/TrustSection";
import CTASection from "@/components/sections/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <CVISection />
      <ProductMatrixSection />
      <ProblemSection />
      <DeliverablesSection />
      <HowItWorksSection />
      <MariaSection />
      <FAQSection />
      <TrustSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
