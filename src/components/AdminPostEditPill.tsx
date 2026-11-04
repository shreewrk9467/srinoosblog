'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Edit3, ExternalLink } from 'lucide-react';

interface AdminPostEditPillProps {
  postId: string;
  variant?: 'card' | 'bar';
}

export default function AdminPostEditPill({ postId, variant = 'card' }: AdminPostEditPillProps) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: any) => {
        if (isMounted && data?.authenticated) {
          setIsAdmin(true);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isAdmin) {
    return null;
  }

  if (variant === 'bar') {
    return (
      <div className="mb-6 p-3 bg-slate-950 text-white rounded-2xl border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-slate-300">Admin Mode:</span>
          <span className="text-slate-400">You are viewing this article with owner privileges</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/blogs/${postId}`}
            className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl transition flex items-center gap-1.5 shadow-2xs"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Article Heading &amp; Body</span>
          </Link>
          <Link
            href="/admin/builder?page=blog"
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition flex items-center gap-1.5 border border-slate-700"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Visual Builder</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={`/admin/blogs/${postId}`}
      onClick={(e) => e.stopPropagation()}
      className="absolute top-3 right-3 z-30 px-2.5 py-1 bg-slate-950/90 hover:bg-slate-950 text-white hover:text-brand-300 text-[11px] font-bold rounded-full shadow-lg border border-slate-800 backdrop-blur-xs flex items-center gap-1.5 transition opacity-70 hover:opacity-100"
      title="Edit this article title, excerpt, and content in admin"
    >
      <Edit3 className="w-3 h-3 text-brand-400" />
      <span>Edit</span>
    </Link>
  );
}

