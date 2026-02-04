import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Navbar, Footer } from '@/components/marketing';
import { GradientMesh } from '@/components/marketing/backgrounds/GradientMesh';

const benefits = [
  'See AI video and voice agents in action',
  'Learn how to 3x your appointment bookings',
  'Get a custom implementation plan',
  'No commitment required',
];

export function Demo() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    industry: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would send to your backend/CRM
    console.log('Demo request:', formData);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="relative pt-32 pb-20 overflow-hidden">
        <GradientMesh />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-4xl sm:text-5xl font-bold text-navy-900 mb-6">
                See Voxaris
                <br />
                <span className="gradient-text-navy">
                  in Action
                </span>
              </h1>

              <p className="text-lg text-platinum-600 mb-8">
                Book a personalized demo and discover how AI agents can transform your lead conversion.
              </p>

              <ul className="space-y-4 mb-8">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span className="text-platinum-700">{benefit}</span>
                  </li>
                ))}
              </ul>

              {/* Video placeholder */}
              <div className="aspect-video rounded-xl bg-platinum-100 border border-platinum-200 flex items-center justify-center shadow-card">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-navy-900 flex items-center justify-center mb-4 cursor-pointer hover:scale-105 transition-transform shadow-glow-navy">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                  <p className="text-platinum-600">Watch a 2-minute overview</p>
                </div>
              </div>
            </motion.div>

            {/* Right side - Form */}
            <motion.div
              className="bg-white rounded-2xl border border-platinum-200 shadow-elevated p-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-navy-900 mb-4">You're All Set!</h3>
                  <p className="text-platinum-600 mb-6">
                    We'll reach out within 24 hours to schedule your personalized demo.
                  </p>
                  <Button
                    onClick={() => setSubmitted(false)}
                    variant="outline"
                    className="border-platinum-300 text-navy-900 hover:bg-platinum-50"
                  >
                    Submit Another Request
                  </Button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-navy-900 mb-2">Book Your Demo</h2>
                  <p className="text-platinum-600 mb-6">Fill out the form and we'll be in touch within 24 hours.</p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Input
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="bg-platinum-50 border-platinum-200 text-navy-900 placeholder:text-platinum-500 h-12 focus:border-navy-500 focus:ring-navy-500"
                      />
                    </div>

                    <div>
                      <Input
                        type="email"
                        placeholder="Work Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="bg-platinum-50 border-platinum-200 text-navy-900 placeholder:text-platinum-500 h-12 focus:border-navy-500 focus:ring-navy-500"
                      />
                    </div>

                    <div>
                      <Input
                        placeholder="Company Name"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        required
                        className="bg-platinum-50 border-platinum-200 text-navy-900 placeholder:text-platinum-500 h-12 focus:border-navy-500 focus:ring-navy-500"
                      />
                    </div>

                    <div>
                      <Input
                        type="tel"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="bg-platinum-50 border-platinum-200 text-navy-900 placeholder:text-platinum-500 h-12 focus:border-navy-500 focus:ring-navy-500"
                      />
                    </div>

                    <div>
                      <select
                        value={formData.industry}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                        required
                        className="w-full h-12 px-3 rounded-md bg-platinum-50 border border-platinum-200 text-navy-900 appearance-none focus:border-navy-500 focus:ring-1 focus:ring-navy-500 focus:outline-none"
                      >
                        <option value="" className="bg-white text-platinum-500">Select your industry</option>
                        <option value="dealership" className="bg-white text-navy-900">Auto Dealership</option>
                        <option value="law-firm" className="bg-white text-navy-900">Law Firm</option>
                        <option value="contractor" className="bg-white text-navy-900">Contractor / Home Services</option>
                        <option value="agency" className="bg-white text-navy-900">Marketing Agency</option>
                        <option value="other" className="bg-white text-navy-900">Other</option>
                      </select>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-navy-900 hover:bg-navy-800 text-white rounded-xl shadow-glow-navy hover:shadow-glow-navy-lg transition-all"
                    >
                      Book My Demo
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>

                    <p className="text-xs text-platinum-500 text-center">
                      By submitting, you agree to our Privacy Policy and Terms of Service.
                    </p>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
