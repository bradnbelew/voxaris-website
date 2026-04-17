import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, User, BarChart3, Database, Mail, QrCode, Play } from 'lucide-react';
import { Navbar, Footer } from '@/components/marketing';

const stats = [
  { value: '8–30%', label: 'Response rate vs. 1–2% industry standard' },
  { value: '10–15×', label: 'Higher engagement than static mail' },
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
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-carbon-200 mb-8"
            style={{ borderRadius: '3px' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-[11px] font-semibold text-carbon-500 uppercase tracking-[0.15em]">Direct Mail Companies</span>
          </motion.div>

          <motion.h1
            className="font-editorial text-carbon-900 mb-6 leading-[1.02]"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', letterSpacing: '-0.025em' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Your mailer just got{' '}
            <em className="text-carbon-400" style={{ fontStyle: 'italic' }}>a face and a voice.</em>
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
              <button
                className="bg-carbon-900 hover:bg-carbon-800 text-white px-8 h-12 font-medium text-[14px] group inline-flex items-center transition-all duration-200 hover:-translate-y-0.5"
                style={{ borderRadius: '4px' }}
              >
                Book a Demo
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Hero Visual — clean designed mockup (replaces crunchy stock image) */}
      <section className="relative">
        <motion.div
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div
            className="relative overflow-hidden bg-gradient-to-br from-carbon-100 via-white to-carbon-100 border border-carbon-200/80"
            style={{
              borderRadius: '8px',
              boxShadow: '0 30px 80px -20px rgba(0,0,0,0.15), 0 10px 30px -10px rgba(0,0,0,0.08)',
              aspectRatio: '21 / 9',
            }}
          >
            {/* Subtle grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.035]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(0,0,0,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.6) 1px, transparent 1px)',
                backgroundSize: '48px 48px',
              }}
            />

            {/* Stage */}
            <div className="absolute inset-0 flex items-center justify-center px-6 sm:px-10">
              <div className="flex items-center gap-6 sm:gap-10 lg:gap-16 w-full max-w-4xl justify-center">
                {/* Postcard */}
                <motion.div
                  className="relative shrink-0 bg-white border border-carbon-200"
                  style={{
                    width: 'clamp(180px, 34%, 340px)',
                    aspectRatio: '7 / 5',
                    borderRadius: '6px',
                    boxShadow: '0 20px 40px -12px rgba(0,0,0,0.18), 0 4px 12px -4px rgba(0,0,0,0.08)',
                    transform: 'rotate(-4deg)',
                  }}
                  initial={{ opacity: 0, x: -30, rotate: -10 }}
                  animate={{ opacity: 1, x: 0, rotate: -4 }}
                  transition={{ delay: 0.55, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Postcard header bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500" />

                  <div className="p-4 sm:p-5 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-auto">
                      <div>
                        <div className="text-[8px] sm:text-[9px] font-mono text-carbon-400 uppercase tracking-[0.2em] mb-1">
                          Exclusive Offer
                        </div>
                        <div className="font-editorial text-carbon-900" style={{ fontSize: 'clamp(14px, 2vw, 22px)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                          Hi, <em style={{ fontStyle: 'italic' }}>Michael</em>.
                        </div>
                        <div className="text-[9px] sm:text-[10px] text-carbon-500 mt-1 leading-snug">
                          Your 2019 Silverado is worth more than you think.
                        </div>
                      </div>
                      <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-carbon-300 shrink-0" strokeWidth={1.5} />
                    </div>

                    {/* QR + scan cue */}
                    <div className="flex items-end justify-between gap-2 mt-3">
                      <div className="text-[8px] sm:text-[9px] text-carbon-400 leading-tight">
                        Scan to meet<br />
                        <span className="text-carbon-700 font-medium">your AI agent →</span>
                      </div>
                      <div className="bg-carbon-900 p-1.5 sm:p-2" style={{ borderRadius: '3px' }}>
                        <QrCode className="w-8 h-8 sm:w-10 sm:h-10 text-white" strokeWidth={1} />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Arrow */}
                <motion.div
                  className="hidden sm:flex flex-col items-center gap-1.5 shrink-0"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9, duration: 0.4 }}
                >
                  <div className="text-[9px] font-mono text-carbon-400 uppercase tracking-[0.2em]">Scan</div>
                  <ArrowRight className="w-4 h-4 text-carbon-500" strokeWidth={1.5} />
                </motion.div>

                {/* Phone with AI agent */}
                <motion.div
                  className="relative shrink-0 bg-carbon-900 p-2"
                  style={{
                    width: 'clamp(130px, 22%, 200px)',
                    aspectRatio: '9 / 19',
                    borderRadius: '22px',
                    boxShadow: '0 30px 60px -12px rgba(0,0,0,0.35), 0 8px 20px -4px rgba(0,0,0,0.15), inset 0 0 0 2px rgba(255,255,255,0.04)',
                    transform: 'rotate(3deg)',
                  }}
                  initial={{ opacity: 0, x: 30, rotate: 10 }}
                  animate={{ opacity: 1, x: 0, rotate: 3 }}
                  transition={{ delay: 0.75, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Screen */}
                  <div
                    className="relative overflow-hidden bg-gradient-to-b from-[#1a1410] via-[#2a1f14] to-[#1a1410] h-full"
                    style={{ borderRadius: '14px' }}
                  >
                    {/* Notch */}
                    <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-10 h-3 bg-black" style={{ borderRadius: '6px' }} />

                    {/* AI agent placeholder (gradient face) */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full"
                        style={{
                          background: 'radial-gradient(circle at 40% 35%, #f1c578 0%, #d4a843 35%, #8b6a2a 70%, #3a2d15 100%)',
                          boxShadow: '0 0 40px rgba(212,168,67,0.35), inset 0 -8px 20px rgba(0,0,0,0.3)',
                        }}
                      />
                    </div>

                    {/* Live indicator */}
                    <div className="absolute top-6 left-2.5 flex items-center gap-1.5">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400/60" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                      </span>
                      <span className="text-[7px] font-mono text-white/70 uppercase tracking-wider">Live</span>
                    </div>

                    {/* Bottom caption bar */}
                    <div
                      className="absolute bottom-2 left-2 right-2 bg-white/8 backdrop-blur-md p-2"
                      style={{ borderRadius: '6px', background: 'rgba(255,255,255,0.08)' }}
                    >
                      <div className="text-[8px] text-white/90 leading-tight">
                        "Hi Michael — got a minute to look at your Silverado?"
                      </div>
                      <div className="flex items-center gap-1 mt-1.5">
                        <Play className="w-2 h-2 text-gold-400" fill="currentColor" strokeWidth={0} />
                        <div className="flex-1 h-0.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full w-1/3 bg-gold-400 rounded-full" />
                        </div>
                        <span className="text-[7px] font-mono text-white/50">0:08</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Corner label */}
            <div className="absolute bottom-3 right-4 text-[10px] font-mono text-carbon-400 uppercase tracking-[0.2em]">
              Scan → Conversation
            </div>
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
              Your clients are sending more, spending more, and getting a <strong className="text-carbon-900">1–2% response rate</strong>. They're asking harder questions about ROI. They're shifting budget to digital. And the mail houses that can't prove measurable engagement are getting replaced.
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
              className="p-8 rounded-md bg-white border border-carbon-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-md bg-carbon-900 flex items-center justify-center">
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
              className="p-8 rounded-md bg-white border border-carbon-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-md bg-carbon-900 flex items-center justify-center">
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
              className="p-8 rounded-md bg-white border border-carbon-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.16 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-md bg-carbon-900 flex items-center justify-center">
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
                className="p-6 rounded-md bg-white/5 border border-white/10"
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
              <button
                className="bg-white hover:bg-neutral-100 text-carbon-900 px-10 h-14 font-medium text-[15px] group inline-flex items-center transition-all duration-200 hover:-translate-y-0.5"
                style={{ borderRadius: '4px', boxShadow: '0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.6)' }}
              >
                Book a Demo
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
