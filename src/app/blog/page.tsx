import Link from 'next/link';
import { getAllPosts, getAllCategories, getWebsiteSettings } from '@/lib/db';
import BlogCard from '@/components/BlogCard';
import AdUnit from '@/components/AdUnit';
import { BookOpen, Sparkles, ArrowRight, HelpCircle, ShieldCheck } from 'lucide-react';
import { PageSection } from '@/lib/types';
import { getPageSections } from '@/lib/page-layouts';

interface AllBlogsPageProps {
  searchParams: {
    category?: string;
    tag?: string;
    search?: string;
  };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function AllBlogsPage({ searchParams }: AllBlogsPageProps) {
  const settings = getWebsiteSettings();
  const categories = getAllCategories();
  const selectedCat = searchParams.category;
  const posts = getAllPosts({
    status: 'published',
    categorySlug: selectedCat,
    search: searchParams.search,
    limit: 30,
  });

  // Load visual builder layout (always synchronized with Builder studio)
  const activeSections = getPageSections('blog', settings).filter((sec: PageSection) => sec.enabled);

  const renderSection = (section: PageSection) => {
    switch (section.type) {
      case 'blog_header':
        return (
          <div key={section.id} className="bg-white rounded-3xl border border-slate-200/80 p-8 md:p-12 shadow-sm text-center max-w-4xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 text-brand-600 rounded-full text-xs font-bold uppercase tracking-wider mb-1">
              <BookOpen className="w-3.5 h-3.5" /> {section.badge || 'Srinoos Article Library'}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              {section.headline || 'All Guides, Reviews & Articles'}
            </h1>
            <p className="mt-2 text-slate-600 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
              {section.subheadline || 'Explore our complete archive of original research on AI tools, organic SEO growth, digital monetization, and software comparisons.'}
            </p>

            {/* Category Filter Pills */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
              <Link
                href="/blog"
                className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                  !selectedCat
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                All Topics ({posts.length})
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/blog?category=${cat.slug}`}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                    selectedCat === cat.slug
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        );

      case 'top_ad':
      case 'mid_ad':
        return (
          <div key={section.id}>
            <AdUnit placementId={section.placementId || 'homepage-between-sections'} />
          </div>
        );

      case 'blog_grid':
        return (
          <div key={section.id} className="space-y-6">
            {section.headline && (
              <div className="border-b border-slate-200 pb-3">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {section.headline}
                </h2>
                {section.subheadline && (
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">{section.subheadline}</p>
                )}
              </div>
            )}
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} variant="grid" />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                <p className="text-slate-500 text-base">No articles found matching this selection.</p>
                <Link href="/blog" className="mt-4 inline-block text-brand-600 font-bold hover:underline">
                  View All Posts
                </Link>
              </div>
            )}
          </div>
        );

      case 'cta_box':
        return (
          <div key={section.id} className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white border border-slate-800 shadow-xl text-center space-y-4">
            <span className="px-3 py-1 bg-brand-500/20 text-brand-300 border border-brand-400/30 rounded-full text-xs font-bold uppercase tracking-wider">
              {section.badge || 'Weekly Dispatch'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{section.headline}</h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">{section.subheadline}</p>
            {section.btn1_text && (
              <div className="pt-2">
                <Link
                  href={section.btn1_link || '/contact'}
                  className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow-md transition inline-block"
                >
                  {section.btn1_text} &rarr;
                </Link>
              </div>
            )}
          </div>
        );

      case 'custom_banner':
        return (
          <div key={section.id} className={`p-6 sm:p-10 rounded-3xl text-white bg-gradient-to-r ${section.background_gradient || 'from-brand-900 to-indigo-950'} shadow-lg border border-slate-800 space-y-3`}>
            {section.badge && (
              <span className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold uppercase tracking-wider inline-block">
                {section.badge}
              </span>
            )}
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{section.headline}</h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl">{section.subheadline}</p>
            {section.btn1_text && (
              <div className="pt-2">
                <Link
                  href={section.btn1_link || '/offers'}
                  className="px-5 py-2.5 bg-white text-slate-900 font-bold text-xs rounded-xl shadow-xs transition hover:bg-slate-100 inline-flex items-center gap-1.5"
                >
                  {section.btn1_text} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        );

      case 'footer_ad':
        return (
          <div key={section.id}>
            <AdUnit placementId={section.placementId || 'global-above-footer'} />
          </div>
        );

      case 'faq_accordion':
        return (
          <div key={section.id} className="p-6 sm:p-8 border border-slate-200/90 rounded-3xl bg-white shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-brand-600" />
              {section.headline || 'Frequently Asked Questions'}
            </h3>
            <p className="text-xs text-slate-500">{section.subheadline}</p>
          </div>
        );

      case 'custom_html':
        return (
          <div
            key={section.id}
            className="rounded-3xl overflow-hidden"
            dangerouslySetInnerHTML={{ __html: section.html_content || '' }}
          />
        );

      default:
        return null;
    }
  };

  if (activeSections && activeSections.length > 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {activeSections.map((sec) => renderSection(sec))}
      </div>
    );
  }

  // Fallback to default
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 md:p-12 shadow-sm text-center max-w-4xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 text-brand-600 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
          <BookOpen className="w-3.5 h-3.5" /> Srinoos Article Library
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          All Guides, Reviews &amp; Articles
        </h1>
        <p className="mt-3 text-slate-600 max-w-xl mx-auto text-sm sm:text-base">
          Explore our complete archive of original research on AI tools, organic SEO growth, digital monetization, and software comparisons.
        </p>

        {/* Category Filter Pills */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <Link
            href="/blog"
            className={`px-4 py-2 rounded-full text-xs font-bold transition ${
              !selectedCat
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            All Topics ({posts.length})
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/blog?category=${cat.slug}`}
              className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                selectedCat === cat.slug
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Top Banner Ad */}
      <AdUnit placementId="homepage-between-sections" />

      {/* Articles Grid */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} variant="grid" />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-500 text-base">No articles found matching this selection.</p>
          <Link href="/blog" className="mt-4 inline-block text-brand-600 font-bold hover:underline">
            View All Posts
          </Link>
        </div>
      )}

      {/* Footer Banner Ad */}
      <AdUnit placementId="global-above-footer" />
    </div>
  );
}
