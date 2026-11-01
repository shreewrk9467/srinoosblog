'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  DollarSign,
  Tag,
  Search,
  BarChart3,
  Settings,
  ExternalLink,
  LogOut,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  Palette,
  Globe,
  Server,
  Database,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // If on login page, don't show admin chrome
  if (pathname === '/admin/login') {
    return <div className="min-h-screen bg-slate-100">{children}</div>;
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Blog Articles', href: '/admin/blogs', icon: FileText },
    { name: 'New Blog (AI Assisted)', href: '/admin/blogs/new', icon: Sparkles },
    { name: 'WordPress Integration', href: '/admin/wordpress', icon: Globe },
    { name: 'Ad Management', href: '/admin/ads', icon: Tag },
    { name: 'Site Content & Elements', href: '/admin/content', icon: Palette },
    { name: 'Affiliate Marketing', href: '/admin/affiliates', icon: DollarSign },
    { name: 'SEO & Search Console', href: '/admin/seo', icon: Search },
    { name: 'Traffic & Earnings', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Hostinger Server & FTP', href: '/admin/hosting', icon: Server },
    { name: 'Supabase Database', href: '/admin/supabase', icon: Database },
    { name: 'Website Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col justify-between flex-shrink-0 border-r border-slate-800">
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-950 flex-shrink-0 shadow-lg p-0.5">
                <img
                  src="/images/srinoos-s-icon.jpg"
                  alt="Srinoos Logo"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div>
                <span className="font-black text-white text-lg tracking-tight block group-hover:text-brand-400 transition">Srinoos</span>
                <span className="text-[10px] text-brand-400 font-bold uppercase tracking-wider block">Technology Collective</span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" /> View Live Site
            </span>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-emerald-400 font-mono">200 OK</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-950/40 transition text-left"
          >
            <LogOut className="w-3.5 h-3.5" /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
}

