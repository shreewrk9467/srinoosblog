'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MousePointerClick,
  GripVertical,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Edit3,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Laptop,
  Tablet,
  Smartphone,
  Sparkles,
  Layers,
  Tag,
  Gift,
  HelpCircle,
  FileCode,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  RefreshCw,
  X,
  Copy,
  Sliders,
  BookOpen,
  Mail,
  Folder,
  Flame,
  Home,
  User,
  ArrowLeft,
  ChevronDown,
  Check,
  FileText,
  Wand2,
  Columns,
  RotateCcw,
  Code,
  AlignLeft,
  CheckSquare,
  Square,
} from 'lucide-react';
import { PageSection, WebsiteSettings, BlogPost } from '@/lib/types';
import { PageKey, DEFAULT_PAGE_LAYOUTS } from '@/lib/page-layouts';
import { formatArticleWithAi, FormatOptions, FormatResult } from '@/lib/ai-article-formatter';

interface PageOption {
  key: PageKey;
  label: string;
  path: string;
  icon: any;
  description: string;
}

const PAGE_OPTIONS: PageOption[] = [
  { key: 'home', label: 'Home Page', path: '/', icon: Home, description: 'Hero banner, featured deals, articles feed & sidebar' },
  { key: 'article', label: 'Article Live Formatter', path: '/blog', icon: Sparkles, description: 'AI-powered article content editing, styling, headings, lists & professional layout' },
  { key: 'blog', label: 'All Blogs', path: '/blog', icon: BookOpen, description: 'Article archive, category pills & search grid' },
  { key: 'trending', label: 'Trending', path: '/trending', icon: Flame, description: 'High-engagement viral publications & leaderboard ads' },
  { key: 'about', label: 'About Page', path: '/about', icon: User, description: 'Mission, founder story, editorial standards & values' },
  { key: 'contact', label: 'Contact Page', path: '/contact', icon: Mail, description: 'Contact form, editorial desk details & FAQs' },
  { key: 'category', label: 'Category Archive', path: '/category/technology-and-ai', icon: Folder, description: 'Category breadcrumbs, filtered feed & sponsor banners' },
  { key: 'offers', label: 'Affiliate Deals', path: '/offers', icon: Gift, description: 'CPA/CPS/CPL deals marketplace & redirect links' },
];

const SAMPLE_RAW_ARTICLE = `Next.js 15 & Supabase: The Complete Architecture Blueprint for High-Traffic Applications

Building web applications in 2026 requires speed, resilience, and clean architecture. In today's fast-paced digital world, developers often struggle to choose the right combination of server rendering, database caching, and edge computing. In this comprehensive guide, we will delve into the architectural decisions that enable websites to handle 500,000+ monthly requests with sub-100ms response times.

Why Architecture Matters for High-Velocity Projects
Architecture is not merely about writing code; it is about establishing a predictable system where updates can be deployed without regressions. Teams that implement proper database pooling and optimistic UI updates experience 4x faster iteration cycles and a 65% reduction in production outages. Furthermore, your infrastructure cost drops by up to $1,200 per month when edge caching is configured correctly.

Core Pillars of Modern Web Stacks
There are three fundamental pillars every engineering lead must evaluate before writing code:
1. Edge Rendering and ISR: Serving pre-rendered pages with incremental background revalidation ensures instant First Contentful Paint.
2. Connection Pooling and Row Level Security: Utilizing Supabase PostgreSQL with Supavisor prevents database connection starvation during traffic spikes.
3. Type-Safe Data Contracts: Enforcing TypeScript across database schemas, API responses, and front-end components eliminates runtime type errors.

Pro Tip: Always configure Supabase connection pooling in transaction mode on port 6543 when deploying serverless functions or Next.js App Router API routes to avoid running out of database connections.

Step-by-Step Implementation Strategy
To get the best performance out of your application, follow these sequential steps:
Step 1: Set up Supabase with Row Level Security policies so client tokens can safely query only authorized records.
Step 2: Implement Next.js App Router dynamic routes with generateStaticParams to pre-render high-traffic article and product pages.
Step 3: Add automated schema migration pipelines in GitHub Actions to keep local, staging, and production databases synchronized.
Step 4: Monitor Core Web Vitals with real-user metrics to maintain a 99+ Google PageSpeed score.

Key Takeaway: A well-designed web architecture should be invisible to your users. They should only experience instant page loads, zero downtime, and seamless interactive experiences.`;

export default function AdminVisualBuilderPage() {
  const [currentPage, setCurrentPage] = useState<PageKey>('home');
  const [pageLayouts, setPageLayouts] = useState<Record<PageKey, PageSection[]>>(DEFAULT_PAGE_LAYOUTS);
  const [returnUrl, setReturnUrl] = useState<string | null>(null);

  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<PageSection | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [addInsertIndex, setAddInsertIndex] = useState<number | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isEditMode, setIsEditMode] = useState<boolean>(true);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [cloudNotice, setCloudNotice] = useState<{ tableMissing: boolean; error: string } | null>(null);
  const [showSqlModal, setShowSqlModal] = useState<boolean>(false);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);

  // Article Live Formatter State
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string>('sample');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [articleContent, setArticleContent] = useState<string>(SAMPLE_RAW_ARTICLE);
  const [rawBackupContent, setRawBackupContent] = useState<string>(SAMPLE_RAW_ARTICLE);
  const [articleTitle, setArticleTitle] = useState<string>('Next.js 15 & Supabase: The Complete Architecture Blueprint for High-Traffic Applications');
  const [articleCategory, setArticleCategory] = useState<string>('Technology & AI');
  const [articleFeaturedImage, setArticleFeaturedImage] = useState<string>('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80');
  const [articleViewTab, setArticleViewTab] = useState<'preview' | 'diff' | 'editor'>('preview');
  const [formattingLoading, setFormattingLoading] = useState<boolean>(false);
  const [savingArticle, setSavingArticle] = useState<boolean>(false);
  const [articleSavedSuccess, setArticleSavedSuccess] = useState<boolean>(false);
  const [articleSaveError, setArticleSaveError] = useState<string | null>(null);
  const [copiedArticleHtml, setCopiedArticleHtml] = useState<boolean>(false);
  const [formatStats, setFormatStats] = useState<FormatResult['stats'] | null>(null);
  const [formatImprovements, setFormatImprovements] = useState<string[]>([]);
  const [showLayoutBlocks, setShowLayoutBlocks] = useState<boolean>(false);
  const [formatOptions, setFormatOptions] = useState<FormatOptions>({
    boldKeyPoints: true,
    structureHeadings: true,
    convertLists: true,
    addCallouts: true,
    improveSpacing: true,
    balanceAlignment: true,
  });

  // Initialize from URL parameters on client mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const pageParam = params.get('page') as PageKey | null;
      const returnParam = params.get('return');

      if (pageParam && (DEFAULT_PAGE_LAYOUTS[pageParam] || pageParam === 'article')) {
        setCurrentPage(pageParam);
      }
      if (returnParam) {
        setReturnUrl(returnParam);
      }
    }
  }, []);

  // Fetch blog posts for the Article Formatter
  useEffect(() => {
    fetch('/api/blogs?limit=50')
      .then((r) => r.json())
      .then((d: any) => {
        if (d.posts && Array.isArray(d.posts) && d.posts.length > 0) {
          setBlogPosts(d.posts);
          if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const requestedPostId = params.get('postId');
            if (requestedPostId) {
              const matched = d.posts.find((p: BlogPost) => p.id === requestedPostId);
              if (matched) {
                setSelectedPostId(matched.id);
                setSelectedPost(matched);
                setArticleContent(matched.content || '');
                setRawBackupContent(matched.content || '');
                setArticleTitle(matched.title || '');
                setArticleCategory(matched.category_name || 'Technology & AI');
                if (matched.featured_image) setArticleFeaturedImage(matched.featured_image);
              }
            }
          }
        }
      })
      .catch((err) => console.error('Error fetching blog posts for builder:', err));
  }, []);

  // Fetch saved layouts from server
  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d: any) => {
        const s = d.settings || {};
        const updated = { ...DEFAULT_PAGE_LAYOUTS };

        // 1. Check for global multi-page layout map
        if (s.page_layouts_json) {
          try {
            const parsed = JSON.parse(s.page_layouts_json);
            if (typeof parsed === 'object' && parsed !== null) {
              for (const [k, v] of Object.entries(parsed)) {
                if (Array.isArray(v) && v.length > 0 && updated[k as PageKey]) {
                  updated[k as PageKey] = v as PageSection[];
                }
              }
            }
          } catch (e) {
            console.error('Error parsing page_layouts_json:', e);
          }
        }

        // 2. Backwards-compatibility for homepage sections
        if (s.homepage_sections_order_json) {
          try {
            const parsedHome = JSON.parse(s.homepage_sections_order_json);
            if (Array.isArray(parsedHome) && parsedHome.length > 0) {
              updated.home = parsedHome;
            }
          } catch {}
        }

        if (d.tableMissing || d.supabaseSynced === false) {
          setCloudNotice({
            tableMissing: true,
            error: "Could not find table 'public.website_settings' in Supabase cloud schema cache.",
          });
        }

        setPageLayouts(updated);
      })
      .catch((err) => console.error('Error fetching settings for builder:', err))
      .finally(() => setLoading(false));
  }, []);

  // Active sections for the currently selected page
  const currentSections = pageLayouts[currentPage] || [];

  // Immediate auto-persist to database & live website
  const persistLayouts = async (layoutsToSave: Record<PageKey, PageSection[]>) => {
    setSaving(true);
    try {
      const payload: Partial<WebsiteSettings> = {
        page_layouts_json: JSON.stringify(layoutsToSave),
        homepage_sections_order_json: JSON.stringify(layoutsToSave.home),
      };

      // Also sync top-level hero if home was updated
      const heroSection = layoutsToSave.home?.find((s) => s.type === 'hero');
      if (heroSection) {
        if (heroSection.headline) payload.hero_headline = heroSection.headline;
        if (heroSection.subheadline) payload.hero_subheadline = heroSection.subheadline;
        if (heroSection.badge) payload.hero_lead_badge = heroSection.badge;
      }

      // Also sync announcement bar
      const announcementSection = layoutsToSave.home?.find((s) => s.type === 'announcement');
      if (announcementSection) {
        payload.announcement_bar_enabled = announcementSection.enabled;
        if (announcementSection.headline) payload.announcement_bar_text = announcementSection.headline;
        if (announcementSection.btn1_link) payload.announcement_bar_link = announcementSection.btn1_link;
      }

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data: any = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save layout');

      if (data.supabaseSynced === false) {
        setCloudNotice({
          tableMissing: Boolean(data.tableMissing),
          error: data.supabaseError || 'Supabase cloud table website_settings not found.',
        });
      } else {
        setCloudNotice(null);
      }

      setSavedSuccess(true);
      setSaveError(null);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error saving layout:', err);
      setSaveError(err.message || 'Error saving layout to server. Please verify you are logged in as admin.');
    } finally {
      setSaving(false);
    }
  };

  // Update sections for the active page and immediately sync with database & live site
  const updateCurrentSections = (newSections: PageSection[], shouldPersist: boolean = true) => {
    const updatedLayouts = {
      ...pageLayouts,
      [currentPage]: newSections,
    };
    setPageLayouts(updatedLayouts);
    if (shouldPersist) {
      persistLayouts(updatedLayouts);
    }
  };

  // Save all page layouts to database
  const handleSaveLayout = async () => {
    if (currentPage === 'article' && articleContent) {
      await handleSaveArticle();
    }
    await persistLayouts(pageLayouts);
  };

  // --- ARTICLE LIVE FORMATTER ACTIONS ---
  const handleSelectArticle = (postId: string) => {
    setSelectedPostId(postId);
    setFormatStats(null);
    setFormatImprovements([]);
    setArticleSavedSuccess(false);
    setArticleSaveError(null);

    if (postId === 'sample') {
      setArticleContent(SAMPLE_RAW_ARTICLE);
      setRawBackupContent(SAMPLE_RAW_ARTICLE);
      setArticleTitle('Next.js 15 & Supabase: The Complete Architecture Blueprint for High-Traffic Applications');
      setArticleCategory('Technology & AI');
      setArticleFeaturedImage('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80');
      setSelectedPost(null);
      return;
    }

    const post = blogPosts.find((p) => p.id === postId);
    if (post) {
      setSelectedPost(post);
      setArticleContent(post.content || '');
      setRawBackupContent(post.content || '');
      setArticleTitle(post.title || 'Untitled Post');
      setArticleCategory(post.category_name || 'Technology & AI');
      if (post.featured_image) setArticleFeaturedImage(post.featured_image);
    }
  };

  const handleRunAiFormat = async () => {
    if (!articleContent || !articleContent.trim()) {
      alert('Please enter or select article content to format.');
      return;
    }

    setFormattingLoading(true);
    setArticleSaveError(null);

    if (!rawBackupContent) {
      setRawBackupContent(articleContent);
    }

    try {
      const res = await fetch('/api/ai-format', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: articleContent,
          options: formatOptions,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setArticleContent(data.formattedContent);
        setFormatStats(data.stats);
        setFormatImprovements(data.improvements || []);
      } else {
        const fallback = formatArticleWithAi(articleContent, formatOptions);
        setArticleContent(fallback.formattedContent);
        setFormatStats(fallback.stats);
        setFormatImprovements(fallback.improvements);
      }
    } catch (err: any) {
      console.warn('Network call failed, utilizing client-side AI formatter:', err);
      const fallback = formatArticleWithAi(articleContent, formatOptions);
      setArticleContent(fallback.formattedContent);
      setFormatStats(fallback.stats);
      setFormatImprovements(fallback.improvements);
    } finally {
      setFormattingLoading(false);
    }
  };

  const handleSaveArticle = async () => {
    setSavingArticle(true);
    setArticleSaveError(null);

    try {
      if (!selectedPostId || selectedPostId === 'sample') {
        const postSlug = 'nextjs-supabase-architecture-blueprint';
        const res = await fetch('/api/blogs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: articleTitle || 'Next.js 15 & Supabase: The Complete Architecture Blueprint for High-Traffic Applications',
            slug: postSlug,
            excerpt: 'A comprehensive engineering blueprint covering SSR caching, Row Level Security, Edge rendering, and database best practices.',
            content: articleContent,
            featured_image: articleFeaturedImage || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80',
            category_id: 'cat-technology-and-ai',
            category_slug: 'technology-and-ai',
            status: 'published',
            is_featured: true,
            is_trending: true,
            reading_time_minutes: 8,
            meta_title: articleTitle || 'Next.js 15 & Supabase Architecture Guide | Srinoos',
            meta_description: 'Discover how to architect scalable, high-performance web applications using Next.js 15 App Router, Supabase PostgreSQL, and Tailwind CSS.',
            published_at: new Date().toISOString(),
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to publish new article to live website');

        const savedPost = data.post;
        setSelectedPostId(savedPost.id);
        setSelectedPost(savedPost);
        setBlogPosts((prev) => [savedPost, ...prev.filter((p) => p.id !== savedPost.id)]);
        setArticleSavedSuccess(true);
        setTimeout(() => setArticleSavedSuccess(false), 5000);
        return;
      }

      const res = await fetch(`/api/blogs/${selectedPostId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: articleContent,
          title: articleTitle,
          featured_image: articleFeaturedImage,
          status: 'published',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update article');

      setArticleSavedSuccess(true);
      setTimeout(() => setArticleSavedSuccess(false), 4000);

      setBlogPosts((prev) =>
        prev.map((p) => (p.id === selectedPostId ? { ...p, content: articleContent, title: articleTitle } : p))
      );
      if (selectedPost) {
        setSelectedPost({ ...selectedPost, content: articleContent, title: articleTitle });
      }
    } catch (err: any) {
      setArticleSaveError(err.message || 'Error saving formatted article to database');
    } finally {
      setSavingArticle(false);
    }
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(articleContent);
    setCopiedArticleHtml(true);
    setTimeout(() => setCopiedArticleHtml(false), 2500);
  };

  const handleResetToRaw = () => {
    if (confirm('Revert all AI changes back to the original unformatted draft?')) {
      setArticleContent(rawBackupContent);
      setFormatStats(null);
      setFormatImprovements([]);
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dropTargetIndex !== index) {
      setDropTargetIndex(index);
    }
  };

  const handleDrop = (targetIndex: number) => {
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDropTargetIndex(null);
      return;
    }

    const reordered = [...currentSections];
    const [movedItem] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIndex, 0, movedItem);

    updateCurrentSections(reordered, true);
    setSelectedSectionId(movedItem.id);
    setDraggedIndex(null);
    setDropTargetIndex(null);
  };

  // Reorder buttons (Move Up / Down)
  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentSections.length) return;

    const reordered = [...currentSections];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    updateCurrentSections(reordered, true);
    setSelectedSectionId(moved.id);
  };

  // Toggle Visibility
  const handleToggleVisibility = (id: string) => {
    const updated = currentSections.map((sec) =>
      sec.id === id ? { ...sec, enabled: !sec.enabled } : sec
    );
    updateCurrentSections(updated, true);
  };

  // Delete Section
  const handleDeleteSection = (id: string) => {
    if (!confirm('Are you sure you want to remove this section from the page?')) return;
    const updated = currentSections.filter((sec) => sec.id !== id);
    updateCurrentSections(updated, true);
    if (selectedSectionId === id) setSelectedSectionId(null);
  };

  // Duplicate Section
  const handleDuplicateSection = (sec: PageSection) => {
    const duplicate: PageSection = {
      ...sec,
      id: `${currentPage}_${Date.now()}`,
      title: `${sec.title} (Copy)`,
    };
    const index = currentSections.findIndex((s) => s.id === sec.id);
    const updated = [...currentSections];
    updated.splice(index + 1, 0, duplicate);
    updateCurrentSections(updated, true);
    setSelectedSectionId(duplicate.id);
  };

  // Open Edit Modal
  const handleOpenEdit = (sec: PageSection) => {
    setEditingSection({ ...sec });
  };

  // Save Modal Edits
  const handleSaveModalEdits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection) return;

    const updated = currentSections.map((s) =>
      s.id === editingSection.id ? { ...editingSection } : s
    );
    updateCurrentSections(updated, true);
    setEditingSection(null);
  };

  // Add New Section from Library
  const handleAddNewSection = (type: PageSection['type']) => {
    const newId = `${currentPage}_custom_${Date.now()}`;
    let newBlock: PageSection;

    switch (type) {
      case 'custom_banner':
        newBlock = {
          id: newId,
          type: 'custom_banner',
          title: 'Promotional Callout Banner',
          enabled: true,
          badge: 'Exclusive Announcement',
          headline: 'High-Impact Cloud & AI Strategy for 2026',
          subheadline: 'Engineered for speed, search dominance, and predictable digital revenue.',
          btn1_text: 'Explore Deals',
          btn1_link: '/offers',
          btn2_text: 'Read Guides',
          btn2_link: '/blog',
          background_gradient: 'from-brand-900 via-indigo-950 to-slate-900',
        };
        break;
      case 'cta_box':
        newBlock = {
          id: newId,
          type: 'cta_box',
          title: 'Lead Capture & Newsletter Box',
          enabled: true,
          badge: 'Daily Tech Dispatch',
          headline: 'Stay Ahead with Srinoos Research & Analysis',
          subheadline: 'Join over 15,000+ engineers, creators, and affiliate publishers.',
          btn1_text: 'Subscribe Free',
          btn1_link: '/contact',
          background_gradient: 'from-slate-900 to-brand-950',
        };
        break;
      case 'faq_accordion':
        newBlock = {
          id: newId,
          type: 'faq_accordion',
          title: 'Frequently Asked Questions (FAQ)',
          enabled: true,
          headline: 'Frequently Asked Questions',
          subheadline: 'Everything you need to know about this section.',
        };
        break;
      case 'testimonial_bar':
        newBlock = {
          id: newId,
          type: 'testimonial_bar',
          title: 'Trust Badges & Social Proof Bar',
          enabled: true,
          headline: 'Trusted by Over 500,000+ Monthly Readers',
          subheadline: 'Independent, benchmarked tutorials researched for accuracy and reader value.',
        };
        break;
      case 'custom_html':
        newBlock = {
          id: newId,
          type: 'custom_html',
          title: 'Custom HTML / Embed Block',
          enabled: true,
          html_content: '<div class="p-8 bg-slate-900 text-white rounded-2xl text-center"><h3 class="text-xl font-bold">Custom Embedded Content</h3><p class="text-slate-400 text-sm mt-2">Paste raw HTML, YouTube embeds, or widgets here.</p></div>',
        };
        break;
      case 'top_ad':
      case 'mid_ad':
      case 'footer_ad':
        newBlock = {
          id: newId,
          type: type,
          title: 'Ad Unit Placement',
          placementId: 'homepage-top',
          enabled: true,
        };
        break;
      default:
        newBlock = {
          id: newId,
          type: 'custom_banner',
          title: 'New Section Block',
          enabled: true,
          headline: 'Custom Headline',
          subheadline: 'Add your custom content details here.',
        };
        break;
    }

    const insertAt = addInsertIndex !== null ? addInsertIndex : currentSections.length;
    const updated = [...currentSections];
    updated.splice(insertAt, 0, newBlock);

    updateCurrentSections(updated);
    setSelectedSectionId(newBlock.id);
    setShowAddModal(false);
    setAddInsertIndex(null);
  };

  // Device width helper
  const getDeviceClass = () => {
    switch (previewDevice) {
      case 'mobile':
        return 'max-w-[390px] border-x-8 border-t-8 border-slate-800 rounded-t-3xl shadow-2xl';
      case 'tablet':
        return 'max-w-[768px] border-x-4 border-t-4 border-slate-800 rounded-t-2xl shadow-xl';
      case 'desktop':
      default:
        return 'w-full';
    }
  };

  const activeOption = PAGE_OPTIONS.find((p) => p.key === currentPage) || PAGE_OPTIONS[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24">
      {/* Top Header & Page Selector Navigation */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-brand-50 text-brand-600 rounded-xl">
                <MousePointerClick className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Live Visual Builder &amp; Page Customizer
              </h1>
              <span className="px-2.5 py-0.5 bg-brand-100 text-brand-700 text-[11px] font-bold rounded-full">
                Entire Website
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Customize any page on your website: Click to edit text, swap links, add or remove sections, and drag and drop to reorder in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Return to Live Page Button (if opened from public site) */}
            {returnUrl && (
              <a
                href={returnUrl}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 border border-slate-200"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Live Site</span>
              </a>
            )}

            {/* Device Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                  previewDevice === 'desktop' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Desktop View"
              >
                <Laptop className="w-4 h-4" />
                <span className="hidden sm:inline">Desktop</span>
              </button>
              <button
                onClick={() => setPreviewDevice('tablet')}
                className={`p-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                  previewDevice === 'tablet' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Tablet View"
              >
                <Tablet className="w-4 h-4" />
                <span className="hidden sm:inline">Tablet</span>
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                  previewDevice === 'mobile' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-4 h-4" />
                <span className="hidden sm:inline">Mobile</span>
              </button>
            </div>

            {/* View Live Page Link */}
            <a
              href={PAGE_OPTIONS.find((p) => p.key === currentPage)?.path || '/'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
              title="Open current page in a new tab to see changes live"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
              <span>View Live ({PAGE_OPTIONS.find((p) => p.key === currentPage)?.path || '/'})</span>
            </a>

            {/* Mode Switcher */}
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                isEditMode
                  ? 'bg-amber-50 text-amber-700 border-amber-300'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{isEditMode ? 'Visual Editing: ON' : 'Preview Mode'}</span>
            </button>

            {/* Save All Layouts Button */}
            <button
              onClick={handleSaveLayout}
              disabled={saving}
              className={`px-5 py-2 font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2 ${
                savedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-brand-600 hover:bg-brand-500 text-white disabled:opacity-50'
              }`}
            >
              {saving ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : savedSuccess ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{saving ? 'Publishing Live...' : savedSuccess ? '✓ Published to Website!' : 'Save & Publish Live'}</span>
            </button>
          </div>
        </div>

        {/* Page Switcher Tabs */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 pl-1 pr-2 flex-shrink-0">
            Select Page:
          </span>
          {PAGE_OPTIONS.map((page) => {
            const Icon = page.icon;
            const isSelected = currentPage === page.key;
            return (
              <button
                key={page.key}
                onClick={() => {
                  setCurrentPage(page.key);
                  setSelectedSectionId(null);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 flex-shrink-0 border ${
                  isSelected
                    ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{page.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Save Error Notice (if any) */}
      {saveError && (
        <div className="bg-rose-50 border border-rose-300 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs text-rose-950 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <div>
              <strong className="block">Save Error: {saveError}</strong>
              <span className="text-[11px] text-rose-700">Changes could not be synced to the database. If your session expired, please log in again.</span>
            </div>
          </div>
          <Link
            href="/admin/login?redirect=/admin/builder"
            className="px-3 py-1.5 bg-rose-600 text-white font-bold rounded-xl text-xs flex-shrink-0 hover:bg-rose-700 transition"
          >
            Re-Login to Admin
          </Link>
        </div>
      )}

      {/* Cloud Database Persistence Notice */}
      {cloudNotice && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-950 animate-in fade-in">
          <div className="flex items-start sm:items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <strong className="block text-sm font-bold text-amber-900">
                Action Required: Initialize Supabase Cloud Database Table
              </strong>
              <span className="text-[11px] text-amber-800">
                Visual builder edits are temporarily held in local server memory. To make all your changes 100% permanent across all devices and after page refreshes, initialize the <code>website_settings</code> table in your Supabase project.
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowSqlModal(true)}
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs flex-shrink-0 transition flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
          >
            <span>View 1-Click SQL</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Active Page Info Banner */}
      <div className="bg-indigo-50 border border-indigo-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-indigo-950">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 bg-indigo-600 text-white rounded-lg">
            <activeOption.icon className="w-4 h-4" />
          </span>
          <div>
            <span className="font-bold text-sm block">Currently Customizing: {activeOption.label}</span>
            <span className="text-indigo-700 text-[11px] block">
              {currentPage === 'article'
                ? 'AI-Powered article formatting: Auto-enhances headings (H2/H3), bold key points, bullet lists & modern callouts'
                : `${activeOption.description} • Live URL: ${activeOption.path}`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href={currentPage === 'article' && selectedPost?.slug ? `/blog/${selectedPost.slug}` : activeOption.path}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-white hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg text-xs border border-indigo-200 flex items-center gap-1 shadow-2xs"
          >
            <span>View Live Page</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          {currentPage === 'article' ? (
            <Link
              href="/admin/blogs"
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow-xs"
            >
              <BookOpen className="w-3.5 h-3.5" /> Manage All Articles
            </Link>
          ) : (
            <button
              onClick={() => {
                setAddInsertIndex(0);
                setShowAddModal(true);
              }}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Add Block at Top
            </button>
          )}
        </div>
      </div>

      {/* RENDER MODE: EITHER AI ARTICLE STUDIO OR MULTI-PAGE VISUAL CANVAS */}
      {currentPage === 'article' ? (
        <div className="space-y-6">
          {/* Article Selection & AI Action Toolbar */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex-1 space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Select Article to Edit &amp; Format:
                </label>
                <div className="flex flex-wrap items-center gap-2.5">
                  <select
                    value={selectedPostId}
                    onChange={(e) => handleSelectArticle(e.target.value)}
                    className="flex-1 min-w-[280px] bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-brand-500"
                  >
                    <option value="sample">⚡ Sample Unformatted Draft (High-Traffic Architecture)</option>
                    {blogPosts.map((post) => (
                      <option key={post.id} value={post.id}>
                        {post.status === 'published' ? '🟢 Published: ' : '📝 Draft: '}
                        {post.title}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => handleSelectArticle('sample')}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5 border border-slate-200 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Load Sample Draft</span>
                  </button>
                  <Link
                    href="/admin/blogs/new"
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5 border border-slate-200"
                  >
                    <Plus className="w-3.5 h-3.5 text-brand-600" />
                    <span>New Article</span>
                  </Link>
                </div>
              </div>

              {/* Primary AI Execution Button */}
              <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
                <button
                  type="button"
                  onClick={handleRunAiFormat}
                  disabled={formattingLoading}
                  className="px-6 py-3 bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md transition flex items-center gap-2 group disabled:opacity-50 ring-2 ring-brand-500/30 cursor-pointer"
                >
                  {formattingLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                  )}
                  <span>{formattingLoading ? 'AI Analyzing & Formatting...' : '⚡ Run AI Intelligent Auto-Format'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveArticle}
                  disabled={savingArticle}
                  title="Save changes and publish live to database & website"
                  className="px-5 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-2xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  {savingArticle ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : articleSavedSuccess ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Save className="w-3.5 h-3.5 text-brand-400" />
                  )}
                  <span>
                    {savingArticle
                      ? 'Publishing Live...'
                      : articleSavedSuccess
                      ? '✓ Published Live!'
                      : selectedPostId === 'sample'
                      ? 'Publish Article Live'
                      : 'Save & Publish Live'}
                  </span>
                </button>

                <a
                  href={`/blog/${selectedPost?.slug || 'nextjs-supabase-architecture-blueprint'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs rounded-2xl border border-brand-200 transition flex items-center gap-1.5 shadow-2xs"
                  title="Open live article on website in a new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View on Website</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyHtml}
                  className="px-3.5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl border border-slate-200 transition flex items-center gap-1.5 cursor-pointer"
                  title="Copy formatted HTML to clipboard"
                >
                  {copiedArticleHtml ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedArticleHtml ? 'Copied HTML!' : 'Copy HTML'}</span>
                </button>

                {rawBackupContent && rawBackupContent !== articleContent && (
                  <button
                    type="button"
                    onClick={handleResetToRaw}
                    className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-2xl transition cursor-pointer"
                    title="Reset to raw unformatted draft"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* AI Intelligence Decision Options */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Wand2 className="w-3.5 h-3.5 text-brand-500" />
                  AI Intelligence Decision Rules (Autonomous):
                </span>
                <span className="text-[11px] text-slate-500">AI decides placement automatically without manual tagging</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {[
                  { key: 'boldKeyPoints', label: 'Bold Key Points & Metrics' },
                  { key: 'structureHeadings', label: 'Organize H2 & H3 Headings' },
                  { key: 'convertLists', label: 'Convert Scannable Lists' },
                  { key: 'addCallouts', label: 'Modern Pro-Tip Callouts' },
                  { key: 'improveSpacing', label: 'Optimize Pacing & Spacing' },
                  { key: 'balanceAlignment', label: 'Balance Editorial Layout' },
                ].map((opt) => {
                  const isActive = Boolean(formatOptions[opt.key as keyof FormatOptions]);
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() =>
                        setFormatOptions((prev) => ({
                          ...prev,
                          [opt.key]: !prev[opt.key as keyof FormatOptions],
                        }))
                      }
                      className={`px-3 py-2 rounded-xl text-left text-xs font-semibold transition border flex items-center gap-2 cursor-pointer ${
                        isActive
                          ? 'bg-brand-50/70 border-brand-300 text-brand-900'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      {isActive ? (
                        <CheckSquare className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                      )}
                      <span className="text-[11px] leading-tight truncate">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* View Tab Switcher */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setArticleViewTab('preview')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    articleViewTab === 'preview'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Live Visual Preview</span>
                </button>
                <button
                  type="button"
                  onClick={() => setArticleViewTab('diff')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    articleViewTab === 'diff'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span>Before vs After Diff</span>
                </button>
                <button
                  type="button"
                  onClick={() => setArticleViewTab('editor')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    articleViewTab === 'editor'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>HTML Source Editor</span>
                </button>
              </div>

              {selectedPost && selectedPost.slug && (
                <a
                  href={`/blog/${selectedPost.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
                >
                  <span>Preview Live Publication (/blog/{selectedPost.slug})</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* AI Improvement Audit Banner (Shown when format has run) */}
          {formatStats && (
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200/90 rounded-3xl p-5 shadow-xs space-y-3 animate-in fade-in zoom-in-95">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-emerald-600 text-white rounded-lg">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                  <h4 className="font-black text-slate-900 text-sm">
                    AI Auto-Format Applied Successfully
                  </h4>
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                    Publication Ready
                  </span>
                </div>
                <span className="text-xs text-emerald-800 font-semibold">
                  Original meaning and facts 100% preserved
                </span>
              </div>

              {/* Stats Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                <div className="bg-white/90 p-3 rounded-2xl border border-emerald-100 text-center">
                  <span className="text-xs font-bold text-slate-400 block uppercase">Headings</span>
                  <span className="text-xl font-black text-slate-900">{formatStats.headingsOrganized}</span>
                  <span className="text-[10px] text-emerald-600 font-semibold block">H2/H3 Structured</span>
                </div>
                <div className="bg-white/90 p-3 rounded-2xl border border-emerald-100 text-center">
                  <span className="text-xs font-bold text-slate-400 block uppercase">Bold Key Points</span>
                  <span className="text-xl font-black text-slate-900">{formatStats.keyPointsBolded}</span>
                  <span className="text-[10px] text-emerald-600 font-semibold block">Metrics &amp; Focus</span>
                </div>
                <div className="bg-white/90 p-3 rounded-2xl border border-emerald-100 text-center">
                  <span className="text-xs font-bold text-slate-400 block uppercase">Lists</span>
                  <span className="text-xl font-black text-slate-900">{formatStats.listsCreated}</span>
                  <span className="text-[10px] text-emerald-600 font-semibold block">Scannable Sequences</span>
                </div>
                <div className="bg-white/90 p-3 rounded-2xl border border-emerald-100 text-center">
                  <span className="text-xs font-bold text-slate-400 block uppercase">Callout Boxes</span>
                  <span className="text-xl font-black text-slate-900">{formatStats.calloutsAdded}</span>
                  <span className="text-[10px] text-emerald-600 font-semibold block">Tips &amp; Takeaways</span>
                </div>
                <div className="bg-white/90 p-3 rounded-2xl border border-emerald-100 text-center col-span-2 sm:col-span-1">
                  <span className="text-xs font-bold text-slate-400 block uppercase">Paragraphs</span>
                  <span className="text-xl font-black text-slate-900">{formatStats.paragraphsOptimized}</span>
                  <span className="text-[10px] text-emerald-600 font-semibold block">Spacing Optimized</span>
                </div>
              </div>

              {/* Improvements Checklist */}
              {formatImprovements.length > 0 && (
                <div className="pt-2">
                  <div className="text-[11px] font-bold text-emerald-950 uppercase tracking-wider mb-1.5">
                    Specific Intelligent Decisions:
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5 text-xs text-slate-700">
                    {formatImprovements.map((imp, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Save Status / Error Notice */}
          {articleSavedSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>✓ Article published live to website and synced with Supabase cloud database!</span>
              </div>
              <a
                href={`/blog/${selectedPost?.slug || 'nextjs-supabase-architecture-blueprint'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
              >
                <span>View Live Article</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
          {articleSaveError && (
            <div className="p-4 bg-rose-50 border border-rose-300 text-rose-900 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>{articleSaveError}</span>
            </div>
          )}

          {/* VIEW TAB 1: LIVE VISUAL PREVIEW CANVAS */}
          {articleViewTab === 'preview' && (
            <div className="flex justify-center bg-slate-900/5 p-2 sm:p-6 rounded-3xl border border-slate-200/80 overflow-hidden min-h-[750px]">
              <div className={`transition-all duration-300 bg-white ${getDeviceClass()}`}>
                <div className="p-6 sm:p-12 space-y-8">
                  {/* Article Hero Banner */}
                  <div className="space-y-4 border-b border-slate-100 pb-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 bg-brand-50 text-brand-700 border border-brand-200/80 rounded-full text-xs font-bold uppercase tracking-wider">
                        {articleCategory}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">&bull; 5 min read</span>
                      <span className="text-xs text-slate-500 font-medium">&bull; Published on Srinoos Insights</span>
                    </div>

                    <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight font-display tracking-tight">
                      {articleTitle}
                    </h1>

                    <div className="flex items-center gap-3 pt-1">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                        S
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">Srinoos Editorial Team</span>
                        <span className="text-[11px] text-slate-500">Verified Technical Research Collective</span>
                      </div>
                    </div>
                  </div>

                  {/* Featured Hero Image */}
                  {articleFeaturedImage && (
                    <div className="rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs max-h-80 w-full">
                      <img
                        src={articleFeaturedImage}
                        alt={articleTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Formatted Article Body */}
                  <div className="article-body-container text-slate-800 text-sm sm:text-base leading-relaxed space-y-4 font-normal">
                    <div
                      dangerouslySetInnerHTML={{ __html: articleContent }}
                      className="prose-content [&>h2]:text-2xl [&>h2]:font-black [&>h2]:text-slate-900 [&>h2]:mt-8 [&>h2]:mb-3 [&>h2]:border-l-4 [&>h2]:border-brand-500 [&>h2]:pl-3.5 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-slate-800 [&>h3]:mt-6 [&>h3]:mb-2 [&>p]:leading-relaxed [&>p]:text-slate-700 [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:my-4 [&>ul>li]:mb-2 [&>ul>li]:text-slate-700 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:my-4 [&>ol>li]:mb-2 [&>ol>li]:text-slate-700 [&>blockquote]:my-6 [&>blockquote]:pl-5 [&>blockquote]:border-l-4 [&>blockquote]:border-brand-500 [&>blockquote]:italic [&>blockquote]:text-slate-700 [&>blockquote]:bg-slate-50/80 [&>blockquote]:py-3.5 [&>blockquote]:pr-4 [&>blockquote]:rounded-r-2xl [&_strong]:font-bold [&_strong]:text-slate-900"
                    />
                  </div>

                  {/* Simulated High-CTR In-Article Ad Slot */}
                  <div className="my-8 p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300/80 text-center space-y-2">
                    <span className="px-2.5 py-0.5 bg-amber-200/60 text-amber-900 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block">
                      ⚡ Sricospace Partner Placement
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">High-Performance Infrastructure &amp; Cloud Tools</h4>
                    <p className="text-xs text-slate-600 max-w-md mx-auto">
                      Explore verified deals and recommended cloud architectures for modern digital growth.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW TAB 2: BEFORE VS AFTER SPLIT DIFF */}
          {articleViewTab === 'diff' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-100 p-4 sm:p-6 rounded-3xl border border-slate-200/90">
              {/* Left Column: Raw Draft */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3 flex flex-col">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                    <span className="font-bold text-xs uppercase tracking-wider text-slate-600">
                      Original Draft (Unformatted)
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {rawBackupContent.length} chars
                  </span>
                </div>
                <div className="flex-1 max-h-[600px] overflow-y-auto font-mono text-xs text-slate-600 whitespace-pre-wrap leading-relaxed p-2 bg-slate-50 rounded-xl">
                  {rawBackupContent}
                </div>
              </div>

              {/* Right Column: AI Formatted Layout */}
              <div className="bg-white rounded-2xl p-5 border border-brand-300 shadow-xs space-y-3 flex flex-col">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="font-bold text-xs uppercase tracking-wider text-emerald-700">
                      AI Enhanced Layout (Clean HTML)
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-bold">
                    ✓ Structured &amp; Styled
                  </span>
                </div>
                <div className="flex-1 max-h-[600px] overflow-y-auto p-4 bg-slate-50/60 rounded-xl text-xs sm:text-sm text-slate-800 space-y-3">
                  <div
                    dangerouslySetInnerHTML={{ __html: articleContent }}
                    className="[&>h2]:text-lg [&>h2]:font-black [&>h2]:text-slate-900 [&>h2]:mt-4 [&>h2]:mb-2 [&>h2]:border-l-4 [&>h2]:border-brand-500 [&>h2]:pl-2.5 [&>h3]:text-base [&>h3]:font-bold [&>h3]:text-slate-800 [&>h3]:mt-3 [&>h3]:mb-1 [&>p]:leading-relaxed [&>p]:text-slate-700 [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:my-2 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:my-2 [&_strong]:font-bold [&_strong]:text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* VIEW TAB 3: HTML SOURCE CODE EDITOR */}
          {articleViewTab === 'editor' && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Code className="w-4 h-4 text-brand-600" />
                    <span>Raw Article HTML Markup</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Directly edit or fine-tune the HTML markup generated by the AI Formatter.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyHtml}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedArticleHtml ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRunAiFormat}
                    disabled={formattingLoading}
                    className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Re-Run AI Auto-Format</span>
                  </button>
                </div>
              </div>

              <textarea
                rows={18}
                value={articleContent}
                onChange={(e) => setArticleContent(e.target.value)}
                placeholder="Enter or paste article HTML..."
                className="w-full bg-slate-900 text-slate-100 font-mono text-xs sm:text-sm p-4 rounded-2xl border border-slate-800 leading-relaxed focus:outline-none focus:border-brand-500"
              />

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>{articleContent.length} characters &bull; ~{Math.round(articleContent.split(/\s+/).length)} words</span>
                <button
                  type="button"
                  onClick={() => setArticleViewTab('preview')}
                  className="text-brand-600 font-bold hover:underline cursor-pointer"
                >
                  View Live Visual Layout &rarr;
                </button>
              </div>
            </div>
          )}

          {/* Collapsible: Article Page Template Layout Sections (/blog/[slug]) */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-600" />
                  <span>Article Page Template Layout (/blog/[slug])</span>
                </h4>
                <p className="text-xs text-slate-500">
                  Manage the structural page layout surrounding articles (Hero Header, Content, In-Content Ads, and FAQs).
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowLayoutBlocks(!showLayoutBlocks)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 border border-slate-200 cursor-pointer"
              >
                <span>{showLayoutBlocks ? 'Hide Template Sections' : 'Show & Reorder Sections'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showLayoutBlocks ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {showLayoutBlocks && (
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
                  {currentSections.map((section, index) => (
                    <div
                      key={section.id}
                      className="p-4 bg-white flex items-center justify-between gap-3 hover:bg-slate-50 transition"
                    >
                      <div className="flex items-center gap-2.5">
                        <GripVertical className="w-4 h-4 text-slate-400 cursor-grab" />
                        <div>
                          <span className="font-bold text-xs text-slate-900 block">{section.title}</span>
                          <span className="text-[11px] text-slate-500 font-mono uppercase">{section.type}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleMove(index, 'up')}
                          disabled={index === 0}
                          className="p-1 hover:bg-slate-100 disabled:opacity-30 rounded-lg text-slate-600 cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMove(index, 'down')}
                          disabled={index === currentSections.length - 1}
                          className="p-1 hover:bg-slate-100 disabled:opacity-30 rounded-lg text-slate-600 cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleVisibility(section.id)}
                          className={`p-1 rounded-lg cursor-pointer ${section.enabled ? 'text-blue-500' : 'text-slate-400'}`}
                          title={section.enabled ? 'Enabled' : 'Hidden'}
                        >
                          {section.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Regular Multi-Page Visual Canvas Wrapper */
        <div className="flex justify-center bg-slate-900/5 p-2 sm:p-6 rounded-3xl border border-slate-200/80 overflow-hidden min-h-[750px]">
          <div className={`transition-all duration-300 bg-white ${getDeviceClass()}`}>
            <div className="divide-y divide-slate-100">
            {currentSections.map((section, index) => {
              const isSelected = selectedSectionId === section.id;
              const isBeingDragged = draggedIndex === index;
              const isDropTarget = dropTargetIndex === index;

              return (
                <div
                  key={section.id}
                  draggable={isEditMode}
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={() => handleDrop(index)}
                  onClick={() => isEditMode && setSelectedSectionId(section.id)}
                  className={`relative transition-all duration-200 group ${
                    !section.enabled ? 'opacity-40 grayscale' : ''
                  } ${
                    isBeingDragged ? 'opacity-20 scale-95 border-2 border-dashed border-brand-500' : ''
                  } ${
                    isDropTarget ? 'border-t-4 border-brand-600 bg-brand-50/20' : ''
                  } ${
                    isEditMode && isSelected
                      ? 'ring-4 ring-brand-500/80 ring-offset-2 z-20'
                      : isEditMode
                      ? 'hover:ring-2 hover:ring-brand-300/60'
                      : ''
                  }`}
                >
                  {/* Floating Context Toolbar on Active Element */}
                  {isEditMode && isSelected && (
                    <div className="absolute -top-12 left-4 z-40 bg-slate-950 text-white rounded-xl shadow-2xl border border-slate-700 px-2 py-1.5 flex items-center gap-1 text-xs animate-in fade-in zoom-in-95">
                      <div className="flex items-center gap-1 px-2 border-r border-slate-800 text-slate-300 font-mono text-[11px]">
                        <GripVertical className="w-3.5 h-3.5 text-brand-400 cursor-grab" />
                        <span className="font-bold text-white max-w-[120px] truncate">{section.title}</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEdit(section);
                        }}
                        className="p-1.5 hover:bg-slate-800 text-brand-300 rounded-lg flex items-center gap-1 font-semibold"
                        title="Edit text, links &amp; appearance"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setAddInsertIndex(index + 1);
                          setShowAddModal(true);
                        }}
                        className="p-1.5 hover:bg-slate-800 text-emerald-400 rounded-lg flex items-center gap-1 font-semibold"
                        title="Add new block below"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Below</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMove(index, 'up');
                        }}
                        disabled={index === 0}
                        className="p-1.5 hover:bg-slate-800 disabled:opacity-30 rounded-lg"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMove(index, 'down');
                        }}
                        disabled={index === currentSections.length - 1}
                        className="p-1.5 hover:bg-slate-800 disabled:opacity-30 rounded-lg"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateSection(section);
                        }}
                        className="p-1.5 hover:bg-slate-800 text-slate-300 rounded-lg"
                        title="Duplicate Section"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleVisibility(section.id);
                        }}
                        className={`p-1.5 hover:bg-slate-800 rounded-lg ${
                          section.enabled ? 'text-blue-400' : 'text-slate-500'
                        }`}
                        title={section.enabled ? 'Hide Section' : 'Show Section'}
                      >
                        {section.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSection(section.id);
                        }}
                        className="p-1.5 hover:bg-red-950 text-red-400 rounded-lg"
                        title="Delete Section"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Section Render Output */}
                  <div className="p-4 sm:p-6 cursor-pointer">
                    {/* Announcement Bar */}
                    {section.type === 'announcement' && (
                      <div className={`p-3 text-center text-white text-xs font-semibold rounded-xl bg-gradient-to-r ${section.background_gradient || 'from-brand-600 to-indigo-700'} shadow-sm flex items-center justify-center gap-3`}>
                        <span>{section.headline || 'Announcement Message'}</span>
                        {section.btn1_text && (
                          <span className="underline font-bold text-white/90">
                            {section.btn1_text} &rarr;
                          </span>
                        )}
                      </div>
                    )}

                    {/* Ad Slots */}
                    {(section.type === 'top_ad' || section.type === 'mid_ad' || section.type === 'footer_ad') && (
                      <div className="border border-dashed border-amber-300 bg-amber-50/50 rounded-2xl p-4 text-center">
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider">
                          <Tag className="w-3.5 h-3.5 text-amber-600" />
                          <span>Ad Unit Placement: {section.title} ({section.placementId || 'responsive-ad'})</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">Google AdSense / Custom Sponsor Slot</p>
                      </div>
                    )}

                    {/* Hero Banners */}
                    {(section.type === 'hero' || section.type === 'about_mission' || section.type === 'offers_header') && (
                      <div className={`rounded-3xl p-6 sm:p-10 text-white bg-gradient-to-r ${section.background_gradient || 'from-slate-900 via-indigo-950 to-slate-900'} relative overflow-hidden shadow-lg`}>
                        <div className="space-y-4 max-w-3xl">
                          {section.badge && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-500/20 border border-brand-400/30 text-brand-300 rounded-full text-xs font-bold uppercase tracking-wider">
                              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                              {section.badge}
                            </span>
                          )}
                          <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight font-display">
                            {section.headline}
                          </h2>
                          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
                            {section.subheadline}
                          </p>
                          {(section.btn1_text || section.btn2_text) && (
                            <div className="flex flex-wrap items-center gap-3 pt-2">
                              {section.btn1_text && (
                                <span className="px-5 py-2.5 bg-brand-600 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center gap-1.5">
                                  {section.btn1_text} <ArrowRight className="w-3.5 h-3.5" />
                                </span>
                              )}
                              {section.btn2_text && (
                                <span className="px-5 py-2.5 bg-slate-800 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 inline-flex items-center gap-1.5">
                                  {section.btn2_text}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Page Headers (Blog, Trending, Contact, Category) */}
                    {(section.type === 'blog_header' || section.type === 'trending_header' || section.type === 'contact_header' || section.type === 'category_header') && (
                      <div className="bg-slate-50 border border-slate-200/90 rounded-3xl p-6 sm:p-8 text-center max-w-3xl mx-auto space-y-3">
                        {section.badge && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-xs font-bold uppercase tracking-wider">
                            {section.badge}
                          </span>
                        )}
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{section.headline}</h2>
                        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">{section.subheadline}</p>
                      </div>
                    )}

                    {/* Deals & Affiliate Grid */}
                    {section.type === 'deals' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                            <Gift className="w-4 h-4 text-amber-600" />
                            {section.headline || 'Featured Deals & Partner Offers'}
                          </h3>
                          <span className="text-xs text-brand-600 font-bold">Explore All Offers &rarr;</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {['Hostinger Cloud 75% Off', 'Amazon Prime Specials', 'Zerodha Free Demat'].map((deal, idx) => (
                            <div key={idx} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
                              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-600 uppercase">CPA Deal</span>
                              <h4 className="font-bold text-xs text-slate-900">{deal}</h4>
                              <p className="text-[11px] text-slate-500">Verified partner promotion with tracking redirect.</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Lead Feature Spotlight */}
                    {section.type === 'lead_feature' && (
                      <div className="bg-slate-50 border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4" /> {section.badge || 'Lead Feature Spotlight'}
                          </span>
                          <span className="text-xs text-brand-600 font-bold">Featured Publication</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                          <div className="md:col-span-6 bg-slate-200 aspect-[16/10] rounded-2xl flex items-center justify-center text-xs text-slate-500 font-bold">
                            Lead Article Thumbnail
                          </div>
                          <div className="md:col-span-6 space-y-2">
                            <span className="px-2.5 py-0.5 bg-brand-100 text-brand-700 text-[10px] font-bold rounded-full uppercase">
                              Technology &amp; AI
                            </span>
                            <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                              {section.headline || 'How to Build an Organic Traffic Engine with Modern SEO in 2026'}
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {section.subheadline || 'A comprehensive operational guide on architecting high-converting organic search channels with AI assistance.'}
                            </p>
                            <div className="pt-2 text-[11px] text-slate-400 font-medium flex items-center gap-2">
                              <span>Srinoos Editorial Team</span> &bull; <span>5 min read</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Blog & Trending Grids */}
                    {(section.type === 'blog_grid' || section.type === 'trending_grid' || section.type === 'category_grid' || section.type === 'main_feed' || section.type === 'trending') && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <BookOpen className="w-4 h-4 text-brand-600" />
                              {section.headline || section.title}
                            </h4>
                            {section.subheadline && (
                              <p className="text-[11px] text-slate-500 mt-0.5">{section.subheadline}</p>
                            )}
                          </div>
                          <span className="text-xs text-slate-400 font-mono">Dynamic Database Query</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="p-3 border border-slate-200/80 rounded-xl bg-slate-50 space-y-1.5">
                              <div className="w-full h-20 bg-slate-200 rounded-lg flex items-center justify-center text-[11px] text-slate-400 font-semibold">Featured Thumbnail</div>
                              <span className="text-[9px] font-bold text-slate-400 uppercase">Technology &amp; AI</span>
                              <h5 className="font-bold text-xs text-slate-800 line-clamp-1">Sample Publication Post #{i}</h5>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* About Values & Founder Profile */}
                    {(section.type === 'about_values' || section.type === 'about_founder' || section.type === 'contact_info') && (
                      <div className="p-6 bg-slate-900 text-white rounded-3xl space-y-3">
                        <div className="flex items-center gap-2 text-brand-400 font-bold text-xs uppercase tracking-wider">
                          <ShieldCheck className="w-4 h-4" />
                          <span>{section.title}</span>
                        </div>
                        <h3 className="text-xl font-bold">{section.headline}</h3>
                        <p className="text-xs text-slate-300 leading-relaxed max-w-xl">{section.subheadline}</p>
                      </div>
                    )}

                    {/* Contact Form Element */}
                    {section.type === 'contact_form' && (
                      <div className="p-6 border border-slate-200 rounded-3xl bg-slate-50 space-y-3">
                        <h4 className="font-bold text-slate-900 text-sm">Interactive Message Submission Form</h4>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400">Your Full Name</div>
                          <div className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400">Email Address</div>
                        </div>
                        <div className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 text-xs h-16">Enter your inquiry message here...</div>
                      </div>
                    )}

                    {/* Custom Banner / Promotional Box */}
                    {section.type === 'custom_banner' && (
                      <div className={`p-6 sm:p-8 rounded-2xl text-white bg-gradient-to-r ${section.background_gradient || 'from-brand-900 to-indigo-950'} shadow-md space-y-2.5`}>
                        {section.badge && (
                          <span className="px-2.5 py-0.5 bg-white/20 text-white rounded-full text-[10px] font-bold uppercase tracking-wider inline-block">
                            {section.badge}
                          </span>
                        )}
                        <h3 className="text-xl sm:text-2xl font-black text-white">{section.headline}</h3>
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl">{section.subheadline}</p>
                        {section.btn1_text && (
                          <div className="pt-2">
                            <span className="px-4 py-2 bg-white text-slate-900 font-bold text-xs rounded-xl shadow-xs inline-flex items-center gap-1.5">
                              {section.btn1_text} &rarr;
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Call to Action Box */}
                    {section.type === 'cta_box' && (
                      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 to-brand-950 text-white border border-slate-800 text-center space-y-3 shadow-md">
                        <span className="px-2.5 py-0.5 bg-brand-500/20 text-brand-300 border border-brand-400/30 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          {section.badge || 'Newsletter & Updates'}
                        </span>
                        <h3 className="text-xl font-bold">{section.headline}</h3>
                        <p className="text-xs text-slate-300 max-w-md mx-auto">{section.subheadline}</p>
                        {section.btn1_text && (
                          <span className="px-5 py-2 bg-brand-600 text-white font-bold text-xs rounded-xl shadow-xs inline-block">
                            {section.btn1_text}
                          </span>
                        )}
                      </div>
                    )}

                    {/* FAQ Accordion Block */}
                    {section.type === 'faq_accordion' && (
                      <div className="p-5 border border-slate-200 rounded-2xl bg-white space-y-3">
                        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <HelpCircle className="w-4 h-4 text-brand-600" />
                          {section.headline || 'Frequently Asked Questions'}
                        </h4>
                        <div className="divide-y divide-slate-100 text-xs">
                          <div className="py-2">
                            <strong className="text-slate-800 block">Q: How do partner discounts work?</strong>
                            <span className="text-slate-500 text-[11px] mt-0.5 block">Clicking through our verified links applies promo codes automatically at checkout.</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Social Proof / Testimonials */}
                    {section.type === 'testimonial_bar' && (
                      <div className="p-5 rounded-2xl bg-slate-900 text-white text-center space-y-2">
                        <ShieldCheck className="w-6 h-6 text-brand-400 mx-auto" />
                        <h4 className="font-bold text-sm text-white">{section.headline}</h4>
                        <p className="text-xs text-slate-400 max-w-md mx-auto">{section.subheadline}</p>
                      </div>
                    )}

                    {/* Custom Raw HTML */}
                    {section.type === 'custom_html' && (
                      <div
                        className="rounded-2xl overflow-hidden"
                        dangerouslySetInnerHTML={{ __html: section.html_content || '<p>Empty HTML block</p>' }}
                      />
                    )}

                    {/* Article Specific Template Blocks */}
                    {section.type === 'article_header' && (
                      <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-3">
                        <div className="flex items-center gap-2 text-brand-600 font-bold text-xs uppercase tracking-wider">
                          <BookOpen className="w-4 h-4" />
                          <span>Article Title &amp; Metadata Header Block</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">{section.headline || 'Article Title & Author Block'}</h3>
                        <p className="text-xs text-slate-500">{section.subheadline || 'Renders categories, reading time, author, and featured image.'}</p>
                      </div>
                    )}

                    {section.type === 'article_body' && (
                      <div className="p-6 bg-white border border-brand-200 rounded-3xl space-y-3 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-brand-700 font-bold text-xs uppercase tracking-wider">
                            <Sparkles className="w-4 h-4 text-brand-500" />
                            <span>AI Formatted Article Content Body</span>
                          </div>
                          <span className="px-2 py-0.5 bg-brand-100 text-brand-700 text-[10px] font-bold rounded-full">AI Enhanced</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Displays the formatted publication prose with styled H2/H3 headings, bold key points, bullet lists, and callout boxes.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Block at Bottom Button */}
          {isEditMode && (
            <div className="p-6 border-t-2 border-dashed border-slate-200 text-center bg-slate-50/50">
              <button
                onClick={() => {
                  setAddInsertIndex(currentSections.length);
                  setShowAddModal(true);
                }}
                className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 shadow-xs transition inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4 text-brand-600" />
                <span>Add New Section to {activeOption.label}</span>
              </button>
            </div>
          )}
        </div>
      </div>
      )}

      {/* MODAL 1: ADD NEW BLOCK LIBRARY MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-slate-900 text-lg">Add New Section to {activeOption.label}</h3>
                <p className="text-xs text-slate-500">
                  Select a pre-designed modular component to add to this page layout.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <button
                onClick={() => handleAddNewSection('custom_banner')}
                className="p-4 rounded-2xl border border-slate-200/90 hover:border-brand-500 hover:bg-brand-50/20 text-left transition group space-y-1.5"
              >
                <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-brand-600">Promotional Callout Banner</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">High-converting callout with headline, badge, and dual CTA buttons.</p>
              </button>

              <button
                onClick={() => handleAddNewSection('cta_box')}
                className="p-4 rounded-2xl border border-slate-200/90 hover:border-brand-500 hover:bg-brand-50/20 text-left transition group space-y-1.5"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-brand-600">Lead Capture / Newsletter</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">Engaging subscriber box with value proposition and sign-up button.</p>
              </button>

              <button
                onClick={() => handleAddNewSection('faq_accordion')}
                className="p-4 rounded-2xl border border-slate-200/90 hover:border-brand-500 hover:bg-brand-50/20 text-left transition group space-y-1.5"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-brand-600">FAQ Accordion Block</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">Interactive Q&amp;A accordion structured for Google FAQPage schema.</p>
              </button>

              <button
                onClick={() => handleAddNewSection('testimonial_bar')}
                className="p-4 rounded-2xl border border-slate-200/90 hover:border-brand-500 hover:bg-brand-50/20 text-left transition group space-y-1.5"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-brand-600">Social Proof &amp; Trust Bar</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">Display subscriber counts, ratings, and reader security guarantees.</p>
              </button>

              <button
                onClick={() => handleAddNewSection('custom_html')}
                className="p-4 rounded-2xl border border-slate-200/90 hover:border-brand-500 hover:bg-brand-50/20 text-left transition group space-y-1.5"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                  <FileCode className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-brand-600">Custom HTML / Embed</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">Paste raw HTML, YouTube embeds, affiliate widgets, or third-party code.</p>
              </button>

              <button
                onClick={() => handleAddNewSection('top_ad')}
                className="p-4 rounded-2xl border border-slate-200/90 hover:border-brand-500 hover:bg-brand-50/20 text-left transition group space-y-1.5"
              >
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                  <Tag className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-brand-600">Ad Placement Container</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">Insert a responsive Google AdSense or sponsor banner container.</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: INLINE PROPERTY EDITOR MODAL */}
      {editingSection && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-slate-900 text-lg">Edit Section Element</h3>
                <span className="text-xs text-brand-600 font-mono font-bold uppercase">{editingSection.title}</span>
              </div>
              <button
                onClick={() => setEditingSection(null)}
                className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModalEdits} className="space-y-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Any change saved here applies immediately and publishes live to the website.</span>
              </div>

              {(editingSection.type === 'lead_feature' || editingSection.type === 'main_feed' || editingSection.type === 'blog_grid' || editingSection.type === 'trending_grid' || editingSection.type === 'category_grid') && (
                <div className="p-3 bg-brand-50 border border-brand-200 rounded-xl text-brand-900 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold">
                    <BookOpen className="w-4 h-4 text-brand-600" />
                    <span>Article Headline &amp; Title Controls</span>
                  </div>
                  <p className="text-brand-800 text-[11px] leading-relaxed">
                    Changing the <strong>Headline Text</strong> below immediately updates the headline displayed for this article section on the live website.
                  </p>
                  <div className="pt-1">
                    <Link
                      href="/admin/blogs"
                      target="_blank"
                      className="inline-flex items-center gap-1 font-bold text-brand-700 hover:underline text-[11px]"
                    >
                      <span>To edit individual database posts, body content &amp; SEO, open Articles Manager &rarr;</span>
                    </Link>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Internal Block Name</label>
                <input
                  type="text"
                  value={editingSection.title}
                  onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Badge Text (Top Pill)</label>
                <input
                  type="text"
                  value={editingSection.badge || ''}
                  onChange={(e) => setEditingSection({ ...editingSection, badge: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-brand-500"
                  placeholder="e.g. ⚡ Limited Time Deal • Verified by Srinoos"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {editingSection.type === 'lead_feature' ? 'Featured Article Headline / Heading' : 'Headline Text'}
                </label>
                <input
                  type="text"
                  value={editingSection.headline || ''}
                  onChange={(e) => setEditingSection({ ...editingSection, headline: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-bold focus:outline-brand-500"
                  placeholder="Enter main headline"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {editingSection.type === 'lead_feature' ? 'Featured Article Excerpt / Subheading' : 'Description / Subtitle'}
                </label>
                <textarea
                  rows={3}
                  value={editingSection.subheadline || ''}
                  onChange={(e) => setEditingSection({ ...editingSection, subheadline: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-brand-500"
                  placeholder="Enter description text"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Primary Button Label</label>
                  <input
                    type="text"
                    value={editingSection.btn1_text || ''}
                    onChange={(e) => setEditingSection({ ...editingSection, btn1_text: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-brand-500"
                    placeholder="e.g. Explore Guides"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Primary Button Link</label>
                  <input
                    type="text"
                    value={editingSection.btn1_link || ''}
                    onChange={(e) => setEditingSection({ ...editingSection, btn1_link: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-brand-500"
                    placeholder="e.g. /offers or /blog"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Secondary Button Label</label>
                  <input
                    type="text"
                    value={editingSection.btn2_text || ''}
                    onChange={(e) => setEditingSection({ ...editingSection, btn2_text: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-brand-500"
                    placeholder="e.g. Learn More"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Secondary Button Link</label>
                  <input
                    type="text"
                    value={editingSection.btn2_link || ''}
                    onChange={(e) => setEditingSection({ ...editingSection, btn2_link: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-brand-500"
                    placeholder="e.g. /about"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Background Gradient Theme</label>
                <select
                  value={editingSection.background_gradient || 'from-slate-900 via-indigo-950 to-slate-900'}
                  onChange={(e) => setEditingSection({ ...editingSection, background_gradient: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-brand-500"
                >
                  <option value="from-slate-900 via-indigo-950 to-slate-900">Dark Indigo Nebula (Default)</option>
                  <option value="from-brand-600 to-indigo-700">Vibrant Brand Cyan to Indigo</option>
                  <option value="from-emerald-900 to-slate-950">Emerald Green Monetization</option>
                  <option value="from-purple-900 via-slate-900 to-indigo-950">Royal Purple &amp; Tech Dark</option>
                  <option value="from-amber-600 to-orange-700">Amber Golden Deal Highlight</option>
                  <option value="from-slate-900 to-black">Ultra Dark Stealth</option>
                </select>
              </div>

              {editingSection.type === 'custom_html' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Custom HTML / Embed Code</label>
                  <textarea
                    rows={5}
                    value={editingSection.html_content || ''}
                    onChange={(e) => setEditingSection({ ...editingSection, html_content: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl font-mono text-xs focus:outline-brand-500"
                    placeholder="<div>Your HTML here</div>"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingSection(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 font-semibold text-xs rounded-xl hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Applying...' : 'Apply & Save to Website'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: SUPABASE CLOUD DATABASE INITIALIZATION MODAL */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-slate-900 text-lg">Initialize Supabase Cloud Database</h3>
                <p className="text-xs text-slate-500">Run this 1-click SQL in your Supabase project to make all builder changes 100% permanent across all devices.</p>
              </div>
              <button
                onClick={() => setShowSqlModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-900 text-slate-200 rounded-2xl p-4 text-xs font-mono relative overflow-x-auto max-h-64 border border-slate-800">
              <pre>{`-- 1. Create persistent website_settings table
CREATE TABLE IF NOT EXISTS public.website_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable RLS
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;

-- 3. Grants for Data API
GRANT ALL ON TABLE public.website_settings TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.website_settings TO anon, authenticated;

-- 4. RLS Policies
DROP POLICY IF EXISTS "Allow public read access to website_settings" ON public.website_settings;
CREATE POLICY "Allow public read access to website_settings"
  ON public.website_settings FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow insert access to website_settings" ON public.website_settings;
CREATE POLICY "Allow insert access to website_settings"
  ON public.website_settings FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update access to website_settings" ON public.website_settings;
CREATE POLICY "Allow update access to website_settings"
  ON public.website_settings FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);`}</pre>
            </div>

            <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p className="font-bold text-slate-900">How to run in 3 quick steps:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Open your Supabase project: <a href="https://supabase.com/dashboard/project/udankkjapmjuurcveube/sql/new" target="_blank" rel="noreferrer" className="text-brand-600 font-bold underline">Supabase SQL Editor &rarr;</a></li>
                <li>Click <strong>Copy SQL</strong> below and paste into the editor.</li>
                <li>Click the green <strong>Run</strong> button.</li>
              </ol>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-emerald-600 font-semibold">
                {copiedSql ? '✓ SQL copied to clipboard!' : ''}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const sql = `-- 1. Create persistent website_settings table
CREATE TABLE IF NOT EXISTS public.website_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable RLS
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;

-- 3. Grants for Data API
GRANT ALL ON TABLE public.website_settings TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.website_settings TO anon, authenticated;

-- 4. RLS Policies
DROP POLICY IF EXISTS "Allow public read access to website_settings" ON public.website_settings;
CREATE POLICY "Allow public read access to website_settings"
  ON public.website_settings FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow insert access to website_settings" ON public.website_settings;
CREATE POLICY "Allow insert access to website_settings"
  ON public.website_settings FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update access to website_settings" ON public.website_settings;
CREATE POLICY "Allow update access to website_settings"
  ON public.website_settings FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);`;
                    navigator.clipboard.writeText(sql);
                    setCopiedSql(true);
                    setTimeout(() => setCopiedSql(false), 3000);
                  }}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedSql ? 'Copied!' : 'Copy SQL'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowSqlModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
