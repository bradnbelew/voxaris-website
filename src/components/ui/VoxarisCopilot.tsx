import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Suggestion {
  message: string;
  action?: () => void;
  actionLabel?: string;
}

export function VoxarisCopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Autonomous Loop: Monitor user state and offer proactive suggestions
  useEffect(() => {
    // Reset dismissed state on route change
    setDismissed(false);
    setSuggestion(null);
    setIsOpen(false);

    const checkState = () => {
      // Context-aware suggestions based on current page
      let newSuggestion: Suggestion | null = null;

      if (location.pathname === "/dashboard") {
        // On Command Center - suggest hiring if no agents
        setTimeout(() => {
          if (!dismissed) {
            newSuggestion = {
              message: "I noticed you haven't deployed an agent yet. Want me to take you to the Hiring Hall?",
              action: () => navigate("/dashboard/hiring-hall"),
              actionLabel: "Go to Hiring Hall",
            };
            setSuggestion(newSuggestion);
            setIsOpen(true);
          }
        }, 8000);
      } else if (location.pathname === "/dashboard/hiring-hall") {
        setTimeout(() => {
          if (!dismissed) {
            newSuggestion = {
              message: "Pro tip: Start with 'Acquisition Olivia' for inbound leads. She's our top performer!",
              actionLabel: "Got it",
            };
            setSuggestion(newSuggestion);
            setIsOpen(true);
          }
        }, 5000);
      } else if (location.pathname === "/dashboard/my-staff") {
        setTimeout(() => {
          if (!dismissed) {
            newSuggestion = {
              message: "Need to test an agent? Head to the Agent Test Lab to preview your embed.",
              action: () => navigate("/dashboard/agent-test"),
              actionLabel: "Open Test Lab",
            };
            setSuggestion(newSuggestion);
            setIsOpen(true);
          }
        }, 6000);
      }
    };

    checkState();

    return () => {
      // Cleanup
    };
  }, [location.pathname, dismissed, navigate]);

  const handleAction = () => {
    if (suggestion?.action) {
      suggestion.action();
    }
    setIsOpen(false);
    setDismissed(true);
  };

  const handleDismiss = () => {
    setIsOpen(false);
    setDismissed(true);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex items-end gap-4">
      {/* Suggestion Panel */}
      {isOpen && suggestion && (
        <div
          className={cn(
            "w-72 rounded-xl border border-emerald-500/20 p-4 shadow-2xl backdrop-blur-md",
            "bg-[#0a0f1d]/95 animate-fade-in"
          )}
        >
          <div className="mb-2 flex items-center gap-2 text-emerald-400">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Aizee Autopilot
            </span>
          </div>
          <p className="mb-3 text-sm text-gray-300">{suggestion.message}</p>
          <div className="flex gap-2">
            {suggestion.actionLabel && (
              <button
                onClick={handleAction}
                className="flex-1 rounded-md bg-emerald-500/10 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 transition-colors"
              >
                {suggestion.actionLabel}
              </button>
            )}
            <button
              onClick={handleDismiss}
              className="rounded-md px-3 py-1.5 text-xs text-gray-500 hover:text-white transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* The "Orb" Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "group relative flex h-14 w-14 items-center justify-center rounded-full",
          "bg-[#0a0f1d] shadow-[0_0_20px_rgba(52,211,153,0.3)]",
          "transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(52,211,153,0.5)]"
        )}
        aria-label="Toggle Aizee Copilot"
      >
        <div className="absolute inset-0 rounded-full border border-emerald-500/30 opacity-50" />
        <div className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse" />
      </button>
    </div>
  );
}
