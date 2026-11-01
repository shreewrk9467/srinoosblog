'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Globe,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Save,
  HelpCircle,
  Copy,
  Sparkles,
  Layers,
  ArrowRight,
  BookOpen,
  Check,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import { WebsiteSettings } from '@/lib/types';

export default function AdminWordPressPage() {
  const [settings, setSettings] = useState<Partial<WebsiteSettings>>({});
  const [wpUrl, setWpUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [syncResult, setSyncResult] = useState<any>(null);
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => {
        const s = d.settings || {};
        setSettings(s);
        setWpUrl(s.wordpress_url || '');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleTestConnection = async () => {
    if (!wpUrl.trim()) {
      alert('Please enter your WordPress URL first.');
      return;
    }
    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/wordpress/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: wpUrl.trim() }),
      });
      const data = await res.json();
      setTestResult(data);
    } catch (err: any) {
      setTestResult({
        success: false,
        message: 'Network error communicating with test endpoint',
        error: err.message,
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSaveUrl = async () => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...settings,
          wordpress_url: wpUrl.trim(),
          wordpress_enabled: true,
        }),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch {
      alert('Failed to save settings');
    }
  };

  const handleSyncArticles = async () => {
    if (!wpUrl.trim()) {
      alert('Please enter your WordPress URL first.');
      return;
    }
    setSyncing(true);
    setSyncResult(null);

    try {
      const res = await fetch('/api/wordpress/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: wpUrl.trim() }),
      });
      const data = await res.json();
      setSyncResult(data);
    } catch (err: any) {
      setSyncResult({
        success: false,
        error: err.message,
      });
    } finally {
      setSyncing(false);
    }
  };

  const webhookUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/api/wordpress/sync`
    : 'https://sricospace.com/api/wordpress/sync';

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
        Loading WordPress Integration Hub...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
            Headless WordPress Architecture
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            WordPress Connection & Sync Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Write, draft, and format your blogs inside WordPress — display them with lightning speed, custom ads, and SEO on sricospace.com.
          </p>
        </div>
        {saveSuccess && (
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> WordPress Configuration Saved!
          </div>
        )}
      </div>

      {/* Main Connection Panel */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Your WordPress Website Connection</h2>
            <p className="text-xs text-slate-500">
              Enter the URL of your WordPress installation (e.g. <code>https://wp.sricospace.com</code> or any WordPress site).
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              WordPress URL (REST API Source)
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="url"
                value={wpUrl}
                onChange={(e) => setWpUrl(e.target.value)}
                placeholder="https://wp.sricospace.com"
                className="flex-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleSaveUrl}
                className="w-full sm:w-auto px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Save className="w-4 h-4" /> Save URL
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testing || !wpUrl.trim()}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${testing ? 'animate-spin' : ''}`} />
              <span>{testing ? 'Connecting to WordPress...' : 'Test Connection'}</span>
            </button>

            <button
              type="button"
              onClick={handleSyncArticles}
              disabled={syncing || !wpUrl.trim()}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Syncing Articles...' : 'Sync Articles from WordPress Now'}</span>
            </button>

            {wpUrl && (
              <a
                href={`${wpUrl.replace(/\/$/, '')}/wp-admin`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition inline-flex items-center gap-1.5"
              >
                Open WordPress Dashboard <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Test Connection Output Alert */}
          {testResult && (
            <div
              className={`p-4 rounded-2xl border text-xs space-y-1.5 animate-in fade-in ${
                testResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm">
                {testResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                )}
                <span>{testResult.message}</span>
              </div>
              {testResult.success ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-emerald-800">
                  <div>Site Title: <strong>{testResult.siteName}</strong></div>
                  <div>Published Articles: <strong>{testResult.postCount}</strong></div>
                  <div>Sample: <strong>{testResult.samplePostTitle}</strong></div>
                </div>
              ) : (
                <p className="text-rose-700 font-mono text-[11px] pt-1">
                  Details: {testResult.error || 'Check that your WordPress REST API is accessible.'}
                </p>
              )}
            </div>
          )}

          {/* Sync Result Output Alert */}
          {syncResult && (
            <div
              className={`p-4 rounded-2xl border text-xs space-y-2 animate-in fade-in ${
                syncResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Successfully synced {syncResult.syncedCount} articles into persistent database!</span>
              </div>
              <p className="text-emerald-700 text-xs">
                All articles are now published on <Link href="/blog" target="_blank" className="underline font-bold">sricospace.com/blog</Link> with custom advertisements and instant Next.js performance!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Instant Auto-Sync Webhook Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-2xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Automatic Live Webhook (Instant Publishing)</h2>
            <p className="text-xs text-slate-500">
              Whenever you hit &quot;Publish&quot; or &quot;Update&quot; in WordPress, your live site updates instantly.
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <p className="text-slate-600 leading-relaxed">
            Copy this Webhook URL into any free WordPress Webhook plugin (such as <strong>WP Webhooks</strong> or <strong>Webhook Actions</strong>) so WordPress notifies your website automatically when you edit or publish:
          </p>

          <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <code className="flex-1 font-mono text-slate-800 text-xs truncate">
              {webhookUrl}
            </code>
            <button
              type="button"
              onClick={handleCopyWebhook}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer transition shadow-2xs"
            >
              {copiedWebhook ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedWebhook ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hostinger 1-Minute Setup Guide */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div>
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
            Hostinger Step-by-Step
          </span>
          <h2 className="text-2xl font-black tracking-tight">
            How to Set Up Your WordPress Backend on Hostinger in 60 Seconds
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Follow these 3 easy steps in your Hostinger hPanel to create your private WordPress dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-2">
            <span className="w-7 h-7 bg-brand-500 text-white font-black rounded-lg flex items-center justify-center text-xs">
              1
            </span>
            <h3 className="font-bold text-white text-sm">Create Subdomain in Hostinger</h3>
            <p className="text-slate-300 leading-relaxed">
              In your Hostinger hPanel, go to <strong>Domains</strong> &rarr; <strong>Subdomains</strong>. Create a subdomain named <code>wp</code> (this creates <code>wp.sricospace.com</code>).
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-2">
            <span className="w-7 h-7 bg-brand-500 text-white font-black rounded-lg flex items-center justify-center text-xs">
              2
            </span>
            <h3 className="font-bold text-white text-sm">Install WordPress in 1-Click</h3>
            <p className="text-slate-300 leading-relaxed">
              In hPanel, go to <strong>Websites</strong> &rarr; <strong>Auto Installer</strong>. Click <strong>WordPress</strong> and choose your subdomain <code>wp.sricospace.com</code>. Click <strong>Install</strong>.
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-2">
            <span className="w-7 h-7 bg-brand-500 text-white font-black rounded-lg flex items-center justify-center text-xs">
              3
            </span>
            <h3 className="font-bold text-white text-sm">Connect & Write!</h3>
            <p className="text-slate-300 leading-relaxed">
              Paste <code>https://wp.sricospace.com</code> into the field above and click <strong>Test Connection</strong>. You can now write inside WordPress and publish live!
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-brand-400" />
            <span>You can also download the official <strong>WordPress App</strong> on Android/iOS and write posts from your phone!</span>
          </div>
        </div>
      </div>
    </div>
  );
}

