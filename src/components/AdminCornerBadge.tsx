'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { MousePointerClick, Settings } from 'lucide-react';

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

  // CRITICAL PRIVACY & SECURITY RULE:
  // If not authenticated, or if currently inside the admin panel, render NOTHING.
  // Public visitors see absolutely zero admin indicators, zero lock icons, and zero badges.
  if (!isLoggedIn || isAdminRoute) {
    return null;
  }

  // Rendered ONLY for the verified logged-in owner.
  // Subtle, non-highlighted, discreet corner menu.
  return (
    <aside
      aria-label="Owner Quick Menu"
      className="fixed bottom-3 right-3 z-50 opacity-40 hover:opacity-100 transition-opacity duration-300"
    >
      <div className="bg-slate-950/80 hover:bg-slate-950 text-slate-300 hover:text-white backdrop-blur-md border border-slate-800 rounded-full p-1.5 shadow-md flex items-center gap-1.5 transition">
        <Link
          href="/admin/builder"
          className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-brand-300 rounded-full transition"
          title="Live Visual Builder (Only visible to you)"
        >
          <MousePointerClick className="w-3.5 h-3.5" />
        </Link>
        <Link
          href="/admin"
          className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full transition"
          title="Admin Dashboard (Only visible to you)"
        >
          <Settings className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
}
