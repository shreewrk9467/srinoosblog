# CAMPAIGN MANAGER INSTRUCTION HOOK: MARKETING CAMPAIGN & OFFER DEPLOYER

## Objective
Auto-format, validate, and post affiliate marketing campaigns, promotions, and partner deals directly into the Sricospace platform (`/offers` and SQLite/Supabase `affiliate_offers` table).

## Required Campaign Fields & Rules
1. **Offer Title:** Concise, high-converting offer title (e.g. *"Hostinger Premium Cloud Hosting"*).
2. **Category Mapping:** Must map to an existing Sricospace offer category:
   - `Hosting & Domains`
   - `Technology & Software`
   - `Banking and Financial Services`
   - `Shopping and E-commerce`
   - `Education and Courses`
   - `Mobile Applications`
   - `Travel and Hotels`
   - `Free Registration Offers`
3. **Commission Model:** Must be exactly one of:
   - `CPA` (Cost Per Action)
   - `CPL` (Cost Per Lead)
   - `CPS` (Cost Per Sale)
   - `CPI` (Cost Per Install)
4. **Partner Network:** Attribution to one of the 11 supported networks (*Amazon Associates, EarnKaro, Cuelinks, Admitad, vCommission, Impact, CJ Affiliate, Awin, PartnerStack, ShareASale, Rakuten Advertising*).
5. **Slug & Redirect Generation:**
   - Generates a clean URL slug (e.g., `hostinger-cloud-sale`).
   - Produces the safe affiliate tracking link: `https://www.sricospace.com/go/{slug}`.
6. **Regulatory Compliance Statement:**
   - Must append the mandatory FTC & ASCI disclosure: *"Sricospace may earn an affiliate commission on approved qualifying actions through this partner link at no additional cost to you."*
7. **JSON-LD Schema Markup:** Formats Schema.org `Product` or `Offer` for Google Rich Snippets.

