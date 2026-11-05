import { PageSection, WebsiteSettings } from './types';

export type PageKey = 'home' | 'blog' | 'trending' | 'about' | 'contact' | 'category' | 'offers' | 'article';

export const DEFAULT_PAGE_LAYOUTS: Record<PageKey, PageSection[]> = {
  home: [
    {
      id: 'home_announcement',
      type: 'announcement',
      title: 'Top Announcement Banner',
      enabled: true,
      headline: '⚡ Welcome to Sricospace — Discover Verified Tech, AI & Affiliate Insights (Made by Srinoos)',
      btn1_text: 'Explore Deals',
      btn1_link: '/offers',
      background_gradient: 'from-brand-600 to-indigo-700',
    },
    {
      id: 'home_top_ad',
      type: 'top_ad',
      title: 'Top Header Ad Placement',
      placementId: 'homepage-top',
      enabled: true,
    },
    {
      id: 'home_hero',
      type: 'hero',
      title: 'Hero Mission Banner',
      enabled: true,
      badge: '⚡ Technology Collective • Daily Dispatch',
      headline: 'Artificial Intelligence, Quantum Computing & Digital Growth Insights',
      subheadline: 'Deep technical analysis, high-speed full-stack development, and actionable online monetization playbooks designed for visionary digital builders.',
      btn1_text: 'Read All Articles',
      btn1_link: '/blog',
      btn2_text: 'Trending Topics',
      btn2_link: '/trending',
      background_gradient: 'from-slate-900 via-indigo-950 to-slate-900',
    },
    {
      id: 'home_deals',
      type: 'deals',
      title: 'Featured Deals & Free Registration Offers',
      enabled: true,
      headline: 'Featured Deals & Free Registration Offers',
      subheadline: 'Curated partner promotions with verified eligibility',
    },
    {
      id: 'home_lead_feature',
      type: 'lead_feature',
      title: 'Lead Featured Article Spotlight',
      enabled: true,
    },
    {
      id: 'home_trending',
      type: 'trending',
      title: 'Trending on Srinoos (4-Col Grid)',
      enabled: true,
      headline: 'Trending on Srinoos',
    },
    {
      id: 'home_mid_ad',
      type: 'mid_ad',
      title: 'Mid-Page Content Ad Unit',
      placementId: 'homepage-between-sections',
      enabled: true,
    },
    {
      id: 'home_main_feed',
      type: 'main_feed',
      title: 'Main Categorized Articles & Sticky Sidebar',
      enabled: true,
    },
    {
      id: 'home_footer_ad',
      type: 'footer_ad',
      title: 'Above-Footer Ad Banner',
      placementId: 'global-above-footer',
      enabled: true,
    },
  ],

  blog: [
    {
      id: 'blog_header',
      type: 'blog_header',
      title: 'Article Archive Header & Search Box',
      enabled: true,
      badge: 'Srinoos Article Library',
      headline: 'All Guides, Reviews & Articles',
      subheadline: 'Explore our complete archive of original research on AI tools, organic SEO growth, digital monetization, and software comparisons.',
    },
    {
      id: 'blog_top_ad',
      type: 'top_ad',
      title: 'Top Archive Ad Banner',
      placementId: 'homepage-top',
      enabled: true,
    },
    {
      id: 'blog_grid',
      type: 'blog_grid',
      title: 'Articles Grid with Category Tabs & Pagination',
      enabled: true,
    },
    {
      id: 'blog_cta',
      type: 'cta_box',
      title: 'Newsletter & Guide Alerts Callout',
      enabled: true,
      badge: 'Weekly Dispatch',
      headline: 'Never Miss a Breakthrough Architecture Guide',
      subheadline: 'Subscribe to receive verified engineering teardowns, affiliate playbooks, and SEO updates.',
      btn1_text: 'Subscribe Free',
      btn1_link: '/contact',
      background_gradient: 'from-slate-900 via-brand-950 to-slate-900',
    },
    {
      id: 'blog_footer_ad',
      type: 'footer_ad',
      title: 'Above-Footer Ad Unit',
      placementId: 'global-above-footer',
      enabled: true,
    },
  ],

  trending: [
    {
      id: 'trending_header',
      type: 'trending_header',
      title: 'Trending & High-Engagement Header',
      enabled: true,
      badge: 'High Engagement • Viral Insights',
      headline: 'Trending Articles & Viral Insights',
      subheadline: 'The most shared and actively discussed publications on Srinoos today across tech, marketing, and monetization.',
    },
    {
      id: 'trending_top_ad',
      type: 'top_ad',
      title: 'Leaderboard Ad Unit',
      placementId: 'homepage-top',
      enabled: true,
    },
    {
      id: 'trending_grid',
      type: 'trending_grid',
      title: '3-Column Trending Publications Grid',
      enabled: true,
    },
    {
      id: 'trending_callout',
      type: 'custom_banner',
      title: 'Trending Technology Special Callout',
      enabled: true,
      badge: 'Editorial Teardown',
      headline: 'Next-Generation Full-Stack & AI Frameworks (2026)',
      subheadline: 'Discover the emerging patterns shaping modern software scalability and search discoverability.',
      btn1_text: 'Explore Technical Guides',
      btn1_link: '/blog',
      background_gradient: 'from-amber-600 via-orange-700 to-slate-950',
    },
    {
      id: 'trending_footer_ad',
      type: 'footer_ad',
      title: 'Above-Footer Ad Banner',
      placementId: 'global-above-footer',
      enabled: true,
    },
  ],

  about: [
    {
      id: 'about_mission',
      type: 'about_mission',
      title: 'Mission & Editorial Standards Hero',
      enabled: true,
      badge: 'About the Creator & The Platform',
      headline: 'Hi, I am Ketanboina Venkat Shrinivas',
      subheadline: 'Full-Stack Software Engineer, Creator of Srinoos, and Lead Architect behind sricospace.com.',
      background_gradient: 'from-slate-900 via-indigo-950 to-slate-900',
    },
    {
      id: 'about_founder',
      type: 'about_founder',
      title: 'Founder Profile & Portfolio Showcase (Srinoos Story)',
      enabled: true,
      headline: 'Meet the Founder: Ketanboina Venkat Shrinivas',
      subheadline: 'Founder, Full-Stack Engineer & Digital Growth Specialist',
    },
    {
      id: 'about_mid_ad',
      type: 'mid_ad',
      title: 'Mid-Page Content Ad Unit',
      placementId: 'homepage-between-sections',
      enabled: true,
    },
    {
      id: 'about_values',
      type: 'about_values',
      title: 'Core Publishing Principles Grid',
      enabled: true,
      headline: 'Our Foundational Principles',
      subheadline: 'How we test, verify, and maintain reader trust across all content.',
    },
    {
      id: 'about_cta',
      type: 'cta_box',
      title: 'Inquiries & Partner Desk Callout',
      enabled: true,
      badge: 'Direct Editorial Contact',
      headline: 'Have a Question or Business Inquiry?',
      subheadline: 'Whether you want to suggest an article topic, explore advertising opportunities, or discuss software engineering, reach out directly.',
      btn1_text: 'Contact Ketanboina',
      btn1_link: '/contact',
      background_gradient: 'from-slate-900 to-brand-950',
    },
    {
      id: 'about_footer_ad',
      type: 'footer_ad',
      title: 'Above-Footer Ad Banner',
      placementId: 'global-above-footer',
      enabled: true,
    },
  ],

  contact: [
    {
      id: 'contact_header',
      type: 'contact_header',
      title: 'Contact Header & Inquiries Overview',
      enabled: true,
      badge: 'Get in Touch with Srinoos',
      headline: 'Contact Sricospace Editorial & Support',
      subheadline: 'Have an editorial tip, sponsorship proposal, or advertising inquiry? Our team typically responds within 24 to 48 hours.',
    },
    {
      id: 'contact_top_ad',
      type: 'top_ad',
      title: 'Top Page Ad Placement',
      placementId: 'homepage-top',
      enabled: true,
    },
    {
      id: 'contact_info',
      type: 'contact_info',
      title: 'Direct Office Details & Verification Card',
      enabled: true,
      headline: 'Official Editorial Desk Details',
      subheadline: 'Direct communication channels for press, advertisers, and readers.',
    },
    {
      id: 'contact_form',
      type: 'contact_form',
      title: 'Interactive Message Form & Department Selector',
      enabled: true,
    },
    {
      id: 'contact_faq',
      type: 'faq_accordion',
      title: 'Inquiry & Response Time FAQ',
      enabled: true,
      headline: 'Contact & Advertising FAQ',
      subheadline: 'Quick answers regarding sponsored reviews, guest contributions, and response timelines.',
    },
    {
      id: 'contact_footer_ad',
      type: 'footer_ad',
      title: 'Above-Footer Ad Banner',
      placementId: 'global-above-footer',
      enabled: true,
    },
  ],

  category: [
    {
      id: 'category_header',
      type: 'category_header',
      title: 'Category Topic Hero & Breadcrumbs Banner',
      enabled: true,
      badge: 'Curated Topic Collection',
      headline: 'Topic Guides, Reviews & Industry Benchmarks',
      subheadline: 'In-depth tutorials and verified recommendations categorized for modern digital builders.',
    },
    {
      id: 'category_top_ad',
      type: 'top_ad',
      title: 'Topic Header Ad Unit',
      placementId: 'category-between-cards',
      enabled: true,
    },
    {
      id: 'category_grid',
      type: 'category_grid',
      title: 'Categorized Articles Feed & Topic Sidebar',
      enabled: true,
    },
    {
      id: 'category_cta',
      type: 'cta_box',
      title: 'Category Topic Newsletter Alert',
      enabled: true,
      badge: 'Topic Alerts',
      headline: 'Stay Updated on This Category',
      subheadline: 'Receive new benchmarks and tutorials as soon as they are published.',
      btn1_text: 'Get Topic Alerts',
      btn1_link: '/contact',
      background_gradient: 'from-slate-900 to-indigo-950',
    },
    {
      id: 'category_footer_ad',
      type: 'footer_ad',
      title: 'Above-Footer Ad Banner',
      placementId: 'global-above-footer',
      enabled: true,
    },
  ],

  offers: [
    {
      id: 'offers_header',
      type: 'offers_header',
      title: 'Deals Marketplace & Offers Hero',
      enabled: true,
      badge: '🔥 Exclusive Partner Portal',
      headline: 'Curated Deals, Free Registrations & Affiliate Offers',
      subheadline: 'Explore handpicked promotions across free trials, cloud web hosting, AI productivity tools, and business banking. Every link is verified with transparent eligibility criteria.',
      background_gradient: 'from-slate-950 via-slate-900 to-indigo-950',
    },
    {
      id: 'offers_top_ad',
      type: 'top_ad',
      title: 'Marketplace Header Ad',
      placementId: 'homepage-top',
      enabled: true,
    },
    {
      id: 'offers_grid',
      type: 'deals',
      title: 'Filterable Partner Offers Grid (CPA, CPL, CPS, CPI)',
      enabled: true,
      headline: 'All Active Partner Offers',
      subheadline: 'Filter by commission model, category, or discount value.',
    },
    {
      id: 'offers_faq',
      type: 'faq_accordion',
      title: 'Offer Eligibility & FTC Disclosure FAQ',
      enabled: true,
      headline: '⚖️ Transparent Affiliate Disclosure & Terms',
      subheadline: 'Important verification and disclosure information regarding partner links.',
    },
    {
      id: 'offers_footer_ad',
      type: 'footer_ad',
      title: 'Above-Footer Ad Banner',
      placementId: 'global-above-footer',
      enabled: true,
    },
  ],
  article: [
    {
      id: 'article_top_ad',
      type: 'top_ad',
      title: 'Article Top Ad Banner',
      placementId: 'article-before-content',
      enabled: true,
    },
    {
      id: 'article_header',
      type: 'hero',
      title: 'Article Header & Breadcrumbs',
      enabled: true,
      headline: 'Article Title & Metadata Header',
      subheadline: 'Category, Published Date, Reading Time, and Author Credentials',
    },
    {
      id: 'article_content',
      type: 'featured_feed',
      title: 'AI Formatted Article Content Body',
      enabled: true,
      headline: 'Intelligently Formatted Article Content',
      subheadline: 'Hierarchical H2/H3 headings, bold key metrics, scannable lists & styled callouts',
    },
    {
      id: 'article_faqs',
      type: 'faqs',
      title: 'FAQ Schema & Accordions',
      enabled: true,
      headline: 'Frequently Asked Questions (Rich Snippets)',
      subheadline: 'Structured QA answers for high-ranking search visibility',
    },
    {
      id: 'article_bottom_ad',
      type: 'footer_ad',
      title: 'Article Footer Ad Placement',
      placementId: 'article-before-conclusion',
      enabled: true,
    },
  ],
};

/**
 * Universal helper that retrieves active sections for any page across Sricospace.
 * Priority:
 * 1. settings.page_layouts_json[pageKey] (Universal Multi-Page Builder)
 * 2. settings.homepage_sections_order_json (for home page backwards-compat)
 * 3. DEFAULT_PAGE_LAYOUTS[pageKey]
 */
export function getPageSections(pageKey: PageKey, settings?: WebsiteSettings | null): PageSection[] {
  if (settings?.page_layouts_json) {
    try {
      const parsed = JSON.parse(settings.page_layouts_json);
      if (parsed && Array.isArray(parsed[pageKey]) && parsed[pageKey].length > 0) {
        return parsed[pageKey];
      }
    } catch {}
  }

  if (pageKey === 'home' && settings?.homepage_sections_order_json) {
    try {
      const parsedHome = JSON.parse(settings.homepage_sections_order_json);
      if (Array.isArray(parsedHome) && parsedHome.length > 0) {
        return parsedHome;
      }
    } catch {}
  }

  return DEFAULT_PAGE_LAYOUTS[pageKey] || [];
}

