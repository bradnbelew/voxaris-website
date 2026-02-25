import HotelList from "@/components/dashboard/HotelList";
import SessionViewer from "@/components/dashboard/SessionViewer";
import AuditLog from "@/components/dashboard/AuditLog";

interface DashboardPageProps {
  searchParams: Promise<{ tab?: string; hotelId?: string; sessionId?: string }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const tab = params.tab ?? "hotels";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          {tab === "hotels" && "Hotel Configurations"}
          {tab === "sessions" && "Active Sessions"}
          {tab === "audit" && "Audit Log"}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {tab === "hotels" && "Manage your hotel integrations and embed settings."}
          {tab === "sessions" && "Monitor live and recent guest sessions."}
          {tab === "audit" && "Full trail of every action, utterance, and decision."}
        </p>
      </div>

      {tab === "hotels" && <HotelList />}
      {tab === "sessions" && <SessionViewer hotelId={params.hotelId ?? undefined} />}
      {tab === "audit" && <AuditLog sessionId={params.sessionId ?? undefined} />}
    </div>
  );
}
