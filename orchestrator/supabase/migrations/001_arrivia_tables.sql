-- Arrivia conversation tracking
CREATE TABLE IF NOT EXISTS arrivia_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id TEXT UNIQUE NOT NULL,
  brand_id TEXT,
  member_name TEXT,
  member_email TEXT,
  current_tier TEXT,
  target_tier TEXT,
  persona_id TEXT,
  status TEXT DEFAULT 'pending',  -- pending, active, completed, error
  outcome TEXT,                    -- upgrade_intent, declined, follow_up, null
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversation cost tracking ($0.37/min)
CREATE TABLE IF NOT EXISTS arrivia_conversation_costs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id TEXT REFERENCES arrivia_conversations(conversation_id),
  duration_seconds INTEGER NOT NULL,
  cost_usd NUMERIC(10,4) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Full utterance log
CREATE TABLE IF NOT EXISTS arrivia_utterances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id TEXT REFERENCES arrivia_conversations(conversation_id),
  role TEXT NOT NULL,  -- 'user' or 'assistant'
  text TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Event log (objections, follow-ups, milestones)
CREATE TABLE IF NOT EXISTS arrivia_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id TEXT REFERENCES arrivia_conversations(conversation_id),
  event_type TEXT NOT NULL,
  payload JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_arrivia_conversations_status ON arrivia_conversations(status);
CREATE INDEX idx_arrivia_conversations_outcome ON arrivia_conversations(outcome);
CREATE INDEX idx_arrivia_conversations_brand ON arrivia_conversations(brand_id);
CREATE INDEX idx_arrivia_utterances_conversation ON arrivia_utterances(conversation_id);
CREATE INDEX idx_arrivia_events_conversation ON arrivia_events(conversation_id);
CREATE INDEX idx_arrivia_events_type ON arrivia_events(event_type);
