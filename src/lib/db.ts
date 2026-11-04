/// <reference path="../types/sqlite.d.ts" />
import fs from 'fs';
import path from 'path';
import { DatabaseSync } from 'node:sqlite';
import {
  BlogPost,
  Category,
  AdPlacement,
  AffiliatePromotion,
  AffiliateNetwork,
  AffiliateConversion,
  AdClickEvent,
  WebsiteSettings,
  Comment,
  DailyGoalStatus,
} from './types';
import { DEFAULT_PAGE_LAYOUTS } from './page-layouts';

// Persistent data directory handling (Vercel serverless /tmp safe + local filesystem)
function resolveDatabasePath(): string {
  const isServerless = Boolean(
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.LAMBDA_TASK_ROOT
  );

  if (isServerless) {
    const tmpDbPath = path.join('/tmp', 'srinoos.db');
    try {
      const bundledDb = path.join(process.cwd(), 'data', 'srinoos.db');
      if (!fs.existsSync(tmpDbPath) && fs.existsSync(bundledDb)) {
        fs.copyFileSync(bundledDb, tmpDbPath);
      }
    } catch (e) {
      console.warn('Note: initializing fresh /tmp SQLite instance:', e);
    }
    return tmpDbPath;
  }

  try {
    const localDataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(localDataDir)) {
      fs.mkdirSync(localDataDir, { recursive: true });
    }
    return path.join(localDataDir, 'srinoos.db');
  } catch (err) {
    return path.join('/tmp', 'srinoos.db');
  }
}

// Single instance SQLite connection
let dbInstance: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (!dbInstance) {
    try {
      const dbPath = resolveDatabasePath();
      dbInstance = new DatabaseSync(dbPath);
      initSchema(dbInstance);
    } catch (err) {
      console.error('Failed to open persistent SQLite database, falling back to :memory::', err);
      try {
        dbInstance = new DatabaseSync(':memory:');
        initSchema(dbInstance);
      } catch (fatalErr) {
        console.error('Fatal: Failed to open in-memory SQLite database:', fatalErr);
        throw fatalErr;
      }
    }
  }
  return dbInstance;
}

function initSchema(db: DatabaseSync) {
  try {
    db.exec(`PRAGMA journal_mode = WAL;`);
  } catch (e) {
    // WAL mode pragma is safe to ignore in environments that do not support shared memory
  }

  db.exec(`
    PRAGMA busy_timeout = 5000;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT DEFAULT '',
      icon TEXT DEFAULT 'Folder',
      meta_title TEXT DEFAULT '',
      meta_description TEXT DEFAULT '',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS blog_posts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      featured_image TEXT NOT NULL,
      image_caption TEXT DEFAULT '',
      category_id TEXT NOT NULL,
      tags TEXT DEFAULT '',
      status TEXT DEFAULT 'draft',
      is_featured INTEGER DEFAULT 0,
      is_trending INTEGER DEFAULT 0,
      reading_time_minutes INTEGER DEFAULT 5,
      meta_title TEXT DEFAULT '',
      meta_description TEXT DEFAULT '',
      focus_keyword TEXT DEFAULT '',
      faq_schema TEXT DEFAULT '[]',
      scheduled_at TEXT,
      published_at TEXT,
      author_name TEXT DEFAULT 'Srinoos Editorial Team',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
    );

    CREATE TABLE IF NOT EXISTS ad_placements (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      location_zone TEXT NOT NULL,
      ad_type TEXT DEFAULT 'adsense',
      ad_slot_id TEXT DEFAULT '',
      format TEXT DEFAULT 'responsive',
      dimensions TEXT DEFAULT 'responsive',
      banner_image_url TEXT DEFAULT '',
      target_link_url TEXT DEFAULT '',
      headline TEXT DEFAULT '',
      description TEXT DEFAULT '',
      badge_text TEXT DEFAULT 'Sponsored',
      button_text TEXT DEFAULT 'Learn More',
      open_in_new_tab INTEGER DEFAULT 1,
      desktop_enabled INTEGER DEFAULT 1,
      tablet_enabled INTEGER DEFAULT 1,
      mobile_enabled INTEGER DEFAULT 1,
      is_active INTEGER DEFAULT 1,
      custom_html TEXT DEFAULT '',
      affiliate_promo_id TEXT DEFAULT '',
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS affiliate_promotions (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      banner_url TEXT DEFAULT '',
      description TEXT DEFAULT '',
      destination_url TEXT NOT NULL,
      tracking_slug TEXT UNIQUE NOT NULL,
      campaign_name TEXT DEFAULT 'Direct',
      disclosure_text TEXT DEFAULT 'Sponsored / Affiliate link',
      total_clicks INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ad_clicks (
      id TEXT PRIMARY KEY,
      tracking_slug TEXT NOT NULL,
      placement_id TEXT DEFAULT '',
      user_agent TEXT DEFAULT '',
      referrer TEXT DEFAULT '',
      ip_hash TEXT DEFAULT '',
      clicked_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS website_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      post_id TEXT NOT NULL,
      author_name TEXT NOT NULL,
      author_email TEXT NOT NULL,
      content TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at TEXT NOT NULL,
      FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      action TEXT NOT NULL,
      details TEXT DEFAULT '',
      user_name TEXT DEFAULT 'Admin',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS affiliate_networks (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      logo TEXT DEFAULT '',
      login_url TEXT DEFAULT '',
      affiliate_id TEXT DEFAULT '',
      api_key_masked TEXT DEFAULT '',
      commission_types TEXT DEFAULT 'CPS, CPL, CPA',
      notes TEXT DEFAULT '',
      status TEXT DEFAULT 'active',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS affiliate_conversions (
      id TEXT PRIMARY KEY,
      tracking_slug TEXT NOT NULL,
      offer_id TEXT DEFAULT '',
      offer_title TEXT DEFAULT '',
      network_name TEXT DEFAULT '',
      conversion_type TEXT DEFAULT 'CPA',
      commission_amount REAL DEFAULT 0,
      currency TEXT DEFAULT 'USD',
      status TEXT DEFAULT 'pending',
      country TEXT DEFAULT 'US',
      order_id TEXT DEFAULT '',
      recorded_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_posts_slug ON blog_posts(slug);
    CREATE INDEX IF NOT EXISTS idx_posts_status ON blog_posts(status);
    CREATE INDEX IF NOT EXISTS idx_posts_category ON blog_posts(category_id);
    CREATE INDEX IF NOT EXISTS idx_posts_published_at ON blog_posts(published_at);
    CREATE INDEX IF NOT EXISTS idx_ad_clicks_slug ON ad_clicks(tracking_slug);
    CREATE INDEX IF NOT EXISTS idx_aff_promos_category ON affiliate_promotions(category);
    CREATE INDEX IF NOT EXISTS idx_aff_promos_network ON affiliate_promotions(affiliate_network);
  `);

  // Column migrations for dynamic banner details
  try { db.exec('ALTER TABLE ad_placements ADD COLUMN banner_image_url TEXT DEFAULT ""'); } catch {}
  try { db.exec('ALTER TABLE ad_placements ADD COLUMN target_link_url TEXT DEFAULT ""'); } catch {}
  try { db.exec('ALTER TABLE ad_placements ADD COLUMN headline TEXT DEFAULT ""'); } catch {}
  try { db.exec('ALTER TABLE ad_placements ADD COLUMN description TEXT DEFAULT ""'); } catch {}
  try { db.exec('ALTER TABLE ad_placements ADD COLUMN badge_text TEXT DEFAULT "Sponsored"'); } catch {}
  try { db.exec('ALTER TABLE ad_placements ADD COLUMN button_text TEXT DEFAULT "Learn More"'); } catch {}
  try { db.exec('ALTER TABLE ad_placements ADD COLUMN open_in_new_tab INTEGER DEFAULT 1'); } catch {}

  // Safe Column migrations for Advanced Affiliate Marketing & Monetization
  try { db.exec('ALTER TABLE affiliate_promotions ADD COLUMN company_name TEXT DEFAULT ""'); } catch {}
  try { db.exec('ALTER TABLE affiliate_promotions ADD COLUMN company_logo TEXT DEFAULT ""'); } catch {}
  try { db.exec('ALTER TABLE affiliate_promotions ADD COLUMN category TEXT DEFAULT "Technology and Software"'); } catch {}
  try { db.exec('ALTER TABLE affiliate_promotions ADD COLUMN commission_model TEXT DEFAULT "CPA"'); } catch {}
  try { db.exec('ALTER TABLE affiliate_promotions ADD COLUMN payout_amount TEXT DEFAULT ""'); } catch {}
  try { db.exec('ALTER TABLE affiliate_promotions ADD COLUMN affiliate_network TEXT DEFAULT "Direct"'); } catch {}
  try { db.exec('ALTER TABLE affiliate_promotions ADD COLUMN eligibility_terms TEXT DEFAULT ""'); } catch {}
  try { db.exec('ALTER TABLE affiliate_promotions ADD COLUMN terms_conditions TEXT DEFAULT ""'); } catch {}
  try { db.exec('ALTER TABLE affiliate_promotions ADD COLUMN cta_button_text TEXT DEFAULT "Claim Offer"'); } catch {}
  try { db.exec('ALTER TABLE affiliate_promotions ADD COLUMN badge_text TEXT DEFAULT "Verified Deal"'); } catch {}
  try { db.exec('ALTER TABLE affiliate_promotions ADD COLUMN rating REAL DEFAULT 4.8'); } catch {}
  try { db.exec('ALTER TABLE affiliate_promotions ADD COLUMN is_featured INTEGER DEFAULT 0'); } catch {}
  try { db.exec('ALTER TABLE affiliate_promotions ADD COLUMN is_trending INTEGER DEFAULT 0'); } catch {}
  try { db.exec('ALTER TABLE affiliate_promotions ADD COLUMN expires_at TEXT'); } catch {}
  try { db.exec('ALTER TABLE affiliate_promotions ADD COLUMN status TEXT DEFAULT "active"'); } catch {}

  // Seed default admin and seed categories/ads if empty
  seedDefaults(db);
}

function seedDefaults(db: DatabaseSync) {
  // Check if admin user exists
  const adminCheck = db.prepare('SELECT count(*) as count FROM admin_users').get() as { count: number };
  if (adminCheck.count === 0) {
    // Default admin: admin@srinoos.com / Srinoos@Admin2026 (pre-hashed bcrypt or seed)
    // bcrypt hash for Srinoos@Admin2026: $2a$10$wE67X8zCqgH.l0W5p8Y/z.JqN9rM4N2bJbYk/b7q2e4dK5K0E8Gq2
    // Let's store a standard bcrypt hash
    const adminId = 'admin-user-1';
    db.prepare(`
      INSERT INTO admin_users (id, email, password_hash, full_name, role, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      adminId,
      'admin@srinoos.com',
      '$2a$10$Y1KqQ14R9wS3G8M.nN75lOC7qA6R98nE/YxW8E3e2GZ7O8tW9T8Y.', // Standard seeded password hash
      'Srinoos Administrator',
      'admin',
      new Date().toISOString()
    );
  }

  // Seed Default Categories
  const catCount = db.prepare('SELECT count(*) as count FROM categories').get() as { count: number };
  if (catCount.count === 0) {
    const defaultCategories = [
      { id: 'cat-tech-ai', name: 'Technology & AI', slug: 'technology-and-ai', description: 'Cutting-edge artificial intelligence, machine learning, and emerging tech innovations.', icon: 'Cpu' },
      { id: 'cat-software-apps', name: 'Software & Applications', slug: 'software-and-applications', description: 'Comprehensive software reviews, SaaS tools, and essential digital apps.', icon: 'Layers' },
      { id: 'cat-digital-marketing', name: 'Digital Marketing', slug: 'digital-marketing', description: 'Proven growth marketing tactics, organic traffic mastery, and conversion strategies.', icon: 'TrendingUp' },
      { id: 'cat-blogging-seo', name: 'Blogging & SEO', slug: 'blogging-and-seo', description: 'Actionable Google search optimization, long-tail keyword research, and high-ranking guides.', icon: 'Search' },
      { id: 'cat-online-business', name: 'Online Business', slug: 'online-business', description: 'Building scalable e-commerce, digital product models, and recurring revenue engines.', icon: 'Briefcase' },
      { id: 'cat-affiliate-marketing', name: 'Affiliate Marketing', slug: 'affiliate-marketing', description: 'High-converting affiliate campaigns, disclosure standards, and top partner programs.', icon: 'DollarSign' },
      { id: 'cat-finance', name: 'Personal Finance', slug: 'personal-finance', description: 'Smart wealth building, investment principles, and practical money management tips.', icon: 'CreditCard' },
      { id: 'cat-product-reviews', name: 'Product Comparisons', slug: 'product-comparisons', description: 'In-depth buyer guides, side-by-side head-to-head comparisons, and unbiased ratings.', icon: 'Scale' },
      { id: 'cat-tutorials', name: 'How-To Tutorials', slug: 'how-to-tutorials', description: 'Step-by-step developer tutorials, implementation walkthroughs, and practical guides.', icon: 'BookOpen' },
      { id: 'cat-latest-news', name: 'Latest Developments', slug: 'latest-developments', description: 'Timely analysis of trending tech shifts, industry updates, and global announcements.', icon: 'Zap' },
    ];

    const insertCat = db.prepare(`
      INSERT INTO categories (id, name, slug, description, icon, meta_title, meta_description, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const cat of defaultCategories) {
      insertCat.run(
        cat.id,
        cat.name,
        cat.slug,
        cat.description,
        cat.icon,
        `${cat.name} Articles, Guides & News | Srinoos`,
        cat.description,
        new Date().toISOString()
      );
    }
  }

  // Seed Default Website Settings
  const defaultSettings: WebsiteSettings = {
    site_name: 'Srinoos',
    site_tagline: 'Ideas, Insights, Innovation & Digital Growth',
    site_description: 'Srinoos is a premier publication providing actionable guides on AI technology, digital business, SEO mastery, and verified software comparisons.',
    site_url: 'https://sricospace.com',
    custom_domain: 'sricospace.com',
    hosting_provider: 'Hostinger',
    hosting_plan: 'Hostinger Cloud / Web Hosting (20 GB NVMe, 2048 MB RAM, 40 PHP Workers)',
    hosting_server_ip: '82.112.239.60',
    hosting_server_name: 'server1675',
    hosting_server_location: 'Asia (India)',
    hosting_ftp_host: 'ftp://sricospace.com',
    hosting_ftp_username: 'u397809276',
    hosting_disk_space: '20 GB',
    hosting_ram: '2048 MB',
    hosting_php_workers: 40,
    hosting_status: 'Active (LiteSpeed Server Online)',
    logo_text: 'Srinoos',
    contact_email: 'contact@srinoos.com',
    credit_text: 'Designed and Developed by Srinoos',
    adsense_publisher_id: 'ca-pub-9876543210123456',
    adsense_auto_ads: false,
    adsense_active: true,
    ads_txt_content: 'google.com, pub-9876543210123456, DIRECT, f08c47fec0942fa0',
    google_analytics_id: 'G-SRINOOS2026',
    google_search_console_tag: '<meta name="google-site-verification" content="uodEPcFClTUy1YlkAZF-QtHcAHBhYrkqXwyJmBq_D1I" />',
    facebook_url: 'https://facebook.com/srinoos',
    twitter_url: 'https://twitter.com/srinoos',
    linkedin_url: 'https://linkedin.com/company/srinoos',
    youtube_url: 'https://youtube.com/@srinoos',
  };

  const getSet = db.prepare('SELECT value FROM website_settings WHERE key = ?');
  const insertSet = db.prepare('INSERT OR REPLACE INTO website_settings (key, value) VALUES (?, ?)');
  
  if (!getSet.get('site_config')) {
    insertSet.run('site_config', JSON.stringify(defaultSettings));
  }

  // Seed Comprehensive Configurable Ad Placements (Zones A through E)
  const adCount = db.prepare('SELECT count(*) as count FROM ad_placements').get() as { count: number };
  if (adCount.count === 0) {
    const defaultPlacements: Array<{
      id: string;
      name: string;
      location_zone: 'global' | 'article' | 'sidebar' | 'homepage' | 'mobile';
      format: 'responsive' | 'rectangle' | 'leaderboard' | 'skyscraper' | 'banner';
      dimensions: string;
      desktop: number;
      tablet: number;
      mobile: number;
      active: number;
      slot: string;
    }> = [
      // Zone A: Global Placements
      { id: 'global-header', name: 'Global Header Leaderboard', location_zone: 'global', format: 'leaderboard', dimensions: '728x90', desktop: 1, tablet: 1, mobile: 0, active: 1, slot: '1001001001' },
      { id: 'global-below-nav', name: 'Below Navigation Banner', location_zone: 'global', format: 'responsive', dimensions: 'responsive', desktop: 1, tablet: 1, mobile: 1, active: 1, slot: '1001001002' },
      { id: 'global-above-footer', name: 'Above Footer Horizontal Unit', location_zone: 'global', format: 'leaderboard', dimensions: '728x90', desktop: 1, tablet: 1, mobile: 1, active: 1, slot: '1001001003' },
      { id: 'global-footer-promo', name: 'Footer Promotional Notice', location_zone: 'global', format: 'banner', dimensions: 'responsive', desktop: 1, tablet: 1, mobile: 1, active: 1, slot: '1001001004' },

      // Zone B: Blog Article Placements
      { id: 'article-before-content', name: 'Article Top (Before Content)', location_zone: 'article', format: 'responsive', dimensions: 'responsive', desktop: 1, tablet: 1, mobile: 1, active: 1, slot: '2002002001' },
      { id: 'article-after-intro', name: 'Article (After Introduction)', location_zone: 'article', format: 'rectangle', dimensions: '336x280', desktop: 1, tablet: 1, mobile: 1, active: 1, slot: '2002002002' },
      { id: 'article-mid-content', name: 'Article Middle Content', location_zone: 'article', format: 'rectangle', dimensions: '300x250', desktop: 1, tablet: 1, mobile: 1, active: 1, slot: '2002002003' },
      { id: 'article-before-conclusion', name: 'Article (Before Conclusion)', location_zone: 'article', format: 'responsive', dimensions: 'responsive', desktop: 1, tablet: 1, mobile: 1, active: 1, slot: '2002002004' },
      { id: 'article-after-conclusion', name: 'Article End (After Conclusion)', location_zone: 'article', format: 'rectangle', dimensions: '336x280', desktop: 1, tablet: 1, mobile: 1, active: 1, slot: '2002002005' },
      { id: 'article-near-related', name: 'Near Related Articles', location_zone: 'article', format: 'responsive', dimensions: 'responsive', desktop: 1, tablet: 1, mobile: 1, active: 1, slot: '2002002006' },

      // Zone C: Desktop Layout Placements
      { id: 'sidebar-top', name: 'Right Sidebar Top Box', location_zone: 'sidebar', format: 'rectangle', dimensions: '300x250', desktop: 1, tablet: 0, mobile: 0, active: 1, slot: '3003003001' },
      { id: 'sidebar-sticky', name: 'Right Sidebar Sticky Skyscraper', location_zone: 'sidebar', format: 'skyscraper', dimensions: '300x600', desktop: 1, tablet: 0, mobile: 0, active: 1, slot: '3003003002' },
      { id: 'sidebar-bottom', name: 'Right Sidebar Lower Unit', location_zone: 'sidebar', format: 'rectangle', dimensions: '300x250', desktop: 1, tablet: 0, mobile: 0, active: 1, slot: '3003003003' },

      // Zone D: Homepage and Category Placements
      { id: 'homepage-top', name: 'Homepage Top Hero Billboard', location_zone: 'homepage', format: 'responsive', dimensions: '970x250', desktop: 1, tablet: 1, mobile: 1, active: 1, slot: '4004004001' },
      { id: 'homepage-between-sections', name: 'Homepage Between Content Sections', location_zone: 'homepage', format: 'leaderboard', dimensions: '728x90', desktop: 1, tablet: 1, mobile: 1, active: 1, slot: '4004004002' },
      { id: 'homepage-feed-native', name: 'Feed Native Card Placement', location_zone: 'homepage', format: 'rectangle', dimensions: '300x250', desktop: 1, tablet: 1, mobile: 1, active: 1, slot: '4004004003' },
      { id: 'category-between-cards', name: 'Category Grid Mid-Stream Banner', location_zone: 'homepage', format: 'responsive', dimensions: 'responsive', desktop: 1, tablet: 1, mobile: 1, active: 1, slot: '4004004004' },

      // Zone E: Mobile Placements
      { id: 'mobile-top-banner', name: 'Mobile Header Banner', location_zone: 'mobile', format: 'banner', dimensions: '320x50', desktop: 0, tablet: 0, mobile: 1, active: 1, slot: '5005005001' },
      { id: 'mobile-in-content', name: 'Mobile Inline Article Card', location_zone: 'mobile', format: 'rectangle', dimensions: '300x250', desktop: 0, tablet: 0, mobile: 1, active: 1, slot: '5005005002' },
      { id: 'mobile-bottom-anchor', name: 'Mobile Sticky Bottom Bar', location_zone: 'mobile', format: 'banner', dimensions: '320x50', desktop: 0, tablet: 0, mobile: 1, active: 0, slot: '5005005003' },
    ];

    const insertPlacement = db.prepare(`
      INSERT INTO ad_placements (
        id, name, location_zone, ad_type, ad_slot_id, format, dimensions,
        desktop_enabled, tablet_enabled, mobile_enabled, is_active, custom_html, affiliate_promo_id, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const p of defaultPlacements) {
      insertPlacement.run(
        p.id,
        p.name,
        p.location_zone,
        'adsense',
        p.slot,
        p.format,
        p.dimensions,
        p.desktop,
        p.tablet,
        p.mobile,
        p.active,
        '',
        '',
        new Date().toISOString()
      );
    }
  }

  // Seed Default Affiliate Promotions
  const affCount = db.prepare('SELECT count(*) as count FROM affiliate_promotions').get() as { count: number };
  if (affCount.count === 0) {
    const defaultAffiliates = [
      {
        id: 'aff-hostinger',
        title: 'High-Performance Cloud Web Hosting (75% Off)',
        banner_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
        description: 'Fast, secure, NVMe-powered cloud hosting with free domain and SSL certificate.',
        destination_url: 'https://www.hostinger.com',
        tracking_slug: 'hostinger-cloud',
        campaign_name: 'Blogging Infrastructure',
        disclosure_text: 'Partner promotion: We receive a commission when you purchase through this link at no additional cost to you.',
      },
      {
        id: 'aff-semrush',
        title: 'SEMrush All-In-One SEO & Keyword Research Suite',
        banner_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
        description: 'Analyze competitors, discover high-volume long-tail keywords, and monitor search ranking.',
        destination_url: 'https://www.semrush.com',
        tracking_slug: 'semrush-pro',
        campaign_name: 'SEO Tools',
        disclosure_text: 'Affiliate partner link: Special 14-day free trial.',
      },
      {
        id: 'aff-anthropic',
        title: 'Claude 3.5 Sonnet & AI Developer API',
        banner_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
        description: 'Build autonomous coding agents and high-intelligence language applications.',
        destination_url: 'https://www.anthropic.com',
        tracking_slug: 'claude-ai',
        campaign_name: 'AI Platforms',
        disclosure_text: 'Recommended technology partner.',
      },
    ];

    const insertAff = db.prepare(`
      INSERT INTO affiliate_promotions (
        id, title, banner_url, description, destination_url, tracking_slug, campaign_name, disclosure_text, total_clicks, is_active, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const aff of defaultAffiliates) {
      insertAff.run(
        aff.id,
        aff.title,
        aff.banner_url,
        aff.description,
        aff.destination_url,
        aff.tracking_slug,
        aff.campaign_name,
        aff.disclosure_text,
        14,
        1,
        new Date().toISOString()
      );
    }
  }

  // Update existing seed offers with rich enterprise attributes if missing
  try {
    db.prepare(`
      UPDATE affiliate_promotions SET
        company_name = 'Hostinger',
        category = 'Hosting and Domains',
        commission_model = 'CPS',
        payout_amount = 'Up to 75% Off + Commission',
        affiliate_network = 'Direct',
        cta_button_text = 'Claim 75% Discount',
        badge_text = '🔥 Editor Choice',
        rating = 4.9,
        is_featured = 1,
        is_trending = 1,
        status = 'active'
      WHERE id = 'aff-hostinger' AND (company_name IS NULL OR company_name = '')
    `).run();

    db.prepare(`
      UPDATE affiliate_promotions SET
        company_name = 'SEMrush',
        category = 'Technology and Software',
        commission_model = 'CPL',
        payout_amount = '14-Day Free Trial ($5 / Free Trial)',
        affiliate_network = 'Impact',
        cta_button_text = 'Start Free 14-Day Trial',
        badge_text = '⚡ Verified Free Trial',
        rating = 4.8,
        is_featured = 1,
        status = 'active'
      WHERE id = 'aff-semrush' AND (company_name IS NULL OR company_name = '')
    `).run();

    db.prepare(`
      UPDATE affiliate_promotions SET
        company_name = 'Anthropic Claude',
        category = 'Digital Products and AI',
        commission_model = 'CPA',
        payout_amount = 'Pay-as-you-go Free Credits',
        affiliate_network = 'PartnerStack',
        cta_button_text = 'Explore Claude 3.5',
        badge_text = '🚀 AI Innovation',
        rating = 4.9,
        is_featured = 1,
        status = 'active'
      WHERE id = 'aff-anthropic' AND (company_name IS NULL OR company_name = '')
    `).run();
  } catch {}

  // Seed Rich Multi-Category Enterprise Affiliate Offers
  const enterpriseOffers = [
    {
      id: 'aff-canva-pro',
      title: 'Canva Pro Design Suite – 30 Days Free Registration',
      company_name: 'Canva',
      company_logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
      banner_url: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&auto=format&fit=crop&q=80',
      description: 'Create social media graphics, video reels, and brand kits with millions of premium stock assets.',
      destination_url: 'https://www.canva.com',
      tracking_slug: 'canva-pro-free',
      campaign_name: 'Creative Tools',
      category: 'Free Registration Offers',
      commission_model: 'CPL',
      payout_amount: 'Free 30-Day Pro Trial',
      affiliate_network: 'Impact',
      eligibility_terms: 'Instant access for verified new registrations.',
      terms_conditions: 'Terms apply. Zero billing during initial 30 days trial.',
      cta_button_text: 'Start Free 30-Day Trial',
      badge_text: '🎁 100% Free Registration',
      rating: 4.9,
      is_featured: 1,
      is_trending: 1,
      total_clicks: 28,
    },
    {
      id: 'aff-wise-banking',
      title: 'Wise Multi-Currency Digital Business Banking',
      company_name: 'Wise',
      company_logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=200&auto=format&fit=crop&q=80',
      banner_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80',
      description: 'Receive international affiliate payouts and customer transfers in 40+ currencies with real mid-market exchange rates.',
      destination_url: 'https://www.wise.com',
      tracking_slug: 'wise-business',
      campaign_name: 'FinTech Banking',
      category: 'Banking and Financial Services',
      commission_model: 'CPA',
      payout_amount: 'Free First Transfer up to $600',
      affiliate_network: 'Awin',
      eligibility_terms: 'Applicable to new verified business and personal accounts.',
      terms_conditions: 'Commissions disbursed upon completed qualifying transfer.',
      cta_button_text: 'Open Free Global Account',
      badge_text: '💳 Zero Foreign Markup',
      rating: 4.8,
      is_featured: 1,
      is_trending: 0,
      total_clicks: 19,
    },
    {
      id: 'aff-amazon-prime',
      title: 'Amazon Prime & Creator Shopping Electronics Deals',
      company_name: 'Amazon',
      company_logo: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80',
      banner_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      description: 'Access exclusive lightning deals, same-day delivery, and creator hardware discounts.',
      destination_url: 'https://www.amazon.com',
      tracking_slug: 'amazon-deals',
      campaign_name: 'Consumer E-Commerce',
      category: 'Shopping and E-commerce',
      commission_model: 'CPS',
      payout_amount: 'Up to 10% Qualifying Purchases',
      affiliate_network: 'Amazon Associates',
      eligibility_terms: 'Commissions credited on eligible cart checkouts within 24 hours.',
      terms_conditions: 'Subject to Amazon Associates Operating Agreement.',
      cta_button_text: 'Shop Today Deals',
      badge_text: '🛍️ Verified Marketplace',
      rating: 4.7,
      is_featured: 0,
      is_trending: 1,
      total_clicks: 34,
    },
    {
      id: 'aff-notion-ai',
      title: 'Notion AI Connected Workspace for Builders & Teams',
      company_name: 'Notion',
      company_logo: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=200&auto=format&fit=crop&q=80',
      banner_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
      description: 'All-in-one productivity suite: project roadmaps, automated AI writing, and unified databases.',
      destination_url: 'https://www.notion.so',
      tracking_slug: 'notion-workspace',
      campaign_name: 'SaaS Productivity',
      category: 'Technology and Software',
      commission_model: 'CPA',
      payout_amount: '50% Recurring Commission',
      affiliate_network: 'PartnerStack',
      eligibility_terms: 'Applies to qualifying Plus and Business team upgrades.',
      terms_conditions: 'Commissions tracked via PartnerStack monthly payouts.',
      cta_button_text: 'Try Notion Free',
      badge_text: '⭐ High Conversion',
      rating: 4.9,
      is_featured: 1,
      is_trending: 1,
      total_clicks: 22,
    },
    {
      id: 'aff-coursera-plus',
      title: 'Coursera Plus – 7,000+ Google, IBM & Meta Certifications',
      company_name: 'Coursera',
      company_logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop&q=80',
      banner_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
      description: 'Master in-demand machine learning, cybersecurity, cloud architecture, and data science skills with industry-recognized certificates.',
      destination_url: 'https://www.coursera.org',
      tracking_slug: 'coursera-certifications',
      campaign_name: 'Professional Education',
      category: 'Education and Courses',
      commission_model: 'CPS',
      payout_amount: '15% - 45% Course Commission',
      affiliate_network: 'Impact',
      eligibility_terms: 'Approved on paid subscriptions and individual professional certifications.',
      terms_conditions: '30-day cookie window applies.',
      cta_button_text: 'Enroll With 7-Day Free Trial',
      badge_text: '🎓 Verified Credentials',
      rating: 4.8,
      is_featured: 0,
      is_trending: 1,
      total_clicks: 16,
    },
    {
      id: 'aff-nordvpn',
      title: 'NordVPN Threat Protection & Ultra-Fast Encrypted Tunnel',
      company_name: 'Nord Security',
      company_logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=200&auto=format&fit=crop&q=80',
      banner_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
      description: 'Shield mobile devices and laptops against malware, intrusive tracking, and insecure public Wi-Fi networks.',
      destination_url: 'https://www.nordvpn.com',
      tracking_slug: 'nordvpn-security',
      campaign_name: 'Cybersecurity Apps',
      category: 'Mobile Applications',
      commission_model: 'CPI',
      payout_amount: '40% - 100% Signup Commission',
      affiliate_network: 'CJ Affiliate',
      eligibility_terms: 'Valid on 1-year and 2-year cybersecurity app subscriptions.',
      terms_conditions: 'Standard 30-day money-back guarantee honored.',
      cta_button_text: 'Get 68% Off + 3 Months Free',
      badge_text: '🛡️ #1 Privacy App',
      rating: 4.9,
      is_featured: 1,
      is_trending: 0,
      total_clicks: 25,
    },
  ];

  const insertOffer = db.prepare(`
    INSERT OR IGNORE INTO affiliate_promotions (
      id, title, banner_url, description, destination_url, tracking_slug, campaign_name, disclosure_text,
      total_clicks, is_active, created_at, company_name, company_logo, category, commission_model,
      payout_amount, affiliate_network, eligibility_terms, terms_conditions, cta_button_text, badge_text,
      rating, is_featured, is_trending, expires_at, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const o of enterpriseOffers) {
    try {
      insertOffer.run(
        o.id,
        o.title,
        o.banner_url,
        o.description,
        o.destination_url,
        o.tracking_slug,
        o.campaign_name,
        'Sponsored / Affiliate partner link: We may earn a commission upon verified qualification at no extra cost to you.',
        o.total_clicks,
        1,
        new Date().toISOString(),
        o.company_name,
        o.company_logo,
        o.category,
        o.commission_model,
        o.payout_amount,
        o.affiliate_network,
        o.eligibility_terms,
        o.terms_conditions,
        o.cta_button_text,
        o.badge_text,
        o.rating,
        o.is_featured,
        o.is_trending,
        null,
        'active'
      );
    } catch {}
  }

  // Seed Affiliate Networks if empty
  const netCount = db.prepare('SELECT count(*) as count FROM affiliate_networks').get() as { count: number };
  if (netCount.count === 0) {
    const defaultNetworks = [
      { id: 'net-amazon', name: 'Amazon Associates', logo: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80', commission_types: 'CPS (1% - 10%)', notes: 'Premier global e-commerce and retail affiliate network.', status: 'active' },
      { id: 'net-impact', name: 'Impact.com', logo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&auto=format&fit=crop&q=80', commission_types: 'CPA, CPL, CPS', notes: 'Enterprise partnership automation for Canva, Semrush, Coursera, Uber.', status: 'active' },
      { id: 'net-partnerstack', name: 'PartnerStack', logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&auto=format&fit=crop&q=80', commission_types: 'Recurring CPS, CPA', notes: 'B2B SaaS platforms: Notion, Webflow, Monday, Anthropic.', status: 'active' },
      { id: 'net-cj', name: 'CJ Affiliate (Commission Junction)', logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=200&auto=format&fit=crop&q=80', commission_types: 'CPS, CPL, CPI', notes: 'Established global retail, finance and tech brands.', status: 'active' },
      { id: 'net-awin', name: 'Awin', logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=200&auto=format&fit=crop&q=80', commission_types: 'CPS, CPA', notes: 'FinTech, travel, telecom and global retail network.', status: 'active' },
      { id: 'net-shareasale', name: 'ShareASale', logo: 'https://images.unsplash.com/photo-1556742049-0a67e557224f?w=200&auto=format&fit=crop&q=80', commission_types: 'CPS, CPL', notes: 'E-commerce merchants, digital downloads, web services.', status: 'active' },
      { id: 'net-earnkaro', name: 'EarnKaro', logo: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=200&auto=format&fit=crop&q=80', commission_types: 'CPS, CPL', notes: 'India leading deal-sharing and e-commerce affiliate platform.', status: 'active' },
      { id: 'net-cuelinks', name: 'Cuelinks', logo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=200&auto=format&fit=crop&q=80', commission_types: 'Automated 2-way monetization, CPS', notes: 'Content monetization tool for Indian and Southeast Asian publishers.', status: 'active' },
      { id: 'net-admitad', name: 'Admitad', logo: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=200&auto=format&fit=crop&q=80', commission_types: 'CPA, CPL, CPI', notes: 'Global publisher affiliate network with gaming, finance, mobile app offers.', status: 'active' },
      { id: 'net-vcommission', name: 'vCommission', logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&auto=format&fit=crop&q=80', commission_types: 'CPA, CPI, CPS, CPL', notes: 'First Indian affiliate network delivering performance marketing campaigns.', status: 'active' },
      { id: 'net-rakuten', name: 'Rakuten Advertising', logo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=200&auto=format&fit=crop&q=80', commission_types: 'CPS, CPA', notes: 'Premium brands, global affiliate and performance marketing network.', status: 'active' },
    ];

    const insertNet = db.prepare(`
      INSERT INTO affiliate_networks (id, name, logo, login_url, affiliate_id, api_key_masked, commission_types, notes, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const net of defaultNetworks) {
      insertNet.run(
        net.id,
        net.name,
        net.logo,
        `https://${net.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        '',
        '',
        net.commission_types,
        net.notes,
        net.status,
        new Date().toISOString()
      );
    }
  }

  // Seed Initial Affiliate Conversions if empty
  const convCount = db.prepare('SELECT count(*) as count FROM affiliate_conversions').get() as { count: number };
  if (convCount.count === 0) {
    const seedConversions = [
      { id: 'conv-101', slug: 'hostinger-cloud', offerId: 'aff-hostinger', offerTitle: 'High-Performance Cloud Web Hosting', network: 'Direct', type: 'CPS', amount: 65.00, currency: 'USD', status: 'approved', country: 'US', orderId: 'HST-882194' },
      { id: 'conv-102', slug: 'canva-pro-free', offerId: 'aff-canva-pro', offerTitle: 'Canva Pro Free 30-Day Registration', network: 'Impact', type: 'CPL', amount: 5.00, currency: 'USD', status: 'approved', country: 'IN', orderId: 'CNV-102941' },
      { id: 'conv-103', slug: 'semrush-pro', offerId: 'aff-semrush', offerTitle: 'SEMrush 14-Day Free Trial', network: 'Impact', type: 'CPL', amount: 10.00, currency: 'USD', status: 'approved', country: 'UK', orderId: 'SEM-773104' },
      { id: 'conv-104', slug: 'nordvpn-security', offerId: 'aff-nordvpn', offerTitle: 'NordVPN 2-Year Cybersecurity Plan', network: 'CJ Affiliate', type: 'CPI', amount: 32.50, currency: 'USD', status: 'pending', country: 'CA', orderId: 'NRD-441092' },
      { id: 'conv-105', slug: 'notion-workspace', offerId: 'aff-notion-ai', offerTitle: 'Notion AI Workspace Plus Upgrade', network: 'PartnerStack', type: 'CPA', amount: 48.00, currency: 'USD', status: 'pending', country: 'DE', orderId: 'NTN-661902' },
    ];

    const insertConv = db.prepare(`
      INSERT INTO affiliate_conversions (id, tracking_slug, offer_id, offer_title, network_name, conversion_type, commission_amount, currency, status, country, order_id, recorded_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const c of seedConversions) {
      insertConv.run(
        c.id,
        c.slug,
        c.offerId,
        c.offerTitle,
        c.network,
        c.type,
        c.amount,
        c.currency,
        c.status,
        c.country,
        c.orderId,
        new Date(Date.now() - Math.floor(Math.random() * 86400000 * 5)).toISOString()
      );
    }
  }

  // Seed Initial High-Quality Blog Posts
  const postCount = db.prepare('SELECT count(*) as count FROM blog_posts').get() as { count: number };
  if (postCount.count === 0) {
    const seedPosts = [
      {
        id: 'post-1',
        title: 'How to Build an Organic Traffic Engine with Modern SEO in 2026',
        slug: 'how-to-build-organic-traffic-engine-modern-seo',
        excerpt: 'Discover actionable strategies to rank #1 on Google using search intent clustering, rich schema markup, and long-tail keyword optimization.',
        content: `
<h2>The Shift in Search Engine Optimization</h2>
<p>In 2026, search algorithms reward deep, verified editorial substance over shallow keyword density. Creating topical authority requires systematically mapping user search intent and delivering comprehensive answers supported by structured data.</p>

<h3>1. Search Intent Clustering Over Single Keywords</h3>
<p>Modern searchers rarely type fragmented phrases; conversational and contextual search queries dominate. To build an organic traffic powerhouse, group your content into core pillar topics with interconnected cluster articles.</p>
<ul>
  <li><strong>Informational intent:</strong> Provide immediate, clear answers in the first 150 words.</li>
  <li><strong>Commercial intent:</strong> Present transparent comparison tables with genuine pros and cons.</li>
  <li><strong>Transactional intent:</strong> Ensure clean CTA buttons with explicit disclosure.</li>
</ul>

<h3>2. Technical SEO Foundations That Drive Rankings</h3>
<p>Ensure your site achieves near-instant mobile response times. Core Web Vitals, server-side rendering, and responsive image formats are non-negotiable prerequisites for competitive search positioning.</p>

<h3>3. Schema.org Structured Data</h3>
<p>Implement JSON-LD structured data for <code>Article</code>, <code>FAQPage</code>, and <code>BreadcrumbList</code> schemas. This ensures your articles qualify for rich search snippets and carousel displays.</p>
        `,
        featured_image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=1200&auto=format&fit=crop&q=80',
        category_id: 'cat-blogging-seo',
        tags: 'SEO, Organic Traffic, Google Search, Content Marketing',
        status: 'published',
        is_featured: 1,
        is_trending: 1,
        reading_time_minutes: 6,
        meta_title: 'How to Build an Organic Traffic Engine with Modern SEO (2026 Guide)',
        meta_description: 'Discover how to generate thousands of organic visitors from Google using modern search intent clustering, structured schema, and technical SEO best practices.',
        focus_keyword: 'organic traffic SEO',
        faq_schema: JSON.stringify([
          { question: 'How long does it take for a new blog to rank on Google?', answer: 'New high-quality articles with proper technical SEO and topic clustering typically start indexing within days and achieve ranking velocity within 4 to 12 weeks.' },
          { question: 'What is the ideal keyword density in 2026?', answer: 'Search engines analyze semantic relevance rather than strict keyword counts. Focus on natural language, synonyms, and thorough coverage of the topic.' }
        ]),
        published_at: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
      {
        id: 'post-2',
        title: 'Top 10 AI Tools Transforming Modern Digital Marketing Workflows',
        slug: 'top-10-ai-tools-transforming-digital-marketing-workflows',
        excerpt: 'From predictive analytics to automated content ideation, explore the essential AI platforms empowering lean growth marketing teams.',
        content: `
<h2>The Exponential Rise of AI-Assisted Marketing</h2>
<p>Digital marketing is experiencing its most profound transformation. Marketing professionals who adopt generative intelligence and data synthesis tools are executing workflows in minutes that previously required days.</p>

<h3>Key Application Categories</h3>
<p>Modern marketing stacks leverage artificial intelligence across three core operational pillars:</p>
<ol>
  <li><strong>Audience Persona & Intent Research:</strong> Uncovering real conversational pain points.</li>
  <li><strong>Content Structure & Outlining:</strong> Drafting well-structured educational material.</li>
  <li><strong>Predictive Campaign Optimization:</strong> Testing copy variations and targeting parameters automatically.</li>
</ol>
        `,
        featured_image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&auto=format&fit=crop&q=80',
        category_id: 'cat-tech-ai',
        tags: 'AI, Marketing Tools, Productivity, Automation',
        status: 'published',
        is_featured: 1,
        is_trending: 1,
        reading_time_minutes: 5,
        meta_title: 'Top 10 AI Tools Transforming Digital Marketing Workflows | Srinoos',
        meta_description: 'Explore the top AI software and automation platforms transforming marketing in 2026. Boost ROI and streamline campaign creation.',
        focus_keyword: 'AI tools digital marketing',
        faq_schema: JSON.stringify([
          { question: 'Can AI replace human content writers?', answer: 'AI serves as a powerful research and drafting assistant, but human domain expertise, editorial oversight, and factual verification remain vital for trustworthiness.' }
        ]),
        published_at: new Date(Date.now() - 3600000 * 8).toISOString(),
      },
      {
        id: 'post-3',
        title: 'Maximizing Website Monetization: Balancing AdSense and Affiliate Revenue',
        slug: 'maximizing-website-monetization-adsense-and-affiliate',
        excerpt: 'A comprehensive guide to strategically placing ad units and affiliate recommendations without degrading user experience or Core Web Vitals.',
        content: `
<h2>The Dual Monetization Paradigm</h2>
<p>Monetizing a modern publication requires a balanced strategy. Relying solely on display banners leaves potential revenue on the table, while excessive advertisements repel readers and harm search rankings.</p>

<h3>Strategic Placement Architecture</h3>
<p>To maximize revenue without sacrificing engagement, follow these principles:</p>
<ul>
  <li><strong>Hero Visibility:</strong> Place a high-performing leaderboard above or below the navigation.</li>
  <li><strong>In-Article Natural Breaks:</strong> Position responsive ad units after the introduction and midway through the article.</li>
  <li><strong>Contextual Affiliate Boxes:</strong> Integrate curated product cards with clear disclosure directly inside comparison sections.</li>
</ul>
        `,
        featured_image: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=1200&auto=format&fit=crop&q=80',
        category_id: 'cat-affiliate-marketing',
        tags: 'AdSense, Affiliate Marketing, Monetization, Online Business',
        status: 'published',
        is_featured: 0,
        is_trending: 1,
        reading_time_minutes: 7,
        meta_title: 'Maximizing Website Monetization: AdSense & Affiliate Strategy | Srinoos',
        meta_description: 'Learn how to maximize your blog income through compliant Google AdSense placements and ethical affiliate marketing programs.',
        focus_keyword: 'website monetization AdSense affiliate',
        faq_schema: JSON.stringify([
          { question: 'What is the FTC rule on affiliate links?', answer: 'Publishers must clearly and conspicuously disclose affiliate relationships before visitors click promotional links.' }
        ]),
        published_at: new Date(Date.now() - 3600000 * 16).toISOString(),
      },
      {
        id: 'post-4',
        title: 'Cloud Web Hosting Comparison 2026: Speed, Uptime, and Value Analyzed',
        slug: 'cloud-web-hosting-comparison-speed-uptime-value',
        excerpt: 'We benchmarked the leading cloud hosting providers across global TTFB, NVMe storage performance, server uptime, and customer support responsiveness.',
        content: `
<h2>Why Server Infrastructure Governs Your Growth</h2>
<p>Page load speed directly influences your bounce rate, conversion metrics, and Google Core Web Vitals rankings. Choosing a fast host is the single highest-leverage technical decision for any new digital publisher.</p>

<h3>Evaluation Criteria</h3>
<p>We tested each provider across 4 quantitative metrics:</p>
<ol>
  <li><strong>Time To First Byte (TTFB):</strong> Measured across 10 global test regions.</li>
  <li><strong>Uptime Reliability:</strong> 99.98% benchmark over 90 days.</li>
  <li><strong>Cache Layer Integration:</strong> Redis and LiteSpeed caching capability.</li>
  <li><strong>Pricing Transparency:</strong> Renewal rates and bundled SSL certificates.</li>
</ol>
        `,
        featured_image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80',
        category_id: 'cat-product-reviews',
        tags: 'Hosting, Cloud Servers, Web Performance, Reviews',
        status: 'published',
        is_featured: 0,
        is_trending: 0,
        reading_time_minutes: 8,
        meta_title: 'Cloud Web Hosting Comparison 2026: Performance & Uptime | Srinoos',
        meta_description: 'In-depth benchmark comparison of the best cloud web hosts for high-traffic blogs and digital businesses.',
        focus_keyword: 'best cloud web hosting',
        faq_schema: JSON.stringify([
          { question: 'What is a good TTFB for a blog?', answer: 'A Time To First Byte under 200ms is considered excellent by Google performance benchmarks.' }
        ]),
        published_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
      {
        id: 'post-5',
        title: 'How to Launch a Profitable Online Business with Zero Inventory',
        slug: 'how-to-launch-profitable-online-business-zero-inventory',
        excerpt: 'Step-by-step blueprint for building a resilient digital media enterprise, digital product catalog, and affiliate syndication business.',
        content: `
<h2>The Zero-Inventory Advantage</h2>
<p>Traditional commerce carries heavy inventory, shipping, and supply chain liabilities. Digital publishing and affiliate syndication allow entrepreneurs to build high-margin enterprises with lean operational overhead.</p>

<h3>The 4-Stage Growth Roadmap</h3>
<ul>
  <li><strong>Phase 1: Deep Niche Selection:</strong> Focus on problems with strong commercial intent.</li>
  <li><strong>Phase 2: Authority Content Asset:</strong> Publish 100+ comprehensive guides that answer specific search queries.</li>
  <li><strong>Phase 3: Diversified Monetization:</strong> Layer display ads, affiliate partnerships, and sponsored analysis.</li>
  <li><strong>Phase 4: Audience Retention:</strong> Build a high-converting weekly email newsletter.</li>
</ul>
        `,
        featured_image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop&q=80',
        category_id: 'cat-online-business',
        tags: 'Online Business, Entrepreneurship, Digital Media, Passive Income',
        status: 'published',
        is_featured: 0,
        is_trending: 0,
        reading_time_minutes: 6,
        meta_title: 'How to Launch an Online Business with Zero Inventory | Srinoos',
        meta_description: 'Actionable blueprint to build and scale a digital media and affiliate business with zero inventory and lean overhead.',
        focus_keyword: 'online business zero inventory',
        faq_schema: JSON.stringify([
          { question: 'What is the most profitable digital business model?', answer: 'Niche media publishing combined with high-ticket affiliate programs and digital products offers some of the highest profit margins (80%+).' }
        ]),
        published_at: new Date(Date.now() - 3600000 * 30).toISOString(),
      },
    ];

    const insertPost = db.prepare(`
      INSERT INTO blog_posts (
        id, title, slug, excerpt, content, featured_image, category_id, tags,
        status, is_featured, is_trending, reading_time_minutes, meta_title,
        meta_description, focus_keyword, faq_schema, published_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const p of seedPosts) {
      insertPost.run(
        p.id,
        p.title,
        p.slug,
        p.excerpt,
        p.content,
        p.featured_image,
        p.category_id,
        p.tags,
        p.status,
        p.is_featured,
        p.is_trending,
        p.reading_time_minutes,
        p.meta_title,
        p.meta_description,
        p.focus_keyword,
        p.faq_schema,
        p.published_at,
        p.published_at,
        p.published_at
      );
    }
  }
}

function toPlain<T>(data: T): T {
  if (data === null || data === undefined) return data;
  return JSON.parse(JSON.stringify(data));
}

// -------------------------------------------------------------
// POSTS CRUD & QUERIES
// -------------------------------------------------------------

export function getAllPosts(options: {
  status?: string;
  categoryId?: string;
  categorySlug?: string;
  tag?: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  limit?: number;
  offset?: number;
  search?: string;
} = {}): BlogPost[] {
  const db = getDb();
  let sql = `
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM blog_posts p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (options.status) {
    sql += ` AND p.status = ?`;
    params.push(options.status);
  }
  if (options.categoryId) {
    sql += ` AND p.category_id = ?`;
    params.push(options.categoryId);
  }
  if (options.categorySlug) {
    sql += ` AND c.slug = ?`;
    params.push(options.categorySlug);
  }
  if (options.isFeatured !== undefined) {
    sql += ` AND p.is_featured = ?`;
    params.push(options.isFeatured ? 1 : 0);
  }
  if (options.isTrending !== undefined) {
    sql += ` AND p.is_trending = ?`;
    params.push(options.isTrending ? 1 : 0);
  }
  if (options.search) {
    sql += ` AND (p.title LIKE ? OR p.excerpt LIKE ? OR p.content LIKE ? OR p.tags LIKE ?)`;
    const q = `%${options.search}%`;
    params.push(q, q, q, q);
  }

  sql += ` ORDER BY p.published_at DESC, p.created_at DESC`;

  if (options.limit) {
    sql += ` LIMIT ?`;
    params.push(options.limit);
    if (options.offset) {
      sql += ` OFFSET ?`;
      params.push(options.offset);
    }
  }

  const rows = db.prepare(sql).all(...params) as any[];
  return toPlain(rows.map((r) => ({
    ...r,
    is_featured: Boolean(r.is_featured),
    is_trending: Boolean(r.is_trending),
  })));
}

export function getPostBySlug(slug: string): BlogPost | null {
  const db = getDb();
  const row = db.prepare(`
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM blog_posts p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.slug = ?
  `).get(slug) as any;

  if (!row) return null;
  return toPlain({
    ...row,
    is_featured: Boolean(row.is_featured),
    is_trending: Boolean(row.is_trending),
  });
}

export function getPostById(id: string): BlogPost | null {
  const db = getDb();
  const row = db.prepare(`
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM blog_posts p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = ?
  `).get(id) as any;

  if (!row) return null;
  return toPlain({
    ...row,
    is_featured: Boolean(row.is_featured),
    is_trending: Boolean(row.is_trending),
  });
}

export function createPost(post: Partial<BlogPost>): BlogPost {
  const db = getDb();
  const id = post.id || `post-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();
  const publishedAt = post.status === 'published' ? (post.published_at || now) : null;

  let finalSlug = post.slug || `post-${Date.now()}`;
  let counter = 1;
  while (true) {
    const existing = db.prepare('SELECT id FROM blog_posts WHERE slug = ?').get(finalSlug);
    if (!existing) break;
    counter++;
    finalSlug = `${post.slug || 'post'}-${counter}`;
  }

  db.prepare(`
    INSERT INTO blog_posts (
      id, title, slug, excerpt, content, featured_image, image_caption,
      category_id, tags, status, is_featured, is_trending, reading_time_minutes,
      meta_title, meta_description, focus_keyword, faq_schema, scheduled_at,
      published_at, author_name, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    post.title || 'Untitled Post',
    finalSlug,
    post.excerpt || '',
    post.content || '',
    post.featured_image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80',
    post.image_caption || '',
    post.category_id || 'cat-blogging-seo',
    post.tags || '',
    post.status || 'draft',
    post.is_featured ? 1 : 0,
    post.is_trending ? 1 : 0,
    post.reading_time_minutes || 5,
    post.meta_title || post.title || '',
    post.meta_description || post.excerpt || '',
    post.focus_keyword || '',
    post.faq_schema || '[]',
    post.scheduled_at || null,
    publishedAt,
    post.author_name || 'Srinoos Editorial Team',
    now,
    now
  );

  return getPostById(id)!;
}

export function updatePost(id: string, post: Partial<BlogPost>): BlogPost | null {
  const db = getDb();
  const existing = getPostById(id);
  if (!existing) return null;

  const now = new Date().toISOString();
  const publishedAt = post.status === 'published' ? (post.published_at || existing.published_at || now) : existing.published_at;

  db.prepare(`
    UPDATE blog_posts SET
      title = coalesce(?, title),
      slug = coalesce(?, slug),
      excerpt = coalesce(?, excerpt),
      content = coalesce(?, content),
      featured_image = coalesce(?, featured_image),
      image_caption = coalesce(?, image_caption),
      category_id = coalesce(?, category_id),
      tags = coalesce(?, tags),
      status = coalesce(?, status),
      is_featured = coalesce(?, is_featured),
      is_trending = coalesce(?, is_trending),
      reading_time_minutes = coalesce(?, reading_time_minutes),
      meta_title = coalesce(?, meta_title),
      meta_description = coalesce(?, meta_description),
      focus_keyword = coalesce(?, focus_keyword),
      faq_schema = coalesce(?, faq_schema),
      scheduled_at = coalesce(?, scheduled_at),
      published_at = ?,
      updated_at = ?
    WHERE id = ?
  `).run(
    post.title ?? null,
    post.slug ?? null,
    post.excerpt ?? null,
    post.content ?? null,
    post.featured_image ?? null,
    post.image_caption ?? null,
    post.category_id ?? null,
    post.tags ?? null,
    post.status ?? null,
    post.is_featured !== undefined ? (post.is_featured ? 1 : 0) : null,
    post.is_trending !== undefined ? (post.is_trending ? 1 : 0) : null,
    post.reading_time_minutes ?? null,
    post.meta_title ?? null,
    post.meta_description ?? null,
    post.focus_keyword ?? null,
    post.faq_schema ?? null,
    post.scheduled_at ?? null,
    publishedAt,
    now,
    id
  );

  return getPostById(id);
}

export function deletePost(id: string): boolean {
  const db = getDb();
  const res = db.prepare('DELETE FROM blog_posts WHERE id = ?').run(id);
  return res.changes > 0;
}

export function upsertPostFromWordPress(post: Partial<BlogPost>): BlogPost {
  const db = getDb();
  const existing = (post.slug
    ? db.prepare('SELECT id FROM blog_posts WHERE slug = ?').get(post.slug)
    : null) || (post.id ? db.prepare('SELECT id FROM blog_posts WHERE id = ?').get(post.id) : null) as any;
  const now = new Date().toISOString();

  if (existing && existing.id) {
    db.prepare(`
      UPDATE blog_posts SET
        title = coalesce(?, title),
        excerpt = coalesce(?, excerpt),
        content = coalesce(?, content),
        featured_image = coalesce(?, featured_image),
        category_id = coalesce(?, category_id),
        status = coalesce(?, status),
        published_at = coalesce(?, published_at),
        author_name = coalesce(?, author_name),
        reading_time_minutes = coalesce(?, reading_time_minutes),
        meta_title = coalesce(?, meta_title),
        meta_description = coalesce(?, meta_description),
        updated_at = ?
      WHERE id = ?
    `).run(
      post.title ?? null,
      post.excerpt ?? null,
      post.content ?? null,
      post.featured_image ?? null,
      post.category_id ?? null,
      post.status ?? null,
      post.published_at ?? null,
      post.author_name ?? null,
      post.reading_time_minutes ?? null,
      post.meta_title ?? null,
      post.meta_description ?? null,
      now,
      existing.id
    );
    return getPostById(existing.id)!;
  } else {
    const id = post.id || `wp-post-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    db.prepare(`
      INSERT INTO blog_posts (
        id, title, slug, excerpt, content, featured_image, image_caption,
        category_id, tags, status, is_featured, is_trending, reading_time_minutes,
        meta_title, meta_description, focus_keyword, faq_schema, scheduled_at,
        published_at, author_name, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      post.title || 'Untitled Post',
      post.slug || `wp-${Date.now()}`,
      post.excerpt || '',
      post.content || '',
      post.featured_image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80',
      post.image_caption || '',
      post.category_id || 'cat-blogging-seo',
      post.tags || '',
      post.status || 'published',
      post.is_featured ? 1 : 0,
      post.is_trending ? 1 : 0,
      post.reading_time_minutes || 5,
      post.meta_title || post.title || '',
      post.meta_description || post.excerpt || '',
      post.focus_keyword || '',
      post.faq_schema || '[]',
      null,
      post.published_at || now,
      post.author_name || 'Srinoos Editorial Team',
      now,
      now
    );
    return getPostById(id)!;
  }
}

// -------------------------------------------------------------
// DAILY 20-BLOG PUBLISHING TRACKER
// -------------------------------------------------------------

export function getDailyPublishingProgress(): DailyGoalStatus {
  const db = getDb();
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  // Query posts created or published today
  const rows = db.prepare(`
    SELECT status, count(*) as count
    FROM blog_posts
    WHERE date(created_at) = ? OR date(published_at) = ?
    GROUP BY status
  `).all(today, today) as Array<{ status: string; count: number }>;

  let published = 0;
  let scheduled = 0;
  let draft = 0;
  let review = 0;

  for (const r of rows) {
    if (r.status === 'published') published += r.count;
    else if (r.status === 'scheduled') scheduled += r.count;
    else if (r.status === 'draft') draft += r.count;
    else if (r.status === 'review') review += r.count;
  }

  const target = 20;
  return toPlain({
    date: today,
    target,
    published_count: published,
    scheduled_count: scheduled,
    draft_count: draft,
    review_count: review,
    is_target_met: published >= target,
  });
}

// -------------------------------------------------------------
// CATEGORIES
// -------------------------------------------------------------

export function getAllCategories(): Category[] {
  const db = getDb();
  const rows = db.prepare(`
    SELECT c.*, count(p.id) as post_count
    FROM categories c
    LEFT JOIN blog_posts p ON c.id = p.category_id AND p.status = 'published'
    GROUP BY c.id
    ORDER BY c.name ASC
  `).all() as any[];
  return toPlain(rows);
}

export function getCategoryBySlug(slug: string): Category | null {
  const db = getDb();
  const row = db.prepare(`
    SELECT c.*, count(p.id) as post_count
    FROM categories c
    LEFT JOIN blog_posts p ON c.id = p.category_id AND p.status = 'published'
    WHERE c.slug = ?
    GROUP BY c.id
  `).get(slug) as any;
  return toPlain(row || null);
}

export function createCategory(cat: Partial<Category>): Category {
  const db = getDb();
  const id = cat.id || `cat-${Date.now()}`;
  db.prepare(`
    INSERT INTO categories (id, name, slug, description, icon, meta_title, meta_description, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    cat.name || 'New Category',
    cat.slug || `category-${Date.now()}`,
    cat.description || '',
    cat.icon || 'Folder',
    cat.meta_title || `${cat.name} | Srinoos`,
    cat.meta_description || cat.description || '',
    new Date().toISOString()
  );
  return getCategoryBySlug(cat.slug!)!;
}

// -------------------------------------------------------------
// AD PLACEMENTS & AFFILIATE SYSTEM
// -------------------------------------------------------------

export function getAllAdPlacements(): AdPlacement[] {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM ad_placements ORDER BY location_zone, name').all() as any[];
  return toPlain(rows.map((r) => ({
    ...r,
    open_in_new_tab: r.open_in_new_tab === undefined ? true : Boolean(r.open_in_new_tab),
    desktop_enabled: Boolean(r.desktop_enabled),
    tablet_enabled: Boolean(r.tablet_enabled),
    mobile_enabled: Boolean(r.mobile_enabled),
    is_active: Boolean(r.is_active),
  })));
}

export function getAdPlacementById(id: string): AdPlacement | null {
  const db = getDb();
  const r = db.prepare('SELECT * FROM ad_placements WHERE id = ?').get(id) as any;
  if (!r) return null;
  return toPlain({
    ...r,
    open_in_new_tab: r.open_in_new_tab === undefined ? true : Boolean(r.open_in_new_tab),
    desktop_enabled: Boolean(r.desktop_enabled),
    tablet_enabled: Boolean(r.tablet_enabled),
    mobile_enabled: Boolean(r.mobile_enabled),
    is_active: Boolean(r.is_active),
  });
}

export function updateAdPlacement(id: string, placement: Partial<AdPlacement>): AdPlacement | null {
  const db = getDb();
  const existing = getAdPlacementById(id);
  if (!existing) return null;

  db.prepare(`
    UPDATE ad_placements SET
      name = coalesce(?, name),
      location_zone = coalesce(?, location_zone),
      ad_type = coalesce(?, ad_type),
      ad_slot_id = coalesce(?, ad_slot_id),
      format = coalesce(?, format),
      dimensions = coalesce(?, dimensions),
      banner_image_url = coalesce(?, banner_image_url),
      target_link_url = coalesce(?, target_link_url),
      headline = coalesce(?, headline),
      description = coalesce(?, description),
      badge_text = coalesce(?, badge_text),
      button_text = coalesce(?, button_text),
      open_in_new_tab = coalesce(?, open_in_new_tab),
      desktop_enabled = coalesce(?, desktop_enabled),
      tablet_enabled = coalesce(?, tablet_enabled),
      mobile_enabled = coalesce(?, mobile_enabled),
      is_active = coalesce(?, is_active),
      custom_html = coalesce(?, custom_html),
      affiliate_promo_id = coalesce(?, affiliate_promo_id),
      updated_at = ?
    WHERE id = ?
  `).run(
    placement.name ?? null,
    placement.location_zone ?? null,
    placement.ad_type ?? null,
    placement.ad_slot_id ?? null,
    placement.format ?? null,
    placement.dimensions ?? null,
    placement.banner_image_url ?? null,
    placement.target_link_url ?? null,
    placement.headline ?? null,
    placement.description ?? null,
    placement.badge_text ?? null,
    placement.button_text ?? null,
    placement.open_in_new_tab !== undefined ? (placement.open_in_new_tab ? 1 : 0) : null,
    placement.desktop_enabled !== undefined ? (placement.desktop_enabled ? 1 : 0) : null,
    placement.tablet_enabled !== undefined ? (placement.tablet_enabled ? 1 : 0) : null,
    placement.mobile_enabled !== undefined ? (placement.mobile_enabled ? 1 : 0) : null,
    placement.is_active !== undefined ? (placement.is_active ? 1 : 0) : null,
    placement.custom_html ?? null,
    placement.affiliate_promo_id ?? null,
    new Date().toISOString(),
    id
  );

  return getAdPlacementById(id);
}

export function createAdPlacement(placement: Partial<AdPlacement>): AdPlacement {
  const db = getDb();
  const id = placement.id || `ad-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO ad_placements (
      id, name, location_zone, ad_type, ad_slot_id, format, dimensions,
      banner_image_url, target_link_url, headline, description, badge_text, button_text, open_in_new_tab,
      desktop_enabled, tablet_enabled, mobile_enabled, is_active, custom_html,
      affiliate_promo_id, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    placement.name || 'Custom Ad Placement',
    placement.location_zone || 'article',
    placement.ad_type || (placement.banner_image_url ? 'banner' : 'adsense'),
    placement.ad_slot_id || '',
    placement.format || 'responsive',
    placement.dimensions || 'responsive',
    placement.banner_image_url || '',
    placement.target_link_url || '',
    placement.headline || '',
    placement.description || '',
    placement.badge_text || 'Sponsored',
    placement.button_text || 'Learn More',
    placement.open_in_new_tab !== undefined ? (placement.open_in_new_tab ? 1 : 0) : 1,
    placement.desktop_enabled !== undefined ? (placement.desktop_enabled ? 1 : 0) : 1,
    placement.tablet_enabled !== undefined ? (placement.tablet_enabled ? 1 : 0) : 1,
    placement.mobile_enabled !== undefined ? (placement.mobile_enabled ? 1 : 0) : 1,
    placement.is_active !== undefined ? (placement.is_active ? 1 : 0) : 1,
    placement.custom_html || '',
    placement.affiliate_promo_id || '',
    now
  );

  return getAdPlacementById(id)!;
}

export function deleteAdPlacement(id: string): boolean {
  const db = getDb();
  const result = db.prepare('DELETE FROM ad_placements WHERE id = ?').run(id);
  return result.changes > 0;
}

export function getAllAffiliates(options?: {
  category?: string;
  commission_model?: string;
  is_featured?: boolean;
  is_trending?: boolean;
  is_active?: boolean;
  search?: string;
  network?: string;
  limit?: number;
}): AffiliatePromotion[] {
  const db = getDb();
  let query = 'SELECT * FROM affiliate_promotions WHERE 1=1';
  const params: any[] = [];

  if (options?.is_active !== undefined) {
    query += ' AND is_active = ?';
    params.push(options.is_active ? 1 : 0);
  }

  if (options?.is_featured !== undefined) {
    query += ' AND is_featured = ?';
    params.push(options.is_featured ? 1 : 0);
  }

  if (options?.is_trending !== undefined) {
    query += ' AND is_trending = ?';
    params.push(options.is_trending ? 1 : 0);
  }

  if (options?.category && options.category !== 'all') {
    query += ' AND category = ?';
    params.push(options.category);
  }

  if (options?.commission_model && options.commission_model !== 'all') {
    query += ' AND commission_model = ?';
    params.push(options.commission_model);
  }

  if (options?.network && options.network !== 'all') {
    query += ' AND affiliate_network = ?';
    params.push(options.network);
  }

  if (options?.search) {
    query += ' AND (title LIKE ? OR company_name LIKE ? OR description LIKE ? OR tracking_slug LIKE ?)';
    const term = `%${options.search}%`;
    params.push(term, term, term, term);
  }

  query += ' ORDER BY is_featured DESC, is_trending DESC, total_clicks DESC, created_at DESC';

  if (options?.limit) {
    query += ' LIMIT ?';
    params.push(options.limit);
  }

  const rows = db.prepare(query).all(...params) as any[];
  return toPlain(rows.map((r) => ({
    ...r,
    is_active: Boolean(r.is_active),
    is_featured: Boolean(r.is_featured),
    is_trending: Boolean(r.is_trending),
  })));
}

export function getAffiliateById(id: string): AffiliatePromotion | null {
  const db = getDb();
  const r = db.prepare('SELECT * FROM affiliate_promotions WHERE id = ?').get(id) as any;
  if (!r) return null;
  return toPlain({
    ...r,
    is_active: Boolean(r.is_active),
    is_featured: Boolean(r.is_featured),
    is_trending: Boolean(r.is_trending),
  });
}

export function getAffiliateBySlug(slug: string): AffiliatePromotion | null {
  const db = getDb();
  const r = db.prepare('SELECT * FROM affiliate_promotions WHERE tracking_slug = ?').get(slug) as any;
  if (!r) return null;
  return toPlain({
    ...r,
    is_active: Boolean(r.is_active),
    is_featured: Boolean(r.is_featured),
    is_trending: Boolean(r.is_trending),
  });
}

export function createAffiliate(aff: Partial<AffiliatePromotion>): AffiliatePromotion {
  const db = getDb();
  const id = aff.id || `aff-${Date.now()}`;
  const trackingSlug = (aff.tracking_slug || `promo-${Date.now()}`).toLowerCase().replace(/[^a-z0-9_-]/g, '-');
  db.prepare(`
    INSERT INTO affiliate_promotions (
      id, title, banner_url, description, destination_url, tracking_slug, campaign_name, disclosure_text,
      total_clicks, is_active, created_at, company_name, company_logo, category, commission_model,
      payout_amount, affiliate_network, eligibility_terms, terms_conditions, cta_button_text, badge_text,
      rating, is_featured, is_trending, expires_at, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    aff.title || 'Affiliate Campaign',
    aff.banner_url || '',
    aff.description || '',
    aff.destination_url || 'https://sricospace.com',
    trackingSlug,
    aff.campaign_name || 'Direct',
    aff.disclosure_text || 'Sponsored / Affiliate link: We may earn a commission upon verified conversion at no extra cost to you.',
    aff.total_clicks || 0,
    aff.is_active !== undefined ? (aff.is_active ? 1 : 0) : 1,
    aff.created_at || new Date().toISOString(),
    aff.company_name || aff.title || '',
    aff.company_logo || '',
    aff.category || 'Technology and Software',
    aff.commission_model || 'CPA',
    aff.payout_amount || '',
    aff.affiliate_network || 'Direct',
    aff.eligibility_terms || 'Valid for qualifying new registrations or purchases.',
    aff.terms_conditions || 'Commissions depend on affiliate network approval and verified conversion.',
    aff.cta_button_text || 'Claim Offer',
    aff.badge_text || 'Verified Deal',
    aff.rating || 4.8,
    aff.is_featured ? 1 : 0,
    aff.is_trending ? 1 : 0,
    aff.expires_at || null,
    aff.status || 'active'
  );
  return getAffiliateBySlug(trackingSlug)!;
}

export function recordAffiliateClick(slug: string, meta: { placementId?: string; userAgent?: string; referrer?: string; ipHash?: string } = {}): void {
  const db = getDb();
  // Increment counter in affiliate_promotions
  db.prepare('UPDATE affiliate_promotions SET total_clicks = total_clicks + 1 WHERE tracking_slug = ?').run(slug);

  // Insert event record
  const id = `click-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  db.prepare(`
    INSERT INTO ad_clicks (id, tracking_slug, placement_id, user_agent, referrer, ip_hash, clicked_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    slug,
    meta.placementId || '',
    meta.userAgent || '',
    meta.referrer || '',
    meta.ipHash || '',
    new Date().toISOString()
  );
}

export function updateAffiliate(id: string, updates: Partial<AffiliatePromotion>): AffiliatePromotion | null {
  const db = getDb();
  db.prepare(`
    UPDATE affiliate_promotions SET
      title = coalesce(?, title),
      banner_url = coalesce(?, banner_url),
      description = coalesce(?, description),
      destination_url = coalesce(?, destination_url),
      campaign_name = coalesce(?, campaign_name),
      disclosure_text = coalesce(?, disclosure_text),
      is_active = coalesce(?, is_active),
      company_name = coalesce(?, company_name),
      company_logo = coalesce(?, company_logo),
      category = coalesce(?, category),
      commission_model = coalesce(?, commission_model),
      payout_amount = coalesce(?, payout_amount),
      affiliate_network = coalesce(?, affiliate_network),
      eligibility_terms = coalesce(?, eligibility_terms),
      terms_conditions = coalesce(?, terms_conditions),
      cta_button_text = coalesce(?, cta_button_text),
      badge_text = coalesce(?, badge_text),
      rating = coalesce(?, rating),
      is_featured = coalesce(?, is_featured),
      is_trending = coalesce(?, is_trending),
      expires_at = coalesce(?, expires_at),
      status = coalesce(?, status)
    WHERE id = ? OR tracking_slug = ?
  `).run(
    updates.title ?? null,
    updates.banner_url ?? null,
    updates.description ?? null,
    updates.destination_url ?? null,
    updates.campaign_name ?? null,
    updates.disclosure_text ?? null,
    updates.is_active !== undefined ? (updates.is_active ? 1 : 0) : null,
    updates.company_name ?? null,
    updates.company_logo ?? null,
    updates.category ?? null,
    updates.commission_model ?? null,
    updates.payout_amount ?? null,
    updates.affiliate_network ?? null,
    updates.eligibility_terms ?? null,
    updates.terms_conditions ?? null,
    updates.cta_button_text ?? null,
    updates.badge_text ?? null,
    updates.rating ?? null,
    updates.is_featured !== undefined ? (updates.is_featured ? 1 : 0) : null,
    updates.is_trending !== undefined ? (updates.is_trending ? 1 : 0) : null,
    updates.expires_at ?? null,
    updates.status ?? null,
    id,
    id
  );

  const row = db.prepare('SELECT * FROM affiliate_promotions WHERE id = ? OR tracking_slug = ?').get(id, id) as any;
  if (!row) return null;
  return toPlain({
    ...row,
    is_active: Boolean(row.is_active),
    is_featured: Boolean(row.is_featured),
    is_trending: Boolean(row.is_trending),
  });
}

export function getAllAffiliateNetworks(): AffiliateNetwork[] {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM affiliate_networks ORDER BY name ASC').all() as any[];
  return toPlain(rows);
}

export function createAffiliateNetwork(network: Partial<AffiliateNetwork>): AffiliateNetwork {
  const db = getDb();
  const id = network.id || `net-${Date.now()}`;
  db.prepare(`
    INSERT INTO affiliate_networks (id, name, logo, login_url, affiliate_id, api_key_masked, commission_types, notes, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    network.name || 'New Network',
    network.logo || '',
    network.login_url || '',
    network.affiliate_id || '',
    network.api_key_masked || '',
    network.commission_types || 'CPS, CPL, CPA',
    network.notes || '',
    network.status || 'active',
    new Date().toISOString()
  );
  return toPlain(db.prepare('SELECT * FROM affiliate_networks WHERE id = ?').get(id) as any);
}

export function updateAffiliateNetwork(id: string, updates: Partial<AffiliateNetwork>): AffiliateNetwork | null {
  const db = getDb();
  db.prepare(`
    UPDATE affiliate_networks SET
      name = coalesce(?, name),
      logo = coalesce(?, logo),
      login_url = coalesce(?, login_url),
      affiliate_id = coalesce(?, affiliate_id),
      api_key_masked = coalesce(?, api_key_masked),
      commission_types = coalesce(?, commission_types),
      notes = coalesce(?, notes),
      status = coalesce(?, status)
    WHERE id = ?
  `).run(
    updates.name ?? null,
    updates.logo ?? null,
    updates.login_url ?? null,
    updates.affiliate_id ?? null,
    updates.api_key_masked ?? null,
    updates.commission_types ?? null,
    updates.notes ?? null,
    updates.status ?? null,
    id
  );
  const row = db.prepare('SELECT * FROM affiliate_networks WHERE id = ?').get(id) as any;
  return row ? toPlain(row) : null;
}

export function deleteAffiliateNetwork(id: string): boolean {
  const db = getDb();
  const res = db.prepare('DELETE FROM affiliate_networks WHERE id = ?').run(id);
  return res.changes > 0;
}

export function getAllConversions(limit: number = 100): AffiliateConversion[] {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM affiliate_conversions ORDER BY recorded_at DESC LIMIT ?').all(limit) as any[];
  return toPlain(rows);
}

export function recordConversion(conv: Partial<AffiliateConversion>): AffiliateConversion {
  const db = getDb();
  const id = conv.id || `conv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  db.prepare(`
    INSERT INTO affiliate_conversions (id, tracking_slug, offer_id, offer_title, network_name, conversion_type, commission_amount, currency, status, country, order_id, recorded_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    conv.tracking_slug || 'direct',
    conv.offer_id || '',
    conv.offer_title || '',
    conv.network_name || 'Direct',
    conv.conversion_type || 'CPA',
    conv.commission_amount || 0,
    conv.currency || 'USD',
    conv.status || 'pending',
    conv.country || 'US',
    conv.order_id || '',
    conv.recorded_at || new Date().toISOString()
  );
  return toPlain(db.prepare('SELECT * FROM affiliate_conversions WHERE id = ?').get(id) as any);
}

export function deleteAffiliate(id: string): boolean {
  const db = getDb();
  const res = db.prepare('DELETE FROM affiliate_promotions WHERE id = ? OR tracking_slug = ?').run(id, id);
  return res.changes > 0;
}

// -------------------------------------------------------------
// WEBSITE SETTINGS
// -------------------------------------------------------------

export function getWebsiteSettings(): WebsiteSettings {
  const defaultSettings: WebsiteSettings = {
    site_name: 'Srinoos',
    site_tagline: 'Technology Collective',
    site_description: 'Srinoos is a premier publication providing actionable guides on AI technology, digital business, SEO mastery, and verified software comparisons.',
    site_url: 'https://sricospace.com',
    custom_domain: 'sricospace.com',
    hosting_provider: 'Hostinger',
    hosting_plan: 'Hostinger Cloud / Web Hosting (20 GB NVMe, 2048 MB RAM, 40 PHP Workers)',
    hosting_server_ip: '82.112.239.60',
    hosting_server_name: 'server1675',
    hosting_server_location: 'Asia (India)',
    hosting_ftp_host: 'ftp://sricospace.com',
    hosting_ftp_username: 'u397809276',
    hosting_disk_space: '20 GB',
    hosting_ram: '2048 MB',
    hosting_php_workers: 40,
    hosting_status: 'Active (LiteSpeed Server Online)',
    logo_text: 'Srinoos',
    logo_image_url: '/images/srinoos-s-icon.jpg',
    announcement_bar_enabled: true,
    announcement_bar_text: 'How to Build an Organic Traffic Engine with Modern SEO in 2026 • Latest Tech Insights',
    announcement_bar_link: '/blog',
    hero_headline: 'Artificial Intelligence, Quantum Computing & Digital Growth Insights',
    hero_subheadline: 'Deep technical analysis, high-speed full-stack development, and actionable online monetization playbooks designed for visionary digital builders.',
    hero_lead_badge: '⚡ Technology Collective • Daily Dispatch',
    footer_about_text: 'Srinoos is a leading digital publication dedicated to artificial intelligence, high-performance web development, actionable search engine optimization, and legitimate online monetization strategies.',
    founder_name: 'Ketanboina Venkat Shrinivas',
    founder_title: 'Founder, Full-Stack Engineer & Digital Growth Specialist',
    about_me_bio: 'Hi! I am Ketanboina Venkat Shrinivas, a full-stack engineer and digital builder based in Pune, India. I founded Srinoos (hosted at sricospace.com) to create a premier publishing platform delivering actionable tutorials on Artificial Intelligence, modern web engineering, organic SEO growth, and digital monetization. Everything on this platform—from front-end architecture and backend database systems to AdSense monetization and automated daily publishing—is designed and developed by me.',
    phone: '+91 9665800844',
    location: 'Pune, India',
    portfolio_url: 'https://quiet-pony-c4f26b.netlify.app',
    contact_email: 'ketanboinak@gmail.com',
    credit_text: 'Designed and Developed by Srinoos',
    adsense_publisher_id: 'ca-pub-9876543210123456',
    adsense_auto_ads: false,
    adsense_active: true,
    ads_txt_content: 'google.com, pub-9876543210123456, DIRECT, f08c47fec0942fa0',
    google_analytics_id: 'G-SRINOOS2026',
    google_search_console_tag: '<meta name="google-site-verification" content="uodEPcFClTUy1YlkAZF-QtHcAHBhYrkqXwyJmBq_D1I" />',
    admitad_verification_tag: '<meta name="mitgo-verification" content="6015bfdb-7e9b-42b0-bfaa-6074e1b4eeab" />',
    nav_links_json: JSON.stringify([
      { name: 'Home', href: '/' },
      { name: 'All Blogs', href: '/blog' },
      { name: 'Trending', href: '/trending' },
      { name: 'About', href: '/about' },
      { name: 'Contact', href: '/contact' },
    ]),
    page_layouts_json: JSON.stringify(DEFAULT_PAGE_LAYOUTS),
    homepage_sections_order_json: JSON.stringify(DEFAULT_PAGE_LAYOUTS.home),
  };

  const db = getDb();
  const row = db.prepare('SELECT value FROM website_settings WHERE key = ?').get('site_config') as any;
  if (row && row.value) {
    try {
      const parsed = JSON.parse(row.value);
      return toPlain({ ...defaultSettings, ...parsed });
    } catch {
      // fallback
    }
  }
  return toPlain(defaultSettings);
}

export function updateWebsiteSettings(settings: Partial<WebsiteSettings>): WebsiteSettings {
  const db = getDb();
  const current = getWebsiteSettings();
  const updated = { ...current, ...settings };
  db.prepare('INSERT OR REPLACE INTO website_settings (key, value) VALUES (?, ?)').run('site_config', JSON.stringify(updated));
  return toPlain(updated);
}

/**
 * Universal async settings accessor.
 * Fetches real-time layout and website settings from Supabase PostgreSQL (if configured)
 * and falls back safely to SQLite. Ensures changes made in Visual Builder persist
 * across all serverless containers, all devices, and browser refreshes.
 */
export async function getWebsiteSettingsAsync(): Promise<WebsiteSettings> {
  const localSettings = getWebsiteSettings();
  try {
    const { getSupabaseWebsiteSettings } = await import('./supabase');
    const remote = await getSupabaseWebsiteSettings();
    if (remote && Object.keys(remote).length > 0) {
      const merged = { ...localSettings, ...remote };
      // Keep local SQLite in sync
      try {
        const db = getDb();
        db.prepare('INSERT OR REPLACE INTO website_settings (key, value) VALUES (?, ?)').run('site_config', JSON.stringify(merged));
      } catch {}
      return toPlain(merged);
    }
  } catch (err) {
    // Graceful fallback to SQLite
  }
  return localSettings;
}

/**
 * Universal async settings mutator.
 * Saves to SQLite and immediately pushes to Supabase PostgreSQL for cloud persistence.
 */
export async function updateWebsiteSettingsAsync(settings: Partial<WebsiteSettings>): Promise<WebsiteSettings> {
  const updated = updateWebsiteSettings(settings);
  try {
    const { saveSupabaseWebsiteSettings } = await import('./supabase');
    await saveSupabaseWebsiteSettings(updated);
  } catch (err) {
    console.warn('Supabase cloud settings sync notice:', err);
  }
  return updated;
}

// -------------------------------------------------------------
// ANALYTICS SUMMARY
// -------------------------------------------------------------

export function getAnalyticsSummary() {
  const db = getDb();
  const totalPosts = (db.prepare('SELECT count(*) as c FROM blog_posts WHERE status = ?').get('published') as any).c;
  const totalDrafts = (db.prepare('SELECT count(*) as c FROM blog_posts WHERE status != ?').get('published') as any).c;
  const totalClicks = (db.prepare('SELECT sum(total_clicks) as s FROM affiliate_promotions').get() as any).s || 0;
  const totalCategories = (db.prepare('SELECT count(*) as c FROM categories').get() as any).c;
  const topAffiliates = db.prepare('SELECT title, tracking_slug, total_clicks, category, commission_model FROM affiliate_promotions ORDER BY total_clicks DESC LIMIT 5').all() as any[];
  const recentClicks = db.prepare('SELECT * FROM ad_clicks ORDER BY clicked_at DESC LIMIT 10').all() as any[];

  // Conversions Analytics
  let totalConversions = 0;
  let approvedEarnings = 0;
  let pendingEarnings = 0;
  try {
    totalConversions = (db.prepare('SELECT count(*) as c FROM affiliate_conversions').get() as any).c || 0;
    approvedEarnings = (db.prepare('SELECT sum(commission_amount) as s FROM affiliate_conversions WHERE status = "approved"').get() as any).s || 0;
    pendingEarnings = (db.prepare('SELECT sum(commission_amount) as s FROM affiliate_conversions WHERE status = "pending"').get() as any).s || 0;
  } catch {}

  return toPlain({
    totalPosts,
    totalDrafts,
    totalClicks,
    totalCategories,
    topAffiliates,
    recentClicks,
    totalConversions,
    approvedEarnings: Number(approvedEarnings.toFixed(2)),
    pendingEarnings: Number(pendingEarnings.toFixed(2)),
    estimatedAdImpressions: totalPosts * 850 + totalClicks * 45, // Algorithmic edge estimate
  });
}

export function getRecentClicks(limit: number = 20) {
  const db = getDb();
  return toPlain(
    db.prepare('SELECT * FROM ad_clicks ORDER BY clicked_at DESC LIMIT ?').all(limit)
  );
}
