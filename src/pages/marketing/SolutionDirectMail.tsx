import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, User, BarChart3, Database, TrendingUp, Zap, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar, Footer } from '@/components/marketing';

const stats = [
  { value: '8–30%', label: 'Response rate vs. 1–2% industry standard' },
  { value: '10–15x', label: 'Higher engagement than static mail' },
  { value: 'Full attribution', label: 'From scan to appointment — every touchpoint tracked' },
];

export function SolutionDirectMail() {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>AI Talking Postcards with Video QR | Voxaris</title>
        <meta name="description" content="Send physical postcards with QR that launch personalized photorealistic AI video conversations. Higher response rates, instant leads. 8-30% vs 1-2% industry standard." />
        <meta name="keywords" content="talking postcards ai, ai video postcard, interactive video direct mail, qr code ai video postcard, talking postcard marketing, ai powered direct mail, personalized ai video mailer, qr talking postcard, direct mail with ai video, ai video direct mail campaign, interactive postcard qr ai, ai qr postcard lead generation" />
        <link rel="canonical" href="https://voxaris.io/solutions/direct-mail" />
        <meta property="og:title" content="AI Talking Postcards with Video QR | Voxaris" />
        <meta property="og:description" content="Send physical postcards with QR that launch personalized photorealistic AI video conversations. Higher response rates, instant leads." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://voxaris.io/solutions/direct-mail" />
        <meta property="og:image" content="https://voxaris.io/og-image.png" />
        <meta name="twitter:image" content="https://voxaris.io/og-image.png" />      </Helmet>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-28 pb-20 overflow-hidden bg-carbon-50">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-carbon-200 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-[11px] font-semibold text-carbon-500 uppercase tracking-[0.15em]">Direct Mail Companies</span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-carbon-900 mb-6 font-display leading-[1.05]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Your mailer just got{' '}
            <span className="text-carbon-400">a face and a voice.</span>
          </motion.h1>

          <motion.p
            className="max-w-2xl mx-auto text-lg text-carbon-400 mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Turn static direct mail into live AI-powered conversations that qualify leads, answer questions, and book appointments — the moment a prospect picks up your mail piece.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link to="/book-demo">
              <Button size="lg" className="bg-carbon-900 hover:bg-carbon-800 text-white px-8 h-12 rounded-full font-medium group">
                Book a Demo
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Hero Image */}
      <section className="relative">
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="aspect-[21/9] rounded-2xl overflow-hidden shadow-elevated">
            <img
              src="/direct-mail-hero.png"
              alt="Person scanning a Talking Postcard QR code with their phone"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </section>

      {/* The Problem */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[11px] font-semibold text-carbon-400 uppercase tracking-[0.2em] mb-4 block">The Reality</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-carbon-900 mb-8 font-display">
              1–2% response rates aren't a strategy. They're a tax.
            </h2>
          </motion.div>

          <motion.div
            className="space-y-6 text-[16px] text-carbon-500 leading-[1.8]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <p>
              Direct mail still works. But it works the same way it did in 1995 — print, send, hope. The vast majority of your mailers get glanced at and discarded. The ones that do land? They drive people to a static landing page or a phone number no one answers after 5 PM.
            </p>
            <p>
              Your clients are spending <strong className="text-carbon-900">$0.50–$2.00 per piece</strong> and getting a 1–2% response rate. They're asking harder questions about ROI. They're shifting budget to digital. And the mail houses that can't prove measurable engagement are getting replaced.
            </p>
            <p>
              The problem isn't the mail. It's what happens after someone picks it up.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Solution */}
      <section className="py-20 bg-carbon-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[11px] font-semibold text-carbon-400 uppercase tracking-[0.2em] mb-4 block">What Voxaris Does</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-carbon-900 mb-6 font-display">
              Every mail piece becomes a conversation.
            </h2>
            <p className="max-w-3xl text-[16px] text-carbon-500 leading-[1.8]">
              Voxaris Talking Postcards embed a QR code on your client's mailer that launches an AI-powered video agent — personalized to the recipient, trained on the offer, and capable of qualifying leads and booking appointments in real time.
            </p>
            <p className="max-w-3xl text-[16px] text-carbon-500 leading-[1.8] mt-4">
              This isn't a link to a landing page. It's a face-to-face conversation with an AI agent who knows the prospect's name, understands the promotion, and can answer questions on the spot.
            </p>
          </motion.div>

          <div className="grid gap-4">
            {/* Personalized AI Video Agent */}
            <motion.div
              className="p-8 rounded-2xl bg-white border border-carbon-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-carbon-900 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-carbon-900">Personalized AI Video Agent</h3>
              </div>
              <p className="text-carbon-500 text-[15px] leading-[1.8]">
                Each prospect scans and meets an agent who greets them by name, references the specific offer, and walks them through next steps. Dynamic name insertion, context-aware dialogue, and a trackable interaction from first scan to booked appointment.
              </p>
            </motion.div>

            {/* Engagement Analytics */}
            <motion.div
              className="p-8 rounded-2xl bg-white border border-carbon-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-carbon-900 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-carbon-900">Engagement Analytics</h3>
              </div>
              <p className="text-carbon-500 text-[15px] leading-[1.8]">
                See exactly who scanned, how long they engaged, what questions they asked, and whether they converted. Give your clients the attribution data they've never had from direct mail.
              </p>
            </motion.div>

            {/* CRM Integration */}
            <motion.div
              className="p-8 rounded-2xl bg-white border border-carbon-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.16 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-carbon-900 flex items-center justify-center">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-carbon-900">CRM Integration</h3>
              </div>
              <p className="text-carbon-500 text-[15px] leading-[1.8]">
                Every interaction syncs directly to your client's CRM — contact info, qualification data, and conversation summary. No manual entry. No lost leads.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Opportunity */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[11px] font-semibold text-carbon-400 uppercase tracking-[0.2em] mb-4 block">The Pitch to Your Clients</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-carbon-900 mb-8 font-display">
              You're not selling postcards anymore. You're selling conversations.
            </h2>
          </motion.div>

          <motion.div
            className="space-y-6 text-[16px] text-carbon-500 leading-[1.8]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <p>
              This is how you differentiate. While every other mail house is competing on paper weight and postage rates, you're offering something nobody else can: <strong className="text-carbon-900">a mailer that talks back.</strong>
            </p>
            <p>
              Offer Voxaris-powered Talking Postcards as a premium tier. Charge more. Deliver dramatically better results. And give your clients something they can't get anywhere else — measurable, interactive, AI-driven outreach that turns a piece of paper into a qualified lead.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats + CTA */}
      <section className="py-20 bg-carbon-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-4 mb-16">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="p-6 rounded-2xl bg-white/5 border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-3xl font-bold text-white mb-2 font-display">{stat.value}</div>
                <p className="text-white/40 text-[13px] leading-relaxed">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Final CTA */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-white/50 text-[16px] leading-[1.8] mb-8 max-w-2xl mx-auto">
              Give your mail a voice. Book a demo and we'll show you a live Talking Postcard in action — personalized, interactive, and ready to white-label for your clients.
            </p>
            <Link to="/book-demo">
              <Button size="lg" className="bg-white hover:bg-white/90 text-carbon-900 px-10 h-14 rounded-full font-semibold group shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                Book a Demo
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
