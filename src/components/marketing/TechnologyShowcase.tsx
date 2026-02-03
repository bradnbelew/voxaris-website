import { motion } from 'framer-motion';
import { Video, Phone } from 'lucide-react';

const TAVUS_VIDEO_URL = "https://cdn.replica.tavus.io/20283/9de1f64e.mp4";

export function TechnologyShowcase() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-xs font-medium tracking-widest uppercase text-accent-500 mb-4 block">
            Technology
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-navy-900 mb-4">
            Proprietary AI
            <span className="italic text-navy-600"> technology</span>
          </h2>
          <p className="text-platinum-600 max-w-2xl mx-auto">
            Built from the ground up for enterprise scale. 100% Voxaris technology.
          </p>
        </motion.div>

        {/* Two cards side by side */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Video AI Card */}
          <motion.div
            className="group relative rounded-2xl overflow-hidden bg-cream-100 border border-platinum-200 shadow-card hover:shadow-card-hover transition-all duration-300"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Content */}
            <div className="p-8 lg:p-10">
              {/* Icon badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-50 border border-accent-200 mb-6">
                <Video className="w-4 h-4 text-accent-500" />
                <span className="text-sm font-medium text-navy-700">Video AI</span>
              </div>

              <h3 className="font-serif text-2xl font-medium text-navy-900 mb-4">
                Voxaris Video AI
              </h3>

              <ul className="space-y-3 mb-8">
                {[
                  'Photorealistic video avatars',
                  'Real-time lip sync & expressions',
                  'Custom personas per client',
                  'Perfect for web leads & landing pages',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-platinum-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-500" />
                    {item}
                  </li>
                ))}
              </ul>

              {/* Video preview */}
              <div className="aspect-video rounded-xl overflow-hidden bg-white border border-platinum-200 shadow-sm">
                <video
                  src={TAVUS_VIDEO_URL}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
            </div>
          </motion.div>

          {/* Voice AI Card */}
          <motion.div
            className="group relative rounded-2xl overflow-hidden bg-cream-100 border border-platinum-200 shadow-card hover:shadow-card-hover transition-all duration-300"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Content */}
            <div className="p-8 lg:p-10">
              {/* Icon badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-50 border border-accent-200 mb-6">
                <Phone className="w-4 h-4 text-accent-500" />
                <span className="text-sm font-medium text-navy-700">Voice AI</span>
              </div>

              <h3 className="font-serif text-2xl font-medium text-navy-900 mb-4">
                Voxaris Voice AI
              </h3>

              <ul className="space-y-3 mb-8">
                {[
                  'Natural voice conversations',
                  'Handles inbound & outbound calls',
                  'Intelligent interruption handling',
                  'Perfect for phone leads & follow-ups',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-platinum-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-500" />
                    {item}
                  </li>
                ))}
              </ul>

              {/* Voice waveform visual */}
              <div className="aspect-video rounded-xl bg-white border border-platinum-200 shadow-sm flex items-center justify-center">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-4">
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 bg-gradient-to-t from-accent-500 to-accent-400 rounded-full"
                        animate={{
                          height: [20, 40 + Math.random() * 30, 20],
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay: i * 0.1,
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-platinum-500">Voice AI Active</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
