import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function BookDemo() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    businessType: "",
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
      toast.success("Demo request submitted! We'll be in touch within 24 hours.");
    } catch {
      toast.error("Something went wrong. Please try again or call 407-759-4100.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Book a Demo — See V·TEAMS AI in Action | Voxaris</title>
        <meta name="description" content="Schedule a personalized demo. See how V·TEAMS handles lead response, qualification, and appointment booking with warm transfers across your squad 24/7." />
        <meta name="keywords" content="book demo, V·TEAMS demo, multi-agent AI demo, Voxaris demo, AI agent squad, warm transfer AI, schedule demo" />
        <link rel="canonical" href="https://voxaris.io/book-demo" />
        <meta property="og:title" content="Book a Demo — See V·TEAMS AI in Action | Voxaris" />
        <meta property="og:description" content="Schedule a personalized demo. See how V·TEAMS handles lead response, qualification, and appointment booking with warm transfers across your squad 24/7." />
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
                See how Voxaris can transform your operations
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-10">
                Schedule a personalized demo with our team. We'll walk you through how Voxaris handles lead response, qualification, and appointment booking for businesses like yours.
              </p>

              <div className="space-y-6">
                <h3 className="font-semibold text-foreground">What you'll learn:</h3>
                {[
                  "How Voxaris responds to leads within seconds",
                  "How Maria handles real sales conversations",
                  "How appointments flow into your calendar and CRM",
                  "How to deploy across multiple locations or clients",
                  "Pricing and implementation timeline"
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
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
                      <Calendar className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-foreground">Request a Demo</h2>
                      <p className="text-sm text-muted-foreground">We'll respond within 24 hours</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          required
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          placeholder="Smith"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          required
                          className="h-12"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Work Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
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
                      <Label htmlFor="businessType">Business Type</Label>
                      <select
                        id="businessType"
                        value={formData.businessType}
                        onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                        required
                        className="flex h-12 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      >
                        <option value="">Select your business type</option>
                        <option value="agency">Marketing Agency</option>
                        <option value="dealership">Auto Dealership / Dealer Group</option>
                        <option value="home-services">Home Services</option>
                        <option value="multi-location">Multi-Location Business</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Anything else we should know? (Optional)</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us about your current lead management challenges..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="min-h-[100px]"
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
                      Demo Request Received
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Thank you for your interest in Voxaris. Our team will reach out within 24 hours to schedule your personalized demo.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      In the meantime, feel free to explore our{" "}
                      <a href="/how-it-works" className="text-foreground underline">
                        How It Works
                      </a>{" "}
                      page.
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
