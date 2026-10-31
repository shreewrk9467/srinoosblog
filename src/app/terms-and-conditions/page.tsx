import Link from 'next/link';
import { FileText } from 'lucide-react';

export const metadata = {
  title: 'Terms and Conditions | Srinoos',
  description: 'Terms and conditions governing the use of the Srinoos publication website.',
};

export default function TermsAndConditionsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-sm space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base">
        <div className="border-b border-slate-100 pb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 flex items-center gap-1.5 mb-2">
            <FileText className="w-4 h-4" /> Legal Agreement
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-xs text-slate-400 mt-2">Srinoos Digital Media &bull; 2026</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">1. Acceptance of Terms</h2>
          <p>
            By accessing and reading the website at <Link href="/" className="text-brand-600 underline">https://srinoos.com</Link>, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this site.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">2. Intellectual Property Rights</h2>
          <p>
            All original articles, tutorials, graphics, logos, and custom code on Srinoos are the intellectual property of <strong>Srinoos</strong> (&ldquo;Designed and Developed by Srinoos&rdquo;). You may quote excerpts with clear attribution and a do-follow link back to the source article. Scraping or republishing full articles without explicit permission is strictly prohibited.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">3. Disclaimer of Warranties</h2>
          <p>
            The materials on Srinoos are provided for informational and educational purposes only. While our editorial team rigorously verifies all software reviews, code tutorials, and SEO guides, technology changes rapidly. We make no warranties regarding accuracy or completeness.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">4. Advertising and Affiliate Links</h2>
          <p>
            Srinoos displays advertisements and affiliate links. Your dealings with advertisers or third-party merchants found on or through our website are solely between you and the respective third party.
          </p>
        </section>
      </div>
    </div>
  );
}

