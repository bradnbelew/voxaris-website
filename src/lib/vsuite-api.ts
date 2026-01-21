const VSUITE_BASE_URL = "https://hill-nissan-backend.onrender.com";

export interface VSuiteAgent {
  id: string;
  name: string;
  type: "voice" | "video";
  status: "active" | "paused" | "draft";
  [key: string]: unknown;
}

export interface VSuiteResponse<T> {
  data: T;
  error?: string;
}

/**
 * Fetch agents from the V-Suite backend
 */
export const fetchVSuiteAgents = async (
  orgKey: string
): Promise<VSuiteResponse<VSuiteAgent[]>> => {
  try {
    const res = await fetch(`${VSUITE_BASE_URL}/api/v-suite/agents`, {
      headers: {
        "x-org-key": orgKey,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return { data: [], error: `Failed to fetch agents: ${res.statusText}` };
    }

    const data = await res.json();
    return { data };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

/**
 * Get embed URL for an agent
 */
export const getAgentEmbedUrl = (agentId: string): string => {
  return `${VSUITE_BASE_URL}/embed/${agentId}`;
};
