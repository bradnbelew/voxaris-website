// Database types for V-Suite
export type AppRole = 'super_admin' | 'admin' | 'user';
export type AgentType = 'voice' | 'video';
export type AgentStatus = 'active' | 'paused' | 'draft';

export interface Dealership {
  id: string;
  name: string;
  website_url: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  dealership_id: string | null;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
}

export interface Agent {
  id: string;
  dealership_id: string;
  name: string;
  role_title: string;
  type: AgentType;
  status: AgentStatus;
  avatar_url: string | null;
  system_prompt: string | null;
  webhook_url: string | null;
  voice_id: string | null;
  persona_id: string | null;
  knowledge_base: any[];
  objection_handling: any[];
  created_at: string;
  updated_at: string;
}

export interface AgentTemplate {
  id: string;
  name: string;
  role_title: string;
  type: AgentType;
  avatar_url: string | null;
  description: string | null;
  default_prompt: string | null;
  voice_id: string | null;
  persona_id: string | null;
  is_active: boolean;
  created_at: string;
}

export interface UsageLog {
  id: string;
  agent_id: string;
  dealership_id: string;
  calls_made: number;
  minutes_used: number;
  appointments_booked: number;
  log_date: string;
  created_at: string;
}
