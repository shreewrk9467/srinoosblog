# Plan: Automated Affiliate Deals Discovery & Research Engine (Phase 1)

## Executive Summary
Implements Phase 1 of the Sricospace roadmap using GSD Core. Leads with an end-to-end **tracer bullet slice** that extracts real discounts from Reddit using `agent-reach` and stores them in Supabase and SQLite for monetization.

---

## Tracer Slice (Priority 1 - Must Verify First)

### Task 1.1: Deal Scraper Wrapper (`tools/scrape-deals.js`)
- **Action:** Create a Node.js script that invokes `agent-reach` CLI or Python parser.
- **Input:** `--keyword <query> --platform <reddit|youtube|web> --limit <number>`
- **Output:** Normalized JSON array with `{ title, provider, discountText, couponCode, sourceUrl, sentimentScore }`.
- **Checkpoint:** Run `ELECTRON_RUN_AS_NODE=1 "/Applications/Antigravity IDE.app/Contents/MacOS/Electron" tools/scrape-deals.js --test` to verify clean JSON extraction.

---

## Expansion Tasks

### Task 1.2: Database Persistence & Deduplication
- **File:** `src/lib/affiliate-deals.ts`
- **Action:** 
  - Store scraped deals in `data/blog.db` table `scraped_deals` and sync to Supabase table `public.scraped_deals`.
  - Add deduplication check on `sourceUrl` or `(provider, couponCode)`.
- **Verification:** Unit test checking duplicate inserts are ignored.

### Task 1.3: Admin UI Deals Sync Panel (`src/app/admin/affiliates/page.tsx`)
- **Action:**
  - Add "Discover Trending Deals via Agent-Reach" action button.
  - Display scraped deal cards with discount badges, coupon codes, and an "Auto-Generate Review Article" button.
- **Verification:** Load `/admin/affiliates` in browser and confirm UI renders smoothly.

---

## Reversibility Gates & Checkpoints

- **Gate 1 (Two-Way Door):** Deal Scraper output format is pure JSON, leaving existing affiliate tracking untouched.
- **Gate 2 (One-Way Door):** Supabase table creation `public.scraped_deals` via idempotent `CREATE TABLE IF NOT EXISTS`.

---

## Verification Plan

```bash
# 1. Type & Build Verification
ELECTRON_RUN_AS_NODE=1 "/Applications/Antigravity IDE.app/Contents/MacOS/Electron" node_modules/next/dist/bin/next build

# 2. Scraper Integration Verification
node tools/scrape-deals.js --keyword "Hostinger" --limit 3

# 3. Cloud Database Sync Verification
node tools/test-supabase.js
```

