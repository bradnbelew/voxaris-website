import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Users,
  Zap,
  BarChart3,
  CheckCircle2,
  Clock,
  Star,
  PhoneCall,
  FileText,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar, Footer } from '@/components/marketing';

const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease },
});

export function HiringAgents() {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>AI Hiring Agents | Phone-Based Candidate Screening | Voxaris</title>
        <meta name="description" content="AI agents that call every applicant within minutes, run consistent 10-minute phone screenings, score and rank candidates, and push the best to your hiring dashboard." />
        <meta name="keywords" content="AI hiring agents, AI candidate screening, automated phone interviews, AI recruiting, candidate ranking, hiring dashboard" />
        <link rel="canonical" href="https://voxaris.io/hiring-agents" />
        <meta property="og:title" content="AI Hiring Agents | Voxaris" />
        <meta property="og:description" content="AI phone interviews every applicant. You review the ranked shortlist." />
        <meta property="og:url" content="https://voxaris.io/hiring-agents" />
        <meta property="og:image" content="https://voxaris.io/og-image.png" />
      </Helmet>
      <Navbar />
      <main id="main-content">
        <HiringHero />
        <HowItWorksSection />
        <FeaturesSection />
        <DashboardSection />
        <HiringCTA />
      </main>
      <Footer />
    </div>
  );
}

function HiringHero() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-carbon-950 pt-16">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[600px]"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.08) 0%, transparent 60%)' }} />
        <div className="absolute inset-0 noise-overlay opacity-[0.12]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 w-full py-16 lg:py-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.07]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400/50" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-[0.18em]">AI Hiring Agents</span>
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-white leading-[1.05] tracking-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
          >
            Screen every applicant.
            <br />
            <span className="text-gold-gradient">Hire the best ones faster.</span>
          </motion.h1>

          <motion.p
            className="text-lg text-white/50 mb-10 leading-relaxed max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
          >
            AI agents call every applicant within minutes of applying. They run a consistent 10-minute phone screening, score qualification and fit, and push ranked candidates to your dashboard — so your team only talks to the best ones.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-8 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease }}
          >
            {[
              { value: '< 5 min', label: 'Time to first call', sub: 'after application' },
              { value: '10×', label: 'More candidates', sub: 'screened vs manual' },
              { value: '80%', label: 'Time saved', sub: 'on initial screening' },
            ].map((m) => (
              <div key={m.label}>
                <div className="text-2xl font-bold text-white font-display">{m.value}</div>
                <div className="text-[12px] text-white/40">{m.label}</div>
                <div className="text-[10px] text-white/25">{m.sub}</div>
              </div>
            ))}
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row items-start gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease }}
          >
            <Link to="/book-demo">
              <Button size="lg" className="bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-500 hover:via-gold-400 hover:to-gold-500 text-white h-14 px-10 text-[15px] font-semibold rounded-full group shadow-gold-btn border border-gold-400/30 transition-all duration-500 hover:-translate-y-0.5">
                See It In Action
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-white pointer-events-none" />
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    { num: '01', title: 'Application comes in', desc: 'The moment someone applies through your ATS or job board, Voxaris queues a call. No manual intervention needed.', color: 'text-emerald-400' },
    { num: '02', title: 'AI calls the candidate', desc: 'Within minutes, an AI agent calls the applicant. It introduces itself as your company\'s hiring team and runs a consistent, professional 10-minute screening.', color: 'text-gold-400' },
    { num: '03', title: 'Interview is scored', desc: 'The AI evaluates qualification, experience, availability, and fit against your criteria. Each candidate gets a structured score and recommendation.', color: 'text-blue-400' },
    { num: '04', title: 'Ranked dashboard awaits', desc: 'Your team logs in to see a ranked list of pre-screened candidates with transcripts, AI summaries, scores, and recommendations — ready to review.', color: 'text-violet-400' },
  ];

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        <motion.div className="text-center mb-16" {...fadeUp()}>
          <span className="eyebrow mb-4 block">How It Works</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-carbon-900 font-display">
            From application to ranked shortlist.
            <br />
            <span className="text-carbon-400">Automatically.</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              className="p-6 rounded-2xl border border-carbon-200 hover:border-carbon-300 hover:shadow-sm transition-all duration-300"
              {...fadeUp(i * 0.1)}
            >
              <div className={`text-3xl font-bold ${step.color} opacity-40 mb-4 font-display`}>{step.num}</div>
              <h3 className="text-[14px] font-semibold text-carbon-900 mb-2">{step.title}</h3>
              <p className="text-[13px] text-carbon-400 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    { icon: PhoneCall, title: 'Calls every applicant', desc: 'No one falls through the cracks. Every applicant gets a call within minutes of applying, regardless of volume.' },
    { icon: Clock, title: 'Consistent 10-min interviews', desc: 'Every candidate gets the same fair, structured screening. No interviewer fatigue, no bias, no skipped questions.' },
    { icon: BarChart3, title: 'AI scoring and ranking', desc: 'Candidates are scored across qualification, experience, availability, and culture fit. The best rise to the top automatically.' },
    { icon: FileText, title: 'Full transcripts + AI summary', desc: 'Every interview is transcribed and summarized. Strengths, concerns, fit score, and recommendation — ready in your dashboard.' },
    { icon: Zap, title: 'Works with your ATS', desc: 'Connect Greenhouse, Lever, BreezyHR, or any ATS via webhook. Candidates sync automatically, no double entry.' },
    { icon: Shield, title: 'Consistent & fair', desc: 'Every candidate gets the same questions, the same process, the same evaluation criteria. Legally defensible, consistently applied.' },
  ];

  return (
    <section className="py-20 lg:py-28 bg-carbon-50">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        <motion.div className="text-center mb-14" {...fadeUp()}>
          <span className="eyebrow mb-4 block">Features</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-carbon-900 font-display">
            Everything your hiring team needs.
            <br />
            <span className="text-carbon-400">Done automatically.</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="p-6 rounded-2xl bg-white border border-carbon-200 hover:border-emerald-200/80 hover:shadow-sm transition-all duration-300"
              {...fadeUp(i * 0.07)}
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-emerald-500" strokeWidth={1.5} />
              </div>
              <h3 className="text-[14px] font-semibold text-carbon-900 mb-2">{f.title}</h3>
              <p className="text-[13px] text-carbon-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DashboardSection() {
  const mockCandidates = [
    { name: 'Sarah M.', role: 'Sales Rep', score: 92, badge: 'Strong Hire', badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { name: 'James R.', role: 'Sales Rep', score: 84, badge: 'Good Fit', badgeColor: 'bg-blue-50 text-blue-700 border-blue-200' },
    { name: 'Maria L.', role: 'Sales Rep', score: 78, badge: 'Consider', badgeColor: 'bg-gold-50 text-gold-700 border-gold-200' },
  ];

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div {...fadeUp()}>
            <span className="eyebrow mb-4 block">The Dashboard</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-carbon-900 mb-5 font-display">
              Your ranked shortlist,
              <br />
              <span className="text-carbon-400">ready and waiting.</span>
            </h2>
            <p className="text-[15px] text-carbon-500 leading-relaxed mb-6">
              No more inbox full of resumes. Your hiring dashboard shows a ranked list of pre-screened candidates with everything your team needs to make a decision — transcript, AI summary, scores, and a clear recommendation.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'AI fit score and hiring recommendation per candidate',
                'Full interview transcript and AI-generated summary',
                'Strengths and concerns flagged automatically',
                'One-click to schedule a follow-up interview',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[14px] text-carbon-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/book-demo">
              <Button className="bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-500 hover:via-gold-400 hover:to-gold-500 text-white px-7 h-11 text-[13px] font-semibold rounded-full shadow-gold-sm border border-gold-400/30 transition-all duration-300 group">
                See the Dashboard <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          {/* Mock dashboard */}
          <motion.div {...fadeUp(0.15)}>
            <div className="rounded-2xl overflow-hidden border border-carbon-200 shadow-card-luxury bg-white">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-carbon-100 bg-carbon-50/50">
                <div>
                  <div className="text-[13px] font-semibold text-carbon-800">Hiring Dashboard</div>
                  <div className="text-[11px] text-carbon-400">Sales Representative · 24 applicants screened</div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-semibold text-emerald-700">Live</span>
                </div>
              </div>

              {/* Candidate rows */}
              <div className="divide-y divide-carbon-50">
                {mockCandidates.map((c, i) => (
                  <div key={c.name} className="flex items-center gap-4 px-5 py-4 hover:bg-carbon-50/50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-carbon-200 flex items-center justify-center text-[12px] font-bold text-carbon-600">
                      {c.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold text-carbon-800">{c.name}</div>
                      <div className="text-[11px] text-carbon-400">{c.role}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-gold-500" fill="currentColor" />
                        <span className="text-[12px] font-bold text-carbon-700">{c.score}</span>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${c.badgeColor}`}>{c.badge}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 bg-carbon-50/30 border-t border-carbon-100">
                <div className="text-[11px] text-carbon-400">+21 more candidates · Avg. score: 71</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function HiringCTA() {
  return (
    <section className="py-20 bg-carbon-950 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px]"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(16,185,129,0.06) 0%, transparent 65%)' }} />
      </div>
      <div className="max-w-3xl mx-auto px-6 sm:px-8 text-center relative z-10">
        <motion.div {...fadeUp()}>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5 font-display">
            Stop losing great candidates
            <br />
            <span className="text-white/40">to slow response times.</span>
          </h2>
          <p className="text-[15px] text-white/40 mb-8 max-w-lg mx-auto leading-relaxed">
            See AI Hiring Agents in action. We'll show you exactly how the call flow, scoring, and dashboard work with your open roles.
          </p>
          <Link to="/book-demo">
            <Button size="lg" className="bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-500 hover:via-gold-400 hover:to-gold-500 text-white h-14 px-10 text-[15px] font-semibold rounded-full group shadow-gold-btn border border-gold-400/30 transition-all duration-500 hover:-translate-y-0.5">
              Book a Demo
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
