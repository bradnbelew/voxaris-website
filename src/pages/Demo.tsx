import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Phone, CheckCircle2, Headphones } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const expectations = [
  "Maria will answer in under 3 seconds",
  "She'll ask qualifying questions just like a real agent",
  "She'll book an appointment directly to our calendar",
  "The whole call is typically 2-3 minutes"
];

export default function Demo() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    company: "",
    interest: "",
    leadVolume: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Build tags based on interest
      const tags = ["demo_request", "maria_live_demo", "source_website"];
      if (formData.interest === "agency") {
        tags.push("primary_interest_agency");
      } else if (formData.interest === "dealership") {
        tags.push("primary_interest_dealership");
      } else {
        tags.push("primary_interest_other");
      }

      // Push contact to Go High Level via edge function
      const { data: ghlData, error: ghlError } = await supabase.functions.invoke('ghl-webhook', {
        body: {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          email: formData.email,
          company: formData.company,
          interest: formData.interest,
          leadVolume: formData.leadVolume,
          tags: tags,
        },
      });

      console.log('GHL Response:', ghlData);

      if (ghlError) {
        console.error('Error from GHL webhook:', ghlError);
        // Continue anyway - we still want to make the call
      }

      // Create outbound call via Retell with dynamic LLM variables
      const { data: callData, error: callError } = await supabase.functions.invoke('create-call', {
        body: {
          phone: formData.phone,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          company: formData.company,
          industry: formData.interest,
        },
      });

      console.log('Retell call response:', callData);

      if (callError) {
        console.error('Error creating call:', callError);
        toast.error("Failed to initiate call. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
              Live Experience
            </div>
            <h1 className="text-4xl lg:text-display-sm font-semibold text-foreground mb-4">
              Experience Voxaris live
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Maria will call you immediately. Experience a real AI sales conversation — qualification, objection handling, and appointment booking.
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
                      <p className="text-sm text-muted-foreground">She'll call you within seconds</p>
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
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        placeholder="Your company name"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        required
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="interest">Industry</Label>
                      <Input
                        id="interest"
                        placeholder="e.g. Marketing Agency, Auto Dealership, Law Firm"
                        value={formData.interest}
                        onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="leadVolume">Monthly Lead Volume (optional)</Label>
                      <Select 
                        value={formData.leadVolume} 
                        onValueChange={(value) => setFormData({ ...formData, leadVolume: value })}
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under-100">Under 100</SelectItem>
                          <SelectItem value="100-500">100-500</SelectItem>
                          <SelectItem value="500-1000">500-1,000</SelectItem>
                          <SelectItem value="1000-5000">1,000-5,000</SelectItem>
                          <SelectItem value="over-5000">Over 5,000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      type="submit" 
                      variant="hero" 
                      size="xl" 
                      className="w-full mt-6"
                      disabled={isLoading}
                    >
                      {isLoading ? "Connecting..." : "Call Me Now"}
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
                    {/* Calling state */}
                    <div className="relative w-32 h-32 mx-auto mb-8">
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
                          className="w-20 h-20 rounded-full bg-primary flex items-center justify-center"
                        >
                          <Phone className="h-10 w-10 text-primary-foreground" />
                        </motion.div>
                      </div>
                    </div>

                    <h2 className="text-2xl font-semibold text-foreground mb-3">
                      Calling now
                    </h2>
                    <p className="text-muted-foreground mb-8">
                      Pick up your phone. Maria is calling you from a local number.
                    </p>

                    <p className="text-sm text-muted-foreground">
                      If you miss the call, refresh and try again.
                    </p>

                    <button 
                      onClick={() => setSubmitted(false)}
                      className="mt-6 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                      Try again
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

              <div className="mt-6 bg-card rounded-2xl border border-border p-6">
                <h4 className="font-semibold text-foreground mb-3">This is a live demo</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Maria will speak with you as if you were a real prospect. She'll qualify you, answer questions, and attempt to book an appointment to our calendar.
                </p>
              </div>

              <p className="text-sm text-muted-foreground mt-6">
                Your information is used only for this demo and is not shared.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
