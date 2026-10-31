import Link from 'next/link';
import { getAdPlacementById, getAffiliateBySlug, getWebsiteSettings } from '@/lib/db';
import { ExternalLink, Tag } from 'lucide-react';

interface AdUnitProps {
  placementId: string;
  className?: string;
  fallbackTitle?: string;
}

export default function AdUnit({ placementId, className = '', fallbackTitle }: AdUnitProps) {
  const placement = getAdPlacementById(placementId);
  const settings = getWebsiteSettings();

  // If placement not found or disabled globally
  if (!placement || !placement.is_active) {
    return null;
  }

  // Device visibility classes
  const visibilityClass = `
    ${placement.desktop_enabled ? 'lg:block' : 'lg:hidden'}
    ${placement.tablet_enabled ? 'md:block' : 'md:hidden'}
    ${placement.mobile_enabled ? 'block' : 'hidden'}
  `.trim();

  // Determine size classes based on placement dimensions/format
  let sizeStyles = 'min-h-[100px] w-full';
  if (placement.dimensions === '728x90') sizeStyles = 'min-h-[90px] max-w-[728px] mx-auto';
  else if (placement.dimensions === '300x250') sizeStyles = 'min-h-[250px] max-w-[300px] mx-auto';
  else if (placement.dimensions === '336x280') sizeStyles = 'min-h-[280px] max-w-[336px] mx-auto';
  else if (placement.dimensions === '300x600') sizeStyles = 'min-h-[600px] max-w-[300px] mx-auto';
  else if (placement.dimensions === '320x50') sizeStyles = 'min-h-[50px] max-w-[320px] mx-auto';
  else if (placement.dimensions === '970x250') sizeStyles = 'min-h-[250px] max-w-[970px] mx-auto';

  // Affiliate Promotion Mode
  if (placement.ad_type === 'affiliate' && placement.affiliate_promo_id) {
    const affiliate = getAffiliateBySlug(placement.affiliate_promo_id);
    if (affiliate && affiliate.is_active) {
      return (
        <aside
          aria-label="Affiliate Advertisement"
          className={`my-6 mx-auto ${sizeStyles} ${visibilityClass} ${className}`}
        >
          <div className="text-[10px] tracking-widest uppercase text-slate-500 font-semibold text-center mb-1 flex items-center justify-center gap-1">
            <Tag className="w-3 h-3 text-slate-500" /> Sponsored Promotion
          </div>
          <div className="relative group overflow-hidden rounded-xl border border-blue-200/60 bg-gradient-to-br from-blue-50/70 via-white to-slate-50 p-4 shadow-sm hover:shadow-md transition">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {affiliate.banner_url && (
                <div className="w-full sm:w-1/3 h-36 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                  <img
                    src={affiliate.banner_url}
                    alt={affiliate.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <span className="inline-block text-[11px] font-semibold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded mb-1">
                    {affiliate.campaign_name}
                  </span>
                  <h4 className="font-bold text-slate-900 text-base leading-snug group-hover:text-blue-600 transition">
                    {affiliate.title}
                  </h4>
                  {affiliate.description && (
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                      {affiliate.description}
                    </p>
                  )}
                </div>
                <div className="mt-3 flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
                  <span className="text-[10px] text-slate-500 italic">
                    {affiliate.disclosure_text || 'Sponsored / Affiliate partner'}
                  </span>
                  <Link
                    href={`/go/${affiliate.tracking_slug}?src=${placement.id}`}
                    target="_blank"
                    rel="sponsored nofollow noopener"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg transition shadow-sm"
                  >
                    View Offer <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </aside>
      );
    }
  }

  // Custom HTML Mode
  if (placement.ad_type === 'custom_html' && placement.custom_html) {
    return (
      <aside
        aria-label="Advertisement"
        className={`my-6 mx-auto ${sizeStyles} ${visibilityClass} ${className}`}
      >
        <div className="text-[10px] tracking-wider uppercase text-slate-500 font-semibold text-center mb-1">
          Advertisement
        </div>
        <div
          className="rounded-lg overflow-hidden border border-slate-200/80 p-2 bg-slate-50 text-center"
          dangerouslySetInnerHTML={{ __html: placement.custom_html }}
        />
      </aside>
    );
  }

  // Google AdSense Mode
  const isAdSenseActive = settings.adsense_active && settings.adsense_publisher_id;

  return (
    <aside
      aria-label="Advertisement"
      className={`my-6 mx-auto ${sizeStyles} ${visibilityClass} ${className}`}
    >
      <div className="text-[10px] tracking-widest uppercase text-slate-500 font-semibold text-center mb-1">
        Advertisement
      </div>
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-3 text-center flex flex-col items-center justify-center min-h-[90px] transition-colors">
        {isAdSenseActive && placement.ad_slot_id ? (
          <div className="w-full">
            {/* Official Google AdSense responsive ins element */}
            <ins
              className="adsbygoogle"
              style={{ display: 'block' }}
              data-ad-client={settings.adsense_publisher_id}
              data-ad-slot={placement.ad_slot_id}
              data-ad-format={placement.format === 'rectangle' ? 'rectangle' : 'auto'}
              data-full-width-responsive="true"
            />
            {/* Fallback visual preview in development & testing environments */}
            <div className="py-2 text-xs text-slate-500">
              <span className="font-medium text-slate-600">Google AdSense Space</span>
              <span className="block text-[11px] text-slate-500">
                Placement: {placement.name} ({placement.dimensions}) &bull; Slot #{placement.ad_slot_id}
              </span>
            </div>
          </div>
        ) : (
          <div className="py-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-600">{placement.name}</span>
            <span className="block text-[11px] text-slate-500">
              {placement.dimensions} &bull; Ready for AdSense / Affiliate Banner
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}

