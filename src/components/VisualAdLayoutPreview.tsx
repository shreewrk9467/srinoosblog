'use client';

import { useState } from 'react';
import { AdPlacement } from '@/lib/types';
import { Monitor, Smartphone, Tablet, Eye, CheckCircle2, XCircle } from 'lucide-react';

interface VisualAdLayoutPreviewProps {
  placements: AdPlacement[];
  onSelectPlacement?: (id: string) => void;
}

export default function VisualAdLayoutPreview({ placements, onSelectPlacement }: VisualAdLayoutPreviewProps) {
  const [activeTab, setActiveTab] = useState<'homepage' | 'article'>('homepage');

  const getPlacement = (id: string) => placements.find((p) => p.id === id);

  const renderSlot = (id: string, label: string, sizeHint: string) => {
    const p = getPlacement(id);
    const isActive = p ? p.is_active : false;

    return (
      <div
        onClick={() => onSelectPlacement && onSelectPlacement(id)}
        className={`cursor-pointer transition border-2 border-dashed rounded-xl p-2.5 text-center my-2 text-xs flex flex-col items-center justify-center min-h-[50px] ${
          isActive
            ? 'bg-emerald-50/80 border-emerald-400 text-emerald-900 hover:bg-emerald-100/90'
            : 'bg-slate-100 border-slate-300 text-slate-500 hover:bg-slate-200/80 opacity-60'
        }`}
      >
        <div className="flex items-center gap-1.5 font-bold">
          {isActive ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <XCircle className="w-3.5 h-3.5 text-slate-400" />
          )}
          <span>{label}</span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono mt-0.5">
          {p ? `ID: ${p.id} • ${p.dimensions} • Type: ${p.ad_type}` : sizeHint}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Eye className="w-5 h-5 text-brand-600" /> Visual Wireframe & Ad Placement Preview
          </h3>
          <p className="text-xs text-slate-500">
            Interactive visual map of configured advertising units across desktop and mobile views.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('homepage')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              activeTab === 'homepage' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-600'
            }`}
          >
            Homepage Wireframe
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('article')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              activeTab === 'article' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-600'
            }`}
          >
            Article Page Wireframe
          </button>
        </div>
      </div>

      {activeTab === 'homepage' ? (
        /* Homepage Visual Wireframe */
        <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-3 font-sans">
          {/* Header */}
          <div className="bg-slate-900 text-white rounded-xl p-3 text-center text-xs font-bold">
            [Top Header: Srinoos Brand & Navigation Menu]
          </div>

          {/* Global Header Ad */}
          {renderSlot('global-header', 'Global Header Leaderboard', '728x90 / responsive')}

          {/* Hero Billboard */}
          {renderSlot('homepage-top', 'Homepage Top Billboard Ad', '970x250')}

          {/* Lead Article Grid */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-center text-xs text-slate-600 font-medium">
            [Lead Featured Story & Trending Articles Carousel]
          </div>

          {/* Mid Section Ad */}
          {renderSlot('homepage-between-sections', 'Homepage Mid-Section Banner Ad', '728x90')}

          {/* Two-Column Content & Sidebar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-8 space-y-3">
              <div className="bg-white border border-slate-200 rounded-xl p-4 text-center text-xs text-slate-600">
                [Technology & AI Topic Articles]
              </div>
              {renderSlot('homepage-feed-native', 'Feed Native In-Stream Ad', '300x250')}
              <div className="bg-white border border-slate-200 rounded-xl p-4 text-center text-xs text-slate-600">
                [Online Business & Latest Publications Feed]
              </div>
            </div>

            <div className="md:col-span-4 space-y-3">
              {renderSlot('sidebar-top', 'Sidebar Top Box Ad', '300x250')}
              <div className="bg-white border border-slate-200 rounded-xl p-4 text-center text-xs text-slate-600">
                [Explore Topics Category Pills Widget]
              </div>
              {renderSlot('sidebar-sticky', 'Sidebar Sticky Skyscraper Ad', '300x600')}
            </div>
          </div>

          {/* Above Footer Ad */}
          {renderSlot('global-above-footer', 'Above Footer Horizontal Ad', '728x90')}

          {/* Footer */}
          <div className="bg-slate-950 text-slate-400 rounded-xl p-4 text-center text-xs">
            [Footer: Designed and Developed by Srinoos &bull; Legal Links &bull; Newsletter]
          </div>
        </div>
      ) : (
        /* Article Page Visual Wireframe */
        <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-3 font-sans">
          {/* Header */}
          <div className="bg-slate-900 text-white rounded-xl p-3 text-center text-xs font-bold">
            [Navigation Header & Breadcrumbs]
          </div>

          {/* Before Content Ad */}
          {renderSlot('article-before-content', 'Article Top (Before Content) Ad', 'Responsive')}

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Main Article Body */}
            <div className="md:col-span-8 bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <div className="text-center font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
                [Article Title, Byline, Published Date & Featured Image]
              </div>

              {renderSlot('article-after-intro', 'In-Article: After Introduction', '336x280')}

              <div className="text-xs text-slate-500 py-2">
                [Editorial Content: Section 1, Search Intent Explanations, Code Snippets...]
              </div>

              {renderSlot('article-mid-content', 'In-Article: Mid-Content Unit', '300x250')}

              <div className="text-xs text-slate-500 py-2">
                [Editorial Content: Section 2, Comparison Benchmarks & FAQ Schema...]
              </div>

              {renderSlot('article-before-conclusion', 'In-Article: Before Conclusion', 'Responsive')}

              <div className="text-xs text-slate-500 py-2">
                [Editorial Content: Final Takeaway & Summary...]
              </div>

              {renderSlot('article-after-conclusion', 'In-Article: After Conclusion', '336x280')}

              {renderSlot('article-near-related', 'Near Related Articles Unit', 'Responsive')}
            </div>

            {/* Sticky Sidebar */}
            <div className="md:col-span-4 space-y-3">
              {renderSlot('sidebar-top', 'Right Sidebar Box Ad', '300x250')}
              <div className="bg-white border border-slate-200 rounded-xl p-4 text-center text-xs text-slate-600">
                [Related Category Articles Widget]
              </div>
              {renderSlot('sidebar-sticky', 'Right Sidebar Sticky Skyscraper Ad', '300x600')}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-950 text-slate-400 rounded-xl p-4 text-center text-xs">
            [Footer: Designed and Developed by Srinoos]
          </div>
        </div>
      )}
    </div>
  );
}

