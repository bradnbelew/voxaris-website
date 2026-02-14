-- =====================================================
-- ROOFING PROS USA - TRAINING SESSIONS TABLE
-- Tracks video training sessions for sales reps
-- =====================================================

CREATE TABLE IF NOT EXISTS roofing_training_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Session identification
    conversation_id TEXT NOT NULL,
    trainee_name TEXT NOT NULL,
    trainee_email TEXT,

    -- Training content
    topic TEXT NOT NULL DEFAULT 'general',
    -- Topics: insurance, objections, products, closing, roleplay, general

    -- Session status
    status TEXT NOT NULL DEFAULT 'active',
    -- Status: active, completed, abandoned

    -- Duration and engagement
    duration_seconds INT,
    messages_exchanged INT,
    roleplay_scenarios_completed INT DEFAULT 0,

    -- Performance tracking
    performance_rating TEXT,
    -- Rating: needs_improvement, developing, proficient, expert
    coach_notes TEXT,
    areas_for_improvement TEXT[],

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_training_sessions_trainee ON roofing_training_sessions(trainee_name);
CREATE INDEX IF NOT EXISTS idx_training_sessions_topic ON roofing_training_sessions(topic);
CREATE INDEX IF NOT EXISTS idx_training_sessions_created ON roofing_training_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_training_sessions_status ON roofing_training_sessions(status);

-- =====================================================
-- TRAINING PROGRESS TRACKING
-- Aggregate view of trainee progress over time
-- =====================================================

CREATE TABLE IF NOT EXISTS roofing_trainee_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Trainee identification
    trainee_name TEXT NOT NULL UNIQUE,
    trainee_email TEXT,

    -- Session counts by topic
    insurance_sessions INT DEFAULT 0,
    objections_sessions INT DEFAULT 0,
    products_sessions INT DEFAULT 0,
    closing_sessions INT DEFAULT 0,
    roleplay_sessions INT DEFAULT 0,
    total_sessions INT DEFAULT 0,

    -- Total training time
    total_training_minutes INT DEFAULT 0,

    -- Current skill levels (updated by coach)
    insurance_level TEXT DEFAULT 'beginner',
    objections_level TEXT DEFAULT 'beginner',
    products_level TEXT DEFAULT 'beginner',
    closing_level TEXT DEFAULT 'beginner',
    -- Levels: beginner, developing, proficient, expert

    -- Overall status
    overall_rating TEXT DEFAULT 'in_training',
    -- Ratings: in_training, ready_for_calls, mentor_ready

    certified_date TIMESTAMPTZ,
    last_session_date TIMESTAMPTZ,

    -- Notes
    manager_notes TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_trainee_progress_name ON roofing_trainee_progress(trainee_name);

-- =====================================================
-- TRAINING SCENARIOS
-- Pre-defined roleplay scenarios for consistent training
-- =====================================================

CREATE TABLE IF NOT EXISTS roofing_training_scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Scenario details
    scenario_name TEXT NOT NULL,
    persona_name TEXT NOT NULL,
    -- e.g., "Skeptical Steve", "Hurricane Helen"

    difficulty TEXT NOT NULL DEFAULT 'medium',
    -- Difficulty: easy, medium, hard

    topic TEXT NOT NULL,
    -- Topic: insurance, objections, products, closing

    -- Scenario content
    description TEXT NOT NULL,
    customer_background TEXT NOT NULL,
    key_objections TEXT[],
    ideal_responses JSONB,
    success_criteria TEXT[],

    -- Usage tracking
    times_used INT DEFAULT 0,
    avg_success_rate DECIMAL(5,2),

    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INSERT DEFAULT SCENARIOS
-- =====================================================

INSERT INTO roofing_training_scenarios (
    scenario_name, persona_name, difficulty, topic,
    description, customer_background, key_objections, success_criteria
) VALUES
(
    'The Skeptic',
    'Skeptical Steve',
    'hard',
    'objections',
    'Homeowner who had a bad experience with a previous contractor and doesn''t trust anyone',
    'Steve had his kitchen remodeled 2 years ago - contractor took his money and disappeared. He''s been price shopping for 3 weeks and has 4 quotes already.',
    ARRAY['I need to think about it', 'Your price is too high', 'How do I know you won''t disappear like the last guy'],
    ARRAY['Build rapport before discussing price', 'Reference BBB rating and license', 'Offer references from neighbors', 'Get specific callback time if they need to think']
),
(
    'Hurricane Stress',
    'Hurricane Helen',
    'medium',
    'insurance',
    'Homeowner whose roof was damaged in recent storm, very stressed and confused about insurance',
    'Helen''s roof has a tarp on it. Adjuster coming in 2 days. She doesn''t understand her policy and is worried insurance won''t pay.',
    ARRAY['Will insurance cover this?', 'What''s my deductible?', 'Can you talk to my adjuster for me?'],
    ARRAY['Calm her down first', 'Explain the process step by step', 'Explain we work with adjusters daily', 'Schedule inspection before adjuster visit', 'Never promise claim approval']
),
(
    'The Researcher',
    'Research Randy',
    'hard',
    'closing',
    'Well-informed homeowner who has done extensive research and has multiple quotes',
    'Randy is an engineer. He''s read Consumer Reports, checked our license, has 3 other quotes, and knows industry terminology. He''s impressed but uncommitted.',
    ARRAY['I have other quotes to compare', 'What makes you different?', 'I need to talk to my wife'],
    ARRAY['Respect his research', 'Provide specific differentiators', 'Show value beyond price', 'Create urgency without being pushy', 'Offer to meet with both spouses']
),
(
    'The Fixed Income',
    'Elderly Eleanor',
    'medium',
    'closing',
    'Elderly widow on fixed income, adult children involved in decision',
    'Eleanor is 78, widowed, lives alone. Her adult son in Atlanta helps her make decisions. She''s on Social Security and worried about cost.',
    ARRAY['I can''t afford this', 'I need to talk to my son', 'This seems like a lot of money'],
    ARRAY['Be patient and respectful', 'Explain financing options clearly', 'Offer to call with her son on the line', 'Emphasize warranty and protection', 'Don''t pressure']
),
(
    'Insurance Confusion',
    'Insurance Irene',
    'medium',
    'insurance',
    'Homeowner who already filed a claim but is confused about next steps',
    'Irene filed a claim 3 days ago. Adjuster approved $8,500 but she thinks her roof needs more work. She doesn''t know about supplements.',
    ARRAY['The adjuster said $8,500 is all I get', 'What if the estimate is higher?', 'Should I get a public adjuster?'],
    ARRAY['Explain the supplement process', 'Offer free inspection to document damage', 'Explain we work with insurance companies daily', 'Explain when public adjusters make sense']
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE roofing_training_sessions IS 'Tracks individual video training sessions with sales reps using Tavus AI trainer';
COMMENT ON TABLE roofing_trainee_progress IS 'Aggregate progress tracking for each trainee across all training topics';
COMMENT ON TABLE roofing_training_scenarios IS 'Pre-defined roleplay scenarios for consistent sales training';
