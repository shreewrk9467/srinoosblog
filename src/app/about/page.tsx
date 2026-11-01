import Link from 'next/link';
import {
  ShieldCheck,
  Target,
  Award,
  CheckCircle,
  Code2,
  Sparkles,
  Globe,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  ArrowRight,
  BookOpen,
  Cpu,
  Zap,
  Briefcase,
  Layers,
} from 'lucide-react';
import AdUnit from '@/components/AdUnit';
import { getWebsiteSettings } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default function AboutPage() {
  const settings = getWebsiteSettings();

  const founderName = settings.founder_name || 'Ketanboina Venkat Shrinivas';
  const founderTitle = settings.founder_title || 'Founder, Full-Stack Engineer & Digital Growth Specialist';
  const founderBio = settings.about_me_bio || 'Hi! I am Ketanboina Venkat Shrinivas, a full-stack engineer and digital builder based in Pune, India. I founded Srinoos (hosted at sricospace.com) to create a premier publishing platform delivering actionable tutorials on Artificial Intelligence, modern web engineering, organic SEO growth, and digital monetization. Everything on this platform—from front-end architecture and backend database systems to AdSense monetization and automated daily publishing—is designed and developed by me.';
  const creditText = settings.credit_text || 'Designed and Developed by Srinoos';
  const domain = settings.custom_domain || 'sricospace.com';
  const contactEmail = settings.contact_email || 'ketanboinak@gmail.com';
  const phone = settings.phone || '+91 9665800844';
  const location = settings.location || 'Pune, India';
  const portfolioUrl = settings.portfolio_url || 'https://quiet-pony-c4f26b.netlify.app';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-50 border border-brand-200 text-brand-700 rounded-full text-xs font-bold uppercase tracking-wider shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          About the Creator & The Platform
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Hi, I&apos;m <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600">Ketanboina Venkat Shrinivas</span>
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          Full-Stack Software Engineer, Creator of <strong className="text-slate-900 font-bold">Srinoos</strong>, and Lead Architect behind{' '}
          <strong className="text-brand-600 font-semibold">{domain}</strong>.
        </p>
      </div>

      {/* Featured "About Me" Profile Card - Clean Typography (No Photo) */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 rounded-3xl text-white p-8 sm:p-12 shadow-xl border border-slate-800 relative overflow-hidden space-y-8">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Top Header Row with Name, Badges & Credit */}
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
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{founderName}</h2>
              <p className="text-sm text-brand-300 font-medium">{founderTitle}</p>
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

      <AdUnit placementId="homepage-between-sections" />

      {/* Core Principles Grid */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Our Core Editorial Pillars
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Built on trust, technical rigor, and zero compromise on reader experience.
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

      {/* Tech Stack & Design Architecture Showcase */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block mb-1">
              Platform Engineering
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Designed & Developed by Srinoos
            </h2>
          </div>
          <span className="px-3.5 py-1.5 bg-slate-900 text-white rounded-full text-xs font-bold self-start sm:self-auto">
            Production Build 2026
          </span>
        </div>

        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          The Srinoos web application was engineered from the ground up by Ketanboina Venkat Shrinivas using state-of-the-art modern technologies:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Frontend</span>
            <span className="text-base font-bold text-slate-900 block mt-1">Next.js 14 App Router</span>
            <span className="text-xs text-slate-500 mt-1 block">React 18 & TypeScript</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Styling</span>
            <span className="text-base font-bold text-slate-900 block mt-1">Tailwind CSS</span>
            <span className="text-xs text-slate-500 mt-1 block">Mobile-First Responsive</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Database</span>
            <span className="text-base font-bold text-slate-900 block mt-1">SQLite & PostgreSQL</span>
            <span className="text-xs text-slate-500 mt-1 block">Persistent Relational Storage</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Hosting Target</span>
            <span className="text-base font-bold text-slate-900 block mt-1">Hostinger / Vercel</span>
            <span className="text-xs text-slate-500 mt-1 block">sricospace.com</span>
          </div>
        </div>

        <div className="p-5 bg-brand-50/70 rounded-2xl border border-brand-200/80 text-xs sm:text-sm text-brand-900 leading-relaxed mt-4 flex items-start gap-3">
          <Zap className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Daily 20-Blog High-Velocity Publishing:</strong> The custom admin backend includes an AI drafting assistant, outline generator, automatic FAQ schema builder, and daily quota tracker designed to sustain publication of 20 high-quality articles per day.
          </div>
        </div>
      </div>

      {/* Footer Call to Action */}
      <div className="text-center pt-2 pb-6 space-y-4">
        <h3 className="text-xl font-bold text-slate-900">Have a Question or Business Inquiry?</h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Whether you want to suggest an article topic, explore advertising opportunities, or discuss software engineering, reach out directly.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-sm transition text-sm"
          >
            Contact Ketanboina &rarr;
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
    </div>
  );
}
