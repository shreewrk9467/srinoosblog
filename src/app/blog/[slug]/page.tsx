import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getPostBySlug, getAllPosts, getWebsiteSettingsAsync, getAllAffiliates } from '@/lib/db';
import AdUnit from '@/components/AdUnit';
import BlogCard from '@/components/BlogCard';
import ShareButtons from '@/components/ShareButtons';
import AdminPostEditPill from '@/components/AdminPostEditPill';
import {
  Calendar,
  Clock,
  User,
  Share2,
  ChevronRight,
  Bookmark,
  CheckCircle2,
  HelpCircle,
  FolderOpen,
  Gift,
  ExternalLink,
  Tag,
} from 'lucide-react';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  const settings = await getWebsiteSettingsAsync();

  if (!post) {
    return {
      title: 'Article Not Found',
    };
  }

  const postUrl = `${settings.site_url}/blog/${post.slug}`;

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    keywords: post.tags ? post.tags.split(',').map((t) => t.trim()) : undefined,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      url: postUrl,
      type: 'article',
      publishedTime: post.published_at || post.created_at,
      modifiedTime: post.updated_at,
      authors: [post.author_name],
      images: [
        {
          url: post.featured_image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      images: [post.featured_image],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug);
  if (!post) {
    notFound();
  }

  const settings = await getWebsiteSettingsAsync();
  const topOffers = getAllAffiliates({ is_active: true, limit: 3 });
  const relatedPosts = getAllPosts({
    categoryId: post.category_id,
    status: 'published',
    limit: 4,
  }).filter((p) => p.id !== post.id).slice(0, 3);

  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recently';

  // Parse FAQs if present
  let faqs: Array<{ question: string; answer: string }> = [];
  try {
    if (post.faq_schema) {
      faqs = JSON.parse(post.faq_schema);
    }
  } catch {
    faqs = [];
  }

  // Schema.org Article Structured Data
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: [post.featured_image],
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Person',
      name: post.author_name,
    },
    publisher: {
      '@type': 'Organization',
      name: settings.site_name,
      logo: {
        '@type': 'ImageObject',
        url: `${settings.site_url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${settings.site_url}/blog/${post.slug}`,
    },
  };

  // Breadcrumbs Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: settings.site_url,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: post.category_name || 'Blog',
        item: `${settings.site_url}/category/${post.category_slug}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `${settings.site_url}/blog/${post.slug}`,
      },
    ],
  };

  // FAQ Schema if available
  const faqSchema = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-brand-600 transition">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/blog" className="hover:text-brand-600 transition">Blog</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          {post.category_slug && (
            <>
              <Link href={`/category/${post.category_slug}`} className="hover:text-brand-600 transition text-brand-600 font-semibold">
                {post.category_name}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </>
          )}
          <span className="truncate max-w-[200px] sm:max-w-md text-slate-700 font-medium">{post.title}</span>
        </nav>

        {/* Discreet In-Page Admin Controls Bar (Owner Only) */}
        <AdminPostEditPill postId={post.id} variant="bar" />

        {/* Global Article Top Ad Placement */}
        <div className="mb-6">
          <AdUnit placementId="article-before-content" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Article Body (8 Cols) */}
          <article className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm">
            {/* Header info */}
            <header className="space-y-4 pb-8 border-b border-slate-100">
              <div className="flex flex-wrap items-center gap-3">
                {post.category_slug && (
                  <Link
                    href={`/category/${post.category_slug}`}
                    className="px-3.5 py-1 text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-full transition"
                  >
                    {post.category_name}
                  </Link>
                )}
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {formattedDate}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {post.reading_time_minutes} min read
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tight">
                {post.title}
              </h1>

              <p className="text-lg text-slate-600 font-normal leading-relaxed">
                {post.excerpt}
              </p>

              {/* Author & Share bar */}
              <div className="flex items-center justify-between pt-4 text-xs text-slate-500 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-sm shadow-xs">
                    {post.author_name.charAt(0)}
                  </div>
                  <div>
                    <span className="block font-bold text-slate-900 text-sm">{post.author_name}</span>
                    <span className="text-[11px] text-slate-500">Verified Editorial Writer</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <ShareButtons title={post.title} />
                </div>
              </div>
            </header>

            {/* Featured Image */}
            <div className="my-8 rounded-2xl overflow-hidden aspect-[16/9] bg-slate-100 shadow-inner">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>

            {/* Ad Placement: After Introduction */}
            <AdUnit placementId="article-after-intro" />

            {/* Editorial Content */}
            <div
              className="prose-srinoos mt-8"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Ad Placement: Mid Content */}
            <div className="my-8">
              <AdUnit placementId="article-mid-content" />
            </div>

            {/* FAQ Section if present */}
            {faqs.length > 0 && (
              <section className="my-10 bg-slate-50 rounded-2xl border border-slate-200 p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <HelpCircle className="w-6 h-6 text-brand-600 flex-shrink-0" />
                  <h3 className="text-xl font-black text-slate-900 tracking-tight m-0">
                    Frequently Asked Questions
                  </h3>
                </div>
                <div className="space-y-4">
                  {faqs.map((faq, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-2xs">
                      <h4 className="text-base font-bold text-slate-900 mb-2 flex items-start gap-2">
                        <span className="text-brand-600 font-extrabold">Q:</span> {faq.question}
                      </h4>
                      <p className="text-sm text-slate-600 leading-relaxed pl-6">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Ad Placement: Before Conclusion */}
            <AdUnit placementId="article-before-conclusion" />

            {/* Tags footer */}
            {post.tags && (
              <div className="mt-8 pt-6 border-t border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Tagged In:
                </span>
                <div className="flex flex-wrap gap-2">
                  {post.tags.split(',').map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-md transition"
                    >
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Ad Placement: After Conclusion */}
            <div className="mt-8">
              <AdUnit placementId="article-after-conclusion" />
            </div>

            {/* Author Profile / About Me Box (No Photo, Clean Typography) */}
            <div className="mt-10 p-6 sm:p-8 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-md space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-black text-white">Ketanboina Venkat Shrinivas</h4>
                  <span className="text-[11px] px-2.5 py-0.5 bg-brand-500/20 text-brand-300 font-bold rounded-full border border-brand-500/30">
                    Founder & Lead Architect
                  </span>
                </div>
                <span className="text-xs text-amber-400 font-bold">
                  Designed & Developed by Srinoos
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Full-stack software engineer based in Pune, India. Founder and developer behind Srinoos. Author of deep, actionable blueprints on Artificial Intelligence, modern web engineering, organic SEO, and digital monetization.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-semibold">
                <Link href="/about" className="text-brand-400 hover:text-brand-300 underline transition">
                  About Me &rarr;
                </Link>
                <span className="text-slate-600">•</span>
                <a href="https://quiet-pony-c4f26b.netlify.app" target="_blank" rel="noopener noreferrer" className="text-slate-200 hover:text-white underline transition">
                  Live Portfolio
                </a>
                <span className="text-slate-600">•</span>
                <Link href="/contact" className="text-slate-300 hover:text-white underline transition">
                  Contact Founder
                </Link>
              </div>
            </div>

            {/* Affiliate & Editorial Disclosure Note */}
            <div className="mt-6 p-5 bg-blue-50/60 rounded-xl border border-blue-200/60 text-xs text-slate-600 leading-relaxed">
              <strong className="text-slate-900">Srinoos Editorial Disclosure:</strong> Our articles may contain affiliate partner links. If you make a purchase through these links, we may earn a referral commission at zero extra cost to you. We strictly review and verify recommended services. Read our full{' '}
              <Link href="/affiliate-disclosure" className="text-brand-600 underline font-medium">
                Affiliate Disclosure
              </Link>{' '}
              and{' '}
              <Link href="/ad-policy" className="text-brand-600 underline font-medium">
                Advertisement Policy
              </Link>.
            </div>
          </article>

          {/* Desktop 4-Col Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            <AdUnit placementId="sidebar-top" />

            {/* Related Articles in Same Category */}
            {relatedPosts.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-brand-600" /> Related in {post.category_name}
                </h4>
                <div className="space-y-4">
                  {relatedPosts.map((rel) => (
                    <BlogCard key={rel.id} post={rel} variant="horizontal" />
                  ))}
                </div>
              </div>
            )}

            {/* Top Partner Offers & Free Trials */}
            {topOffers.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5 text-amber-500" /> Verified Partner Offers
                  </span>
                  <Link href="/offers" className="text-[11px] font-bold text-brand-600 hover:underline">
                    All Deals &rarr;
                  </Link>
                </div>
                <div className="space-y-3">
                  {topOffers.map((off) => (
                    <div key={off.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-slate-500">{off.company_name || 'Partner'}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                          {off.commission_model || 'CPA'}
                        </span>
                      </div>
                      <h5 className="font-bold text-xs text-slate-900 leading-snug line-clamp-1">{off.title}</h5>
                      {off.payout_amount && (
                        <span className="text-[11px] font-bold text-emerald-700 block">{off.payout_amount}</span>
                      )}
                      <a
                        href={`/go/${off.tracking_slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-1.5 px-3 bg-brand-600 hover:bg-brand-500 text-white font-bold text-[11px] rounded-lg shadow-2xs transition flex items-center justify-center gap-1 mt-1"
                      >
                        <span>{off.cta_button_text || 'Claim Offer'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sticky Sidebar Skyscraper Ad */}
            <div className="sticky top-24 space-y-6">
              <AdUnit placementId="sidebar-sticky" />
            </div>
          </aside>
        </div>

        {/* Ad Placement: Near Related Articles */}
        <div className="mt-12">
          <AdUnit placementId="article-near-related" />
        </div>
      </div>
    </>
  );
}

