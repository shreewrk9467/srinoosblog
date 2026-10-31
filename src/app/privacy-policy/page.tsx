import Link from 'next/link';
import { Shield } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Srinoos',
  description: 'Srinoos Privacy Policy detailing data collection, Google AdSense cookies, analytics, and visitor privacy rights.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-sm space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base">
        <div className="border-b border-slate-100 pb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 flex items-center gap-1.5 mb-2">
            <Shield className="w-4 h-4" /> Legal Notice
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-400 mt-2">Last updated: October 2026 &bull; Srinoos</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">1. Overview & Commitment</h2>
          <p>
            At <strong>Srinoos</strong> (accessible from <Link href="/" className="text-brand-600 underline">https://srinoos.com</Link>), the privacy of our visitors is of paramount importance. This Privacy Policy outlines the types of information collected and recorded by Srinoos and how we use it in full compliance with modern data privacy standards, including GDPR, CCPA, and Google Publisher policies.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">2. Google AdSense & DoubleClick DART Cookies</h2>
          <p>
            Google is a third-party vendor on our site. It uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to srinoos.com and other sites on the internet.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Third-party vendors, including Google, use cookies to serve ads based on a user’s prior visits to your website or other websites.</li>
            <li>Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to your sites and/or other sites on the Internet.</li>
            <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-brand-600 underline">Google Ads Settings</a>.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">3. Affiliate Links & External Tracking</h2>
          <p>
            Srinoos engages in affiliate marketing programs. When visitors click through configured affiliate promotions via our tracking endpoints, third-party affiliate networks may place tracking cookies on your device to attribute legitimate referral sales. These cookies contain no personally identifiable health or financial information.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">4. Log Files and Web Analytics</h2>
          <p>
            Srinoos follows standard log file protocols. When visitors navigate our pages, automated web server logs record internet protocol (IP) addresses, browser user-agent strings, referring/exit pages, date and time stamps, and basic engagement metrics. We use this aggregated non-personally identifiable data to monitor website performance and prevent automated bot spam.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">5. Contact Information</h2>
          <p>
            If you have questions regarding this policy or wish to exercise your data subject access rights, contact us at: <a href="mailto:contact@srinoos.com" className="text-brand-600 underline font-medium">contact@srinoos.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}

