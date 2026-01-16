import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CVICallSimulator from "@/components/ui/CVICallSimulator";

export default function CTASection() {
  const [showCallSimulator, setShowCallSimulator] = useState(false);

  return (
    <section className="section-padding">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl glass-strong p-10 lg:p-16 border-cyan/20"
        >
          {/* Decorative cyan glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-cyan/10 blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-cyan/5 blur-2xl translate-y-1/2 -translate-x-1/4" />
          
          <div className="relative max-w-2xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm text-cyan font-medium mb-6">
              <Video className="w-4 h-4" />
              Experience CVI
            </span>
            
            <h2 className="text-3xl lg:text-4xl font-semibold text-foreground mb-4">
              See the future of customer interaction
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Experience Conversational Video Intelligence in action. Watch our AI persona handle real conversations, visual diagnostics, and appointment booking — live.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => setShowCallSimulator(true)}
                size="xl" 
                className="w-full sm:w-auto bg-cyan-glow hover:shadow-cyan text-background"
              >
                <Video className="h-5 w-5 mr-2" />
                Simulate CVI Call
              </Button>
              <Link to="/book-demo">
                <Button 
                  variant="heroOutline" 
                  size="xl" 
                  className="w-full sm:w-auto border-cyan/30 hover:border-cyan/60"
                >
                  Book a Demo
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      <CVICallSimulator 
        isOpen={showCallSimulator} 
        onClose={() => setShowCallSimulator(false)} 
      />
    </section>
  );
}
