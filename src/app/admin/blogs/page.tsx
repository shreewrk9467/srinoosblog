'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  ExternalLink,
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { BlogPost, Category } from '@/lib/types';

export default function AdminBlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const postsPerPage = 10;
  const [loading, setLoading] = useState(true);
  const [dailyStats, setDailyStats] = useState<{ published_count: number; target: number; date: string }>({
    published_count: 0,
    target: 20,
    date: new Date().toISOString().slice(0, 10),
  });

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const url = filterStatus !== 'all' ? `/api/blogs?status=${filterStatus}` : '/api/blogs';
      const [resBlogs, resCats, resAnalytics] = await Promise.all([
        fetch(url).then((r) => r.json()),
        fetch('/api/categories').then((r) => r.json()),
        fetch('/api/analytics').then((r) => r.json()).catch(() => null),
      ]);
      setPosts(resBlogs.posts || []);
      setCategories(resCats.categories || []);
      if (resAnalytics?.dailyPublishing) {
        setDailyStats(resAnalytics.dailyPublishing);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [filterStatus]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"? It will disappear from the live website immediately.`)) return;

    try {
      const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert('Could not delete post');
      }
    } catch {
      alert('Error deleting post');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setPosts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
        );
      } else {
        alert('Could not update status');
      }
    } catch {
      alert('Error toggling status');
    }
  };

  const filteredPosts = posts.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
  });

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / postsPerPage));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * postsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  const progressPercent = Math.min(Math.round((dailyStats.published_count / dailyStats.target) * 100), 100);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block mb-1">
            WordPress-Style Editorial CMS
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Blog Articles & Publishing Control
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publish, schedule, edit drafts, and configure SEO metadata across all articles. Instant updates on live website.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blogs/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Create New Blog
          </Link>
        </div>
      </div>

      {/* Daily 20-Blog Target Tracker */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-3 py-0.5 bg-brand-500/30 border border-brand-400/40 text-brand-300 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Daily Target: {dailyStats.target} Articles
              </span>
              <span className="text-xs text-slate-400">Date: {dailyStats.date}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {dailyStats.published_count} of {dailyStats.target} Articles Published Today
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/blogs/new"
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" /> AI Draft Assistant
            </Link>
            <div className="text-right pl-3 border-l border-slate-800">
              <span className="text-2xl font-black text-brand-400">{progressPercent}%</span>
              <span className="block text-[10px] text-slate-400">Complete</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div
              className="bg-gradient-to-r from-brand-500 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max(progressPercent, 4)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Articles ({posts.length})</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
            <option value="review">Review</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles by title or slug..."
            className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-brand-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Blogs Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200/60">
              <tr>
                <th className="px-6 py-4">Title & Slug</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Publishing Status</th>
                <th className="px-6 py-4">Created / Published</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    Loading blog posts from persistent database...
                  </td>
                </tr>
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No articles found matching this filter.
                  </td>
                </tr>
              ) : (
                paginatedPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-6 py-4 max-w-sm">
                      <span className="font-bold text-slate-900 text-sm block truncate">{post.title}</span>
                      <span className="text-slate-400 font-mono text-[11px] block truncate">
                        slug: /{post.slug}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-slate-100 rounded-md text-slate-700 font-medium text-[11px]">
                        {post.category_name || 'General'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(post.id, post.status)}
                        title="Click to toggle Published / Draft status instantly"
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider transition hover:scale-105 cursor-pointer ${
                          post.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : post.status === 'scheduled'
                            ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                            : post.status === 'review'
                            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${post.status === 'published' ? 'bg-emerald-600' : 'bg-slate-500'}`} />
                        {post.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(post.published_at || post.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="px-2.5 py-1.5 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-md font-medium text-[11px] inline-flex items-center gap-1 cursor-pointer"
                      >
                        <ExternalLink className="w-3 h-3" /> View
                      </Link>
                      <Link
                        href={`/admin/blogs/${post.id}`}
                        className="px-2.5 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-md font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" /> Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        className="px-2 py-1.5 text-rose-600 hover:bg-rose-50 rounded-md text-[11px] cursor-pointer"
                        title="Delete article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {filteredPosts.length > 0 && (
          <div className="p-4 sm:p-5 bg-slate-50/70 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-slate-500 font-medium">
              Showing <strong className="text-slate-900">{startIndex + 1}</strong> to{' '}
              <strong className="text-slate-900">{Math.min(startIndex + postsPerPage, filteredPosts.length)}</strong> of{' '}
              <strong className="text-slate-900">{filteredPosts.length}</strong> articles
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={validCurrentPage === 1}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer transition shadow-2xs"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </button>

              <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-mono font-bold text-slate-800 shadow-2xs">
                Page {validCurrentPage} of {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={validCurrentPage >= totalPages}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer transition shadow-2xs"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
