import { useState, useEffect } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Headphones,
  Home,
  Shield,
  Flame,
  Snowflake
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Types
interface RoofingLead {
  id: string;
  call_id: string;
  created_at: string;
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  property_address: string | null;
  roof_issue: string | null;
  storm_damage: boolean;
  insurance_claim_filed: boolean;
  wants_insurance_help: boolean;
  is_homeowner: boolean | null;
  urgency_level: string | null;
  appointment_scheduled: boolean;
  appointment_date: string | null;
  office_location: string | null;
  call_outcome: string | null;
  call_summary: string | null;
  lead_quality: string | null;
  recording_url: string | null;
  email_sent: boolean;
  direction?: string;
  duration_ms?: number;
}

// Components
const CyberCard = ({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => (
  <div
    onClick={onClick}
    className={`relative bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-xl p-6 transition-all duration-300 hover:border-zinc-700 hover:shadow-lg hover:shadow-blue-500/5 ${onClick ? 'cursor-pointer' : ''} ${className}`}
  >
    {children}
  </div>
);

const StatCard = ({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: any; color: string }) => (
  <CyberCard>
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-lg bg-zinc-950 border border-zinc-800 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-2xl font-bold text-white font-mono">{value}</div>
        <div className="text-sm text-zinc-400">{label}</div>
      </div>
    </div>
  </CyberCard>
);

const LeadQualityBadge = ({ quality }: { quality: string | null }) => {
  if (!quality) return null;

  const q = quality.toLowerCase();
  let bgColor = 'bg-zinc-800';
  let textColor = 'text-zinc-400';
  let icon = null;

  if (q === 'hot' || q === 'high') {
    bgColor = 'bg-red-500/20';
    textColor = 'text-red-400';
    icon = <Flame className="w-3 h-3" />;
  } else if (q === 'warm' || q === 'medium') {
    bgColor = 'bg-yellow-500/20';
    textColor = 'text-yellow-400';
  } else if (q === 'cold' || q === 'low') {
    bgColor = 'bg-blue-500/20';
    textColor = 'text-blue-400';
    icon = <Snowflake className="w-3 h-3" />;
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {icon}
      {quality}
    </span>
  );
};

const LeadCard = ({ lead, expanded, onToggle }: { lead: RoofingLead; expanded: boolean; onToggle: () => void }) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDuration = (ms: number | undefined) => {
    if (!ms) return '-';
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <CyberCard className="mb-4" onClick={onToggle}>
      {/* Header Row */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {/* Appointment Status Icon */}
          <div className={`p-3 rounded-xl border ${lead.appointment_scheduled ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-zinc-800 border-zinc-700'}`}>
            {lead.appointment_scheduled ? (
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            ) : (
              <Phone className="w-6 h-6 text-zinc-400" />
            )}
          </div>

          {/* Customer Info */}
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-white">
                {lead.customer_name || 'Unknown Caller'}
              </h3>
              <LeadQualityBadge quality={lead.lead_quality} />
              {lead.storm_damage && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400">
                  <AlertTriangle className="w-3 h-3" />
                  Storm Damage
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 mt-1 text-sm text-zinc-400">
              {lead.customer_phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {lead.customer_phone}
                </span>
              )}
              {lead.property_address && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {lead.property_address.substring(0, 40)}...
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-zinc-400">{formatDate(lead.created_at)}</div>
            <div className="text-xs text-zinc-500 font-mono">{formatDuration(lead.duration_ms)}</div>
          </div>
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-zinc-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-zinc-400" />
          )}
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="mt-6 pt-6 border-t border-zinc-800" onClick={(e) => e.stopPropagation()}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Customer Details */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                <Home className="w-4 h-4" />
                Customer Details
              </h4>
              <div className="space-y-2 text-sm">
                {lead.customer_email && (
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Mail className="w-4 h-4" />
                    <a href={`mailto:${lead.customer_email}`} className="text-blue-400 hover:underline">
                      {lead.customer_email}
                    </a>
                  </div>
                )}
                {lead.property_address && (
                  <div className="flex items-start gap-2 text-zinc-400">
                    <MapPin className="w-4 h-4 mt-0.5" />
                    <span>{lead.property_address}</span>
                  </div>
                )}
                {lead.is_homeowner !== null && (
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Home className="w-4 h-4" />
                    <span>Homeowner: {lead.is_homeowner ? 'Yes' : 'No'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Roof Details */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Roof Details
              </h4>
              <div className="space-y-2 text-sm">
                {lead.roof_issue && (
                  <div className="text-zinc-400">
                    <span className="text-zinc-500">Issue:</span> {lead.roof_issue}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  {lead.storm_damage ? (
                    <span className="text-orange-400">⚠️ Storm Damage Reported</span>
                  ) : (
                    <span className="text-zinc-500">No Storm Damage</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <Shield className="w-4 h-4" />
                  <span>Insurance Claim: {lead.insurance_claim_filed ? 'Filed' : 'Not Filed'}</span>
                </div>
                {lead.wants_insurance_help && (
                  <div className="text-emerald-400">✓ Wants Insurance Help</div>
                )}
              </div>
            </div>

            {/* Appointment */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Appointment
              </h4>
              <div className="space-y-2 text-sm">
                {lead.appointment_scheduled ? (
                  <>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle className="w-4 h-4" />
                      <span>Scheduled</span>
                    </div>
                    {lead.appointment_date && (
                      <div className="text-zinc-400">{lead.appointment_date}</div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-yellow-400">
                    <XCircle className="w-4 h-4" />
                    <span>Not Scheduled</span>
                  </div>
                )}
                {lead.office_location && (
                  <div className="text-zinc-400">
                    <span className="text-zinc-500">Office:</span> {lead.office_location}
                  </div>
                )}
                {lead.urgency_level && (
                  <div className="text-zinc-400">
                    <span className="text-zinc-500">Urgency:</span> {lead.urgency_level}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Call Summary */}
          {lead.call_summary && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-zinc-300 mb-2">Call Summary</h4>
              <p className="text-sm text-zinc-400 bg-zinc-950/50 p-4 rounded-lg border border-zinc-800">
                {lead.call_summary}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex items-center gap-3">
            {lead.recording_url && (
              <a
                href={lead.recording_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-sm text-zinc-300 transition-colors"
              >
                <Headphones className="w-4 h-4" />
                Listen to Recording
              </a>
            )}
            {lead.customer_phone && (
              <a
                href={`tel:${lead.customer_phone}`}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm text-white transition-colors"
              >
                <Phone className="w-4 h-4" />
                Call Back
              </a>
            )}
          </div>
        </div>
      )}
    </CyberCard>
  );
};

// Main Page Component
const RoofingLeads = () => {
  const [leads, setLeads] = useState<RoofingLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchLeads = async () => {
    try {
      setLoading(true);

      // Query directly from Supabase to bypass backend schema cache issues
      const { data, error } = await supabase
        .from('roofing_leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Supabase error:', error);
        // Fallback to API if direct query fails
        const response = await fetch('/api/roofing/leads');
        const apiData = await response.json();
        if (apiData.success) {
          setLeads(apiData.leads || []);
        }
      } else {
        setLeads(data || []);
      }

      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchLeads, 30000);
    return () => clearInterval(interval);
  }, []);

  // Calculate stats
  const totalLeads = leads.length;
  const appointmentsBooked = leads.filter(l => l.appointment_scheduled).length;
  const hotLeads = leads.filter(l => l.lead_quality?.toLowerCase() === 'hot').length;
  const stormDamageLeads = leads.filter(l => l.storm_damage).length;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 lg:p-10 font-sans">

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Roofing <span className="text-blue-400">Leads</span>
            </h1>
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono rounded-full flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              LIVE
            </span>
          </div>
          <p className="text-zinc-500 text-sm font-medium">
            Real-time leads from Roofing Pros USA voice agent • Last updated: {lastRefresh.toLocaleTimeString()}
          </p>
        </div>

        <button
          onClick={fetchLeads}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 rounded-lg transition-all text-sm font-medium disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Total Leads"
          value={totalLeads}
          icon={Phone}
          color="text-blue-400"
        />
        <StatCard
          label="Appointments Booked"
          value={appointmentsBooked}
          icon={Calendar}
          color="text-emerald-400"
        />
        <StatCard
          label="Hot Leads"
          value={hotLeads}
          icon={Flame}
          color="text-red-400"
        />
        <StatCard
          label="Storm Damage"
          value={stormDamageLeads}
          icon={AlertTriangle}
          color="text-orange-400"
        />
      </div>

      {/* Leads List */}
      <div>
        <h2 className="text-xl font-bold text-zinc-200 mb-4">Recent Leads</h2>

        {loading && leads.length === 0 ? (
          <div className="text-center py-12 text-zinc-500">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>Loading leads...</p>
          </div>
        ) : leads.length === 0 ? (
          <CyberCard className="text-center py-12">
            <Phone className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-zinc-400 mb-2">No leads yet</h3>
            <p className="text-sm text-zinc-500">
              Leads will appear here when calls come through the Roofing Pros USA voice agent.
            </p>
          </CyberCard>
        ) : (
          <div>
            {leads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                expanded={expandedId === lead.id}
                onToggle={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoofingLeads;
