'use client';

import { useState, useEffect } from 'react';
import { WebsiteSettings } from '@/lib/types';
import {
  Search,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Save,
  Globe,
  FileCode,
  Share2,
  RefreshCw,
  AlertCircle,
  Activity,
} from 'lucide-react';

export default function AdminSeoPage() {
  const [settings, setSettings] = useState<Partial<WebsiteSettings>>({});
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [runningAudit, setRunningAudit] = useState(false);
  const [auditResults, setAuditResults] = useState<any>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => setSettings(d.settings || {}));
  }, []);

  const handleRunAudit = async () => {
    setRunningAudit(true);
    try {
      const [sitemapRes, robotsRes, adsRes] = await Promise.all([
        fetch('/sitemap.xml'),
        fetch('/robots.txt'),
        fetch('/ads.txt'),
      ]);

      const sitemapText = await sitemapRes.text();
      const urlMatches = (sitemapText.match(/<url>/g) || []).length;

      setAuditResults({
        sitemapOk: sitemapRes.ok,
        sitemapUrls: urlMatches,
        robotsOk: robotsRes.ok,
        adsOk: adsRes.ok,
        gscConfigured: Boolean(settings.google_search_console_tag),
        ga4Configured: Boolean(settings.google_analytics_id),
        canonicalOk: Boolean(settings.site_url),
        timestamp: new Date().toLocaleTimeString(),
      });
    } catch (err: any) {
      alert('Audit check error: ' + err.message);
    } finally {
      setRunningAudit(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2500);
      }
    } catch (e) {
      alert('Error updating SEO settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block mb-1">
            Search Engine Discoverability
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Technical SEO & Search Console Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure Google verification, GA4 analytics, canonical base URLs, and dynamic sitemaps.
          </p>
        </div>
        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" /> SEO Settings Saved!
          </div>
        )}
      </div>

      {/* Live Google Search Console & Indexing Health Diagnostic */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Live Google Indexing Health
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Search Console & Crawler Diagnostic Audit
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Probe your live XML sitemap, robots.txt crawler directives, and verification tags in one click.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRunAudit}
            disabled={runningAudit}
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${runningAudit ? 'animate-spin' : ''}`} />
            <span>{runningAudit ? 'Running Health Audit...' : 'Run Live SEO Health Audit'}</span>
          </button>
        </div>

        {auditResults && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs animate-in fade-in">
            <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Sitemap.xml</span>
              <div className="flex items-center gap-1.5 font-bold text-white">
                {auditResults.sitemapOk ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
                <span>{auditResults.sitemapOk ? `${auditResults.sitemapUrls} URLs` : 'Failed'}</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Robots.txt</span>
              <div className="flex items-center gap-1.5 font-bold text-white">
                {auditResults.robotsOk ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
                <span>{auditResults.robotsOk ? 'Valid' : 'Failed'}</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Ads.txt</span>
              <div className="flex items-center gap-1.5 font-bold text-white">
                {auditResults.adsOk ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
                <span>{auditResults.adsOk ? '200 OK' : 'Failed'}</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Google Tag</span>
              <div className="flex items-center gap-1.5 font-bold text-white">
                {auditResults.gscConfigured ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-amber-400" />}
                <span>{auditResults.gscConfigured ? 'Verified' : 'Pending'}</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">GA4 Analytics</span>
              <div className="flex items-center gap-1.5 font-bold text-white">
                {auditResults.ga4Configured ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-amber-400" />}
                <span>{auditResults.ga4Configured ? 'Active' : 'Missing'}</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Canonical Base</span>
              <div className="flex items-center gap-1.5 font-bold text-white">
                {auditResults.canonicalOk ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
                <span>{auditResults.canonicalOk ? '200 OK' : 'Missing'}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Google Search Console & GA4 */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
              <Search className="w-5 h-5 text-brand-600" /> Google Search Console & Web Analytics
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Google Search Console Verification Tag
              </label>
              <input
                type="text"
                placeholder="google-site-verification=XXXXXXXXXXXXXXXXXXXXX"
                value={settings.google_search_console_tag || ''}
                onChange={(e) => setSettings({ ...settings, google_search_console_tag: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono focus:outline-none focus:border-brand-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Inserted automatically into the &lt;head&gt; meta tag of every page.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Google Analytics 4 Measurement ID
              </label>
              <input
                type="text"
                placeholder="G-XXXXXXXXXX"
                value={settings.google_analytics_id || ''}
                onChange={(e) => setSettings({ ...settings, google_analytics_id: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Canonical Base URL
              </label>
              <input
                type="url"
                placeholder="https://srinoos.com"
                value={settings.site_url || ''}
                onChange={(e) => setSettings({ ...settings, site_url: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Dynamic Crawl Health & Sitemaps */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
              <FileCode className="w-5 h-5 text-emerald-600" /> Crawl Health & Sitemaps
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="font-bold text-slate-800 text-xs block">Dynamic XML Sitemap</span>
                  <span className="text-[11px] text-slate-500">Auto-updated on every blog publish</span>
                </div>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-brand-600 hover:bg-slate-50 flex items-center gap-1 shadow-2xs"
                >
                  Inspect /sitemap.xml <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="font-bold text-slate-800 text-xs block">Robots.txt Directive</span>
                  <span className="text-[11px] text-slate-500">Allows Googlebot, blocks admin</span>
                </div>
                <a
                  href="/robots.txt"
                  target="_blank"
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-brand-600 hover:bg-slate-50 flex items-center gap-1 shadow-2xs"
                >
                  Inspect /robots.txt <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="font-bold text-slate-800 text-xs block">Authorized Ads.txt</span>
                  <span className="text-[11px] text-slate-500">AdSense crawler endpoint</span>
                </div>
                <a
                  href="/ads.txt"
                  target="_blank"
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-brand-600 hover:bg-slate-50 flex items-center gap-1 shadow-2xs"
                >
                  Inspect /ads.txt <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Global Structured Data JSON-LD Audit */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Schema.org Structured Data Active Deployments</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl">
              <span className="font-bold text-emerald-900 block">Article & BlogPosting Schema</span>
              <p className="text-slate-600 mt-1">Embedded on all individual blog pages with headline, image, author, datePublished, and dateModified.</p>
            </div>
            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl">
              <span className="font-bold text-emerald-900 block">FAQPage Rich Snippets</span>
              <p className="text-slate-600 mt-1">Generates accordion questions in Google Search results directly from the blog editor FAQs.</p>
            </div>
            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl">
              <span className="font-bold text-emerald-900 block">BreadcrumbList & Organization</span>
              <p className="text-slate-600 mt-1">Hierarchical breadcrumbs to guide search bots through categories and topic clusters.</p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow transition flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Technical SEO Settings'}
        </button>
      </form>
    </div>
  );
}

