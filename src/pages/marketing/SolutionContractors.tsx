import { Wrench, Clock, Phone, Calendar, DollarSign, Bell } from 'lucide-react';
import { SolutionTemplate } from './SolutionTemplate';

const painPoints = [
  {
    title: 'Missed Calls While Working',
    description: "When you're on a roof or under a sink, you can't answer the phone. Every missed call is a lost job.",
  },
  {
    title: 'Lost Quote Opportunities',
    description: 'Homeowners call 3-4 contractors and go with whoever responds first. Slow response = no job.',
  },
  {
    title: 'No After-Hours Coverage',
    description: 'Emergency calls at night go to voicemail. Those customers call someone else.',
  },
];

const features = [
  {
    icon: Phone,
    title: 'Never Miss a Call',
    description: 'AI answers every call instantly, even when you\'re on a job.',
  },
  {
    icon: Calendar,
    title: 'Service Scheduling',
    description: 'Book appointments directly into your calendar without phone tag.',
  },
  {
    icon: DollarSign,
    title: 'Quote Collection',
    description: 'Gather job details and customer info for accurate estimates.',
  },
  {
    icon: Bell,
    title: 'Emergency Routing',
    description: 'True emergencies get routed to your cell immediately.',
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'Capture after-hours leads that competitors miss.',
  },
  {
    icon: Wrench,
    title: 'Service Knowledge',
    description: 'AI knows your services and can answer common questions.',
  },
];

export function SolutionContractors() {
  return (
    <SolutionTemplate
      industry="Contractors"
      headline="AI Agents for Home Services"
      subheadline="Never miss another call while you're on a job. AI handles your phone 24/7 so you can focus on the work."
      painPoints={painPoints}
      features={features}
      cta="Never Miss Another Lead"
      gradient="cyan"
    />
  );
}
