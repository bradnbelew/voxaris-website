import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Car, Wrench, Scale, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";

const audiences = [
  {
    icon: Car,
    title: "Car Dealerships",
    description: "Convert internet leads and phone-ups into showroom appointments",
    href: "/solutions/dealerships"
  },
  {
    icon: Wrench,
    title: "Contractors",
    description: "Answer emergency calls and book estimates 24/7",
    href: "/solutions/contractors"
  },
  {
    icon: Scale,
    title: "Law Firms",
    description: "Never miss an intake call, book consultations automatically",
    href: "/solutions/law-firms"
  },
  {
    icon: Megaphone,
    title: "Marketing Agencies",
    description: "White-label AI infrastructure for your clients",
    href: "/solutions/agencies"
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
            Built for businesses where every lead counts
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Voxaris is designed for industries that can't afford to miss a single opportunity.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {audiences.map((audience, index) => (
            <motion.div
              key={audience.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-2xl border border-border p-6 hover:shadow-elegant transition-shadow duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4">
                <audience.icon className="h-6 w-6 text-foreground" />
              </div>
              
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {audience.title}
              </h3>
              
              <p className="text-muted-foreground text-sm mb-4">
                {audience.description}
              </p>

              <Link to={audience.href} className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                Learn more
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
