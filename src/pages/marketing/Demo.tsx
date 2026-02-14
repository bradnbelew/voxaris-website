import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Phone, Video, PhoneCall, Zap, Brain, Database, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { Navbar, Footer } from '@/components/marketing';

const MARIA_VIDEO_URL = '/maria-avatar.mp4';

export function Demo() {
  const [formData, setFormData] = useState({
    firstName: '',
    phone: '',
    company: '',
  });
  const [callState, setCallState] = useState<'idle' | 'calling' | 'error'>('idle');
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const handleCallMe = (e: React.FormEvent) => {
    e.preventDefault();
    // In production: POST to Retell API to trigger outbound call from Maria
    // Pass first_name and company_name to Maria's prompt
    console.log('Triggering outbound call:', formData);
    setCallState('calling');
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-carbon-50">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-carbon-200 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-[11px] font-semibold text-carbon-500 uppercase tracking-[0.15em]">Live Demo</span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-carbon-900 mb-6 font-display leading-[1.05]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Don't take our word for it.{' '}
            <span className="text-carbon-400">Talk to her.</span>
          </motion.h1>

          <motion.p
            className="max-w-2xl mx-auto text-lg text-carbon-400 mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Meet Maria — your AI sales agent. She'll pick up the phone, greet you by name, qualify your needs, and book a meeting with our team. In real time. Right now. No scripts. No recordings. Just a live conversation with the technology your customers will experience.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <a href="#outbound">
              <Button className="bg-carbon-900 hover:bg-carbon-800 text-white rounded-full px-8 py-6 text-base font-medium shadow-sm hover:shadow-md transition-all">
                Get a Call from Maria
                <Phone className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <a href="#video">
              <Button variant="outline" className="border-carbon-300 text-carbon-900 hover:bg-carbon-100 rounded-full px-8 py-6 text-base font-medium transition-all">
                Meet Her Face to Face
                <Video className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Maria Hero Image */}
      <section className="bg-white pt-12 pb-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
          <motion.div
            className="aspect-[21/9] rounded-2xl overflow-hidden shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <img
              src="/maria-hero.png"
              alt="Maria — your AI sales agent"
              className="w-full h-full object-cover"
              style={{ objectPosition: '50% 25%' }}
            />
          </motion.div>
        </div>
      </section>

      {/* Section 1 — Outbound Call Demo */}
      <section id="outbound" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <span className="text-[11px] font-semibold text-carbon-400 uppercase tracking-[0.2em]">Experience 1</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-carbon-900 mt-3 mb-6 font-display">
                Get a call from Maria in under 60 seconds.
              </h2>
              <p className="text-carbon-500 text-lg leading-relaxed mb-6">
                Fill in your name, phone number, and company — and Maria will call you immediately. Not in an hour. Not tomorrow. Right now.
              </p>
              <p className="text-carbon-500 leading-relaxed">
                She'll walk you through a live qualification conversation, answer your questions, and schedule a meeting with our founder, Ethan. This is exactly what your customers will experience — a real conversation with an AI agent that sounds human, responds instantly, and never drops the ball.
              </p>
            </div>

            <div className="bg-carbon-50 rounded-2xl p-8 border border-carbon-100">
              {callState === 'calling' ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto rounded-full bg-carbon-900 flex items-center justify-center mb-6 animate-pulse">
                    <Phone className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-carbon-900 mb-3">Maria is calling you now.</h3>
                  <p className="text-carbon-500 mb-6">Pick up your phone — she'll greet you by name.</p>
                  <button
                    onClick={() => setCallState('idle')}
                    className="text-sm text-carbon-400 underline underline-offset-2 hover:text-carbon-600 transition-colors"
                  >
                    Didn't get a call? Try again
                  </button>
                </div>
              ) : callState === 'error' ? (
                <div className="text-center py-8">
                  <h3 className="text-xl font-bold text-carbon-900 mb-3">Something went wrong.</h3>
                  <p className="text-carbon-500 mb-4">Maria is on another call — she'll reach out in 2 minutes.</p>
                  <p className="text-carbon-500 mb-6">
                    Or call her directly at{' '}
                    <a href="tel:+1XXXXXXXXXX" className="font-semibold text-carbon-900 underline underline-offset-2">(XXX) XXX-XXXX</a>
                  </p>
                  <button
                    onClick={() => setCallState('idle')}
                    className="text-sm text-carbon-400 underline underline-offset-2 hover:text-carbon-600 transition-colors"
                  >
                    Try again
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCallMe} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-carbon-700 mb-1.5">First Name</label>
                    <Input
                      placeholder="Your first name"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                      className="bg-white border-carbon-200 text-carbon-900 placeholder:text-carbon-400 h-12 focus:border-carbon-500 focus:ring-carbon-500 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-carbon-700 mb-1.5">Phone Number</label>
                    <Input
                      type="tel"
                      placeholder="(555) 555-5555"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="bg-white border-carbon-200 text-carbon-900 placeholder:text-carbon-400 h-12 focus:border-carbon-500 focus:ring-carbon-500 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-carbon-700 mb-1.5">Company Name</label>
                    <Input
                      placeholder="Your company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      required
                      className="bg-white border-carbon-200 text-carbon-900 placeholder:text-carbon-400 h-12 focus:border-carbon-500 focus:ring-carbon-500 rounded-xl"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-carbon-900 hover:bg-carbon-800 text-white rounded-full shadow-sm hover:shadow-md transition-all text-base font-medium"
                  >
                    Call Me Now
                    <Phone className="w-4 h-4 ml-2" />
                  </Button>

                  <p className="text-xs text-carbon-400 text-center pt-1">
                    Maria will call you within 60 seconds. Make sure your phone is nearby.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 — Inbound Call Demo */}
      <section id="inbound" className="py-24 bg-carbon-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[11px] font-semibold text-carbon-400 uppercase tracking-[0.2em]">Experience 2</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-carbon-900 mt-3 mb-6 font-display">
            Or call Maria yourself.
          </h2>
          <p className="max-w-2xl mx-auto text-carbon-500 text-lg leading-relaxed mb-4">
            Want to test her on your terms? Call the number below and experience a live inbound conversation. Ask her anything — what Voxaris does, how the technology works, whether we serve your industry. She'll qualify you, answer your questions, and book a time to talk with Ethan if you're interested.
          </p>
          <p className="max-w-2xl mx-auto text-carbon-500 leading-relaxed mb-12">
            This is what your customers hear when they call your business after hours, during a storm, or when your team is busy closing deals.
          </p>

          <div className="inline-block bg-white rounded-2xl border border-carbon-200 px-12 py-10 shadow-sm">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-carbon-900 flex items-center justify-center">
                <PhoneCall className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-carbon-500 uppercase tracking-wider">Call Maria</span>
            </div>
            <a
              href="tel:+1XXXXXXXXXX"
              className="block text-4xl sm:text-5xl font-bold text-carbon-900 font-display hover:text-carbon-700 transition-colors mb-4"
            >
              (XXX) XXX-XXXX
            </a>
            <p className="text-carbon-400 text-sm">
              Available 24/7 — Maria never takes a day off.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3 — Video Agent Demo */}
      <section id="video" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[11px] font-semibold text-carbon-400 uppercase tracking-[0.2em]">Experience 3</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-carbon-900 mt-3 mb-6 font-display">
            Meet Maria face to face.
          </h2>
          <p className="max-w-2xl mx-auto text-carbon-500 text-lg leading-relaxed mb-4">
            This is V·FACE in action. Click below to start a live video conversation with Maria — the same photorealistic AI agent that can sit on your website, greet your visitors by name, and convert them into booked appointments.
          </p>
          <p className="max-w-2xl mx-auto text-carbon-500 leading-relaxed mb-12">
            Ask her about Voxaris. Ask her about your industry. Ask her something unexpected. She'll respond in real time with natural expressions, human cadence, and zero lag. And if you're ready, she'll book a meeting with Ethan on the spot.
          </p>

          {/* Maria Video Agent */}
          <div className="max-w-3xl mx-auto">
            <div className="aspect-video rounded-2xl bg-carbon-950 border border-carbon-800 shadow-lg overflow-hidden relative group">
              <video
                ref={videoRef}
                src={MARIA_VIDEO_URL}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              {/* Volume toggle */}
              <button
                onClick={toggleMute}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-black/70 transition-all cursor-pointer"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-white" />
                ) : (
                  <Volume2 className="w-5 h-5 text-white" />
                )}
              </button>
              {/* CTA overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-carbon-950/80 via-transparent to-transparent flex items-end justify-center pb-8">
                <Button className="bg-white text-carbon-900 hover:bg-carbon-100 rounded-full px-8 py-6 text-base font-medium shadow-md hover:shadow-lg transition-all">
                  Start a Conversation with Maria
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
            <p className="text-carbon-400 text-sm mt-4">
              Powered by V·FACE. This is what your website visitors experience.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4 — What You Just Experienced */}
      <section className="py-24 bg-carbon-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[11px] font-semibold text-carbon-400 uppercase tracking-[0.2em]">What Happened</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-carbon-900 mt-3 mb-6 font-display">
              That's VoxEngine.
            </h2>
            <p className="max-w-2xl mx-auto text-carbon-500 text-lg leading-relaxed mb-4">
              The voice call, the video conversation, the instant response time — all of it runs on VoxEngine, the same proprietary platform that powers every Voxaris deployment.
            </p>
            <p className="max-w-2xl mx-auto text-carbon-500 leading-relaxed mb-4">
              What you just experienced is what your leads, customers, and prospects will experience — 24 hours a day, 7 days a week, with no hold time, no missed calls, and no forgotten follow-ups.
            </p>
            <p className="max-w-2xl mx-auto text-carbon-500 leading-relaxed">
              Every conversation Maria just had with you? It was logged, transcribed, summarized, and ready to sync to your CRM. That's the product.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: 'Sub-1-Second Response',
                body: 'Maria responded before you finished processing the question. That\'s not an accident. That\'s VoxEngine.',
              },
              {
                icon: Brain,
                title: 'Persistent Memory',
                body: 'Call Maria again tomorrow. She\'ll remember your name, your company, and what you talked about today.',
              },
              {
                icon: Database,
                title: 'CRM-Ready',
                body: 'Every data point from your conversation is captured, structured, and ready to push to JobNimbus, GoHighLevel, or your existing CRM.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 border border-carbon-100">
                <div className="w-10 h-10 rounded-xl bg-carbon-900 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-carbon-900 mb-2">{item.title}</h3>
                <p className="text-carbon-500 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-carbon-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-display">
            Ready to put Maria to work for your business?
          </h2>
          <p className="text-carbon-400 text-lg mb-10 leading-relaxed">
            Schedule a strategy call with Ethan. He'll walk you through exactly how Voxaris would deploy in your operation — your industry, your workflow, your customers.
          </p>
          <Link to="/demo">
            <Button className="bg-white text-carbon-900 hover:bg-carbon-100 rounded-full px-10 py-6 text-base font-medium shadow-md hover:shadow-lg transition-all">
              Book a Meeting with Ethan
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <p className="text-carbon-500 text-sm mt-4">
            15 minutes. No pitch deck. Just a conversation about what this would look like for you.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
