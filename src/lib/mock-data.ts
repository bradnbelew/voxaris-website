import type { AgentType, AgentStatus } from '@/types/database';

export interface MockAgent {
  id: string;
  name: string;
  role: string;
  type: AgentType;
  status: AgentStatus;
  avatar_url?: string;
}

export const MOCK_AGENTS: MockAgent[] = [
  {
    id: '1',
    name: 'Acquisition Olivia',
    role: 'Buyback Specialist',
    type: 'voice',
    status: 'active',
  },
  {
    id: '2',
    name: 'Service Maria',
    role: 'Service Advisor',
    type: 'voice',
    status: 'active',
  },
  {
    id: '3',
    name: 'Speed-to-Lead Sam',
    role: 'Lead Response Agent',
    type: 'voice',
    status: 'paused',
  },
  {
    id: '4',
    name: 'Showroom Host',
    role: 'Virtual Showroom Guide',
    type: 'video',
    status: 'active',
  },
  {
    id: '5',
    name: 'Visual Appraiser',
    role: 'Trade-In Specialist',
    type: 'video',
    status: 'draft',
  },
];
