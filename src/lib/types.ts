export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  image_caption?: string;
  category_id: string;
  category_name?: string;
  category_slug?: string;
  tags?: string; // Comma-separated
  status: 'draft' | 'review' | 'scheduled' | 'published' | 'failed';
  is_featured: boolean;
  is_trending: boolean;
  reading_time_minutes: number;
  meta_title?: string;
  meta_description?: string;
  focus_keyword?: string;
  faq_schema?: string; // JSON string of FAQs
  scheduled_at?: string | null;
  published_at?: string | null;
  author_name: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  meta_title?: string;
  meta_description?: string;
  post_count?: number;
  created_at: string;
}

export interface AdPlacement {
  id: string; // e.g., 'header-global', 'article-mid', 'sidebar-sticky'
  name: string;
  location_zone: 'global' | 'article' | 'sidebar' | 'homepage' | 'mobile';
  ad_type: 'adsense' | 'affiliate' | 'custom_html' | 'banner';
  ad_slot_id?: string; // Google AdSense data-ad-slot
  format?: 'responsive' | 'rectangle' | 'leaderboard' | 'skyscraper' | 'banner';
  dimensions?: string; // e.g., '728x90', '300x250', '336x280'
  banner_image_url?: string;
  target_link_url?: string;
  headline?: string;
  description?: string;
  badge_text?: string;
  button_text?: string;
  open_in_new_tab?: boolean;
  desktop_enabled: boolean;
  tablet_enabled: boolean;
  mobile_enabled: boolean;
  is_active: boolean;
  custom_html?: string;
  affiliate_promo_id?: string;
  updated_at: string;
}

export type CommissionModel = 'CPA' | 'CPL' | 'CPS' | 'CPI' | 'Hybrid';

export interface AffiliatePromotion {
  id: string;
  title: string;
  banner_url?: string;
  description?: string;
  destination_url: string;
  tracking_slug: string; // Used in /go/[slug]
  campaign_name: string;
  disclosure_text?: string;
  total_clicks: number;
  is_active: boolean;
  created_at: string;
  // Enterprise Affiliate Platform Attributes
  company_name?: string;
  company_logo?: string;
  category?: string;
  commission_model?: CommissionModel;
  payout_amount?: string;
  affiliate_network?: string;
  eligibility_terms?: string;
  terms_conditions?: string;
  cta_button_text?: string;
  badge_text?: string;
  rating?: number;
  is_featured?: boolean;
  is_trending?: boolean;
  expires_at?: string | null;
  status?: 'active' | 'expired' | 'pending' | 'draft';
}

export interface AffiliateNetwork {
  id: string;
  name: string;
  logo: string;
  login_url?: string;
  affiliate_id?: string;
  api_key_masked?: string;
  commission_types: string; // e.g. "CPS, CPL, CPA"
  notes?: string;
  status: 'active' | 'pending_approval' | 'inactive';
  created_at: string;
}

export interface AffiliateConversion {
  id: string;
  tracking_slug: string;
  offer_id?: string;
  offer_title?: string;
  network_name?: string;
  conversion_type: 'CPA' | 'CPL' | 'CPS' | 'CPI' | 'Registration';
  commission_amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'rejected';
  country?: string;
  order_id?: string;
  recorded_at: string;
}

export interface AdClickEvent {
  id: string;
  tracking_slug: string;
  placement_id?: string;
  user_agent?: string;
  referrer?: string;
  ip_hash?: string;
  clicked_at: string;
}

export interface WebsiteSettings {
  site_name: string;
  site_tagline: string;
  site_description: string;
  site_url: string;
  custom_domain?: string;
  hosting_provider?: string;
  hosting_plan?: string;
  hosting_server_ip?: string;
  hosting_server_name?: string;
  hosting_server_location?: string;
  hosting_ftp_host?: string;
  hosting_ftp_username?: string;
  hosting_disk_space?: string;
  hosting_ram?: string;
  hosting_php_workers?: number;
  hosting_status?: string;
  logo_text: string;
  contact_email: string;
  credit_text: string;
  adsense_publisher_id: string; // e.g. ca-pub-XXXXXXXXXXXXXXXX
  adsense_auto_ads: boolean;
  adsense_active: boolean;
  ads_txt_content: string;
  google_analytics_id: string;
  google_search_console_tag: string;
  admitad_verification_tag?: string; // e.g. <meta name="mitgo-verification" content="6015bfdb-7e9b-42b0-bfaa-6074e1b4eeab" />
  facebook_url?: string;
  twitter_url?: string;
  linkedin_url?: string;
  youtube_url?: string;
  github_url?: string;
  portfolio_url?: string;
  phone?: string;
  location?: string;
  founder_name?: string;
  founder_title?: string;
  about_me_bio?: string;
  founder_avatar?: string;
  logo_image_url?: string;

  // Dynamic Content & Elements (WordPress Style)
  announcement_bar_enabled?: boolean;
  announcement_bar_text?: string;
  announcement_bar_link?: string;
  hero_headline?: string;
  hero_subheadline?: string;
  hero_lead_badge?: string;
  footer_about_text?: string;
  nav_links_json?: string; // JSON array of { name: string, href: string }
  homepage_sections_order_json?: string; // JSON array of page sections with drag-and-drop order & custom blocks
  page_layouts_json?: string; // Global multi-page layout map for all pages (home, blog, about, contact, etc.)
  custom_blocks_json?: string;

  // Headless WordPress Integration
  wordpress_enabled?: boolean;
  wordpress_url?: string; // e.g. https://wp.sricospace.com
  wordpress_sync_mode?: 'live' | 'sync_db';
  wordpress_last_synced?: string;
  wordpress_auto_sync?: boolean;

  // Supabase Cloud PostgreSQL Integration
  supabase_enabled?: boolean;
  supabase_url?: string;
  supabase_anon_key?: string;
  supabase_last_synced?: string;
}

export interface PageSection {
  id: string;
  type:
  | 'announcement'
  | 'top_ad'
  | 'hero'
  | 'deals'
  | 'lead_feature'
  | 'trending'
  | 'mid_ad'
  | 'main_feed'
  | 'footer_ad'
  | 'custom_banner'
  | 'custom_html'
  | 'cta_box'
  | 'faq_accordion'
  | 'testimonial_bar'
  | 'blog_header'
  | 'blog_grid'
  | 'trending_header'
  | 'trending_grid'
  | 'about_mission'
  | 'about_founder'
  | 'about_values'
  | 'contact_header'
  | 'contact_form'
  | 'contact_info'
  | 'category_header'
  | 'category_grid'
  | 'offers_header'
  | 'offers_grid'
  | (string & {});
  title: string;
  enabled: boolean;
  headline?: string;
  subheadline?: string;
  badge?: string;
  btn1_text?: string;
  btn1_link?: string;
  btn2_text?: string;
  btn2_link?: string;
  background_gradient?: string;
  image_url?: string;
  html_content?: string;
  html_code?: string;
  placementId?: string;
  items_json?: string;
}

export interface Comment {
  id: string;
  post_id: string;
  author_name: string;
  author_email: string;
  content: string;
  status: 'pending' | 'approved' | 'spam';
  created_at: string;
}

export interface DailyGoalStatus {
  date: string;
  target: number; // default 20
  published_count: number;
  scheduled_count: number;
  draft_count: number;
  review_count: number;
  is_target_met: boolean;
}

