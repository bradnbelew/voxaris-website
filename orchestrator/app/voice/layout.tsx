import {
  BarChart3,
  Phone,
  ShieldAlert,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Overview", href: "/voice", icon: BarChart3 },
  { label: "Call Log", href: "/voice/calls", icon: Phone },
  { label: "Objections", href: "/voice/objections", icon: ShieldAlert },
];

export default function VoiceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-void">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-56 border-r border-gray-800 bg-void-light px-4 py-6">
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gold">Movvix</h2>
          <p className="text-xs text-gray-500">Voice Analytics</p>
        </div>

        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
              >
                <Icon className="h-4 w-4 text-gold" />
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-4 right-4">
          <div className="rounded-lg border border-gray-800 bg-gray-900/60 px-3 py-2">
            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-600">
              Powered by
            </p>
            <p className="text-xs font-semibold text-gray-400">Voxaris Voice</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-56 p-8">{children}</main>
    </div>
  );
}
