import Link from 'next/link';
import {
  getAllPosts,
  getDailyPublishingProgress,
  getAllAdPlacements,
  getAllAffiliates,
  getAnalyticsSummary,
} from '@/lib/db';
import {
  Sparkles,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingUp,
  Tag,
  ArrowRight,
  Plus,
  Eye,
  AlertCircle,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function AdminDashboardPage() {
  const dailyProgress = getDailyPublishingProgress();
  const allPosts = getAllPosts({ limit: 10 });
  const placements = getAllAdPlacements();
  const affiliates = getAllAffiliates();
  const analytics = getAnalyticsSummary();

  const activeAdsCount = placements.filter((p) => p.is_active).length;
  const progressPercent = Math.min(Math.round((dailyProgress.published_count / dailyProgress.target) * 100), 100);

  return (
    <div className="space-y-8">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block mb-1">
            Publishing & Monetization Command Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Srinoos Admin Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time control over blog production, Google AdSense units, and affiliate tracking.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/blogs/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
          >
            <Sparkles className="w-4 h-4" /> AI Draft Assistant
          </Link>
          <Link
            href="/admin/ads"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition"
          >
            <Tag className="w-4 h-4" /> Manage Ads
          </Link>
        </div>
      </div>

      {/* Daily 20-Blog Publishing Progress Tracker (Section 4 Requirement) */}
      <div className="bg-gradient-to-br from-brand-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-brand-500/30 border border-brand-400/40 text-brand-300 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Daily Target: 20 Articles
              </span>
              <span className="text-xs text-slate-400">Date: {dailyProgress.date}</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight">
              {dailyProgress.published_count} of {dailyProgress.target} Articles Published Today
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              High-velocity publishing system designed to scale organic Google traffic while maintaining editorial quality.
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <span className="text-4xl font-black text-brand-400">{progressPercent}%</span>
            <span className="block text-xs text-slate-400">Target Completion</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="w-full bg-slate-800 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div
              className="bg-gradient-to-r from-brand-500 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max(progressPercent, 4)}%` }}
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 text-center">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
              <span className="block text-2xl font-black text-emerald-400">{dailyProgress.published_count}</span>
              <span className="text-xs text-slate-300">Published</span>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
              <span className="block text-2xl font-black text-blue-400">{dailyProgress.scheduled_count}</span>
              <span className="text-xs text-slate-300">Scheduled Queue</span>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
              <span className="block text-2xl font-black text-amber-400">{dailyProgress.review_count}</span>
              <span className="text-xs text-slate-300">In Editorial Review</span>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
              <span className="block text-2xl font-black text-slate-300">{dailyProgress.draft_count}</span>
              <span className="text-xs text-slate-300">Drafts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Articles</span>
            <BookOpen className="w-5 h-5 text-brand-600" />
          </div>
          <span className="text-3xl font-black text-slate-900">{analytics.totalPosts}</span>
          <span className="block text-xs text-emerald-600 font-semibold mt-1">Live in Database</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Ad Slots</span>
            <Tag className="w-5 h-5 text-indigo-600" />
          </div>
          <span className="text-3xl font-black text-slate-900">{activeAdsCount}</span>
          <span className="block text-xs text-slate-500 mt-1">of {placements.length} Total Placements</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Affiliate Clicks</span>
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="text-3xl font-black text-slate-900">{analytics.totalClicks}</span>
          <span className="block text-xs text-emerald-600 font-semibold mt-1">Tracked via /go/[slug]</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Est. Impressions</span>
            <TrendingUp className="w-5 h-5 text-amber-600" />
          </div>
          <span className="text-3xl font-black text-slate-900">{analytics.estimatedAdImpressions.toLocaleString()}</span>
          <span className="block text-xs text-slate-500 mt-1">Based on content volume</span>
        </div>
      </div>

      {/* Recent Blog Publications Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Recent Publications & Drafts</h3>
            <p className="text-xs text-slate-500">Manage article status, edit content, and inspect URLs</p>
          </div>
          <Link
            href="/admin/blogs"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            View All ({allPosts.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200/60">
              <tr>
                <th className="px-6 py-3.5">Title & Slug</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Reading Time</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {allPosts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-6 py-4 max-w-md">
                    <span className="font-bold text-slate-900 text-sm block truncate">{post.title}</span>
                    <span className="text-slate-400 font-mono text-[11px] block truncate">/{post.slug}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-slate-100 rounded-md text-slate-700 font-medium text-[11px]">
                      {post.category_name || 'General'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        post.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : post.status === 'scheduled'
                          ? 'bg-blue-100 text-blue-800'
                          : post.status === 'review'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {post.reading_time_minutes} min
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="px-2.5 py-1 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-md font-medium text-[11px]"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/blogs/${post.id}`}
                      className="px-2.5 py-1 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-md font-bold text-[11px]"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

