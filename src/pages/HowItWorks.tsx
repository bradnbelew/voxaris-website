import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Users, Mail, Globe, Search,
  Phone, BarChart3, Zap, Calendar,
} from 'lucide-react';
import { Navbar, Footer } from '@/components/marketing';

const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease },
});

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-black">
      <Helmet>
        <title>How Voxaris Works | Four Solutions, One Growth Stack</title>
        <meta name="description" content="Voxaris builds and runs four AI-powered systems for local businesses — AI hiring, talking postcards, website redesign, and AEO-GEO optimization. Here's how each works." />
        <link rel="canonical" href="https://voxaris.io/how-it-works" />
        <meta property="og:title" content="How Voxaris Works | AI-Powered Growth for Local Business" />
        <meta property="og:description" content="Four done-for-you solutions that compound. AI hiring, direct mail AI, website redesign, and local AI search optimization." />
        <meta property="og:url" content="https://voxaris.io/how-it-works" />
        <meta property="og:image" content="https://voxaris.io/og-image.png" />
      </Helmet>

      <Navbar />

      <main id="main-content">
        {/* Hero */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px]"
              style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(139,92,246,0.08) 0%, rgba(139,92,246,0.02) 35%, transparent 65%)' }}
            />
            <div className="absolute inset-0 noise-overlay opacity-[0.08]" />
          </div>

          <div className="max-w-5xl mx-auto px-6 sm:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease }}
              className="max-w-3xl"
            >
              <span className="text-[10px] font-mono text-white/25 uppercase tracking-[0.2em] mb-5 block">How It Works</span>
              <h1 className="text-4xl sm:text-5xl font-light text-white leading-[1.05] tracking-[-0.03em] mb-6">
                Four tools. Built for you.
                <br />
                <span className="text-white/35">Running while you work.</span>
              </h1>
              <p className="text-[17px] text-white/45 leading-[1.8] max-w-2xl">
                Each Voxaris solution is a done-for-you system — we configure it, launch it, and manage it.
                You get the results without the overhead.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Solutions detail */}
        <SolutionSection
          index="01"
          icon={Users}
          label="Hiring Intelligence"
          href="/solutions/hiring-intelligence"
          accentColor="text-blue-400"
          accentBg="bg-blue-500/10"
          accentBorder="border-blue-500/20"
          headline="Phone every applicant in 5 minutes."
          subhead="AI handles the screening. You make the hire."
          body="When someone applies for your job, Voxaris calls them within 5 minutes — any time of day. The AI conducts a real phone interview, scores them against your criteria, and delivers a ranked shortlist. You only talk to the top candidates."
          steps={[
            { icon: Phone, label: 'Applicant applies', desc: 'AI calls within 5 minutes, 24/7' },
            { icon: BarChart3, label: 'Interview & score', desc: 'Custom questions, fit scoring' },
            { icon: Users, label: 'Ranked shortlist', desc: 'Top 3 candidates delivered to you' },
            { icon: Calendar, label: 'You interview', desc: 'Only the ones worth your time' },
          ]}
          stats={[
            { value: '< 5 min', label: 'First call' },
            { value: '10×', label: 'More screened' },
            { value: '80%', label: 'Time saved' },
          ]}
          bg="bg-black"
        />

        <SolutionSection
          index="02"
          icon={Mail}
          label="Talking Postcards"
          href="/talking-postcard"
          accentColor="text-gold-400"
          accentBg="bg-gold-500/10"
          accentBorder="border-gold-500/20"
          headline="Direct mail that starts a conversation."
          subhead="Handwritten letters. QR codes. Live AI video."
          body="We send personalized, handwritten mailers to your target list. Each one includes a QR code that launches a live AI video conversation — answering questions, handling objections, and booking appointments on the spot. 6–12× better than standard direct mail."
          steps={[
            { icon: Mail, label: 'Mailer delivered', desc: 'Personalized, handwritten feel' },
            { icon: Zap, label: 'QR code scanned', desc: 'Instant AI video launches' },
            { icon: Users, label: 'Real conversation', desc: 'Answers questions, qualifies leads' },
            { icon: Calendar, label: 'Appointment booked', desc: 'Synced to your calendar' },
          ]}
          stats={[
            { value: '6–12%', label: 'Response rate' },
            { value: '<3s', label: 'Response time' },
            { value: '45s', label: 'Setup per campaign' },
          ]}
          bg="bg-carbon-950"
        />

        <SolutionSection
          index="03"
          icon={Globe}
          label="Website Redesign"
          href="/solutions/website-redesign"
          accentColor="text-violet-400"
          accentBg="bg-violet-500/10"
          accentBorder="border-violet-500/20"
          headline="A site built to convert. Live in 48 hours."
          subhead="Fast, modern, mobile-first. Custom-built, no templates."
          body="We build your new website from scratch — no templates, no page builders. Designed specifically for your business and optimized for speed, mobile, local SEO, and conversion. Most sites go live in 48 hours."
          steps={[
            { icon: Users, label: 'Kickoff call', desc: '20 min to capture your goals' },
            { icon: Globe, label: 'Design sprint', desc: 'We write copy, you approve layout' },
            { icon: Zap, label: 'Build & optimize', desc: 'Fast, PageSpeed 90+, mobile A+' },
            { icon: Calendar, label: 'Live in 48 hours', desc: 'Handed off with training' },
          ]}
          stats={[
            { value: '48h', label: 'Avg. launch time' },
            { value: '90+', label: 'PageSpeed score' },
            { value: 'A+', label: 'Mobile grade' },
          ]}
          bg="bg-black"
        />

        <SolutionSection
          index="04"
          icon={Search}
          label="AEO-GEO Optimization"
          href="/solutions/aeo-geo"
          accentColor="text-emerald-400"
          accentBg="bg-emerald-500/10"
          accentBorder="border-emerald-500/20"
          headline="Show up when AI answers your customers."
          subhead="ChatGPT, Perplexity, Google AI Overviews. All of them."
          body="When someone asks ChatGPT 'best HVAC contractor in Orlando,' your business needs to be the answer. AEO (Answer Engine Optimization) structures your content so AI models cite you. GEO (Generative Engine Optimization) makes sure local AI search results include you. We set it up and maintain it monthly."
          steps={[
            { icon: Search, label: 'Free audit', desc: "We show you where you're invisible" },
            { icon: Globe, label: 'AEO setup', desc: 'Structure your site for AI citation' },
            { icon: BarChart3, label: 'GEO optimization', desc: 'Local AI search presence built' },
            { icon: Zap, label: 'Monthly updates', desc: 'Ongoing ranking maintenance' },
          ]}
          stats={[
            { value: 'Free', label: 'Audit first' },
            { value: '9×', label: 'AI search citations' },
            { value: 'Monthly', label: 'Optimization' },
          ]}
          bg="bg-carbon-950"
        />

        {/* CTA */}
        <section className="py-20 bg-black">
          <div className="max-w-2xl mx-auto px-6 sm:px-8 text-center">
            <motion.div {...fadeUp()}>
              <h2 className="text-3xl font-light text-white mb-4">
                Pick one. Or run all four.
              </h2>
              <p className="text-[14px] text-white/35 mb-8">
                Each solution works standalone. Together, they compound. Start with what moves the needle most for your business right now.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link to="/book-demo">
                  <button className="flex items-center gap-2 px-8 h-12 rounded-full bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-white text-[14px] font-semibold border border-gold-400/30 shadow-gold-sm transition-all duration-300 hover:-translate-y-0.5 group">
                    See a live demo <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </Link>
                <Link to="/why-voxaris">
                  <button className="flex items-center gap-2 px-7 h-12 rounded-full border border-white/[0.1] text-white/50 hover:text-white hover:border-white/[0.2] text-[14px] transition-all duration-300">
                    Why Voxaris →
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

/* ─── Reusable solution section ─── */
function SolutionSection({
  index, icon: Icon, label, href, accentColor, accentBg, accentBorder,
  headline, subhead, body, steps, stats, bg,
}: {
  index: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  href: string;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  headline: string;
  subhead: string;
  body: string;
  steps: { icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; label: string; desc: string }[];
  stats: { value: string; label: string }[];
  bg: string;
}) {
  return (
    <section className={`py-20 lg:py-28 ${bg} relative overflow-hidden`}>
      <div className="absolute inset-0 noise-overlay opacity-[0.05] pointer-events-none" />
      <div className="max-w-6xl mx-auto px-6 sm:px-8 relative z-10">
        <motion.div className="mb-12" {...fadeUp()}>
          <div className="flex items-center gap-3 mb-5">
            <span className={`text-[10px] font-mono ${accentColor} opacity-50 uppercase tracking-[0.2em]`}>{index}</span>
            <div className={`w-8 h-8 rounded-xl ${accentBg} flex items-center justify-center`}>
              <Icon className={`w-4 h-4 ${accentColor}`} strokeWidth={1.5} />
            </div>
            <span className={`text-[11px] font-mono ${accentColor} opacity-70 uppercase tracking-[0.12em]`}>{label}</span>
          </div>

          <h2 className="text-3xl sm:text-[2.25rem] font-light text-white leading-[1.1] tracking-[-0.02em] mb-3">
            {headline}
          </h2>
          <p className="text-[16px] text-white/35 mb-5">{subhead}</p>
          <p className="text-[15px] text-white/45 leading-[1.8] max-w-2xl mb-8">{body}</p>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mb-10">
            {stats.map((s) => (
              <div key={s.label}>
                <div className={`text-[20px] font-light ${accentColor}`}>{s.value}</div>
                <div className="text-[10px] font-mono text-white/25 uppercase tracking-wider mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          <Link to={href}>
            <button className={`flex items-center gap-2 text-[13px] font-mono ${accentColor} opacity-60 hover:opacity-100 transition-opacity group`}>
              Learn more about {label} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </Link>
        </motion.div>

        {/* Steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              {...fadeUp(i * 0.08)}
              className={`p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:${accentBorder} transition-all duration-300`}
            >
              <div className={`w-8 h-8 rounded-xl ${accentBg} flex items-center justify-center mb-3`}>
                <step.icon className={`w-3.5 h-3.5 ${accentColor}`} strokeWidth={1.5} />
              </div>
              <div className={`text-[10px] font-mono ${accentColor} opacity-40 uppercase tracking-[0.15em] mb-1`}>Step {i + 1}</div>
              <h3 className="text-[13px] font-semibold text-white mb-1">{step.label}</h3>
              <p className="text-[11px] text-white/30 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
