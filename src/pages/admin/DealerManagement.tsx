import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDealers, useCreateDealer, useDeleteDealer, useTestIntegrations } from '@/hooks/useAdminApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Plus,
  Search,
  MoreVertical,
  Building2,
  Video,
  Phone,
  RefreshCcw,
  Trash2,
  Edit,
  TestTube2,
  CheckCircle2,
  XCircle,
  Loader2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { CreateDealerInput } from '@/lib/admin-api';

export default function DealerManagement() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [testingDealer, setTestingDealer] = useState<string | null>(null);

  const { data, isLoading, refetch } = useDealers({ search: search || undefined });
  const createDealer = useCreateDealer();
  const deleteDealer = useDeleteDealer();
  const testIntegrations = useTestIntegrations();

  const [formData, setFormData] = useState<CreateDealerInput>({
    name: '',
    contact_email: '',
    contact_phone: '',
    ghl_location_id: '',
    system_prompt: '',
    greeting_message: '',
    timezone: 'America/Chicago',
  });

  const handleCreate = async () => {
    if (!formData.name) {
      toast({ title: 'Error', description: 'Dealer name is required', variant: 'destructive' });
      return;
    }

    try {
      await createDealer.mutateAsync(formData);
      toast({ title: 'Success', description: 'Dealer created successfully' });
      setIsCreateOpen(false);
      setFormData({
        name: '',
        contact_email: '',
        contact_phone: '',
        ghl_location_id: '',
        system_prompt: '',
        greeting_message: '',
        timezone: 'America/Chicago',
      });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      await deleteDealer.mutateAsync(id);
      toast({ title: 'Success', description: 'Dealer deleted successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleTestIntegrations = async (id: string) => {
    setTestingDealer(id);
    try {
      const result = await testIntegrations.mutateAsync(id);
      const statuses = [
        result.tavus?.status === 'ok' ? '✅ Tavus' : '❌ Tavus',
        result.retell?.status === 'ok' ? '✅ Retell' : '❌ Retell',
        result.ghl?.status === 'ok' ? '✅ GHL' : '❌ GHL',
      ].join(', ');
      toast({ title: 'Integration Test Complete', description: statuses });
    } catch (error: any) {
      toast({ title: 'Test Failed', description: error.message, variant: 'destructive' });
    } finally {
      setTestingDealer(null);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dealer Management</h1>
          <p className="text-gray-400 mt-1">Manage dealer accounts and integrations</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} className="border-gray-700">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-cyan-600 hover:bg-cyan-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Dealer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-gray-900 border-gray-800">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Dealer</DialogTitle>
                <DialogDescription>
                  Add a new dealer account. This will automatically create Tavus and Retell integrations.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Business Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="ABC Motors"
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Contact Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                      placeholder="sales@example.com"
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Contact Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.contact_phone}
                      onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                      placeholder="555-0123"
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ghl">GHL Location ID</Label>
                  <Input
                    id="ghl"
                    value={formData.ghl_location_id}
                    onChange={(e) => setFormData({ ...formData, ghl_location_id: e.target.value })}
                    placeholder="loc_abc123"
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="greeting">Greeting Message</Label>
                  <Input
                    id="greeting"
                    value={formData.greeting_message}
                    onChange={(e) => setFormData({ ...formData, greeting_message: e.target.value })}
                    placeholder="Hi! Thanks for reaching out to ABC Motors..."
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="prompt">System Prompt</Label>
                  <Textarea
                    id="prompt"
                    value={formData.system_prompt}
                    onChange={(e) => setFormData({ ...formData, system_prompt: e.target.value })}
                    placeholder="You are a helpful sales assistant..."
                    className="bg-gray-800 border-gray-700 min-h-[100px]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={createDealer.isPending}
                  className="bg-cyan-600 hover:bg-cyan-700"
                >
                  {createDealer.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Create Dealer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search dealers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-gray-900/50 border-gray-700"
        />
      </div>

      {/* Table */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800 hover:bg-transparent">
                <TableHead className="text-gray-400">Dealer</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400">Integrations</TableHead>
                <TableHead className="text-gray-400">Stats</TableHead>
                <TableHead className="text-gray-400 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-400 py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                    Loading dealers...
                  </TableCell>
                </TableRow>
              ) : data?.dealers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <Building2 className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No dealers found</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => setIsCreateOpen(true)}
                    >
                      Add First Dealer
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                data?.dealers.map((dealer) => (
                  <TableRow
                    key={dealer.id}
                    className="border-gray-800 hover:bg-gray-800/50 cursor-pointer"
                    onClick={() => navigate(`/dashboard/admin/dealers/${dealer.id}`)}
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium text-white">{dealer.business_name}</p>
                        <p className="text-sm text-gray-400">{dealer.contact_email || 'No email'}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={dealer.active ? 'default' : 'secondary'}>
                        {dealer.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1" title="Tavus">
                          <Video className={`h-4 w-4 ${dealer.tavus_persona_id ? 'text-green-400' : 'text-gray-600'}`} />
                        </div>
                        <div className="flex items-center gap-1" title="Retell">
                          <Phone className={`h-4 w-4 ${dealer.retell_agent_id ? 'text-green-400' : 'text-gray-600'}`} />
                        </div>
                        <div className="flex items-center gap-1" title="GHL">
                          <Building2 className={`h-4 w-4 ${dealer.ghl_location_id ? 'text-green-400' : 'text-gray-600'}`} />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <span className="text-gray-400">{dealer.stats?.total_calls ?? 0} calls</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/dashboard/admin/dealers/${dealer.id}`);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTestIntegrations(dealer.id);
                            }}
                            disabled={testingDealer === dealer.id}
                          >
                            {testingDealer === dealer.id ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <TestTube2 className="h-4 w-4 mr-2" />
                            )}
                            Test Integrations
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-400 focus:text-red-400"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(dealer.id, dealer.business_name);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {data && data.pagination.total > data.pagination.limit && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Showing {data.dealers.length} of {data.pagination.total} dealers
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={data.pagination.offset === 0}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={!data.pagination.has_more}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
