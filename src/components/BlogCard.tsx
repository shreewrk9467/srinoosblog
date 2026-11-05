import Link from 'next/link';
import { Clock, Calendar, ArrowRight, User } from 'lucide-react';
import { BlogPost } from '@/lib/types';
import AdminPostEditPill from './AdminPostEditPill';

interface BlogCardProps {
  post: BlogPost;
  variant?: 'grid' | 'horizontal' | 'compact' | 'featured';
  className?: string;
}

export default function BlogCard({ post, variant = 'grid', className = '' }: BlogCardProps) {
  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recently';

  if (variant === 'featured') {
    return (
      <article
        className={`group relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 p-6 md:p-8 ${className}`}
      >
        <AdminPostEditPill postId={post.id} />
        <div className="lg:col-span-7 overflow-hidden rounded-2xl bg-slate-100 aspect-[16/10] relative">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="eager"
            decoding="async"
          />
          {post.is_trending && (
            <span className="absolute top-4 left-4 bg-amber-500 text-slate-950 font-bold text-xs uppercase px-3 py-1 rounded-full shadow-md">
              Trending
            </span>
          )}
        </div>
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              {post.category_slug && (
                <Link
                  href={`/category/${post.category_slug}`}
                  className="px-3 py-1 text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-full transition"
                >
                  {post.category_name || 'Technology'}
                </Link>
              )}
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {post.reading_time_minutes} min read
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 group-hover:text-brand-600 transition leading-tight">
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 line-clamp-3 leading-relaxed">
              {post.excerpt}
            </p>
          </div>
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1 font-medium text-slate-700">
              <User className="w-3.5 h-3.5 text-slate-400" /> {post.author_name}
            </span>
            <div className="flex items-center gap-3">
              <span>{formattedDate}</span>
              <Link
                href={`/blog/${post.slug}`}
                aria-label={`Read full article: ${post.title}`}
                className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-brand-600 group-hover:text-white flex items-center justify-center transition"
              >
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'horizontal') {
    return (
      <article
        className={`group relative flex flex-col sm:flex-row gap-5 items-center bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs hover:shadow-md transition ${className}`}
      >
        <AdminPostEditPill postId={post.id} />
        <div className="w-full sm:w-48 h-36 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 relative">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="flex-1 flex flex-col justify-between w-full">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              {post.category_slug && (
                <Link
                  href={`/category/${post.category_slug}`}
                  className="text-[11px] font-bold text-brand-700 uppercase tracking-wider"
                >
                  {post.category_name}
                </Link>
              )}
              <span className="text-[11px] text-slate-500">&bull; {post.reading_time_minutes} min</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition leading-snug line-clamp-2">
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h3>
            <p className="text-xs text-slate-600 line-clamp-2 mt-1">
              {post.excerpt}
            </p>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span>{formattedDate}</span>
            <Link
              href={`/blog/${post.slug}`}
              className="text-brand-600 font-semibold hover:underline flex items-center gap-1"
            >
              Read <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  // Default Grid Card
  return (
    <article
      className={`group relative flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xl transition-all duration-300 overflow-hidden ${className}`}
    >
      <AdminPostEditPill postId={post.id} />
      <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100 relative">
        <img
          src={post.featured_image}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          decoding="async"
        />
        {post.category_slug && (
          <Link
            href={`/category/${post.category_slug}`}
            className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-brand-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm hover:bg-white transition"
          >
            {post.category_name || 'Blog'}
          </Link>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {formattedDate}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {post.reading_time_minutes} min read
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition leading-snug line-clamp-2">
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="font-medium text-slate-700 truncate max-w-[150px]">
            {post.author_name}
          </span>
          <Link
            href={`/blog/${post.slug}`}
            className="text-brand-600 font-bold hover:text-brand-700 flex items-center gap-1 group/btn"
          >
            Read More
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}

