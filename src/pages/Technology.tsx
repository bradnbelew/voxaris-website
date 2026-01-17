import { motion } from "framer-motion";
import { Eye, Brain, Smile, Video, MessageSquare, Globe, Zap, Users, FileText, Languages } from "lucide-react";
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
    highlight: "Eliminates the 'uncanny valley,' ensuring your brand's digital twin is indistinguishable from the real person."
  },
  {
    id: "v-sight",
    label: "V-Sight",
    title: "V-Sight Perception",
    subtitle: "The Eyes",
    icon: Eye,
    description: "Our proprietary Perception Model that allows your AI agent to 'see' the customer. It detects engagement, eye contact, and emotional cues.",
    highlight: "Allows the agent to pivot the conversation if a customer looks confused or uninterested."
  },
  {
    id: "v-flow",
    label: "V-Flow",
    title: "V-Flow Orchestration",
    subtitle: "The Brain",
    icon: Brain,
    description: "An advanced Transformer-based model that manages the 'human' flow of the call. It handles interruption management—the AI stops when you speak.",
    highlight: "Masters the art of the 'meaningful pause,' so the conversation feels fluid, not robotic."
  }
];

const dvpFeatures = [
  {
    icon: Users,
    title: "Digital Twins",
    description: "We create high-fidelity Digital Replicas of your leadership or sales team."
  },
  {
    icon: Zap,
    title: "Mass-Scale Customization",
    description: "Generate thousands of 1-on-1 video messages where your Twin references specific CRM data points, names, and vehicle history automatically."
  },
  {
    icon: Languages,
    title: "Multilingual Expansion",
    description: "Instantly localize your outreach into 30+ languages while maintaining the original voice profile and perfect lip-sync."
  }
];

const cviFeatures = [
  {
    icon: Video,
    title: "Synchronous Video Calls",
    description: "Our 'Killer App.' Launch 2-way, real-time video calls directly within your website or via our Talking Postcards."
  },
  {
    icon: MessageSquare,
    title: "Sub-Second Latency",
    description: "Engineered for ultra-low latency, ensuring the 'FaceTime' experience feels instantaneous and natural."
  },
  {
    icon: FileText,
    title: "Knowledge-Grounded Reasoning",
    description: "Every Voxaris agent is grounded in your specific Knowledge Base (PDFs, CRMs, Service Manuals), ensuring 100% accurate, zero-hallucination answers."
  }
];

export default function Technology() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 to-transparent" />
        
        <div className="container-editorial relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground mb-4">
              <Brain className="w-4 h-4" />
              Proprietary Technology
            </span>
            
            <h1 className="headline-xl text-foreground mb-6">
              The Living Interface
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              We don't just animate video; we simulate human presence through three integrated neural engines. This is the Voxaris Intelligence Suite—our proprietary edge.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link to="/demo">Experience It Live</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/book-demo">Book a Demo</Link>
              </Button>
            </div>
          </motion.div>
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
            className="mb-16"
          >
            <h2 className="headline-lg text-foreground mb-4">
              The Core Neural Architecture
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Three integrated engines working in harmony to create authentic human presence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {neuralEngines.map((engine, index) => (
              <motion.div
                key={engine.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="group relative"
              >
                <div className="h-full p-8 bg-secondary/30 rounded-2xl border border-border hover:border-foreground/20 transition-all duration-300">
                  {/* Label badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-foreground text-background text-xs font-semibold rounded-full mb-6">
                    <engine.icon className="w-3.5 h-3.5" />
                    {engine.label}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-foreground mb-1">
                    {engine.title}
                  </h3>
                  <p className="text-sm font-medium text-muted-foreground mb-4">
                    {engine.subtitle}
                  </p>
                  
                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {engine.description}
                  </p>
                  
                  {/* Highlight */}
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-foreground font-medium">
                      {engine.highlight}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Architecture Diagram Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16 p-8 lg:p-12 bg-foreground rounded-2xl text-center"
          >
            <div className="flex flex-wrap justify-center items-center gap-6 lg:gap-12">
              {neuralEngines.map((engine, index) => (
                <div key={engine.id} className="flex items-center gap-6 lg:gap-12">
                  <div className="text-center">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-background/10 flex items-center justify-center mx-auto mb-3">
                      <engine.icon className="w-8 h-8 lg:w-10 lg:h-10 text-background" />
                    </div>
                    <p className="text-background font-semibold text-sm lg:text-base">{engine.label}</p>
                    <p className="text-background/60 text-xs">{engine.subtitle}</p>
                  </div>
                  {index < neuralEngines.length - 1 && (
                    <div className="hidden lg:flex items-center gap-2 text-background/40">
                      <div className="w-8 h-px bg-background/30" />
                      <Globe className="w-4 h-4" />
                      <div className="w-8 h-px bg-background/30" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-8 text-background/60 text-sm">
              Integrated Neural Network • Real-Time Processing • Human-Grade Output
            </p>
          </motion.div>
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
            className="mb-16"
          >
            <h2 className="headline-lg text-foreground mb-4">
              Product Capabilities
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Powered by the Living Interface, Voxaris delivers two transformative product lines.
            </p>
          </motion.div>

          {/* DVP Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="p-8 lg:p-10 bg-background rounded-2xl border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-foreground flex items-center justify-center">
                  <Video className="w-5 h-5 text-background" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Dynamic Video Personalization</h3>
                  <p className="text-sm text-muted-foreground">DVP</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {dvpFeatures.map((feature, index) => (
                  <div key={feature.title} className="p-5 bg-secondary/50 rounded-xl">
                    <feature.icon className="w-6 h-6 text-foreground mb-3" />
                    <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* CVI Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="p-8 lg:p-10 bg-background rounded-2xl border-2 border-foreground relative overflow-hidden">
              {/* Flagship badge */}
              <div className="absolute top-4 right-4 px-3 py-1 bg-foreground text-background text-xs font-bold rounded-full">
                FLAGSHIP
              </div>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-foreground flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-background" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Conversational Video Interface</h3>
                  <p className="text-sm text-muted-foreground">CVI</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cviFeatures.map((feature, index) => (
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
      <section className="section-padding bg-foreground">
        <div className="container-editorial text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="headline-lg text-background mb-4">
              Experience the Living Interface
            </h2>
            <p className="text-lg text-background/70 max-w-xl mx-auto mb-8">
              See how Voxaris transforms customer engagement with AI that truly understands.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" variant="secondary">
                <Link to="/demo">Try Maria Live</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-background/30 text-background hover:bg-background/10">
                <Link to="/book-demo">Schedule a Call</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}