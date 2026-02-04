-- ============================================================================
-- Roofing Leads Table
-- Stores leads from Roofing Pros USA voice agent calls
-- ============================================================================

CREATE TABLE IF NOT EXISTS roofing_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Customer Information
  customer_name TEXT,
  customer_phone TEXT,
  customer_email TEXT,
  property_address TEXT,
  is_homeowner BOOLEAN,

  -- Roof Details
  roof_issue TEXT,
  storm_damage BOOLEAN DEFAULT FALSE,
  insurance_claim_filed BOOLEAN DEFAULT FALSE,
  wants_insurance_help BOOLEAN DEFAULT FALSE,

  -- Lead Quality & Urgency
  urgency_level TEXT,
  lead_quality TEXT,

  -- Appointment
  appointment_scheduled BOOLEAN DEFAULT FALSE,
  appointment_date TEXT,
  office_location TEXT,

  -- Call Outcome
  call_outcome TEXT,
  call_summary TEXT,
  recording_url TEXT,

  -- Call Metadata
  direction TEXT DEFAULT 'inbound',
  duration_ms INTEGER,

  -- Processing Status
  email_sent BOOLEAN DEFAULT FALSE,
  crm_synced BOOLEAN DEFAULT FALSE,
  crm_contact_id TEXT,
  crm_job_id TEXT
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_roofing_leads_created_at ON roofing_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_roofing_leads_customer_phone ON roofing_leads(customer_phone);
CREATE INDEX IF NOT EXISTS idx_roofing_leads_appointment ON roofing_leads(appointment_scheduled);
CREATE INDEX IF NOT EXISTS idx_roofing_leads_quality ON roofing_leads(lead_quality);
CREATE INDEX IF NOT EXISTS idx_roofing_leads_storm ON roofing_leads(storm_damage);

-- Enable RLS (Row Level Security) - disabled for now for simplicity
-- ALTER TABLE roofing_leads ENABLE ROW LEVEL SECURITY;

-- Comment on table
COMMENT ON TABLE roofing_leads IS 'Leads captured from Roofing Pros USA AI voice agent calls';
