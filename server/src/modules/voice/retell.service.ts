import Retell from 'retell-sdk';

// Mock data (until API key connects)
const MOCK_CANDIDATES = [
  {
    id: "agent_reception",
    name: "Jessica (Receptionist)",
    role: "Front Desk",
    description: "Handlers inbound calls, routing, and basic FAQs.",
    status: "active",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica"
  },
  {
    id: "agent_sales",
    name: "Michael (Sales)",
    role: "Sales Representative",
    description: "Aggressive closer. Specialized in handling objections.",
    status: "active",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael"
  },
  {
    id: "agent_support",
    name: "Sarah (Support)",
    role: "Customer Success",
    description: "Empathetic listener. managing tickets and scheduling.",
    status: "paused",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
  }
];

class RetellService {
  private client: Retell;

  constructor() {
    this.client = new Retell({
      apiKey: process.env.RETELL_API_KEY || 'mock_key',
    });
  }

  async getCandidates() {
    // In production, fetch from Retell API: await this.client.agent.list()
    // For now, return "Hiring Hall" mock data
    return MOCK_CANDIDATES;
  }
}

export const retellService = new RetellService();
