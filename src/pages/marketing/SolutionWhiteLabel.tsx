import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Video, Phone, Palette, Building2, Layers, Lock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar, Footer } from '@/components/marketing';

const stats = [
  { value: 'Your Brand', label: 'Your logo, your domain, your colors — we disappear completely' },
  { value: 'Full Stack', label: 'Voice, video, browser control, and outreach — all included' },
  { value: 'Days', label: 'From signed agreement to live deployment' },
];

const audienceItems = [
  {
    icon: Building2,
    title: 'Marketing Agencies',
    description: 'who want to offer AI voice and video agents as a premium service to their existing client base.',
  },
  {
    icon: Layers,
    title: 'SaaS Platforms',
    description: 'looking to embed conversational AI into their product without building from scratch.',
  },
  {
    icon: Lock,
    title: 'BPO & Call Centers',
    description: 'who need to scale agent capacity without scaling headcount.',
  },
  {
    icon: Zap,
    title: 'Industry Consultants',
    description: 'who serve dealerships, hospitality, or home services and want a tech moat their competitors don\'t have.',
  },
];

export function SolutionWhiteLabel() {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>White Label AI Video & Voice Agents | Voxaris</title>
        <meta name="description" content="Resell Voxaris under your brand: photorealistic V·GUIDE video agents + voice. Full white-label, margins up to 70%, white-glove support." />
        <meta name="keywords" content="white label ai voice agents, white label ai video agent, resell ai agents saas, white label ai concierge, agency white label ai platform, reseller ai video agents, white label photorealistic ai, saas white label ai agents, white label talking postcards, ai agent reseller program, white label browser ai agent, agency ai resell platform" />
        <link rel="canonical" href="https://voxaris.io/solutions/white-label" />
        <meta property="og:title" content="White Label AI Video & Voice Agents | Voxaris" />
        <meta property="og:description" content="Resell Voxaris under your brand: photorealistic V·GUIDE video agents + voice. Full white-label, margins up to 70%." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://voxaris.io/solutions/white-label" />
        <meta property="og:image" content="https://voxaris.io/og-image.png" />
        <meta name="twitter:image" content="https://voxaris.io/og-image.png" />      </Helmet>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-carbon-50">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-carbon-200 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-[11px] font-semibold text-carbon-500 uppercase tracking-[0.15em]">White Label</span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-carbon-900 mb-6 font-display leading-[1.05]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Your brand.{' '}
            <span className="text-carbon-400">Our AI engine.</span>
          </motion.h1>

          <motion.p
            className="max-w-2xl mx-auto text-lg text-carbon-400 mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Deploy the full VoxEngine platform — voice agents, video agents, browser control, and Talking Postcards — under your own brand. We build the engine. You own the relationship.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link to="/book-demo">
              <Button size="lg" className="bg-carbon-900 hover:bg-carbon-800 text-white px-8 h-12 rounded-full font-medium group">
                Partner With Us
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </motion.div>
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
            <span className="text-[11px] font-semibold text-carbon-400 uppercase tracking-[0.2em] mb-4 block">The Opportunity</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-carbon-900 mb-8 font-display">
              AI agents are the next must-have service. Don't build it — brand it.
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
              Your clients are asking for AI. Every agency, every platform, every consultant is hearing the same thing: <strong className="text-carbon-900">"Can you do AI for us?"</strong>
            </p>
            <p>
              Building conversational AI from scratch takes years and millions. Stitching together APIs yourself means you're the one debugging at 2 AM when the voice agent breaks. And your clients don't care how the sausage is made — they want it to work.
            </p>
            <p>
              Voxaris White Label gives you the <strong className="text-carbon-900">entire VoxEngine stack</strong> — voice, video, V·GUIDE browser control, V·MEMORY, Talking Postcards — deployed under your brand, on your domain, with your pricing. We handle the infrastructure. You handle the client.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-20 bg-carbon-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[11px] font-semibold text-carbon-400 uppercase tracking-[0.2em] mb-4 block">What You Get</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-carbon-900 mb-6 font-display">
              The full platform. Zero Voxaris branding.
            </h2>
            <p className="max-w-3xl text-[16px] text-carbon-500 leading-[1.8]">
              Everything we offer — every product, every feature, every integration — available under your brand identity.
            </p>
          </motion.div>

          <div className="grid gap-4">
            {/* Voice */}
            <motion.div
              className="p-8 rounded-2xl bg-white border border-carbon-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-carbon-900 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-carbon-900">Voice Agents</h3>
                </div>
              </div>
              <p className="text-carbon-500 text-[15px] leading-[1.8]">
                Inbound and outbound AI calling with human-quality voices. Customizable per client — scripts, personas, qualification flows, CRM integrations. Deploy one or deploy hundreds.
              </p>
            </motion.div>

            {/* Video */}
            <motion.div
              className="p-8 rounded-2xl bg-white border border-carbon-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-carbon-900 flex items-center justify-center">
                  <Video className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-carbon-900">Video Agents + V·GUIDE</h3>
                </div>
              </div>
              <p className="text-carbon-500 text-[15px] leading-[1.8]">
                Photorealistic AI video agents that deploy on any website with a single script tag. V·GUIDE visible browser control — scrolling, clicking, form filling — all in real time while talking to the visitor. Your client's brand, your client's site, your client's concierge.
              </p>
            </motion.div>

            {/* White Label Details */}
            <motion.div
              className="p-8 rounded-2xl bg-white border border-carbon-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.16 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-carbon-900 flex items-center justify-center">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-carbon-900">Full Brand Control</h3>
                </div>
              </div>
              <p className="text-carbon-500 text-[15px] leading-[1.8]">
                Your logo. Your domain. Your color scheme. Your dashboards. Your client never sees Voxaris. You set your own pricing, manage your own onboarding, and own the entire client relationship. We're the engine room — invisible by design.
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
              Partners who want a tech moat, not a tech project.
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

      {/* CTA */}
      <section className="py-20 bg-carbon-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[11px] font-semibold text-white/30 uppercase tracking-[0.2em] mb-4 block">The Model</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 font-display">
              Simple economics. Big margins.
            </h2>
            <p className="max-w-3xl text-[16px] text-white/50 leading-[1.8]">
              You pay wholesale. You charge what you want. We handle the AI infrastructure, the updates, the scaling, and the support engineering. You handle the client relationship and keep the margin.
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
                <div className="text-2xl font-bold text-white mb-2 font-display">{stat.value}</div>
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
              Let's talk. We'll walk you through the platform, show you a live white-label deployment, and discuss how it fits your business model.
            </p>
            <Link to="/book-demo">
              <Button size="lg" className="bg-white hover:bg-white/90 text-carbon-900 px-10 h-14 rounded-full font-semibold group shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                Schedule a Partner Call
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
