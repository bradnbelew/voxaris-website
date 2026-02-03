import { Scale, Clock, Phone, FileText, Calendar, Shield } from 'lucide-react';
import { SolutionTemplate } from './SolutionTemplate';

const painPoints = [
  {
    title: 'Missed Intake Calls',
    description: 'Law firms miss 35% of potential client calls. Each missed call could be a $10k+ case walking out the door.',
  },
  {
    title: 'Expensive Call Centers',
    description: 'Legal answering services charge $3-5 per call and often provide inconsistent client experiences.',
  },
  {
    title: 'Inconsistent Screening',
    description: 'Human intake staff have varying levels of training, leading to poor case qualification and wasted consultations.',
  },
];

const features = [
  {
    icon: Phone,
    title: '24/7 Intake Coverage',
    description: 'Never miss a potential client call, even at 2am on a Sunday.',
  },
  {
    icon: Scale,
    title: 'Case Qualification',
    description: 'AI asks the right questions to qualify cases before scheduling consultations.',
  },
  {
    icon: FileText,
    title: 'Conflict Checking',
    description: 'Automatically collect adverse party information for conflict checks.',
  },
  {
    icon: Calendar,
    title: 'Consultation Booking',
    description: 'Schedule consultations directly into attorney calendars.',
  },
  {
    icon: Shield,
    title: 'HIPAA Compliant',
    description: 'Enterprise-grade security for handling sensitive client information.',
  },
  {
    icon: Clock,
    title: 'Instant Response',
    description: 'Respond to potential clients in seconds, not hours.',
  },
];

export function SolutionLawFirms() {
  return (
    <SolutionTemplate
      industry="Law Firms"
      headline="AI Intake Agents for Law Firms"
      subheadline="Never miss another potential client. Our AI handles intake calls 24/7, qualifies cases, and books consultations automatically."
      painPoints={painPoints}
      features={features}
      cta="Automate Your Client Intake"
      gradient="pink"
    />
  );
}
