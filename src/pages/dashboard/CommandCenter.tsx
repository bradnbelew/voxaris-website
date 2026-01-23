import { useRef, useEffect } from "react";
import { 
  PhoneCall, 
  Video, 
  BarChart3, 
  Activity, 
  Users, 
  Zap,
  Globe,
  Radio,
  Cpu,
  Trophy,
  ArrowUpRight,
  Timer
} from "lucide-react";
import { PerceptionRadar } from "@/components/dashboard/PerceptionRadar";

const CyberCard = ({ children, className = "", noHover = false }: { children: React.ReactNode; className?: string, noHover?: boolean }) => (
  <div className={`relative bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-xl p-6 transition-all duration-300 ${!noHover && 'hover:border-zinc-700 hover:shadow-lg hover:shadow-cyan-500/5'} ${className}`}>
    {children}
  </div>
);

const MetricCard = ({ label, value, trend, icon: Icon, color, trendColor }: any) => (
  <CyberCard>
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className={`flex items-center gap-1 text-xs font-mono px-2 py-1 rounded border ${trendColor || (trend > 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20')}`}>
        {trend > 0 ? '+' : ''}{trend}%
        <ArrowUpRight className={`w-3 h-3 ${trend > 0 ? '' : 'rotate-180'}`} />
      </div>
    </div>
    <div className="space-y-1">
      <div className="text-3xl font-bold text-white font-mono tracking-tighter">{value}</div>
      <div className="text-sm text-zinc-400 font-medium">{label}</div>
    </div>
  </CyberCard>
);

const FeedItem = ({ name, action, time, type }: any) => (
  <div className="group flex items-center justify-between py-3 border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/50 px-3 -mx-3 rounded-lg transition-colors">
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center border border-zinc-800 bg-zinc-900 text-xs font-bold ${type === 'video' ? 'text-purple-400' : 'text-cyan-400'}`}>
        {name.charAt(0)}
      </div>
      <div>
        <div className="text-sm font-medium text-zinc-100 group-hover:text-white transition-colors">{name}</div>
        <div className="text-xs text-zinc-500 font-mono">{action}</div>
      </div>
    </div>
    <div className="text-xs font-mono text-zinc-600 group-hover:text-zinc-400 transition-colors">{time}</div>
  </div>
);

const CommandCenter = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 lg:p-10 font-sans selection:bg-cyan-500/20">
      
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Command <span className="text-zinc-500">Center</span>
            </h1>
            <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono rounded-full flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              LIVE
            </span>
          </div>
          <p className="text-zinc-500 text-sm font-medium max-w-md">
            Real-time telemetry and unified analytics for all active neural agents.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 rounded-lg transition-all text-sm font-medium">
             <Cpu className="w-4 h-4" />
             Diagnostics
           </button>
           <button className="flex items-center gap-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_25px_rgba(6,182,212,0.25)] transition-all text-sm">
             <Zap className="w-4 h-4 fill-current" />
             New Agent
           </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        
        {/* Metric Cards */}
        <MetricCard 
          label="Active Conversations" 
          value="24" 
          trend={12} 
          icon={PhoneCall} 
          color="text-cyan-400"
        />
        <MetricCard 
          label="Conversion Rate" 
          value="38%" 
          trend={5.4} 
          icon={Trophy} 
          color="text-emerald-400"
        />
        <MetricCard 
          label="Avg Handle Time" 
          value="2:14" 
          trend={-8} 
          icon={Timer} 
          color="text-purple-400"
          trendColor="bg-zinc-800 text-zinc-400 border-zinc-800"
        />
        <MetricCard 
          label="Sentiment Index" 
          value="9.2" 
          trend={2.1} 
          icon={Activity} 
          color="text-pink-400"
        />

        {/* Center Stage: Radar & Feed */}
        <div className="md:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Visualizer */}
          <CyberCard className="lg:col-span-2 min-h-[460px] flex flex-col" noHover>
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                  <Radio className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white leading-none">Perception Radar</h3>
                  <span className="text-xs text-zinc-500 font-mono">TAVUS NEURAL ENGINE</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                 <div className="text-right hidden sm:block">
                    <div className="text-xs text-zinc-500 font-mono">CONFIDENCE</div>
                    <div className="text-sm font-bold text-emerald-400">98.4%</div>
                 </div>
              </div>
            </div>
            
            <div className="flex-1 w-full bg-zinc-950/30 rounded-xl border border-zinc-800/50 relative overflow-hidden">
               {/* Background Grid Effect */}
               <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
               <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
               <PerceptionRadar />
            </div>
          </CyberCard>

          {/* Activity Feed */}
          <CyberCard className="flex flex-col h-full" noHover>
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-zinc-400" />
              <h3 className="font-bold text-zinc-200">Live Activity</h3>
            </div>
            
            <div className="flex-1 space-y-1 overflow-y-auto pr-2 custom-scrollbar">
              <FeedItem name="Sarah Miller" action="Booking Confirmed" time="Just now" type="voice" />
              <FeedItem name="Mike Ross" action="Objection: Price" time="2m ago" type="video" />
              <FeedItem name="Jessica Chang" action="Call Started" time="4m ago" type="voice" />
              <FeedItem name="Guest #402" action="QR Scan Detected" time="12m ago" type="video" />
              <FeedItem name="Tom Holland" action="Sentiment Drop" time="15m ago" type="voice" />
              <FeedItem name="Alex Chen" action="Appointment Rescheduled" time="22m ago" type="voice" />
            </div>

            <button className="mt-6 w-full py-2.5 text-xs font-medium text-zinc-400 hover:text-white border border-dashed border-zinc-800 hover:border-zinc-600 rounded-lg transition-colors">
              VIEW SYSTEM LOGS
            </button>
          </CyberCard>
        </div>

        {/* Right Sidebar / Stats */}
        <CyberCard className="flex flex-col justify-between" noHover>
             <div>
               <h3 className="font-bold text-zinc-200 mb-6">System Health</h3>
               <div className="relative w-32 h-32 mx-auto mb-6">
                 <div className="absolute inset-0 rounded-full border-4 border-zinc-800"></div>
                 <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-l-transparent -rotate-45"></div>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-white">99%</span>
                    <span className="text-[10px] uppercase font-mono text-zinc-500">Uptime</span>
                 </div>
               </div>
             </div>
             
             <div className="space-y-4">
               <div className="p-3 bg-zinc-950/50 rounded-lg border border-zinc-800/50">
                 <div className="flex justify-between text-xs mb-1">
                   <span className="text-zinc-500">API Usage</span>
                   <span className="text-cyan-400">84%</span>
                 </div>
                 <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                   <div className="bg-cyan-500 h-full w-[84%]"></div>
                 </div>
               </div>
               
               <div className="p-3 bg-zinc-950/50 rounded-lg border border-zinc-800/50">
                 <div className="flex justify-between text-xs mb-1">
                   <span className="text-zinc-500">Database</span>
                   <span className="text-purple-400">42%</span>
                 </div>
                 <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                   <div className="bg-purple-500 h-full w-[42%]"></div>
                 </div>
               </div>
             </div>
        </CyberCard>

      </div>
    </div>
  );
};

export default CommandCenter;
