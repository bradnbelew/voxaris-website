import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function Demo() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    businessType: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
    toast.success("Demo request received! Maria will call you shortly.");
  };

  return (
    <Layout>
      <section className="section-padding min-h-[calc(100vh-5rem)]">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 block">
                Live Demo Experience
              </span>
              <h1 className="text-4xl lg:text-display-sm font-semibold text-foreground mb-6">
                Experience Voxaris in action
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Submit your details and Maria — our AI sales agent — will call you within moments to demonstrate how Voxaris handles real sales conversations.
              </p>

              <div className="bg-secondary/50 rounded-2xl p-6 mb-8">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  What to expect
                </h3>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground mt-2 flex-shrink-0" />
                    Maria will call you within 60 seconds
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground mt-2 flex-shrink-0" />
                    She'll introduce herself and simulate a qualification call
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground mt-2 flex-shrink-0" />
                    You'll experience real AI conversation — not a recording
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground mt-2 flex-shrink-0" />
                    The call lasts 2-3 minutes
                  </li>
                </ul>
              </div>

              <p className="text-sm text-muted-foreground">
                This is a live AI demonstration. Your information is used only for this demo.
              </p>
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
                      <Phone className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-foreground">Have Maria call you</h2>
                      <p className="text-sm text-muted-foreground">Fill out the form below</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
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
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
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
                        <option value="dealership">Car Dealership</option>
                        <option value="home-services">Home Services</option>
                        <option value="multi-location">Multi-Location Business</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <Button type="submit" variant="hero" size="xl" className="w-full mt-6">
                      Start Demo Call
                      <Phone className="h-5 w-5" />
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
                    <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-6">
                      <Phone className="h-10 w-10 text-primary-foreground" />
                    </div>
                    <h2 className="text-2xl font-semibold text-foreground mb-3">
                      Maria is calling you now
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Pick up your phone to experience the Voxaris AI demo. The call will come from a local number.
                    </p>
                    
                    {/* Animated rings */}
                    <div className="relative w-32 h-32 mx-auto">
                      {[1, 2, 3].map((i) => (
                        <motion.div
                          key={i}
                          className="absolute inset-0 rounded-full border-2 border-primary/30"
                          animate={{
                            scale: [1, 2],
                            opacity: [0.5, 0]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.5,
                            ease: "easeOut"
                          }}
                        />
                      ))}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="w-16 h-16 rounded-full bg-primary flex items-center justify-center"
                        >
                          <Phone className="h-8 w-8 text-primary-foreground" />
                        </motion.div>
                      </div>
                    </div>

                    <button 
                      onClick={() => setSubmitted(false)}
                      className="mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Didn't receive a call? Try again
                    </button>
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
