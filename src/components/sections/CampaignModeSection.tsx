import { motion } from "framer-motion";
import { 
  Megaphone, 
  Zap, 
  Moon, 
  Link2, 
  CalendarCheck,
  TrendingUp
} from "lucide-react";

const features = [
  {
    icon: Megaphone,
    title: "Campaign-First Design",
    description: "Every conversation references your specific promotion, event, or offer. Maria knows the details.",
    highlight: "Promotion-aware"
  },
  {
    icon: Zap,
    title: "Speed Architecture",
    description: "22-second average response time. Engineered for speed, not retrofitted. 10x faster than human teams.",
    highlight: "22-sec response"
  },
  {
    icon: Moon,
    title: "After-Hours Capture",
    description: "Never lose a weekend, holiday, or late-night lead again. Maria works 24/7/365.",
    highlight: "Always on"
  },
  {
    icon: Link2,
    title: "CRM Native",
    description: "Works with your existing tools. 50+ integrations including GoHighLevel, Salesforce, HubSpot, and CDK.",
    highlight: "50+ integrations"
  },
  {
    icon: CalendarCheck,
    title: "Show-Up Optimization",
    description: "AI confirms and reminds prospects before appointments. Reduce no-shows by up to 40%.",
    highlight: "Reduce no-shows"
  },
  {
    icon: TrendingUp,
    title: "Real-Time Visibility",
    description: "See every call, transcript, and outcome. Track campaign ROI as it happens.",
    highlight: "Full transparency"
  }
];

export default function CampaignModeSection() {
  return (
    <section className="section-padding bg-secondary/30">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-16"
        >
          <span className="inline-flex items-center gap-2 text-sm font-medium text-primary mb-4">
            <Megaphone className="w-4 h-4" />
            Your Secret Weapon
          </span>
          <h2 className="text-3xl lg:text-heading font-semibold text-foreground mb-4">
            Built for What Actually Drives Business: Campaigns & Promotions
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            While other AI solutions handle generic inquiries, Voxaris is engineered specifically for time-sensitive campaigns where every minute counts.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="bg-card rounded-2xl p-6 lg:p-8 border border-border hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="text-xs uppercase tracking-wider text-primary font-medium mb-1">
                    {feature.highlight}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Campaign types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12"
        >
          <div className="bg-card rounded-2xl border border-border p-8">
            <h3 className="text-sm uppercase tracking-wider text-muted-foreground font-medium mb-6 text-center">
              Campaign Types We Power
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                "Sales Events",
                "Limited-Time Offers",
                "Grand Openings",
                "Seasonal Promotions",
                "Trade-In Events",
                "VIP Previews",
                "Flash Sales",
                "Holiday Campaigns",
                "Lead Generation Ads",
                "Direct Mail Responses"
              ].map((campaign) => (
                <span
                  key={campaign}
                  className="px-4 py-2 rounded-full bg-secondary/60 text-sm text-foreground border border-border/50"
                >
                  {campaign}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
