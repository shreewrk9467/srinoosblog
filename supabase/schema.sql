-- ==============================================================================
-- SRICOSPACE SUPABASE POSTGRESQL SCHEMA INITIALIZATION
-- Project: udankkjapmjuurcveube.supabase.co
-- Enables permanent cloud persistence for Live Visual Builder & Website Settings
-- ==============================================================================

-- 1. Create website_settings table
CREATE TABLE IF NOT EXISTS public.website_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;

-- 3. Grant table permissions to all roles
GRANT ALL ON TABLE public.website_settings TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.website_settings TO anon, authenticated;

-- 4. RLS Policies (Allow read and write for the website)
DROP POLICY IF EXISTS "Allow public read access to website_settings" ON public.website_settings;
CREATE POLICY "Allow public read access to website_settings"
  ON public.website_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow insert access to website_settings" ON public.website_settings;
CREATE POLICY "Allow insert access to website_settings"
  ON public.website_settings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update access to website_settings" ON public.website_settings;
CREATE POLICY "Allow update access to website_settings"
  ON public.website_settings
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 5. Create blog_posts table (for articles)
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  category_slug TEXT NOT NULL,
  author_name TEXT NOT NULL,
  reading_time INTEGER DEFAULT 5,
  is_featured BOOLEAN DEFAULT false,
  is_trending BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'published',
  views_count INTEGER DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
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

-- 6. Seed initial site_config so the visual builder has persistent data immediately
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

