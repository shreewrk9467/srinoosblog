import Link from 'next/link';
import { DollarSign, CheckCircle2, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Affiliate Disclosure | Srinoos',
  description: 'Full FTC-compliant affiliate marketing disclosure policy for Srinoos.',
};

export default function AffiliateDisclosurePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-sm space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base">
        <div className="border-b border-slate-100 pb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 flex items-center gap-1.5 mb-2">
            <DollarSign className="w-4 h-4" /> Transparency Statement
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Affiliate Disclosure
          </h1>
          <p className="text-xs text-slate-400 mt-2">FTC Compliance Guidelines &bull; Srinoos</p>
        </div>

        <div className="p-5 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-amber-900 text-sm space-y-2">
          <strong className="block font-bold">Summary for Our Readers:</strong>
          <p>
            Srinoos believes in 100% transparency. Some links on this site are &ldquo;affiliate links&rdquo;. This means if you click on the link and purchase the item or service, we may receive an affiliate commission at no extra cost to you.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">1. Why We Use Affiliate Links</h2>
          <p>
            Producing in-depth, verified tutorials, maintaining fast cloud infrastructure, and conducting objective software benchmarks incurs genuine operational expense. Affiliate commissions help support our editorial staff and allow us to keep all content freely accessible to the public without paywalls.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">2. Our Editorial Standards</h2>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>We never recommend products or software merely for higher commission payouts.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Our opinions, comparisons, and ratings are based strictly on practical testing.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>If a tool fails our speed, reliability, or security benchmarks, we explicitly say so.</span>
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">3. Attribute Standards for Search Engines</h2>
          <p>
            In compliance with Google Webmaster and Search Console recommendations, all outbound affiliate hyperlinks employ <code>rel=&quot;sponsored nofollow noopener&quot;</code> tags to maintain complete search index integrity.
          </p>
        </section>
      </div>
    </div>
  );
}

