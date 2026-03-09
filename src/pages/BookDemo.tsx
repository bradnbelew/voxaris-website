import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, CheckCircle, Loader2, Phone, CalendarCheck, Clock } from "lucide-react";
import { toast } from "sonner";

export default function BookDemo() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    company: "",
    locations: "",
    message: ""
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
    <Layout>
      <Helmet>
        <title>Book a V·TEAMS Demo | Voxaris</title>
        <meta name="description" content="See V·TEAMS handle a live call. 15-minute demo — no pitch deck, just a walkthrough of how V·TEAMS would work for your business." />
        <meta name="keywords" content="book demo, V·TEAMS demo, AI sales demo, Voxaris demo, AI phone agent demo, AI team demo" />
        <link rel="canonical" href="https://voxaris.io/book-demo" />
        <meta property="og:title" content="Book a V·TEAMS Demo | Voxaris" />
        <meta property="og:description" content="See V·TEAMS handle a live call. 15-minute demo — receptionist, qualifier, specialist, closer working together in real time." />
        <meta property="og:url" content="https://voxaris.io/book-demo" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://voxaris.io/og-image.png" />
        <meta name="twitter:image" content="https://voxaris.io/og-image.png" />
      </Helmet>
      <section className="section-padding min-h-[calc(100vh-5rem)]">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 block">
                Book a Demo
              </span>
              <h1 className="text-4xl lg:text-display-sm font-semibold text-foreground mb-6">
                See V·TEAMS handle a live call.
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-10">
                15 minutes. No pitch deck. We'll show you exactly how V·TEAMS answers, qualifies, and books appointments for businesses like yours.
              </p>

              <div className="space-y-6 mb-10">
                <h3 className="font-semibold text-foreground">What happens in the demo:</h3>
                {[
                  "Hear V·TEAMS answer a live inbound call",
                  "See the receptionist → qualifier → closer handoff in action",
                  "Watch context pass seamlessly across every transfer",
                  "See how appointments and transcripts sync to your CRM",
                  "Get your timeline and implementation plan"
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>

              {/* What happens next */}
              <div className="bg-muted/50 rounded-2xl p-6 border border-border">
                <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">What happens next</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold shrink-0">1</div>
                    <div>
                      <div className="text-sm font-medium text-foreground">You submit the form</div>
                      <div className="text-xs text-muted-foreground">Takes 30 seconds.</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold shrink-0">2</div>
                    <div>
                      <div className="text-sm font-medium text-foreground">Ethan reaches out to schedule</div>
                      <div className="text-xs text-muted-foreground">Same business day, usually within hours.</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold shrink-0">3</div>
                    <div>
                      <div className="text-sm font-medium text-foreground">15-minute walkthrough, tailored to your business</div>
                      <div className="text-xs text-muted-foreground">Your process, your hours, your CRM.</div>
                    </div>
                  </div>
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
                <div className="bg-card rounded-3xl border border-border p-8 lg:p-10 shadow-elegant">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                      <CalendarCheck className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-foreground">Request a Demo</h2>
                      <p className="text-sm text-muted-foreground">Same-day response. Usually within hours.</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        placeholder="John Smith"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 555-5555"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name</Label>
                      <Input
                        id="company"
                        placeholder="Acme Corp"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        required
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="locations">Number of Locations (Optional)</Label>
                      <Input
                        id="locations"
                        placeholder="e.g. 3"
                        value={formData.locations}
                        onChange={(e) => setFormData({ ...formData, locations: e.target.value })}
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Anything else? (Optional)</Label>
                      <Textarea
                        id="message"
                        placeholder="Current challenges, questions, timing..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="min-h-[80px]"
                      />
                    </div>

                    <Button type="submit" variant="hero" size="xl" className="w-full mt-6" disabled={submitting}>
                      {submitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Request Demo
                          <ArrowRight className="h-5 w-5" />
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground pt-2">
                      Or skip the form — call <a href="tel:+14077594100" className="font-medium text-foreground underline underline-offset-2">(407) 759-4100</a> and talk to our AI agent right now.
                    </p>
                  </form>
                </div>
              ) : (
                <div className="bg-card rounded-3xl border border-border p-8 lg:p-10 shadow-elegant text-center">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-foreground mb-3">
                      You're on the list.
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      Ethan will reach out same business day to schedule your demo. Usually within a few hours.
                    </p>
                    <p className="text-sm text-muted-foreground mb-6">
                      In the meantime, hear V·TEAMS handle a live call on our{" "}
                      <a href="/demo" className="text-foreground underline underline-offset-2 font-medium">
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
    </Layout>
  );
}
