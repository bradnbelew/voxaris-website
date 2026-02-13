import { Phone, Clock, Calendar, ShieldCheck, Bell, Users } from 'lucide-react';
import { SolutionTemplate } from './SolutionTemplate';

const painPoints = [
  {
    title: 'Missed Calls on the Job Site',
    description: "When you're on a roof, you can't answer the phone. Every missed call is a lost job — and homeowners call the next contractor on their list.",
  },
  {
    title: 'Storm Season Overwhelm',
    description: 'After a hailstorm, you get 200 calls in a day. Your team can handle 20. The other 180 go to your competitors.',
  },
  {
    title: 'Slow Insurance Follow-Up',
    description: "Insurance jobs require constant follow-up. Leads go cold when you're juggling active projects and can't stay on top of every claim.",
  },
];

const features = [
  {
    icon: Phone,
    title: 'Instant Call Answering',
    description: 'AI answers every call in under 3 seconds — even when your whole crew is on a job site.',
  },
  {
    icon: ShieldCheck,
    title: 'Storm-Damage Lead Qualification',
    description: 'AI gathers damage details, address, insurance info, and urgency level before you ever pick up the phone.',
  },
  {
    icon: Calendar,
    title: 'Roof Inspection Scheduling',
    description: 'Automatically book inspections into your calendar. No phone tag, no back-and-forth.',
  },
  {
    icon: Bell,
    title: 'Insurance Claim Pre-Qualification',
    description: 'AI collects policy info and damage documentation to streamline the claims process.',
  },
  {
    icon: Clock,
    title: 'After-Hours & Weekend Coverage',
    description: "Homeowners call when they find the leak — nights, weekends, holidays. You'll never miss one again.",
  },
  {
    icon: Users,
    title: 'CRM Auto-Sync',
    description: 'Every lead, call, and appointment automatically syncs to your CRM system.',
  },
];

export function SolutionContractors() {
  return (
    <SolutionTemplate
      industry="Roofing Contractors"
      headline="AI Agents for Roofing Contractors"
      subheadline="Never miss a storm-damage lead again. AI answers every call, qualifies every prospect, and books inspections — even while you're on the roof."
      painPoints={painPoints}
      features={features}
      cta="Never Miss Another Roofing Lead"
    />
  );
}
