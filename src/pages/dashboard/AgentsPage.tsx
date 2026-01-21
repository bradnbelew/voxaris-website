import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Settings2, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { MOCK_AGENTS } from "@/lib/mock-data";

export default function AgentsPage() {
  const agents = MOCK_AGENTS;

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'paused':
        return 'secondary';
      case 'draft':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Persona Library</h1>
          <p className="text-slate mt-1">Manage your digital workforce.</p>
        </div>
        <Button asChild>
          <Link to="/dashboard/hiring-hall">
            <Plus className="h-4 w-4 mr-2" />
            Hire New Agent
          </Link>
        </Button>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <Card key={agent.id} className="border-frost">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={agent.avatar_url} alt={agent.name} />
                  <AvatarFallback className="bg-mist text-charcoal">
                    {agent.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">{agent.name}</CardTitle>
                  <p className="text-sm text-slate truncate">{agent.role}</p>
                </div>
                <Badge variant={getStatusVariant(agent.status)} className="capitalize shrink-0">
                  {agent.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex justify-between text-sm">
                <div>
                  <span className="text-slate">Type:</span>
                  <span className="ml-2 font-medium capitalize">{agent.type}</span>
                </div>
                <div>
                  <span className="text-slate">Performance:</span>
                  <span className="ml-2 font-medium">98.2%</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-3 border-t border-frost">
              <div className="flex gap-2 w-full">
                <Button variant="outline" size="sm" className="flex-1">
                  <Settings2 className="h-4 w-4 mr-2" />
                  Setup
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Play className="h-4 w-4 mr-2" />
                  Test Call
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}

        {/* Add New Placeholder */}
        <Card className="border-frost border-dashed flex flex-col items-center justify-center min-h-[240px]">
          <CardContent className="flex flex-col items-center text-center p-6">
            <div className="w-12 h-12 rounded-full bg-mist flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-slate" />
            </div>
            <h3 className="font-semibold mb-1">Add Custom Persona</h3>
            <p className="text-sm text-slate mb-4">Train from URL or Template</p>
            <Button variant="outline" asChild>
              <Link to="/dashboard/hiring-hall">Browse Hiring Hall</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
