# Voxaris Site — Session Continuation

## Project Overview
Voxaris website (`voxaris-site/`) — React 18 + Vite + Tailwind CSS 3 + React Router v6 SPA. Live on Vercel at voxaris.io. V·GUIDE is the flagship product (embodied video AI agent).

## Current State
- Blog section built and working at `/blog` with 3 posts live:
  - `website-experience-broken` (Website Strategy)
  - `ai-agents-explained` (AI for Business)
  - `law-firm-intake` (Legal)
- FloatingMaria (Tavus CVI video agent) working in bottom-right bubble
- Orchestrator deployed at `voxaris-orchestrator.vercel.app`
- Rover client updated to match current rtrvr.ai API

## Immediate Tasks (In Order)

### 1. Add 5 Remaining Blog Posts to `src/data/blog-posts.ts`
Source markdown files are in `Voxaris-Content-Farm/Content/Batch-1/`:
- `blog-03-hotel-ai-concierge.md` → slug: `hotel-ai-concierge` (Hospitality)
- `blog-05-founder-story.md` → slug: `founder-story` (Founder Story)
- `blog-06-dealership-leads-dying.md` → slug: `dealership-leads-dying` (Auto)
- `blog-07-ai-bdc-agent.md` → slug: `ai-bdc-agent` (Auto)
- `blog-08-dealership-website-roi.md` → slug: `dealership-website-roi` (Auto)

Convert each from markdown to the `BlogSection[]` typed format used in `blog-posts.ts`. Section types: `heading`, `subheading`, `paragraph`, `list`, `quote`, `divider`, `cta`. Append to the `blogPosts` array.

**IMPORTANT:** Previous edit attempt failed due to unicode character matching on `V·GUIDE` (middle dot U+00B7). Read the file and match exact bytes when editing.

### 2. SEO Optimization
- **Update `index.html` meta tags** — currently says "AI Sales & Intake Agents" and references "marketing agencies and auto dealerships". Should reflect V·GUIDE / embodied video AI messaging.
- **Install `react-helmet-async`** for per-page `<title>` and `<meta>` tags across the SPA
- **Create `public/sitemap.xml`** with all routes including `/blog/:slug` for each post
- **Add JSON-LD structured data** for blog articles (Article schema)
- **Add canonical URLs** per page
- Blog posts already have `keywords` arrays defined in `blog-posts.ts` — wire them into meta tags

### 3. Commit, Push, and Deploy
- Vercel Site Project: `prj_v8TdPRSThHgOsEzKkYMzlxtOHxII`
- Vercel Orchestrator Project: `prj_8feiiCEX9qudoqYtzoGoOlMbHSxK`
- GitHub Repo ID: `1146332440` (ethanstopperich1-rgb/voxaris)
- Vercel Team: `team_qg96of57kJvRgm9pTh8wpDor`
- Deploy via `POST /v13/deployments` with `gitSource`

## Key File Paths
- `src/data/blog-posts.ts` — Blog post data (typed array, not MDX)
- `src/pages/marketing/BlogIndex.tsx` — Blog index page (`/blog`)
- `src/pages/marketing/BlogPost.tsx` — Individual blog post page (`/blog/:slug`)
- `src/App.tsx` — Routes
- `src/components/marketing/Navbar.tsx` — Top nav
- `src/components/layout/Navigation.tsx` — Desktop + mobile nav
- `src/components/marketing/Footer.tsx` — Footer links
- `src/components/FloatingMaria.tsx` — Tavus CVI video bubble
- `orchestrator/lib/clients/rover.ts` — Rover API client
- `index.html` — Root HTML with meta tags (needs SEO update)

## Content Farm Reference
Full content library at `Voxaris-Content-Farm/`:
- `Content/Batch-1/` — 8 blog posts, social posts, video scripts, email newsletter, paid ad concepts
- `Calendar/` — 90-day content calendar (120 pieces planned)
- `SEO/` — Competitive analysis + keyword research
- `Outreach/` — Dealership email sequences + FL prospect CSVs
- `publishing-playbook.md` — Platform specs, hashtags, weekly schedule, KPIs

## Credentials
Stored in `~/.claude/projects/-Users-voxaris/memory/credentials.md`. Key ones:
- Vercel Token: `vcp_4vdTW1jZRVYkh2oD8cG6IORbD19SCP8zDAyKxUvk25N5NbmWBd1y9ZwY`
- Tavus API Key: `7f3c93c88c4a44c79f5d969b56bdbd75`
- Tavus Persona: `p40793780aaa`
- Rover API Key: `rtrvr_9OFZbYFiZcfc1-jW0y5kvke47O3f9ale1vWnr0Ca6xw`

## Style & Preferences
- Dark luxury aesthetic: deep blacks, gold accents (#d4a843), Instrument Sans + DM Sans
- Framer Motion animations with ease `[0.22, 1, 0.36, 1]`
- Fast execution, minimal back-and-forth
- Direct API calls over middleware
- Tailwind CSS 3 (NOT v4 — this project uses tailwind.config.ts)
