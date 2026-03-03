import type { TranscriptMessage } from "@/lib/voice/mock-data";

export default function TranscriptPanel({ messages }: { messages: TranscriptMessage[] }) {
  if (messages.length === 0) {
    return <p className="py-4 text-center text-sm text-gray-600">No transcript available.</p>;
  }

  return (
    <div className="space-y-2 py-3">
      {messages.map((msg, i) => {
        const isAI = msg.role === "assistant";
        return (
          <div key={i} className={`flex ${isAI ? "justify-start" : "justify-end"}`}>
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                isAI
                  ? "bg-gray-800 text-gray-200"
                  : "bg-gold/20 text-gold"
              }`}
            >
              <span className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                {isAI ? "AI Agent" : "Member"}
              </span>
              {msg.text}
            </div>
          </div>
        );
      })}
    </div>
  );
}
