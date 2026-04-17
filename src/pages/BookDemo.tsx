import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Navbar, Footer } from "@/components/marketing";
import { ArrowRight, CheckCircle, Loader2, CalendarCheck } from "lucide-react";
import { toast } from "sonner";

export default function BookDemo() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    company: "",
    locations: "",
    message: "",
    smsConsent: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/book-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, submitted_at: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error('Failed');
      setSubmitted(true);
      toast.success("Demo request submitted!");
    } catch {
      toast.error("Something went wrong. Please try again or call 407-759-4100.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <Helmet>
        <title>Book a Voxaris AI Demo | Voxaris</title>
        <meta name="description" content="See Voxaris AI handle a live call. 15-minute demo — no pitch deck, just a walkthrough of how Voxaris AI would work for your business." />
        <meta name="keywords" content="book demo, Voxaris AI demo, AI sales demo, Voxaris demo, AI phone agent demo, AI team demo" />
        <link rel="canonical" href="https://voxaris.io/book-demo" />
        <meta property="og:title" content="Book a Voxaris AI Demo | Voxaris" />
        <meta property="og:description" content="See Voxaris AI handle a live call. 15-minute demo — receptionist, qualifier, specialist, closer working together in real time." />
        <meta property="og:url" content="https://voxaris.io/book-demo" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://voxaris.io/og-image.png" />
        <meta name="twitter:image" content="https://voxaris.io/og-image.png" />
      </Helmet>
      <section className="pt-28 pb-20 min-h-[calc(100vh-64px)]">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="eyebrow mb-4 block">
                Book a Demo
              </span>
              <h1 className="text-4xl lg:text-display-sm font-light text-white mb-6">
                See Voxaris AI handle a live call.
              </h1>
              <p className="text-lg text-white/50 leading-relaxed mb-10">
                15 minutes. No pitch deck. We'll show you exactly how Voxaris AI answers, qualifies, and books appointments for businesses like yours.
              </p>

              <div className="space-y-4 mb-10">
                <p className="text-[11px] font-mono text-white/30 uppercase tracking-[0.1em]">What happens in the demo</p>
                {[
                  "Hear Voxaris AI answer a live inbound call",
                  "See the receptionist → qualifier → closer handoff in action",
                  "Watch context pass seamlessly across every transfer",
                  "See how appointments and transcripts sync to your CRM",
                  "Get your timeline and implementation plan"
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-gold-500 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                    <span className="text-[14px] text-white/60">{item}</span>
                  </div>
                ))}
              </div>

              {/* What happens next */}
              <div className="rounded-2xl p-6 border border-white/[0.07] bg-white/[0.03]">
                <p className="text-[11px] font-mono text-white/30 uppercase tracking-[0.1em] mb-5">What happens next</p>
                <div className="space-y-5">
                  {[
                    { num: '1', title: 'You submit the form', sub: 'Takes 30 seconds.' },
                    { num: '2', title: 'Ethan reaches out to schedule', sub: 'Same business day, usually within hours.' },
                    { num: '3', title: '15-minute walkthrough, tailored to your business', sub: 'Your process, your hours, your CRM.' },
                  ].map((step) => (
                    <div key={step.num} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-white/[0.08] flex items-center justify-center text-[11px] font-mono text-white/40 shrink-0">{step.num}</div>
                      <div>
                        <div className="text-[13px] font-medium text-white/75">{step.title}</div>
                        <div className="text-[11px] text-white/30">{step.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {!submitted ? (
                <div className="rounded-3xl border border-white/[0.07] bg-white/[0.03] p-8 lg:p-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-full bg-gold-500/15 border border-gold-500/20 flex items-center justify-center">
                      <CalendarCheck className="h-4 w-4 text-gold-400" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h2 className="text-[15px] font-medium text-white">Request a Demo</h2>
                      <p className="text-[12px] text-white/35">Same-day response. Usually within hours.</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-7">
                    {[
                      { id: 'name', label: 'Your Name', type: 'text', placeholder: 'John Smith', required: true, value: formData.name, onChange: (v: string) => setFormData({ ...formData, name: v }) },
                      { id: 'phone', label: 'Phone Number', type: 'tel', placeholder: '(555) 555-5555', required: true, value: formData.phone, onChange: (v: string) => setFormData({ ...formData, phone: v }) },
                      { id: 'company', label: 'Company Name', type: 'text', placeholder: 'Acme Corp', required: true, value: formData.company, onChange: (v: string) => setFormData({ ...formData, company: v }) },
                      { id: 'locations', label: 'Number of Locations', type: 'text', placeholder: 'e.g. 3', required: false, value: formData.locations, onChange: (v: string) => setFormData({ ...formData, locations: v }) },
                    ].map((field) => (
                      <div key={field.id} className="space-y-1.5">
                        <label htmlFor={field.id} className="block text-[10px] font-mono text-white/35 uppercase tracking-[0.1em]">
                          {field.label}{!field.required && <span className="ml-1 text-white/20">— optional</span>}
                        </label>
                        <input
                          id={field.id}
                          type={field.type}
                          placeholder={field.placeholder}
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          required={field.required}
                          className="w-full h-11 bg-transparent border-0 border-b border-white/[0.12] text-white text-[14px] placeholder:text-white/20 focus:outline-none focus:border-white/35 transition-colors pb-2"
                        />
                      </div>
                    ))}

                    <div className="space-y-1.5">
                      <label htmlFor="message" className="block text-[10px] font-mono text-white/35 uppercase tracking-[0.1em]">
                        Anything else? <span className="ml-1 text-white/20">— optional</span>
                      </label>
                      <textarea
                        id="message"
                        placeholder="Current challenges, questions, timing..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={3}
                        className="w-full bg-transparent border-0 border-b border-white/[0.12] text-white text-[14px] placeholder:text-white/20 focus:outline-none focus:border-white/35 transition-colors resize-none pb-2 pt-1"
                      />
                    </div>

                    {/* SMS Consent */}
                    <div className="flex items-start gap-3" data-consent="sms-optin" data-required="false">
                      <input
                        type="checkbox"
                        id="smsConsent"
                        name="sms_consent"
                        aria-label="SMS consent checkbox — optional"
                        aria-required="false"
                        checked={formData.smsConsent}
                        onChange={(e) => setFormData({ ...formData, smsConsent: e.target.checked })}
                        className="mt-0.5 h-3.5 w-3.5 rounded-sm border-white/20 bg-transparent text-gold-500 focus:ring-gold-500 shrink-0"
                      />
                      <label htmlFor="smsConsent" className="text-[11px] text-white/25 leading-relaxed">
                        I consent to receive recurring automated marketing and promotional text messages, service notifications, appointment reminders, and AI-powered phone calls from Voxaris LLC at the phone number provided. Consent is not a condition of purchase. Msg &amp; data rates may apply. Text STOP to opt out.
                      </label>
                    </div>
                    <p className="text-[11px] text-white/20 -mt-4 ml-[26px]">
                      <a href="/privacy" className="text-white/35 hover:text-white/60 transition-colors underline underline-offset-2">Privacy Policy</a>
                      {" · "}
                      <a href="/terms" className="text-white/35 hover:text-white/60 transition-colors underline underline-offset-2">Terms of Service</a>
                    </p>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full h-12 rounded-full bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-500 hover:via-gold-400 hover:to-gold-500 text-white text-[14px] font-semibold border border-gold-400/30 shadow-gold-btn transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Request Demo
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>

                    <p className="text-[11px] text-center text-white/25 pt-1">
                      Or call <a href="tel:+14077594100" className="text-white/45 hover:text-white transition-colors">(407) 759-4100</a> and talk to our AI agent right now.
                    </p>
                  </form>
                </div>
              ) : (
                <div className="rounded-3xl border border-white/[0.07] bg-white/[0.03] p-8 lg:p-10 text-center">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="w-16 h-16 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="h-8 w-8 text-gold-400" strokeWidth={1.5} />
                    </div>
                    <h2 className="text-2xl font-light text-white mb-3">
                      You're on the list.
                    </h2>
                    <p className="text-white/50 mb-4 text-[14px]">
                      Ethan will reach out same business day to schedule your demo. Usually within a few hours.
                    </p>
                    <p className="text-[13px] text-white/30 mb-6">
                      In the meantime, hear Voxaris AI handle a live call on our{" "}
                      <a href="/demo" className="text-white/60 hover:text-white transition-colors underline underline-offset-2">
                        demo page
                      </a>.
                    </p>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
