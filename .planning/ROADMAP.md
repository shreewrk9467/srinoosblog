# Sricospace Project Roadmap (.planning/ROADMAP.md)

**Platform:** Sricospace (`sricospace.com`)  
**Architecture:** Next.js 14 App Router, Supabase PostgreSQL, SQLite Local Replica, Tailwind CSS  
**Spec Framework:** GSD Core (Get-Shit-Done) Phase Loop  

---

## Roadmap Phases Overview

```
┌────────────────────────────────────────────────────────────────────────┐
│ Phase 1: Automated Affiliate Deals Discovery & Research Engine (Tracer) │ ◄ CURRENT
├────────────────────────────────────────────────────────────────────────┤
│ Phase 2: Anti-Slop Content Pipeline & Auto-Publishing API              │
├────────────────────────────────────────────────────────────────────────┤
│ Phase 3: Slide & Video Repurposing Pipeline (PPT-Master + Video-Use)   │
├────────────────────────────────────────────────────────────────────────┤
│ Phase 4: NVIDIA SkillSpector Security Auditing & Shield Gateway        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Phase Breakdown

### Phase 1: Automated Affiliate Deals Discovery & Research Engine (Tracer)
- **Goal:** Ingest real-time promotional discounts and deals from Reddit, YouTube transcripts, and host providers using `Agent-Reach`.
- **Mode:** MVP / Tracer-First
- **Status:** Planning Completed (`.planning/phases/01-affiliate-auto-sync/PLAN.md`)
- **Key Deliverables:**
  1. CLI deal scraper wrapper around `agent-reach` (`tools/scrape-deals.js`).
  2. Data normalization into Supabase `affiliate_offers` table.
  3. Live preview in `/admin/affiliates` with 1-click "Turn Deal into Article".

### Phase 2: Anti-Slop Content Pipeline & Auto-Publishing API
- **Goal:** Transform scraped deal data into SEO-optimized, human-first product reviews using `no-ai-slop`.
- **Status:** Unplanned (Queued)
- **Key Deliverables:**
  1. AI generator prompt templates with strict anti-cliché filters.
  2. Automated draft generation in Supabase `blog_posts`.
  3. Dynamic affiliate button injection (`/go/[slug]`).

### Phase 3: Slide & Video Repurposing Pipeline
- **Goal:** Convert top-performing blog articles into PowerPoint decks (`ppt-master`) and short-form videos (`video-use`).
- **Status:** Unplanned (Queued)

### Phase 4: NVIDIA Security Auditing Gateway
- **Goal:** Integrate automated `SkillSpector` vulnerability scanning for project dependencies, agent skills, and webhook payloads.
- **Status:** Unplanned (Queued)

