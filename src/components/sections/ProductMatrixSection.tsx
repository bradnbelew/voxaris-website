import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Video, Phone, Brain, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const pillars = [
  {
    icon: Video,
    accent: true,
    title: "Interactive CVI",
    tagline: "Premium FaceTime Interface",
    description: "The crown jewel. A real-time video interface for high-conversion sales and visual diagnostics. Your brand has a face that can FaceTime your customers.",
    features: [
      "Synchronous video consultations",
      "Visual diagnostic capabilities",
      "Talking Postcards outbound",
      "Real-time facial recognition",
      "Emotion-aware responses"
    ],
    useCase: "Perfect for: Complex sales, service diagnostics, luxury experiences",
    href: "/book-demo"
  },
  {
    icon: Phone,
    accent: false,
    title: "Autonomous Agents",
    tagline: "Voice Intelligence 24/7",
    description: "High-fidelity inbound and outbound voice agents that never sleep. Handle every call, qualify every lead, book every appointment.",
    features: [
      "Inbound call handling",
      "Outbound campaign automation",
      "Lead qualification & routing",
      "CRM integration & updates",
      "Multi-language support"
    ],
    useCase: "Perfect for: Dealerships, agencies, service businesses",
    href: "/solutions/dealerships"
  },
  {
    icon: Brain,
    accent: false,
    title: "Agentic Web Ecosystems",
    tagline: "The Brain for Your Business",
    description: "AI-powered digital assets that serve as the intelligent backbone. Websites that think, forms that qualify, and workflows that execute.",
    features: [
      "Intelligent web interfaces",
      "Smart form qualification",
      "Automated workflow triggers",
      "Knowledge base integration",
      "Cross-platform orchestration"
    ],
    useCase: "Perfect for: Scaling operations, consistent brand delivery",
    href: "/solutions/agencies"
  }
];

export default function ProductMatrixSection() {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-secondary/10" />
      
      <div className="container-wide relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm text-muted-foreground font-medium mb-6">
            <Sparkles className="w-4 h-4 text-cyan" />
            The Voxaris Stack
          </span>
          
          <h2 className="text-3xl lg:text-heading font-semibold text-foreground mb-4">
            Three Pillars of Intelligence
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A complete ecosystem of conversational AI—from face-to-face video to autonomous voice to intelligent web systems.
          </p>
        </motion.div>

        {/* Pillars grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`glass rounded-3xl p-8 flex flex-col h-full transition-all duration-300 ${
                pillar.accent 
                  ? "border-cyan/30 shadow-cyan/10 hover:shadow-cyan/20" 
                  : "hover:border-cyan/20"
              }`}
            >
              {/* Badge for premium */}
              {pillar.accent && (
                <div className="mb-4">
                  <span className="px-3 py-1 text-xs font-medium bg-cyan/20 text-cyan rounded-full">
                    FLAGSHIP
                  </span>
                </div>
              )}

              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${
                pillar.accent ? "bg-cyan/20" : "bg-secondary"
              }`}>
                <pillar.icon className={`h-7 w-7 ${pillar.accent ? "text-cyan" : "text-foreground"}`} />
              </div>
              
              {/* Title & tagline */}
              <h3 className="text-2xl font-semibold text-foreground mb-1">
                {pillar.title}
              </h3>
              <p className={`text-sm font-medium mb-4 ${pillar.accent ? "text-cyan" : "text-muted-foreground"}`}>
                {pillar.tagline}
              </p>
              
              {/* Description */}
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {pillar.description}
              </p>
              
              {/* Features */}
              <ul className="space-y-2 mb-6 flex-grow">
                {pillar.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <div className={`w-1.5 h-1.5 rounded-full mt-2 ${pillar.accent ? "bg-cyan" : "bg-muted-foreground"}`} />
                    <span className="text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>
              
              {/* Use case */}
              <p className="text-xs text-muted-foreground mb-6 italic">
                {pillar.useCase}
              </p>
              
              {/* CTA */}
              <Link to={pillar.href}>
                <Button 
                  variant={pillar.accent ? "hero" : "heroOutline"} 
                  className={`w-full ${pillar.accent ? "bg-cyan-glow hover:shadow-cyan" : ""}`}
                >
                  {pillar.accent ? "Experience CVI" : "Learn More"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
