import { useState } from "react";
import { VoxarisEmbed } from "@/components/ui/VoxarisEmbed";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Play, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AgentTest() {
  const [agentId, setAgentId] = useState("");
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null);

  const handleLoadAgent = () => {
    if (agentId.trim()) {
      setActiveAgentId(agentId.trim());
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Agent Test Lab</h1>
        <p className="text-muted-foreground">
          Test your V-Suite agents in a live environment
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Load Agent</CardTitle>
          <CardDescription>
            Enter an agent ID to load the V-Suite embed widget
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Input
              placeholder="Enter Agent ID (e.g., agent_abc123)"
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleLoadAgent} disabled={!agentId.trim()}>
              <Play className="w-4 h-4 mr-2" />
              Load Agent
            </Button>
          </div>

          {activeAgentId && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Agent <code className="font-mono text-sm">{activeAgentId}</code> is now loaded.
                The embed widget should appear below.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {activeAgentId && (
        <Card className="min-h-[500px]">
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
            <CardDescription>
              Agent ID: {activeAgentId}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[450px]">
            <VoxarisEmbed agentId={activeAgentId} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
