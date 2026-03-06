import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";

export default function Terms() {
  return (
    <Layout>
      <Helmet>
        <title>Terms of Service | Voxaris</title>
        <meta name="description" content="Voxaris terms of service. Terms governing the use of our AI video agent platform and related services." />
        <link rel="canonical" href="https://voxaris.io/terms" />
        <meta property="og:title" content="Terms of Service | Voxaris" />
        <meta property="og:description" content="Voxaris terms of service governing the use of our AI video agent platform." />
        <meta property="og:url" content="https://voxaris.io/terms" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://voxaris.io/og-image.png" />
        <meta name="twitter:image" content="https://voxaris.io/og-image.png" />
      </Helmet>
      <section className="section-padding">
        <div className="container-wide max-w-3xl">
          <h1 className="text-4xl font-semibold text-foreground mb-8">Terms of Service</h1>
          <p className="text-sm text-muted-foreground mb-8">Last updated: March 3, 2026</p>

          <div className="prose prose-neutral max-w-none space-y-6 text-muted-foreground leading-relaxed">
            <h2 className="text-xl font-semibold text-foreground mt-8">1. Acceptance of Terms</h2>
            <p>By accessing or using the Voxaris platform, website, or any services provided by Voxaris LLC ("Voxaris," "we," "us"), you agree to be bound by these Terms of Service. If you do not agree, do not use our services.</p>

            <h2 className="text-xl font-semibold text-foreground mt-8">2. Services</h2>
            <p>Voxaris provides AI-powered coordinated agent squads, voice agents, video agents, and multi-agent orchestration technology ("Services"). Services are provided on a subscription basis as detailed in your service agreement.</p>

            <h2 className="text-xl font-semibold text-foreground mt-8">3. User Obligations</h2>
            <p>You agree to provide accurate information when creating an account or submitting a demo request. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>

            <h2 className="text-xl font-semibold text-foreground mt-8">4. Intellectual Property</h2>
            <p>All content, technology, and branding associated with Voxaris — including V·TEAMS, V·FACE, V·SENSE, V·FLOW, and VoxEngine — are the property of Voxaris LLC. You may not reproduce, distribute, or create derivative works without written permission.</p>

            <h2 className="text-xl font-semibold text-foreground mt-8">5. Limitation of Liability</h2>
            <p>Voxaris provides its Services "as is" without warranties of any kind. To the fullest extent permitted by law, Voxaris shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Services.</p>

            <h2 className="text-xl font-semibold text-foreground mt-8">6. Termination</h2>
            <p>Either party may terminate the service agreement with written notice as specified in your subscription terms. Upon termination, your access to the platform will be discontinued and any deployed agents will be deactivated.</p>

            <h2 className="text-xl font-semibold text-foreground mt-8">7. Governing Law</h2>
            <p>These Terms shall be governed by and construed in accordance with the laws of the State of Florida, without regard to conflict of law principles.</p>

            <h2 className="text-xl font-semibold text-foreground mt-8">8. Contact</h2>
            <p>For questions about these Terms, contact us at:<br />Voxaris LLC<br />Orlando, FL 32835<br />Email: <a href="mailto:ethan@voxaris.io" className="text-foreground underline">ethan@voxaris.io</a><br />Phone: (407) 759-4100</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
