import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const REPLICA_ID = "r9fa0878977a";
const PERSONA_ID = "p5332d853291";

export default function FinalCTASection() {
  const [isLoading, setIsLoading] = useState(false);

  const handleStartDemo = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-tavus-conversation', {
        body: {
          replica_id: REPLICA_ID,
          persona_id: PERSONA_ID,
          custom_greeting: "Hello! I'm here to help. What can I do for you today?",
          conversational_context: "You are a helpful Voxaris CVI agent demonstrating real-time video AI capabilities."
        }
      });

      if (error) throw error;

      if (data?.conversation_url) {
        window.open(data.conversation_url, '_blank');
        toast.success("Conversation started!");
      } else {
        throw new Error("No conversation URL returned");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to start conversation.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="section-padding section-dark">
      <div className="container-editorial">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          {/* Headline */}
          <h2 className="headline-xl text-white mb-6">
            Experience it yourself.
          </h2>

          {/* Subheadline */}
          <p className="text-lg text-silver max-w-xl mx-auto mb-12">
            Talk to Maria. See the technology. Make your decision.
          </p>

          {/* CTA Button */}
          <Button 
            size="lg"
            onClick={handleStartDemo}
            disabled={isLoading}
            className="bg-white hover:bg-snow text-ink font-semibold rounded-full px-10 h-16 text-lg shadow-lg hover:shadow-xl transition-all"
          >
            {isLoading ? "Connecting..." : "Start a Conversation"}
          </Button>

          {/* Phone number */}
          <p className="mt-8 text-silver text-sm">
            or call <a href="tel:+13215550000" className="text-white hover:underline">(321) XXX-XXXX</a> for a human
          </p>
        </motion.div>
      </div>
    </section>
  );
}
