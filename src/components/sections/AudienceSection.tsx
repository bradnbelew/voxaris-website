import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Megaphone, Car } from "lucide-react";
import { Button } from "@/components/ui/button";

const audiences = [
  {
    icon: Megaphone,
    title: "Marketing Agencies",
    description: "Running Meta, Google, or outbound campaigns? Voxaris gives you higher conversion rates for your clients — and a new revenue stream for your agency.",
    features: [
      "White-label and semi-white-label options",
      "Deploy AI sales systems at scale",
      "Real attribution across campaigns",
      "Resell infrastructure, not just services"
    ],
    cta: "Solutions for Agencies",
    href: "/solutions/agencies"
  },
  {
    icon: Car,
    title: "Car Dealerships",
    description: "New or used, single rooftop or dealer group — Voxaris puts more appointments on your board and more buyers in your showroom.",
    features: [
      "Instant response to every lead",
      "Missed-call recovery",
      "Appointment confirmation and reminders",
      "Inbound qualification and booking"
    ],
    cta: "Solutions for Dealerships",
    href: "/solutions/dealerships"
  }
];

export default function AudienceSection() {
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
            Built for operators who need results
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Voxaris is designed for businesses and agencies that can't afford to lose leads — and want infrastructure that scales.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {audiences.map((audience, index) => (
            <motion.div
              key={audience.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="bg-card rounded-3xl border border-border p-8 lg:p-10 hover:shadow-elegant transition-shadow duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-6">
                <audience.icon className="h-7 w-7 text-foreground" />
              </div>
              
              <h3 className="text-2xl font-semibold text-foreground mb-3">
                {audience.title}
              </h3>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {audience.description}
              </p>
              
              <ul className="space-y-3 mb-8">
                {audience.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-foreground mt-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link to={audience.href}>
                <Button variant="outline" className="group">
                  {audience.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
