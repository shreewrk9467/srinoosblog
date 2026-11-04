import Link from 'next/link';
import {
  ShieldCheck,
  Target,
  Code2,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  BookOpen,
  Cpu,
  Zap,
  Briefcase,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import AdUnit from '@/components/AdUnit';
import { getWebsiteSettingsAsync } from '@/lib/db';
import { PageSection } from '@/lib/types';
import { getPageSections } from '@/lib/page-layouts';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AboutPage() {
  const settings = await getWebsiteSettingsAsync();

  const founderName = settings.founder_name || 'Ketanboina Venkat Shrinivas';
  const founderTitle = settings.founder_title || 'Founder, Full-Stack Engineer & Digital Growth Specialist';
  const founderBio = settings.about_me_bio || 'Hi! I am Ketanboina Venkat Shrinivas, a full-stack engineer and digital builder based in Pune, India. I founded Srinoos (hosted at sricospace.com) to create a premier publishing platform delivering actionable tutorials on Artificial Intelligence, modern web engineering, organic SEO growth, and digital monetization. Everything on this platform—from front-end architecture and backend database systems to AdSense monetization and automated daily publishing—is designed and developed by me.';
  const creditText = settings.credit_text || 'Designed and Developed by Srinoos';
  const domain = settings.custom_domain || 'sricospace.com';
  const contactEmail = settings.contact_email || 'ketanboinak@gmail.com';
  const phone = settings.phone || '+91 9665800844';
  const location = settings.location || 'Pune, India';
  const portfolioUrl = settings.portfolio_url || 'https://quiet-pony-c4f26b.netlify.app';

  // Load visual builder layout (always synchronized with Builder studio)
  const activeSections = getPageSections('about', settings).filter((sec: PageSection) => sec.enabled);

  const renderSection = (section: PageSection) => {
    switch (section.type) {
      case 'about_mission':
        return (
          <div key={section.id} className="text-center space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-50 border border-brand-200 text-brand-700 rounded-full text-xs font-bold uppercase tracking-wider shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              {section.badge || 'About the Creator & The Platform'}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              {section.headline || (
                <>
                  Hi, I&apos;m <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600">{founderName}</span>
                </>
              )}
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              {section.subheadline || (
                <>
                  Full-Stack Software Engineer, Creator of <strong className="text-slate-900 font-bold">Srinoos</strong>, and Lead Architect behind{' '}
                  <strong className="text-brand-600 font-semibold">{domain}</strong>.
                </>
              )}
            </p>
          </div>
        );

      case 'about_founder':
        return (
          <div
            key={section.id}
            className="bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 rounded-3xl text-white p-8 sm:p-12 shadow-xl border border-slate-800 relative overflow-hidden space-y-8"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-500/20 border border-brand-400/30 text-brand-300 rounded-full text-xs font-bold">
                      <Code2 className="w-3.5 h-3.5" /> Founder & Lead Architect
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/10 border border-white/10 text-slate-300 rounded-full text-xs font-medium">
                      <MapPin className="w-3.5 h-3.5 text-brand-400" /> {location}
                    </span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{section.headline || founderName}</h2>
                  <p className="text-sm text-brand-300 font-medium">{section.subheadline || founderTitle}</p>
                </div>

                <div className="flex flex-col sm:flex-row items-start lg:items-end gap-3">
                  <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700/80 px-4 py-2.5 rounded-2xl">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-950 flex-shrink-0 shadow-lg p-0.5">
                      <img
                        src={settings.logo_image_url || '/images/srinoos-s-icon.jpg'}
                        alt={`${settings.site_name || 'Srinoos'} Logo`}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Official Brand Identity</span>
                      <span className="text-xs font-black text-amber-400 block mt-0.5">{creditText}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Contact & Channel Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <a
                  href={`mailto:${contactEmail}`}
                  className="flex items-center gap-3 p-3.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/70 rounded-2xl text-xs transition"
                >
                  <div className="w-8 h-8 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="block text-[10px] text-slate-400 uppercase font-bold">Email</span>
                    <span className="text-slate-200 font-semibold truncate block">{contactEmail}</span>
                  </div>
                </a>

                <a
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-3 p-3.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/70 rounded-2xl text-xs transition"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-bold">Phone</span>
                    <span className="text-slate-200 font-semibold">{phone}</span>
                  </div>
                </a>

                <a
                  href={portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 bg-brand-600/20 hover:bg-brand-600/30 border border-brand-500/40 rounded-2xl text-xs transition"
                >
                  <div className="w-8 h-8 rounded-xl bg-brand-500/30 text-brand-300 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="block text-[10px] text-brand-300 uppercase font-bold">Live Portfolio</span>
                    <span className="text-brand-200 font-semibold truncate flex items-center gap-1">
                      View Projects <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </a>
              </div>

              {/* Bio Story */}
              <div className="space-y-4 pt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
                <p className="text-white font-medium text-base sm:text-lg leading-relaxed">
                  &ldquo;{founderBio}&rdquo;
                </p>
                <p className="text-slate-300 text-sm leading-relaxed">
                  I established Srinoos to eliminate the fluff in modern web publishing. Every single tutorial, comparison guide, and monetization breakdown on this site is crafted with technical precision, real benchmark data, and strict adherence to Google AdSense quality guidelines.
                </p>
              </div>

              {/* Badges / Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800">
                <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3 text-center">
                  <span className="block text-xl sm:text-2xl font-black text-white">20/Day</span>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Publishing Engine</span>
                </div>
                <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3 text-center">
                  <span className="block text-xl sm:text-2xl font-black text-emerald-400">100%</span>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Self-Architected</span>
                </div>
                <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3 text-center col-span-2 sm:col-span-1">
                  <span className="block text-xl sm:text-2xl font-black text-brand-400">10</span>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Tech Domains</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-md"
                >
                  <Mail className="w-4 h-4" /> Contact Me Directly
                </Link>
                <a
                  href={portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm rounded-xl border border-slate-700 transition"
                >
                  <Briefcase className="w-4 h-4 text-brand-400" /> View Portfolio <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800/60 hover:bg-slate-700 text-slate-300 font-bold text-xs sm:text-sm rounded-xl border border-slate-700/60 transition"
                >
                  <BookOpen className="w-4 h-4" /> Explore Articles
                </Link>
              </div>
            </div>
          </div>
        );

      case 'about_values':
        return (
          <div key={section.id} className="space-y-6">
            <div className="text-center max-w-xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {section.headline || 'Our Core Editorial Pillars'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {section.subheadline || 'Built on trust, technical rigor, and zero compromise on reader experience.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs hover:border-brand-300 transition">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4 shadow-xs">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">Search Intent Precision</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  We design every article around real search intent. Readers get concrete answers, practical code snippets, and proven methodologies without endless filler.
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs hover:border-emerald-300 transition">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 shadow-xs">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">Policy-Strict Monetization</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  We follow Google AdSense program policies to the letter. No deceptive click incentives, no aggressive overlays, and full FTC affiliate disclosures on every sponsored mention.
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs hover:border-indigo-300 transition">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 shadow-xs">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">Full-Stack Craftsmanship</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Rather than generic templates, this platform runs on a dedicated Next.js 14 architecture with high-speed server rendering, dynamic sitemaps, and optimized Core Web Vitals.
                </p>
              </div>
            </div>
          </div>
        );

      case 'top_ad':
      case 'mid_ad':
      case 'footer_ad':
        return (
          <div key={section.id}>
            <AdUnit placementId={section.placementId || 'homepage-between-sections'} />
          </div>
        );

      case 'cta_box':
        return (
          <div key={section.id} className="text-center pt-2 pb-6 space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              {section.headline || 'Have a Question or Business Inquiry?'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              {section.subheadline || 'Whether you want to suggest an article topic, explore advertising opportunities, or discuss software engineering, reach out directly.'}
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <Link
                href={section.btn1_link || '/contact'}
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-sm transition text-sm"
              >
                {section.btn1_text || 'Contact Ketanboina'} &rarr;
              </Link>
              <a
                href={portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-300 transition text-sm"
              >
                View Portfolio <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        );

      case 'custom_banner':
        return (
          <div
            key={section.id}
            className={`rounded-3xl bg-gradient-to-r ${section.background_gradient || 'from-brand-600 via-indigo-600 to-purple-600'} text-white p-8 sm:p-12 shadow-xl border border-white/10 relative overflow-hidden`}
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
                  <Link
                    href={section.btn1_link || '/contact'}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-bold rounded-xl text-xs sm:text-sm shadow-md hover:bg-slate-100 transition"
                  >
                    {section.btn1_text} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        );

      case 'faq_accordion':
        return (
          <div key={section.id} className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-2xs space-y-4">
            <div className="text-center max-w-xl mx-auto mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block mb-1">
                Frequently Asked Questions
              </span>
              <h2 className="text-2xl font-black text-slate-900">{section.headline || 'Editorial Standards & Transparency'}</h2>
              {section.subheadline && <p className="text-xs text-slate-500 mt-1">{section.subheadline}</p>}
            </div>
            <div className="space-y-3 max-w-2xl mx-auto text-left">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-brand-600" /> Who owns and operates Sricospace?
                </h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Sricospace.com is fully designed, engineered, and operated by Ketanboina Venkat Shrinivas under the brand Srinoos.
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-brand-600" /> What is the editorial policy on affiliate links?
                </h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Every product, host, or software recommended undergoes rigorous hands-on testing. Affiliate relationships never influence editorial scoring or honest review outcomes.
                </p>
              </div>
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
      {activeSections ? (
        activeSections.map((section) => renderSection(section))
      ) : (
        <>
          {/* Default Static Fallback */}
          <div className="text-center space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-50 border border-brand-200 text-brand-700 rounded-full text-xs font-bold uppercase tracking-wider shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              About the Creator & The Platform
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Hi, I&apos;m <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600">{founderName}</span>
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Full-Stack Software Engineer, Creator of <strong className="text-slate-900 font-bold">Srinoos</strong>, and Lead Architect behind{' '}
              <strong className="text-brand-600 font-semibold">{domain}</strong>.
            </p>
          </div>

          {/* Featured Profile */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 rounded-3xl text-white p-8 sm:p-12 shadow-xl border border-slate-800 relative overflow-hidden space-y-8">
            <div className="relative z-10 space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
                <div className="space-y-2">
                  <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{founderName}</h2>
                  <p className="text-sm text-brand-300 font-medium">{founderTitle}</p>
                </div>
                <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700/80 px-4 py-2.5 rounded-2xl">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Official Brand</span>
                    <span className="text-xs font-black text-amber-400 block mt-0.5">{creditText}</span>
                  </div>
                </div>
              </div>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">&ldquo;{founderBio}&rdquo;</p>
            </div>
          </div>

          <AdUnit placementId="homepage-between-sections" />

          {/* Core Principles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs">
              <Target className="w-8 h-8 text-brand-600 mb-3" />
              <h3 className="font-bold text-slate-900 text-lg mb-1">Search Intent Precision</h3>
              <p className="text-xs text-slate-600">Original tutorials engineered around real developer search intent.</p>
            </div>
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs">
              <ShieldCheck className="w-8 h-8 text-emerald-600 mb-3" />
              <h3 className="font-bold text-slate-900 text-lg mb-1">Policy-Strict Monetization</h3>
              <p className="text-xs text-slate-600">Full FTC disclosures and adherence to Google AdSense standards.</p>
            </div>
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs">
              <Cpu className="w-8 h-8 text-indigo-600 mb-3" />
              <h3 className="font-bold text-slate-900 text-lg mb-1">Full-Stack Craftsmanship</h3>
              <p className="text-xs text-slate-600">Dedicated Next.js 14 architecture with high-speed rendering.</p>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-sm space-y-4">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Platform Engineering: {creditText}</h2>
            <p className="text-slate-600 text-sm">Engineered with Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, and SQLite/PostgreSQL.</p>
          </div>
        </>
      )}
    </div>
  );
}
