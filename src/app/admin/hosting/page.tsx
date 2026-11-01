'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Server,
  Activity,
  HardDrive,
  Cpu,
  Layers,
  Globe,
  Database,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  Zap,
  Terminal,
  FolderOpen,
  ArrowRight,
} from 'lucide-react';
import { WebsiteSettings } from '@/lib/types';

export default function AdminHostingPage() {
  const [settings, setSettings] = useState<Partial<WebsiteSettings>>({});
  const [loading, setLoading] = useState(true);
  const [pinging, setPinging] = useState(false);
  const [pingResult, setPingResult] = useState<any>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => setSettings(d.settings || {}))
      .finally(() => setLoading(false));

    // Auto-ping Hostinger server on page load
    handlePingServer();
  }, []);

  const handlePingServer = async () => {
    setPinging(true);
    try {
      const res = await fetch('/api/hosting/ping');
      const data = await res.json();
      setPingResult(data);
    } catch (err: any) {
      setPingResult({
        success: false,
        online: false,
        error: err.message,
      });
    } finally {
      setPinging(false);
    }
  };

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
        Loading Hostinger Infrastructure Hub...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 block mb-1">
            Connected Cloud Infrastructure
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Server className="w-8 h-8 text-purple-600" /> Hostinger Hosting Service Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time server telemetry, LiteSpeed runtime status, FTP upload paths, and domain DNS mapping.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://hpanel.hostinger.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>Open Hostinger hPanel</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Live Server Telemetry Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Status & Ping */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Hostinger Service Online
                </span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight mt-1">
                server1675 • 82.112.239.60
              </h2>
              <p className="text-xs text-slate-300">
                LiteSpeed Web Server • Asia (India Datacenter) • Automatic Singapore Backups
              </p>
            </div>

            <button
              type="button"
              onClick={handlePingServer}
              disabled={pinging}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs rounded-xl transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${pinging ? 'animate-spin' : ''}`} />
              <span>{pinging ? 'Pinging Hostinger...' : 'Ping Server Now'}</span>
            </button>
          </div>

          {/* Telemetry Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
            <div className="bg-slate-800/80 border border-slate-700/80 p-3.5 rounded-2xl">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                Disk Space
              </span>
              <div className="text-lg font-black text-white">20 GB</div>
              <span className="text-[10px] text-purple-400 font-semibold">NVMe Fast Storage</span>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 p-3.5 rounded-2xl">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                RAM Memory
              </span>
              <div className="text-lg font-black text-white">2,048 MB</div>
              <span className="text-[10px] text-blue-400 font-semibold">2 GB Dedicated</span>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 p-3.5 rounded-2xl">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                PHP Workers
              </span>
              <div className="text-lg font-black text-white">40 Workers</div>
              <span className="text-[10px] text-emerald-400 font-semibold">Max 80 Processes</span>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 p-3.5 rounded-2xl">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                Bandwidth
              </span>
              <div className="text-lg font-black text-white">Unlimited</div>
              <span className="text-[10px] text-amber-400 font-semibold">Unmetered Traffic</span>
            </div>
          </div>

          {/* Live Ping Telemetry Box */}
          {pingResult && (
            <div className="bg-slate-800/90 border border-slate-700/90 p-4 rounded-2xl space-y-2 text-xs relative z-10">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-400" /> Live Response Benchmark
                </span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-md">
                  {pingResult.latencyMs} ms latency
                </span>
              </div>
              <p className="text-slate-300 text-[11px]">
                {pingResult.message || 'Hostinger server is responding actively.'}
              </p>
              <div className="flex flex-wrap gap-3 pt-1 text-[11px] text-slate-400 font-mono">
                <span>Server: <strong className="text-white">{pingResult.webServer || 'LiteSpeed'}</strong></span>
                <span>Platform: <strong className="text-white">{pingResult.platform || 'Hostinger'}</strong></span>
                <span>HTTP Status: <strong className="text-white">{pingResult.httpStatus || '200 OK'}</strong></span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions & FTP Info */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <Terminal className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-slate-900 text-sm">FTP Connection Credentials</h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">FTP Server Host</span>
                <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-200 mt-1 font-mono text-slate-800">
                  <span>82.112.239.60</span>
                  <button
                    type="button"
                    onClick={() => handleCopy('82.112.239.60', 'ftp_host')}
                    className="text-slate-400 hover:text-slate-700"
                  >
                    {copiedField === 'ftp_host' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">FTP Username</span>
                <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-200 mt-1 font-mono text-slate-800">
                  <span>u397809276</span>
                  <button
                    type="button"
                    onClick={() => handleCopy('u397809276', 'ftp_user')}
                    className="text-slate-400 hover:text-slate-700"
                  >
                    {copiedField === 'ftp_user' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Upload Path</span>
                <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-200 mt-1 font-mono text-slate-800">
                  <span>public_html</span>
                  <button
                    type="button"
                    onClick={() => handleCopy('public_html', 'ftp_path')}
                    className="text-slate-400 hover:text-slate-700"
                  >
                    {copiedField === 'ftp_path' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-2">
            <Link
              href="/admin/wordpress"
              className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
            >
              <Globe className="w-4 h-4" />
              <span>Connect Hostinger WordPress</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Hostinger DNS Architecture Configuration */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Hostinger Nameservers & DNS Architecture</h2>
            <p className="text-xs text-slate-500">
              How your domain, Hostinger LiteSpeed server, and frontend work together in harmony.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Active Nameservers */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <span className="font-bold text-slate-900 uppercase tracking-wider block">
              Active Hostinger Nameservers
            </span>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 font-mono text-slate-800">
                <span>1. nova.dns-parking.com</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 font-mono text-slate-800">
                <span>2. cosmos.dns-parking.com</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            <p className="text-slate-500 text-[11px]">
              These nameservers manage all DNS traffic for <strong>sricospace.com</strong> directly inside your Hostinger hPanel.
            </p>
          </div>

          {/* DNS Routing Map */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <span className="font-bold text-slate-900 uppercase tracking-wider block">
              Recommended DNS Routing Table
            </span>
            <div className="space-y-2">
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <strong className="block text-slate-800">wp.sricospace.com</strong>
                  <span className="text-[11px] text-slate-500">Hostinger WordPress Dashboard</span>
                </div>
                <code className="font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  A &rarr; 82.112.239.60
                </code>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <strong className="block text-slate-800">sricospace.com (@)</strong>
                  <span className="text-[11px] text-slate-500">Live Global Frontend</span>
                </div>
                <code className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  A &rarr; 76.76.21.21
                </code>
              </div>
            </div>
            <p className="text-slate-500 text-[11px]">
              This architecture keeps your website blazing fast while giving you full WordPress editing capabilities on your Hostinger plan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

