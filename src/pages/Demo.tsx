import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, CheckCircle2, Headphones, Calendar } from "lucide-react";
import { toast } from "sonner";

const expectations = [
  "Maria will answer in under 3 seconds",
  "She'll ask qualifying questions just like a real agent",
  "She'll book an appointment directly to our calendar",
  "The whole call is typically 2-3 minutes"
];

export default function Demo() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Demo request received! Maria will call you shortly.");
  };

  return (
    <Layout>
      <section className="section-padding min-h-[calc(100vh-5rem)]">
        <div className="container-wide">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Headphones className="h-4 w-4" />
              Live AI Demo
            </div>
            <h1 className="text-4xl lg:text-display-sm font-semibold text-foreground mb-4">
              Meet Maria — Your AI Sales Agent
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience a live conversation with Maria. She'll qualify you as a prospect and book an appointment directly to our calendar — just like she would for your business.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start max-w-5xl mx-auto">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
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
                      <p className="text-sm text-muted-foreground">Experience the Voxaris AI in action</p>
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

                    <Button 
                      type="submit" 
                      variant="hero" 
                      size="xl" 
                      className="w-full mt-6"
                    >
                      Talk to Maria Now
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

            {/* What to Expect */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="bg-secondary/50 rounded-2xl p-8">
                <h3 className="font-semibold text-foreground mb-6 text-lg">
                  What to expect
                </h3>
                <ul className="space-y-4">
                  {expectations.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-card rounded-2xl border border-border p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground">Real-time booking</h4>
                </div>
                <p className="text-muted-foreground text-sm">
                  Maria will check real availability and book your appointment directly to our calendar — no back-and-forth emails needed.
                </p>
              </motion.div>

              <p className="text-sm text-muted-foreground mt-6">
                This is a live AI demonstration. Your information is used only for this demo.
              </p>
            </motion.div>
          </div>

          {/* After demo CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mt-20 pt-12 border-t border-border"
          >
            <h3 className="text-2xl font-semibold text-foreground mb-3">
              Ready to see this in your business?
            </h3>
            <p className="text-muted-foreground mb-6">
              Book a personalized demo to see how Maria would work for your specific use case.
            </p>
            <Button variant="heroOutline" size="lg" asChild>
              <a href="/book-demo">Book a Personalized Demo</a>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
