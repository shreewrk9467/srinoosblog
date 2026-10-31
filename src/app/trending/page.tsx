import Link from 'next/link';
import { getAllPosts } from '@/lib/db';
import BlogCard from '@/components/BlogCard';
import AdUnit from '@/components/AdUnit';
import { TrendingUp, Flame } from 'lucide-react';

export const revalidate = 60;

export default function TrendingPage() {
  const trendingPosts = getAllPosts({
    status: 'published',
    isTrending: true,
    limit: 20,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-brand-500/10 rounded-3xl border border-amber-200/80 p-8 sm:p-12 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-white rounded-full text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
          <Flame className="w-3.5 h-3.5" /> High Engagement
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          Trending Articles & Viral Insights
        </h1>
        <p className="mt-3 text-slate-600 text-sm sm:text-base">
          The most shared and actively discussed publications on Srinoos today across tech, marketing, and monetization.
        </p>
      </div>

      <AdUnit placementId="homepage-top" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {trendingPosts.map((post) => (
          <BlogCard key={post.id} post={post} variant="grid" />
        ))}
      </div>

      <AdUnit placementId="global-above-footer" />
    </div>
  );
}

