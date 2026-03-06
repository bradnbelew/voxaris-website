# Voxaris Site — SEO & Conversion Optimization Sprint

## Project Overview
Voxaris website (`voxaris-site/`) — React 18 + Vite + Tailwind CSS 3 + React Router v6 SPA. Live on Vercel at voxaris.io. V·GUIDE is the flagship product (embodied video AI agent that controls live websites via DOM manipulation).

**Tech Stack:** Vite + React 18 + TypeScript + Tailwind CSS 3 (v3, NOT v4 — uses `tailwind.config.ts`) + shadcn/ui + React Router v6 + Framer Motion + Tanstack Query. Deployed on Vercel.

**Brand:** Dark luxury aesthetic — deep blacks, gold accents (#d4a843), Instrument Sans + DM Sans. The V·GUIDE agent avatar is "Maria." Founder: Ethan Stopperich, Orlando FL.

## Current Sprint: SEO & Conversion Fixes

A full SEO & conversion audit was completed (see `Voxaris-SEO-Conversion-Audit.docx` in the project root). Execute the following fixes in priority order. Each task is self-contained — commit after each one.

---

### TASK 1: Fix the /book-demo Form Submission (CRITICAL)

**Problem:** `src/pages/BookDemo.tsx` calls `e.preventDefault()` and shows `toast.success()` but NEVER sends the form data anywhere. No fetch, no API call, no email. Every demo request is silently lost.

**Fix:** Wire the form to actually submit data. Choose ONE of these approaches:

**Option A — Supabase (Preferred if Supabase is already in the stack):**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSubmitting(true);
  try {
    const res = await fetch('https://YOUR_SUPABASE_URL/rest/v1/demo_requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'YOUR_ANON_KEY',
        'Authorization': 'Bearer YOUR_ANON_KEY'
      },
      body: JSON.stringify(formData)
    });
    if (!res.ok) throw new Error('Failed');
    setSubmitted(true);
    toast.success("Demo request submitted! We'll be in touch within 24 hours.");
  } catch {
    toast.error("Something went wrong. Please call us at 407-759-4100.");
  } finally {
    setSubmitting(false);
  }
};
```

**Option B — Resend Email API (Quick serverless):**
Create a Vercel API route at `api/book-demo.ts`:
```typescript
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const data = req.body;
  await resend.emails.send({
    from: 'Voxaris <noreply@voxaris.io>',
    to: 'ethan@voxaris.io',
    subject: `New Demo Request: ${data.company}`,
    html: `<h2>New Demo Request</h2>
      <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Company:</strong> ${data.company}</p>
      <p><strong>Business Type:</strong> ${data.businessType}</p>
      <p><strong>Message:</strong> ${data.message}</p>`
  });
  res.status(200).json({ ok: true });
}
```
Then update `BookDemo.tsx` to POST to `/api/book-demo`.

**Option C — Webhook (Fastest, no backend needed):**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSubmitting(true);
  try {
    await fetch('https://hooks.zapier.com/hooks/catch/YOUR_HOOK_ID/', {
      method: 'POST',
      body: JSON.stringify({ ...formData, submitted_at: new Date().toISOString() })
    });
    setSubmitted(true);
    toast.success("Demo request submitted! We'll be in touch within 24 hours.");
  } catch {
    toast.error("Something went wrong. Please try again or call 407-759-4100.");
  } finally {
    setSubmitting(false);
  }
};
```

**Requirements regardless of approach:**
- Add a `submitting` state and disable the button + show spinner while submitting
- Add error handling with `toast.error()` fallback
- Keep the success toast and `setSubmitted(true)` flow
- Log the submission timestamp
- Add Helmet meta tags to this page while you're here (see Task 3)

**File:** `src/pages/BookDemo.tsx`

---

### TASK 2: Remove Duplicate /home Route

**Problem:** Both `/` and `/home` render the homepage, creating duplicate content for Google.

**Fix in `src/App.tsx`:**
1. Replace `<Route path="/home" element={<HomePage />} />` with a redirect:
```tsx
import { Navigate } from 'react-router-dom';
// ...
<Route path="/home" element={<Navigate to="/" replace />} />
```
2. Remove `/home` from `public/sitemap.xml` if it's listed there.

**Files:** `src/App.tsx`, `public/sitemap.xml`

---

### TASK 3: Add Helmet Meta Tags to ALL Inner Pages (HIGH)

**Problem:** Only the homepage (`index.html`) and `/solutions/dealerships` (`SolutionDealerships.tsx`) have proper meta tags. All other marketing pages inherit the generic homepage title/description, making them invisible to search engines as distinct pages.

**Reference pattern** — copy the Helmet structure from `src/pages/marketing/SolutionDealerships.tsx`:
```tsx
import { Helmet } from 'react-helmet-async';
// Inside the component return:
<Helmet>
  <title>PAGE SPECIFIC TITLE | Voxaris</title>
  <meta name="description" content="PAGE SPECIFIC DESCRIPTION (150-160 chars)" />
  <meta name="keywords" content="relevant, comma, separated, keywords" />
  <link rel="canonical" href="https://voxaris.io/PAGE_PATH" />
  <meta property="og:title" content="PAGE SPECIFIC TITLE | Voxaris" />
  <meta property="og:description" content="PAGE SPECIFIC DESCRIPTION" />
  <meta property="og:url" content="https://voxaris.io/PAGE_PATH" />
  <meta property="og:type" content="website" />
</Helmet>
```

**Pages that need Helmet added (with suggested titles/descriptions):**

| Page | File | Title | Description |
|------|------|-------|-------------|
| `/how-it-works` | `src/pages/HowItWorks.tsx` | "How Voxaris Works — Deploy AI Video Agents in 3 Steps \| Voxaris" | "Connect your site, configure your AI agent, launch in minutes. V·GUIDE integrates with one script tag — no code changes needed." |
| `/why-voxaris` | `src/pages/WhyVoxaris.tsx` | "Why Voxaris — The First AI Agent That Controls Your Website \| Voxaris" | "Unlike chatbots or voice-only AI, V·GUIDE is a photorealistic video agent that navigates your site, fills forms, and books appointments live." |
| `/technology` | `src/pages/Technology.tsx` | "V·Suite Technology — Neural Video, Voice & DOM AI \| Voxaris" | "V·FACE rendering, V·SENSE perception, V·FLOW orchestration. The technology stack behind the world's first embodied website AI agent." |
| `/book-demo` | `src/pages/BookDemo.tsx` | "Book a Demo — See V·GUIDE AI in Action \| Voxaris" | "Schedule a personalized demo. See how V·GUIDE handles lead response, qualification, and appointment booking on your website 24/7." |
| `/demo` | `src/pages/marketing/Demo.tsx` | "Live Demo — Watch V·GUIDE Control a Website \| Voxaris" | "Experience V·GUIDE live. Watch our AI video agent navigate a website, answer questions, and book appointments in real time." |
| `/talking-postcard` | `src/pages/marketing/TalkingPostcard.tsx` | "Talking Postcards — AI Video on Direct Mail \| Voxaris" | "QR-code postcards that launch a live AI video conversation. Bridge offline marketing to online engagement with photorealistic AI." |
| `/blog` | `src/pages/marketing/BlogIndex.tsx` | "Voxaris Blog — AI Video Agents, Lead Conversion & Industry Insights" | "Insights on AI video agents, dealership automation, hospitality AI, and the future of website engagement from the Voxaris team." |
| `/solutions/hospitality` | `src/pages/marketing/SolutionHospitality.tsx` | "AI Concierge for Hotels & Resorts \| Voxaris" | "Deploy V·GUIDE as your 24/7 AI video concierge. Guide guests through bookings, answer questions, and increase direct reservations." |
| `/solutions/contractors` | `src/pages/marketing/SolutionContractors.tsx` | "AI Lead Agent for Home Services & Contractors \| Voxaris" | "V·GUIDE qualifies leads, books estimates, and follows up automatically. Built for roofers, HVAC, plumbers, and home service companies." |
| `/solutions/direct-mail` | `src/pages/marketing/SolutionDirectMail.tsx` | "AI Video for Direct Mail Campaigns \| Voxaris" | "Turn postcards into conversations. Talking Postcards by Voxaris bridge print marketing to live AI video engagement." |
| `/solutions/white-label` | `src/pages/marketing/SolutionWhiteLabel.tsx` | "White Label AI Video Agents \| Voxaris" | "Resell V·GUIDE under your brand. Full white-label AI video agent platform for agencies, BPOs, and technology partners." |

**Important notes:**
- `react-helmet-async` is already installed (used in SolutionDealerships). Import `{ Helmet }` from `'react-helmet-async'`.
- Each page component currently wraps content in `<Layout>`. Place `<Helmet>` as the first child inside the returned JSX, before `<Layout>` or inside it at the top.
- Use the exact canonical URLs with trailing slash consistency matching `https://voxaris.io/path` (no trailing slash on inner pages, matching the sitemap).

**Files:** All files listed in the table above.

---

### TASK 4: Create OG Image and Add to All Pages (HIGH)

**Problem:** No `og:image` or `twitter:image` anywhere on the site. Social shares show a blank preview.

**Fix:**
1. Create a branded OG image (1200x630px) — use the Voxaris logo on dark background with "AI Video Agents for Your Website" tagline. Save as `public/og-image.png`.
2. Add to `index.html`:
```html
<meta property="og:image" content="https://voxaris.io/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:image" content="https://voxaris.io/og-image.png" />
```
3. Add to every Helmet in Task 3:
```tsx
<meta property="og:image" content="https://voxaris.io/og-image.png" />
<meta name="twitter:image" content="https://voxaris.io/og-image.png" />
```

**Files:** `public/og-image.png` (create), `index.html`, all Helmet pages from Task 3.

---

### TASK 5: Fix Footer Dead Links (MEDIUM)

**Problem:** In `src/components/marketing/Footer.tsx`, Privacy Policy, Terms of Service, and Cookies links all point to `href="#"`. Social media icons also point to `"#"`.

**Fix:**
1. Create placeholder pages or update links:
   - Privacy: `/privacy` (create a basic page, or link to a hosted policy like Termly)
   - Terms: `/terms` (create a basic page)
   - Cookies: Remove or link to privacy policy section
2. Update social links to real URLs:
   - X/Twitter: `https://x.com/estop1025` (from JSON-LD)
   - LinkedIn: `https://www.linkedin.com/in/ethanstopperich` (from JSON-LD)
   - Remove any social icons that don't have real profiles yet
3. If creating placeholder pages, add routes to `App.tsx` and Helmet meta tags.

**File:** `src/components/marketing/Footer.tsx`, optionally new page files.

---

### TASK 6: Fix CTA Route Mismatch (LOW)

**Problem:** In `src/components/marketing/CTASection.tsx`, the "Talk to Sales" button routes to `/demo` (the live demo page) instead of `/book-demo` (the contact form).

**Fix:** Change the "Talk to Sales" link from `/demo` to `/book-demo`.

**File:** `src/components/marketing/CTASection.tsx`

---

### TASK 7: Improve Image Alt Text (LOW)

**Problem:** Most images have generic alt text like "Voxaris AI" or "Voice AI".

**Fix:** Update alt text across marketing components to be keyword-rich and descriptive:
- Hero Maria video: `"V·GUIDE AI video agent demonstrating live website control"`
- Technology showcase videos: `"Photorealistic AI video agent for [product name]"`
- Product cards: `"V·FACE AI avatar rendering engine"`, `"V·SENSE AI voice perception system"`
- Solution pages: `"AI video agent for [vertical] — automated lead qualification"`

**Files:** `src/components/marketing/Hero.tsx`, `TechnologyShowcase.tsx`, `VSuiteSection.tsx`, solution pages.

---

### TASK 8: Update Sitemap (MEDIUM)

**Problem:** Sitemap may be missing new pages or include dead routes.

**Fix:** Ensure `public/sitemap.xml` contains all live marketing routes with accurate `<lastmod>` dates:
- `/` (homepage)
- `/how-it-works`
- `/why-voxaris`
- `/technology`
- `/demo`
- `/book-demo`
- `/talking-postcard`
- `/blog`
- `/blog/website-experience-broken`
- `/blog/ai-agents-explained`
- `/blog/law-firm-intake`
- `/blog/hotel-ai-concierge`
- `/blog/founder-story`
- `/blog/dealership-leads-dying`
- `/blog/ai-bdc-agent`
- `/blog/dealership-website-roi`
- `/solutions/dealerships`
- `/solutions/hospitality`
- `/solutions/contractors`
- `/solutions/direct-mail`
- `/solutions/white-label`

Remove `/home` if present. Set priority: homepage 1.0, solution pages 0.9, blog posts 0.7, other pages 0.8.

**File:** `public/sitemap.xml`

---

## Key File Paths Reference

| Purpose | Path |
|---------|------|
| Root HTML (meta tags, JSON-LD) | `index.html` |
| App Router | `src/App.tsx` |
| Blog post data | `src/data/blog-posts.ts` |
| Homepage composition | `src/pages/marketing/HomePage.tsx` |
| Book Demo form (BROKEN) | `src/pages/BookDemo.tsx` |
| Dealerships page (Helmet reference) | `src/pages/marketing/SolutionDealerships.tsx` |
| Hero section | `src/components/marketing/Hero.tsx` |
| Navbar | `src/components/marketing/Navbar.tsx` |
| Footer (dead links) | `src/components/marketing/Footer.tsx` |
| CTA Section (wrong route) | `src/components/marketing/CTASection.tsx` |
| Floating Maria widget | `src/components/marketing/FloatingMaria.tsx` |
| Technology Showcase | `src/components/marketing/TechnologyShowcase.tsx` |
| V·Suite Section | `src/components/marketing/VSuiteSection.tsx` |
| Demo Section | `src/components/marketing/DemoSection.tsx` |
| Problem/Solution | `src/components/marketing/ProblemSolution.tsx` |
| How It Works | `src/components/marketing/HowItWorks.tsx` |
| Sitemap | `public/sitemap.xml` |
| Robots | `public/robots.txt` |
| SEO keyword research | `content/seo/keyword-research.md` |
| Competitive analysis | `content/seo/competitive-analysis.md` |
| Content farm | `Voxaris-Content-Farm/` |

## Style & Preferences
- Dark luxury aesthetic: deep blacks, gold accents (#d4a843), Instrument Sans + DM Sans
- Framer Motion animations with ease `[0.22, 1, 0.36, 1]`
- Fast execution, minimal back-and-forth
- Direct API calls over middleware
- Tailwind CSS 3 (NOT v4 — uses `tailwind.config.ts`)
- `react-helmet-async` for per-page SEO (already installed)
- Commit after each task completes

## Credentials
- Vercel Token: `vcp_4vdTW1jZRVYkh2oD8cG6IORbD19SCP8zDAyKxUvk25N5NbmWBd1y9ZwY`
- Tavus API Key: `7f3c93c88c4a44c79f5d969b56bdbd75`
- Tavus Persona: `p40793780aaa`
- Rover API Key: `rtrvr_9OFZbYFiZcfc1-jW0y5kvke47O3f9ale1vWnr0Ca6xw`
- Vercel Site Project: `prj_v8TdPRSThHgOsEzKkYMzlxtOHxII`
- Vercel Orchestrator Project: `prj_8feiiCEX9qudoqYtzoGoOlMbHSxK`
- GitHub Repo ID: `1146332440` (ethanstopperich1-rgb/voxaris)
- Vercel Team: `team_qg96of57kJvRgm9pTh8wpDor`

## Cowork + Code Pipeline
This CLAUDE.md is the **Code side** (engineering execution). The business side lives in
`~/Voxaris-Cowork/CLAUDE.md` and is operated via Claude Cowork (Desktop app).

**Pipeline flow:**
- Cowork (Steps 1-4): Research prospect → Draft outreach → Research tech/API → Generate proposal
- Code (Steps 5-8): Read Cowork research → Build agent code → Deploy to Vercel → Push to GitHub

**Handoff folders** (written by Cowork, read by Code):
- `~/Voxaris-Cowork/Prospects/` — Structured prospect briefs
- `~/Voxaris-Cowork/Proposals/` — Strategy docs with use cases and architecture

When starting a new agent build, check these folders for context on the client.

## IMPORTANT Notes
- The `V·GUIDE` product name contains a Unicode middle dot (U+00B7). When editing files, read the file first and match exact bytes — don't assume ASCII.
- The site uses `react-helmet-async`, not `react-helmet`. Import from `'react-helmet-async'`.
- Solution pages render with their own layout (not the shared `<Layout>` wrapper). Check each page's structure before adding Helmet.
- The SolutionDealerships page is the gold standard for how Helmet should be implemented — reference it for all other pages.
- All technology is described as 100% proprietary in client-facing content. Never mention Tavus, Retell, Vapi in client-facing code or copy.
- Brand voice: Warm, confident, helpful, professional, founder-led. Never salesy.
- V·TEAMS is the new multi-agent product (coordinated squad with warm transfers). Add to site when ready.
