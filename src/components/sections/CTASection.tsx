import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Phone, FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="section-padding">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground p-10 lg:p-16"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary-foreground/5 blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-primary-foreground/3 blur-3xl translate-y-1/2 -translate-x-1/4" />
          
          <div className="relative max-w-3xl mx-auto text-center">
            {/* Primary CTA */}
            <div className="mb-12">
              <h2 className="text-3xl lg:text-4xl font-semibold mb-4">
                Get Your Free Lead Audit
              </h2>
              <p className="text-lg text-primary-foreground/80 mb-8 leading-relaxed max-w-2xl mx-auto">
                We'll analyze your last 30 days of lead response times and show you exactly how many appointments Voxaris would have recovered.
              </p>
              
              <Link to="/book-demo">
                <Button 
                  size="xl" 
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-xl"
                >
                  <FileSearch className="h-5 w-5 mr-2" />
                  Request Free Audit
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-12">
              <div className="flex-1 h-px bg-primary-foreground/20" />
              <span className="text-sm text-primary-foreground/60 font-medium">OR</span>
              <div className="flex-1 h-px bg-primary-foreground/20" />
            </div>

            {/* Secondary CTA */}
            <div>
              <h3 className="text-xl font-semibold mb-3">
                Try Maria Right Now
              </h3>
              <p className="text-primary-foreground/70 mb-6">
                Experience a real AI conversation. Call our demo line and see how Maria handles leads.
              </p>
              
              <Link to="/demo">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Try Maria Live
                </Button>
              </Link>
            </div>

            {/* Trust element */}
            <div className="mt-12 pt-8 border-t border-primary-foreground/10">
              <div className="flex flex-wrap justify-center gap-6 text-sm text-primary-foreground/60">
                <span>✓ No credit card required</span>
                <span>✓ See results in 48 hours</span>
                <span>✓ Pilot slots limited</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
