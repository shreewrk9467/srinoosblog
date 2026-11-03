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
  Maximize2,
} from 'lucide-react';
import { PageSection, WebsiteSettings } from '@/lib/types';

// Default layout sections mirroring the current Sricospace Homepage
const DEFAULT_SECTIONS: PageSection[] = [
  {
    id: 'announcement_bar',
    type: 'announcement',
    title: 'Top Announcement Banner',
    enabled: true,
    headline: '⚡ Welcome to Sricospace — Discover Verified Tech, AI & Affiliate Insights (Made by Srinoos)',
    btn1_text: 'Explore Deals',
    btn1_link: '/offers',
    background_gradient: 'from-brand-600 to-indigo-700',
  },
  {
    id: 'top_ad',
    type: 'top_ad',
    title: 'Top Header Ad Placement',
    placementId: 'homepage-top',
    enabled: true,
  },
  {
    id: 'hero',
    type: 'hero',
    title: 'Hero Mission Banner',
    enabled: true,
    badge: '⚡ Technology Collective • Daily Dispatch',
    headline: 'Artificial Intelligence, Quantum Computing & Digital Growth Insights',
    subheadline: 'Deep technical analysis, high-speed full-stack development, and actionable online monetization playbooks designed for visionary digital builders.',
    btn1_text: 'Read All Articles',
    btn1_link: '/blog',
    btn2_text: 'Trending Topics',
    btn2_link: '/trending',
    background_gradient: 'from-slate-900 via-indigo-950 to-slate-900',
  },
  {
    id: 'featured_deals',
    type: 'deals',
    title: 'Featured Deals & Free Registration Offers',
    enabled: true,
    headline: 'Featured Deals & Free Registration Offers',
    subheadline: 'Curated partner promotions with verified eligibility',
  },
  {
    id: 'lead_feature',
    type: 'lead_feature',
    title: 'Lead Featured Article Spotlight',
    enabled: true,
  },
  {
    id: 'trending',
    type: 'trending',
    title: 'Trending on Srinoos (4-Col Grid)',
    enabled: true,
    headline: 'Trending on Srinoos',
  },
  {
    id: 'mid_ad',
    type: 'mid_ad',
    title: 'Mid-Page Content Ad Unit',
    placementId: 'homepage-between-sections',
    enabled: true,
  },
  {
    id: 'main_feed',
    type: 'main_feed',
    title: 'Main Categorized Articles & Sticky Sidebar',
    enabled: true,
  },
  {
    id: 'footer_ad',
    type: 'footer_ad',
    title: 'Above-Footer Ad Banner',
    placementId: 'global-above-footer',
    enabled: true,
  },
];

export default function AdminVisualBuilderPage() {
  const [sections, setSections] = useState<PageSection[]>(DEFAULT_SECTIONS);
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

  // Load existing settings
  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => {
        const s = d.settings || {};
        if (s.homepage_sections_order_json) {
          try {
            const parsed = JSON.parse(s.homepage_sections_order_json);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setSections(parsed);
            }
          } catch (e) {
            console.error('Failed to parse saved layout, using default:', e);
          }
        } else if (s.hero_headline || s.hero_subheadline || s.hero_lead_badge) {
          // Merge top-level settings into default hero section
          setSections((prev) =>
            prev.map((sec) =>
              sec.id === 'hero'
                ? {
                    ...sec,
                    headline: s.hero_headline || sec.headline,
                    subheadline: s.hero_subheadline || sec.subheadline,
                    badge: s.hero_lead_badge || sec.badge,
                  }
                : sec
            )
          );
        }
      })
      .catch((err) => console.error('Error fetching settings for builder:', err))
      .finally(() => setLoading(false));
  }, []);

  // Save changes to database
  const handleSaveLayout = async () => {
    setSaving(true);
    setSavedSuccess(false);
    try {
      // Find updated hero values to keep global settings synced
      const heroSection = sections.find((s) => s.type === 'hero');
      const announcementSection = sections.find((s) => s.type === 'announcement');

      const payload: Partial<WebsiteSettings> = {
        homepage_sections_order_json: JSON.stringify(sections),
      };

      if (heroSection) {
        if (heroSection.headline) payload.hero_headline = heroSection.headline;
        if (heroSection.subheadline) payload.hero_subheadline = heroSection.subheadline;
        if (heroSection.badge) payload.hero_lead_badge = heroSection.badge;
      }

      if (announcementSection) {
        payload.announcement_bar_enabled = announcementSection.enabled;
        payload.announcement_bar_text = announcementSection.headline;
        payload.announcement_bar_link = announcementSection.btn1_link;
      }

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save layout');

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Error saving layout');
    } finally {
      setSaving(false);
    }
  };

  // Drag and Drop Handlers
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

    const reordered = [...sections];
    const [movedItem] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIndex, 0, movedItem);

    setSections(reordered);
    setSelectedSectionId(movedItem.id);
    setDraggedIndex(null);
    setDropTargetIndex(null);
  };

  // Reorder buttons (Move Up / Down)
  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const reordered = [...sections];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    setSections(reordered);
    setSelectedSectionId(moved.id);
  };

  // Toggle Visibility
  const handleToggleVisibility = (id: string) => {
    setSections((prev) =>
      prev.map((sec) => (sec.id === id ? { ...sec, enabled: !sec.enabled } : sec))
    );
  };

  // Delete Section
  const handleDeleteSection = (id: string) => {
    if (!confirm('Are you sure you want to remove this section from the page?')) return;
    setSections((prev) => prev.filter((sec) => sec.id !== id));
    if (selectedSectionId === id) setSelectedSectionId(null);
  };

  // Duplicate Section
  const handleDuplicateSection = (sec: PageSection) => {
    const duplicate: PageSection = {
      ...sec,
      id: `sec-${Date.now()}`,
      title: `${sec.title} (Copy)`,
    };
    const index = sections.findIndex((s) => s.id === sec.id);
    const updated = [...sections];
    updated.splice(index + 1, 0, duplicate);
    setSections(updated);
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

    setSections((prev) =>
      prev.map((s) => (s.id === editingSection.id ? { ...editingSection } : s))
    );
    setEditingSection(null);
  };

  // Add New Section from Library
  const handleAddNewSection = (type: PageSection['type']) => {
    const newId = `custom-${type}-${Date.now()}`;
    let newBlock: PageSection;

    switch (type) {
      case 'custom_banner':
        newBlock = {
          id: newId,
          type: 'custom_banner',
          title: 'Promotional Callout Banner',
          enabled: true,
          badge: 'Limited Time Partner Offer',
          headline: 'Unlock 75% Off Cloud Infrastructure with Free SSL',
          subheadline: 'Claim enterprise cloud speed, dedicated CPU allocation, and 24/7 priority support.',
          btn1_text: 'Claim Offer Now',
          btn1_link: '/go/hostinger-promo',
          btn2_text: 'Learn More',
          btn2_link: '/offers',
          background_gradient: 'from-brand-900 via-indigo-950 to-slate-900',
        };
        break;
      case 'cta_box':
        newBlock = {
          id: newId,
          type: 'cta_box',
          title: 'Newsletter & Lead Capture Box',
          enabled: true,
          badge: 'Daily Tech Dispatch',
          headline: 'Stay Ahead of the Curve with Srinoos Research',
          subheadline: 'Join 15,000+ engineers, founders, and affiliate publishers receiving our weekly breakdown.',
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
          subheadline: 'Common questions about our guides, recommendations, and platform.',
          html_content: JSON.stringify([
            { q: 'How does Sricospace select affiliate partners?', a: 'We rigorously benchmark products for performance, uptime, and reader value before recommending them.' },
            { q: 'Is registration on Sricospace free?', a: 'Yes! All guides, benchmarks, and deal comparisons are 100% free for all readers.' },
          ]),
        };
        break;
      case 'testimonial_bar':
        newBlock = {
          id: newId,
          type: 'testimonial_bar',
          title: 'Social Proof & Partner Trust Bar',
          enabled: true,
          headline: 'Trusted by Digital Builders Worldwide',
          subheadline: 'Over 500,000+ monthly readers trust our verified technical benchmarks.',
          background_gradient: 'from-slate-900 to-slate-950',
        };
        break;
      case 'custom_html':
        newBlock = {
          id: newId,
          type: 'custom_html',
          title: 'Custom HTML / Rich Embed Block',
          enabled: true,
          html_content: '<div class="p-8 bg-slate-900 text-white rounded-2xl text-center"><h3 class="text-xl font-bold">Custom Embedded Widget</h3><p class="text-slate-400 text-sm mt-2">Paste any custom HTML, iframe, or affiliate widget here.</p></div>',
        };
        break;
      case 'hero':
        newBlock = {
          id: newId,
          type: 'hero',
          title: 'Alternative Hero Banner',
          enabled: true,
          badge: 'Special Announcement',
          headline: 'High-Impact Digital Insights for 2026',
          subheadline: 'Engineered for speed, search dominance, and predictable affiliate monetization.',
          btn1_text: 'Explore Deals',
          btn1_link: '/offers',
          background_gradient: 'from-purple-900 via-slate-900 to-indigo-950',
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

    const insertAt = addInsertIndex !== null ? addInsertIndex : sections.length;
    const updated = [...sections];
    updated.splice(insertAt, 0, newBlock);

    setSections(updated);
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24">
      {/* Top Header & Actions Bar */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-brand-50 text-brand-600 rounded-xl">
              <MousePointerClick className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Live Visual Website Builder
            </h1>
            <span className="px-2.5 py-0.5 bg-brand-100 text-brand-700 text-[11px] font-bold rounded-full">
              Full Page Drag &amp; Drop
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Click any element on the page canvas to edit text, swap links, add new sections, delete, or drag and drop to reorder.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
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

          {/* Save Button */}
          <button
            onClick={handleSaveLayout}
            disabled={saving}
            className="px-5 py-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : savedSuccess ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? 'Saving...' : savedSuccess ? 'Saved & Live!' : 'Save & Publish Live'}</span>
          </button>
        </div>
      </div>

      {/* Instructions Pill */}
      {isEditMode && (
        <div className="bg-indigo-50 border border-indigo-200/80 rounded-2xl p-3.5 flex items-center justify-between text-xs text-indigo-900">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <span>
              <strong>Visual Mode Active:</strong> Click on any section below to reveal its inline editing toolbar, or grab the <GripVertical className="w-3.5 h-3.5 inline text-indigo-500" /> handle to drag and drop sections up or down.
            </span>
          </div>
          <button
            onClick={() => {
              setAddInsertIndex(0);
              setShowAddModal(true);
            }}
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" /> Add Block at Top
          </button>
        </div>
      )}

      {/* Canvas Wrapper */}
      <div className="flex justify-center bg-slate-900/5 p-2 sm:p-6 rounded-3xl border border-slate-200/80 overflow-hidden min-h-[800px]">
        <div className={`transition-all duration-300 bg-white ${getDeviceClass()}`}>
          {/* Canvas Section Stack */}
          <div className="divide-y divide-slate-100">
            {sections.map((section, index) => {
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
                  {/* Floating Contextual Toolbar (Appears over active element on click) */}
                  {isEditMode && isSelected && (
                    <div className="absolute -top-12 left-4 z-40 bg-slate-950 text-white rounded-xl shadow-2xl border border-slate-700 px-2 py-1.5 flex items-center gap-1 text-xs animate-in fade-in zoom-in-95">
                      <div className="flex items-center gap-1 px-2 border-r border-slate-800 text-slate-300 font-mono text-[11px]">
                        <GripVertical className="w-3.5 h-3.5 text-brand-400 cursor-grab" />
                        <span className="font-bold text-white max-w-[120px] truncate">{section.title}</span>
                      </div>

                      {/* Edit Content Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEdit(section);
                        }}
                        className="p-1.5 hover:bg-slate-800 text-brand-300 rounded-lg flex items-center gap-1 font-semibold"
                        title="Edit element text, image &amp; links"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      {/* Add Block Below */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setAddInsertIndex(index + 1);
                          setShowAddModal(true);
                        }}
                        className="p-1.5 hover:bg-slate-800 text-emerald-400 rounded-lg flex items-center gap-1 font-semibold"
                        title="Insert new element below"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Below</span>
                      </button>

                      {/* Move Up */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMove(index, 'up');
                        }}
                        disabled={index === 0}
                        className="p-1.5 hover:bg-slate-800 disabled:opacity-30 rounded-lg"
                        title="Move Section Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      {/* Move Down */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMove(index, 'down');
                        }}
                        disabled={index === sections.length - 1}
                        className="p-1.5 hover:bg-slate-800 disabled:opacity-30 rounded-lg"
                        title="Move Section Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Duplicate */}
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

                      {/* Toggle Enabled */}
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

                      {/* Delete */}
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

                  {/* Section Visual Render Output */}
                  <div className="p-4 sm:p-6 cursor-pointer">
                    {/* 1. Announcement Bar */}
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

                    {/* 2. Top Ad Unit */}
                    {section.type === 'top_ad' && (
                      <div className="border border-dashed border-amber-300 bg-amber-50/50 rounded-2xl p-4 text-center">
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider">
                          <Tag className="w-3.5 h-3.5 text-amber-600" />
                          <span>Google AdSense Header Placement ({section.placementId || 'homepage-top'})</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Responsive Leaderboard (728x90 desktop / 320x50 mobile)
                        </p>
                      </div>
                    )}

                    {/* 3. Hero Mission Banner */}
                    {section.type === 'hero' && (
                      <div className={`rounded-3xl p-6 sm:p-10 text-white bg-gradient-to-r ${section.background_gradient || 'from-slate-900 via-indigo-950 to-slate-900'} relative overflow-hidden shadow-lg`}>
                        <div className="space-y-4 max-w-3xl">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-500/20 border border-brand-400/30 text-brand-300 rounded-full text-xs font-bold uppercase tracking-wider">
                            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                            {section.badge || '⚡ Technology Collective • Daily Dispatch'}
                          </span>
                          <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight font-display">
                            {section.headline || 'Your Headline Here'}
                          </h1>
                          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
                            {section.subheadline || 'Subheadline description explaining your brand value proposition.'}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 pt-2">
                            {section.btn1_text && (
                              <span className="px-5 py-2.5 bg-brand-600 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center gap-1.5">
                                {section.btn1_text} <ArrowRight className="w-3.5 h-3.5" />
                              </span>
                            )}
                            {section.btn2_text && (
                              <span className="px-5 py-2.5 bg-slate-800 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 inline-flex items-center gap-1.5">
                                <TrendingUp className="w-3.5 h-3.5 text-amber-400" /> {section.btn2_text}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 4. Featured Deals Showcase */}
                    {section.type === 'deals' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
                              <Gift className="w-4 h-4" />
                            </span>
                            <h3 className="font-bold text-slate-900 text-base">
                              {section.headline || 'Featured Deals & Free Registration Offers'}
                            </h3>
                          </div>
                          <span className="text-xs text-brand-600 font-bold">Explore All Offers &rarr;</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {['Hostinger 75% Off', 'Amazon Associates Picks', 'Zerodha Free Demat'].map((deal, idx) => (
                            <div key={idx} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1.5">
                              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-600 uppercase">CPA Offer</span>
                              <h4 className="font-bold text-xs text-slate-900">{deal}</h4>
                              <p className="text-[11px] text-slate-500">Verified partner promotion with instant tracking link.</p>
                              <span className="inline-block text-[11px] font-bold text-brand-600 underline">Claim Deal &rarr;</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 5. Lead Feature Article */}
                    {section.type === 'lead_feature' && (
                      <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row gap-4 items-center">
                        <div className="w-full sm:w-48 h-32 bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 text-xs font-semibold">
                          Featured Image
                        </div>
                        <div className="space-y-2 flex-1">
                          <span className="text-[10px] font-bold text-brand-400 uppercase tracking-wider">Lead Feature Spotlight</span>
                          <h4 className="font-bold text-base text-white">High-Speed Next.js Architecture for Affiliate Marketing</h4>
                          <p className="text-xs text-slate-300">Detailed breakdown of server-rendered blogs, Google Core Web Vitals, and tracking attribution.</p>
                          <span className="text-xs text-brand-300 font-bold inline-block">Read Article &rarr;</span>
                        </div>
                      </div>
                    )}

                    {/* 6. Trending Articles Grid */}
                    {section.type === 'trending' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-amber-500" />
                            {section.headline || 'Trending on Srinoos'}
                          </h3>
                          <span className="text-xs text-brand-600 font-semibold">All Trending &rarr;</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="p-2.5 border border-slate-100 rounded-xl bg-slate-50 space-y-1">
                              <div className="w-full h-16 bg-slate-200 rounded-lg" />
                              <span className="text-[9px] font-bold text-slate-400 uppercase">AI &amp; Tech</span>
                              <h5 className="font-bold text-[11px] text-slate-800 line-clamp-1">Trending Story #{i}</h5>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 7. Mid Ad Placement */}
                    {section.type === 'mid_ad' && (
                      <div className="border border-dashed border-slate-300 bg-slate-50 rounded-xl p-3 text-center">
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                          In-Feed Native Ad Slot ({section.placementId || 'homepage-between-sections'})
                        </span>
                      </div>
                    )}

                    {/* 8. Main Feed & Sidebar */}
                    {section.type === 'main_feed' && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2 space-y-3">
                          <h4 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-1.5">
                            Recent Publications Feed
                          </h4>
                          {[1, 2].map((i) => (
                            <div key={i} className="p-3 border border-slate-100 rounded-xl flex items-center gap-3">
                              <div className="w-16 h-14 bg-slate-100 rounded-lg flex-shrink-0" />
                              <div>
                                <h5 className="font-bold text-xs text-slate-900">Article Title #{i}</h5>
                                <p className="text-[11px] text-slate-500 line-clamp-1">Practical technical overview and case study.</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl space-y-2">
                          <h5 className="font-bold text-xs text-slate-900">Sidebar Widget</h5>
                          <p className="text-[11px] text-slate-500">Categories, sticky ads, and Srinoos editorial standards badge.</p>
                        </div>
                      </div>
                    )}

                    {/* 9. Custom Banner / Promo Callout */}
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

                    {/* 10. Call to Action Box */}
                    {section.type === 'cta_box' && (
                      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-brand-950 text-white border border-slate-800 text-center space-y-3">
                        <span className="px-2.5 py-0.5 bg-brand-500/20 text-brand-300 border border-brand-400/30 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          {section.badge || 'Newsletter & Updates'}
                        </span>
                        <h3 className="text-xl font-bold">{section.headline}</h3>
                        <p className="text-xs text-slate-300 max-w-md mx-auto">{section.subheadline}</p>
                        {section.btn1_text && (
                          <span className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow-xs inline-block">
                            {section.btn1_text}
                          </span>
                        )}
                      </div>
                    )}

                    {/* 11. FAQ Accordion Block */}
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

                    {/* 12. Social Proof / Testimonials */}
                    {section.type === 'testimonial_bar' && (
                      <div className="p-5 rounded-2xl bg-slate-900 text-white text-center space-y-2">
                        <ShieldCheck className="w-6 h-6 text-brand-400 mx-auto" />
                        <h4 className="font-bold text-sm text-white">{section.headline}</h4>
                        <p className="text-xs text-slate-400 max-w-md mx-auto">{section.subheadline}</p>
                      </div>
                    )}

                    {/* 13. Custom Raw HTML */}
                    {section.type === 'custom_html' && (
                      <div
                        className="rounded-2xl overflow-hidden"
                        dangerouslySetInnerHTML={{ __html: section.html_content || '<p>Empty HTML block</p>' }}
                      />
                    )}

                    {/* 14. Footer Ad */}
                    {section.type === 'footer_ad' && (
                      <div className="border border-dashed border-slate-300 bg-slate-50/70 rounded-xl p-3 text-center">
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                          Above Footer Ad Placement ({section.placementId || 'global-above-footer'})
                        </span>
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
                  setAddInsertIndex(sections.length);
                  setShowAddModal(true);
                }}
                className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 shadow-xs transition inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4 text-brand-600" />
                <span>Add New Section to Bottom</span>
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
                <h3 className="font-black text-slate-900 text-lg">Add New Section Block</h3>
                <p className="text-xs text-slate-500">
                  Select a pre-designed modular component to add to your page layout.
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
              {/* Option 1: Promotional Banner */}
              <button
                onClick={() => handleAddNewSection('custom_banner')}
                className="p-4 rounded-2xl border border-slate-200/90 hover:border-brand-500 hover:bg-brand-50/20 text-left transition group space-y-1.5"
              >
                <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-brand-600">Promotional Callout Banner</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  High-converting callout with custom headline, badge, and dual CTA buttons.
                </p>
              </button>

              {/* Option 2: Newsletter / CTA Box */}
              <button
                onClick={() => handleAddNewSection('cta_box')}
                className="p-4 rounded-2xl border border-slate-200/90 hover:border-brand-500 hover:bg-brand-50/20 text-left transition group space-y-1.5"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-brand-600">Lead Capture / Newsletter</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Engaging subscriber box with value proposition and sign-up button.
                </p>
              </button>

              {/* Option 3: FAQ Accordion */}
              <button
                onClick={() => handleAddNewSection('faq_accordion')}
                className="p-4 rounded-2xl border border-slate-200/90 hover:border-brand-500 hover:bg-brand-50/20 text-left transition group space-y-1.5"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-brand-600">FAQ Accordion Block</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Interactive Q&amp;A accordion structured for Google FAQPage schema.
                </p>
              </button>

              {/* Option 4: Social Proof & Trust Bar */}
              <button
                onClick={() => handleAddNewSection('testimonial_bar')}
                className="p-4 rounded-2xl border border-slate-200/90 hover:border-brand-500 hover:bg-brand-50/20 text-left transition group space-y-1.5"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-brand-600">Social Proof &amp; Trust Bar</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Display subscriber counts, ratings, and reader security guarantees.
                </p>
              </button>

              {/* Option 5: Custom HTML / Embed */}
              <button
                onClick={() => handleAddNewSection('custom_html')}
                className="p-4 rounded-2xl border border-slate-200/90 hover:border-brand-500 hover:bg-brand-50/20 text-left transition group space-y-1.5"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                  <FileCode className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-brand-600">Custom HTML / Embed</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Paste raw HTML, YouTube embeds, affiliate widgets, or third-party code.
                </p>
              </button>

              {/* Option 6: Secondary Hero */}
              <button
                onClick={() => handleAddNewSection('hero')}
                className="p-4 rounded-2xl border border-slate-200/90 hover:border-brand-500 hover:bg-brand-50/20 text-left transition group space-y-1.5"
              >
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-brand-600">Full Hero Showcase</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  High-impact gradient hero with custom background colors and links.
                </p>
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
              {/* Internal Title */}
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

              {/* Badge Text */}
              {editingSection.type !== 'top_ad' && editingSection.type !== 'mid_ad' && editingSection.type !== 'footer_ad' && (
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
              )}

              {/* Headline */}
              {editingSection.type !== 'top_ad' && editingSection.type !== 'mid_ad' && editingSection.type !== 'footer_ad' && (
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
              )}

              {/* Subheadline / Description */}
              {editingSection.type !== 'top_ad' && editingSection.type !== 'mid_ad' && editingSection.type !== 'footer_ad' && (
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
              )}

              {/* Call to Action Button 1 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Primary Button Label</label>
                  <input
                    type="text"
                    value={editingSection.btn1_text || ''}
                    onChange={(e) => setEditingSection({ ...editingSection, btn1_text: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-brand-500"
                    placeholder="e.g. Claim Offer Now"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Primary Button Link</label>
                  <input
                    type="text"
                    value={editingSection.btn1_link || ''}
                    onChange={(e) => setEditingSection({ ...editingSection, btn1_link: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-brand-500"
                    placeholder="e.g. /offers or /go/promo"
                  />
                </div>
              </div>

              {/* Call to Action Button 2 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Secondary Button Label</label>
                  <input
                    type="text"
                    value={editingSection.btn2_text || ''}
                    onChange={(e) => setEditingSection({ ...editingSection, btn2_text: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-brand-500"
                    placeholder="e.g. Trending Topics"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Secondary Button Link</label>
                  <input
                    type="text"
                    value={editingSection.btn2_link || ''}
                    onChange={(e) => setEditingSection({ ...editingSection, btn2_link: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-brand-500"
                    placeholder="e.g. /trending"
                  />
                </div>
              </div>

              {/* Background Gradient */}
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

              {/* Custom HTML Content (if custom_html) */}
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

              {/* Action Buttons */}
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
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Apply Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
