import Link from 'next/link';
import { Cookie, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Cookie and Consent Information | Srinoos',
  description: 'Detailed information about how cookies are used on Srinoos for analytics, advertising, and user preferences.',
};

export default function CookieConsentPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-sm space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base">
        <div className="border-b border-slate-100 pb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 flex items-center gap-1.5 mb-2">
            <Cookie className="w-4 h-4" /> Policy Details
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Cookie & Consent Information
          </h1>
          <p className="text-xs text-slate-400 mt-2">Srinoos Compliance Guide &bull; 2026</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">What are Cookies?</h2>
          <p>
            Cookies are small text files placed on your device by websites you visit. They are widely used to make websites work efficiently, remember your reading preferences, and supply reporting information to publishers.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Types of Cookies Used on Srinoos</h2>
          
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-1">
            <h3 className="font-bold text-slate-900 text-sm">1. Strictly Necessary Cookies</h3>
            <p className="text-xs text-slate-600">
              Required for core site operation, secure admin session authentication, and remembering your cookie consent status. These cannot be disabled.
            </p>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-1">
            <h3 className="font-bold text-slate-900 text-sm">2. Performance & Analytics Cookies</h3>
            <p className="text-xs text-slate-600">
              Set by Google Analytics (GA4) to help us count visits and traffic sources so we can measure and improve the performance of our articles. All data is anonymized.
            </p>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-1">
            <h3 className="font-bold text-slate-900 text-sm">3. Advertising & Targeting Cookies</h3>
            <p className="text-xs text-slate-600">
              Set through our site by authorized advertising partners like Google AdSense. They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">Managing Your Cookie Preferences</h2>
          <p>
            You can modify your browser settings to refuse cookies or alert you when cookies are sent. For Google-specific advertising personalization, visit <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-brand-600 underline">Google Ads Settings</a>.
          </p>
        </section>
      </div>
    </div>
  );
}

