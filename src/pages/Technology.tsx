import { motion } from "framer-motion";
import { Eye, Brain, Smile, Video, MessageSquare, Globe, Zap, Users, FileText, Languages, Cpu, Waves, Clock, Shield } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const neuralEngines = [
  {
    id: "v-sync",
    label: "V-Sync",
    title: "V-Sync Rendering",
    subtitle: "The Face",
    icon: Smile,
    description: "Our flagship Neural Rendering Engine. Unlike standard lip-sync bots, V-Sync models 3D facial geometry to capture micro-expressions, cheek movements, and ocular crinkles.",
    highlight: "Eliminates the 'uncanny valley'—your brand's digital twin is indistinguishable from the real person.",
    specs: ["3D Facial Geometry", "Micro-expression Mapping", "Real-time Rendering"]
  },
  {
    id: "v-sight",
    label: "V-Sight",
    title: "V-Sight Perception",
    subtitle: "The Eyes",
    icon: Eye,
    description: "Our proprietary Perception Model that allows your AI agent to 'see' the customer. It detects engagement, eye contact, and emotional cues in real-time.",
    highlight: "Pivots the conversation dynamically when a customer looks confused or disengaged.",
    specs: ["Engagement Detection", "Eye Contact Tracking", "Emotion Recognition"]
  },
  {
    id: "v-flow",
    label: "V-Flow",
    title: "V-Flow Orchestration",
    subtitle: "The Brain",
    icon: Brain,
    description: "An advanced Transformer-based model that manages the 'human' flow of the call. It handles interruption management—the AI stops when you speak.",
    highlight: "Masters the art of the 'meaningful pause,' so the conversation feels fluid, not robotic.",
    specs: ["Interruption Handling", "Pause Intelligence", "Context Memory"]
  }
];

const dvpFeatures = [
  {
    icon: Users,
    title: "Digital Twins",
    description: "High-fidelity Digital Replicas of your leadership or sales team, indistinguishable from the real person."
  },
  {
    icon: Zap,
    title: "Mass-Scale Personalization",
    description: "Generate thousands of 1-on-1 video messages where your Twin references specific CRM data points automatically."
  },
  {
    icon: Languages,
    title: "30+ Languages",
    description: "Instantly localize into 30+ languages while maintaining the original voice profile and perfect lip-sync."
  }
];

const cviFeatures = [
  {
    icon: Video,
    title: "Synchronous Video Calls",
    description: "Launch 2-way, real-time video calls directly within your website or via Talking Postcards."
  },
  {
    icon: Clock,
    title: "<500ms Latency",
    description: "Engineered for ultra-low latency. The 'FaceTime' experience feels instantaneous and natural."
  },
  {
    icon: Shield,
    title: "Zero Hallucinations",
    description: "Grounded in your Knowledge Base (PDFs, CRMs, Service Manuals). 100% accurate answers, guaranteed."
  }
];

const stats = [
  { value: "<500ms", label: "Response Latency", detail: "Human-grade speed" },
  { value: "0", label: "Hallucinations", detail: "Knowledge-grounded" },
  { value: "30+", label: "Languages", detail: "Native lip-sync" },
  { value: "24/7", label: "Availability", detail: "Never sleeps" },
];

export default function Technology() {
  return (
    <Layout>
      {/* Hero Section - Bold and Tech-Focused */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-foreground">
        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(hsl(var(--background) / 0.1) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(var(--background) / 0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
        </div>
        
        <div className="container-editorial relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-background/10 rounded-full text-background/80 text-sm font-medium mb-8">
              <Cpu className="w-4 h-4" />
              Proprietary Neural Architecture
            </div>
            
            <h1 className="text-[clamp(3rem,8vw,6rem)] font-bold text-background leading-[0.9] tracking-[-0.03em] mb-6">
              The Living<br />Interface
            </h1>
            
            <p className="text-xl lg:text-2xl text-background/70 leading-relaxed max-w-2xl mb-10">
              We don't animate video. We <span className="text-background font-semibold">simulate human presence</span> through three integrated neural engines. This is the Voxaris Intelligence Suite.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" variant="secondary" className="h-12 px-8 text-base font-semibold">
                <Link to="/demo">Experience It Live</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base border-background/30 text-background hover:bg-background/10">
                <Link to="/book-demo">Book a Demo</Link>
              </Button>
            </div>
          </motion.div>

          {/* Floating tech badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 flex-col gap-4"
          >
            {neuralEngines.map((engine, i) => (
              <motion.div
                key={engine.id}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 + i * 0.15 }}
                className="flex items-center gap-3 px-5 py-3 bg-background/10 backdrop-blur rounded-xl border border-background/20"
              >
                <engine.icon className="w-5 h-5 text-background" />
                <div>
                  <p className="text-sm font-semibold text-background">{engine.label}</p>
                  <p className="text-xs text-background/60">{engine.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 bg-secondary border-y border-border">
        <div className="container-editorial">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-12">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center lg:text-left"
              >
                <p className="text-3xl lg:text-4xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm font-medium text-foreground mt-1">{stat.label}</p>
                <p className="text-xs text-muted-foreground">{stat.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Neural Architecture Section */}
      <section className="section-padding bg-background">
        <div className="container-editorial">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="headline-lg text-foreground mb-4">
              The Core Neural Architecture
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three integrated engines working in perfect harmony to create authentic human presence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {neuralEngines.map((engine, index) => (
              <motion.div
                key={engine.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="group relative"
              >
                <div className="h-full p-8 bg-secondary/50 rounded-2xl border border-border hover:border-foreground/30 transition-all duration-300 hover:shadow-lg">
                  {/* Label badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-foreground text-background text-xs font-bold rounded-full mb-6">
                    <engine.icon className="w-3.5 h-3.5" />
                    {engine.label}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-foreground mb-1">
                    {engine.title}
                  </h3>
                  <p className="text-sm font-semibold text-muted-foreground mb-4">
                    {engine.subtitle}
                  </p>
                  
                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {engine.description}
                  </p>

                  {/* Specs */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {engine.specs.map((spec) => (
                      <span key={spec} className="px-2.5 py-1 bg-background rounded-md text-xs font-medium text-foreground">
                        {spec}
                      </span>
                    ))}
                  </div>
                  
                  {/* Highlight */}
                  <div className="pt-5 border-t border-border">
                    <p className="text-sm text-foreground font-semibold leading-relaxed">
                      {engine.highlight}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Capabilities Section */}
      <section className="section-padding bg-secondary/30">
        <div className="container-editorial">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="headline-lg text-foreground mb-4">
              Product Capabilities
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powered by the Living Interface, Voxaris delivers two transformative product lines.
            </p>
          </motion.div>

          {/* CVI Section - FLAGSHIP - First and Prominent */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="p-8 lg:p-12 bg-foreground rounded-3xl relative overflow-hidden">
              {/* Flagship badge */}
              <div className="absolute top-6 right-6 px-4 py-1.5 bg-background text-foreground text-xs font-bold rounded-full">
                ★ FLAGSHIP PRODUCT
              </div>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-background/10 flex items-center justify-center border border-background/20">
                  <MessageSquare className="w-7 h-7 text-background" />
                </div>
                <div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-background">Conversational Video Interface</h3>
                  <p className="text-background/60 font-medium">CVI — The Killer App</p>
                </div>
              </div>

              <p className="text-lg text-background/80 max-w-2xl mb-10">
                Real-time, face-to-face AI conversations. Your customers speak to a digital human that sees, hears, and responds—just like a video call with your best salesperson.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cviFeatures.map((feature) => (
                  <div key={feature.title} className="p-6 bg-background/10 rounded-2xl border border-background/10">
                    <feature.icon className="w-8 h-8 text-background mb-4" />
                    <h4 className="font-bold text-background text-lg mb-2">{feature.title}</h4>
                    <p className="text-sm text-background/70 leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <Button asChild size="lg" variant="secondary" className="h-12 px-8">
                  <Link to="/demo">Try CVI Live</Link>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* DVP Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="p-8 lg:p-10 bg-background rounded-2xl border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                  <Video className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Dynamic Video Personalization</h3>
                  <p className="text-sm text-muted-foreground">DVP — Scale Personal Outreach</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {dvpFeatures.map((feature) => (
                  <div key={feature.title} className="p-5 bg-secondary/50 rounded-xl">
                    <feature.icon className="w-6 h-6 text-foreground mb-3" />
                    <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-background">
        <div className="container-editorial">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="headline-lg text-foreground mb-4">
              Ready to Meet the Living Interface?
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              See how Voxaris transforms customer engagement with AI that truly understands.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="h-12 px-8 text-base font-semibold">
                <Link to="/demo">Try Maria Live</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base">
                <Link to="/book-demo">Schedule a Call</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}