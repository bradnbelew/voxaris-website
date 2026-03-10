import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Privacy Policy | Voxaris</title>
        <meta name="description" content="Voxaris privacy policy. Learn how we collect, use, and protect your data including phone numbers, SMS messaging consent, and AI voice call disclosures." />
        <link rel="canonical" href="https://voxaris.io/privacy" />
        <meta property="og:title" content="Privacy Policy | Voxaris" />
        <meta property="og:description" content="Voxaris privacy policy covering data collection, SMS consent, AI voice calls, and your rights." />
        <meta property="og:url" content="https://voxaris.io/privacy" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://voxaris.io/og-image.png" />
        <meta name="twitter:image" content="https://voxaris.io/og-image.png" />
      </Helmet>
      <Navbar />
      <main id="main-content">
        <section className="section-padding pt-32">
          <div className="container-wide max-w-3xl">
            <h1 className="text-4xl font-semibold text-foreground mb-4">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground mb-10">Last updated: March 9, 2026</p>

            <div className="prose prose-neutral max-w-none space-y-6 text-muted-foreground leading-relaxed">

              <p>
                Voxaris LLC ("Voxaris," "we," "us," or "our") is committed to protecting your privacy. This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you visit our website at <a href="https://voxaris.io" className="text-foreground underline">voxaris.io</a>, interact with our AI voice agents, submit forms, or communicate with us by phone, email, or text message. Please read this policy carefully. By using our website or services, you consent to the practices described herein.
              </p>

              {/* ── 1. Information We Collect ── */}
              <h2 className="text-xl font-semibold text-foreground mt-10">1. Information We Collect</h2>

              <h3 className="text-base font-semibold text-foreground mt-6">1.1 Information You Provide Directly</h3>
              <p>When you fill out a form, request a demo, call our phone line, or otherwise contact us, we may collect:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Full name</li>
                <li>Phone number (including mobile phone number)</li>
                <li>Email address</li>
                <li>Company or business name</li>
                <li>Number of business locations</li>
                <li>Industry or business type</li>
                <li>Any messages, questions, or information you voluntarily provide</li>
              </ul>

              <h3 className="text-base font-semibold text-foreground mt-6">1.2 Information Collected Automatically</h3>
              <p>When you visit our website, we may automatically collect:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>IP address and approximate geographic location</li>
                <li>Browser type, device type, and operating system</li>
                <li>Pages viewed, time spent on pages, and referring URLs</li>
                <li>Cookies and similar tracking technologies (see Section 7)</li>
              </ul>

              <h3 className="text-base font-semibold text-foreground mt-6">1.3 Information from AI Voice Interactions</h3>
              <p>When you call our AI-powered phone agents or receive a call from our AI agents, we may collect:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Your phone number (via caller ID)</li>
                <li>Call recordings and transcripts</li>
                <li>Information you provide during the call (name, business details, intent, scheduling preferences)</li>
                <li>Call metadata (duration, timestamp, call outcome, agent path)</li>
              </ul>
              <p>
                <strong className="text-foreground">AI Disclosure:</strong> Our inbound and outbound phone lines may be answered by AI voice agents, not human representatives. These AI agents are clearly identified as part of the V·TEAMS system. Call recordings and transcripts are stored for quality assurance, service improvement, and to fulfill your requests.
              </p>

              {/* ── 2. How We Use Your Information ── */}
              <h2 className="text-xl font-semibold text-foreground mt-10">2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Respond to your demo requests, inquiries, and support needs</li>
                <li>Provide, operate, and improve our AI agent services</li>
                <li>Schedule and confirm appointments</li>
                <li>Send you transactional communications related to your requests (e.g., demo confirmations, appointment reminders)</li>
                <li>Send you promotional or marketing communications, including via SMS/text message, where you have provided consent</li>
                <li>Analyze website usage to improve user experience</li>
                <li>Comply with legal obligations</li>
                <li>Prevent fraud and protect our rights</li>
              </ul>
              <p><strong className="text-foreground">We do not sell, rent, or trade your personal information to third parties for their marketing purposes.</strong></p>

              {/* ── 3. SMS/Text Messaging ── */}
              <h2 className="text-xl font-semibold text-foreground mt-10">3. SMS/Text Messaging Policy</h2>
              <p>
                By providing your mobile phone number and opting in to receive text messages from Voxaris (for example, by checking the consent checkbox on our forms, or by texting a keyword to our short code or phone number), you expressly consent to receive recurring automated text messages from Voxaris LLC at the mobile number you provided. Consent is not a condition of purchase.
              </p>

              <h3 className="text-base font-semibold text-foreground mt-6">3.1 Types of Messages</h3>
              <p>Messages may include:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Demo and appointment confirmations</li>
                <li>Appointment reminders</li>
                <li>Follow-up communications related to your inquiry</li>
                <li>Service updates and product information</li>
                <li>Promotional offers (with your prior express written consent)</li>
              </ul>

              <h3 className="text-base font-semibold text-foreground mt-6">3.2 Message Frequency</h3>
              <p>
                Message frequency varies based on your interactions with us. Transactional messages (confirmations, reminders) are sent as needed based on your requests. Promotional messages will not exceed 4 messages per month unless you have agreed to a specific campaign with different frequency.
              </p>

              <h3 className="text-base font-semibold text-foreground mt-6">3.3 Opt-Out</h3>
              <p>
                <strong className="text-foreground">You can opt out of receiving text messages at any time by replying STOP to any message you receive from us.</strong> After you send STOP, we will send you a single confirmation message confirming that you have been unsubscribed. You will no longer receive text messages from us unless you re-opt-in. If you experience issues opting out, contact us at <a href="mailto:ethan@voxaris.io" className="text-foreground underline">ethan@voxaris.io</a> or call <a href="tel:+14077594100" className="text-foreground underline">(407) 759-4100</a>.
              </p>

              <h3 className="text-base font-semibold text-foreground mt-6">3.4 Costs</h3>
              <p>
                <strong className="text-foreground">Message and data rates may apply.</strong> Voxaris does not charge for text messages, but your mobile carrier's standard messaging rates may apply. Check with your carrier for details about your plan.
              </p>

              <h3 className="text-base font-semibold text-foreground mt-6">3.5 Carrier Disclaimer</h3>
              <p>
                Carriers are not liable for delayed or undelivered messages. T-Mobile is not liable for delayed or undelivered messages. Voxaris and mobile carriers are not responsible for messages that are not received due to factors outside of our control, including issues with your device, carrier service disruptions, or changes to your phone number.
              </p>

              <h3 className="text-base font-semibold text-foreground mt-6">3.6 Help</h3>
              <p>
                For help with our text messaging program, reply HELP to any message or contact us at <a href="mailto:ethan@voxaris.io" className="text-foreground underline">ethan@voxaris.io</a> or <a href="tel:+14077594100" className="text-foreground underline">(407) 759-4100</a>.
              </p>

              <h3 className="text-base font-semibold text-foreground mt-6">3.7 No Sharing of Phone Numbers</h3>
              <p>
                <strong className="text-foreground">We do not share, sell, or provide your phone number or opt-in consent to any third parties or affiliates for their own marketing purposes.</strong> Your phone number is used solely by Voxaris to communicate with you regarding the services and information you have requested.
              </p>

              {/* ── 4. AI Voice Calls & Automated Communications ── */}
              <h2 className="text-xl font-semibold text-foreground mt-10">4. AI Voice Calls & Automated Communications</h2>
              <p>
                Voxaris uses AI-powered voice agents to handle inbound and outbound phone calls. By calling our phone number, requesting a callback, or providing your phone number with consent to be contacted, you acknowledge and agree that:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>You may interact with an AI voice agent rather than a human representative</li>
                <li>Calls may be recorded and transcribed for quality assurance and service delivery</li>
                <li>Call data (recordings, transcripts, metadata) will be stored and processed as described in this policy</li>
                <li>You may request to speak with a human representative at any time during an AI call</li>
              </ul>
              <p>
                For outbound calls, we will only contact you if you have provided your phone number and given prior express consent for us to do so. You may revoke consent for outbound calls at any time by contacting us at <a href="mailto:ethan@voxaris.io" className="text-foreground underline">ethan@voxaris.io</a> or by informing our AI agent during a call.
              </p>

              {/* ── 5. Legal Basis & Consent (TCPA) ── */}
              <h2 className="text-xl font-semibold text-foreground mt-10">5. Legal Basis & Consent (TCPA)</h2>
              <p>
                In compliance with the Telephone Consumer Protection Act (TCPA) and applicable state telemarketing laws:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>We obtain prior express consent before sending transactional text messages</li>
                <li>We obtain prior express written consent before sending promotional or marketing text messages</li>
                <li>We obtain consent before placing automated or AI-generated calls to your phone</li>
                <li>Consent to receive communications is not required as a condition of purchasing any goods or services</li>
                <li>You may revoke consent at any time by replying STOP, contacting us by email, or informing an agent during a call</li>
              </ul>

              {/* ── 6. How We Share Your Information ── */}
              <h2 className="text-xl font-semibold text-foreground mt-10">6. How We Share Your Information</h2>
              <p>We may share your information with:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong className="text-foreground">Service Providers:</strong> Third-party vendors who assist us in operating our platform, including voice processing providers, CRM systems, email delivery services, and hosting providers. These providers are contractually bound to use your information only for the purposes of providing services to us.</li>
                <li><strong className="text-foreground">Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction.</li>
                <li><strong className="text-foreground">Legal Requirements:</strong> When required by law, regulation, legal process, or governmental request.</li>
                <li><strong className="text-foreground">Protection of Rights:</strong> To protect the rights, property, or safety of Voxaris, our users, or others.</li>
              </ul>
              <p><strong className="text-foreground">We do not sell your personal information. We do not share your phone number or SMS opt-in data with third parties for their marketing purposes.</strong></p>

              {/* ── 7. Cookies & Tracking Technologies ── */}
              <h2 className="text-xl font-semibold text-foreground mt-10">7. Cookies & Tracking Technologies</h2>
              <p>
                We use essential cookies to maintain site functionality. We may also use analytics cookies to understand how visitors use our website. You can control cookie preferences through your browser settings. Disabling cookies may affect certain features of the website.
              </p>
              <p>We do not use cookies for cross-site behavioral advertising.</p>

              {/* ── 8. Data Retention ── */}
              <h2 className="text-xl font-semibold text-foreground mt-10">8. Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to fulfill the purposes described in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. Specifically:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong className="text-foreground">Contact and form data:</strong> Retained for the duration of your business relationship with us plus 3 years, or until you request deletion</li>
                <li><strong className="text-foreground">Call recordings and transcripts:</strong> Retained for up to 2 years for quality assurance and compliance purposes</li>
                <li><strong className="text-foreground">SMS consent records:</strong> Retained for 5 years after your last interaction or consent revocation for compliance documentation</li>
                <li><strong className="text-foreground">Website analytics data:</strong> Retained in anonymized/aggregated form indefinitely</li>
              </ul>
              <p>You may request deletion of your personal data at any time (see Section 9).</p>

              {/* ── 9. Your Rights ── */}
              <h2 className="text-xl font-semibold text-foreground mt-10">9. Your Rights</h2>
              <p>Depending on your jurisdiction, you may have the following rights regarding your personal information:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong className="text-foreground">Access:</strong> Request a copy of the personal data we hold about you</li>
                <li><strong className="text-foreground">Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong className="text-foreground">Deletion:</strong> Request deletion of your personal data, subject to legal retention requirements</li>
                <li><strong className="text-foreground">Opt-Out of Communications:</strong> Unsubscribe from marketing emails or text messages at any time</li>
                <li><strong className="text-foreground">Revoke Consent:</strong> Withdraw consent for data processing where consent is the legal basis</li>
                <li><strong className="text-foreground">Do Not Sell:</strong> We do not sell personal information; however, you may still submit a "Do Not Sell" request for our records</li>
              </ul>
              <p>
                To exercise any of these rights, contact us at <a href="mailto:ethan@voxaris.io" className="text-foreground underline">ethan@voxaris.io</a>. We will respond to your request within 30 days.
              </p>

              {/* ── 10. California Residents (CCPA) ── */}
              <h2 className="text-xl font-semibold text-foreground mt-10">10. California Residents (CCPA/CPRA)</h2>
              <p>
                If you are a California resident, the California Consumer Privacy Act (CCPA) as amended by the California Privacy Rights Act (CPRA) provides you with additional rights:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong className="text-foreground">Right to Know:</strong> You have the right to request that we disclose the categories and specific pieces of personal information we have collected about you</li>
                <li><strong className="text-foreground">Right to Delete:</strong> You have the right to request deletion of your personal information, subject to certain exceptions</li>
                <li><strong className="text-foreground">Right to Correct:</strong> You have the right to request that we correct inaccurate personal information</li>
                <li><strong className="text-foreground">Right to Non-Discrimination:</strong> We will not discriminate against you for exercising your CCPA rights</li>
                <li><strong className="text-foreground">No Sale of Personal Information:</strong> We do not sell personal information as defined by the CCPA</li>
                <li><strong className="text-foreground">No Sharing for Cross-Context Behavioral Advertising:</strong> We do not share personal information for cross-context behavioral advertising</li>
              </ul>
              <p>To submit a CCPA request, contact us at <a href="mailto:ethan@voxaris.io" className="text-foreground underline">ethan@voxaris.io</a> with the subject line "CCPA Request."</p>

              {/* ── 11. Data Security ── */}
              <h2 className="text-xl font-semibold text-foreground mt-10">11. Data Security</h2>
              <p>
                We implement industry-standard administrative, technical, and physical security measures to protect your personal information, including:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Encryption of data in transit using TLS/SSL</li>
                <li>Encryption of sensitive data at rest</li>
                <li>Access controls and authentication for internal systems</li>
                <li>Regular security reviews and vulnerability assessments</li>
                <li>Employee training on data privacy and security</li>
              </ul>
              <p>
                While we strive to protect your information, no method of electronic transmission or storage is 100% secure. If you have reason to believe your interaction with us is no longer secure, please contact us immediately.
              </p>

              {/* ── 12. Children's Privacy ── */}
              <h2 className="text-xl font-semibold text-foreground mt-10">12. Children's Privacy</h2>
              <p>
                Our services are intended for business use and are not directed to individuals under the age of 18. We do not knowingly collect personal information from children under 18. If we learn that we have inadvertently collected information from a child under 18, we will promptly delete it. If you believe a child has provided us with personal information, please contact us at <a href="mailto:ethan@voxaris.io" className="text-foreground underline">ethan@voxaris.io</a>.
              </p>

              {/* ── 13. Third-Party Links ── */}
              <h2 className="text-xl font-semibold text-foreground mt-10">13. Third-Party Links</h2>
              <p>
                Our website may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to review the privacy policies of any third-party site you visit.
              </p>

              {/* ── 14. Changes to This Policy ── */}
              <h2 className="text-xl font-semibold text-foreground mt-10">14. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. When we do, we will revise the "Last updated" date at the top of this page. If we make material changes, we will provide notice on our website or by other means as required by law. Your continued use of our services after any changes indicates your acceptance of the updated policy.
              </p>

              {/* ── 15. Contact Us ── */}
              <h2 className="text-xl font-semibold text-foreground mt-10">15. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, your data, or your rights, contact us at:
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
