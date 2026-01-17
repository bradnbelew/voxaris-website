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
    <section className="section-padding bg-background">
      <div className="container-editorial">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-xl mx-auto"
        >
          {/* Headline */}
          <h2 className="headline-lg text-foreground mb-8">
            Experience it yourself.
          </h2>

          {/* Primary CTA */}
          <Button
            size="lg"
            className="bg-foreground hover:bg-obsidian text-background font-medium rounded-lg px-10 h-14 text-base transition-colors duration-200 mb-6"
            onClick={handleStartDemo}
            disabled={isLoading}
          >
            {isLoading ? "Connecting..." : "Start a Live Demo"}
          </Button>

          {/* Secondary option */}
          <p className="text-muted-foreground text-sm">
            or call{" "}
            <a href="tel:+13215551234" className="text-foreground hover:underline font-medium">
              (321) 555-1234
            </a>
            {" "}for a human
          </p>
        </motion.div>
      </div>
    </section>
  );
}
