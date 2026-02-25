import { optionalAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await optionalAuth();
  if (!userId) redirect("/dashboard/sign-in");

  return (
    <div className="min-h-screen bg-void">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-56 border-r border-gray-800 bg-void-light px-4 py-6">
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gold">Voxaris</h2>
          <p className="text-xs text-gray-500">Command Center</p>
        </div>

        <nav className="space-y-1">
          {[
            { label: "Hotels", href: "/dashboard", icon: "H" },
            { label: "Sessions", href: "/dashboard?tab=sessions", icon: "S" },
            { label: "Audit Log", href: "/dashboard?tab=audit", icon: "A" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded bg-gray-800 text-xs font-bold text-gold">
                {item.icon}
              </span>
              {item.label}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="ml-56 p-8">{children}</main>
    </div>
  );
}
