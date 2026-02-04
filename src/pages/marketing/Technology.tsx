import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Zap, Server, Lock, Globe, Code, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar, Footer } from '@/components/marketing';
import { GradientMesh } from '@/components/marketing/backgrounds/GradientMesh';

const techFeatures = [
  {
    icon: Zap,
    title: 'Sub-3s Response',
    description: 'Industry-leading latency for natural, human-like conversations.',
  },
  {
    icon: Server,
    title: 'Enterprise Infrastructure',
    description: 'BullMQ queues, Redis caching, and automatic failover for 99.9% uptime.',
  },
  {
    icon: Lock,
    title: 'AES-256 Encryption',
    description: 'All data encrypted at rest and in transit. Your credentials are always secure.',
  },
  {
    icon: Shield,
    title: 'SOC 2 Compliant',
    description: 'Enterprise-grade security controls and compliance (Type II in progress).',
  },
  {
    icon: Globe,
    title: 'Multi-Tenant Architecture',
    description: 'Built from day one to support agencies with hundreds of clients.',
  },
  {
    icon: Code,
    title: 'Full API Access',
    description: 'REST API and webhooks for custom integrations and workflows.',
  },
];

const integrations = [
  'GoHighLevel',
  'Salesforce (Coming Soon)',
  'HubSpot (Coming Soon)',
  'Zapier',
  'REST API',
  'Webhooks',
];

export function Technology() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <GradientMesh />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy-50 border border-navy-100 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-sm font-medium text-navy-700">100% Proprietary Technology</span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl font-bold text-navy-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Built for Enterprise Scale
          </motion.h1>

          <motion.p
            className="max-w-2xl mx-auto text-lg text-platinum-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Our proprietary AI technology is built from the ground up for reliability, security, and scale.
          </motion.p>
        </div>
      </section>

      {/* Architecture Diagram */}
      <section className="pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="rounded-2xl bg-white border border-platinum-200 shadow-card p-8 lg:p-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-navy-900 text-center mb-8">
              Voxaris Architecture
            </h2>

            {/* Simple architecture visualization */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {['Lead Sources', 'Voxaris AI Engine', 'Your CRM'].map((label, i) => (
                <div key={label} className="text-center">
                  <div className={`h-24 rounded-xl flex items-center justify-center font-medium ${
                    i === 1
                      ? 'bg-navy-900 text-white'
                      : 'bg-platinum-100 border border-platinum-200 text-navy-900'
                  }`}>
                    {label}
                  </div>
                  {i < 2 && (
                    <div className="flex justify-end -mr-8 mt-2">
                      <ArrowRight className="w-6 h-6 text-platinum-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="grid sm:grid-cols-3 gap-4 text-center text-sm text-platinum-600">
              <div>Web Forms, Phone, Chat</div>
              <div>Video AI + Voice AI + Orchestration</div>
              <div>Leads, Appointments, Analytics</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tech Features */}
      <section className="py-20 bg-platinum-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-3xl font-bold text-navy-900 text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Enterprise-Grade Features
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="card-modern p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-12 h-12 rounded-xl bg-navy-900 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-navy-900 mb-2">{feature.title}</h3>
                <p className="text-platinum-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            className="text-3xl font-bold text-navy-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Integration Ecosystem
          </motion.h2>

          <motion.p
            className="text-platinum-600 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Connect Voxaris to your existing tools and workflows.
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {integrations.map((integration) => (
              <div
                key={integration}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-platinum-50 border border-platinum-200"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-navy-800">{integration}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-navy-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            className="text-3xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Ready to See It in Action?
          </motion.h2>

          <Link to="/demo">
            <Button
              size="lg"
              className="bg-white hover:bg-platinum-100 text-navy-900 px-8 h-12 rounded-xl shadow-elevated"
            >
              Book a Demo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
