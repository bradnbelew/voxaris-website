import { Car, Clock, CreditCard, Phone, Calendar, Users } from 'lucide-react';
import { SolutionTemplate } from './SolutionTemplate';

const painPoints = [
  {
    title: 'Missed After-Hours Leads',
    description: 'Most dealerships miss 40% of leads that come in after business hours. Those customers go to your competitors.',
  },
  {
    title: 'Slow BDC Response',
    description: 'Average BDC response time is 45+ minutes. By then, the lead has already moved on to the next dealer.',
  },
  {
    title: 'High Staffing Costs',
    description: 'Maintaining a full BDC team costs $200k+ annually, and turnover means constantly training new staff.',
  },
];

const features = [
  {
    icon: Phone,
    title: 'Instant Lead Response',
    description: 'Respond to every web lead and phone inquiry in under 3 seconds, 24/7.',
  },
  {
    icon: Car,
    title: 'Inventory Integration',
    description: 'AI knows your current inventory and can discuss specific vehicles with customers.',
  },
  {
    icon: Calendar,
    title: 'Test Drive Scheduling',
    description: 'Automatically schedule test drives and showroom visits right on the call.',
  },
  {
    icon: CreditCard,
    title: 'Finance Pre-Qualification',
    description: 'Qualify customers for financing before they arrive, streamlining the sale.',
  },
  {
    icon: Clock,
    title: 'After-Hours Coverage',
    description: 'Never miss an after-hours lead again. AI handles evenings, weekends, and holidays.',
  },
  {
    icon: Users,
    title: 'CRM Auto-Sync',
    description: 'Every conversation automatically syncs to your DMS and CRM system.',
  },
];

export function SolutionDealerships() {
  return (
    <SolutionTemplate
      industry="Dealerships"
      headline="AI Sales Agents for Auto Dealerships"
      subheadline="Respond to every lead instantly, schedule test drives automatically, and never miss an after-hours opportunity again."
      painPoints={painPoints}
      features={features}
      cta="See How Dealerships Increased Appointments 40%"
      gradient="purple"
    />
  );
}
