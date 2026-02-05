/**
 * Roofing Pros USA - Unified Mobile-First App
 *
 * Combines EstimAIte estimate generation with the leads dashboard
 * Tab-based navigation: Dashboard, Leads, Estimates, Calls
 * Mobile/iPad first design
 */

import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Users,
  FileText,
  Phone,
  Settings,
  Menu,
  X,
  Plus,
  Search,
  Bell,
  ChevronDown,
  ChevronUp,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Headphones,
  Home,
  Shield,
  Flame,
  Snowflake,
  MapPin,
  Mail,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Loader2,
  Send,
  Sparkles,
  Bot,
  User,
  FileCheck,
  Zap,
  Brain,
  Play,
  Building2,
  ArrowRight
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { GlowingEffect } from "@/components/ui/glowing-effect";

// ============================================================================
// TYPES
// ============================================================================

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

interface Estimate {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  property_address: string;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired';
  condition?: string;
  recommendation?: string;
  total_min?: number;
  total_max?: number;
  created_at: string;
  expires_at?: string;
  ai_confidence?: number;
}

type TabType = 'dashboard' | 'leads' | 'estimates' | 'calls' | 'settings';

// ============================================================================
// GLOWING CARD COMPONENTS
// ============================================================================

const GlowingCard = ({
  children,
  className = "",
  onClick,
  variant = "default"
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "default" | "stat" | "lead"
}) => (
  <div className={`relative ${className}`}>
    <div
      onClick={onClick}
      className={`relative rounded-2xl border border-zinc-700/50 p-2 ${onClick ? 'cursor-pointer' : ''}`}
    >
      <GlowingEffect
        spread={40}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
        borderWidth={2}
        variant="roofing"
      />
      <div className="relative flex flex-col gap-4 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/90 p-4 md:p-5 shadow-sm">
        {children}
      </div>
    </div>
  </div>
);

// ============================================================================
// STAT CARD
// ============================================================================

const StatCard = ({
  label,
  value,
  icon: Icon,
  color,
  trend,
  trendValue
}: {
  label: string;
  value: string | number;
  icon: any;
  color: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}) => (
  <GlowingCard variant="stat">
    <div className="flex items-center justify-between">
      <div className={`p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800/50 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-medium ${
          trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-zinc-500'
        }`}>
          {trend === 'up' ? <TrendingUp className="w-3 h-3" /> :
           trend === 'down' ? <TrendingDown className="w-3 h-3" /> : null}
          {trendValue}
        </div>
      )}
    </div>
    <div>
      <div className="text-2xl md:text-3xl font-bold text-white font-mono tracking-tight">{value}</div>
      <div className="text-xs md:text-sm font-medium text-zinc-400 mt-0.5">{label}</div>
    </div>
  </GlowingCard>
);

// ============================================================================
// LEAD QUALITY BADGE
// ============================================================================

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
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {icon}
      {quality}
    </span>
  );
};

// ============================================================================
// LEAD CARD (Mobile Optimized)
// ============================================================================

const LeadCard = ({
  lead,
  expanded,
  onToggle
}: {
  lead: RoofingLead;
  expanded: boolean;
  onToggle: () => void
}) => {
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
    <GlowingCard className="mb-3" onClick={onToggle} variant="lead">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`p-2.5 rounded-xl border flex-shrink-0 ${
            lead.appointment_scheduled
              ? 'bg-emerald-500/10 border-emerald-500/30'
              : 'bg-zinc-800 border-zinc-700'
          }`}>
            {lead.appointment_scheduled ? (
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            ) : (
              <Phone className="w-5 h-5 text-zinc-400" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-semibold text-white truncate">
                {lead.customer_name || 'Unknown Caller'}
              </h3>
              <LeadQualityBadge quality={lead.lead_quality} />
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-500">
              <span>{formatDate(lead.created_at)}</span>
              {lead.storm_damage && (
                <span className="flex items-center gap-1 text-orange-400">
                  <AlertTriangle className="w-3 h-3" />
                  Storm
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex-shrink-0">
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-zinc-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-zinc-500" />
          )}
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="pt-4 border-t border-zinc-800 mt-4 space-y-4" onClick={(e) => e.stopPropagation()}>
          {/* Contact Info */}
          <div className="grid grid-cols-1 gap-2">
            {lead.customer_phone && (
              <a href={`tel:${lead.customer_phone}`} className="flex items-center gap-2 text-sm text-blue-400 active:text-blue-300">
                <Phone className="w-4 h-4" />
                {lead.customer_phone}
              </a>
            )}
            {lead.customer_email && (
              <a href={`mailto:${lead.customer_email}`} className="flex items-center gap-2 text-sm text-blue-400 active:text-blue-300">
                <Mail className="w-4 h-4" />
                {lead.customer_email}
              </a>
            )}
            {lead.property_address && (
              <div className="flex items-start gap-2 text-sm text-zinc-400">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{lead.property_address}</span>
              </div>
            )}
          </div>

          {/* Issue & Status */}
          <div className="grid grid-cols-2 gap-3">
            {lead.roof_issue && (
              <div className="bg-zinc-800/50 rounded-lg p-3">
                <div className="text-xs text-zinc-500 mb-1">Issue</div>
                <div className="text-sm text-zinc-300">{lead.roof_issue}</div>
              </div>
            )}
            {lead.urgency_level && (
              <div className="bg-zinc-800/50 rounded-lg p-3">
                <div className="text-xs text-zinc-500 mb-1">Urgency</div>
                <div className={`text-sm font-medium ${
                  lead.urgency_level.toLowerCase() === 'high' ? 'text-red-400' :
                  lead.urgency_level.toLowerCase() === 'medium' ? 'text-yellow-400' :
                  'text-zinc-300'
                }`}>{lead.urgency_level}</div>
              </div>
            )}
          </div>

          {/* Call Summary */}
          {lead.call_summary && (
            <div className="bg-zinc-800/50 rounded-lg p-3">
              <div className="text-xs text-zinc-500 mb-1">Call Summary</div>
              <p className="text-sm text-zinc-300">{lead.call_summary}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            {lead.recording_url && (
              <a
                href={lead.recording_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800 active:bg-zinc-700 border border-zinc-700 rounded-xl text-sm text-zinc-300 transition-colors"
              >
                <Headphones className="w-4 h-4" />
                Listen
              </a>
            )}
            {lead.customer_phone && (
              <a
                href={`tel:${lead.customer_phone}`}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 active:bg-amber-500 rounded-xl text-sm text-white font-medium transition-colors"
              >
                <Phone className="w-4 h-4" />
                Call Back
              </a>
            )}
          </div>
        </div>
      )}
    </GlowingCard>
  );
};

// ============================================================================
// ESTIMATE CARD (Mobile Optimized)
// ============================================================================

const EstimateCard = ({ estimate }: { estimate: Estimate }) => {
  const formatCurrency = (amount?: number) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'sent': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'viewed': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'expired': return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
      default: return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    }
  };

  return (
    <GlowingCard className="mb-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex-shrink-0">
            <FileText className="w-5 h-5 text-amber-400" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-white truncate">
              {estimate.customer_name}
            </h3>
            <div className="text-xs text-zinc-500 mt-0.5 truncate">
              {estimate.property_address}
            </div>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getStatusColor(estimate.status)}`}>
          {estimate.status}
        </span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-zinc-800 mt-3">
        <div>
          <div className="text-xs text-zinc-500">Estimate Range</div>
          <div className="text-lg font-bold text-white">
            {formatCurrency(estimate.total_min)} - {formatCurrency(estimate.total_max)}
          </div>
        </div>
        {estimate.ai_confidence && (
          <div className="text-right">
            <div className="text-xs text-zinc-500">AI Confidence</div>
            <div className="text-sm font-medium text-amber-400">{estimate.ai_confidence}%</div>
          </div>
        )}
      </div>
    </GlowingCard>
  );
};

// ============================================================================
// ESTIMATE GENERATOR FORM
// ============================================================================

const EstimateGenerator = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    propertyAddress: '',
    roofIssue: '',
    stormDamage: false,
    urgency: 'medium' as 'low' | 'medium' | 'high' | 'emergency',
    hasInsurance: false,
    insuranceCompany: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedEstimate, setGeneratedEstimate] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = import.meta.env.PROD
    ? 'https://voxaris-server.vercel.app'
    : 'http://localhost:3000';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customerName || !formData.customerPhone || !formData.propertyAddress) {
      setError('Please fill in required fields');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/estimaite/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedEstimate(data.estimate);
      } else {
        setError(data.error || 'Failed to generate estimate');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setIsGenerating(false);
    }
  };

  if (generatedEstimate) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4">
        <div className="bg-zinc-900 rounded-t-3xl md:rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-zinc-900 p-4 border-b border-zinc-800 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Estimate Generated!</h2>
            <button onClick={onClose} className="p-2 rounded-lg bg-zinc-800 text-zinc-400">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* Success State */}
            <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
              <div>
                <div className="text-sm font-medium text-emerald-400">AI Analysis Complete</div>
                <div className="text-xs text-zinc-400">Confidence: {generatedEstimate.confidence}%</div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-zinc-800/50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-white mb-2">Customer</h3>
              <div className="text-sm text-zinc-400">{generatedEstimate.customer?.name}</div>
              <div className="text-sm text-zinc-500">{generatedEstimate.property?.address}</div>
            </div>

            {/* Analysis */}
            <div className="bg-zinc-800/50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-white mb-2">AI Assessment</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-zinc-500">Condition</div>
                  <div className={`text-sm font-medium ${
                    generatedEstimate.analysis?.condition === 'critical' ? 'text-red-400' :
                    generatedEstimate.analysis?.condition === 'poor' ? 'text-orange-400' :
                    generatedEstimate.analysis?.condition === 'fair' ? 'text-yellow-400' :
                    'text-emerald-400'
                  }`}>{generatedEstimate.analysis?.condition?.toUpperCase()}</div>
                </div>
                <div>
                  <div className="text-xs text-zinc-500">Recommendation</div>
                  <div className="text-sm font-medium text-white">
                    {generatedEstimate.analysis?.recommendation?.replace('_', ' ')}
                  </div>
                </div>
              </div>
            </div>

            {/* Options */}
            <div>
              <h3 className="text-sm font-medium text-white mb-3">Estimate Options</h3>
              <div className="space-y-2">
                {generatedEstimate.options?.map((option: any) => (
                  <div
                    key={option.id}
                    className={`p-3 rounded-xl border ${
                      option.recommended
                        ? 'bg-amber-500/10 border-amber-500/30'
                        : 'bg-zinc-800/50 border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-white flex items-center gap-2">
                          {option.name}
                          {option.recommended && (
                            <span className="px-1.5 py-0.5 bg-amber-500 text-white text-xs rounded">
                              Recommended
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-zinc-500">{option.description}</div>
                      </div>
                      <div className="text-lg font-bold text-white">
                        ${option.total?.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-zinc-800 text-zinc-300 rounded-xl font-medium"
              >
                Close
              </button>
              <button
                className="flex-1 py-3 bg-amber-600 text-white rounded-xl font-medium flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send to Customer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-t-3xl md:rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-zinc-900 p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">New Estimate</h2>
              <p className="text-xs text-zinc-500">Powered by EstimAIte</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg bg-zinc-800 text-zinc-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Customer Info */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Customer Name *</label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              placeholder="John Smith"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Phone *</label>
              <input
                type="tel"
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                placeholder="(407) 555-1234"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Email</label>
              <input
                type="email"
                value={formData.customerEmail}
                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                placeholder="john@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Property Address *</label>
            <input
              type="text"
              value={formData.propertyAddress}
              onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })}
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              placeholder="123 Main St, Orlando FL 32801"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Roof Issue</label>
            <textarea
              value={formData.roofIssue}
              onChange={(e) => setFormData({ ...formData, roofIssue: e.target.value })}
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 resize-none"
              rows={3}
              placeholder="Describe the issue..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Urgency</label>
              <select
                value={formData.urgency}
                onChange={(e) => setFormData({ ...formData, urgency: e.target.value as any })}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-3 w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.stormDamage}
                  onChange={(e) => setFormData({ ...formData, stormDamage: e.target.checked })}
                  className="w-4 h-4 rounded accent-amber-500"
                />
                <span className="text-sm text-zinc-300">Storm Damage</span>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-xl">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hasInsurance}
                onChange={(e) => setFormData({ ...formData, hasInsurance: e.target.checked })}
                className="w-4 h-4 rounded accent-amber-500"
              />
              <span className="text-sm text-zinc-300">Has Homeowner Insurance</span>
            </label>
          </div>

          {formData.hasInsurance && (
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Insurance Company</label>
              <input
                type="text"
                value={formData.insuranceCompany}
                onChange={(e) => setFormData({ ...formData, insuranceCompany: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                placeholder="e.g., State Farm, Allstate"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isGenerating}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Estimate...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Generate AI Estimate
              </>
            )}
          </button>

          <p className="text-xs text-zinc-500 text-center">
            AI will analyze property data and generate professional estimate options
          </p>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// AI INSIGHTS PANEL
// ============================================================================

const AIInsightsPanel = ({ leads, isOpen, onClose }: { leads: RoofingLead[]; isOpen: boolean; onClose: () => void }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const analyzeLeads = (question: string): string => {
    const q = question.toLowerCase();
    const totalLeads = leads.length;
    const appointmentsBooked = leads.filter(l => l.appointment_scheduled).length;
    const hotLeads = leads.filter(l => l.lead_quality?.toLowerCase() === 'hot').length;
    const stormDamageLeads = leads.filter(l => l.storm_damage).length;
    const conversionRate = totalLeads > 0 ? Math.round((appointmentsBooked / totalLeads) * 100) : 0;

    if (q.includes('trend') || q.includes('pattern') || q.includes('insight')) {
      const insights = [];
      if (stormDamageLeads / totalLeads > 0.4) insights.push(`Storm damage is high (${Math.round(stormDamageLeads/totalLeads*100)}%) - great time for insurance claim assistance.`);
      if (conversionRate > 50) insights.push(`Strong conversion rate at ${conversionRate}% - AI agent is performing well.`);
      if (conversionRate < 30) insights.push(`Conversion rate is ${conversionRate}% - consider refining the scheduling script.`);
      if (hotLeads > totalLeads / 3) insights.push(`${hotLeads} hot leads ready to close - prioritize follow-ups.`);
      return insights.length > 0 ? `Key Insights:\n\n${insights.map(i => `• ${i}`).join('\n')}` : `Currently tracking ${totalLeads} leads with ${conversionRate}% conversion.`;
    }

    if (q.includes('summary') || q.includes('overview')) {
      return `Dashboard Summary:\n\n• Total Leads: ${totalLeads}\n• Appointments: ${appointmentsBooked} (${conversionRate}%)\n• Hot Leads: ${hotLeads}\n• Storm Damage: ${stormDamageLeads}`;
    }

    return `Ask me about:\n• "What trends do you see?"\n• "Give me a summary"\n• "Show conversion stats"`;
  };

  const handleSubmit = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setLoading(true);
    setInput('');

    setTimeout(() => {
      const response = analyzeLeads(input);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center">
      <div className="bg-zinc-900 rounded-t-3xl w-full max-w-lg h-[80vh] flex flex-col">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">AI Insights</h2>
              <p className="text-xs text-zinc-500">Ask about your leads</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg bg-zinc-800 text-zinc-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <Bot className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <p className="text-zinc-400 mb-4">Ask me about your leads!</p>
              <div className="space-y-2">
                {["What trends do you see?", "Give me a summary"].map((q, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setMessages([{ role: 'user', content: q }]);
                      setLoading(true);
                      setTimeout(() => {
                        setMessages(prev => [...prev, { role: 'assistant', content: analyzeLeads(q) }]);
                        setLoading(false);
                      }, 500);
                    }}
                    className="block w-full text-left px-4 py-3 text-sm text-zinc-300 bg-zinc-800 rounded-xl active:bg-zinc-700"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'assistant' && (
                <div className="p-2 rounded-xl bg-amber-500/20 h-fit">
                  <Bot className="w-4 h-4 text-amber-400" />
                </div>
              )}
              <div className={`max-w-[80%] p-3 rounded-2xl text-sm whitespace-pre-wrap ${
                msg.role === 'user' ? 'bg-amber-500/20 text-white' : 'bg-zinc-800 text-zinc-200'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 h-fit">
                <Bot className="w-4 h-4 text-amber-400" />
              </div>
              <div className="bg-zinc-800 px-4 py-3 rounded-2xl">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-zinc-800 flex-shrink-0">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Ask about trends, conversions..."
              className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={handleSubmit}
              disabled={!input.trim() || loading}
              className="p-3 bg-amber-600 rounded-xl text-white disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

export default function RoofingApp() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [leads, setLeads] = useState<RoofingLead[]>([]);
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);
  const [showEstimateGenerator, setShowEstimateGenerator] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Fetch leads
  const fetchLeads = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('roofing_leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (!error && data) {
        setLeads(data);
      }
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch estimates
  const fetchEstimates = async () => {
    try {
      const { data, error } = await supabase
        .from('estimates')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (!error && data) {
        setEstimates(data);
      }
    } catch (error) {
      console.error('Failed to fetch estimates:', error);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchEstimates();
    const interval = setInterval(() => {
      fetchLeads();
      fetchEstimates();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Stats
  const totalLeads = leads.length;
  const appointmentsBooked = leads.filter(l => l.appointment_scheduled).length;
  const hotLeads = leads.filter(l => l.lead_quality?.toLowerCase() === 'hot').length;
  const stormDamageLeads = leads.filter(l => l.storm_damage).length;
  const totalEstimates = estimates.length;
  const acceptedEstimates = estimates.filter(e => e.status === 'accepted').length;

  // Tab content
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Total Leads" value={totalLeads} icon={Users} color="text-amber-400" trend="up" trendValue="+12%" />
              <StatCard label="Appointments" value={appointmentsBooked} icon={Calendar} color="text-emerald-400" trend="up" trendValue="+8%" />
              <StatCard label="Hot Leads" value={hotLeads} icon={Flame} color="text-red-400" />
              <StatCard label="Estimates" value={totalEstimates} icon={FileText} color="text-blue-400" />
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <GlowingCard onClick={() => setShowEstimateGenerator(true)}>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-base font-semibold text-white">New Estimate</div>
                      <div className="text-xs text-zinc-500">AI-powered</div>
                    </div>
                  </div>
                </GlowingCard>

                <GlowingCard onClick={() => setShowAIInsights(true)}>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-base font-semibold text-white">AI Insights</div>
                      <div className="text-xs text-zinc-500">Analyze trends</div>
                    </div>
                  </div>
                </GlowingCard>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Recent Leads</h2>
                <button onClick={() => setActiveTab('leads')} className="text-xs text-amber-400">View All</button>
              </div>
              {leads.slice(0, 3).map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  expanded={expandedLeadId === lead.id}
                  onToggle={() => setExpandedLeadId(expandedLeadId === lead.id ? null : lead.id)}
                />
              ))}
            </div>
          </div>
        );

      case 'leads':
        return (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">All Leads</h2>
              <button onClick={fetchLeads} disabled={loading} className="p-2 rounded-lg bg-zinc-800 text-zinc-400">
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            {leads.length === 0 ? (
              <div className="text-center py-12 text-zinc-500">
                <Phone className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No leads yet</p>
              </div>
            ) : (
              leads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  expanded={expandedLeadId === lead.id}
                  onToggle={() => setExpandedLeadId(expandedLeadId === lead.id ? null : lead.id)}
                />
              ))
            )}
          </div>
        );

      case 'estimates':
        return (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Estimates</h2>
              <button
                onClick={() => setShowEstimateGenerator(true)}
                className="flex items-center gap-2 px-4 py-2 bg-amber-600 rounded-xl text-white text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                New
              </button>
            </div>
            {estimates.length === 0 ? (
              <div className="text-center py-12 text-zinc-500">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No estimates yet</p>
                <button
                  onClick={() => setShowEstimateGenerator(true)}
                  className="mt-4 px-6 py-3 bg-amber-600 rounded-xl text-white font-medium"
                >
                  Generate First Estimate
                </button>
              </div>
            ) : (
              estimates.map((estimate) => (
                <EstimateCard key={estimate.id} estimate={estimate} />
              ))
            )}
          </div>
        );

      case 'calls':
        return (
          <div>
            <h2 className="text-lg font-bold text-white mb-4">Call Recordings</h2>
            <div className="space-y-3">
              {leads.filter(l => l.recording_url).slice(0, 10).map((lead) => (
                <GlowingCard key={lead.id}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-zinc-800 border border-zinc-700">
                        <Play className="w-5 h-5 text-zinc-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{lead.customer_name || 'Unknown'}</div>
                        <div className="text-xs text-zinc-500">
                          {new Date(lead.created_at).toLocaleDateString()} • {Math.floor((lead.duration_ms || 0) / 60000)}:{String(Math.floor(((lead.duration_ms || 0) % 60000) / 1000)).padStart(2, '0')}
                        </div>
                      </div>
                    </div>
                    <a
                      href={lead.recording_url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-amber-600 text-white"
                    >
                      <Headphones className="w-4 h-4" />
                    </a>
                  </div>
                </GlowingCard>
              ))}
              {leads.filter(l => l.recording_url).length === 0 && (
                <div className="text-center py-12 text-zinc-500">
                  <Headphones className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No recordings yet</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white mb-4">Settings</h2>
            <GlowingCard>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-zinc-800">
                  <Building2 className="w-5 h-5 text-zinc-400" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">Roofing Pros USA</div>
                  <div className="text-xs text-zinc-500">Florida Statewide</div>
                </div>
              </div>
            </GlowingCard>
            <GlowingCard>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
                    <Zap className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">AI Voice Agent</div>
                    <div className="text-xs text-emerald-400">Active</div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-zinc-500" />
              </div>
            </GlowingCard>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-lg border-b border-zinc-800">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Roofing Pros</h1>
              <p className="text-xs text-zinc-500">
                {lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAIInsights(true)}
              className="p-2.5 rounded-xl bg-zinc-800 text-zinc-400"
            >
              <Sparkles className="w-5 h-5" />
            </button>
            <button className="p-2.5 rounded-xl bg-zinc-800 text-zinc-400 relative">
              <Bell className="w-5 h-5" />
              {hotLeads > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center">
                  {hotLeads}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 pb-24">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-900/95 backdrop-blur-lg border-t border-zinc-800 safe-area-pb">
        <div className="flex items-center justify-around px-2 py-2">
          {[
            { id: 'dashboard' as TabType, icon: LayoutDashboard, label: 'Home' },
            { id: 'leads' as TabType, icon: Users, label: 'Leads' },
            { id: 'estimates' as TabType, icon: FileText, label: 'Estimates' },
            { id: 'calls' as TabType, icon: Phone, label: 'Calls' },
            { id: 'settings' as TabType, icon: Settings, label: 'Settings' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors ${
                activeTab === tab.id
                  ? 'text-amber-400 bg-amber-500/10'
                  : 'text-zinc-500'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* FAB for New Estimate */}
      {activeTab !== 'settings' && (
        <button
          onClick={() => setShowEstimateGenerator(true)}
          className="fixed bottom-20 right-4 z-30 p-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full shadow-lg shadow-amber-500/25"
        >
          <Plus className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Modals */}
      {showEstimateGenerator && (
        <EstimateGenerator onClose={() => setShowEstimateGenerator(false)} />
      )}

      {showAIInsights && (
        <AIInsightsPanel
          leads={leads}
          isOpen={showAIInsights}
          onClose={() => setShowAIInsights(false)}
        />
      )}
    </div>
  );
}
