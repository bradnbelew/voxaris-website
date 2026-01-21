import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link2, Check, ExternalLink } from 'lucide-react';

const integrations = [
  {
    name: 'GoHighLevel',
    description: 'Sync leads, appointments, and call data with your GHL CRM.',
    logo: '🔗',
    status: 'available',
  },
  {
    name: 'Retell AI',
    description: 'Power your voice agents with Retell\'s conversational AI.',
    logo: '🎙️',
    status: 'connected',
  },
  {
    name: 'Tavus',
    description: 'Enable video conversations with realistic AI avatars.',
    logo: '🎬',
    status: 'connected',
  },
  {
    name: 'DealerSocket',
    description: 'Integrate with DealerSocket CRM for seamless lead management.',
    logo: '🚗',
    status: 'coming_soon',
  },
  {
    name: 'VinSolutions',
    description: 'Connect to VinSolutions for comprehensive dealership data.',
    logo: '📊',
    status: 'coming_soon',
  },
  {
    name: 'Calendly',
    description: 'Allow customers to book appointments directly.',
    logo: '📅',
    status: 'available',
  },
];

export default function Integrations() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
        <p className="text-slate mt-1">
          Connect V·Suite to your existing tools and platforms.
        </p>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((integration) => (
          <Card key={integration.name} className="border-frost">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-mist flex items-center justify-center text-2xl">
                    {integration.logo}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    {integration.status === 'connected' && (
                      <Badge variant="secondary" className="mt-1">
                        <Check className="h-3 w-3 mr-1" />
                        Connected
                      </Badge>
                    )}
                    {integration.status === 'coming_soon' && (
                      <Badge variant="outline" className="mt-1">
                        Coming Soon
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">{integration.description}</CardDescription>
              {integration.status === 'available' && (
                <Button className="w-full">
                  <Link2 className="h-4 w-4 mr-2" />
                  Connect
                </Button>
              )}
              {integration.status === 'connected' && (
                <Button variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Manage
                </Button>
              )}
              {integration.status === 'coming_soon' && (
                <Button variant="outline" className="w-full" disabled>
                  Coming Soon
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
