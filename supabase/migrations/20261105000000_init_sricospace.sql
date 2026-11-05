-- ==============================================================================
-- SRICOSPACE SUPABASE MIGRATION 20261105000000
-- Project Ref: udankkjapmjuurcveube
-- Database: PostgreSQL 15+
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. WEBSITE SETTINGS (Live Visual Builder Persistence)
CREATE TABLE IF NOT EXISTS public.website_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.website_settings TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.website_settings TO anon, authenticated;

DROP POLICY IF EXISTS "Allow public read access to website_settings" ON public.website_settings;
CREATE POLICY "Allow public read access to website_settings"
  ON public.website_settings FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow insert access to website_settings" ON public.website_settings;
CREATE POLICY "Allow insert access to website_settings"
  ON public.website_settings FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update access to website_settings" ON public.website_settings;
CREATE POLICY "Allow update access to website_settings"
  ON public.website_settings FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

-- 2. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT DEFAULT '',
  icon TEXT DEFAULT 'Folder',
  meta_title TEXT DEFAULT '',
  meta_description TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.categories TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.categories TO anon, authenticated;

DROP POLICY IF EXISTS "Allow public read categories" ON public.categories;
CREATE POLICY "Allow public read categories" ON public.categories FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow full write categories" ON public.categories;
CREATE POLICY "Allow full write categories" ON public.categories FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 3. BLOG POSTS
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  category_slug TEXT DEFAULT 'technology',
  category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL DEFAULT 'Srinoos Editorial Team',
  reading_time INTEGER DEFAULT 5,
  is_featured BOOLEAN DEFAULT false,
  is_trending BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'review', 'scheduled', 'published', 'failed')),
  views_count INTEGER DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  tags TEXT DEFAULT '',
  faq_schema JSONB DEFAULT '[]'::jsonb,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.blog_posts TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.blog_posts TO anon, authenticated;

DROP POLICY IF EXISTS "Allow public read blog_posts" ON public.blog_posts;
CREATE POLICY "Allow public read blog_posts" ON public.blog_posts FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow full write blog_posts" ON public.blog_posts;
CREATE POLICY "Allow full write blog_posts" ON public.blog_posts FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 4. AD PLACEMENTS
CREATE TABLE IF NOT EXISTS public.ad_placements (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location_zone TEXT NOT NULL,
  ad_type TEXT DEFAULT 'adsense',
  ad_slot_id TEXT DEFAULT '',
  format TEXT DEFAULT 'responsive',
  dimensions TEXT DEFAULT 'responsive',
  desktop_enabled BOOLEAN DEFAULT TRUE,
  tablet_enabled BOOLEAN DEFAULT TRUE,
  mobile_enabled BOOLEAN DEFAULT TRUE,
  is_active BOOLEAN DEFAULT TRUE,
  custom_html TEXT DEFAULT '',
  affiliate_promo_id TEXT DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.ad_placements ENABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.ad_placements TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.ad_placements TO anon, authenticated;

DROP POLICY IF EXISTS "Allow public read ad_placements" ON public.ad_placements;
CREATE POLICY "Allow public read ad_placements" ON public.ad_placements FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow full write ad_placements" ON public.ad_placements;
CREATE POLICY "Allow full write ad_placements" ON public.ad_placements FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 5. AFFILIATE PROMOTIONS
CREATE TABLE IF NOT EXISTS public.affiliate_promotions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  banner_url TEXT DEFAULT '',
  description TEXT DEFAULT '',
  destination_url TEXT NOT NULL,
  tracking_slug TEXT UNIQUE NOT NULL,
  campaign_name TEXT DEFAULT 'Direct',
  disclosure_text TEXT DEFAULT 'Sponsored / Affiliate link',
  total_clicks INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.affiliate_promotions ENABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.affiliate_promotions TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.affiliate_promotions TO anon, authenticated;

DROP POLICY IF EXISTS "Allow public read affiliate_promotions" ON public.affiliate_promotions;
CREATE POLICY "Allow public read affiliate_promotions" ON public.affiliate_promotions FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow full write affiliate_promotions" ON public.affiliate_promotions;
CREATE POLICY "Allow full write affiliate_promotions" ON public.affiliate_promotions FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 6. AD CLICKS ANALYTICS
CREATE TABLE IF NOT EXISTS public.ad_clicks (
  id TEXT PRIMARY KEY,
  tracking_slug TEXT NOT NULL,
  placement_id TEXT DEFAULT '',
  user_agent TEXT DEFAULT '',
  referrer TEXT DEFAULT '',
  ip_hash TEXT DEFAULT '',
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.ad_clicks ENABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.ad_clicks TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.ad_clicks TO anon, authenticated;

DROP POLICY IF EXISTS "Allow public read ad_clicks" ON public.ad_clicks;
CREATE POLICY "Allow public read ad_clicks" ON public.ad_clicks FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow full write ad_clicks" ON public.ad_clicks;
CREATE POLICY "Allow full write ad_clicks" ON public.ad_clicks FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 7. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_published ON public.blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_cat ON public.blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_slug ON public.affiliate_promotions(tracking_slug);
CREATE INDEX IF NOT EXISTS idx_clicks_slug ON public.ad_clicks(tracking_slug);

-- 8. SEED INITIAL SITE CONFIG
INSERT INTO public.website_settings (key, value, updated_at)
VALUES (
  'site_config',
  '{
    "site_name": "SricoSpace",
    "site_tagline": "The Premier Technology, AI & Monetization Collective",
    "site_description": "Curated technical research, enterprise software guides, high-yield affiliate architectures, and digital growth playbooks.",
    "site_url": "https://www.sricospace.com",
    "founder_name": "Ketanboina Venkat Shrinivas",
    "founder_title": "Founder, Lead Technologist & Enterprise Architect",
    "announcement_bar_enabled": true,
    "announcement_bar_text": "⚡ Welcome to Sricospace — Discover Verified Tech, AI & Affiliate Insights (Made by Srinoos)",
    "announcement_bar_link": "/offers",
    "hero_headline": "Artificial Intelligence, Quantum Computing & Digital Growth Insights",
    "hero_subheadline": "Deep technical analysis, high-speed full-stack development, and actionable online monetization playbooks designed for visionary digital builders.",
    "hero_lead_badge": "⚡ Technology Collective • Daily Dispatch"
  }'::jsonb,
  now()
)
ON CONFLICT (key) DO NOTHING;
