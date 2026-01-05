import { motion } from "framer-motion";
import { Phone, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function LiveDemoSection() {
  return (
    <section className="section-padding">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground p-10 lg:p-16 text-center"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-primary-foreground/5 blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-primary-foreground/5 blur-3xl translate-y-1/2 -translate-x-1/4" />
          
          <div className="relative max-w-2xl mx-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="w-20 h-20 rounded-full bg-primary-foreground/10 flex items-center justify-center mx-auto mb-8"
            >
              <Phone className="h-10 w-10 text-primary-foreground" />
            </motion.div>

            <h2 className="text-3xl lg:text-4xl font-semibold mb-4">
              Talk to Maria right now
            </h2>
            <p className="text-lg text-primary-foreground/70 mb-8 leading-relaxed">
              Experience Voxaris in action. Our AI agent Maria will demonstrate how she handles real sales conversations — qualifying leads and booking appointments in real-time.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link to="/demo">
                <Button 
                  variant="secondary" 
                  size="xl" 
                  className="w-full sm:w-auto bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Start Live Demo
                </Button>
              </Link>
              <Link to="/demo">
                <Button 
                  variant="outline" 
                  size="xl" 
                  className="w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Try Web Chat Demo
                </Button>
              </Link>
            </div>

            <p className="text-sm text-primary-foreground/50">
              This is a real AI agent. Ask it to qualify you for a test drive, emergency service, or legal consultation.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
