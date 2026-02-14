-- =====================================================
-- ROOFING FOLLOWUP ATTEMPTS TABLE
-- Tracks all outbound follow-up call attempts
-- =====================================================

CREATE TABLE IF NOT EXISTS roofing_followup_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Call identification
  phone TEXT NOT NULL,
  call_id TEXT,

  -- Attempt tracking
  attempt_number INT NOT NULL DEFAULT 1,
  max_attempts INT NOT NULL DEFAULT 6,

  -- Status: 'initiated', 'answered', 'voicemail', 'no_answer', 'busy', 'failed', 'cancelled'
  status TEXT NOT NULL DEFAULT 'initiated',

  -- Link to original lead
  original_lead_id UUID REFERENCES roofing_leads(id) ON DELETE SET NULL,

  -- Source tracking
  source TEXT, -- 'google_ads', 'facebook', 'website', 'manual'

  -- Error handling
  error_message TEXT,

  -- Call details (populated after call_analyzed)
  duration_seconds INT,
  outcome TEXT,
  appointment_booked BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_followup_phone ON roofing_followup_attempts(phone);
CREATE INDEX IF NOT EXISTS idx_followup_created ON roofing_followup_attempts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_followup_status ON roofing_followup_attempts(status);
CREATE INDEX IF NOT EXISTS idx_followup_lead ON roofing_followup_attempts(original_lead_id);

-- Composite index for finding active sequences
CREATE INDEX IF NOT EXISTS idx_followup_active ON roofing_followup_attempts(phone, status, created_at DESC);

-- Enable RLS
ALTER TABLE roofing_followup_attempts ENABLE ROW LEVEL SECURITY;

-- Service role has full access
CREATE POLICY "Service role full access" ON roofing_followup_attempts
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Comment
COMMENT ON TABLE roofing_followup_attempts IS 'Tracks all outbound follow-up call attempts for roofing leads with 6-attempt cadence over 7 days';
