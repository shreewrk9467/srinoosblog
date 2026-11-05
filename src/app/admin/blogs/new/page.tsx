'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  Save,
  Eye,
  ArrowLeft,
  HelpCircle,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  Layers,
  Image as ImageIcon,
  RefreshCw,
  Wand2,
  ExternalLink,
} from 'lucide-react';
import { Category } from '@/lib/types';

export default function NewBlogPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiFormatting, setAiFormatting] = useState(false);
  const [formatSuccessMessage, setFormatSuccessMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80',
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

  const [faqs, setFaqs] = useState<Array<{ question: string; answer: string }>>([
    { question: 'What is the main takeaway of this guide?', answer: 'Provides verified strategies for rapid implementation.' }
  ]);

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((d: any) => {
        setCategories(d.categories || []);
        if (d.categories && d.categories.length > 0) {
          setFormData((prev) => ({ ...prev, category_id: d.categories[0].id }));
        }
      });
  }, []);

  const handleTitleChange = (val: string) => {
    const slug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: prev.slug === '' || prev.slug === prev.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') ? slug : prev.slug,
      meta_title: prev.meta_title === '' ? `${val} | Srinoos` : prev.meta_title,
    }));
  };

  const handleAiDraft = async () => {
    if (!aiPrompt.trim()) return;
    setAiGenerating(true);

    try {
      const selectedCat = categories.find((c) => c.id === formData.category_id);
      const res = await fetch('/api/ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiPrompt,
          categoryName: selectedCat?.name,
          focusKeyword: formData.focus_keyword,
        }),
      });

      const data: any = await res.json();
      if (data.draft) {
        setFormData((prev) => ({
          ...prev,
          title: data.draft.title,
          slug: data.draft.slug,
          excerpt: data.draft.excerpt,
          content: data.draft.content,
          meta_title: data.draft.meta_title,
          meta_description: data.draft.meta_description,
          focus_keyword: data.draft.focus_keyword,
          tags: data.draft.tags,
          reading_time_minutes: data.draft.reading_time_minutes,
          status: 'review', // Defaults to review for human editorial verification
        }));

        if (data.draft.faq_schema) {
          try {
            setFaqs(JSON.parse(data.draft.faq_schema));
          } catch {
            // fallback
          }
        }
      }
    } catch (e) {
      alert('AI draft generation failed');
    } finally {
      setAiGenerating(false);
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

  const handleSave = async (statusOverride?: string) => {
    setLoading(true);
    const statusToUse = statusOverride || formData.status;

    try {
      const payload = {
        ...formData,
        status: statusToUse,
        faq_schema: JSON.stringify(faqs),
      };

      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data: any = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save post');
      }

      alert('Article saved successfully in persistent database!');
      router.push('/admin/blogs');
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Error saving post');
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Create Blog Article</h1>
            <p className="text-xs text-slate-500">Draft, outline with AI, and publish to Srinoos</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSave('draft')}
            disabled={loading}
            className="px-4 py-2 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSave('published')}
            disabled={loading}
            className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" /> Publish Now
          </button>
        </div>
      </div>

      {/* AI Drafting Assistant Card */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-black tracking-tight">AI Content Assistant (20-Blog Daily Workflow)</h2>
        </div>
        <p className="text-xs text-slate-300 mb-4 max-w-2xl leading-relaxed">
          Provide your target topic or long-tail keyword. The AI engine will generate a comprehensive editorial outline, title, meta description, structured HTML body, and FAQ schema ready for your review and approval.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="e.g., Best Cloud Web Hosting for Next.js in 2026 or SEO Keyword Clustering Guide"
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-brand-400"
          />
          <button
            type="button"
            onClick={handleAiDraft}
            disabled={aiGenerating || !aiPrompt.trim()}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl transition shadow flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {aiGenerating ? 'Synthesizing Draft...' : 'Generate Outline & Draft'}
          </button>
        </div>
      </div>

      {/* Main Form Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Article Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="How to Build an Organic Traffic Engine with Modern SEO..."
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
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-r-xl px-3 py-2.5 text-xs font-mono focus:outline-none focus:border-brand-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Excerpt / Meta Summary
              </label>
              <textarea
                rows={3}
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="A compelling 1-2 sentence overview for social sharing and search cards..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-brand-500 focus:bg-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Article Content (HTML supported) *
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
                    href="/admin/builder?page=article"
                    target="_blank"
                    className="px-2 py-0.5 bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                    title="Open Live Visual Builder"
                  >
                    <span>Visual Builder</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, content: prev.content + '\n<h2>Section Title</h2>\n<p>Add your detailed explanation here.</p>\n' }))}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold cursor-pointer"
                  >
                    + H2
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, content: prev.content + '\n<h3>Key Subheading</h3>\n<p>Elaborate on this specific point.</p>\n' }))}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold cursor-pointer"
                  >
                    + H3
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, content: prev.content + '\n<ul>\n  <li><strong>Point One:</strong> In-depth detail</li>\n  <li><strong>Point Two:</strong> Verifiable action</li>\n</ul>\n' }))}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold cursor-pointer"
                  >
                    + List
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, content: prev.content + '\n<blockquote>\n  &ldquo;Actionable advice that provides exceptional reader value.&rdquo; &mdash; Srinoos Insights\n</blockquote>\n' }))}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold cursor-pointer"
                  >
                    + Quote
                  </button>
                </div>
              </div>
              <textarea
                rows={14}
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write or paste your article content here. Use <h2>, <h3>, <p>, <ul>, <li> tags..."
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

          {/* FAQ Schema Generator */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-brand-600" /> FAQ Schema Generator (Google Rich Snippets)
                </h3>
                <p className="text-xs text-slate-500">Add questions and answers to automatically generate Schema.org JSON-LD</p>
              </div>
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
                    {faqs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setFaqs(faqs.filter((_, i) => i !== idx))}
                        className="text-rose-500 hover:text-rose-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
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
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-brand-500"
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
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-brand-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Settings & SEO Sidebar (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Publishing Controls */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
              Publishing Status
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
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
                value={formData.category_id}
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

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Schedule Publication (Optional)</label>
              <input
                type="datetime-local"
                value={formData.scheduled_at}
                onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="rounded text-brand-600 focus:ring-brand-500"
                />
                <span>Set as Homepage Featured Story</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_trending}
                  onChange={(e) => setFormData({ ...formData, is_trending: e.target.checked })}
                  className="rounded text-amber-500 focus:ring-amber-400"
                />
                <span>Highlight in Trending Grid</span>
              </label>
            </div>
          </div>

          {/* Featured Image & Thumbnail */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
              Featured Image
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Image URL</label>
              <input
                type="url"
                value={formData.featured_image}
                onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500"
              />
            </div>

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

          {/* Technical SEO Metadata */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
              Technical SEO Settings
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Focus Keyword</label>
              <input
                type="text"
                value={formData.focus_keyword}
                onChange={(e) => setFormData({ ...formData, focus_keyword: e.target.value })}
                placeholder="e.g., modern SEO strategy"
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Tags (Comma-separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="SEO, AI, Marketing"
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Reading Time (Minutes)</label>
              <input
                type="number"
                min={1}
                max={60}
                value={formData.reading_time_minutes}
                onChange={(e) => setFormData({ ...formData, reading_time_minutes: parseInt(e.target.value) || 5 })}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

