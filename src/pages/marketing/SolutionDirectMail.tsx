import { Mail, Video, BarChart3, QrCode, Globe, Palette } from 'lucide-react';
import { SolutionTemplate } from './SolutionTemplate';

const painPoints = [
  {
    title: 'Declining Response Rates',
    description: 'Traditional mailers average less than 1% response. Recipients glance at generic print and toss it in the recycling.',
  },
  {
    title: 'No Personalization at Scale',
    description: "You can't hand-write 50,000 mailers. Generic messaging gets generic results — and your clients expect better ROI.",
  },
  {
    title: 'Zero Engagement Visibility',
    description: "Once a mailer ships, you have no idea who opened it, read it, or threw it away. You're flying blind on campaign performance.",
  },
];

const features = [
  {
    icon: Video,
    title: 'AI Video Postcards',
    description: 'Each mailer includes a QR code that launches a personalized AI video message — unique to every recipient.',
  },
  {
    icon: QrCode,
    title: 'Dynamic Personalization',
    description: "Recipient's name, context, and offer are baked into each video. Every scan feels like a one-on-one conversation.",
  },
  {
    icon: BarChart3,
    title: 'Real-Time Scan Tracking',
    description: 'Know exactly who scanned, when they watched, how long they engaged, and what they clicked next.',
  },
  {
    icon: Mail,
    title: 'CRM Follow-Up Automation',
    description: 'When a recipient scans, their CRM record updates instantly and triggers your follow-up sequences.',
  },
  {
    icon: Globe,
    title: 'Multi-Language Support',
    description: 'AI video agents speak the language of your audience — English, Spanish, and more.',
  },
  {
    icon: Palette,
    title: 'White-Label Ready',
    description: 'Brand every video with your logo, colors, and messaging. Your clients see your brand, not ours.',
  },
];

export function SolutionDirectMail() {
  return (
    <SolutionTemplate
      industry="Direct Mail Companies"
      headline="AI-Powered Video for Direct Mail"
      subheadline="Turn every mailer into a personalized video conversation. Your recipients scan, watch, and convert — at 10x the response rate of traditional mail."
      painPoints={painPoints}
      features={features}
      cta="See How Mailers Get 10x More Responses"
    />
  );
}
