import Link from 'next/link';
import { ShieldCheck, Target, Award, Users, CheckCircle } from 'lucide-react';
import AdUnit from '@/components/AdUnit';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero */}
      <div className="text-center space-y-4">
        <span className="px-3 py-1 bg-brand-50 text-brand-600 rounded-full text-xs font-bold uppercase tracking-wider">
          About Srinoos
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          Empowering Builders with High-Value Tech & Monetization Insights
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          Srinoos is an independent digital media platform founded to bridge the gap between cutting-edge software technology and proven digital monetization.
        </p>
      </div>

      <div className="rounded-3xl overflow-hidden aspect-[16/8] shadow-md">
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80"
          alt="Srinoos Team & Editorial Office"
          className="w-full h-full object-cover"
        />
      </div>

      <AdUnit placementId="homepage-between-sections" />

      {/* Core Principles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg mb-2">Search Intent Precision</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            We write clear, complete answers that directly solve user queries without filler, fluff, or deceptive claims.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg mb-2">Editorial Independence</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Our software benchmarks and product comparisons remain unbiased. We test and evaluate tools objectively.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg mb-2">Ethical Monetization</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            All partner sponsorships, affiliate compensation, and Google AdSense units adhere strictly to global policies.
          </p>
        </div>
      </div>

      {/* Narrative Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-sm space-y-6 text-slate-700 leading-relaxed text-base">
        <h2 className="text-2xl font-bold text-slate-900">Our Publishing Mission</h2>
        <p>
          In an era cluttered with synthetic, repetitive automated posts, Srinoos focuses on editorial substance. We deliver actionable blueprints across artificial intelligence, technical SEO, cloud hosting infrastructure, and affiliate marketing.
        </p>
        <p>
          Whether you are launching your first organic blog or optimizing an existing digital property for AdSense revenue, our comprehensive guides provide step-by-step clarity supported by real-world benchmarks.
        </p>

        <h3 className="text-xl font-bold text-slate-900 pt-4">Designed & Developed by Srinoos</h3>
        <p>
          The Srinoos web application was engineered from the ground up utilizing modern full-stack web technologies: Next.js, React, TypeScript, Tailwind CSS, and resilient relational database storage. It is built for ultra-fast load times on both mobile and desktop networks.
        </p>
      </div>

      <div className="text-center pt-4">
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-sm transition"
        >
          Contact Our Editorial Team &rarr;
        </Link>
      </div>
    </div>
  );
}

