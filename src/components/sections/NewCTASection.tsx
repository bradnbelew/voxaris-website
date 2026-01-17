import { motion } from "framer-motion";
import { Play, ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function NewCTASection() {
  return (
    <section className="relative section-padding overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 mesh-gradient" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[200px] pointer-events-none" />
      
      <div className="container-editorial relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          {/* Eyebrow */}
          <span className="eyebrow mb-6 block">Experience the Difference</span>

          {/* Main headline */}
          <h2 className="headline-xl text-foreground mb-8 max-w-4xl mx-auto">
            See it. Hear it.
            <br />
            <span className="text-primary">Believe it.</span>
          </h2>

          {/* Description */}
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Talk to Maria right now and experience what the future of customer engagement feels like.
          </p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Link to="/demo">
              <Button 
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full px-10 h-16 text-lg shadow-glow hover:shadow-glow-lg transition-all animate-pulse-glow"
              >
                <Play className="h-5 w-5 mr-2 fill-current" />
                Talk to Maria Now
              </Button>
            </Link>
            
            <span className="text-muted-foreground">or</span>
            
            <Link to="/book-demo">
              <Button 
                variant="outline"
                size="lg"
                className="rounded-full px-10 h-16 text-lg border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all"
              >
                Schedule a Demo
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </motion.div>

          {/* Phone number */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center justify-center gap-2 text-muted-foreground"
          >
            <Phone className="w-4 h-4" />
            <span className="text-sm">Or call us directly:</span>
            <a href="tel:+13215550000" className="text-primary font-medium hover:underline">
              (321) 555-VOXR
            </a>
          </motion.div>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20 pt-12 border-t border-border/30"
        >
          <p className="text-center text-sm text-muted-foreground mb-8">
            Trusted by forward-thinking businesses
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-40">
            {["Gulf Coast Mitsubishi", "Hill Nissan", "Premier Auto Group", "Legacy Motors"].map((name) => (
              <div key={name} className="px-6 py-2 text-foreground font-display font-bold text-lg">
                {name}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
