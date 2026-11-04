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
} from 'lucide-react';
import { PageSection, WebsiteSettings } from '@/lib/types';
import { PageKey, DEFAULT_PAGE_LAYOUTS } from '@/lib/page-layouts';

interface PageOption {
  key: PageKey;
  label: string;
  path: string;
  icon: any;
  description: string;
}

const PAGE_OPTIONS: PageOption[] = [
  { key: 'home', label: 'Home Page', path: '/', icon: Home, description: 'Hero banner, featured deals, articles feed & sidebar' },
  { key: 'blog', label: 'All Blogs', path: '/blog', icon: BookOpen, description: 'Article archive, category pills & search grid' },
  { key: 'trending', label: 'Trending', path: '/trending', icon: Flame, description: 'High-engagement viral publications & leaderboard ads' },
  { key: 'about', label: 'About Page', path: '/about', icon: User, description: 'Mission, founder story, editorial standards & values' },
  { key: 'contact', label: 'Contact Page', path: '/contact', icon: Mail, description: 'Contact form, editorial desk details & FAQs' },
  { key: 'category', label: 'Category Archive', path: '/category/technology-and-ai', icon: Folder, description: 'Category breadcrumbs, filtered feed & sponsor banners' },
  { key: 'offers', label: 'Affiliate Deals', path: '/offers', icon: Gift, description: 'CPA/CPS/CPL deals marketplace & redirect links' },
];

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

  // Initialize from URL parameters on client mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const pageParam = params.get('page') as PageKey | null;
      const returnParam = params.get('return');

      if (pageParam && DEFAULT_PAGE_LAYOUTS[pageParam]) {
        setCurrentPage(pageParam);
      }
      if (returnParam) {
        setReturnUrl(returnParam);
      }
    }
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

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error saving layout:', err);
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
    await persistLayouts(pageLayouts);
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

      {/* Active Page Info Banner */}
      <div className="bg-indigo-50 border border-indigo-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-indigo-950">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 bg-indigo-600 text-white rounded-lg">
            <activeOption.icon className="w-4 h-4" />
          </span>
          <div>
            <span className="font-bold text-sm block">Currently Customizing: {activeOption.label}</span>
            <span className="text-indigo-700 text-[11px] block">{activeOption.description} &bull; Live URL: <code>{activeOption.path}</code></span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href={activeOption.path}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-white hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg text-xs border border-indigo-200 flex items-center gap-1 shadow-2xs"
          >
            <span>View Live Page</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={() => {
              setAddInsertIndex(0);
              setShowAddModal(true);
            }}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" /> Add Block at Top
          </button>
        </div>
      </div>

      {/* Canvas Wrapper */}
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

                    {/* Blog & Trending Grids */}
                    {(section.type === 'blog_grid' || section.type === 'trending_grid' || section.type === 'category_grid' || section.type === 'main_feed' || section.type === 'trending') && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-brand-600" />
                            {section.title}
                          </h4>
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Headline Text</label>
                <input
                  type="text"
                  value={editingSection.headline || ''}
                  onChange={(e) => setEditingSection({ ...editingSection, headline: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-bold focus:outline-brand-500"
                  placeholder="Enter main headline"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description / Subtitle</label>
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
    </div>
  );
}
