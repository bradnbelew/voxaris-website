import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar, Footer, GradientOrbs } from '@/components/marketing';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Starter',
    price: '$299',
    period: '/mo',
    description: 'Perfect for small businesses getting started with AI',
    features: [
      '1 AI agent (video OR voice)',
      '500 conversations/month',
      'Email support',
      'Basic analytics',
      'CRM integration',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Professional',
    price: '$799',
    period: '/mo',
    description: 'For growing businesses that need more power',
    features: [
      '3 AI agents (video AND voice)',
      '2,000 conversations/month',
      'Priority support',
      'Advanced analytics',
      'Custom agent personas',
      'API access',
      'Webhook integrations',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For agencies and large organizations',
    features: [
      'Unlimited AI agents',
      'Unlimited conversations',
      'Full white-label dashboard',
      'Dedicated success manager',
      'Custom integrations',
      'SLA guarantee',
      'Reseller pricing available',
      'Priority feature requests',
    ],
    cta: 'Talk to Sales',
    popular: false,
  },
];

const faqs = [
  {
    question: 'What counts as a conversation?',
    answer: 'A conversation is counted each time an AI agent engages with a lead, whether via video or voice. A single lead visiting multiple times counts as multiple conversations.',
  },
  {
    question: 'Can I change plans later?',
    answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.',
  },
  {
    question: 'What CRMs do you integrate with?',
    answer: 'We have native integration with GoHighLevel. Integrations with Salesforce, HubSpot, and other major CRMs are coming soon. In the meantime, you can use our API or Zapier.',
  },
  {
    question: 'Is there a free trial?',
    answer: 'Yes! All plans come with a 14-day free trial. No credit card required to get started.',
  },
  {
    question: 'How does white-labeling work?',
    answer: "With our Enterprise plan, you get a fully white-labeled dashboard that your clients access under your brand. There's no mention of Voxaris anywhere in the client experience.",
  },
];

export function Pricing() {
  return (
    <div className="min-h-screen bg-navy-900">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <GradientOrbs />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-4xl sm:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Simple, Transparent Pricing
          </motion.h1>
          <motion.p
            className="max-w-2xl mx-auto text-lg text-platinum-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Start free for 14 days. No credit card required.
          </motion.p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                className={cn(
                  'relative rounded-2xl p-8',
                  plan.popular
                    ? 'bg-gradient-to-b from-purple-500/10 to-transparent border-2 border-purple-500/50'
                    : 'bg-navy-800/50 border border-white/5'
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium">
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-platinum-400">{plan.period}</span>
                  </div>
                  <p className="text-sm text-platinum-500 mt-2">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-platinum-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/demo" className="block">
                  <Button
                    className={cn(
                      'w-full h-12',
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0'
                        : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                    )}
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-navy-800/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-3xl font-bold text-white text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Frequently Asked Questions
          </motion.h2>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                className="p-6 rounded-xl bg-navy-800 border border-white/5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="text-lg font-semibold text-white mb-2">{faq.question}</h3>
                <p className="text-platinum-400">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
