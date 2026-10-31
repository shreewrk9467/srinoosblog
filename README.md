# Srinoos – Full-Stack Blogging & Monetization Platform

> **Brand**: Srinoos  
> **Credit**: Designed and Developed by Srinoos  
> **Tagline**: Ideas, Insights, Innovation & Digital Growth  

A production-ready full-stack blogging and advertising platform designed for high-velocity daily publishing (up to 20 articles/day), multi-channel advertising (Google AdSense, authorized affiliate programs, direct sponsorships), maximum organic Google Search traffic via advanced technical SEO, and reader trust.

---

## 🌟 Key Architecture & Capabilities

1. **Full-Stack Next.js 14 App Router + TypeScript + Tailwind CSS**
   - Clean, modern light theme with readable editorial typography and subtle animations.
   - Mobile-first responsive design for phones, tablets, laptops, and desktops.
   - Server-side rendering (SSR) & Incremental Static Regeneration (ISR) for sub-second page loads.

2. **Persistent Relational Database & Supabase Compatibility**
   - Built-in persistent relational database in `data/srinoos.db` (zero setup required locally; all blogs, ads, clicks, settings, and campaigns persist across restarts).
   - Production-ready Supabase PostgreSQL schema with Row-Level Security (RLS) in [`supabase-schema.sql`](./supabase-schema.sql).

3. **Daily 20-Blog Publishing Workflow & AI Assistant**
   - Visual daily publishing progress tracker (`X of 20 Completed`).
   - AI-assisted drafting workflow: generates article outlines, titles, excerpts, structured content, FAQ schemas, and SEO metadata.
   - Supports statuses: `draft`, `review`, `scheduled`, `published`, and `failed`.
   - Editorial approval required by default to prevent repetitive, low-value content.

4. **Maximum Configurable Advertisement Placements (Zones A–E)**
   - **Zone A (Global)**: Header leaderboard (728x90), below navigation, above footer, footer promo.
   - **Zone B (In-Article)**: Before content, after introduction, mid-article, before conclusion, after conclusion, near related articles.
   - **Zone C (Desktop Layout)**: Right sidebar top box, right sidebar sticky skyscraper (300x600), lower sidebar unit.
   - **Zone D (Homepage & Category)**: Hero billboard (970x250), between sections, feed native in-stream, category grid banner.
   - **Zone E (Mobile)**: Mobile top banner (320x50), inline article card, bottom anchored sticky unit.
   - Interactive visual wireframe preview in the admin dashboard (`/admin/ads`).
   - Strict adherence to Google AdSense policies (clear `ADVERTISEMENT` labels, minimum dimension preservation to eliminate CLS, adequate separation from navigation buttons).

5. **Google AdSense Official Integration**
   - Dedicated AdSense configuration page (`/admin/settings`).
   - Publisher ID (`ca-pub-XXXXXXXXXXXXXXXX`) and slot IDs.
   - Automatic dynamic `https://srinoos.com/ads.txt` serving HTTP 200 plain text.
   - Safe conditional script loading and Auto Ads toggle.

6. **Affiliate Marketing & Click Tracking Engine**
   - External partner promotion manager (`/admin/affiliates`).
   - Server-side redirect endpoint (`/go/[slug]`) with bot filtering, duplicate-click safeguards, and click logging.
   - FTC-compliant disclosure and `rel="sponsored nofollow noopener"` attributes.

7. **Complete Technical SEO Suite**
   - Server-rendered Schema.org JSON-LD structured data (`Article`, `BlogPosting`, `FAQPage`, `BreadcrumbList`, `Organization`, `WebSite`).
   - Dynamic XML sitemap generator at `/sitemap.xml`.
   - Robots.txt crawl directives at `/robots.txt`.
   - OpenGraph and Twitter card social sharing meta.
   - Google Search Console verification meta tag input.

---

## 🚀 Quick Start Guide

### 1. Install & Run Locally

```bash
# In the srinoosblog directory:
npm run dev

# Or build for production:
npm run build
npm run start
```
The application will launch at `http://localhost:3000`.

### 2. Admin Login Credentials

- **URL**: `http://localhost:3000/admin/login`
- **Email**: `admin@srinoos.com`
- **Password**: `Srinoos@Admin2026`

---

## 🗺️ All 22 Required Website Pages

### Public Pages
1. `/` – **Homepage** (Hero featured story, trending articles, category highlights, inline ad zones, sticky sidebar, newsletter)
2. `/blog` – **All Blogs** (Filterable, searchable catalog with reading times)
3. `/blog/[slug]` – **Individual Blog Article** (SSR, in-article ad zones, FAQ schema, author byline, comments, related posts)
4. `/categories` – **Browse Categories** (Topic cluster directory)
5. `/category/[slug]` – **Category Archive** (All articles in selected topic)
6. `/search` – **Search Results** (Live keyword search across titles and excerpts)
7. `/trending` – **Trending Articles** (High-engagement viral stories)
8. `/about` – **About Srinoos** (Editorial mission, brand story, quality standards)
9. `/contact` – **Contact Us** (Inquiry form, partnership channels, contact info)
10. `/privacy-policy` – **Privacy Policy** (GDPR, CCPA, and AdSense DART cookie compliant)
11. `/cookie-consent` – **Cookie & Consent Information** (Tracking cookies and preferences)
12. `/terms-and-conditions` – **Terms and Conditions** (Content usage terms and disclaimers)
13. `/affiliate-disclosure` – **Affiliate Disclosure** (FTC-compliant transparency statement)
14. `/ad-policy` – **Advertisement Policy** (AdSense publisher standards)
15. `404` – **Not Found** (Search suggestions and navigation fallback)

### Admin Management Pages
16. `/admin/login` – **Admin Login** (Secure session authentication)
17. `/admin` – **Admin Dashboard** (Daily 20-blog progress counter, click stats, quick actions)
18. `/admin/blogs` – **Blog Management** (List, filter, status toggles)
19. `/admin/blogs/new` – **New Blog Editor** (AI drafting assistant, FAQ schema generator, scheduler)
20. `/admin/blogs/[id]` – **Edit Blog** (Full editing and live preview)
21. `/admin/ads` – **Advertisement Management** (Visual wireframe layout preview, 20+ placement toggles)
22. `/admin/affiliates` – **Affiliate Management** (Product campaigns, `/go/[slug]` cloaking/redirect tracking)
23. `/admin/seo` – **SEO Settings** (Search Console verification tag, GA4 ID, sitemap status)
24. `/admin/analytics` – **Traffic & Earnings Dashboard** (Pageviews, sources, affiliate clicks, CSV export)
25. `/admin/settings` – **Website Settings** (Brand info, AdSense publisher ID, live `ads.txt` editor)

---

## ☁️ Production Deployment to Vercel

1. Push your repository to GitHub:
   ```bash
   git init && git add . && git commit -m "Initial commit"
   git remote add origin https://github.com/<username>/srinoosblog.git
   git push -u origin main
   ```
2. Import the project into [Vercel](https://vercel.com).
3. Set environment variable `JWT_SECRET` in Vercel project settings.
4. Deploy!

For Supabase integration, open [`supabase-schema.sql`](./supabase-schema.sql) in your Supabase SQL editor and execute it to provision your cloud PostgreSQL database.

