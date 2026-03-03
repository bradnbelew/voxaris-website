-- Voice call tracking (VAPI-powered agents)
CREATE TABLE IF NOT EXISTS voice_calls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  call_id TEXT UNIQUE NOT NULL,              -- VAPI call ID
  direction TEXT NOT NULL,                    -- 'inbound' or 'outbound'
  caller_number TEXT,
  member_name TEXT,
  member_email TEXT,
  current_tier TEXT,
  target_tier TEXT,
  campaign_id TEXT,                           -- For outbound campaign tracking
  status TEXT DEFAULT 'initiated',            -- initiated, ringing, active, completed, failed
  outcome TEXT,                               -- upgrade_intent, declined, follow_up, null
  ended_reason TEXT,
  transcript TEXT,
  recording_url TEXT,
  duration_seconds INTEGER DEFAULT 0,
  cost_usd NUMERIC(10,4) DEFAULT 0,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Voice utterance log (from end-of-call report)
CREATE TABLE IF NOT EXISTS voice_utterances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  call_id TEXT REFERENCES voice_calls(call_id),
  role TEXT NOT NULL,                          -- 'user' or 'assistant'
  text TEXT NOT NULL,
  sequence INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Voice event log (objections, intents, follow-ups, transfers)
CREATE TABLE IF NOT EXISTS voice_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  call_id TEXT REFERENCES voice_calls(call_id),
  event_type TEXT NOT NULL,                    -- objection, upgrade_intent, follow_up_requested, etc.
  payload JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_voice_calls_direction ON voice_calls(direction);
CREATE INDEX idx_voice_calls_status ON voice_calls(status);
CREATE INDEX idx_voice_calls_outcome ON voice_calls(outcome);
CREATE INDEX idx_voice_calls_campaign ON voice_calls(campaign_id);
CREATE INDEX idx_voice_calls_started ON voice_calls(started_at);
CREATE INDEX idx_voice_utterances_call ON voice_utterances(call_id);
CREATE INDEX idx_voice_events_call ON voice_events(call_id);
CREATE INDEX idx_voice_events_type ON voice_events(event_type);
