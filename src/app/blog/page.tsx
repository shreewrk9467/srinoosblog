import Link from 'next/link';
import { getAllPosts, getAllCategories } from '@/lib/db';
import BlogCard from '@/components/BlogCard';
import AdUnit from '@/components/AdUnit';
import { BookOpen, Filter } from 'lucide-react';

interface AllBlogsPageProps {
  searchParams: {
    category?: string;
    tag?: string;
    search?: string;
  };
}

export const revalidate = 60;

export default function AllBlogsPage({ searchParams }: AllBlogsPageProps) {
  const categories = getAllCategories();
  const selectedCat = searchParams.category;
  const posts = getAllPosts({
    status: 'published',
    categorySlug: selectedCat,
    search: searchParams.search,
    limit: 30,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 md:p-12 shadow-sm text-center max-w-4xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 text-brand-600 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
          <BookOpen className="w-3.5 h-3.5" /> Srinoos Article Library
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          All Guides, Reviews & Articles
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

