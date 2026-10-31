import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getCategoryBySlug, getAllPosts, getAllCategories } from '@/lib/db';
import BlogCard from '@/components/BlogCard';
import AdUnit from '@/components/AdUnit';
import { ChevronRight, Folder } from 'lucide-react';

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

  const posts = getAllPosts({
    categoryId: category.id,
    status: 'published',
    limit: 30,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-brand-600 transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link href="/categories" className="hover:text-brand-600 transition">Categories</Link>
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
    </div>
  );
}

