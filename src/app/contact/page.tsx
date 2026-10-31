'use client';

import { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, ShieldCheck, MapPin, Phone, Globe, ExternalLink, Briefcase } from 'lucide-react';
import AdUnit from '@/components/AdUnit';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    type: 'general',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
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
        {/* Contact Info Sidebar */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 block">Founder Desk</span>
              <h3 className="font-bold text-slate-900 text-base">Ketanboina Venkat Shrinivas</h3>
              <p className="text-xs text-slate-500">Srinoos Platform Lead & Full-Stack Architect</p>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-brand-50 text-brand-600 rounded-xl flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs font-bold uppercase text-slate-400">Direct & Editorial Email</span>
                <a href="mailto:ketanboinak@gmail.com" className="text-sm font-semibold text-brand-600 hover:underline">
                  ketanboinak@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs font-bold uppercase text-slate-400">Phone & WhatsApp</span>
                <a href="tel:+919665800844" className="text-sm font-semibold text-slate-800 hover:text-brand-600">
                  +91 9665800844
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl flex-shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs font-bold uppercase text-slate-400">Live Portfolio</span>
                <a
                  href="https://quiet-pony-c4f26b.netlify.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-brand-600 hover:underline flex items-center gap-1"
                >
                  quiet-pony-c4f26b.netlify.app <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs font-bold uppercase text-slate-400">Location</span>
                <span className="text-sm font-semibold text-slate-800">
                  Pune, India
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <a
                href="https://quiet-pony-c4f26b.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                <Briefcase className="w-4 h-4" /> View My Portfolio <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
              Advertising & Partnerships
            </span>
            <h4 className="font-bold text-base">Custom Brand Campaigns</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              We partner with verified software vendors, digital services, and SaaS companies for transparent native placements.
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="md:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Message Received!</h3>
              <p className="text-sm text-slate-600 max-w-sm mx-auto">
                Thank you for contacting Srinoos. Our editorial desk has logged your inquiry and will respond to <strong>{formData.email}</strong> shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your Name"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Inquiry Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-500 focus:bg-white"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="advertising">Ad & Sponsorship</option>
                    <option value="editorial">Editorial Pitch / Correction</option>
                    <option value="partnership">Affiliate Partnership</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Brief summary..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Message *
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your inquiry in detail..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:border-brand-500 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl transition shadow-sm flex items-center justify-center gap-2"
              >
                Send Message <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

