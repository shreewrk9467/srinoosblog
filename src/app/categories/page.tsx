import Link from 'next/link';
import { getAllCategories } from '@/lib/db';
import { Folder, ArrowRight, BookOpen, Layers } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function CategoriesPage() {
  const categories = getAllCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="inline-block px-3 py-1 bg-brand-50 text-brand-600 rounded-full text-xs font-bold uppercase tracking-wider">
          Topic Clusters
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Browse by Category
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Targeted categories organized by topic cluster to help you find the exact answers and guides you need.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="group bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs hover:shadow-lg hover:border-brand-300 transition duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition transform">
                <Layers className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 group-hover:text-brand-600 transition">
                {cat.name}
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                {cat.description || 'In-depth insights, tutorials, and practical guides.'}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
              <span className="text-brand-600">{cat.post_count || 0} Articles</span>
              <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform text-slate-700">
                Explore <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

