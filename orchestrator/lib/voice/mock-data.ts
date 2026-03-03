// ── Mock data for Movvix Voice Analytics Dashboard ──
// Replace with real Supabase queries once connected

export interface CallRecord {
  call_id: string;
  direction: "inbound" | "outbound";
  member_name: string;
  caller_number: string;
  current_tier: string;
  target_tier: string;
  status: "completed" | "active" | "failed" | "no-answer";
  outcome: "upgrade_intent" | "follow_up" | "declined" | "transfer" | "no_answer" | null;
  duration_seconds: number;
  cost_usd: number;
  started_at: string;
  ended_at: string | null;
  campaign_id: string;
  transcript: TranscriptMessage[];
}

export interface TranscriptMessage {
  role: "assistant" | "user";
  text: string;
}

export interface ObjectionData {
  type: string;
  label: string;
  count: number;
  percentage: number;
  insight: string;
}

export interface DashboardStats {
  totalCalls: number;
  completedCalls: number;
  avgDurationSec: number;
  conversionRate: number;
  totalCost: number;
  costPerConversion: number;
}

// ── Stats ──

export const MOCK_STATS: DashboardStats = {
  totalCalls: 247,
  completedCalls: 218,
  avgDurationSec: 194,
  conversionRate: 34.2,
  totalCost: 87.45,
  costPerConversion: 1.17,
};

// ── Outcome breakdown ──

export const MOCK_OUTCOMES = [
  { label: "Upgrade Intent", count: 75, color: "bg-emerald-vox" },
  { label: "Follow-up Scheduled", count: 62, color: "bg-gold" },
  { label: "Declined", count: 48, color: "bg-rose-vox" },
  { label: "Transfer to Human", count: 21, color: "bg-blue-400" },
  { label: "No Answer", count: 12, color: "bg-gray-500" },
];

// ── Objections ──

export const MOCK_OBJECTIONS: ObjectionData[] = [
  {
    type: "price",
    label: "Too Expensive",
    count: 42,
    percentage: 38,
    insight: "Most common with Standard→Gold upgrades. Price anchoring on savings reduces this by 22%.",
  },
  {
    type: "timing",
    label: "Not the Right Time",
    count: 28,
    percentage: 25,
    insight: "Peaks on Monday mornings. Offering a follow-up call converts 40% of these.",
  },
  {
    type: "value",
    label: "Don't See the Value",
    count: 19,
    percentage: 17,
    insight: "Correlates with members who have < 2 bookings. Personalizing benefits helps.",
  },
  {
    type: "comparison",
    label: "Comparing Options",
    count: 12,
    percentage: 11,
    insight: "Often resolved by emphasizing exclusive cruise discounts not available elsewhere.",
  },
  {
    type: "satisfaction",
    label: "Happy with Current Tier",
    count: 10,
    percentage: 9,
    insight: "Strong brand loyalty. Gentle nudge about expiring promo pricing works best.",
  },
];

// ── Call records ──

export const MOCK_CALLS: CallRecord[] = [
  {
    call_id: "call_001",
    direction: "outbound",
    member_name: "Sarah Johnson",
    caller_number: "+14155551234",
    current_tier: "Standard",
    target_tier: "Gold",
    status: "completed",
    outcome: "upgrade_intent",
    duration_seconds: 247,
    cost_usd: 0.42,
    started_at: "2026-02-28T14:32:00Z",
    ended_at: "2026-02-28T14:36:07Z",
    campaign_id: "feb-gold-push",
    transcript: [
      { role: "assistant", text: "Hi Sarah! This is Ana from Movvix Travel. How are you doing today?" },
      { role: "user", text: "Oh hi! I'm good, thanks. What's this about?" },
      { role: "assistant", text: "Great to hear! I'm calling because as a valued Standard member, you've been selected for an exclusive Gold tier upgrade offer. Your travel history shows you love beach destinations — with Gold, you'd save up to 25% on hotels instead of your current 10%." },
      { role: "user", text: "That does sound nice. How much more would it cost?" },
      { role: "assistant", text: "It's typically $149-199 per year, but right now we can lock in current pricing before the renewal increase. Plus, you'd earn double points on every booking." },
      { role: "user", text: "That's actually pretty reasonable. I just booked Cancun and wish I'd had better savings." },
      { role: "assistant", text: "Exactly! With Gold, that Cancun trip could have saved you around $300. Would you like me to send you the upgrade link so you can review the full benefits?" },
      { role: "user", text: "Yes, please send it over." },
    ],
  },
  {
    call_id: "call_002",
    direction: "outbound",
    member_name: "Michael Torres",
    caller_number: "+13105559876",
    current_tier: "Standard",
    target_tier: "Gold",
    status: "completed",
    outcome: "declined",
    duration_seconds: 156,
    cost_usd: 0.28,
    started_at: "2026-02-28T15:10:00Z",
    ended_at: "2026-02-28T15:12:36Z",
    campaign_id: "feb-gold-push",
    transcript: [
      { role: "assistant", text: "Hi Michael! This is Ana from Movvix Travel. I hope I'm catching you at a good time?" },
      { role: "user", text: "I have a minute, what's up?" },
      { role: "assistant", text: "I wanted to let you know about an exclusive Gold tier upgrade opportunity. You'd get 2x points, up to 25% hotel savings, and a dedicated travel concierge." },
      { role: "user", text: "Hmm, I'm not really looking to spend more right now. Things are tight." },
      { role: "assistant", text: "I completely understand. The good news is this offer will be available for a while. Would you like me to follow up in a few weeks?" },
      { role: "user", text: "No thanks, I'll reach out if I'm interested." },
    ],
  },
  {
    call_id: "call_003",
    direction: "inbound",
    member_name: "Emily Chen",
    caller_number: "+12125554321",
    current_tier: "Silver",
    target_tier: "Gold",
    status: "completed",
    outcome: "upgrade_intent",
    duration_seconds: 312,
    cost_usd: 0.51,
    started_at: "2026-02-27T10:45:00Z",
    ended_at: "2026-02-27T10:50:12Z",
    campaign_id: "inbound",
    transcript: [
      { role: "user", text: "Hi, I'm calling about upgrading my membership. I'm currently Silver." },
      { role: "assistant", text: "Welcome, Emily! I'd be happy to help you explore an upgrade. As a Silver member, the next step would be Gold. Let me pull up a comparison for you." },
      { role: "user", text: "Yes please, I've been thinking about it since my last trip." },
      { role: "assistant", text: "With Gold, your points multiplier jumps from 1.5x to 2x, hotel savings increase from 15% to up to 25%, and you get dedicated concierge access plus the ability to share benefits with friends and family." },
      { role: "user", text: "The friends and family sharing is really appealing. What does it cost?" },
      { role: "assistant", text: "The upgrade from Silver to Gold is typically $99-149 per year. And here's a great perk — if you upgrade before your renewal, you keep Silver pricing for 6 months." },
      { role: "user", text: "That's a great deal. Let's do it." },
    ],
  },
  {
    call_id: "call_004",
    direction: "outbound",
    member_name: "David Kim",
    caller_number: "+16505558888",
    current_tier: "Standard",
    target_tier: "Silver",
    status: "completed",
    outcome: "follow_up",
    duration_seconds: 183,
    cost_usd: 0.31,
    started_at: "2026-02-27T11:20:00Z",
    ended_at: "2026-02-27T11:23:03Z",
    campaign_id: "feb-silver-intro",
    transcript: [
      { role: "assistant", text: "Hi David! This is Ana from Movvix Travel. I'm reaching out about an exciting Silver tier opportunity for you." },
      { role: "user", text: "Oh interesting, tell me more." },
      { role: "assistant", text: "As a Silver member, you'd earn 1.5x points instead of 1x, get up to 15% hotel savings, and access exclusive quarterly deals." },
      { role: "user", text: "That sounds good but I need to check my budget first. Can you call me back next week?" },
      { role: "assistant", text: "Of course! I'll schedule a follow-up for next Tuesday. Would morning or afternoon work better?" },
      { role: "user", text: "Morning is better. Thanks!" },
    ],
  },
  {
    call_id: "call_005",
    direction: "outbound",
    member_name: "Jessica Patel",
    caller_number: "+14085557777",
    current_tier: "Standard",
    target_tier: "Gold",
    status: "completed",
    outcome: "upgrade_intent",
    duration_seconds: 275,
    cost_usd: 0.45,
    started_at: "2026-02-26T16:00:00Z",
    ended_at: "2026-02-26T16:04:35Z",
    campaign_id: "feb-gold-push",
    transcript: [
      { role: "assistant", text: "Hi Jessica! This is Ana from Movvix Travel. How are you today?" },
      { role: "user", text: "I'm doing well! Is this about my membership?" },
      { role: "assistant", text: "Yes! I'm calling to share a Gold tier upgrade offer. Based on your travel patterns, you'd save significantly. For example, your hotel savings would jump from 10% to up to 25%." },
      { role: "user", text: "I do travel a lot for work. What about cruise discounts?" },
      { role: "assistant", text: "Great question! With Gold, you get exclusive cruise discounts up to 10%. Plus 2x points on every booking and a dedicated travel concierge." },
      { role: "user", text: "The cruise discounts sold me. Send me the link!" },
    ],
  },
  {
    call_id: "call_006",
    direction: "outbound",
    member_name: "Robert Williams",
    caller_number: "+17735556666",
    current_tier: "Silver",
    target_tier: "Gold",
    status: "completed",
    outcome: "transfer",
    duration_seconds: 198,
    cost_usd: 0.34,
    started_at: "2026-02-26T09:15:00Z",
    ended_at: "2026-02-26T09:18:18Z",
    campaign_id: "silver-to-gold",
    transcript: [
      { role: "assistant", text: "Good morning Robert! This is Ana from Movvix Travel. I'm calling about upgrading your Silver membership to Gold." },
      { role: "user", text: "I've been thinking about that, but I have some questions about my account first." },
      { role: "assistant", text: "I'd be happy to help! What questions do you have?" },
      { role: "user", text: "I have some points that expired and I want to dispute that before upgrading." },
      { role: "assistant", text: "I understand. Let me transfer you to our account specialists who can look into your points and then discuss the upgrade once that's resolved." },
      { role: "user", text: "That would be great, thank you." },
    ],
  },
  {
    call_id: "call_007",
    direction: "outbound",
    member_name: "Amanda Foster",
    caller_number: "+12065553333",
    current_tier: "Standard",
    target_tier: "Gold",
    status: "no-answer",
    outcome: "no_answer",
    duration_seconds: 0,
    cost_usd: 0.05,
    started_at: "2026-02-25T13:00:00Z",
    ended_at: null,
    campaign_id: "feb-gold-push",
    transcript: [],
  },
  {
    call_id: "call_008",
    direction: "inbound",
    member_name: "Carlos Rodriguez",
    caller_number: "+13055552222",
    current_tier: "Standard",
    target_tier: "Gold",
    status: "completed",
    outcome: "declined",
    duration_seconds: 142,
    cost_usd: 0.25,
    started_at: "2026-02-25T11:30:00Z",
    ended_at: "2026-02-25T11:32:22Z",
    campaign_id: "inbound",
    transcript: [
      { role: "user", text: "I got a text about upgrading to Gold. What's involved?" },
      { role: "assistant", text: "Hi Carlos! Thanks for calling in. Gold tier includes 2x points, up to 25% hotel savings, cruise discounts, and a dedicated concierge." },
      { role: "user", text: "I'm comparing with another travel program. I'll let you know." },
      { role: "assistant", text: "Absolutely, take your time. Just know that our cruise discounts up to 10% are exclusive to Gold members and aren't available with most competitors." },
      { role: "user", text: "Good to know. I'll think about it." },
    ],
  },
  {
    call_id: "call_009",
    direction: "outbound",
    member_name: "Lisa Wang",
    caller_number: "+14155559999",
    current_tier: "Standard",
    target_tier: "Gold",
    status: "completed",
    outcome: "upgrade_intent",
    duration_seconds: 289,
    cost_usd: 0.47,
    started_at: "2026-02-24T15:45:00Z",
    ended_at: "2026-02-24T15:49:49Z",
    campaign_id: "feb-gold-push",
    transcript: [
      { role: "assistant", text: "Hi Lisa! This is Ana from Movvix Travel. I have some exciting news about your membership." },
      { role: "user", text: "Hi Ana! What's the news?" },
      { role: "assistant", text: "You've been selected for a Gold tier upgrade with a special promotion — lock in current pricing and get bonus 5,000 points on upgrade." },
      { role: "user", text: "5,000 bonus points? That's like a free hotel night!" },
      { role: "assistant", text: "Exactly! Plus you'd earn 2x on all future bookings and save up to 25% on hotels. Would you like me to send the upgrade link?" },
      { role: "user", text: "Yes definitely. Send it to my email please." },
    ],
  },
  {
    call_id: "call_010",
    direction: "outbound",
    member_name: "James Murphy",
    caller_number: "+16175554444",
    current_tier: "Gold",
    target_tier: "Platinum",
    status: "completed",
    outcome: "follow_up",
    duration_seconds: 224,
    cost_usd: 0.38,
    started_at: "2026-02-24T10:00:00Z",
    ended_at: "2026-02-24T10:03:44Z",
    campaign_id: "gold-to-plat",
    transcript: [
      { role: "assistant", text: "Good morning James! This is Ana from Movvix Travel. As one of our valued Gold members, I wanted to tell you about our Platinum tier." },
      { role: "user", text: "Platinum, huh? I already have Gold and I'm pretty happy with it." },
      { role: "assistant", text: "That's great to hear! Platinum takes it even further — 3x points, up to 40% hotel savings, 15% cruise discounts, and VIP event access for the first year." },
      { role: "user", text: "The VIP events sound interesting. Let me discuss with my wife and get back to you." },
      { role: "assistant", text: "Of course! Shall I send you a comparison document you can review together?" },
      { role: "user", text: "That would be helpful, yes." },
    ],
  },
  {
    call_id: "call_011",
    direction: "outbound",
    member_name: "Sophia Martinez",
    caller_number: "+18185551111",
    current_tier: "Standard",
    target_tier: "Gold",
    status: "failed",
    outcome: null,
    duration_seconds: 0,
    cost_usd: 0.05,
    started_at: "2026-02-23T14:30:00Z",
    ended_at: null,
    campaign_id: "feb-gold-push",
    transcript: [],
  },
  {
    call_id: "call_012",
    direction: "inbound",
    member_name: "Kevin Park",
    caller_number: "+12135558765",
    current_tier: "Standard",
    target_tier: "Silver",
    status: "completed",
    outcome: "upgrade_intent",
    duration_seconds: 167,
    cost_usd: 0.29,
    started_at: "2026-02-23T09:00:00Z",
    ended_at: "2026-02-23T09:02:47Z",
    campaign_id: "inbound",
    transcript: [
      { role: "user", text: "Hi, I want to upgrade to Silver." },
      { role: "assistant", text: "Hi Kevin! Great choice. Silver gives you 1.5x points, up to 15% hotel savings, and access to exclusive quarterly deals." },
      { role: "user", text: "What's the cost?" },
      { role: "assistant", text: "Typically $49-99 per year, and right now you can get your first year at 50% off with a renewal upgrade." },
      { role: "user", text: "Half off? That's a no-brainer. Sign me up." },
    ],
  },
  {
    call_id: "call_013",
    direction: "outbound",
    member_name: "Nicole Brown",
    caller_number: "+19175557654",
    current_tier: "Standard",
    target_tier: "Gold",
    status: "completed",
    outcome: "declined",
    duration_seconds: 118,
    cost_usd: 0.22,
    started_at: "2026-02-22T16:20:00Z",
    ended_at: "2026-02-22T16:21:58Z",
    campaign_id: "feb-gold-push",
    transcript: [
      { role: "assistant", text: "Hi Nicole! This is Ana from Movvix Travel. I'm calling about an exclusive Gold upgrade offer." },
      { role: "user", text: "I've gotten a few of these calls. I'm really happy with Standard for now." },
      { role: "assistant", text: "I appreciate your loyalty! We do have a limited-time promotion that locks in current pricing before increases. Just wanted to make sure you knew about it." },
      { role: "user", text: "Thanks for letting me know. I'll pass for now." },
    ],
  },
  {
    call_id: "call_014",
    direction: "outbound",
    member_name: "Ryan Thompson",
    caller_number: "+14695553210",
    current_tier: "Silver",
    target_tier: "Gold",
    status: "completed",
    outcome: "upgrade_intent",
    duration_seconds: 265,
    cost_usd: 0.43,
    started_at: "2026-02-22T11:00:00Z",
    ended_at: "2026-02-22T11:04:25Z",
    campaign_id: "silver-to-gold",
    transcript: [
      { role: "assistant", text: "Hi Ryan! This is Ana from Movvix Travel. I'm reaching out to our Silver members about Gold tier benefits." },
      { role: "user", text: "I've been curious about Gold. What's the difference?" },
      { role: "assistant", text: "With Gold, your points go from 1.5x to 2x, cruise discounts double from 5% to 10%, hotel savings jump to 25%, and you get a dedicated concierge plus Friends & Family sharing." },
      { role: "user", text: "Friends & Family sharing is huge. My wife would love that." },
      { role: "assistant", text: "It's one of our most popular Gold features! Would you like me to send the upgrade link?" },
      { role: "user", text: "Yes, please do." },
    ],
  },
  {
    call_id: "call_015",
    direction: "outbound",
    member_name: "Hannah Lee",
    caller_number: "+15035556789",
    current_tier: "Standard",
    target_tier: "Gold",
    status: "no-answer",
    outcome: "no_answer",
    duration_seconds: 0,
    cost_usd: 0.05,
    started_at: "2026-02-21T14:00:00Z",
    ended_at: null,
    campaign_id: "feb-gold-push",
    transcript: [],
  },
];
