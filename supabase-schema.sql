-- ========================================================================
-- SRINOOS BLOGGING & MONETIZATION PLATFORM
-- PRODUCTION SUPABASE POSTGRESQL SCHEMA & ROW LEVEL SECURITY (RLS)
-- ========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ADMIN USERS TABLE
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT DEFAULT '',
    icon TEXT DEFAULT 'Folder',
    meta_title TEXT DEFAULT '',
    meta_description TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. BLOG POSTS TABLE
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    featured_image TEXT NOT NULL,
    image_caption TEXT DEFAULT '',
    category_id TEXT REFERENCES public.categories(id) ON DELETE RESTRICT,
    tags TEXT DEFAULT '',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'scheduled', 'published', 'failed')),
    is_featured BOOLEAN DEFAULT FALSE,
    is_trending BOOLEAN DEFAULT FALSE,
    reading_time_minutes INTEGER DEFAULT 5,
    meta_title TEXT DEFAULT '',
    meta_description TEXT DEFAULT '',
    focus_keyword TEXT DEFAULT '',
    faq_schema JSONB DEFAULT '[]'::jsonb,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    author_name TEXT DEFAULT 'Srinoos Editorial Team',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. AD PLACEMENTS TABLE (All 20+ Placement Zones A-E)
CREATE TABLE IF NOT EXISTS public.ad_placements (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    location_zone TEXT NOT NULL,
    ad_type TEXT DEFAULT 'adsense' CHECK (ad_type IN ('adsense', 'affiliate', 'custom_html')),
    ad_slot_id TEXT DEFAULT '',
    format TEXT DEFAULT 'responsive',
    dimensions TEXT DEFAULT 'responsive',
    desktop_enabled BOOLEAN DEFAULT TRUE,
    tablet_enabled BOOLEAN DEFAULT TRUE,
    mobile_enabled BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    custom_html TEXT DEFAULT '',
    affiliate_promo_id TEXT DEFAULT '',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. AFFILIATE PROMOTIONS TABLE
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. AD CLICK TRACKING EVENT LOGS
CREATE TABLE IF NOT EXISTS public.ad_clicks (
    id TEXT PRIMARY KEY,
    tracking_slug TEXT NOT NULL,
    placement_id TEXT DEFAULT '',
    user_agent TEXT DEFAULT '',
    referrer TEXT DEFAULT '',
    ip_hash TEXT DEFAULT '',
    clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. WEBSITE SETTINGS KEY-VALUE STORE
CREATE TABLE IF NOT EXISTS public.website_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL
);

-- 8. COMMENTS TABLE WITH MODERATION
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id TEXT REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    author_email TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'spam')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INDEXES FOR MAXIMUM SEARCH AND QUERY VELOCITY
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_published ON public.blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_cat ON public.blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_slug ON public.affiliate_promotions(tracking_slug);
CREATE INDEX IF NOT EXISTS idx_clicks_slug ON public.ad_clicks(tracking_slug);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_clicks ENABLE ROW LEVEL SECURITY;

-- 1. Public can read published posts, active categories, active ads, and active affiliates
CREATE POLICY "Public read published posts" ON public.blog_posts
    FOR SELECT USING (status = 'published');

CREATE POLICY "Public read categories" ON public.categories
    FOR SELECT USING (true);

CREATE POLICY "Public read active ads" ON public.ad_placements
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public read active affiliates" ON public.affiliate_promotions
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public read website settings" ON public.website_settings
    FOR SELECT USING (true);

-- 2. Service Role has unrestricted access for cloud tasks & automations
CREATE POLICY "Service role full access on posts" ON public.blog_posts
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on categories" ON public.categories
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on ads" ON public.ad_placements
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on affiliates" ON public.affiliate_promotions
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on settings" ON public.website_settings
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on clicks" ON public.ad_clicks
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 3. Web Client & API Key operations (Permissive policies for site admin sync)
CREATE POLICY "Admin sync full access on posts" ON public.blog_posts
    FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Admin sync full access on categories" ON public.categories
    FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Admin sync full access on ads" ON public.ad_placements
    FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Admin sync full access on affiliates" ON public.affiliate_promotions
    FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Admin sync full access on settings" ON public.website_settings
    FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Admin sync full access on clicks" ON public.ad_clicks
    FOR ALL TO anon USING (true) WITH CHECK (true);

-- 4. EXPLICIT GRANTS FOR SUPABASE DATA API (POSTGREST)
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

