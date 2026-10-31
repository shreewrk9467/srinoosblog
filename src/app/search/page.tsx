import Link from 'next/link';
import { getAllPosts } from '@/lib/db';
import BlogCard from '@/components/BlogCard';
import AdUnit from '@/components/AdUnit';
import { Search, ArrowRight } from 'lucide-react';

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';
  const posts = query
    ? getAllPosts({
        status: 'published',
        search: query,
        limit: 30,
      })
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-sm max-w-3xl mx-auto text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 text-brand-600 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
          <Search className="w-3.5 h-3.5" /> Search Results
        </span>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
          {query ? `Results for “${query}”` : 'Search Srinoos'}
        </h1>
        <p className="mt-2 text-slate-500 text-sm">
          {query ? `Found ${posts.length} articles matching your search query` : 'Type a topic, framework, or question to search.'}
        </p>

        {/* Search form in page */}
        <form action="/search" method="GET" className="mt-6 flex items-center gap-2 max-w-lg mx-auto">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search blogs, AI, SEO, affiliate guides..."
            className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 focus:bg-white"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold rounded-xl shadow-sm transition"
          >
            Search
          </button>
        </form>
      </div>

      <AdUnit placementId="homepage-between-sections" />

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} variant="grid" />
          ))}
        </div>
      ) : query ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-600 text-base">No results found for “{query}”. Try different keywords.</p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <Link href="/blog" className="text-brand-600 font-bold hover:underline">
              Browse All Articles &rarr;
            </Link>
          </div>
        </div>
      ) : null}

      <AdUnit placementId="global-above-footer" />
    </div>
  );
}

