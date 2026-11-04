'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Database,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Copy,
  Check,
  Terminal,
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  FileCode,
} from 'lucide-react';

export default function AdminSupabasePage() {
  const [url, setUrl] = useState('https://udankkjapmjuurcveube.supabase.co');
  const [anonKey, setAnonKey] = useState('sb_publishable_lhwvmIHCEF2qqAcBemsreQ_A_CaAI82');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<any>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);

  const sqlSchemaSnippet = `-- ========================================================================
-- SRINOOS BLOGGING PLATFORM - SUPABASE POSTGRESQL SCHEMA
-- Execute in Supabase SQL Editor: https://supabase.com/dashboard/project/udankkjapmjuurcveube/sql/new
-- ========================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CATEGORIES TABLE
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

-- 2. BLOG POSTS TABLE
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    featured_image TEXT NOT NULL,
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
    published_at TIMESTAMP WITH TIME ZONE,
    author_name TEXT DEFAULT 'Srinoos Editorial Team',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. AD PLACEMENTS TABLE
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. AFFILIATE PROMOTIONS TABLE
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

-- 5. AD CLICKS LOGS TABLE
CREATE TABLE IF NOT EXISTS public.ad_clicks (
    id TEXT PRIMARY KEY,
    tracking_slug TEXT NOT NULL,
    placement_id TEXT DEFAULT '',
    user_agent TEXT DEFAULT '',
    referrer TEXT DEFAULT '',
    ip_hash TEXT DEFAULT '',
    clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. WEBSITE SETTINGS KEY-VALUE STORE
CREATE TABLE IF NOT EXISTS public.website_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL
);

-- INDEXES
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

CREATE POLICY "Public read published posts" ON public.blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public read active ads" ON public.ad_placements FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active affiliates" ON public.affiliate_promotions FOR SELECT USING (is_active = true);
CREATE POLICY "Public read website settings" ON public.website_settings FOR SELECT USING (true);

-- Admin & API sync policies
CREATE POLICY "Admin sync posts" ON public.blog_posts FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Admin sync categories" ON public.categories FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Admin sync ads" ON public.ad_placements FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Admin sync affiliates" ON public.affiliate_promotions FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Admin sync settings" ON public.website_settings FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Admin sync clicks" ON public.ad_clicks FOR ALL TO anon USING (true) WITH CHECK (true);

-- API Access Grants
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;`;

  const handleCopySchema = () => {
    navigator.clipboard.writeText(sqlSchemaSnippet);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2500);
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/supabase');
      const data: any = await res.json();
      setStatus(data);
    } catch {
      setStatus({ configured: false });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !anonKey.trim()) {
      setMessage({ text: 'Please enter both Supabase URL and Anon Key.', type: 'error' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/supabase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim(), anonKey: anonKey.trim(), syncData: true }),
      });

      const data: any = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Connection failed');
      }

      setMessage({
        text: 'Supabase connected successfully! Database is now linked.',
        type: 'success',
      });
      fetchStatus();
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to connect to Supabase', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleCopyTerminal = () => {
    navigator.clipboard.writeText('node scripts/connect-supabase.mjs');
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-1">
            Cloud PostgreSQL Database
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Database className="w-8 h-8 text-emerald-600" /> Supabase Database Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Connect high-speed multi-region PostgreSQL for real-time article publishing, zero 404 delays, and automated cloud sync.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="https://supabase.com/dashboard/project/udankkjapmjuurcveube/sql/new"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <span>Open SQL Editor (udankkjapmjuurcveube)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://supabase.com/dashboard/project/udankkjapmjuurcveube"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <span>Open Project Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Status Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${
                    status?.configured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                  }`}
                />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  {status?.configured ? 'Supabase Active & Connected' : 'Supabase Not Connected Yet'}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">
                {status?.configured ? 'PostgreSQL Cloud Engine' : 'Embedded SQLite Mode Active'}
              </h2>
            </div>

            <button
              type="button"
              onClick={fetchStatus}
              disabled={loading}
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs rounded-xl transition flex items-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
              <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Architecture</span>
              <div className="text-sm font-bold text-white">PostgreSQL</div>
              <span className="text-emerald-400 text-[10px]">Relational Cloud</span>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
              <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Latency</span>
              <div className="text-sm font-bold text-white">&lt; 30 ms</div>
              <span className="text-purple-400 text-[10px]">Mumbai ap-south-1</span>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
              <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Redundancy</span>
              <div className="text-sm font-bold text-white">Multi-Region</div>
              <span className="text-blue-400 text-[10px]">Global Sync</span>
            </div>
          </div>

          {status?.test && (
            <div className="p-4 bg-slate-800/90 rounded-2xl border border-slate-700 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
                <CheckCircle2 className="w-4 h-4" /> Live Verification
              </div>
              <p className="text-slate-300 text-[11px]">{status.test.message}</p>
            </div>
          )}
        </div>

        {/* Terminal Quick Connect Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider">
              <Terminal className="w-4 h-4" /> Terminal Command
            </div>
            <h3 className="font-black text-slate-900 text-base">Connect via Mac Terminal</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              You can connect Supabase directly from your terminal in one command:
            </p>

            <div className="p-3 bg-slate-900 text-purple-300 font-mono text-[11px] rounded-xl flex items-center justify-between overflow-x-auto">
              <code>node scripts/connect-supabase.mjs</code>
              <button
                type="button"
                onClick={handleCopyTerminal}
                className="text-slate-400 hover:text-white ml-2 flex-shrink-0"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-[11px] text-purple-800 space-y-1">
            <strong>What it does:</strong>
            <p className="text-purple-700">Prompts for your Supabase credentials, tests the connection, and configures .env.local automatically.</p>
          </div>
        </div>
      </div>

      {/* Connect Form */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-lg font-bold text-slate-900">Enter Supabase Credentials</h2>
          <p className="text-xs text-slate-500 mt-1">
            Obtain these from your Supabase Dashboard &rarr; <strong>Project Settings (⚙️)</strong> &rarr; <strong>API</strong>.
          </p>
        </div>

        {message && (
          <div
            className={`p-4 rounded-2xl text-xs flex items-center gap-2.5 ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Project URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://abcdefghijklmn.supabase.co"
              required
              className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              anon Public API Key
            </label>
            <input
              type="password"
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              required
              className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-slate-800"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <p className="text-[11px] text-slate-400">
              * Automatically syncs existing SQLite posts and categories into Supabase on connection.
            </p>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Zap className={`w-3.5 h-3.5 ${saving ? 'animate-spin' : ''}`} />
              <span>{saving ? 'Testing & Connecting...' : 'Connect Supabase Now'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 1-Click PostgreSQL Schema & RLS Copier */}
      <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Supabase SQL Schema & Row Level Security (RLS)</h3>
              <p className="text-xs text-slate-400">Execute this SQL snippet in Supabase SQL Editor if creating tables for the first time.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopySchema}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
          >
            {copiedSchema ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSchema ? 'SQL Copied to Clipboard!' : 'Copy SQL Schema (with RLS)'}</span>
          </button>
        </div>

        <pre className="bg-slate-950 p-4 rounded-2xl font-mono text-[11px] text-emerald-300 overflow-x-auto border border-slate-800 max-h-52 overflow-y-auto">
          <code>{sqlSchemaSnippet}</code>
        </pre>
      </div>
    </div>
  );
}

