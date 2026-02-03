import { Layers, Users, Settings, BarChart3, Palette, DollarSign } from 'lucide-react';
import { SolutionTemplate } from './SolutionTemplate';

const painPoints = [
  {
    title: 'Scaling Client Campaigns',
    description: 'Managing lead response for multiple clients requires expensive staff and complex tooling.',
  },
  {
    title: 'Manual Lead Handling',
    description: 'Your team spends hours on repetitive tasks that could be automated.',
  },
  {
    title: 'Inconsistent Service Quality',
    description: 'Different team members provide different experiences, hurting client retention.',
  },
];

const features = [
  {
    icon: Layers,
    title: 'Full White-Label',
    description: 'Your brand, your clients, zero Voxaris footprint. Complete rebrandability.',
  },
  {
    icon: Users,
    title: 'Multi-Tenant Dashboard',
    description: 'Manage all your clients from a single admin interface.',
  },
  {
    icon: Palette,
    title: 'Custom Branding',
    description: 'Each client gets their own branded AI agents and experience.',
  },
  {
    icon: DollarSign,
    title: 'Reseller Pricing',
    description: 'Wholesale pricing so you can mark up and create recurring revenue.',
  },
  {
    icon: BarChart3,
    title: 'Client Analytics',
    description: 'Detailed reporting for each client to prove your value.',
  },
  {
    icon: Settings,
    title: 'API Access',
    description: 'Full API access for custom integrations and workflows.',
  },
];

export function SolutionAgencies() {
  return (
    <SolutionTemplate
      industry="Agencies"
      headline="White-Label AI Agents for Agencies"
      subheadline="Add AI-powered lead conversion to your service offering. Your brand, your clients, our technology."
      painPoints={painPoints}
      features={features}
      cta="Partner With Voxaris"
      gradient="purple"
    />
  );
}
