import { motion } from 'framer-motion';
import { Video, Phone, Mic, MessageSquare } from 'lucide-react';

export function TechnologyShowcase() {
  return (
    <section className="py-24 bg-gradient-to-b from-navy-900 to-navy-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Proprietary AI Technology
          </h2>
          <p className="text-platinum-400 max-w-2xl mx-auto">
            Built from the ground up for enterprise scale. 100% Voxaris technology.
          </p>
        </motion.div>

        {/* Two cards side by side */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Video AI Card */}
          <motion.div
            className="group relative rounded-3xl overflow-hidden"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Gradient border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-700 rounded-3xl" />
            <div className="absolute inset-[2px] bg-navy-800 rounded-3xl" />

            {/* Content */}
            <div className="relative p-8 lg:p-10">
              {/* Icon badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
                <Video className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-purple-400">Video AI</span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-4">
                Voxaris Video AI
              </h3>

              <ul className="space-y-3 mb-8">
                {[
                  'Photorealistic video avatars',
                  'Real-time lip sync & expressions',
                  'Custom personas per client',
                  'Perfect for web leads & landing pages',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-platinum-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    {item}
                  </li>
                ))}
              </ul>

              {/* Visual placeholder */}
              <div className="aspect-video rounded-xl bg-navy-900/50 border border-white/5 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                    <Video className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-sm text-platinum-500">Live Video Agent Preview</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Voice AI Card */}
          <motion.div
            className="group relative rounded-3xl overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Gradient border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-pink-700 rounded-3xl" />
            <div className="absolute inset-[2px] bg-navy-800 rounded-3xl" />

            {/* Content */}
            <div className="relative p-8 lg:p-10">
              {/* Icon badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 mb-6">
                <Phone className="w-4 h-4 text-pink-400" />
                <span className="text-sm font-medium text-pink-400">Voice AI</span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-4">
                Voxaris Voice AI
              </h3>

              <ul className="space-y-3 mb-8">
                {[
                  'Natural voice conversations',
                  'Handles inbound & outbound calls',
                  'Intelligent interruption handling',
                  'Perfect for phone leads & follow-ups',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-platinum-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                    {item}
                  </li>
                ))}
              </ul>

              {/* Visual placeholder - voice waveform */}
              <div className="aspect-video rounded-xl bg-navy-900/50 border border-white/5 flex items-center justify-center">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-4">
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 bg-gradient-to-t from-pink-500 to-pink-400 rounded-full"
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
