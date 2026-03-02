-- Voxaris Leads Pipeline
-- Tables: contacts, calls, sms_log
-- Run this in Supabase SQL Editor

-- ── Contacts ──
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  name TEXT,
  email TEXT,
  tags TEXT[] DEFAULT '{}',
  source TEXT DEFAULT 'Voxaris AI Agent',
  agent_name TEXT,
  appointment_booked BOOLEAN DEFAULT FALSE,
  last_call_at TIMESTAMPTZ,
  last_sentiment TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Unique index on phone for upsert
CREATE UNIQUE INDEX IF NOT EXISTS contacts_phone_idx ON contacts (phone);

-- ── Calls ──
CREATE TABLE IF NOT EXISTS calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  retell_call_id TEXT UNIQUE NOT NULL,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  agent_id TEXT NOT NULL,
  agent_name TEXT,
  direction TEXT DEFAULT 'inbound',
  duration_seconds INTEGER DEFAULT 0,
  summary TEXT,
  sentiment TEXT,
  appointment_booked BOOLEAN DEFAULT FALSE,
  recording_url TEXT,
  transcript TEXT,
  call_status TEXT,
  disconnection_reason TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS calls_contact_id_idx ON calls (contact_id);
CREATE INDEX IF NOT EXISTS calls_agent_id_idx ON calls (agent_id);
CREATE INDEX IF NOT EXISTS calls_created_at_idx ON calls (created_at DESC);

-- ── SMS Log ──
CREATE TABLE IF NOT EXISTS sms_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  direction TEXT DEFAULT 'outbound',
  status TEXT DEFAULT 'sent',
  twilio_sid TEXT,
  trigger_type TEXT DEFAULT 'post_call',
  agent_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sms_log_contact_id_idx ON sms_log (contact_id);
CREATE INDEX IF NOT EXISTS sms_log_phone_idx ON sms_log (phone);

-- ── Auto-update updated_at on contacts ──
CREATE OR REPLACE FUNCTION update_contacts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS contacts_updated_at_trigger ON contacts;
CREATE TRIGGER contacts_updated_at_trigger
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_contacts_updated_at();

-- ── RLS Policies ──
-- Service role key bypasses RLS, but enable it for safety
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_log ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (our serverless functions use service role key)
CREATE POLICY "Service role full access" ON contacts FOR ALL USING (true);
CREATE POLICY "Service role full access" ON calls FOR ALL USING (true);
CREATE POLICY "Service role full access" ON sms_log FOR ALL USING (true);
