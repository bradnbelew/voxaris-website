import ObjectionBreakdown from "@/components/voice/ObjectionBreakdown";
import { MOCK_OBJECTIONS } from "@/lib/voice/mock-data";

export default function VoiceObjectionsPage() {
  const totalObjections = MOCK_OBJECTIONS.reduce((sum, o) => sum + o.count, 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Objection Breakdown</h1>
        <p className="text-sm text-gray-500">
          {totalObjections} objections logged across all campaigns — strategic insights for each type
        </p>
      </div>

      <ObjectionBreakdown data={MOCK_OBJECTIONS} />
    </div>
  );
}
