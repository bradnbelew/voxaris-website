import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Terms of Service | Voxaris</title>
        <meta name="description" content="Voxaris terms of service governing the use of our AI voice agent platform, SMS messaging, and related services." />
        <link rel="canonical" href="https://voxaris.io/terms" />
        <meta property="og:title" content="Terms of Service | Voxaris" />
        <meta property="og:description" content="Voxaris terms of service governing AI voice agents, SMS messaging, and platform usage." />
        <meta property="og:url" content="https://voxaris.io/terms" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://voxaris.io/og-image.png" />
        <meta name="twitter:image" content="https://voxaris.io/og-image.png" />
      </Helmet>
      <Navbar />
      <main id="main-content">
        <section className="section-padding pt-28">
          <div className="container-wide max-w-3xl">
            <h1 className="text-4xl font-semibold text-foreground mb-4">Terms of Service</h1>
            <p className="text-sm text-muted-foreground mb-10">Last updated: March 9, 2026</p>

            <div className="prose prose-neutral max-w-none space-y-6 text-muted-foreground leading-relaxed">

              <p>
                These Terms of Service ("Terms") constitute a legally binding agreement between you ("you," "your," or "user") and Voxaris LLC ("Voxaris," "we," "us," or "our"), governing your access to and use of the Voxaris website at <a href="https://voxaris.io" className="text-foreground underline">voxaris.io</a>, our AI-powered voice agent services, text messaging services, and all related products, features, and content (collectively, the "Services"). By accessing or using any of our Services, you acknowledge that you have read, understood, and agree to be bound by these Terms and our <a href="/privacy" className="text-foreground underline">Privacy Policy</a>, which is incorporated herein by reference. If you do not agree to these Terms, do not access or use our Services.
              </p>

              {/* ── 1. Eligibility ── */}
              <h2 className="text-xl font-semibold text-foreground mt-10">1. Eligibility</h2>
              <p>
                You must be at least 18 years of age to use our Services. By using the Services, you represent and warrant that you are at least 18 years old, have the legal capacity to enter into a binding agreement, and are not prohibited from using the Services under any applicable law. If you are using the Services on behalf of a business or organization, you represent that you have the authority to bind that entity to these Terms.
              </p>

              {/* ── 2. Description of Services ── */}
              <h2 className="text-xl font-semibold text-foreground mt-10">2. Description of Services</h2>
              <p>Voxaris provides AI-powered communication and automation solutions for businesses, including but not limited to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong className="text-foreground">V·TEAMS:</strong> Coordinated AI voice agent squads for inbound and outbound phone calls, featuring specialized roles (Receptionist, Qualifier, Specialist, Closer) with warm-transfer routing</li>
                <li><strong className="text-foreground">AI Voice Agents:</strong> Automated phone agents powered by artificial intelligence for call handling, lead qualification, appointment booking, and customer engagement</li>
                <li><strong className="text-foreground">SMS/Text Messaging:</strong> Automated and manual text message communications for appointment confirmations, reminders, follow-ups, and promotional messages (subject to your consent)</li>
                <li><strong className="text-foreground">CRM Integration:</strong> Synchronization of call data, transcripts, and outcomes with third-party CRM platforms</li>
                <li><strong className="text-foreground">Analytics & Reporting:</strong> Call analytics, conversion tracking, and performance reporting dashboards</li>
              </ul>
              <p>Services are provided on a subscription basis, project basis, or as otherwise specified in your individual service agreement with Voxaris.</p>

              {/* ── 3. Account Registration & Responsibilities ── */}
              <h2 className="text-xl font-semibold text-foreground mt-10">3. Account Registration & Responsibilities</h2>
              <p>
                When you create an account, submit a demo request, or otherwise provide information to use our Services, you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and promptly update your information to keep it accurate and complete</li>
                <li>Maintain the security and confidentiality of your account credentials</li>
                <li>Accept responsibility for all activities that occur under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
              <p>
                We reserve the right to suspend or terminate your account if any information provided is found to be inaccurate, incomplete, or fraudulent.
              </p>

              {/* ── 4. SMS/Text Messaging Terms ── */}
              <h2 className="text-xl font-semibold text-foreground mt-10">4. SMS/Text Messaging Terms</h2>
              <p>
                By opting in to receive text messages from Voxaris — whether by checking a consent checkbox on our website forms, texting a keyword to our phone number, verbally consenting during a phone call, or through any other opt-in mechanism — you agree to the following terms:
              </p>

              <h3 className="text-base font-semibold text-foreground mt-6">4.1 Consent to Receive Messages</h3>
              <p>
                You expressly consent to receive recurring automated text messages from Voxaris LLC at the mobile phone number you provided. You understand that:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Messages may be sent using automated technology, including autodialer systems and pre-written content</li>
                <li>Consent is not a condition of purchasing any goods or services from Voxaris</li>
                <li>You can revoke consent at any time (see Section 4.4)</li>
              </ul>

              <h3 className="text-base font-semibold text-foreground mt-6">4.2 Types of Messages</h3>
              <p>Messages from Voxaris may include:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Demo and appointment confirmations and reminders</li>
                <li>Follow-up communications related to your inquiry or demo request</li>
                <li>Service updates, onboarding information, and account notifications</li>
                <li>Promotional offers and marketing messages (only with your prior express written consent)</li>
              </ul>

              <h3 className="text-base font-semibold text-foreground mt-6">4.3 Message Frequency & Costs</h3>
              <p>
                Message frequency varies based on your interactions with us. <strong className="text-foreground">Message and data rates may apply.</strong> Voxaris does not charge you for receiving text messages, but your mobile carrier's standard messaging and data rates may apply. Check with your carrier for details about your plan. You are solely responsible for any charges from your mobile carrier.
              </p>

              <h3 className="text-base font-semibold text-foreground mt-6">4.4 Opt-Out (STOP)</h3>
              <p>
                <strong className="text-foreground">You can opt out of receiving text messages at any time by replying STOP to any message you receive from us.</strong> Upon receiving your STOP request, we will send a single confirmation message confirming your unsubscription. After that, you will no longer receive text messages from us unless you re-opt-in. You may also opt out by contacting us at <a href="mailto:ethan@voxaris.io" className="text-foreground underline">ethan@voxaris.io</a> or calling <a href="tel:+14077594100" className="text-foreground underline">(407) 759-4100</a>.
              </p>

              <h3 className="text-base font-semibold text-foreground mt-6">4.5 Help</h3>
              <p>
                For assistance with our text messaging program, reply HELP to any message or contact us at <a href="mailto:ethan@voxaris.io" className="text-foreground underline">ethan@voxaris.io</a> or <a href="tel:+14077594100" className="text-foreground underline">(407) 759-4100</a>.
              </p>

              <h3 className="text-base font-semibold text-foreground mt-6">4.6 Carrier Disclaimer</h3>
              <p>
                Carriers, including but not limited to T-Mobile, are not liable for delayed or undelivered messages. Voxaris and mobile carriers are not responsible for messages that are not received due to factors outside of our control, including issues related to your device, carrier network disruptions, or changes to your mobile phone number.
              </p>

              <h3 className="text-base font-semibold text-foreground mt-6">4.7 No Third-Party Sharing of Messaging Data</h3>
              <p>
                <strong className="text-foreground">We do not share, sell, rent, or provide your phone number or messaging opt-in consent data to any third parties or affiliates for their own marketing purposes.</strong> Your phone number and opt-in information are used solely by Voxaris to communicate with you as described in these Terms and our Privacy Policy.
              </p>

              {/* ── 5. AI Voice Agent Terms ── */}
              <h2 className="text-xl font-semibold text-foreground mt-10">5. AI Voice Agent Terms</h2>
              <p>By interacting with our AI voice agent services, you acknowledge and agree to the following:</p>

              <h3 className="text-base font-semibold text-foreground mt-6">5.1 AI Disclosure</h3>
              <p>
                Our phone lines may be answered by AI-powered voice agents rather than human representatives. These AI agents are part of the Voxaris V·TEAMS platform and are designed to handle calls professionally and efficiently. AI agents identify themselves as part of the V·TEAMS system.
              </p>

              <h3 className="text-base font-semibold text-foreground mt-6">5.2 Call Recording & Transcription</h3>
              <p>
                All calls handled by our AI voice agents may be recorded and transcribed. By calling our phone number or receiving a call from our AI agents, you consent to the recording and transcription of the call for purposes including:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Delivering the service you requested (appointment booking, lead qualification, information delivery)</li>
                <li>Quality assurance and service improvement</li>
                <li>Training and improving our AI systems</li>
                <li>Compliance documentation and dispute resolution</li>
              </ul>

              <h3 className="text-base font-semibold text-foreground mt-6">5.3 Limitations of AI Agents</h3>
              <p>
                While our AI agents are designed to be helpful and accurate, they are not human and may occasionally misunderstand requests or provide imperfect responses. AI agents do not provide legal, medical, financial, or professional advice. Any information provided by our AI agents is for general informational purposes only. You may request to speak with a human representative at any time during an AI call.
              </p>

              {/* ── 6. TCPA Consent & Compliance ── */}
              <h2 className="text-xl font-semibold text-foreground mt-10">6. TCPA Consent & Compliance</h2>
              <p>
                In compliance with the Telephone Consumer Protection Act (TCPA), 47 U.S.C. {"\u00A7"} 227, and applicable Federal Communications Commission (FCC) regulations, you understand and agree that:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>By providing your phone number and opting in, you provide prior express consent for Voxaris to contact you at that number using automated technology, including autodialer systems and artificial or prerecorded voice messages, for transactional purposes</li>
                <li>By checking a written consent checkbox or providing express written consent through other means, you provide prior express written consent for Voxaris to contact you with promotional or marketing messages using automated technology</li>
                <li>Your consent is voluntary and is not a condition of purchasing any product or service from Voxaris</li>
                <li>You may revoke your consent at any time by replying STOP to any text message, emailing <a href="mailto:ethan@voxaris.io" className="text-foreground underline">ethan@voxaris.io</a>, calling <a href="tel:+14077594100" className="text-foreground underline">(407) 759-4100</a>, or informing our agent during a call</li>
                <li>Revoking consent does not affect the legality of communications sent prior to revocation</li>
              </ul>

              {/* ── 7. Acceptable Use ── */}
              <h2 className="text-xl font-semibold text-foreground mt-10">7. Acceptable Use</h2>
              <p>You agree not to use our Services to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Violate any applicable law, regulation, or third-party rights</li>
                <li>Transmit any unlawful, threatening, abusive, harassing, defamatory, or otherwise objectionable content</li>
                <li>Attempt to gain unauthorized access to our systems, networks, or other users' accounts</li>
                <li>Interfere with or disrupt the integrity or performance of the Services</li>
                <li>Use the Services for any fraudulent, deceptive, or misleading purpose</li>
                <li>Reverse engineer, decompile, or disassemble any aspect of the Services</li>
                <li>Scrape, data mine, or use automated means to extract content from the Services without written authorization</li>
                <li>Resell, sublicense, or redistribute the Services without a valid white-label agreement</li>
              </ul>
              <p>
                We reserve the right to investigate and take appropriate action, including suspending or terminating your access, for violations of this section.
              </p>

              {/* ── 8. Intellectual Property ── */}
              <h2 className="text-xl font-semibold text-foreground mt-10">8. Intellectual Property</h2>
              <p>
                All content, technology, software, trademarks, trade names, logos, and branding associated with Voxaris — including but not limited to V·TEAMS, V·FACE, V·SENSE, V·FLOW, and VoxEngine — are the exclusive property of Voxaris LLC and are protected by United States and international intellectual property laws. You may not:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Reproduce, distribute, display, or create derivative works of any Voxaris content or technology without prior written permission</li>
                <li>Use Voxaris trademarks, logos, or branding in any manner that implies endorsement or affiliation without authorization</li>
                <li>Remove, alter, or obscure any copyright, trademark, or other proprietary notices</li>
              </ul>
              <p>
                Any feedback, suggestions, or ideas you provide to Voxaris regarding the Services may be used by us without obligation or compensation to you.
              </p>

              {/* ── 9. Payment Terms ── */}
              <h2 className="text-xl font-semibold text-foreground mt-10">9. Payment Terms</h2>
              <p>
                If your use of the Services requires payment, the following terms apply:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Fees, billing frequency, and payment terms are as specified in your individual service agreement or order form</li>
                <li>All fees are in U.S. dollars unless otherwise specified</li>
                <li>Late payments may incur interest at the rate of 1.5% per month or the maximum rate permitted by law, whichever is less</li>
                <li>We reserve the right to suspend Services for accounts with outstanding balances</li>
                <li>You are responsible for all applicable taxes related to your use of the Services</li>
              </ul>

              {/* ── 10. Confidentiality ── */}
              <h2 className="text-xl font-semibold text-foreground mt-10">10. Confidentiality</h2>
              <p>
                Each party agrees to maintain the confidentiality of any proprietary or non-public information disclosed by the other party in connection with the Services ("Confidential Information"). Confidential Information includes, but is not limited to, business strategies, customer data, pricing information, technology specifications, and any information marked as confidential. Neither party shall disclose the other's Confidential Information to any third party without prior written consent, except as required by law.
              </p>

              {/* ── 11. Disclaimers & Warranty Limitations ── */}
              <h2 className="text-xl font-semibold text-foreground mt-10">11. Disclaimers & Warranty Limitations</h2>
              <p>
                <strong className="text-foreground">THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY.</strong> Voxaris expressly disclaims all warranties, including but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Implied warranties of merchantability, fitness for a particular purpose, and non-infringement</li>
                <li>Warranties that the Services will be uninterrupted, error-free, secure, or free of viruses or harmful components</li>
                <li>Warranties regarding the accuracy, reliability, or completeness of any content or information provided by AI agents</li>
                <li>Warranties regarding the results obtained from use of the Services</li>
              </ul>
              <p>
                Our AI voice agents are automated systems and may produce inaccurate, incomplete, or imperfect outputs. You acknowledge that you use the Services at your own risk and should not rely on AI agent outputs as professional advice.
              </p>

              {/* ── 12. Limitation of Liability ── */}
              <h2 className="text-xl font-semibold text-foreground mt-10">12. Limitation of Liability</h2>
              <p>
                <strong className="text-foreground">TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, VOXARIS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,</strong> including but not limited to loss of profits, revenue, data, business opportunities, or goodwill, arising out of or relating to your use of the Services, regardless of the theory of liability (contract, tort, strict liability, or otherwise) and even if Voxaris has been advised of the possibility of such damages.
              </p>
              <p>
                <strong className="text-foreground">VOXARIS'S TOTAL AGGREGATE LIABILITY</strong> for all claims arising out of or relating to these Terms or the Services shall not exceed the total amount paid by you to Voxaris during the twelve (12) months immediately preceding the event giving rise to the claim, or one hundred dollars ($100), whichever is greater.
              </p>
              <p>
                Some jurisdictions do not allow the exclusion or limitation of certain damages. In such jurisdictions, our liability shall be limited to the maximum extent permitted by law.
              </p>

              {/* ── 13. Indemnification ── */}
              <h2 className="text-xl font-semibold text-foreground mt-10">13. Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless Voxaris LLC, its officers, directors, employees, agents, and affiliates from and against any and all claims, liabilities, damages, losses, costs, and expenses (including reasonable attorneys' fees) arising out of or related to:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Your use of the Services</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any applicable law or regulation</li>
                <li>Your violation of any third-party rights</li>
                <li>Any content or data you provide through the Services</li>
              </ul>

              {/* ── 14. Termination ── */}
              <h2 className="text-xl font-semibold text-foreground mt-10">14. Termination</h2>
              <p>
                Either party may terminate the service relationship as follows:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong className="text-foreground">By You:</strong> You may stop using the Services at any time. If you have an active subscription, cancellation terms are as specified in your service agreement. To cancel, contact us at <a href="mailto:ethan@voxaris.io" className="text-foreground underline">ethan@voxaris.io</a>.</li>
                <li><strong className="text-foreground">By Voxaris:</strong> We may suspend or terminate your access to the Services at any time, with or without cause, upon reasonable notice. We will provide at least 30 days' notice for terminations without cause. We may terminate immediately for violations of these Terms, fraudulent activity, or illegal use.</li>
              </ul>
              <p>Upon termination:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Your access to the platform and deployed AI agents will be deactivated</li>
                <li>Outstanding fees remain due and payable</li>
                <li>We will retain your data in accordance with our Privacy Policy and applicable law</li>
                <li>You may request export of your data within 30 days of termination</li>
                <li>Sections 8 (IP), 11 (Disclaimers), 12 (Liability), 13 (Indemnification), 15 (Dispute Resolution), and 16 (Governing Law) survive termination</li>
              </ul>

              {/* ── 15. Dispute Resolution ── */}
              <h2 className="text-xl font-semibold text-foreground mt-10">15. Dispute Resolution</h2>
              <p>
                In the event of any dispute, claim, or controversy arising out of or relating to these Terms or the Services ("Dispute"), the parties agree to first attempt to resolve the Dispute informally by contacting each other in writing. You may send written notice of a Dispute to Voxaris LLC, Orlando, FL 32835, or by email to <a href="mailto:ethan@voxaris.io" className="text-foreground underline">ethan@voxaris.io</a>.
              </p>
              <p>
                If the Dispute is not resolved within thirty (30) days of the initial written notice, either party may pursue formal resolution. Any legal action or proceeding relating to these Terms shall be brought exclusively in the state or federal courts located in Orange County, Florida, and you consent to the personal jurisdiction of such courts.
              </p>
              <p>
                <strong className="text-foreground">CLASS ACTION WAIVER:</strong> You agree that any dispute resolution proceedings will be conducted on an individual basis only, and not in a class, consolidated, or representative action. You waive the right to participate in any class action or class-wide arbitration.
              </p>

              {/* ── 16. Governing Law ── */}
              <h2 className="text-xl font-semibold text-foreground mt-10">16. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the State of Florida, United States, without regard to its conflict of law provisions. The United Nations Convention on Contracts for the International Sale of Goods does not apply to these Terms.
              </p>

              {/* ── 17. Modifications to Terms ── */}
              <h2 className="text-xl font-semibold text-foreground mt-10">17. Modifications to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. When we make changes, we will update the "Last updated" date at the top of this page. If we make material changes, we will provide notice through our website or by other means. Your continued use of the Services after any modifications indicates your acceptance of the revised Terms. If you do not agree to the modified Terms, you must stop using the Services.
              </p>

              {/* ── 18. General Provisions ── */}
              <h2 className="text-xl font-semibold text-foreground mt-10">18. General Provisions</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-foreground">Entire Agreement:</strong> These Terms, together with the Privacy Policy and any applicable service agreement, constitute the entire agreement between you and Voxaris regarding the Services and supersede all prior agreements, understandings, and communications.</li>
                <li><strong className="text-foreground">Severability:</strong> If any provision of these Terms is found to be invalid or unenforceable, that provision shall be enforced to the maximum extent permissible, and the remaining provisions shall remain in full force and effect.</li>
                <li><strong className="text-foreground">Waiver:</strong> The failure of Voxaris to enforce any right or provision of these Terms shall not constitute a waiver of that right or provision.</li>
                <li><strong className="text-foreground">Assignment:</strong> You may not assign or transfer your rights or obligations under these Terms without our prior written consent. Voxaris may assign these Terms without restriction.</li>
                <li><strong className="text-foreground">Force Majeure:</strong> Voxaris shall not be liable for any failure or delay in performance resulting from causes beyond our reasonable control, including natural disasters, acts of government, telecommunications failures, or internet service disruptions.</li>
                <li><strong className="text-foreground">Notices:</strong> Notices to Voxaris must be sent to the address provided in Section 19. Notices to you will be sent to the email address associated with your account or as otherwise provided.</li>
              </ul>

              {/* ── 19. Contact Information ── */}
              <h2 className="text-xl font-semibold text-foreground mt-10">19. Contact Information</h2>
              <p>
                If you have questions about these Terms of Service, please contact us at:
              </p>
              <p className="mt-2">
                <strong className="text-foreground">Voxaris LLC</strong><br />
                Orlando, FL 32835<br />
                Email: <a href="mailto:ethan@voxaris.io" className="text-foreground underline">ethan@voxaris.io</a><br />
                Phone: <a href="tel:+14077594100" className="text-foreground underline">(407) 759-4100</a>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
