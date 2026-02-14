-- =====================================================
-- ROOFING PROS USA - Initial Database Schema
-- Migration: 001_initial_schema.sql
-- Created: 2026-02-07
-- =====================================================

-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CLIENTS TABLE
-- Multi-tenant support for different businesses
-- =====================================================
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id TEXT UNIQUE NOT NULL,           -- 'roofing-pros'
  company_name TEXT NOT NULL,               -- 'Roofing Pros USA'
  owner_name TEXT,                          -- 'Rick Dorman'
  owner_email TEXT,
  owner_phone TEXT,
  notification_email TEXT,                  -- Where to send lead alerts

  -- Retell Config
  retell_agent_id TEXT,
  retell_llm_id TEXT,
  retell_outbound_agent_id TEXT,
  retell_outbound_llm_id TEXT,
  retell_phone TEXT,

  -- Tavus Config
  tavus_persona_id TEXT,
  tavus_replica_id TEXT,
  tavus_voice_id TEXT,

  -- GHL Config
  ghl_location_id TEXT,
  ghl_api_key TEXT,                         -- Encrypted in production
  ghl_pipeline_id TEXT,

  -- Settings
  config JSONB DEFAULT '{}'::JSONB,
  timezone TEXT DEFAULT 'America/New_York',
  business_hours JSONB DEFAULT '{"start": "08:00", "end": "21:00"}'::JSONB,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- CALL_LOGS TABLE
-- Track all voice and video calls
-- =====================================================
CREATE TABLE IF NOT EXISTS public.call_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  call_id TEXT UNIQUE NOT NULL,
  client_id UUID REFERENCES public.clients(id),

  -- Call Details
  platform TEXT CHECK (platform IN ('retell', 'tavus')) NOT NULL,
  direction TEXT CHECK (direction IN ('inbound', 'outbound')) NOT NULL,
  agent_id TEXT,

  -- Contact Info
  customer_phone TEXT,
  customer_name TEXT,
  customer_email TEXT,

  -- Timing
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER,

  -- Content
  transcript TEXT,
  summary TEXT,
  recording_url TEXT,

  -- Analysis
  outcome TEXT,                              -- 'appointment_booked', 'callback_requested', etc.
  sentiment_score INTEGER,                   -- 0-100
  urgency TEXT CHECK (urgency IN ('low', 'medium', 'high', 'emergency')),

  -- Extracted Data
  property_address TEXT,
  property_zip TEXT,
  is_homeowner BOOLEAN,
  issue_type TEXT,                           -- 'leak', 'storm_damage', 'replacement', etc.
  has_insurance_claim BOOLEAN DEFAULT FALSE,

  -- Appointment
  appointment_booked BOOLEAN DEFAULT FALSE,
  appointment_date DATE,
  appointment_time TEXT,                     -- 'morning' or 'afternoon'

  -- Status
  flagged BOOLEAN DEFAULT FALSE,
  flagged_reason TEXT,

  -- Raw Data
  metadata JSONB,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- VIDEO_SESSIONS TABLE
-- Track Tavus Coach Pro training sessions
-- =====================================================
CREATE TABLE IF NOT EXISTS public.video_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  client_id UUID REFERENCES public.clients(id),

  -- Trainee Info
  trainee_name TEXT NOT NULL,
  trainee_email TEXT,

  -- Session Details
  topic TEXT,                                -- 'sales', 'objection_handling', etc.
  persona_id TEXT,

  -- Timing
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER,

  -- Analysis
  transcript TEXT,
  feedback TEXT,
  performance_score INTEGER,                 -- 0-100

  -- Raven Perception Data
  perception_data JSONB,                     -- Eye contact, body language, emotions

  -- Status
  status TEXT CHECK (status IN ('started', 'completed', 'abandoned')) DEFAULT 'started',

  -- Raw Data
  metadata JSONB,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- LEADS TABLE
-- Qualified leads from calls
-- =====================================================
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID REFERENCES public.clients(id),
  call_id TEXT REFERENCES public.call_logs(call_id),

  -- Contact Info
  first_name TEXT,
  last_name TEXT,
  phone TEXT NOT NULL,
  email TEXT,

  -- Property Info
  address TEXT,
  city TEXT,
  state TEXT DEFAULT 'FL',
  zip TEXT,
  is_homeowner BOOLEAN,

  -- Lead Details
  issue_type TEXT,
  issue_description TEXT,
  urgency TEXT CHECK (urgency IN ('low', 'medium', 'high', 'emergency')),
  has_insurance_claim BOOLEAN DEFAULT FALSE,

  -- Appointment
  appointment_booked BOOLEAN DEFAULT FALSE,
  appointment_date DATE,
  appointment_time TEXT,

  -- GHL Sync Status
  ghl_contact_id TEXT,
  ghl_synced BOOLEAN DEFAULT FALSE,
  ghl_synced_at TIMESTAMPTZ,
  ghl_appointment_id TEXT,

  -- Pipeline
  pipeline_stage TEXT DEFAULT 'new_lead',    -- 'new_lead', 'qualified', 'inspection_booked', etc.

  -- Scoring
  lead_score INTEGER,                        -- 0-100
  sentiment TEXT,                            -- 'positive', 'neutral', 'negative'

  -- Tags
  tags TEXT[] DEFAULT '{}',

  -- Source
  source TEXT DEFAULT 'retell_inbound',      -- 'retell_inbound', 'retell_outbound', 'tavus', etc.

  -- Raw Data
  metadata JSONB,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ERROR_LOGS TABLE
-- Track webhook and processing errors
-- =====================================================
CREATE TABLE IF NOT EXISTS public.error_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID REFERENCES public.clients(id),

  -- Error Details
  error_type TEXT NOT NULL,                  -- 'webhook', 'ghl_sync', 'email', etc.
  error_code TEXT,
  error_message TEXT NOT NULL,
  stack_trace TEXT,

  -- Context
  source TEXT,                               -- 'retell', 'tavus', 'ghl', etc.
  job_id TEXT,
  call_id TEXT,
  contact_id TEXT,

  -- Raw Data
  request_body JSONB,
  response_body JSONB,

  -- Resolution
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  resolved_by TEXT,
  resolution_notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- DNC_LIST TABLE
-- Do Not Call list for TCPA compliance
-- =====================================================
CREATE TABLE IF NOT EXISTS public.dnc_list (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID REFERENCES public.clients(id),

  phone_number TEXT NOT NULL,                -- E.164 format: +14071234567
  reason TEXT,                               -- 'customer_request', 'tcpa_violation', 'wrong_number', etc.
  source TEXT DEFAULT 'manual',              -- 'retell_agent', 'api', 'manual', 'import'

  added_by TEXT DEFAULT 'system',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create unique constraint for phone_number (global DNC - not per client)
CREATE UNIQUE INDEX IF NOT EXISTS idx_dnc_phone_number ON public.dnc_list(phone_number);

-- =====================================================
-- INDEXES
-- =====================================================

-- Call logs
CREATE INDEX IF NOT EXISTS idx_call_logs_client ON public.call_logs(client_id);
CREATE INDEX IF NOT EXISTS idx_call_logs_platform ON public.call_logs(platform);
CREATE INDEX IF NOT EXISTS idx_call_logs_started_at ON public.call_logs(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_call_logs_phone ON public.call_logs(customer_phone);
CREATE INDEX IF NOT EXISTS idx_call_logs_appointment ON public.call_logs(appointment_booked) WHERE appointment_booked = TRUE;

-- Video sessions
CREATE INDEX IF NOT EXISTS idx_video_sessions_client ON public.video_sessions(client_id);
CREATE INDEX IF NOT EXISTS idx_video_sessions_trainee ON public.video_sessions(trainee_email);

-- Leads
CREATE INDEX IF NOT EXISTS idx_leads_client ON public.leads(client_id);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON public.leads(phone);
CREATE INDEX IF NOT EXISTS idx_leads_ghl_synced ON public.leads(ghl_synced) WHERE ghl_synced = FALSE;
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);

-- Error logs
CREATE INDEX IF NOT EXISTS idx_error_logs_client ON public.error_logs(client_id);
CREATE INDEX IF NOT EXISTS idx_error_logs_unresolved ON public.error_logs(resolved) WHERE resolved = FALSE;
CREATE INDEX IF NOT EXISTS idx_error_logs_created_at ON public.error_logs(created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dnc_list ENABLE ROW LEVEL SECURITY;

-- Service role can do everything
CREATE POLICY "Service role full access" ON public.clients FOR ALL USING (TRUE);
CREATE POLICY "Service role full access" ON public.call_logs FOR ALL USING (TRUE);
CREATE POLICY "Service role full access" ON public.video_sessions FOR ALL USING (TRUE);
CREATE POLICY "Service role full access" ON public.leads FOR ALL USING (TRUE);
CREATE POLICY "Service role full access" ON public.error_logs FOR ALL USING (TRUE);
CREATE POLICY "Service role full access" ON public.dnc_list FOR ALL USING (TRUE);

-- =====================================================
-- UPDATED_AT TRIGGER
-- =====================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables with updated_at
CREATE TRIGGER set_updated_at_clients
  BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_updated_at_call_logs
  BEFORE UPDATE ON public.call_logs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_updated_at_video_sessions
  BEFORE UPDATE ON public.video_sessions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_updated_at_leads
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================================================
-- SEED DATA
-- =====================================================

INSERT INTO public.clients (
  client_id,
  company_name,
  owner_name,
  owner_email,
  notification_email,
  retell_agent_id,
  retell_llm_id,
  retell_outbound_agent_id,
  retell_outbound_llm_id,
  retell_phone,
  tavus_persona_id,
  tavus_replica_id,
  tavus_voice_id,
  timezone
) VALUES (
  'roofing-pros',
  'Roofing Pros USA',
  'Rick Dorman',
  'michael@roofingprosusa.com',
  'ethan@voxaris.io',
  'agent_83e716b69e9a025d6ade2b19f3',
  'llm_1d3d1de35f79d7c30f32942f1a48',
  'agent_a69305c2fdf8246dadcae8284e',
  'llm_48e08677b331e66133b292a7bec1',
  '+14072891565',
  'p8b294d153dd',
  'r4dcf31b60e1',
  'f9836c6e-a0bd-460e-9d3c-f7299fa60f94',
  'America/New_York'
) ON CONFLICT (client_id) DO UPDATE SET
  company_name = EXCLUDED.company_name,
  owner_name = EXCLUDED.owner_name,
  notification_email = EXCLUDED.notification_email,
  retell_agent_id = EXCLUDED.retell_agent_id,
  retell_llm_id = EXCLUDED.retell_llm_id,
  retell_outbound_agent_id = EXCLUDED.retell_outbound_agent_id,
  retell_outbound_llm_id = EXCLUDED.retell_outbound_llm_id,
  retell_phone = EXCLUDED.retell_phone,
  tavus_persona_id = EXCLUDED.tavus_persona_id,
  tavus_replica_id = EXCLUDED.tavus_replica_id,
  tavus_voice_id = EXCLUDED.tavus_voice_id,
  updated_at = NOW();

-- =====================================================
-- DONE
-- =====================================================
