import Link from 'next/link';
import { getAllPosts, getAllCategories, getWebsiteSettings } from '@/lib/db';
import BlogCard from '@/components/BlogCard';
import AdUnit from '@/components/AdUnit';
import {
  TrendingUp,
  Sparkles,
  ArrowRight,
  Layers,
  Cpu,
  ShieldCheck,
  CheckCircle,
  Search,
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function HomePage() {
  const settings = getWebsiteSettings();
  const allPosts = getAllPosts({ status: 'published', limit: 20 });
  const featuredPost = allPosts.find((p) => p.is_featured) || allPosts[0];
  const trendingPosts = allPosts.filter((p) => p.is_trending && p.id !== featuredPost?.id).slice(0, 4);
  const techPosts = allPosts.filter((p) => p.category_slug === 'technology-and-ai' && p.id !== featuredPost?.id).slice(0, 3);
  const businessPosts = allPosts.filter((p) => (p.category_slug === 'online-business' || p.category_slug === 'affiliate-marketing') && p.id !== featuredPost?.id).slice(0, 3);
  const latestPosts = allPosts.filter((p) => p.id !== featuredPost?.id).slice(0, 6);
  const categories = getAllCategories();

  return (
    <div className="pb-16 space-y-10">
      {/* 1. Global Header / Top Hero Advertisement Placement */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <AdUnit placementId="homepage-top" />
      </div>

      {/* 2. Hero Mission Banner (Directly Editable from Admin Customizer) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-500/20 border border-brand-400/30 text-brand-300 rounded-full text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              {settings.hero_lead_badge || '⚡ Technology Collective • Daily Dispatch'}
            </span>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight font-display">
              {settings.hero_headline || 'Artificial Intelligence, Quantum Computing & Digital Growth Insights'}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              {settings.hero_subheadline || settings.site_description || 'Deep technical analysis, high-speed full-stack development, and actionable online monetization playbooks designed for visionary digital builders.'}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/blog"
                className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl transition shadow-sm flex items-center gap-1.5"
              >
                Read All Articles <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/trending"
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-1.5"
              >
                <TrendingUp className="w-3.5 h-3.5 text-amber-400" /> Trending Topics
              </Link>
              <Link
                href="/about"
                className="px-4 py-2.5 text-slate-400 hover:text-white font-semibold text-xs transition"
              >
                About {settings.site_name || 'Srinoos'} &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Hero Featured Article Section */}
      {featuredPost && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Lead Feature
            </span>
            <Link
              href="/blog"
              className="text-xs font-semibold text-slate-500 hover:text-brand-600 flex items-center gap-1"
            >
              Browse All ({allPosts.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <BlogCard post={featuredPost} variant="featured" />
        </section>
      )}

      {/* 3. Trending Articles Grid */}
      {trendingPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-500/10 text-amber-600 rounded-lg">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Trending on Srinoos
              </h2>
            </div>
            <Link
              href="/trending"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              See All Trending <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingPosts.map((post) => (
              <BlogCard key={post.id} post={post} variant="grid" />
            ))}
          </div>
        </section>
      )}

      {/* 4. Advertisement Placement Between Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdUnit placementId="homepage-between-sections" />
      </div>

      {/* 5. Main Content Columns: Latest Stories + Sticky Sidebar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main 8-Column Articles Feed */}
          <div className="lg:col-span-8 space-y-10">
            {/* Tech & AI Highlights */}
            {techPosts.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-5 border-b border-slate-200 pb-3">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-brand-600" /> Technology & Artificial Intelligence
                  </h3>
                  <Link
                    href="/category/technology-and-ai"
                    className="text-xs font-semibold text-brand-600 hover:underline"
                  >
                    View Topic &rarr;
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {techPosts.map((post) => (
                    <BlogCard key={post.id} post={post} variant="grid" />
                  ))}
                </div>
              </div>
            )}

            {/* In-Feed Native Advertisement Placement */}
            <AdUnit placementId="homepage-feed-native" />

            {/* Online Business & Monetization */}
            {businessPosts.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-5 border-b border-slate-200 pb-3">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-emerald-600" /> Online Business & Affiliate Strategies
                  </h3>
                  <Link
                    href="/category/online-business"
                    className="text-xs font-semibold text-brand-600 hover:underline"
                  >
                    View Topic &rarr;
                  </Link>
                </div>
                <div className="space-y-4">
                  {businessPosts.map((post) => (
                    <BlogCard key={post.id} post={post} variant="horizontal" />
                  ))}
                </div>
              </div>
            )}

            {/* Latest Articles Feed */}
            <div>
              <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-3">
                <h3 className="text-xl font-black text-slate-900">
                  Recent Publications
                </h3>
                <Link
                  href="/blog"
                  className="text-xs font-semibold text-brand-600 hover:underline"
                >
                  All Articles &rarr;
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {latestPosts.map((post) => (
                  <BlogCard key={post.id} post={post} variant="grid" />
                ))}
              </div>
            </div>
          </div>

          {/* 4-Column Sticky Desktop Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Sidebar Top Ad Box */}
            <AdUnit placementId="sidebar-top" />

            {/* Popular Topics Pill Box */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span>Explore Topics</span>
                <span className="text-xs font-medium text-slate-500">{categories.length} categories</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className="px-3 py-1.5 bg-slate-50 hover:bg-brand-50 hover:text-brand-600 border border-slate-200/70 text-slate-700 text-xs font-semibold rounded-lg transition"
                  >
                    {cat.name} {cat.post_count ? `(${cat.post_count})` : ''}
                  </Link>
                ))}
              </div>
            </div>

            {/* Sticky Sidebar Skyscraper Ad */}
            <div className="sticky top-24 space-y-6">
              <AdUnit placementId="sidebar-sticky" />

              {/* Srinoos Trust & Standards Card */}
              <div className="bg-gradient-to-br from-brand-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck className="w-5 h-5 text-brand-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-300">
                    Srinoos Editorial Standards
                  </span>
                </div>
                <h5 className="font-bold text-base mb-2">Verified, Original Insights</h5>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Every guide published on Srinoos is researched for search accuracy and reader value. We maintain full transparency across all partner and affiliate links.
                </p>
                <Link
                  href="/about"
                  className="mt-4 inline-block text-xs font-semibold text-brand-300 hover:text-brand-200 underline"
                >
                  Learn About Our Process &rarr;
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* 6. Above Footer Horizontal Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <AdUnit placementId="global-above-footer" />
      </div>
    </div>
  );
}

