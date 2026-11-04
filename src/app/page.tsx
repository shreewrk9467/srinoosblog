import Link from 'next/link';
import { getAllPosts, getAllCategories, getWebsiteSettings, getAllAffiliates } from '@/lib/db';
import BlogCard from '@/components/BlogCard';
import AdUnit from '@/components/AdUnit';
import { PageSection } from '@/lib/types';
import { getPageSections } from '@/lib/page-layouts';
import {
  TrendingUp,
  Sparkles,
  ArrowRight,
  Layers,
  Cpu,
  ShieldCheck,
  Search,
  ExternalLink,
  Gift,
  HelpCircle,
  FileCode,
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function HomePage() {
  const settings = getWebsiteSettings();
  const allPosts = getAllPosts({ status: 'published', limit: 20 });
  const featuredAffiliates = getAllAffiliates({ is_featured: true, is_active: true, limit: 4 });
  const featuredPost = allPosts.find((p) => p.is_featured) || allPosts[0];
  const trendingPosts = allPosts.filter((p) => p.is_trending && p.id !== featuredPost?.id).slice(0, 4);
  const techPosts = allPosts.filter((p) => p.category_slug === 'technology-and-ai' && p.id !== featuredPost?.id).slice(0, 3);
  const businessPosts = allPosts.filter((p) => (p.category_slug === 'online-business' || p.category_slug === 'affiliate-marketing') && p.id !== featuredPost?.id).slice(0, 3);
  const latestPosts = allPosts.filter((p) => p.id !== featuredPost?.id).slice(0, 6);
  const categories = getAllCategories();

  // Parse custom visual builder layout order (always synchronized with Builder studio)
  const activeSections = getPageSections('home', settings).filter((sec: PageSection) => sec.enabled);

  // Helper renderer for each section type
  const renderSection = (section: PageSection) => {
    switch (section.type) {
      case 'announcement':
        return (
          <div
            key={section.id}
            className={`w-full py-2.5 px-4 text-center text-xs font-bold text-white bg-gradient-to-r ${
              section.background_gradient || 'from-brand-600 to-indigo-700'
            } shadow-xs`}
          >
            <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
              <span>{section.headline || '⚡ Welcome to Sricospace — Discover Verified Tech, AI & Affiliate Insights (Made by Srinoos)'}</span>
              {section.btn1_text && (
                <Link
                  href={section.btn1_link || '/offers'}
                  className="underline underline-offset-2 hover:opacity-90 transition font-black ml-1"
                >
                  {section.btn1_text} &rarr;
                </Link>
              )}
            </div>
          </div>
        );

      case 'top_ad':
        return (
          <div key={section.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            <AdUnit placementId={section.placementId || 'homepage-top'} />
          </div>
        );

      case 'hero':
        return (
          <section key={section.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`bg-gradient-to-r ${section.background_gradient || 'from-slate-900 via-indigo-950 to-slate-900'} text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 max-w-3xl space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-500/20 border border-brand-400/30 text-brand-300 rounded-full text-xs font-bold tracking-wider uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                  {section.badge || settings.hero_lead_badge || '⚡ Technology Collective • Daily Dispatch'}
                </span>
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight font-display">
                  {section.headline || settings.hero_headline || 'Artificial Intelligence, Quantum Computing & Digital Growth Insights'}
                </h1>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                  {section.subheadline || settings.hero_subheadline || settings.site_description || 'Deep technical analysis, high-speed full-stack development, and actionable online monetization playbooks designed for visionary digital builders.'}
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href={section.btn1_link || '/blog'}
                    className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl transition shadow-sm flex items-center gap-1.5"
                  >
                    {section.btn1_text || 'Read All Articles'} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href={section.btn2_link || '/trending'}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-1.5"
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-amber-400" /> {section.btn2_text || 'Trending Topics'}
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
        );

      case 'deals':
        if (featuredAffiliates.length === 0) return null;
        return (
          <section key={section.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
                  <Gift className="w-4 h-4" />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                    {section.headline || 'Featured Deals & Free Registration Offers'}
                  </h2>
                  <span className="text-xs text-slate-500">
                    {section.subheadline || 'Curated partner promotions with verified eligibility'}
                  </span>
                </div>
              </div>
              <Link
                href="/offers"
                className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
              >
                <span>Explore All Offers ({featuredAffiliates.length}+)</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredAffiliates.map((aff) => (
                <div
                  key={aff.id}
                  className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md uppercase">
                        {aff.category || 'Deal'}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                        {aff.commission_model || 'CPA'}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-brand-600 transition leading-snug line-clamp-2 mt-2.5">
                      {aff.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                      {aff.description}
                    </p>

                    {aff.payout_amount && (
                      <div className="mt-3 py-1.5 px-2 bg-slate-50 border border-slate-100 rounded-lg text-[11px] flex items-center justify-between">
                        <span className="text-slate-400 font-medium">Value:</span>
                        <strong className="text-emerald-700 font-bold">{aff.payout_amount}</strong>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 mt-3">
                    <a
                      href={`/go/${aff.tracking_slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                    >
                      <span>{aff.cta_button_text || 'Claim Offer'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'lead_feature':
        if (!featuredPost) return null;
        const displayFeaturedPost = {
          ...featuredPost,
          title: section.headline?.trim() ? section.headline : featuredPost.title,
          excerpt: section.subheadline?.trim() ? section.subheadline : featuredPost.excerpt,
        };
        return (
          <section key={section.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> {section.badge || 'Lead Feature'}
              </span>
              <Link
                href="/blog"
                className="text-xs font-semibold text-slate-500 hover:text-brand-600 flex items-center gap-1"
              >
                Browse All ({allPosts.length}) <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <BlogCard post={displayFeaturedPost} variant="featured" />
          </section>
        );

      case 'trending':
        if (trendingPosts.length === 0) return null;
        return (
          <section key={section.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-500/10 text-amber-600 rounded-lg">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {section.headline || 'Trending on Srinoos'}
                  </h2>
                  {section.subheadline && (
                    <p className="text-xs text-slate-500 mt-0.5">{section.subheadline}</p>
                  )}
                </div>
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
        );

      case 'mid_ad':
        return (
          <div key={section.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AdUnit placementId={section.placementId || 'homepage-between-sections'} />
          </div>
        );

      case 'main_feed':
        return (
          <section key={section.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Main 8-Column Articles Feed */}
              <div className="lg:col-span-8 space-y-10">
                {/* Tech & AI Highlights */}
                {techPosts.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-5 border-b border-slate-200 pb-3">
                      <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                        <Cpu className="w-5 h-5 text-brand-600" /> Technology &amp; Artificial Intelligence
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
                        <Layers className="w-5 h-5 text-emerald-600" /> Online Business &amp; Affiliate Strategies
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
                    <div>
                      <h3 className="text-xl font-black text-slate-900">
                        {section.headline || 'Recent Publications'}
                      </h3>
                      {section.subheadline && (
                        <p className="text-xs text-slate-500 mt-1">{section.subheadline}</p>
                      )}
                    </div>
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
        );

      case 'footer_ad':
        return (
          <div key={section.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <AdUnit placementId={section.placementId || 'global-above-footer'} />
          </div>
        );

      case 'custom_banner':
        return (
          <section key={section.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`p-6 sm:p-10 rounded-3xl text-white bg-gradient-to-r ${section.background_gradient || 'from-brand-900 via-indigo-950 to-slate-900'} shadow-lg border border-slate-800 space-y-3`}>
              {section.badge && (
                <span className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold uppercase tracking-wider inline-block">
                  {section.badge}
                </span>
              )}
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">{section.headline}</h2>
              <p className="text-xs sm:text-base text-slate-200 leading-relaxed max-w-2xl">{section.subheadline}</p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {section.btn1_text && (
                  <Link
                    href={section.btn1_link || '/offers'}
                    className="px-5 py-2.5 bg-white text-slate-900 font-bold text-xs rounded-xl shadow-xs transition hover:bg-slate-100 flex items-center gap-1.5"
                  >
                    {section.btn1_text} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
                {section.btn2_text && (
                  <Link
                    href={section.btn2_link || '/blog'}
                    className="px-5 py-2.5 bg-white/10 text-white font-bold text-xs rounded-xl border border-white/20 transition hover:bg-white/20"
                  >
                    {section.btn2_text}
                  </Link>
                )}
              </div>
            </div>
          </section>
        );

      case 'cta_box':
        return (
          <section key={section.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-slate-900 to-brand-950 text-white border border-slate-800 shadow-xl text-center space-y-4">
              <span className="px-3 py-1 bg-brand-500/20 text-brand-300 border border-brand-400/30 rounded-full text-xs font-bold uppercase tracking-wider">
                {section.badge || 'Newsletter & Updates'}
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
          </section>
        );

      case 'faq_accordion':
        return (
          <section key={section.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-6 sm:p-8 border border-slate-200/90 rounded-3xl bg-white shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-brand-600" />
                {section.headline || 'Frequently Asked Questions'}
              </h3>
              {section.subheadline && <p className="text-xs text-slate-500">{section.subheadline}</p>}
              <div className="divide-y divide-slate-100 text-xs pt-2">
                <div className="py-3">
                  <strong className="text-slate-900 text-sm block">How do Sricospace partner links work?</strong>
                  <span className="text-slate-600 text-xs mt-1 block">
                    Our links route through secure redirect endpoints to ensure accurate tracking and verified discount redemption.
                  </span>
                </div>
                <div className="py-3">
                  <strong className="text-slate-900 text-sm block">Are recommendations tested before publishing?</strong>
                  <span className="text-slate-600 text-xs mt-1 block">
                    Yes. All services, hosting setups, and financial tools are benchmarked for reliability and reader value.
                  </span>
                </div>
              </div>
            </div>
          </section>
        );

      case 'testimonial_bar':
        return (
          <section key={section.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 rounded-3xl bg-slate-900 text-white text-center space-y-3 shadow-md">
              <ShieldCheck className="w-8 h-8 text-brand-400 mx-auto" />
              <h3 className="font-bold text-lg text-white">{section.headline || 'Trusted by Digital Builders Worldwide'}</h3>
              <p className="text-xs text-slate-400 max-w-lg mx-auto">{section.subheadline}</p>
            </div>
          </section>
        );

      case 'custom_html':
        return (
          <section key={section.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className="rounded-3xl overflow-hidden"
              dangerouslySetInnerHTML={{ __html: section.html_content || '' }}
            />
          </section>
        );

      default:
        return null;
    }
  };

  // If custom sections order is configured, render dynamically in order
  if (activeSections && activeSections.length > 0) {
    return (
      <div className="pb-16 space-y-10">
        {activeSections.map((sec) => renderSection(sec))}
      </div>
    );
  }

  // Fallback to default layout if builder has not been customized yet
  return (
    <div className="pb-16 space-y-10">
      {/* 1. Global Header / Top Hero Advertisement Placement */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <AdUnit placementId="homepage-top" />
      </div>

      {/* 2. Hero Mission Banner */}
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

      {/* 2.5 Featured Affiliate Offers & Free Trials Showcase */}
      {featuredAffiliates.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
                <Gift className="w-4 h-4" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Featured Deals &amp; Free Registration Offers
                </h2>
                <span className="text-xs text-slate-500">
                  Curated partner promotions with verified eligibility
                </span>
              </div>
            </div>
            <Link
              href="/offers"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
            >
              <span>Explore All Offers ({featuredAffiliates.length}+)</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredAffiliates.map((aff) => (
              <div
                key={aff.id}
                className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md uppercase">
                      {aff.category || 'Deal'}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                      {aff.commission_model || 'CPA'}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-brand-600 transition leading-snug line-clamp-2 mt-2.5">
                    {aff.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                    {aff.description}
                  </p>

                  {aff.payout_amount && (
                    <div className="mt-3 py-1.5 px-2 bg-slate-50 border border-slate-100 rounded-lg text-[11px] flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Value:</span>
                      <strong className="text-emerald-700 font-bold">{aff.payout_amount}</strong>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 mt-3">
                  <a
                    href={`/go/${aff.tracking_slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                  >
                    <span>{aff.cta_button_text || 'Claim Offer'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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
                    <Cpu className="w-5 h-5 text-brand-600" /> Technology &amp; Artificial Intelligence
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
                    <Layers className="w-5 h-5 text-emerald-600" /> Online Business &amp; Affiliate Strategies
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
