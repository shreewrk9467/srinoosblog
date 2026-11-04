'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MousePointerClick, ShieldCheck, ArrowRight, Settings } from 'lucide-react';

export default function AdminFloatingBar() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (data && data.authenticated && data.user) {
          setIsAdmin(true);
        }
      })
      .catch(() => {
        setIsAdmin(false);
      });
  }, []);

  if (!isAdmin) return null;

  return (
    <aside aria-label="Admin Quick Access" className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-5">
      <div className="bg-slate-950/95 text-white backdrop-blur-md border border-slate-700/80 shadow-2xl rounded-2xl p-2.5 flex items-center gap-3">
        <div className="flex items-center gap-2 pl-2 pr-1 border-r border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-bold text-slate-300">Admin Live</span>
        </div>

        <Link
          href="/admin/builder"
          className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
        >
          <MousePointerClick className="w-3.5 h-3.5" />
          <span>Visual Builder</span>
        </Link>

        <Link
          href="/admin"
          className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
          title="Go to Admin Panel"
        >
          <Settings className="w-4 h-4" />
        </Link>
      </div>
    </aside>
  );
}

