import { motion } from 'framer-motion';
import { Video, Phone, Mail, GraduationCap, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TAVUS_VIDEO_URL = "https://cdn.replica.tavus.io/40242/2fe8396c.mp4";
const LUCAS_VIDEO_URL = "https://cdn.replica.tavus.io/40779/d5481d67.mp4";

const products = [
  {
    id: 'video',
    icon: Video,
    name: 'Video AI',
    tagline: 'Photorealistic conversations',
    description: 'Deploy AI video agents powered by V·FACE that have real face-to-face conversations with every lead — on any web page, in any language.',
    features: ['Photorealistic video avatars', 'Real-time lip sync & micro-expressions', 'Embeds on any webpage or landing page', 'Custom personas per campaign'],
    isVideo: true,
  },
  {
    id: 'voice',
    icon: Phone,
    name: 'Voice AI',
    tagline: 'Natural phone conversations',
    description: 'Human-quality voice agents that handle inbound and outbound calls, qualify leads, book appointments, and sync everything to your CRM.',
    features: ['Inbound & outbound calling', 'Intelligent interruption handling', 'CRM auto-sync on every call', 'Multi-language support'],
    isVideo: false,
  },
  {
    id: 'postcard',
    icon: Mail,
    name: 'Talking Postcard',
    tagline: 'Personalized video outreach',
    description: 'Send every prospect a personalized video message that knows their name, their needs, and their context. The most personal cold outreach ever built.',
    features: ['One-to-one personalized videos', 'Dynamic name & context insertion', 'Trackable engagement analytics', 'Integrates with any CRM workflow'],
    isVideo: false,
  },
  {
    id: 'training',
    icon: GraduationCap,
    name: 'Sales Training',
    tagline: 'AI-powered coaching',
    description: 'Train your human sales team with AI-simulated prospect conversations. Practice objections, refine pitches, and close more deals.',
    features: ['Realistic prospect simulations', 'Instant performance scoring', 'Custom scenario builder', 'Team analytics dashboard'],
    isVideo: false,
  },
];

export function TechnologyShowcase() {
  return (
    <section className="section-padding-lg bg-white">
      <div className="container-wide">
        {/* Header */}
        <motion.div
          className="text-center mb-20 lg:mb-28"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="eyebrow mb-6 block">Product Suite</span>
          <h2 className="headline-xl text-carbon-900 mb-6">
            Four products.
            <br className="hidden sm:block" />
            <span className="text-carbon-400">One AI platform.</span>
          </h2>
          <p className="text-carbon-400 max-w-xl mx-auto text-lg">
            A complete AI sales infrastructure — from first touch to closed deal.
          </p>
        </motion.div>

        {/* Product grid — 2x2 */}
        <div className="grid md:grid-cols-2 gap-4">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              className="group relative bg-carbon-50 border border-carbon-200 rounded-[24px] overflow-hidden transition-all duration-500 hover:border-carbon-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
            >
              {/* Media area */}
              {product.isVideo ? (
                <div className="aspect-[16/9] overflow-hidden relative">
                  <video
                    src={TAVUS_VIDEO_URL}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-700"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-carbon-50 via-carbon-50/30 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <div className="bg-white/90 backdrop-blur-xl rounded-full px-3 py-1 border border-carbon-200">
                      <span className="text-[9px] font-semibold text-carbon-700 uppercase tracking-[0.15em]">V·FACE</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="aspect-[16/9] flex items-center justify-center relative overflow-hidden bg-carbon-50">
                  <div className="absolute inset-0 opacity-30"
                    style={{ background: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.02) 0%, transparent 55%)' }}
                  />

                  {product.id === 'voice' && (
                    <div className="absolute inset-0">
                      <img
                        src="/voice-ai.jpg"
                        alt="Voxaris Voice AI"
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-carbon-50 via-carbon-50/20 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <div className="bg-white/90 backdrop-blur-xl rounded-full px-3 py-1 border border-carbon-200">
                          <span className="text-[9px] font-semibold text-carbon-700 uppercase tracking-[0.15em]">V·SENSE</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {product.id === 'postcard' && (
                    <div className="absolute inset-0">
                      <img
                        src="/talking-postcard.png"
                        alt="Voxaris Talking Postcard"
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-carbon-50 via-carbon-50/20 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <div className="bg-white/90 backdrop-blur-xl rounded-full px-3 py-1 border border-carbon-200">
                          <span className="text-[9px] font-semibold text-carbon-700 uppercase tracking-[0.15em]">Personalized</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {product.id === 'training' && (
                    <div className="absolute inset-0">
                      <video
                        src={LUCAS_VIDEO_URL}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-700"
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-carbon-50 via-carbon-50/20 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <div className="bg-white/90 backdrop-blur-xl rounded-full px-3 py-1 border border-carbon-200">
                          <span className="text-[9px] font-semibold text-carbon-700 uppercase tracking-[0.15em]">AI Coach</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="p-7 lg:p-9">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-carbon-100 flex items-center justify-center border border-carbon-200">
                    <product.icon className="w-4 h-4 text-carbon-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-carbon-900 font-display">{product.name}</h3>
                    <p className="text-[10px] text-carbon-400 tracking-wide uppercase">{product.tagline}</p>
                  </div>
                </div>

                <p className="text-carbon-400 mb-6 leading-relaxed text-[14px]">
                  {product.description}
                </p>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-6">
                  {product.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-carbon-300 flex-shrink-0" />
                      <span className="text-[12px] text-carbon-400">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link to="/technology" className="inline-flex items-center gap-1.5 text-[12px] font-medium text-carbon-400 hover:text-carbon-700 transition-colors group/link">
                  Learn more
                  <ArrowUpRight className="w-3 h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
