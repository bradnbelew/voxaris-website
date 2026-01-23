-- V-Suite Analytics Schema

-- Table: perception_analytics
-- Stores deep perception data from Tavus video calls
create table if not exists public.perception_analytics (
  id uuid default gen_random_uuid() primary key,
  conversation_id text not null,
  user_appearance jsonb,
  setting jsonb,
  gaze_expressions jsonb,
  behavioral_gestures jsonb,
  emotional_state jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for faster lookups by conversation
create index if not exists idx_perception_conversation on public.perception_analytics(conversation_id);

-- Update call_logs to support rich analytics (if not already present)
-- Assuming call_logs exists, if not, create it
create table if not exists public.call_logs (
  id uuid default gen_random_uuid() primary key,
  call_id text unique not null,
  agent_id text,
  user_phone text,
  direction text check (direction in ('inbound', 'outbound')),
  status text,
  start_time timestamp with time zone,
  end_time timestamp with time zone,
  duration_seconds integer,
  recording_url text,
  transcript text,
  summary text,
  sentiment text,
  variables jsonb, -- Stores dynamic vars like customer_name, car_model
  analytics jsonb, -- Stores extra analysis (booking success, objection type)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Row Level Security)
alter table public.perception_analytics enable row level security;
alter table public.call_logs enable row level security;

-- Policies (Public read/write for demo purposes - harden in production)
create policy "Enable read access for all users" on public.perception_analytics for select using (true);
create policy "Enable insert access for all users" on public.perception_analytics for insert with check (true);

create policy "Enable read access for all users" on public.call_logs for select using (true);
create policy "Enable insert access for all users" on public.call_logs for insert with check (true);
create policy "Enable update access for all users" on public.call_logs for update using (true);
