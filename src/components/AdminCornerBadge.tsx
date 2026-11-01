'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Lock } from 'lucide-react';

export default function AdminCornerBadge() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Do not show inside the admin area itself
  if (pathname.startsWith('/admin')) {
    return null;
  }

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated) {
          setIsLoggedIn(true);
        }
      })
      .catch(() => {});
  }, [pathname]);

  return (
    <div className="fixed bottom-4 right-4 z-50 group">
      <Link
        href="/admin"
        aria-label="Admin Portal"
        title={isLoggedIn ? 'Admin Active • Open Dashboard' : 'Admin Security Access'}
        className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-900/70 hover:bg-slate-950 backdrop-blur-md text-slate-400 hover:text-white border border-slate-700/60 hover:border-brand-500 shadow-md transition-all duration-300 opacity-40 hover:opacity-100 hover:scale-110"
      >
        {isLoggedIn ? (
          <>
            <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse" />
          </>
        ) : (
          <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 group-hover:text-brand-400 transition" />
        )}
      </Link>

      {/* Subtle hover tooltip */}
      <div className="absolute bottom-full right-0 mb-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <span className="bg-slate-900/95 text-white text-[10px] font-semibold tracking-wider uppercase px-2 py-1 rounded-md shadow-lg border border-slate-700 whitespace-nowrap block">
          {isLoggedIn ? 'Admin: Open Dashboard' : 'Admin Access'}
        </span>
      </div>
    </div>
  );
}
