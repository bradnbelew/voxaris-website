-- =====================================================
-- ROOFING CALL ANALYTICS TABLE
-- Aggregated analytics for reporting dashboard
-- =====================================================

CREATE TABLE IF NOT EXISTS roofing_call_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Call identification
  call_id TEXT UNIQUE NOT NULL,

  -- Call metadata
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  duration_seconds INT DEFAULT 0,

  -- Outcome tracking
  outcome TEXT, -- 'appointment_booked', 'callback_requested', 'not_interested', 'voicemail', 'no_answer', 'transferred'
  appointment_booked BOOLEAN DEFAULT FALSE,
  lead_quality TEXT CHECK (lead_quality IN ('hot', 'warm', 'cold')),

  -- Geographic
  office_location TEXT, -- 'jacksonville', 'orlando', 'tampa', 'pensacola', 'west_palm_beach', 'daytona_beach', 'melbourne'
  property_zip TEXT,

  -- Lead characteristics
  storm_damage BOOLEAN DEFAULT FALSE,
  has_insurance_claim BOOLEAN DEFAULT FALSE,
  urgency_level TEXT CHECK (urgency_level IN ('emergency', 'urgent', 'normal', 'just_browsing')),

  -- Source attribution
  source TEXT, -- 'phone', 'google_ads', 'facebook', 'website', 'referral'
  campaign_id TEXT, -- For ad tracking

  -- Agent info
  agent_id TEXT,
  is_followup BOOLEAN DEFAULT FALSE,
  followup_attempt_number INT,

  -- Customer info (for deduplication)
  customer_phone TEXT,

  -- Revenue tracking (future)
  estimated_value DECIMAL(10,2),
  actual_value DECIMAL(10,2),

  -- Timestamps
  call_started_at TIMESTAMPTZ,
  call_ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for dashboard queries
CREATE INDEX IF NOT EXISTS idx_analytics_created ON roofing_call_analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_office ON roofing_call_analytics(office_location);
CREATE INDEX IF NOT EXISTS idx_analytics_source ON roofing_call_analytics(source);
CREATE INDEX IF NOT EXISTS idx_analytics_direction ON roofing_call_analytics(direction);
CREATE INDEX IF NOT EXISTS idx_analytics_outcome ON roofing_call_analytics(outcome);
CREATE INDEX IF NOT EXISTS idx_analytics_appointment ON roofing_call_analytics(appointment_booked);
CREATE INDEX IF NOT EXISTS idx_analytics_storm ON roofing_call_analytics(storm_damage);
CREATE INDEX IF NOT EXISTS idx_analytics_quality ON roofing_call_analytics(lead_quality);

-- Composite indexes for common dashboard queries
CREATE INDEX IF NOT EXISTS idx_analytics_date_office ON roofing_call_analytics(created_at DESC, office_location);
CREATE INDEX IF NOT EXISTS idx_analytics_date_source ON roofing_call_analytics(created_at DESC, source);

-- Enable RLS
ALTER TABLE roofing_call_analytics ENABLE ROW LEVEL SECURITY;

-- Service role has full access
CREATE POLICY "Service role full access" ON roofing_call_analytics
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Comment
COMMENT ON TABLE roofing_call_analytics IS 'Aggregated call analytics for Roofing Pros USA dashboard and reporting';
