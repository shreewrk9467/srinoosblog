# Phase 1 Research: Automated Affiliate Deals Discovery (.planning/phases/01-affiliate-auto-sync/RESEARCH.md)

## Objective
Establish a reliable, zero-cost mechanism to discover trending affiliate hosting, VPN, AI, and developer tools deals without relying on expensive paid scrapers or API subscriptions.

---

## 1. Tool Capabilities & Integration Architecture

### A. Agent-Reach (`tools/Agent-Reach`)
- **Strengths:** 
  - Scrapes Reddit discussion threads (`/r/webhosting`, `/r/VPS`, `/r/deals`, `/r/webdev`).
  - Fetches YouTube transcripts with timestamped promo codes.
  - Cleans HTML via Jina Reader (`https://r.jina.ai/<url>`) to extract clean markdown without cookie banners or ads.
- **CLI Invocations:**
  ```bash
  agent-reach search "Hostinger coupon code reddit" --platform reddit --limit 5
  agent-reach search "best hosting discount 2026" --platform youtube --limit 5
  ```

### B. Storage & Database Schema
- **Existing Schema:**
  - `src/lib/types.ts`: `AffiliateOffer`, `AffiliateNetwork`, `AffiliateConversion`.
  - Database currently synchronizes local SQLite (`data/blog.db`) and Supabase PostgreSQL.
- **Required Table:**
  - `affiliate_offers` (or extending `public.website_settings` key `'affiliate_offers'`).

---

## 2. Risk & Reversibility Analysis

| Decision | Rating | Reversibility | Fallback |
| :--- | :--- | :--- | :--- |
| **Direct CLI Execution vs Cron Daemon** | Two-Way Door | High | Admin manual trigger button in `/admin/affiliates` |
| **Schema Migration in Supabase** | One-Way Door | Medium | Run DDL via `tools/migrate-supabase.js` |
| **Regex Sanitization on Deal Text** | Two-Way Door | High | Modifiable in `src/lib/affiliates.ts` |

---

## 3. Tracer Slice Definition
The tracer bullet slice for Phase 1 is:
> Run a command `node tools/scrape-deals.js --keyword "Hostinger" --platform reddit` that fetches 1 live discount thread, extracts the coupon code, and writes a pending deal entry into SQLite/Supabase.

