import Link from 'next/link';
import { Tag, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Advertisement Policy | Srinoos',
  description: 'Srinoos Advertising Standards & Google AdSense Publisher Compliance Policy.',
};

export default function AdPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-sm space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base">
        <div className="border-b border-slate-100 pb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 flex items-center gap-1.5 mb-2">
            <Tag className="w-4 h-4" /> Monetization Guidelines
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Advertisement Policy
          </h1>
          <p className="text-xs text-slate-400 mt-2">Google AdSense Compliant &bull; Srinoos</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">1. Placement Integrity & Google AdSense Guidelines</h2>
          <p>
            Srinoos adheres strictly to Google Publisher Policies and Google AdSense program regulations. We design our website layout to ensure advertisements never interfere with content readability or lead to accidental user clicks.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Clear Labeling:</strong> All ad placements are explicitly labeled &ldquo;ADVERTISEMENT&rdquo; or &ldquo;SPONSORED PROMOTION&rdquo;.</li>
            <li><strong>Adequate Separation:</strong> Ad units maintain strict padding and margin distances from navigation menus, download buttons, and interactive widgets.</li>
            <li><strong>Zero Artificial Encouragement:</strong> We strictly prohibit encouraging visitors to click advertisements or promising rewards for ad engagement.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">2. Prohibited Ad Content</h2>
          <p>
            Srinoos does not accept or serve advertisements that promote malicious software, deceptive technical support, counterfeit goods, or predatory financial schemes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">3. User Experience & Core Web Vitals</h2>
          <p>
            To avoid cumulative layout shifts (CLS), ad slots on Srinoos are reserved with predefined minimum dimensions. This prevents unexpected page jumping while articles are reading.
          </p>
        </section>
      </div>
    </div>
  );
}

