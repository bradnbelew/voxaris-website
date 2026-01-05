import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Building2, Car, Wrench, Scale, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const primarySolutions = [
  {
    icon: Building2,
    title: "For Marketing Agencies",
    description: "Deploy AI-powered lead response across your client portfolio. Standardized workflows, centralized reporting, optional white-label delivery.",
    features: [
      "Increase appointment rate on paid leads",
      "Standardized deployments per client",
      "Centralized workflow logic and reporting",
      "Optional white-label delivery"
    ],
    cta: "See Agency Solution",
    href: "/solutions/agencies"
  },
  {
    icon: Car,
    title: "For Dealerships & Dealer Groups",
    description: "Book more showroom appointments with instant lead response, missed call recovery, and after-hours coverage.",
    features: [
      "Book more showroom appointments",
      "Missed call recovery and after-hours coverage",
      "Proper qualification and routing",
      "CRM updates and internal alerts"
    ],
    cta: "See Dealer Solution",
    href: "/solutions/dealerships"
  }
];

const additionalIndustries = [
  { icon: Wrench, name: "Contractors", href: "/solutions/contractors" },
  { icon: Scale, name: "Law Firms", href: "/solutions/law-firms" },
  { icon: Home, name: "Home Services", href: "/solutions/contractors" }
];

export default function SolutionsSplitSection() {
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
            Solutions built for your industry
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Purpose-built workflows for the businesses that need speed-to-lead the most.
          </p>
        </motion.div>

        {/* Primary solutions - two premium panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {primarySolutions.map((solution, index) => (
            <motion.div
              key={solution.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-3xl border border-border p-8 lg:p-10 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <solution.icon className="h-7 w-7 text-primary" />
              </div>
              
              <h3 className="text-2xl font-semibold text-foreground mb-3">
                {solution.title}
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {solution.description}
              </p>
              
              <ul className="space-y-3 mb-8">
                {solution.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-foreground text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link to={solution.href}>
                <Button variant="heroOutline" className="w-full sm:w-auto">
                  {solution.cta}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Additional industries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-secondary/40 rounded-2xl p-8 text-center"
        >
          <h4 className="text-sm uppercase tracking-wider text-muted-foreground font-medium mb-6">
            Additional industries supported
          </h4>
          <div className="flex flex-wrap justify-center gap-4">
            {additionalIndustries.map((industry) => (
              <Link
                key={industry.name}
                to={industry.href}
                className="flex items-center gap-2 px-5 py-3 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all duration-200"
              >
                <industry.icon className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium text-foreground">{industry.name}</span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
