'use client';

import { useState, useEffect } from 'react';
import { WebsiteSettings } from '@/lib/types';
import {
  Settings,
  Save,
  CheckCircle2,
  Tag,
  ShieldCheck,
  FileText,
  HelpCircle,
  ExternalLink,
  Globe,
  Server,
  Copy,
  Check,
  ArrowRight,
  Shield,
  Layers,
  Download,
  Upload,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Partial<WebsiteSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);
  const [restoreMessage, setRestoreMessage] = useState<string | null>(null);

  const handleImportBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!confirm('Are you sure you want to restore from this backup file? Existing data will be updated.')) {
      e.target.value = '';
      return;
    }

    setRestoring(true);
    setRestoreMessage(null);

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      const res = await fetch('/api/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json),
      });

      const data: any = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to restore backup');

      setRestoreMessage(`Successfully restored ${data.restored?.posts || 0} articles, ${data.restored?.categories || 0} categories, and settings!`);
      setTimeout(() => window.location.reload(), 1500);
    } catch (err: any) {
      alert(err.message || 'Error restoring backup');
    } finally {
      setRestoring(false);
      e.target.value = '';
    }
  };

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d: any) => {
        const s = d.settings || {};
        if (!s.hosting_provider) s.hosting_provider = 'hostinger';
        if (!s.hosting_plan) s.hosting_plan = 'Hostinger Business / Cloud';
        if (!s.custom_domain) s.custom_domain = 'sricospace.com';
        setSettings(s);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDomainChange = (domain: string) => {
    const cleanDomain = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
    setSettings((prev) => ({
      ...prev,
      custom_domain: cleanDomain,
      site_url: cleanDomain ? `https://${cleanDomain}` : prev.site_url,
    }));
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
      alert('Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading settings...</div>;
  }

  const domain = settings.custom_domain || 'srinoos.com';

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block mb-1">
            Production & Infrastructure
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Domain, Hosting & Website Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure your custom domain name, connect your hosting plan, and manage Google AdSense credentials.
          </p>
        </div>
        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" /> All Changes Saved!
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* 1. DOMAIN NAME & HOSTING CONFIGURATION CARD */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-brand-500/20 text-brand-400 border border-brand-500/30 rounded-xl">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight text-white">Custom Domain & Hosting Setup</h2>
                <p className="text-xs text-slate-300">
                  Connect your brand domain to your production server with automatic free SSL.
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" /> HTTPS SSL Ready
            </span>
          </div>

          {/* Domain & URL Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-200 uppercase mb-1">
                Your Custom Domain Name *
              </label>
              <input
                type="text"
                required
                placeholder="srinoos.com"
                value={settings.custom_domain || ''}
                onChange={(e) => handleDomainChange(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl p-3 text-sm text-white font-mono focus:outline-none focus:border-brand-400"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Enter your domain without http/https (e.g., <code>srinoos.com</code>).
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-200 uppercase mb-1">
                Full Production Site URL *
              </label>
              <input
                type="url"
                required
                placeholder="https://srinoos.com"
                value={settings.site_url || ''}
                onChange={(e) => setSettings({ ...settings, site_url: e.target.value })}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl p-3 text-sm text-white font-mono focus:outline-none focus:border-brand-400"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Used for canonical URLs, sitemaps, OpenGraph cards, and Google indexation.
              </span>
            </div>
          </div>

          {/* Hosting Plan Selector */}
          <div className="space-y-3 pt-2">
            <label className="block font-bold text-slate-200 uppercase text-xs">
              Select Your Target Hosting Platform
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Option 1: Vercel */}
              <div
                onClick={() => setSettings({ ...settings, hosting_provider: 'vercel' })}
                className={`cursor-pointer p-4 rounded-2xl border transition ${
                  settings.hosting_provider === 'vercel'
                    ? 'bg-brand-900/40 border-brand-400 shadow-md ring-1 ring-brand-400'
                    : 'bg-slate-800/40 border-slate-700 hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white text-sm">Vercel (Recommended)</span>
                  <span className="text-[10px] bg-brand-500 text-white font-bold px-2 py-0.5 rounded">1-Click</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Best native host for Next.js. Free automatic SSL, global Anycast edge CDN, zero server maintenance.
                </p>
                <div className="mt-3 text-[10px] text-brand-300 font-semibold">
                  Free Hobby or \$20/mo Pro
                </div>
              </div>

              {/* Option 2: Hostinger Cloud */}
              <div
                onClick={() => setSettings({ ...settings, hosting_provider: 'hostinger' })}
                className={`cursor-pointer p-4 rounded-2xl border transition ${
                  settings.hosting_provider === 'hostinger'
                    ? 'bg-brand-900/40 border-brand-400 shadow-md ring-1 ring-brand-400'
                    : 'bg-slate-800/40 border-slate-700 hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white text-sm">Hostinger Cloud / VPS</span>
                  <span className="text-[10px] bg-slate-700 text-slate-300 font-medium px-2 py-0.5 rounded">Dedicated</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Dedicated NVMe server storage, high bandwidth, and fixed Indian/Global IP address for high-traffic blogs.
                </p>
                <div className="mt-3 text-[10px] text-brand-300 font-semibold">
                  Starts at ~\$6 to \$14/mo
                </div>
              </div>

              {/* Option 3: Railway / Node VPS */}
              <div
                onClick={() => setSettings({ ...settings, hosting_provider: 'railway' })}
                className={`cursor-pointer p-4 rounded-2xl border transition ${
                  settings.hosting_provider === 'railway'
                    ? 'bg-brand-900/40 border-brand-400 shadow-md ring-1 ring-brand-400'
                    : 'bg-slate-800/40 border-slate-700 hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white text-sm">Railway / Container</span>
                  <span className="text-[10px] bg-slate-700 text-slate-300 font-medium px-2 py-0.5 rounded">Docker</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Instant Git container deployments with automated PostgreSQL databases and usage-based scaling.
                </p>
                <div className="mt-3 text-[10px] text-brand-300 font-semibold">
                  Pay-as-you-go (~\$5/mo)
                </div>
              </div>
            </div>
          </div>

          {/* DNS Records To Copy */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-200 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-brand-400" /> DNS Records to Add in Your Domain Registrar
              </span>
              <span className="text-[11px] text-slate-400">
                (GoDaddy, Namecheap, Hostinger, Cloudflare)
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-700 bg-slate-900/90">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800/80 text-slate-300 uppercase tracking-wider font-semibold border-b border-slate-700">
                  <tr>
                    <th className="px-4 py-2.5">Type</th>
                    <th className="px-4 py-2.5">Name / Host</th>
                    <th className="px-4 py-2.5">Target Value / IP</th>
                    <th className="px-4 py-2.5">TTL</th>
                    <th className="px-4 py-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200 font-mono text-[11px]">
                  {/* Record 1: A Record */}
                  <tr className="hover:bg-slate-800/50">
                    <td className="px-4 py-3 font-bold text-amber-400">A</td>
                    <td className="px-4 py-3">@</td>
                    <td className="px-4 py-3 font-semibold text-white">
                      {settings.hosting_provider === 'vercel' ? '76.76.21.21' : 'YOUR_SERVER_IP'}
                    </td>
                    <td className="px-4 py-3 text-slate-400">Auto / 3600</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleCopy(settings.hosting_provider === 'vercel' ? '76.76.21.21' : 'YOUR_SERVER_IP', 'a-rec')}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[10px] font-sans inline-flex items-center gap-1"
                      >
                        {copiedKey === 'a-rec' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copiedKey === 'a-rec' ? 'Copied' : 'Copy'}
                      </button>
                    </td>
                  </tr>

                  {/* Record 2: CNAME Record */}
                  <tr className="hover:bg-slate-800/50">
                    <td className="px-4 py-3 font-bold text-blue-400">CNAME</td>
                    <td className="px-4 py-3">www</td>
                    <td className="px-4 py-3 font-semibold text-white">
                      {settings.hosting_provider === 'vercel' ? 'cname.vercel-dns.com' : domain}
                    </td>
                    <td className="px-4 py-3 text-slate-400">Auto / 3600</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleCopy(settings.hosting_provider === 'vercel' ? 'cname.vercel-dns.com' : domain, 'cname-rec')}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[10px] font-sans inline-flex items-center gap-1"
                      >
                        {copiedKey === 'cname-rec' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copiedKey === 'cname-rec' ? 'Copied' : 'Copy'}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Once added in your registrar, DNS propagation typically finishes within 15 minutes to 2 hours. Your site will automatically secure with free SSL (https).
            </p>
          </div>
        </div>

        {/* 2. BRAND & IDENTITY SETTINGS */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-5">
          <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
            Brand Identity & Credits
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Logo Preview */}
            <div className="sm:col-span-2 flex items-center gap-4 p-4 bg-slate-900 text-white rounded-2xl border border-slate-800">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-950 flex-shrink-0 shadow-lg p-0.5">
                <img
                  src="/images/srinoos-s-icon.jpg"
                  alt="Official Logo Preview"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div>
                <span className="text-xs font-bold text-brand-400 uppercase tracking-wider block">Active Brand Logo</span>
                <span className="text-sm font-black text-white block">Srinoos Technology Collective (Infinity S Loop)</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Asset stored at <code>/public/images/srinoos-s-icon.jpg</code></span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Brand Name *</label>
              <input
                type="text"
                required
                value={settings.site_name || ''}
                onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Logo Text *</label>
              <input
                type="text"
                required
                value={settings.logo_text || ''}
                onChange={(e) => setSettings({ ...settings, logo_text: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 uppercase mb-1">Tagline</label>
              <input
                type="text"
                value={settings.site_tagline || ''}
                onChange={(e) => setSettings({ ...settings, site_tagline: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 uppercase mb-1">Site Description</label>
              <textarea
                rows={2}
                value={settings.site_description || ''}
                onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Contact Email *</label>
              <input
                type="email"
                required
                value={settings.contact_email || ''}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Footer Credit Text *</label>
              <input
                type="text"
                required
                value={settings.credit_text || ''}
                onChange={(e) => setSettings({ ...settings, credit_text: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Founder / About Me Customization */}
            <div className="sm:col-span-2 pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-brand-600">
                  Founder & &quot;About Me&quot; Profile Customization
                </span>
                <span className="text-[10px] bg-brand-50 text-brand-700 px-2 py-0.5 rounded font-bold">
                  Appears on /about and Articles
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Founder / Author Name</label>
                  <input
                    type="text"
                    placeholder="Srinoos"
                    value={settings.founder_name || ''}
                    onChange={(e) => setSettings({ ...settings, founder_name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Professional Title</label>
                  <input
                    type="text"
                    placeholder="Founder, Lead Architect & Digital Growth Strategist"
                    value={settings.founder_title || ''}
                    onChange={(e) => setSettings({ ...settings, founder_title: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  About Me / Founder Bio Story
                </label>
                <textarea
                  rows={4}
                  placeholder="Enter your personal bio, background, mission, and message to readers..."
                  value={settings.about_me_bio || ''}
                  onChange={(e) => setSettings({ ...settings, about_me_bio: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-brand-500 leading-relaxed"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  You can update your personal story and philosophy anytime right here.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. GOOGLE ADSENSE OFFICIAL INTEGRATION */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Tag className="w-5 h-5 text-amber-500" /> Google AdSense Official Integration
            </h3>
            <span className="text-xs text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full font-bold">
              Program Compliance Ready
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                AdSense Publisher ID (Client ID)
              </label>
              <input
                type="text"
                placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                value={settings.adsense_publisher_id || ''}
                onChange={(e) => setSettings({ ...settings, adsense_publisher_id: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono focus:outline-none focus:border-brand-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Found in your Google AdSense dashboard under Account &gt; Settings &gt; Publisher ID.
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(settings.adsense_active)}
                  onChange={(e) => setSettings({ ...settings, adsense_active: e.target.checked })}
                  className="rounded text-brand-600 focus:ring-brand-500"
                />
                <span>Enable Google AdSense Scripts & Units</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(settings.adsense_auto_ads)}
                  onChange={(e) => setSettings({ ...settings, adsense_auto_ads: e.target.checked })}
                  className="rounded text-brand-600 focus:ring-brand-500"
                />
                <span>Enable Google Auto Ads Optimization</span>
              </label>
            </div>

            {/* ads.txt Editor */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-bold text-slate-700 uppercase">
                  Authorized ads.txt Content
                </label>
                <a
                  href="/ads.txt"
                  target="_blank"
                  className="text-brand-600 hover:underline flex items-center gap-1 font-semibold text-[11px]"
                >
                  View Live /ads.txt <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <textarea
                rows={3}
                value={settings.ads_txt_content || ''}
                onChange={(e) => setSettings({ ...settings, ads_txt_content: e.target.value })}
                placeholder="google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-brand-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Google verifies your domain using this file. Served at <code>https://{domain}/ads.txt</code>.
              </span>
            </div>
          </div>
        </div>

        {/* 4. Registrar Instructions Checklist */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 text-xs">
          <h4 className="text-base font-bold text-brand-300 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" /> Domain Registrar Setup Quick Guide
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300">
            <div className="p-3 bg-slate-800/80 rounded-xl space-y-1">
              <span className="font-bold text-white block">GoDaddy / Namecheap DNS</span>
              <p>Go to your DNS Management page, add an <strong>A</strong> Record with Name <code>@</code> pointing to <code>76.76.21.21</code>, and a <strong>CNAME</strong> with Name <code>www</code> pointing to <code>cname.vercel-dns.com</code>.</p>
            </div>
            <div className="p-3 bg-slate-800/80 rounded-xl space-y-1">
              <span className="font-bold text-white block">Hostinger / Cloudflare DNS</span>
              <p>Add the same A and CNAME records in the DNS Zone Editor. If using Cloudflare, turn proxy status to "DNS Only" (Grey Cloud) during initial verification.</p>
            </div>
          </div>
        </div>

        {/* 5. Complete Website Backup & One-Click Restore (WordPress Style) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Layers className="w-5 h-5 text-brand-600" /> Complete Website Backup & Migration (WordPress Style)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Download a complete snapshot of all blog posts, categories, ad placements, affiliate links, and settings.
              </p>
            </div>
            <a
              href="/api/backup"
              download
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition"
            >
              <Download className="w-4 h-4" /> Download Backup (JSON)
            </a>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
            <div>
              <span className="font-bold text-slate-800 text-xs block">Restore or Migrate Site From Backup</span>
              <span className="text-[11px] text-slate-500 block">Upload a previously exported <code>srinoos_backup.json</code> file to restore all content instantly.</span>
            </div>
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>{restoring ? 'Restoring Database...' : 'Upload & Restore Backup'}</span>
              <input
                type="file"
                accept=".json"
                disabled={restoring}
                onChange={handleImportBackup}
                className="hidden"
              />
            </label>
          </div>

          {restoreMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
              <span>{restoreMessage}</span>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow transition flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Domain, Hosting & Website Settings'}
        </button>
      </form>
    </div>
  );
}
