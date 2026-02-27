import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Video, Phone, Mail, Building2, Users, Clock, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar, Footer } from '@/components/marketing';

const stats = [
  { value: '< 60s', label: 'Average lead response time' },
  { value: '24/7/365', label: 'Coverage with zero additional headcount' },
  { value: '100%', label: 'Lead engagement rate — no inquiry goes unanswered' },
];

const audienceItems = [
  {
    icon: Building2,
    title: 'Dealer Principals & GMs',
    description: 'who need to reduce BDC overhead while increasing appointment volume.',
  },
  {
    icon: Phone,
    title: 'BDC Managers',
    description: 'drowning in lead volume and watching after-hours inquiries die on the vine.',
  },
  {
    icon: Target,
    title: 'Internet Sales Managers',
    description: 'who know their speed-to-lead is the difference between a sold unit and a lost opportunity.',
  },
  {
    icon: Clock,
    title: 'Fixed Ops Directors',
    description: 'looking to automate service appointment booking and recall follow-up at scale.',
  },
];

export function SolutionDealerships() {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>AI BDC Agents for Car Dealerships | Voxaris</title>
        <meta name="description" content="V·GUIDE + V·SENSE: Photorealistic video + voice AI BDC agents that control your site, book test drives, qualify leads 24/7. Podium/Kenect alternative. \u2014 24/7. Recover missed leads with V\u00b7GUIDE video and voice AI." />
        <meta name="keywords" content="ai bdc dealership, ai voice agent car dealership, podium alternative dealership, kenect alternative dealership, ai appointment setter dealership, dealership ai video agent, ai test drive booking agent, ai lead qualification dealership, dealersocket ai alternative, 24/7 ai for car dealership, ai bdc software dealership, ai phone agent auto dealer, interactive ai video dealership website, ai sales agent car dealership" />
        <link rel="canonical" href="https://voxaris.io/solutions/dealerships" />
        <meta property="og:title" content="AI BDC Agents for Car Dealerships | Voxaris" />
        <meta property="og:description" content="Photorealistic video + voice AI BDC agents that control your dealership site, book test drives, and qualify leads 24/7. Podium/Kenect alternative." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://voxaris.io/solutions/dealerships" />
      </Helmet>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-carbon-50">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-carbon-200 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-[11px] font-semibold text-carbon-500 uppercase tracking-[0.15em]">Auto Dealerships</span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-carbon-900 mb-6 font-display leading-[1.05]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Your leads aren't waiting.{' '}
            <span className="text-carbon-400">Why is your follow-up?</span>
          </motion.h1>

          <motion.p
            className="max-w-2xl mx-auto text-lg text-carbon-400 mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            AI sales agents that answer every inquiry, qualify every lead, and book every appointment — before your competition even picks up the phone.
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
              Speed kills. Slow response kills faster.
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
              The average dealership takes <strong className="text-carbon-900">2 hours and 42 minutes</strong> to respond to an internet lead. By then, your prospect has already submitted forms to three other dealers, taken a call from one, and mentally moved on.
            </p>
            <p>
              Your BDC team is expensive, inconsistent, and unavailable at 9 PM on a Saturday when half your leads come in. You know this. Your Google reviews confirm it — slow follow-up, missed calls, and prospects who felt forgotten.
            </p>
            <p>
              It's not a people problem. It's a capacity problem. And it's costing you <strong className="text-carbon-900">30–40% of your pipeline</strong> every month.
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
              An AI sales team that never clocks out.
            </h2>
            <p className="max-w-3xl text-[16px] text-carbon-500 leading-[1.8]">
              Voxaris deploys photorealistic video agents and human-quality voice agents that engage your leads the moment they raise their hand — on your website, over the phone, or through personalized outreach.
            </p>
          </motion.div>

          <div className="grid gap-4">
            {/* V·FACE */}
            <motion.div
              className="p-8 rounded-2xl bg-white border border-carbon-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-carbon-900 flex items-center justify-center">
                  <Video className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-carbon-400 uppercase tracking-[0.15em]">V·FACE</span>
                  <h3 className="text-lg font-bold text-carbon-900">Video AI</h3>
                </div>
              </div>
              <p className="text-carbon-500 text-[15px] leading-[1.8]">
                A photorealistic AI agent on your website that greets every visitor by name, walks them through inventory, answers questions in real time, and books appointments. It's not a chatbot. It's a face-to-face conversation.
              </p>
            </motion.div>

            {/* V·SENSE */}
            <motion.div
              className="p-8 rounded-2xl bg-white border border-carbon-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-carbon-900 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-carbon-400 uppercase tracking-[0.15em]">V·SENSE</span>
                  <h3 className="text-lg font-bold text-carbon-900">Voice AI</h3>
                </div>
              </div>
              <p className="text-carbon-500 text-[15px] leading-[1.8]">
                Inbound and outbound calling, 24/7. Qualifies leads using your exact process, handles objections, books showroom visits, and syncs every detail to your CRM. Sub-1-second response time. No hold music. No voicemail.
              </p>
            </motion.div>

            {/* Talking Postcards */}
            <motion.div
              className="p-8 rounded-2xl bg-white border border-carbon-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.16 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-carbon-900 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-carbon-400 uppercase tracking-[0.15em]">Talking Postcards</span>
                  <h3 className="text-lg font-bold text-carbon-900">Personalized Video Outreach</h3>
                </div>
              </div>
              <p className="text-carbon-500 text-[15px] leading-[1.8]">
                Turn your direct mail into a two-way conversation. Prospects scan a QR code and meet a personalized AI video agent who knows their name, their trade-in, and the offer you're running. Response rates of 8–30% vs. the industry standard 1–2%.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[11px] font-semibold text-carbon-400 uppercase tracking-[0.2em] mb-4 block">Built For</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-carbon-900 font-display">
              Dealerships that are tired of leaving money on the table.
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            {audienceItems.map((item, index) => (
              <motion.div
                key={item.title}
                className="flex gap-4 p-6 rounded-2xl bg-carbon-50 border border-carbon-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <div className="w-10 h-10 rounded-xl bg-carbon-900 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-carbon-900 mb-1">{item.title}</h3>
                  <p className="text-carbon-400 text-[14px] leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Results + Stats */}
      <section className="py-20 bg-carbon-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[11px] font-semibold text-white/30 uppercase tracking-[0.2em] mb-4 block">The Math</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 font-display">
              What this looks like in your store.
            </h2>
            <p className="max-w-3xl text-[16px] text-white/50 leading-[1.8]">
              Dealerships working with Voxaris are responding to 100% of leads in under 60 seconds — nights, weekends, and holidays included. That means more appointments set, more showroom traffic, and fewer leads leaked to the dealer down the road.
            </p>
          </motion.div>

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
              See it in action. Book a 15-minute demo and we'll show you exactly how Voxaris would work inside your dealership — with your process, your inventory, and your brand.
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
