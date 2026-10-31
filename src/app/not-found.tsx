import Link from 'next/link';
import { Search, Home, BookOpen, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
        <AlertTriangle className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          404 – Page Not Found
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          The page or article you are looking for has been moved, renamed, or is currently under editorial revision.
        </p>
      </div>

      {/* Search Input */}
      <form action="/search" method="GET" className="max-w-md mx-auto flex items-center gap-2">
        <input
          type="text"
          name="q"
          placeholder="Search Srinoos articles..."
          className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500"
        />
        <button
          type="submit"
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl transition"
        >
          Search
        </button>
      </form>

      {/* Quick Action Links */}
      <div className="flex items-center justify-center gap-4 pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition"
        >
          <Home className="w-4 h-4" /> Go to Homepage
        </Link>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition"
        >
          <BookOpen className="w-4 h-4" /> Explore All Blogs
        </Link>
      </div>
    </div>
  );
}

