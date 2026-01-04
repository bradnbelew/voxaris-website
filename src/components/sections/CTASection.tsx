import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Phone } from "lucide-react";
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
          {/* Decorative gradient */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary-foreground/5 blur-3xl -translate-y-1/2 translate-x-1/4" />
          
          <div className="relative max-w-2xl">
            <h2 className="text-3xl lg:text-4xl font-semibold mb-4">
              See Voxaris in action
            </h2>
            <p className="text-lg text-primary-foreground/70 mb-8 leading-relaxed">
              Book a demo to see how Voxaris can transform your lead response, appointment booking, and CRM operations — or have Maria call you directly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/book-demo">
                <Button 
                  variant="secondary" 
                  size="xl" 
                  className="w-full sm:w-auto bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                >
                  Book a Demo
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/demo">
                <Button 
                  variant="outline" 
                  size="xl" 
                  className="w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Phone className="h-5 w-5" />
                  Have Maria Call You
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
