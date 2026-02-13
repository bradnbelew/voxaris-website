import { motion } from 'framer-motion';
import { Video, Phone, Mail, GraduationCap, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TAVUS_VIDEO_URL = "https://cdn.replica.tavus.io/20283/9de1f64e.mp4";

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
    <section className="section-padding-lg bg-black">
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
          <h2 className="headline-xl text-white mb-6">
            Four products.
            <br className="hidden sm:block" />
            <span className="text-chrome">One AI platform.</span>
          </h2>
          <p className="text-white/30 max-w-xl mx-auto text-lg">
            A complete AI sales infrastructure — from first touch to closed deal.
          </p>
        </motion.div>

        {/* Product grid — 2x2 */}
        <div className="grid md:grid-cols-2 gap-4">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              className="group relative bg-carbon-950 border border-white/[0.04] rounded-[24px] overflow-hidden transition-all duration-500 hover:border-white/[0.08]"
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
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-[1.02] transition-all duration-700"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-carbon-950/30 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <div className="bg-black/50 backdrop-blur-xl rounded-full px-3 py-1 border border-white/[0.06]">
                      <span className="text-[9px] font-semibold text-white/60 uppercase tracking-[0.15em]">V·FACE</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="aspect-[16/9] flex items-center justify-center relative overflow-hidden bg-carbon-950">
                  <div className="absolute inset-0 opacity-20"
                    style={{ background: 'radial-gradient(circle at 50% 50%, rgba(192,192,192,0.06) 0%, transparent 55%)' }}
                  />

                  {product.id === 'voice' && (
                    <div className="text-center relative z-10">
                      <div className="flex items-center justify-center gap-[3px] mb-4">
                        {[...Array(20)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-[2px] bg-white/30 rounded-full"
                            animate={{ height: [8, 20 + Math.random() * 20, 8] }}
                            transition={{ duration: 0.8 + Math.random() * 0.6, repeat: Infinity, delay: i * 0.04, ease: 'easeInOut' }}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-medium text-white/15 uppercase tracking-[0.25em]">Voice Active</span>
                    </div>
                  )}

                  {product.id === 'postcard' && (
                    <div className="relative z-10 w-48 h-32">
                      <div className="absolute inset-0 bg-white/[0.03] border border-white/[0.06] rounded-2xl transform rotate-[-3deg] translate-x-2" />
                      <div className="absolute inset-0 bg-white/[0.05] border border-white/[0.08] rounded-2xl flex items-center justify-center">
                        <div className="text-center">
                          <Mail className="w-6 h-6 text-white/20 mx-auto mb-2" />
                          <div className="text-[10px] text-white/25 uppercase tracking-[0.15em]">Personalized</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {product.id === 'training' && (
                    <div className="relative z-10 text-center">
                      <div className="inline-flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-2xl px-6 py-4">
                        <div className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center">
                          <GraduationCap className="w-4 h-4 text-white/30" />
                        </div>
                        <div className="text-left">
                          <div className="text-[11px] font-medium text-white/40">Score</div>
                          <div className="text-lg font-bold text-white/60 font-display">94/100</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="p-7 lg:p-9">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center border border-white/[0.06]">
                    <product.icon className="w-4 h-4 text-white/60" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white font-display">{product.name}</h3>
                    <p className="text-[10px] text-white/25 tracking-wide uppercase">{product.tagline}</p>
                  </div>
                </div>

                <p className="text-white/30 mb-6 leading-relaxed text-[14px]">
                  {product.description}
                </p>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-6">
                  {product.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-white/20 flex-shrink-0" />
                      <span className="text-[12px] text-white/35">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link to="/technology" className="inline-flex items-center gap-1.5 text-[12px] font-medium text-white/30 hover:text-white/60 transition-colors group/link">
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
