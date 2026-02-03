import { motion } from 'framer-motion';
import { Video, Phone, Check } from 'lucide-react';

const TAVUS_VIDEO_URL = "https://cdn.replica.tavus.io/20283/9de1f64e.mp4";

export function TechnologyShowcase() {
  return (
    <section className="section-padding-lg bg-white">
      <div className="container-wide">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="eyebrow mb-4 block">Proprietary Technology</span>
          <h2 className="headline-lg text-ink mb-4">
            Two powerful AI agents, one platform
          </h2>
          <p className="text-slate max-w-2xl mx-auto text-lg">
            Built from the ground up for enterprise scale. 100% Voxaris technology.
          </p>
        </motion.div>

        {/* Two cards side by side */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* VVideo AI Card */}
          <motion.div
            className="glass-card overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Video preview - top */}
            <div className="aspect-video bg-mist overflow-hidden">
              <video
                src={TAVUS_VIDEO_URL}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-mist mb-5">
                <Video className="w-4 h-4 text-ink" />
                <span className="text-sm font-medium text-ink">Video AI</span>
              </div>

              <h3 className="text-2xl font-bold text-ink mb-3">
                VVideo
              </h3>

              <p className="text-slate mb-6">
                Photorealistic AI video agents that have real conversations with your leads on web and landing pages.
              </p>

              <ul className="space-y-3">
                {[
                  'Photorealistic video avatars',
                  'Real-time lip sync & expressions',
                  'Custom personas per client',
                  'Perfect for web leads',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-charcoal">
                    <Check className="w-4 h-4 text-ink flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* VVoice AI Card */}
          <motion.div
            className="glass-card overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Voice waveform visual - top */}
            <div className="aspect-video bg-ink flex items-center justify-center">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 mb-4">
                  {[...Array(16)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-white rounded-full"
                      animate={{
                        height: [16, 32 + Math.random() * 24, 16],
                      }}
                      transition={{
                        duration: 0.6 + Math.random() * 0.4,
                        repeat: Infinity,
                        delay: i * 0.05,
                      }}
                    />
                  ))}
                </div>
                <span className="text-xs font-medium text-white/60 uppercase tracking-wider">VVoice Active</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-mist mb-5">
                <Phone className="w-4 h-4 text-ink" />
                <span className="text-sm font-medium text-ink">Voice AI</span>
              </div>

              <h3 className="text-2xl font-bold text-ink mb-3">
                VVoice
              </h3>

              <p className="text-slate mb-6">
                Natural voice AI agents that handle phone calls, qualify leads, and book appointments automatically.
              </p>

              <ul className="space-y-3">
                {[
                  'Natural voice conversations',
                  'Inbound & outbound calls',
                  'Intelligent interruption handling',
                  'Perfect for phone leads',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-charcoal">
                    <Check className="w-4 h-4 text-ink flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
