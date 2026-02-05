-- EstimAIte - Estimates Table
-- AI-powered roofing estimate generation

-- Create estimates table
CREATE TABLE IF NOT EXISTS estimates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Customer Information
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,

    -- Property Information
    property_address TEXT NOT NULL,
    property_city TEXT,
    property_state TEXT DEFAULT 'FL',
    property_zip TEXT,

    -- Issue Details
    roof_issue TEXT,
    issue_description TEXT,
    storm_damage BOOLEAN DEFAULT FALSE,
    storm_date DATE,
    leak_location TEXT,
    urgency TEXT CHECK (urgency IN ('low', 'medium', 'high', 'emergency')),

    -- Insurance
    has_insurance BOOLEAN,
    insurance_company TEXT,
    claim_filed BOOLEAN DEFAULT FALSE,
    claim_number TEXT,

    -- AI Analysis
    condition TEXT CHECK (condition IN ('good', 'fair', 'poor', 'critical')),
    condition_details TEXT,
    recommendation TEXT CHECK (recommendation IN ('repair', 'partial_replacement', 'full_replacement')),
    recommendation_reason TEXT,
    urgency_assessment TEXT,
    insurance_eligibility TEXT,
    additional_notes TEXT,

    -- Estimate Options (stored as JSONB)
    options JSONB DEFAULT '[]'::jsonb,
    recommended_option_id TEXT,

    -- Pricing Summary
    total_min NUMERIC(10, 2),
    total_max NUMERIC(10, 2),

    -- Financing
    financing_available BOOLEAN DEFAULT FALSE,
    financing_monthly NUMERIC(10, 2),
    financing_term INTEGER,
    financing_apr NUMERIC(5, 4),

    -- Status & Tracking
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired')),
    expires_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    viewed_at TIMESTAMPTZ,
    accepted_at TIMESTAMPTZ,

    -- Delivery Tracking
    email_sent BOOLEAN DEFAULT FALSE,
    email_opened BOOLEAN DEFAULT FALSE,
    sms_sent BOOLEAN DEFAULT FALSE,
    sms_clicked BOOLEAN DEFAULT FALSE,
    pdf_generated BOOLEAN DEFAULT FALSE,
    pdf_url TEXT,
    pdf_downloads INTEGER DEFAULT 0,

    -- Source & Integration
    source TEXT CHECK (source IN ('voice_call', 'web_form', 'manual', 'api')),
    call_id TEXT,
    crm_contact_id TEXT,
    crm_job_id TEXT,

    -- AI Metadata
    ai_model TEXT,
    ai_confidence INTEGER CHECK (ai_confidence >= 0 AND ai_confidence <= 100),
    ai_thinking_tokens INTEGER,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Client/Tenant (for multi-tenant future)
    client_id UUID
);

-- Create indexes for common queries
CREATE INDEX idx_estimates_customer_phone ON estimates(customer_phone);
CREATE INDEX idx_estimates_status ON estimates(status);
CREATE INDEX idx_estimates_created_at ON estimates(created_at DESC);
CREATE INDEX idx_estimates_property_zip ON estimates(property_zip);
CREATE INDEX idx_estimates_call_id ON estimates(call_id);
CREATE INDEX idx_estimates_client_id ON estimates(client_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_estimates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_estimates_updated_at
    BEFORE UPDATE ON estimates
    FOR EACH ROW
    EXECUTE FUNCTION update_estimates_updated_at();

-- Enable Row Level Security
ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all operations for service role (backend)
CREATE POLICY "Service role has full access to estimates"
    ON estimates
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Add comments
COMMENT ON TABLE estimates IS 'AI-generated roofing estimates from EstimAIte';
COMMENT ON COLUMN estimates.options IS 'Array of estimate options with pricing details';
COMMENT ON COLUMN estimates.ai_confidence IS 'AI confidence score 0-100 for the estimate';
