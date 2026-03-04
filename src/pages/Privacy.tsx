import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";

export default function Privacy() {
  return (
    <Layout>
      <Helmet>
        <title>Privacy Policy | Voxaris</title>
        <meta name="description" content="Voxaris privacy policy. Learn how we collect, use, and protect your data when you use our AI video agent platform." />
        <link rel="canonical" href="https://voxaris.io/privacy" />
        <meta property="og:title" content="Privacy Policy | Voxaris" />
        <meta property="og:description" content="Voxaris privacy policy. Learn how we collect, use, and protect your data." />
        <meta property="og:url" content="https://voxaris.io/privacy" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://voxaris.io/og-image.png" />
        <meta name="twitter:image" content="https://voxaris.io/og-image.png" />
      </Helmet>
      <section className="section-padding">
        <div className="container-wide max-w-3xl">
          <h1 className="text-4xl font-semibold text-foreground mb-8">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-8">Last updated: March 3, 2026</p>

          <div className="prose prose-neutral max-w-none space-y-6 text-muted-foreground leading-relaxed">
            <h2 className="text-xl font-semibold text-foreground mt-8">1. Information We Collect</h2>
            <p>When you use the Voxaris website or interact with our AI agents, we may collect information you provide directly, such as your name, email address, phone number, company name, and any messages you submit through our forms.</p>

            <h2 className="text-xl font-semibold text-foreground mt-8">2. How We Use Your Information</h2>
            <p>We use your information to respond to demo requests, provide our AI agent services, improve our platform, and communicate with you about Voxaris products and updates. We do not sell your personal information to third parties.</p>

            <h2 className="text-xl font-semibold text-foreground mt-8">3. Data Security</h2>
            <p>We implement industry-standard security measures to protect your data. All data transmitted through our platform is encrypted in transit using TLS. We regularly review our security practices to ensure your information remains protected.</p>

            <h2 className="text-xl font-semibold text-foreground mt-8">4. Cookies & Analytics</h2>
            <p>We use essential cookies to maintain site functionality and analytics tools to understand how visitors use our website. You can control cookie preferences through your browser settings.</p>

            <h2 className="text-xl font-semibold text-foreground mt-8">5. Third-Party Services</h2>
            <p>Our platform integrates with third-party services for video rendering, voice processing, and CRM synchronization. These services process data in accordance with their own privacy policies.</p>

            <h2 className="text-xl font-semibold text-foreground mt-8">6. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal data. To exercise these rights or for any privacy-related questions, contact us at <a href="mailto:ethan@voxaris.io" className="text-foreground underline">ethan@voxaris.io</a>.</p>

            <h2 className="text-xl font-semibold text-foreground mt-8">7. Contact</h2>
            <p>Voxaris LLC<br />Orlando, FL 32835<br />Email: <a href="mailto:ethan@voxaris.io" className="text-foreground underline">ethan@voxaris.io</a><br />Phone: (407) 759-4100</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
