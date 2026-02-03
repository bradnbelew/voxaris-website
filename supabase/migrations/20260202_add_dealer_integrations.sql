-- ============================================
-- DEALER INTEGRATIONS TABLE
-- ============================================
-- Stores encrypted per-dealer API credentials
-- for GHL and other integrations.
--
-- Run with: supabase db push
-- ============================================

-- Create the dealer_integrations table
CREATE TABLE IF NOT EXISTS dealer_integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dealer_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  integration_type TEXT NOT NULL,
  api_key_encrypted TEXT NOT NULL,
  refresh_token_encrypted TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  scopes JSONB DEFAULT '[]'::jsonb,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Each dealer can only have one integration of each type
  UNIQUE(dealer_id, integration_type)
);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_dealer_integrations_dealer_id
  ON dealer_integrations(dealer_id);

CREATE INDEX IF NOT EXISTS idx_dealer_integrations_type
  ON dealer_integrations(integration_type);

-- Add RLS policies (critical for multi-tenant security)
ALTER TABLE dealer_integrations ENABLE ROW LEVEL SECURITY;

-- Service role (backend) has full access
CREATE POLICY "Service role full access" ON dealer_integrations
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Dealers can only read their own integrations
CREATE POLICY "Dealers view own integrations" ON dealer_integrations
  FOR SELECT
  USING (dealer_id IN (
    SELECT id FROM clients
    WHERE id = (
      SELECT (auth.jwt() -> 'user_metadata' ->> 'dealer_id')::uuid
    )
  ));

-- Dealers cannot modify integrations directly (must go through API)
-- This prevents unauthorized credential changes

-- ============================================
-- ADD ghl_synced COLUMN TO CALLS TABLE
-- ============================================
-- Tracks whether a call has been synced to GHL
-- Used for partial success handling

ALTER TABLE calls
ADD COLUMN IF NOT EXISTS ghl_synced BOOLEAN DEFAULT FALSE;

-- Index for finding unsynced calls
CREATE INDEX IF NOT EXISTS idx_calls_ghl_unsynced
  ON calls(ghl_synced)
  WHERE ghl_synced = FALSE;

-- ============================================
-- FIX EXISTING RLS POLICIES (CRITICAL)
-- ============================================
-- Replace overly permissive policies with tenant isolation

-- Drop existing permissive policies on calls table
DROP POLICY IF EXISTS "Enable read access for all users" ON calls;
DROP POLICY IF EXISTS "Enable insert for all users" ON calls;
DROP POLICY IF EXISTS "Enable update for all users" ON calls;
DROP POLICY IF EXISTS "Enable delete for all users" ON calls;

-- Create proper tenant-isolated policies
CREATE POLICY "Service role full access on calls" ON calls
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Dealers view own calls" ON calls
  FOR SELECT
  USING (client_id IN (
    SELECT id FROM clients
    WHERE id = (
      SELECT (auth.jwt() -> 'user_metadata' ->> 'dealer_id')::uuid
    )
  ));

-- ============================================
-- ADD INDEXES FOR PERFORMANCE
-- ============================================

-- Index for client lookups by Retell agent
CREATE INDEX IF NOT EXISTS idx_clients_retell_agent
  ON clients(retell_agent_id)
  WHERE active = TRUE;

-- Index for client lookups by Tavus persona
CREATE INDEX IF NOT EXISTS idx_clients_tavus_persona
  ON clients(tavus_persona_id)
  WHERE active = TRUE;

-- Index for call queries by client and date
CREATE INDEX IF NOT EXISTS idx_calls_client_created
  ON calls(client_id, created_at DESC);

-- Index for call queries by platform
CREATE INDEX IF NOT EXISTS idx_calls_platform_created
  ON calls(platform, created_at DESC);

-- ============================================
-- UPDATE TRIGGER FOR updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_dealer_integrations_updated_at
  BEFORE UPDATE ON dealer_integrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE dealer_integrations IS
'Stores encrypted API credentials for per-dealer integrations (GHL, etc.)';

COMMENT ON COLUMN dealer_integrations.api_key_encrypted IS
'AES-256-GCM encrypted API key. Format: iv:authTag:ciphertext';

COMMENT ON COLUMN dealer_integrations.metadata IS
'Additional integration config (location_id, webhook_url, etc.)';

COMMENT ON COLUMN dealer_integrations.scopes IS
'Permitted operations for this integration (contacts.write, etc.)';

COMMENT ON COLUMN calls.ghl_synced IS
'Whether this call has been synced to GHL. Used for retry logic.';
