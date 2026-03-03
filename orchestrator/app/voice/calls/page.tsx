import CallTable from "@/components/voice/CallTable";
import { MOCK_CALLS } from "@/lib/voice/mock-data";

export default function VoiceCallsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Call Log</h1>
        <p className="text-sm text-gray-500">
          Browse all voice calls with full transcripts
        </p>
      </div>

      <CallTable calls={MOCK_CALLS} />
    </div>
  );
}
