import { motion } from "framer-motion";
import { Link2, Check } from "lucide-react";

const integrationCategories = [
  {
    name: "CRMs",
    description: "Push leads and outcomes directly",
    integrations: [
      { name: "GoHighLevel", popular: true },
      { name: "Salesforce" },
      { name: "HubSpot" },
      { name: "Zoho CRM" },
      { name: "CDK Global", popular: true },
      { name: "VinSolutions" },
      { name: "DealerSocket" },
      { name: "ServiceTitan", popular: true }
    ]
  },
  {
    name: "Lead Sources",
    description: "Connect your inbound channels",
    integrations: [
      { name: "Facebook Ads", popular: true },
      { name: "Google Ads", popular: true },
      { name: "Website Forms" },
      { name: "Typeform" },
      { name: "Phone Systems" },
      { name: "Landing Pages" },
      { name: "Carfax" },
      { name: "Cars.com" }
    ]
  },
  {
    name: "Calendars",
    description: "Book directly into your schedule",
    integrations: [
      { name: "Google Calendar", popular: true },
      { name: "Outlook" },
      { name: "Calendly" },
      { name: "Acuity" },
      { name: "Cal.com" },
      { name: "ScheduleOnce" }
    ]
  },
  {
    name: "Communication",
    description: "Get notified your way",
    integrations: [
      { name: "Slack", popular: true },
      { name: "Microsoft Teams" },
      { name: "Email" },
      { name: "SMS" },
      { name: "Webhooks" },
      { name: "Zapier" }
    ]
  }
];

export default function IntegrationsSection() {
  return (
    <section className="section-padding bg-secondary/30">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 text-sm font-medium text-primary mb-4">
            <Link2 className="w-4 h-4" />
            Flexible Integrations
          </span>
          <h2 className="text-3xl lg:text-heading font-semibold text-foreground mb-4">
            Connects to Your Stack in Hours
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            50+ integrations ready to go. If we don't connect to it yet, we'll build it for our pilot customers.
          </p>
        </motion.div>

        {/* Integration categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {integrationCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              className="bg-card rounded-2xl border border-border p-6 lg:p-8"
            >
              <h3 className="text-lg font-semibold text-foreground mb-1">
                {category.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                {category.description}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {category.integrations.map((integration) => (
                  <div
                    key={integration.name}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                      integration.popular
                        ? "bg-primary/10 text-foreground border border-primary/20"
                        : "bg-secondary/50 text-muted-foreground border border-border/50"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    {integration.name}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Custom integration CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-card border border-border">
            <span className="text-foreground font-medium">Don't see your tool?</span>
            <span className="text-muted-foreground">Pilot customers get custom integrations built free.</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
