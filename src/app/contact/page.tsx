import Link from 'next/link';
import { Mail, Phone, Globe, ExternalLink, Briefcase, MapPin, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';
import AdUnit from '@/components/AdUnit';
import ContactFormClient from '@/components/ContactFormClient';
import { getWebsiteSettings } from '@/lib/db';
import { PageSection } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function ContactPage() {
  const settings = getWebsiteSettings();

  const founderName = settings.founder_name || 'Ketanboina Venkat Shrinivas';
  const contactEmail = settings.contact_email || 'ketanboinak@gmail.com';
  const phone = settings.phone || '+91 9665800844';
  const location = settings.location || 'Pune, India';
  const portfolioUrl = settings.portfolio_url || 'https://quiet-pony-c4f26b.netlify.app';

  // Load visual builder layout if configured
  let activeSections: PageSection[] | null = null;
  if (settings.page_layouts_json) {
    try {
      const parsed = JSON.parse(settings.page_layouts_json);
      if (parsed && Array.isArray(parsed.contact) && parsed.contact.length > 0) {
        activeSections = parsed.contact.filter((sec: PageSection) => sec.enabled);
      }
    } catch { }
  }

  const renderContactInfoBlock = (section?: PageSection) => (
    <div key={section?.id || 'contact_info_block'} className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 block">Founder Desk</span>
          <h3 className="font-bold text-slate-900 text-lg">{founderName}</h3>
          <p className="text-xs text-slate-500">Srinoos Platform Lead & Full-Stack Architect</p>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-brand-50 text-brand-600 rounded-xl flex-shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs font-bold uppercase text-slate-400">Direct & Editorial Email</span>
            <a href={`mailto:${contactEmail}`} className="text-sm font-semibold text-brand-600 hover:underline">
              {contactEmail}
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl flex-shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs font-bold uppercase text-slate-400">Phone & WhatsApp</span>
            <a href={`tel:${phone.replace(/\s+/g, '')}`} className="text-sm font-semibold text-slate-800 hover:text-brand-600">
              {phone}
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl flex-shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <span className="block text-xs font-bold uppercase text-slate-400">Live Portfolio</span>
            <a
              href={portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-brand-600 hover:underline flex items-center gap-1 truncate"
            >
              quiet-pony-c4f26b.netlify.app <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl flex-shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs font-bold uppercase text-slate-400">Location</span>
            <span className="text-sm font-semibold text-slate-800">{location}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100">
          <a
            href={portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            <Briefcase className="w-4 h-4" /> View My Portfolio <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
          Advertising & Partnerships
        </span>
        <h4 className="font-bold text-base">Custom Brand Campaigns</h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          We partner with verified software vendors, digital services, and SaaS companies for transparent native placements.
        </p>
      </div>
    </div>
  );

  const renderSection = (section: PageSection) => {
    switch (section.type) {
      case 'contact_header':
        return (
          <div key={section.id} className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="px-3 py-1 bg-brand-50 text-brand-600 rounded-full text-xs font-bold uppercase tracking-wider">
              {section.badge || 'Get in Touch'}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              {section.headline || 'Contact Srinoos'}
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {section.subheadline || 'Have an editorial tip, sponsorship proposal, or advertising inquiry? Our team typically responds within 24 to 48 hours.'}
            </p>
          </div>
        );

      case 'top_ad':
      case 'mid_ad':
      case 'footer_ad':
        return (
          <div key={section.id}>
            <AdUnit placementId={section.placementId || 'homepage-top'} />
          </div>
        );

      case 'contact_form':
        return (
          <div key={section.id}>
            <ContactFormClient />
          </div>
        );

      case 'contact_info':
        return renderContactInfoBlock(section);

      case 'faq_accordion':
        return (
          <div key={section.id} className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-2xs space-y-4">
            <div className="text-center max-w-xl mx-auto mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block mb-1">
                Frequently Asked Questions
              </span>
              <h2 className="text-2xl font-black text-slate-900">{section.headline || 'Contact & Advertising FAQ'}</h2>
              {section.subheadline && <p className="text-xs text-slate-500 mt-1">{section.subheadline}</p>}
            </div>
            <div className="space-y-3 max-w-2xl mx-auto text-left">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-brand-600" /> What is the typical response time?
                </h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  All messages submitted via our contact form are routed straight to founder Ketanboina Venkat Shrinivas and answered within 24–48 hours.
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-brand-600" /> How can brands request affiliate onboarding?
                </h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Select &ldquo;Affiliate Partnership&rdquo; in the inquiry dropdown with your network tracking credentials or proposal.
                </p>
              </div>
            </div>
          </div>
        );

      case 'cta_box':
        return (
          <div
            key={section.id}
            className={`rounded-3xl bg-gradient-to-r ${section.background_gradient || 'from-slate-900 via-brand-950 to-slate-900'} text-white p-8 sm:p-12 text-center shadow-lg border border-slate-800 space-y-4`}
          >
            {section.badge && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-500/20 text-brand-300 rounded-full text-xs font-bold uppercase tracking-wider">
                {section.badge}
              </span>
            )}
            <h2 className="text-2xl sm:text-3xl font-black text-white">{section.headline || 'Direct Press & Advertising Desk'}</h2>
            {section.subheadline && (
              <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">{section.subheadline}</p>
            )}
            {section.btn1_text && (
              <div className="pt-2">
                <Link
                  href={section.btn1_link || '/about'}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-md"
                >
                  {section.btn1_text} &rarr;
                </Link>
              </div>
            )}
          </div>
        );

      case 'custom_banner':
        return (
          <div
            key={section.id}
            className={`rounded-3xl bg-gradient-to-r ${section.background_gradient || 'from-indigo-600 via-purple-600 to-brand-600'} text-white p-8 sm:p-12 shadow-xl border border-white/10 relative overflow-hidden`}
          >
            <div className="max-w-2xl relative z-10 space-y-3">
              {section.badge && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
                  <Sparkles className="w-3.5 h-3.5" /> {section.badge}
                </span>
              )}
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {section.headline || section.title}
              </h2>
              {section.subheadline && (
                <p className="text-slate-100 text-sm sm:text-base leading-relaxed">{section.subheadline}</p>
              )}
              {section.btn1_text && (
                <div className="pt-2">
                  <a
                    href={`mailto:${contactEmail}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-bold rounded-xl text-xs sm:text-sm shadow-md hover:bg-slate-100 transition"
                  >
                    {section.btn1_text} <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          </div>
        );

      case 'custom_html':
        return (section.html_content || section.html_code) ? (
          <div key={section.id} dangerouslySetInnerHTML={{ __html: section.html_content || section.html_code || '' }} />
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {activeSections ? (
        activeSections.map((section) => renderSection(section))
      ) : (
        <>
          {/* Default Standard Contact Layout */}
          <div className="text-center space-y-3">
            <span className="px-3 py-1 bg-brand-50 text-brand-600 rounded-full text-xs font-bold uppercase tracking-wider">
              Get in Touch
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Contact Srinoos
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
              Have an editorial tip, sponsorship proposal, or advertising inquiry? Our team typically responds within 24 to 48 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-5">{renderContactInfoBlock()}</div>
            <div className="md:col-span-7">
              <ContactFormClient />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
