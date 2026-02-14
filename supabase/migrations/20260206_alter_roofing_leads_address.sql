-- =====================================================
-- ALTER ROOFING LEADS - Add Address Columns
-- Adds city, state, zip for proper geographic tracking
-- =====================================================

-- Add missing address columns
ALTER TABLE roofing_leads ADD COLUMN IF NOT EXISTS property_city TEXT;
ALTER TABLE roofing_leads ADD COLUMN IF NOT EXISTS property_state TEXT DEFAULT 'FL';
ALTER TABLE roofing_leads ADD COLUMN IF NOT EXISTS property_zip TEXT;

-- Add source tracking
ALTER TABLE roofing_leads ADD COLUMN IF NOT EXISTS lead_source TEXT; -- 'phone', 'google_ads', 'facebook', 'website'
ALTER TABLE roofing_leads ADD COLUMN IF NOT EXISTS campaign_id TEXT; -- For ad attribution

-- Add follow-up tracking
ALTER TABLE roofing_leads ADD COLUMN IF NOT EXISTS followup_count INT DEFAULT 0;
ALTER TABLE roofing_leads ADD COLUMN IF NOT EXISTS last_followup_at TIMESTAMPTZ;
ALTER TABLE roofing_leads ADD COLUMN IF NOT EXISTS next_followup_at TIMESTAMPTZ;
ALTER TABLE roofing_leads ADD COLUMN IF NOT EXISTS followup_status TEXT DEFAULT 'pending'; -- 'pending', 'in_progress', 'completed', 'cancelled'

-- Indexes for new columns
CREATE INDEX IF NOT EXISTS idx_leads_zip ON roofing_leads(property_zip);
CREATE INDEX IF NOT EXISTS idx_leads_city ON roofing_leads(property_city);
CREATE INDEX IF NOT EXISTS idx_leads_source ON roofing_leads(lead_source);
CREATE INDEX IF NOT EXISTS idx_leads_followup_status ON roofing_leads(followup_status);
CREATE INDEX IF NOT EXISTS idx_leads_next_followup ON roofing_leads(next_followup_at);

-- Comments
COMMENT ON COLUMN roofing_leads.property_city IS 'City extracted from property address';
COMMENT ON COLUMN roofing_leads.property_state IS 'State - defaults to FL for Florida operations';
COMMENT ON COLUMN roofing_leads.property_zip IS 'ZIP code for office routing';
COMMENT ON COLUMN roofing_leads.lead_source IS 'Attribution source: phone, google_ads, facebook, website';
COMMENT ON COLUMN roofing_leads.followup_status IS 'Current follow-up sequence status';
