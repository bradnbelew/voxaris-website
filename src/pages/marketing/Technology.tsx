import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Zap,
  Brain,
  Phone,
  Video,
  Mail,
  Database,
  Calendar,
  BarChart3,
  ChevronDown,
  MessageSquare,
  AudioLines,
  Clapperboard,
  HardDrive,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar, Footer } from '@/components/marketing';
import { useState } from 'react';

const speedStats = [
  { value: '< 1 second', label: 'End-to-end response time across voice and video' },
  { value: 'Zero hold time', label: 'Every call answered instantly — no queues, no waiting' },
  { value: 'Real-time', label: 'Lip sync, expression, and voice generated on the fly' },
];

const memoryFeatures = [
  {
    icon: UserCheck,
    title: 'Caller Recognition',
    description: 'Returning callers are identified by phone number and greeted by name — before they say a word.',
  },
  {
    icon: MessageSquare,
    title: 'Conversation Continuity',
    description: 'Past interactions are referenced in real time. Quotes, dates, concerns, preferences — all carried forward automatically.',
  },
  {
    icon: Database,
    title: 'Cross-Channel Persistence',
    description: "Memory isn't limited to phone calls. If a prospect engages with a video agent on your website and then calls your office, the context travels with them.",
  },
];

const integrationFeatures = [
  {
    icon: Database,
    title: 'CRM Auto-Sync',
    description: 'Contact records, qualification data, and conversation summaries pushed to your CRM the moment a call or interaction ends.',
  },
  {
    icon: Calendar,
    title: 'Calendar Integration',
    description: "Appointments booked by AI agents appear directly on your team's calendar with all relevant context attached.",
  },
  {
    icon: BarChart3,
    title: 'Transcript & Analytics',
    description: 'Full conversation transcripts, AI-generated summaries, and interaction analytics available in a live dashboard and synced to your CRM.',
  },
];

const technicalSections = [
  {
    icon: MessageSquare,
    title: 'Natural Language Understanding',
    body: 'VoxEngine processes intent, sentiment, and context simultaneously — not sequentially. The agent understands what a caller means, not just what they said. Industry-specific models are fine-tuned per vertical, so a hospitality caller asking about availability is handled differently than an auto shopper saying "I\'m looking at the new Civic."',
  },
  {
    icon: AudioLines,
    title: 'Speech Synthesis',
    body: 'Voice generation with natural cadence, filler words, and active listening cues. The agent says "mhm," "got it," and "let me check on that" in context — not on a timer. Voices are customizable per deployment and designed to match your brand personality.',
  },
  {
    icon: Clapperboard,
    title: 'Real-Time Video Rendering',
    body: "V·FACE agents are rendered in real time with synchronized lip movement, micro-expressions, and responsive eye contact. Video is generated on-the-fly based on the conversation — not pre-recorded clips stitched together. The result is a photorealistic face that reacts naturally to what the viewer says.",
  },
  {
    icon: HardDrive,
    title: 'Memory Architecture',
    body: 'V·MEMORY stores interaction context per contact across all channels and sessions. Data is structured, searchable, and automatically surfaced during subsequent interactions. Memory is scoped per business — your data is yours, isolated and secure.',
  },
  {
    icon: ShieldCheck,
    title: 'Guardrails & Safety',
    body: 'Every VoxEngine agent operates within configurable boundaries. Agents are trained on what they can and cannot say — no pricing commitments, no legal advice, no unauthorized promises. Human transfer is always available and triggered gracefully. Emergency scenarios are flagged and escalated automatically.',
  },
];

export function Technology() {
  const [expandedTech, setExpandedTech] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>VoxEngine AI Platform | Voice, Video & Browser Control | Voxaris</title>
        <meta name="description" content="VoxEngine powers every Voxaris agent — voice AI, video AI, V·GUIDE browser control, and V·MEMORY persistent context. Sub-1-second response time across every interaction." />
        <meta name="keywords" content="VoxEngine, AI platform, voice AI, video AI agent, V·GUIDE, V·MEMORY, conversational AI technology, AI browser control, sub-second AI response, real-time AI video" />
        <link rel="canonical" href="https://voxaris.io/technology" />
        <meta property="og:title" content="VoxEngine AI Platform | Voxaris" />
        <meta property="og:description" content="One engine powers every conversation. Voice, video, and browser control — sub-1-second response time, persistent memory, real-time video rendering." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://voxaris.io/technology" />
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
            <span className="text-[11px] font-semibold text-carbon-500 uppercase tracking-[0.15em]">Technology</span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-carbon-900 mb-6 font-display leading-[1.05]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            One engine powers{' '}
            <span className="text-carbon-400">every conversation.</span>
          </motion.h1>

          <motion.p
            className="max-w-2xl mx-auto text-lg text-carbon-400 mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            VoxEngine is the AI platform behind every Voxaris agent — voice, video, and browser control. Sub-1-second responses. Persistent context across every interaction. Built from the ground up to make AI feel human.
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

      {/* The Platform */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[11px] font-semibold text-carbon-400 uppercase tracking-[0.2em] mb-4 block">The Platform</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-carbon-900 mb-8 font-display">
              VoxEngine.
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
              VoxEngine is Voxaris's conversational AI platform. It's the single intelligence layer that powers every voice call, every video agent, and every personalized outreach interaction — across every industry we serve.
            </p>
            <p>
              It's a <strong className="text-carbon-900">unified architecture purpose-built for one thing</strong>: making AI conversations indistinguishable from human ones.
            </p>
            <p>
              Every component — speech synthesis, natural language understanding, memory, video rendering, browser control — is engineered to work together with zero friction and sub-1-second latency end to end.
            </p>
            <p>
              The result: AI agents that don't sound like AI. They listen, they remember, they respond in context. And they do it faster than any human on your team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Speed */}
      <section className="py-20 bg-carbon-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[11px] font-semibold text-white/30 uppercase tracking-[0.2em] mb-4 block">Speed</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 font-display">
              Sub-1-second response time. Every interaction.
            </h2>
            <div className="max-w-3xl space-y-6 text-[16px] text-white/50 leading-[1.8]">
              <p>
                Latency kills conversations. A 2-second delay makes an AI agent feel robotic. A 3-second delay makes a caller hang up.
              </p>
              <p>
                VoxEngine delivers end-to-end response times under one second — from the moment a caller stops speaking to the moment the agent begins responding. This isn't a theoretical benchmark. It's the lived experience on every call, every video interaction, every scan.
              </p>
              <p>
                The speed is what makes callers forget they're talking to AI. It's what makes a video agent on a website feel like a real face-to-face conversation. And it's what separates Voxaris from tools that feel like fancy voicemail.
              </p>
            </div>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-4">
            {speedStats.map((stat, index) => (
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
        </div>
      </section>

      {/* V·MEMORY */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-14 max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[11px] font-semibold text-carbon-400 uppercase tracking-[0.2em] mb-4 block">Intelligence</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-carbon-900 mb-6 font-display">
              V·MEMORY. Your AI remembers everything.
            </h2>
            <div className="space-y-6 text-[16px] text-carbon-500 leading-[1.8]">
              <p>
                Most AI agents treat every interaction as a blank slate. A customer calls Monday, explains their situation in detail, then calls back Wednesday and has to start from scratch. That's not intelligence. That's a glorified phone tree.
              </p>
              <p>
                V·MEMORY gives every Voxaris agent <strong className="text-carbon-900">persistent context across interactions</strong>. Returning callers are recognized instantly by phone number and greeted by name. Previous conversations — quotes discussed, inspection dates, issue details, preferences — are recalled automatically. The customer never repeats themselves.
              </p>
              <p>
                This isn't just a convenience feature. It's what turns a single interaction into a relationship. And it's what makes the difference between an AI tool that handles calls and an AI agent that builds trust.
              </p>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4">
            {memoryFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="p-6 rounded-2xl bg-carbon-50 border border-carbon-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <div className="w-10 h-10 rounded-xl bg-carbon-900 flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-carbon-900 mb-2">{feature.title}</h3>
                <p className="text-carbon-400 text-[14px] leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Three Modalities */}
      <section className="py-20 bg-carbon-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[11px] font-semibold text-carbon-400 uppercase tracking-[0.2em] mb-4 block">Modalities</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-carbon-900 mb-6 font-display">
              Voice. Video. Outreach. One engine.
            </h2>
            <p className="max-w-3xl text-[16px] text-carbon-500 leading-[1.8]">
              VoxEngine powers three distinct interaction modes, each optimized for a different touchpoint in your customer journey. They share the same intelligence, the same memory, and the same sub-1-second speed.
            </p>
          </motion.div>

          <div className="grid gap-4">
            {/* V·SENSE */}
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
                  <span className="text-[10px] font-semibold text-carbon-400 uppercase tracking-[0.15em]">V·SENSE</span>
                  <h3 className="text-lg font-bold text-carbon-900">Voice AI</h3>
                </div>
              </div>
              <p className="text-carbon-500 text-[15px] leading-[1.8]">
                Human-quality voice agents for inbound and outbound phone calls. Natural conversation style with active listening cues, intelligent interruption handling, and real-time CRM sync. Trained on industry-specific objections, FAQs, and qualification flows.
              </p>
            </motion.div>

            {/* V·FACE */}
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
                  <span className="text-[10px] font-semibold text-carbon-400 uppercase tracking-[0.15em]">V·FACE</span>
                  <h3 className="text-lg font-bold text-carbon-900">Video AI</h3>
                </div>
              </div>
              <p className="text-carbon-500 text-[15px] leading-[1.8]">
                Photorealistic AI video agents that deploy on any webpage or landing page. Real-time lip sync and micro-expressions. Custom personas tailored to your brand. Every visitor gets a face-to-face conversation — not a chatbot.
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
                AI-generated personalized video messages delivered through physical mail. Each recipient scans a QR code and meets an agent who knows their name, their context, and the offer. Dynamic content insertion, trackable engagement, and full CRM integration.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-14 max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[11px] font-semibold text-carbon-400 uppercase tracking-[0.2em] mb-4 block">Integrations</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-carbon-900 mb-6 font-display">
              Plugs into the tools you already use.
            </h2>
            <p className="text-[16px] text-carbon-500 leading-[1.8]">
              VoxEngine isn't a standalone system that creates more work. Every interaction — voice, video, outreach — syncs automatically to your existing CRM and workflow tools. Contact creation, task generation, call transcripts, conversation summaries, and appointment data all flow in without manual entry.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {integrationFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="p-6 rounded-2xl bg-carbon-50 border border-carbon-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <div className="w-10 h-10 rounded-xl bg-carbon-900 flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-carbon-900 mb-2">{feature.title}</h3>
                <p className="text-carbon-400 text-[14px] leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.p
            className="text-carbon-400 text-[14px]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Current integrations include <strong className="text-carbon-600">JobNimbus</strong>, <strong className="text-carbon-600">GoHighLevel</strong>, and custom CRM connections via API. New integrations are being added continuously.
          </motion.p>
        </div>
      </section>

      {/* Under the Hood */}
      <section className="py-20 bg-carbon-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[11px] font-semibold text-carbon-400 uppercase tracking-[0.2em] mb-4 block">Under the Hood</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-carbon-900 mb-4 font-display">
              For the technical team.
            </h2>
            <p className="text-[16px] text-carbon-500 leading-[1.8]">
              This section is for the people who need to know how it works before they'll trust it. Here's what's running beneath the surface.
            </p>
          </motion.div>

          <div className="space-y-2">
            {technicalSections.map((section, index) => (
              <motion.div
                key={section.title}
                className="rounded-2xl bg-white border border-carbon-200 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <button
                  className="w-full flex items-center gap-3 p-6 text-left hover:bg-carbon-50/50 transition-colors"
                  onClick={() => setExpandedTech(expandedTech === index ? null : index)}
                >
                  <div className="w-10 h-10 rounded-xl bg-carbon-900 flex items-center justify-center shrink-0">
                    <section.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-carbon-900 flex-1">{section.title}</h3>
                  <ChevronDown
                    className={`w-5 h-5 text-carbon-400 transition-transform duration-200 ${
                      expandedTech === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedTech === index && (
                  <motion.div
                    className="px-6 pb-6"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-carbon-500 text-[15px] leading-[1.8] pl-[52px]">
                      {section.body}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-carbon-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-white mb-6 font-display"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            See VoxEngine in action.
          </motion.h2>

          <motion.p
            className="text-white/50 text-[16px] leading-[1.8] mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
          >
            Book a 15-minute demo and experience a live conversation with a Voxaris agent — voice, video, or both. Hear the speed. See the memory. Understand why this feels different.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
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
