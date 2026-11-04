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
  Info,
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
      .then((d: any) => {
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
        body: JSON.stringify({ url: wpUrl.trim(), autoSave: true }),
      });
      const data: any = await res.json();
      setTestResult(data);

      if (data.success && data.cleanedUrl) {
        setWpUrl(data.cleanedUrl);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      }
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
      } else {
        const data: any = await res.json();
        alert(data.error || 'Failed to save settings');
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
      const data: any = await res.json();
      setSyncResult(data);
    } catch (err: any) {
      setSyncResult({
        success: false,
        syncedCount: 0,
        syncedPosts: [],
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
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-200 animate-in fade-in">
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
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                WordPress Website Address (REST API Source)
              </label>
              <button
                type="button"
                onClick={() => setWpUrl('https://wp.sricospace.com')}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-bold underline cursor-pointer"
              >
                Use default: https://wp.sricospace.com
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={wpUrl}
                onChange={(e) => setWpUrl(e.target.value)}
                placeholder="https://wp.sricospace.com"
                className="flex-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-blue-500 focus:bg-white"
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
              <span>{testing ? 'Testing Connection...' : 'Test Connection'}</span>
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
              className={`p-4 rounded-2xl border text-xs space-y-2 animate-in fade-in ${
                testResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm">
                {testResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                )}
                <span>{testResult.message}</span>
              </div>

              {testResult.success ? (
                <div className="space-y-2 pt-1 text-emerald-800">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-emerald-100/60 p-3 rounded-xl">
                    <div>Site Title: <strong>{testResult.siteName}</strong></div>
                    <div>Published in WordPress: <strong>{testResult.postCount}</strong></div>
                    <div>Sample: <strong>{testResult.samplePostTitle}</strong></div>
                  </div>

                  {testResult.postCount === 0 && (
                    <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl flex items-start gap-2.5">
                      <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="block">WordPress Connected, but 0 posts are published yet:</strong>
                        <span>
                          Go to your WordPress admin panel ({wpUrl}/wp-admin), create a new post, click <strong>Publish</strong>, and then return here and click <strong>Sync Articles from WordPress Now</strong>.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-1 pt-1">
                  <p className="text-rose-700 font-mono text-[11px]">
                    Details: {testResult.error || testResult.message}
                  </p>
                  <p className="text-rose-600 text-[11px]">
                    Tip: If you haven&apos;t installed WordPress yet, follow the Hostinger guide below to set up <code>wp.sricospace.com</code> in 60 seconds!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Sync Result Output Alert */}
          {syncResult && (
            <div
              className={`p-4 rounded-2xl border text-xs space-y-2 animate-in fade-in ${
                syncResult.success && syncResult.syncedCount > 0
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : syncResult.success && syncResult.syncedCount === 0
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm">
                {syncResult.success && syncResult.syncedCount > 0 ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                ) : syncResult.success && syncResult.syncedCount === 0 ? (
                  <Info className="w-5 h-5 text-amber-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                )}
                <span>
                  {syncResult.success && syncResult.syncedCount > 0
                    ? `Successfully synced ${syncResult.syncedCount} article${syncResult.syncedCount === 1 ? '' : 's'} into your website!`
                    : syncResult.success && syncResult.syncedCount === 0
                    ? 'WordPress Connected, but 0 published articles were found'
                    : 'Failed to sync articles'}
                </span>
              </div>

              {syncResult.success && syncResult.syncedCount > 0 && (
                <div className="space-y-2 pt-1 text-emerald-800">
                  <p className="text-xs">
                    All articles are now published live on{' '}
                    <Link href="/blog" target="_blank" className="underline font-bold">
                      sricospace.com/blog
                    </Link>{' '}
                    with custom advertisements, fast Next.js static performance, and SEO optimization!
                  </p>
                  {syncResult.syncedPosts && syncResult.syncedPosts.length > 0 && (
                    <div className="bg-emerald-100/60 p-2.5 rounded-xl space-y-1">
                      <span className="font-bold text-[11px] block uppercase text-emerald-900">
                        Imported Articles:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {syncResult.syncedPosts.slice(0, 5).map((post: any) => (
                          <Link
                            key={post.id}
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-white rounded-lg text-[11px] font-semibold text-emerald-900 border border-emerald-200 hover:border-emerald-400 transition"
                          >
                            <span>{post.title}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {syncResult.success && syncResult.syncedCount === 0 && (
                <div className="space-y-2 pt-1 text-amber-800">
                  <p className="text-xs leading-relaxed">
                    Your WordPress site at <strong>{wpUrl}</strong> is connected, but there are no published posts yet.
                  </p>
                  <div className="bg-amber-100/70 p-3 rounded-xl space-y-2 text-xs">
                    <strong className="block text-amber-950">How to publish your first post:</strong>
                    <ol className="list-decimal list-inside space-y-1 text-amber-900">
                      <li>Log in to your WordPress dashboard: <a href={`${wpUrl.replace(/\/$/, '')}/wp-admin`} target="_blank" rel="noopener noreferrer" className="font-bold underline">{wpUrl}/wp-admin</a></li>
                      <li>Go to <strong>Posts &rarr; Add New</strong>.</li>
                      <li>Type your article title and content.</li>
                      <li>Click the blue <strong>Publish</strong> button (make sure Status is &quot;Published&quot;, not &quot;Draft&quot;).</li>
                      <li>Come back here and click <strong>Sync Articles from WordPress Now</strong>!</li>
                    </ol>
                  </div>
                  {wpUrl && (
                    <a
                      href={`${wpUrl.replace(/\/$/, '')}/wp-admin/post-new.php`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg transition"
                    >
                      <span>Create New Post in WordPress</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}

              {!syncResult.success && (
                <p className="text-rose-700 font-mono text-[11px] pt-1">
                  Details: {syncResult.error || 'Check that your WordPress REST API is accessible.'}
                </p>
              )}
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
            <h3 className="font-bold text-white text-sm">Publish & Sync</h3>
            <p className="text-slate-300 leading-relaxed">
              Log into <code>wp.sricospace.com/wp-admin</code>. Write any blog post and hit <strong>Publish</strong>. Then come back here and click <strong>Sync Articles from WordPress Now</strong>!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
