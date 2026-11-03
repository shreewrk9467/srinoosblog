'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Shield, Lock, MousePointerClick, Settings } from 'lucide-react';

export default function AdminCornerBadge() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isAdminRoute = pathname ? pathname.startsWith('/admin') : false;

  useEffect(() => {
    if (isAdminRoute) return;

    let isMounted = true;
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.authenticated) {
          setIsLoggedIn(true);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [pathname, isAdminRoute]);

  // Do not show inside the admin area itself (rendered after hooks to obey React rules)
  if (isAdminRoute) {
    return null;
  }

  if (isLoggedIn) {
    return (
      <aside aria-label="Admin Quick Access" className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-2">
        <div className="bg-slate-950/90 text-white backdrop-blur-md border border-slate-700/80 shadow-2xl rounded-2xl p-2 flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold text-slate-300">Admin Mode</span>
          </div>

          <Link
            href="/admin/builder"
            className="px-2.5 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            title="Open Live Drag-and-Drop Visual Builder"
          >
            <MousePointerClick className="w-3.5 h-3.5" />
            <span>Visual Builder</span>
          </Link>

          <Link
            href="/admin"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
            title="Go to Admin Dashboard"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      </aside>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 group">
      <a
        href="/admin/login"
        aria-label="Admin Portal"
        title="Admin Security Access"
        className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-900/80 hover:bg-slate-950 backdrop-blur-md text-slate-400 hover:text-white border border-slate-700/60 hover:border-brand-500 shadow-md transition-all duration-300 opacity-40 hover:opacity-100 hover:scale-110 cursor-pointer"
      >
        <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 group-hover:text-brand-400 transition" />
      </a>

      {/* Subtle hover tooltip */}
      <div className="absolute bottom-full right-0 mb-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <span className="bg-slate-900/95 text-white text-[10px] font-semibold tracking-wider uppercase px-2 py-1 rounded-md shadow-lg border border-slate-700 whitespace-nowrap block">
          Admin Access
        </span>
      </div>
    </div>
  );
}
