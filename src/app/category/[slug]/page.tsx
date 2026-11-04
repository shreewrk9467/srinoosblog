import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getCategoryBySlug, getAllPosts, getWebsiteSettings } from '@/lib/db';
import BlogCard from '@/components/BlogCard';
import AdUnit from '@/components/AdUnit';
import { ChevronRight, Folder, HelpCircle, Sparkles, ArrowRight } from 'lucide-react';
import { PageSection } from '@/lib/types';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = getCategoryBySlug(params.slug);
  if (!category) {
    return { title: 'Category Not Found' };
  }
  return {
    title: category.meta_title || `${category.name} Guides & Articles | Srinoos`,
    description: category.meta_description || category.description,
  };
}

export default function CategoryArchivePage({ params }: CategoryPageProps) {
  const category = getCategoryBySlug(params.slug);
  if (!category) {
    notFound();
  }

  const settings = getWebsiteSettings();
  const posts = getAllPosts({
    categoryId: category.id,
    status: 'published',
    limit: 30,
  });

  // Load visual builder layout if configured
  let activeSections: PageSection[] | null = null;
  if (settings.page_layouts_json) {
    try {
      const parsed = JSON.parse(settings.page_layouts_json);
      if (parsed && Array.isArray(parsed.category) && parsed.category.length > 0) {
        activeSections = parsed.category.filter((sec: PageSection) => sec.enabled);
      }
    } catch { }
  }

  const renderSection = (section: PageSection) => {
    switch (section.type) {
      case 'category_header':
        return (
          <div key={section.id} className="space-y-4">
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500">
              <Link href="/" className="hover:text-brand-600 transition">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <Link href="/blog" className="hover:text-brand-600 transition">Articles</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-800 font-semibold">{category.name}</span>
            </nav>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-sm">
              <div className="max-w-3xl">
                <span className="px-3 py-1 bg-brand-50 text-brand-600 text-xs font-bold uppercase rounded-full tracking-wider mb-3 inline-block">
                  {section.badge || 'Category Archive'}
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                  {category.name}
                </h1>
                <p className="mt-3 text-slate-600 text-base leading-relaxed">
                  {category.description || section.subheadline || 'In-depth tutorials and verified recommendations categorized for modern digital builders.'}
                </p>
                <div className="mt-4 text-xs font-semibold text-slate-400">
                  Total Published Guides: <span className="text-brand-600 font-bold">{posts.length}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'top_ad':
      case 'mid_ad':
      case 'footer_ad':
        return (
          <div key={section.id}>
            <AdUnit placementId={section.placementId || 'category-between-cards'} />
          </div>
        );

      case 'category_grid':
        return (
          <div key={section.id} className="space-y-6">
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} variant="grid" />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
                <p className="text-slate-500 text-base">New guides in {category.name} are currently in editorial review.</p>
                <Link href="/blog" className="mt-4 inline-block text-brand-600 font-bold hover:underline">
                  Browse Other Articles
                </Link>
              </div>
            )}
          </div>
        );

      case 'cta_box':
        return (
          <div
            key={section.id}
            className={`rounded-3xl bg-gradient-to-r ${section.background_gradient || 'from-slate-900 via-brand-950 to-slate-900'
              } text-white p-8 sm:p-12 text-center shadow-lg border border-slate-800 space-y-4`}
          >
            {section.badge && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-500/20 text-brand-300 rounded-full text-xs font-bold uppercase tracking-wider">
                {section.badge}
              </span>
            )}
            <h2 className="text-2xl sm:text-3xl font-black text-white">{section.headline || `Stay Updated on ${category.name}`}</h2>
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

      case 'custom_banner':
        return (
          <div
            key={section.id}
            className={`rounded-3xl bg-gradient-to-r ${section.background_gradient || 'from-brand-600 via-indigo-600 to-purple-600'
              } text-white p-8 sm:p-12 shadow-xl border border-white/10 relative overflow-hidden`}
          >
            <div className="max-w-2xl relative z-10 space-y-3">
              {section.badge && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
                  <Sparkles className="w-3.5 h-3.5" /> {section.badge}
                </span>
              )}
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {section.headline || section.title}
              </h2>
              {section.subheadline && (
                <p className="text-slate-100 text-sm sm:text-base leading-relaxed">{section.subheadline}</p>
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

      case 'faq_accordion':
        return (
          <div key={section.id} className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-2xs space-y-4">
            <div className="text-center max-w-xl mx-auto mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block mb-1">
                Frequently Asked Questions
              </span>
              <h2 className="text-2xl font-black text-slate-900">{section.headline || `About ${category.name}`}</h2>
              {section.subheadline && <p className="text-xs text-slate-500 mt-1">{section.subheadline}</p>}
            </div>
            <div className="space-y-3 max-w-2xl mx-auto text-left">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-brand-600" /> What topics are covered in {category.name}?
                </h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  {category.description || 'Comprehensive guides, code walk-throughs, and expert comparisons curated by Srinoos.'}
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
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-brand-600 transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/blog" className="hover:text-brand-600 transition">Articles</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-800 font-semibold">{category.name}</span>
          </nav>

          {/* Category Hero Banner */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-sm">
            <div className="max-w-3xl">
              <span className="px-3 py-1 bg-brand-50 text-brand-600 text-xs font-bold uppercase rounded-full tracking-wider mb-3 inline-block">
                Category Archive
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                {category.name}
              </h1>
              <p className="mt-3 text-slate-600 text-base leading-relaxed">
                {category.description}
              </p>
              <div className="mt-4 text-xs font-semibold text-slate-400">
                Total Published Guides: <span className="text-brand-600 font-bold">{posts.length}</span>
              </div>
            </div>
          </div>

          {/* Category In-Feed Ad */}
          <AdUnit placementId="category-between-cards" />

          {/* Posts Grid */}
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} variant="grid" />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <p className="text-slate-500 text-base">New guides in {category.name} are currently in editorial review.</p>
              <Link href="/blog" className="mt-4 inline-block text-brand-600 font-bold hover:underline">
                Browse Other Articles
              </Link>
            </div>
          )}

          {/* Footer Banner Ad */}
          <AdUnit placementId="global-above-footer" />
        </>
      )}
    </div>
  );
}
