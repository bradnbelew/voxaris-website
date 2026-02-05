/**
 * Roofing Pros USA - Demo Landing Page
 *
 * For live demos showing:
 * 1. Outbound call triggering
 * 2. Memory/context injection
 * 3. Follow-up cadence
 */

import { useState } from 'react';
import { Phone, Brain, Clock, CheckCircle, Loader2, User, MapPin, AlertTriangle } from 'lucide-react';

interface MemoryEntry {
  id: string;
  memory: string;
  created_at: string;
}

interface CallResult {
  success: boolean;
  callId?: string;
  error?: string;
}

export default function RoofingDemo() {
  // Form state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [roofIssue, setRoofIssue] = useState('');

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [callResult, setCallResult] = useState<CallResult | null>(null);
  const [memories, setMemories] = useState<MemoryEntry[]>([]);
  const [isLoadingMemories, setIsLoadingMemories] = useState(false);
  const [addMemoryText, setAddMemoryText] = useState('');
  const [isAddingMemory, setIsAddingMemory] = useState(false);

  const API_BASE = import.meta.env.PROD
    ? 'https://voxaris-server.vercel.app'
    : 'http://localhost:3000';

  const MEM0_API_KEY = 'm0-lrQxi5m3jUu112Uwvie3krbJwYwBmi0izVBZVznm';

  // Format phone number for API
  const formatPhone = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) return `+1${digits}`;
    if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
    return `+${digits}`;
  };

  // Trigger outbound call
  const handleTriggerCall = async () => {
    if (!phoneNumber) {
      alert('Please enter a phone number');
      return;
    }

    setIsLoading(true);
    setCallResult(null);

    try {
      // First, fetch memories for context
      await fetchMemories();

      const response = await fetch(`${API_BASE}/api/roofing/call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toNumber: formatPhone(phoneNumber),
          customerName: customerName || 'Valued Customer',
          context: roofIssue ? `Customer mentioned: ${roofIssue}` : ''
        })
      });

      const data = await response.json();
      setCallResult(data);
    } catch (error: any) {
      setCallResult({ success: false, error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch memories for phone number
  const fetchMemories = async () => {
    if (!phoneNumber) return;

    setIsLoadingMemories(true);
    try {
      const formattedPhone = encodeURIComponent(formatPhone(phoneNumber));
      const response = await fetch(`https://api.mem0.ai/v1/memories/?user_id=${formattedPhone}`, {
        headers: {
          'Authorization': `Token ${MEM0_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      setMemories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching memories:', error);
      setMemories([]);
    } finally {
      setIsLoadingMemories(false);
    }
  };

  // Add new memory
  const handleAddMemory = async () => {
    if (!phoneNumber || !addMemoryText) {
      alert('Please enter phone number and memory text');
      return;
    }

    setIsAddingMemory(true);
    try {
      const response = await fetch('https://api.mem0.ai/v1/memories/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${MEM0_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: addMemoryText }],
          user_id: formatPhone(phoneNumber),
          metadata: {
            phone: formatPhone(phoneNumber),
            source: 'demo_page',
            added_at: new Date().toISOString()
          }
        })
      });

      if (response.ok) {
        setAddMemoryText('');
        // Wait for processing then refresh
        setTimeout(fetchMemories, 3000);
        alert('Memory added! It will appear in a few seconds.');
      }
    } catch (error) {
      console.error('Error adding memory:', error);
    } finally {
      setIsAddingMemory(false);
    }
  };

  // Clear all memories for phone
  const handleClearMemories = async () => {
    if (!phoneNumber) return;
    if (!confirm('Are you sure you want to clear all memories for this phone number?')) return;

    try {
      // Delete each memory
      for (const memory of memories) {
        await fetch(`https://api.mem0.ai/v1/memories/${memory.id}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Token ${MEM0_API_KEY}`,
          }
        });
      }
      setMemories([]);
    } catch (error) {
      console.error('Error clearing memories:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Roofing Pros USA</h1>
                <p className="text-sm text-blue-200">AI Voice Agent Demo</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              System Online
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">

          {/* Left Column - Trigger Call */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Trigger Outbound Call</h2>
                  <p className="text-sm text-slate-400">Enter details and receive a call</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="(407) 555-1234"
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Customer Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="John Smith"
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Property Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="123 Main St, Orlando FL 32801"
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Roof Issue
                  </label>
                  <div className="relative">
                    <AlertTriangle className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <textarea
                      value={roofIssue}
                      onChange={(e) => setRoofIssue(e.target.value)}
                      placeholder="Describe the roof issue..."
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>

                <button
                  onClick={handleTriggerCall}
                  disabled={isLoading || !phoneNumber}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Initiating Call...
                    </>
                  ) : (
                    <>
                      <Phone className="w-5 h-5" />
                      Trigger Outbound Call
                    </>
                  )}
                </button>

                {callResult && (
                  <div className={`p-4 rounded-lg ${callResult.success ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
                    {callResult.success ? (
                      <div className="flex items-center gap-2 text-green-400">
                        <CheckCircle className="w-5 h-5" />
                        <span>Call initiated! ID: {callResult.callId}</span>
                      </div>
                    ) : (
                      <div className="text-red-400">
                        Error: {callResult.error}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Follow-up Cadence Info */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Follow-up Cadence</h2>
                  <p className="text-sm text-slate-400">Automated call sequence</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { attempt: 1, time: 'Immediate', desc: 'First contact attempt' },
                  { attempt: 2, time: '15 minutes', desc: 'Quick follow-up' },
                  { attempt: 3, time: '2 hours', desc: 'Same day retry' },
                  { attempt: 4, time: 'Next day', desc: '24 hours later' },
                  { attempt: 5, time: 'Day 3', desc: 'Third day follow-up' },
                  { attempt: 6, time: 'Day 7', desc: 'Final attempt' },
                ].map((item) => (
                  <div key={item.attempt} className="flex items-center gap-3 text-sm">
                    <div className="w-6 h-6 bg-purple-500/30 rounded-full flex items-center justify-center text-purple-300 font-medium">
                      {item.attempt}
                    </div>
                    <div className="flex-1">
                      <span className="text-white font-medium">{item.time}</span>
                      <span className="text-slate-400 ml-2">— {item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Memory */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-pink-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Customer Memory</h2>
                    <p className="text-sm text-slate-400">Powered by Mem0</p>
                  </div>
                </div>
                <button
                  onClick={fetchMemories}
                  disabled={!phoneNumber || isLoadingMemories}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white text-sm rounded-lg transition-all flex items-center gap-2"
                >
                  {isLoadingMemories ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Refresh'
                  )}
                </button>
              </div>

              {/* Memory List */}
              <div className="space-y-3 mb-6">
                {memories.length > 0 ? (
                  memories.map((memory) => (
                    <div key={memory.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-white text-sm">{memory.memory}</p>
                      <p className="text-xs text-slate-500 mt-2">
                        {new Date(memory.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <Brain className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No memories found for this phone number</p>
                    <p className="text-sm mt-1">Add some context below or make a call</p>
                  </div>
                )}
              </div>

              {memories.length > 0 && (
                <button
                  onClick={handleClearMemories}
                  className="w-full py-2 text-red-400 hover:text-red-300 text-sm transition-all"
                >
                  Clear All Memories
                </button>
              )}

              {/* Add Memory */}
              <div className="border-t border-white/10 pt-6 mt-6">
                <h3 className="text-sm font-medium text-white mb-3">Add Customer Context</h3>
                <textarea
                  value={addMemoryText}
                  onChange={(e) => setAddMemoryText(e.target.value)}
                  placeholder="E.g., Customer has a leak in the master bedroom. Storm damage from last month. Wants help with insurance claim."
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none text-sm"
                />
                <button
                  onClick={handleAddMemory}
                  disabled={!phoneNumber || !addMemoryText || isAddingMemory}
                  className="mt-3 w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  {isAddingMemory ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Adding Memory...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4" />
                      Add to Memory
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">How It Works</h3>
              <div className="space-y-4 text-sm">
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0">1</div>
                  <p className="text-slate-300">Lead fills out form or ad → Immediate outbound call triggered</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0">2</div>
                  <p className="text-slate-300">AI agent (Sarah) calls and attempts to book inspection</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0">3</div>
                  <p className="text-slate-300">If no answer → Voicemail + automatic follow-up scheduled</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0">4</div>
                  <p className="text-slate-300">Memory stores context → Personalized follow-up calls</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0">✓</div>
                  <p className="text-slate-300">Appointment booked → Sync to CRM, cancel follow-ups</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-slate-500">
          <p>Powered by <span className="text-blue-400">Voxaris AI</span> • Retell Voice • Mem0 Memory</p>
        </div>
      </div>
    </div>
  );
}
