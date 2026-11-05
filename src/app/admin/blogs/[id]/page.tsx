'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Save,
  ArrowLeft,
  Trash2,
  Calendar,
  HelpCircle,
  Plus,
  Eye,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { Category, BlogPost } from '@/lib/types';

export default function EditBlogPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [aiFormatting, setAiFormatting] = useState(false);
  const [formatSuccessMessage, setFormatSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    category_id: '',
    tags: '',
    status: 'draft',
    is_featured: false,
    is_trending: false,
    reading_time_minutes: 5,
    meta_title: '',
    meta_description: '',
    focus_keyword: '',
    scheduled_at: '',
  });

  const [faqs, setFaqs] = useState<Array<{ question: string; answer: string }>>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then((r) => r.json()),
      fetch(`/api/blogs/${params.id}`).then((r) => r.json()),
    ])
      .then(([catData, blogData]: [any, any]) => {
        setCategories(catData.categories || []);
        if (blogData.post) {
          setFormData(blogData.post);
          if (blogData.post.faq_schema) {
            try {
              setFaqs(JSON.parse(blogData.post.faq_schema));
            } catch {
              setFaqs([]);
            }
          }
        }
      })
      .finally(() => setFetching(false));
  }, [params.id]);

  const handleSave = async (statusOverride?: string) => {
    setLoading(true);
    const statusToUse = statusOverride || formData.status;

    try {
      const payload = {
        ...formData,
        status: statusToUse,
        faq_schema: JSON.stringify(faqs),
      };

      const res = await fetch(`/api/blogs/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Update failed');
      alert('Post updated successfully!');
      router.push('/admin/blogs');
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Error updating post');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      const res = await fetch(`/api/blogs/${params.id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Post deleted');
        router.push('/admin/blogs');
        router.refresh();
      }
    } catch (e) {
      alert('Failed to delete');
    }
  };

  const handleAiAutoFormat = async () => {
    if (!formData.content || !formData.content.trim()) {
      alert('Please enter or paste some article text to format.');
      return;
    }
    setAiFormatting(true);
    setFormatSuccessMessage(null);
    try {
      const res = await fetch('/api/ai-format', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: formData.content }),
      });
      const data = await res.json();
      if (res.ok && data.formattedContent) {
        setFormData((prev) => ({ ...prev, content: data.formattedContent }));
        const s = data.stats || {};
        setFormatSuccessMessage(
          `✨ AI Formatted: ${s.headingsOrganized || 0} headings organized, ${s.keyPointsBolded || 0} key points bolded, ${s.listsCreated || 0} lists converted, ${s.calloutsAdded || 0} callouts styled!`
        );
      } else {
        throw new Error(data.error || 'Formatting failed');
      }
    } catch (err: any) {
      alert(err.message || 'Error formatting article');
    } finally {
      setAiFormatting(false);
    }
  };

  if (fetching) {
    return <div className="p-8 text-center text-slate-500">Loading article...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blogs"
            className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Edit Blog Article</h1>
            <p className="text-xs text-slate-500">ID: {params.id}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/admin/builder?page=article&postId=${params.id}`}
            className="px-3.5 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
            title="Open in AI-Powered Live Visual Builder"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Visual Builder</span>
          </Link>
          {formData.slug && (
            <Link
              href={`/blog/${formData.slug}`}
              target="_blank"
              className="px-3.5 py-2 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" /> Preview Live
            </Link>
          )}
          <button
            type="button"
            onClick={handleDelete}
            className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition"
            title="Delete post"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={loading}
            className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Update Article'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor Main Form (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Article Title *
              </label>
              <input
                type="text"
                required
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full text-lg sm:text-xl font-bold bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                URL Slug *
              </label>
              <div className="flex items-center">
                <span className="bg-slate-100 border border-r-0 border-slate-200 text-slate-500 text-xs px-3 py-2.5 rounded-l-xl font-mono">
                  srinoos.com/blog/
                </span>
                <input
                  type="text"
                  required
                  value={formData.slug || ''}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-r-xl px-3 py-2.5 text-xs font-mono focus:outline-none focus:border-brand-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Excerpt
              </label>
              <textarea
                rows={3}
                value={formData.excerpt || ''}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-brand-500 focus:bg-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Content (HTML) *
                </label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={handleAiAutoFormat}
                    disabled={aiFormatting || !formData.content}
                    className="px-3 py-1 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-2xs transition disabled:opacity-50 cursor-pointer"
                    title="Intelligently bolds key points, organizes headings, creates lists & formats callouts"
                  >
                    {aiFormatting ? (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
                    )}
                    <span>{aiFormatting ? 'Formatting...' : '⚡ AI Auto-Format'}</span>
                  </button>
                  <Link
                    href={`/admin/builder?page=article&postId=${params.id}`}
                    target="_blank"
                    className="px-2 py-0.5 bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                    title="Open Live Visual Builder"
                  >
                    <span>Visual Builder</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, content: (prev.content || '') + '\n<h2>Section Title</h2>\n<p>Add your detailed explanation here.</p>\n' }))}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold cursor-pointer"
                  >
                    + H2
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, content: (prev.content || '') + '\n<h3>Key Subheading</h3>\n<p>Elaborate on this specific point.</p>\n' }))}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold cursor-pointer"
                  >
                    + H3
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, content: (prev.content || '') + '\n<ul>\n  <li><strong>Point One:</strong> In-depth detail</li>\n  <li><strong>Point Two:</strong> Verifiable action</li>\n</ul>\n' }))}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold cursor-pointer"
                  >
                    + List
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, content: (prev.content || '') + '\n<blockquote>\n  &ldquo;Actionable advice that provides exceptional reader value.&rdquo; &mdash; Srinoos Insights\n</blockquote>\n' }))}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold cursor-pointer"
                  >
                    + Quote
                  </button>
                </div>
              </div>
              <textarea
                rows={16}
                required
                value={formData.content || ''}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs sm:text-sm font-mono leading-relaxed focus:outline-none focus:border-brand-500 focus:bg-white"
              />
              {formatSuccessMessage && (
                <div className="mt-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center justify-between gap-2 animate-in fade-in">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{formatSuccessMessage}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormatSuccessMessage(null)}
                    className="text-emerald-600 hover:text-emerald-800 font-bold"
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* FAQs */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-brand-600" /> FAQ Schema Generator
              </h3>
              <button
                type="button"
                onClick={() => setFaqs([...faqs, { question: '', answer: '' }])}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add FAQ
              </button>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">FAQ #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => setFaqs(faqs.filter((_, i) => i !== idx))}
                      className="text-rose-500 hover:text-rose-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Question..."
                    value={faq.question}
                    onChange={(e) => {
                      const updated = [...faqs];
                      updated[idx].question = e.target.value;
                      setFaqs(updated);
                    }}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs"
                  />
                  <textarea
                    rows={2}
                    placeholder="Answer..."
                    value={faq.answer}
                    onChange={(e) => {
                      const updated = [...faqs];
                      updated[idx].answer = e.target.value;
                      setFaqs(updated);
                    }}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Controls (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
              Status & Category
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Status</label>
              <select
                value={formData.status || 'draft'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500"
              >
                <option value="draft">Draft (Private)</option>
                <option value="review">Editorial Review</option>
                <option value="scheduled">Scheduled</option>
                <option value="published">Published (Live)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Category</label>
              <select
                value={formData.category_id || ''}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(formData.is_featured)}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="rounded text-brand-600 focus:ring-brand-500"
                />
                <span>Set as Homepage Featured Story</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(formData.is_trending)}
                  onChange={(e) => setFormData({ ...formData, is_trending: e.target.checked })}
                  className="rounded text-amber-500 focus:ring-amber-400"
                />
                <span>Highlight in Trending Grid</span>
              </label>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
              Featured Image
            </h3>
            <input
              type="url"
              value={formData.featured_image || ''}
              onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2"
            />
            {formData.featured_image && (
              <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={formData.featured_image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

