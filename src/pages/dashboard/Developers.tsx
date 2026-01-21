import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Key, Copy, Trash2, Loader2, Plus, Code, Terminal, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  created_at: string;
  last_used_at: string | null;
}

export default function Developers() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isRevoking, setIsRevoking] = useState<string | null>(null);
  const [keyName, setKeyName] = useState('');
  const [newKey, setNewKey] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const fetchKeys = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await supabase.functions.invoke('api-keys', {
        body: { action: 'list' },
      });

      if (response.error) throw response.error;
      setKeys(response.data.keys || []);
    } catch (error) {
      console.error('Error fetching keys:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch API keys',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleCreate = async () => {
    if (!keyName.trim()) return;
    
    setIsCreating(true);
    try {
      const response = await supabase.functions.invoke('api-keys', {
        body: { action: 'generate', name: keyName.trim() },
      });

      if (response.error) throw response.error;
      
      setNewKey(response.data.key);
      await fetchKeys();
    } catch (error) {
      console.error('Error creating key:', error);
      toast({
        title: 'Error',
        description: 'Failed to create API key',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleRevoke = async (id: string) => {
    setIsRevoking(id);
    try {
      const response = await supabase.functions.invoke('api-keys', {
        body: { action: 'revoke', id },
      });

      if (response.error) throw response.error;
      
      toast({
        title: 'Key revoked',
        description: 'The API key has been permanently deleted.',
      });
      await fetchKeys();
    } catch (error) {
      console.error('Error revoking key:', error);
      toast({
        title: 'Error',
        description: 'Failed to revoke API key',
        variant: 'destructive',
      });
    } finally {
      setIsRevoking(null);
    }
  };

  const handleCopy = async () => {
    if (newKey) {
      await navigator.clipboard.writeText(newKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setKeyName('');
    setNewKey(null);
    setCopied(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Developers</h1>
        <p className="text-slate mt-1">
          Manage API keys and integrate V·Suite into your systems.
        </p>
      </div>

      {/* Quick Start */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-frost">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <Code className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">API Documentation</h3>
                <p className="text-sm text-slate mb-3">
                  Learn how to integrate V·Suite agents into your applications.
                </p>
                <Button variant="outline" size="sm">
                  View Docs
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-frost">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                <Terminal className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Embed Widget</h3>
                <p className="text-sm text-slate mb-3">
                  Add V·Suite agents to any website with a simple script tag.
                </p>
                <Button variant="outline" size="sm">
                  Get Embed Code
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Keys */}
      <Card className="border-frost">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>API Access Keys</CardTitle>
              <CardDescription>
                These keys allow you to authenticate API requests. Treat them like passwords.
              </CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Key
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create API Key</DialogTitle>
                  <DialogDescription>
                    Enter a name for this key (e.g., "Production Server").
                  </DialogDescription>
                </DialogHeader>
                
                {!newKey ? (
                  <div className="py-4">
                    <Input
                      placeholder="Key Name"
                      value={keyName}
                      onChange={(e) => setKeyName(e.target.value)}
                      maxLength={100}
                    />
                  </div>
                ) : (
                  <Alert className="border-emerald-500/50 bg-emerald-50">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <AlertTitle className="text-emerald-800">Success!</AlertTitle>
                    <AlertDescription className="mt-2">
                      <p className="mb-2 text-xs text-emerald-700">
                        Copy this key now. You won't see it again.
                      </p>
                      <div className="flex items-center gap-2 rounded-lg bg-white p-3 font-mono text-xs border border-emerald-200 break-all">
                        <span className="flex-1">{newKey}</span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 shrink-0"
                          onClick={handleCopy}
                        >
                          {copied ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                <DialogFooter>
                  {!newKey ? (
                    <Button onClick={handleCreate} disabled={isCreating || !keyName.trim()}>
                      {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Generate Key
                    </Button>
                  ) : (
                    <Button variant="secondary" onClick={handleDialogClose}>
                      Done
                    </Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-slate" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell className="font-medium">{key.name}</TableCell>
                    <TableCell>
                      <code className="text-xs text-slate bg-mist px-2 py-1 rounded">
                        {key.prefix}
                      </code>
                    </TableCell>
                    <TableCell className="text-slate">
                      {new Date(key.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRevoke(key.id)}
                        disabled={isRevoking === key.id}
                        className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                      >
                        {isRevoking === key.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {keys.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-slate">
                      <Key className="h-8 w-8 mx-auto mb-2 opacity-30" />
                      No API keys created yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
