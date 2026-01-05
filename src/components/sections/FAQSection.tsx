import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How fast can this be installed, and what do you need from us?",
    answer: "Most installations are complete within 5-7 business days. We need access to your CRM (GoHighLevel), your calendar system, and a brief intake call to understand your qualification criteria and booking rules. We handle everything else."
  },
  {
    question: "Will Maria sound robotic?",
    answer: "No. Maria uses advanced voice AI that sounds natural and conversational. She responds in context, handles interruptions gracefully, and adapts her tone to the conversation. Most callers don't realize they're speaking with AI."
  },
  {
    question: "What happens if the lead doesn't answer?",
    answer: "Maria automatically follows up according to your configured schedule — typically 3-5 attempts over several days. Each attempt is logged in your CRM with full visibility into the follow-up sequence."
  },
  {
    question: "What happens if they don't book on the first call?",
    answer: "Maria captures the conversation outcome and schedules appropriate follow-up. She'll re-engage the lead at the right time with context from previous conversations, increasing conversion over time."
  },
  {
    question: "How does Voxaris connect to my CRM?",
    answer: "Voxaris integrates natively with GoHighLevel as the central hub. Contacts are created, updated, and tagged automatically. Call recordings, transcripts, and summaries are attached to each contact record."
  },
  {
    question: "Can this work outside dealerships?",
    answer: "Yes. While we specialize in marketing agencies and car dealerships, Voxaris supports contractors, law firms, home services, and other appointment-based businesses. The qualification logic and workflows are customized for each industry."
  }
];

export default function FAQSection() {
  return (
    <section className="section-padding">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-heading font-semibold text-foreground mb-4">
            Common questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            What you need to know before getting started.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card rounded-2xl border border-border px-6 data-[state=open]:shadow-lg transition-shadow duration-200"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
