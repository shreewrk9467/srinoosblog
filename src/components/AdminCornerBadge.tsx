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
      .then((data: any) => {
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

  // Detect which public page the admin is currently browsing to deep-link the Visual Builder
  const getPageKey = (path: string): string => {
    if (path === '/' || !path) return 'home';
    if (path.startsWith('/blog')) return 'blog';
    if (path.startsWith('/trending')) return 'trending';
    if (path.startsWith('/about')) return 'about';
    if (path.startsWith('/contact')) return 'contact';
    if (path.startsWith('/category')) return 'category';
    if (path.startsWith('/offers') || path.startsWith('/deals')) return 'offers';
    return 'home';
  };

  const pageKey = getPageKey(pathname);
  const builderHref = `/admin/builder?page=${pageKey}&return=${encodeURIComponent(pathname)}`;

  // Rendered ONLY for the verified logged-in owner.
  // Subtle, non-highlighted, discreet corner menu.
  return (
    <aside
      aria-label="Owner Quick Menu"
      className="fixed bottom-3 right-3 z-50 opacity-40 hover:opacity-100 transition-opacity duration-300"
    >
      <div className="bg-slate-950/85 hover:bg-slate-950 text-slate-300 hover:text-white backdrop-blur-md border border-slate-800 rounded-full p-1.5 shadow-md flex items-center gap-1.5 transition">
        <Link
          href={builderHref}
          className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-brand-300 rounded-full transition flex items-center gap-1"
          title={`Edit this page in Live Visual Builder (${pageKey})`}
        >
          <MousePointerClick className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold uppercase tracking-wider pr-1 hidden group-hover:inline">
            Edit Page
          </span>
        </Link>
        <Link
          href="/admin"
          className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full transition"
          title="Admin Dashboard"
        >
          <Settings className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
}
