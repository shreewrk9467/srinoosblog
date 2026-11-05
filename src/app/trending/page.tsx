import Link from 'next/link';
import { getAllPosts, getAllPostsAsync, getWebsiteSettingsAsync } from '@/lib/db';
import BlogCard from '@/components/BlogCard';
import AdUnit from '@/components/AdUnit';
import { TrendingUp, Flame, ArrowRight, HelpCircle, Sparkles } from 'lucide-react';
import { PageSection } from '@/lib/types';
import { getPageSections } from '@/lib/page-layouts';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TrendingPage() {
  const settings = await getWebsiteSettingsAsync();
  const trendingPosts = (await getAllPostsAsync({
    status: 'published',
    limit: 20,
  })).filter((p) => p.is_trending);

  // Load visual builder layout (always synchronized with Builder studio)
  const activeSections = getPageSections('trending', settings).filter((sec: PageSection) => sec.enabled);

  const renderSection = (section: PageSection) => {
    switch (section.type) {
      case 'trending_header':
        return (
          <div
            key={section.id}
            className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-brand-500/10 rounded-3xl border border-amber-200/80 p-8 sm:p-12 text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-white rounded-full text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
              <Flame className="w-3.5 h-3.5" /> {section.badge || 'High Engagement • Viral Insights'}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              {section.headline || 'Trending Articles & Viral Insights'}
            </h1>
            <p className="mt-3 text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              {section.subheadline || 'The most shared and actively discussed publications on Srinoos today across tech, marketing, and monetization.'}
            </p>
          </div>
        );

      case 'top_ad':
      case 'mid_ad':
      case 'footer_ad':
        return (
          <div key={section.id}>
            <AdUnit placementId={section.placementId || 'homepage-top'} />
          </div>
        );

      case 'trending_grid':
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
            {trendingPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {trendingPosts.map((post) => (
                  <BlogCard key={post.id} post={post} variant="grid" />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
                <Flame className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900">Articles Are Being Indexed</h3>
                <p className="text-slate-500 text-sm mt-1">Trending metrics refresh automatically every 24 hours.</p>
                <Link href="/blog" className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white font-bold rounded-xl text-xs hover:bg-brand-500 transition">
                  Browse All Articles &rarr;
                </Link>
              </div>
            )}
          </div>
        );

      case 'custom_banner':
        return (
          <div
            key={section.id}
            className={`rounded-3xl bg-gradient-to-r ${section.background_gradient || 'from-amber-600 via-orange-700 to-slate-950'} text-white p-8 sm:p-12 shadow-xl border border-white/10 relative overflow-hidden`}
          >
            <div className="max-w-2xl relative z-10 space-y-3">
              {section.badge && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
                  <Sparkles className="w-3.5 h-3.5" /> {section.badge}
                </span>
              )}
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                {section.headline || section.title}
              </h2>
              {section.subheadline && (
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                  {section.subheadline}
                </p>
              )}
              {section.btn1_text && (
                <div className="pt-2">
                  <Link
                    href={section.btn1_link || '/blog'}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-bold rounded-xl text-xs sm:text-sm shadow-md hover:bg-slate-100 transition"
                  >
                    {section.btn1_text} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        );

      case 'cta_box':
        return (
          <div
            key={section.id}
            className={`rounded-3xl bg-gradient-to-r ${section.background_gradient || 'from-slate-900 via-brand-950 to-slate-900'} text-white p-8 sm:p-12 text-center shadow-lg border border-slate-800 space-y-4`}
          >
            {section.badge && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-500/20 text-brand-300 rounded-full text-xs font-bold uppercase tracking-wider">
                {section.badge}
              </span>
            )}
            <h2 className="text-2xl sm:text-3xl font-black text-white">{section.headline || 'Stay Ahead of Emerging Trends'}</h2>
            {section.subheadline && (
              <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">{section.subheadline}</p>
            )}
            {section.btn1_text && (
              <div className="pt-2">
                <Link
                  href={section.btn1_link || '/contact'}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-md"
                >
                  {section.btn1_text} &rarr;
                </Link>
              </div>
            )}
          </div>
        );

      case 'faq_accordion':
        return (
          <div key={section.id} className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-2xs space-y-4">
            <div className="text-center max-w-xl mx-auto mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-1">
                Frequently Asked Questions
              </span>
              <h2 className="text-2xl font-black text-slate-900">{section.headline || 'How Trending Ranks'}</h2>
              {section.subheadline && <p className="text-xs text-slate-500 mt-1">{section.subheadline}</p>}
            </div>
            <div className="space-y-3 max-w-2xl mx-auto text-left">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-500" /> What makes an article trend?
                </h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Publications earn trending status based on direct organic reader engagement, bookmarking, session duration, and algorithmic discovery across tech and marketing niches.
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-500" /> How often is the trending feed updated?
                </h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  The feed updates in real-time as reader traffic and verified affiliate conversion queries flow into the Sricospace platform.
                </p>
              </div>
            </div>
          </div>
        );

      case 'custom_html':
        return (section.html_content || section.html_code) ? (
          <div key={section.id} dangerouslySetInnerHTML={{ __html: section.html_content || section.html_code || '' }} />
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {activeSections ? (
        activeSections.map((section) => renderSection(section))
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
