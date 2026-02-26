import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Video, Phone, Mail, Building2, Users, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar, Footer } from '@/components/marketing';

const stats = [
  { value: '< 3s', label: 'Average visitor engagement time' },
  { value: '24/7/365', label: 'Concierge coverage — nights, weekends, holidays' },
  { value: '100%', label: 'Every inquiry answered, every booking assisted' },
];

const audienceItems = [
  {
    icon: Building2,
    title: 'Resort & Hotel GMs',
    description: 'who want to increase direct bookings and reduce OTA dependency.',
  },
  {
    icon: Users,
    title: 'Sales & Marketing Directors',
    description: 'looking to increase direct bookings and drive repeat guest engagement at scale.',
  },
  {
    icon: Clock,
    title: 'Revenue Managers',
    description: 'who know that after-hours website visitors convert at a fraction of the rate they should.',
  },
  {
    icon: Sparkles,
    title: 'Guest Experience Directors',
    description: 'who want every digital touchpoint to feel as personal as the front desk.',
  },
];

export function SolutionHospitality() {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>AI Concierge for Hotels & Resorts | Voxaris</title>
        <meta name="description" content="Voxaris AI concierge agents greet every website visitor, answer questions in real time, and book direct stays — 24/7. Video, voice, and browser-guided booking for hospitality." />
        <meta name="keywords" content="hotel AI concierge, AI booking agent, hospitality AI, resort AI agent, direct booking AI, hotel website engagement, V·GUIDE hospitality" />
        <link rel="canonical" href="https://voxaris.io/solutions/hospitality" />
        <meta property="og:title" content="AI Concierge for Hotels & Resorts | Voxaris" />
        <meta property="og:description" content="A photorealistic AI concierge that greets every website visitor, walks them through availability, and books direct stays — 24/7." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://voxaris.io/solutions/hospitality" />
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
            <span className="text-[11px] font-semibold text-carbon-500 uppercase tracking-[0.15em]">Hotels & Resorts</span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-carbon-900 mb-6 font-display leading-[1.05]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Your website has visitors.{' '}
            <span className="text-carbon-400">Where's the concierge?</span>
          </motion.h1>

          <motion.p
            className="max-w-2xl mx-auto text-lg text-carbon-400 mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            An AI concierge that greets every visitor, answers questions in real time, walks them through availability, and books direct stays — before they bounce to an OTA.
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
              Your best rooms are booking through OTAs at 20% commission.
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
              Guests visit your website looking to book direct. They browse room types, check dates, maybe look at amenities — then leave because they had a question no one was there to answer.
            </p>
            <p>
              Your front desk is handling check-ins. Your reservations team clocks out at 6 PM. And <strong className="text-carbon-900">70% of your website traffic comes outside business hours</strong>. Those visitors end up on Expedia or Booking.com, and you pay the commission.
            </p>
            <p>
              It's not that your property isn't compelling. It's that your website can't have a conversation.
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
              A 24/7 concierge that lives on your website.
            </h2>
            <p className="max-w-3xl text-[16px] text-carbon-500 leading-[1.8]">
              Voxaris deploys a photorealistic AI concierge that greets visitors, answers property questions, walks them through room options, and guides them through the booking flow — with video, voice, and visible browser control.
            </p>
          </motion.div>

          <div className="grid gap-4">
            {/* V·GUIDE */}
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
                  <span className="text-[10px] font-semibold text-carbon-400 uppercase tracking-[0.15em]">V·GUIDE</span>
                  <h3 className="text-lg font-bold text-carbon-900">Video AI + Browser Control</h3>
                </div>
              </div>
              <p className="text-carbon-500 text-[15px] leading-[1.8]">
                A photorealistic AI concierge that appears on your website, visibly scrolls to relevant sections, filters room types, walks guests through amenities, and guides them through the booking form — all while having a natural conversation. It's not a chatbot. It's the digital front desk.
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
                Inbound and outbound voice agents that handle reservation inquiries, confirm bookings, manage cancellations, and follow up with past guests. Sub-1-second response time. Available around the clock — no hold music, no voicemail, no missed calls.
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
                Re-engage past guests with personalized video mailers. Recipients scan a QR code and meet an AI concierge who remembers their last stay, knows the current offer, and can book their next visit on the spot.
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
              Properties that want every visitor to feel welcomed.
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
            <span className="text-[11px] font-semibold text-white/30 uppercase tracking-[0.2em] mb-4 block">The Impact</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 font-display">
              What this looks like for your property.
            </h2>
            <p className="max-w-3xl text-[16px] text-white/50 leading-[1.8]">
              Properties using Voxaris engage every website visitor instantly — day or night. That means more direct bookings, fewer OTA commissions, and a guest experience that starts before they even arrive.
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
              See it in action. Book a 15-minute demo and we'll show you exactly how Voxaris would work on your property's website — with your rooms, your brand, and your booking flow.
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
