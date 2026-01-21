import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Loader2, 
  Save, 
  Globe, 
  Sparkles,
  Brain,
  Link2,
  Code,
  Phone,
  Video,
  Plus,
  Trash2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Agent } from '@/types/database';

interface ObjectionHandler {
  trigger: string;
  response: string;
}

export default function AgentEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [agent, setAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [voiceId, setVoiceId] = useState('');
  const [personaId, setPersonaId] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [objectionHandlers, setObjectionHandlers] = useState<ObjectionHandler[]>([]);
  const [websiteUrl, setWebsiteUrl] = useState('');

  useEffect(() => {
    async function fetchAgent() {
      if (!id) return;

      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        toast({
          title: 'Agent not found',
          description: 'The agent you are looking for does not exist.',
          variant: 'destructive',
        });
        navigate('/dashboard/my-staff');
        return;
      }

      const agentData = data as Agent;
      setAgent(agentData);
      setName(agentData.name);
      setRoleTitle(agentData.role_title);
      setSystemPrompt(agentData.system_prompt || '');
      setWebhookUrl(agentData.webhook_url || '');
      setVoiceId(agentData.voice_id || '');
      setPersonaId(agentData.persona_id || '');
      setIsActive(agentData.status === 'active');
      setObjectionHandlers(agentData.objection_handling as ObjectionHandler[] || []);
      setIsLoading(false);
    }

    fetchAgent();
  }, [id, navigate, toast]);

  const handleSave = async () => {
    if (!agent) return;

    setIsSaving(true);

    const { error } = await supabase
      .from('agents')
      .update({
        name,
        role_title: roleTitle,
        system_prompt: systemPrompt,
        webhook_url: webhookUrl,
        voice_id: voiceId,
        persona_id: personaId,
        status: isActive ? 'active' : 'paused',
        objection_handling: objectionHandlers as unknown as Record<string, unknown>[],
      })
      .eq('id', agent.id);

    if (error) {
      toast({
        title: 'Failed to save',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Agent saved',
        description: 'Your changes have been saved successfully.',
      });
    }

    setIsSaving(false);
  };

  const handleAutoScrape = async () => {
    if (!websiteUrl) {
      toast({
        title: 'Enter a website URL',
        description: 'Please enter a dealership website URL to scan.',
        variant: 'destructive',
      });
      return;
    }

    setIsScanning(true);
    // Simulate scanning
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock scraped data
    setSystemPrompt(prev => 
      `${prev}\n\n[Auto-generated from ${websiteUrl}]\nDealership Hours: Mon-Sat 9AM-8PM, Sun 11AM-5PM\nBrand Focus: Premium automotive experience\nKey Services: Sales, Service, Parts, Financing`
    );

    toast({
      title: 'Website scanned',
      description: 'Dealership information has been extracted and added to the prompt.',
    });
    setIsScanning(false);
  };

  const addObjectionHandler = () => {
    setObjectionHandlers([...objectionHandlers, { trigger: '', response: '' }]);
  };

  const removeObjectionHandler = (index: number) => {
    setObjectionHandlers(objectionHandlers.filter((_, i) => i !== index));
  };

  const updateObjectionHandler = (index: number, field: 'trigger' | 'response', value: string) => {
    const updated = [...objectionHandlers];
    updated[index][field] = value;
    setObjectionHandlers(updated);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-slate" />
      </div>
    );
  }

  if (!agent) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/my-staff')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              agent.type === 'voice' 
                ? 'bg-gradient-to-br from-blue-100 to-blue-50' 
                : 'bg-gradient-to-br from-purple-100 to-purple-50'
            }`}>
              {agent.type === 'voice' ? (
                <Phone className="h-6 w-6 text-blue-600" />
              ) : (
                <Video className="h-6 w-6 text-purple-600" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{name}</h1>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{roleTitle}</Badge>
                <Badge variant={isActive ? 'default' : 'outline'}>
                  {isActive ? 'Active' : 'Paused'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Label htmlFor="active-toggle" className="text-sm text-slate">Active</Label>
            <Switch
              id="active-toggle"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      {/* Aizee Scraper */}
      <Card className="border-frost">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Aizee Auto-Builder</CardTitle>
              <CardDescription>Scan a dealership website to auto-populate context</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="Enter dealership website URL..."
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
              />
            </div>
            <Button onClick={handleAutoScrape} disabled={isScanning}>
              {isScanning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Globe className="h-4 w-4 mr-2" />
                  Auto-Build Persona
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="identity" className="space-y-6">
        <TabsList>
          <TabsTrigger value="identity">Identity</TabsTrigger>
          <TabsTrigger value="brain">The Brain</TabsTrigger>
          <TabsTrigger value="connectivity">Connectivity</TabsTrigger>
          <TabsTrigger value="embed">Embed</TabsTrigger>
        </TabsList>

        {/* Identity Tab */}
        <TabsContent value="identity" className="space-y-4">
          <Card className="border-frost">
            <CardHeader>
              <CardTitle>Agent Identity</CardTitle>
              <CardDescription>Configure the agent's name and voice</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Agent Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roleTitle">Role Title</Label>
                  <Input
                    id="roleTitle"
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                  />
                </div>
              </div>
              {agent.type === 'voice' && (
                <div className="space-y-2">
                  <Label htmlFor="voiceId">Voice ID (Retell/ElevenLabs)</Label>
                  <Input
                    id="voiceId"
                    placeholder="voice_id_here"
                    value={voiceId}
                    onChange={(e) => setVoiceId(e.target.value)}
                  />
                </div>
              )}
              {agent.type === 'video' && (
                <div className="space-y-2">
                  <Label htmlFor="personaId">Persona ID (Tavus)</Label>
                  <Input
                    id="personaId"
                    placeholder="persona_id_here"
                    value={personaId}
                    onChange={(e) => setPersonaId(e.target.value)}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Brain Tab */}
        <TabsContent value="brain" className="space-y-4">
          <Card className="border-frost">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Brain className="h-5 w-5 text-purple-600" />
                <div>
                  <CardTitle>System Prompt</CardTitle>
                  <CardDescription>Define the agent's personality and objectives</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter the system prompt..."
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
            </CardContent>
          </Card>

          <Card className="border-frost">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Objection Handling</CardTitle>
                  <CardDescription>Define responses to common objections</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={addObjectionHandler}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Handler
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {objectionHandlers.length === 0 ? (
                <p className="text-sm text-slate text-center py-4">
                  No objection handlers defined. Click "Add Handler" to create one.
                </p>
              ) : (
                objectionHandlers.map((handler, index) => (
                  <div key={index} className="grid grid-cols-[1fr,1fr,auto] gap-3 items-start">
                    <div>
                      <Label className="text-xs text-slate">Trigger Phrase</Label>
                      <Input
                        placeholder="e.g., 'Not interested'"
                        value={handler.trigger}
                        onChange={(e) => updateObjectionHandler(index, 'trigger', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-slate">AI Response</Label>
                      <Input
                        placeholder="e.g., 'I understand, but...'"
                        value={handler.response}
                        onChange={(e) => updateObjectionHandler(index, 'response', e.target.value)}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="mt-5"
                      onClick={() => removeObjectionHandler(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Connectivity Tab */}
        <TabsContent value="connectivity" className="space-y-4">
          <Card className="border-frost">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Link2 className="h-5 w-5 text-green-600" />
                <div>
                  <CardTitle>CRM Integration</CardTitle>
                  <CardDescription>Connect to your CRM for lead capture</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhookUrl">GoHighLevel Webhook URL</Label>
                <Input
                  id="webhookUrl"
                  placeholder="https://..."
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                />
                <p className="text-xs text-slate">
                  Paste your GHL webhook URL to automatically send leads and call data.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Embed Tab */}
        <TabsContent value="embed" className="space-y-4">
          <Card className="border-frost">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Code className="h-5 w-5 text-blue-600" />
                <div>
                  <CardTitle>Embed Generator</CardTitle>
                  <CardDescription>Add the AI button to your website</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>React Component</Label>
                <pre className="bg-mist p-4 rounded-lg overflow-x-auto text-sm font-mono">
{`<VoxarisButton 
  agentId="${agent.id}"
  type="${agent.type}"
/>`}
                </pre>
              </div>
              <div className="space-y-2">
                <Label>HTML Script</Label>
                <pre className="bg-mist p-4 rounded-lg overflow-x-auto text-sm font-mono">
{`<script src="https://cdn.voxaris.ai/widget.js"></script>
<script>
  Voxaris.init({
    agentId: "${agent.id}",
    type: "${agent.type}"
  });
</script>`}
                </pre>
              </div>
              <div className="p-4 bg-mist rounded-lg">
                <p className="text-sm text-slate mb-3">Preview:</p>
                <div className="relative h-24 bg-background rounded-lg border border-frost">
                  <div className="absolute bottom-4 right-4 w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-lg animate-pulse cursor-pointer">
                    {agent.type === 'voice' ? (
                      <Phone className="h-6 w-6 text-white" />
                    ) : (
                      <Video className="h-6 w-6 text-white" />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
