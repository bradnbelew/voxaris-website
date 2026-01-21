import { useEffect } from "react";

interface VoxarisEmbedProps {
  agentId: string;
}

export function VoxarisEmbed({ agentId }: VoxarisEmbedProps) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://hill-nissan-backend.onrender.com/embed.js";
    script.async = true;
    script.setAttribute("data-agent-id", agentId);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [agentId]);

  return <div id="voxaris-embed-container" className="w-full h-full" />;
}
