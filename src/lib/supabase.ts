import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { WebsiteSettings, BlogPost } from './types';

let cachedClient: SupabaseClient | null = null;
let lastKnownUrl = '';
let lastKnownKey = '';

export function sanitizeSupabaseUrl(raw: string): string {
  let url = (raw || '').trim().replace(/\/+$/, '');
  if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  return url;
}

export function getSupabaseCredentials(): { url: string; anonKey: string; secretKey?: string } {
  // 1. Check environment variables first
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const secret = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  const isServer = typeof window === 'undefined';

  // Use secret key on server-side if available, otherwise publishable key
  const envKey =
    (isServer && secret && !secret.includes('••') && !secret.includes('your_'))
      ? secret
      : (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
         process.env.SUPABASE_ANON_KEY ||
         process.env.SUPABASE_PUBLISHABLE_KEY ||
         '');

  if (envUrl && envKey) {
    return {
      url: sanitizeSupabaseUrl(envUrl),
      anonKey: envKey.trim(),
      secretKey: secret,
    };
  }

  // 2. Configured Project Fallback
  const defaultUrl = 'https://udankkjapmjuurcveube.supabase.co';
  const defaultKey = 'sb_publishable_lhwvmIHCEF2qqAcBemsreQ_A_CaAI82';
  return { url: defaultUrl, anonKey: defaultKey };
}

export interface SupabaseSyncResult {
  success: boolean;
  error?: string;
  tableMissing?: boolean;
}

export async function getSupabaseWebsiteSettings(): Promise<Partial<WebsiteSettings> | null> {
  try {
    const client = getSupabaseClient();
    if (!client) return null;
    const { data, error } = await client
      .from('website_settings')
      .select('value')
      .eq('key', 'site_config')
      .maybeSingle();

    if (error || !data || !data.value) return null;
    const val = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
    if (val && typeof val === 'object' && val.site_config && typeof val.site_config === 'object') {
      return val.site_config;
    }
    return val;
  } catch {
    return null;
  }
}

export async function saveSupabaseWebsiteSettings(settings: Partial<WebsiteSettings>): Promise<SupabaseSyncResult> {
  try {
    const client = getSupabaseClient();
    if (!client) {
      return { success: false, error: 'Supabase client could not be initialized (missing URL or API key).' };
    }

    const { error } = await client
      .from('website_settings')
      .upsert({
        key: 'site_config',
        value: settings,
      }, { onConflict: 'key' });

    if (error) {
      const isMissingTable =
        error.code === 'PGRST205' ||
        error.message?.includes('schema cache') ||
        error.message?.includes('not find the table');

      return {
        success: false,
        error: error.message || 'Error writing to Supabase website_settings',
        tableMissing: isMissingTable,
      };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Exception during Supabase cloud save' };
  }
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseCredentials();
  return Boolean(url && anonKey && url.startsWith('http'));
}

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey } = getSupabaseCredentials();
  if (!url || !anonKey) return null;

  if (cachedClient && lastKnownUrl === url && lastKnownKey === anonKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    lastKnownUrl = url;
    lastKnownKey = anonKey;
    return cachedClient;
  } catch (err) {
    console.error('Failed to create Supabase client:', err);
    return null;
  }
}

export async function testSupabaseConnection(
  url?: string,
  anonKey?: string
): Promise<{ success: boolean; message: string; tableCount?: number; error?: string }> {
  const targetUrl = sanitizeSupabaseUrl(url || getSupabaseCredentials().url);
  const targetKey = (anonKey || getSupabaseCredentials().anonKey).trim();

  if (!targetUrl || !targetKey) {
    return {
      success: false,
      message: 'Supabase URL or API Key is missing.',
      error: 'Credentials missing',
    };
  }

  try {
    const testClient = createClient(targetUrl, targetKey, {
      auth: { persistSession: false },
    });

    // Test query against categories or blog_posts
    const { data, error } = await testClient.from('categories').select('id').limit(1);

    if (error) {
      // If table doesn't exist yet (42P01, PGRST205 schema cache), connection succeeded
      if (
        error.code === '42P01' ||
        error.code === 'PGRST205' ||
        error.message?.includes('schema cache') ||
        error.message?.includes('relation') ||
        error.message?.includes('does not exist') ||
        error.message?.includes('Could not find the table')
      ) {
        return {
          success: true,
          message: 'Connected to Supabase PostgreSQL! (Tables ready to be created with supabase-schema.sql)',
        };
      }
      return {
        success: false,
        message: 'Connected to Supabase, but query returned an error.',
        error: error.message,
      };
    }

    return {
      success: true,
      message: 'Successfully connected to Supabase PostgreSQL database!',
      tableCount: data ? data.length : 0,
    };
  } catch (err: any) {
    return {
      success: false,
      message: 'Failed to reach Supabase server.',
      error: err.message,
    };
  }
}

function formatCategoryName(slug?: string): string {
  if (!slug) return 'Technology & AI';
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function mapSupabasePostToBlogPost(row: any): BlogPost {
  const catSlug = row.category_slug || 'technology-and-ai';
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt || '',
    content: row.content || '',
    featured_image: row.featured_image || '',
    image_caption: row.image_caption || '',
    category_id: row.category_id || `cat-${catSlug}`,
    category_name: row.category_name || formatCategoryName(catSlug),
    category_slug: catSlug,
    tags: row.tags || '',
    status: (row.status as any) || 'published',
    is_featured: Boolean(row.is_featured),
    is_trending: Boolean(row.is_trending),
    reading_time_minutes: row.reading_time || row.reading_time_minutes || 5,
    meta_title: row.seo_title || row.meta_title || row.title,
    meta_description: row.seo_description || row.meta_description || row.excerpt || '',
    focus_keyword: row.focus_keyword || '',
    faq_schema: typeof row.faq_schema === 'string' ? row.faq_schema : JSON.stringify(row.faq_schema || []),
    scheduled_at: row.scheduled_at || null,
    published_at: row.published_at || row.created_at || row.updated_at || new Date().toISOString(),
    author_name: row.author_name || 'Srinoos Editorial Team',
    created_at: row.created_at || new Date().toISOString(),
    updated_at: row.updated_at || new Date().toISOString(),
  };
}

export async function getSupabasePostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const client = getSupabaseClient();
    if (!client) return null;
    const { data, error } = await client
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !data) return null;
    return mapSupabasePostToBlogPost(data);
  } catch (e) {
    return null;
  }
}

export async function getSupabasePostById(id: string): Promise<BlogPost | null> {
  try {
    const client = getSupabaseClient();
    if (!client) return null;
    const { data, error } = await client
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) return null;
    return mapSupabasePostToBlogPost(data);
  } catch (e) {
    return null;
  }
}

export async function getAllSupabasePosts(options?: {
  status?: string;
  categorySlug?: string;
  limit?: number;
}): Promise<BlogPost[] | null> {
  try {
    const client = getSupabaseClient();
    if (!client) return null;
    let query = client
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (options?.status) {
      query = query.eq('status', options.status);
    }
    if (options?.categorySlug) {
      query = query.eq('category_slug', options.categorySlug);
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) return null;
    return data.map(mapSupabasePostToBlogPost);
  } catch (e) {
    return null;
  }
}

export async function saveSupabasePost(post: Partial<BlogPost> & { id: string }): Promise<SupabaseSyncResult> {
  try {
    const client = getSupabaseClient();
    if (!client) {
      return { success: false, error: 'Supabase client could not be initialized.' };
    }

    // Determine category_slug safely
    let catSlug = post.category_slug;
    if (!catSlug && post.category_id) {
      catSlug = post.category_id.replace(/^cat-/, '');
    }
    if (!catSlug) catSlug = 'technology-and-ai';

    const payload: any = {
      id: post.id,
      updated_at: new Date().toISOString(),
    };

    if (post.slug !== undefined) payload.slug = post.slug;
    if (post.title !== undefined) payload.title = post.title;
    if (post.excerpt !== undefined) payload.excerpt = post.excerpt;
    if (post.content !== undefined) payload.content = post.content;
    if (post.featured_image !== undefined) payload.featured_image = post.featured_image;
    payload.category_slug = catSlug;
    if (post.author_name !== undefined) payload.author_name = post.author_name;
    if (post.reading_time_minutes !== undefined) payload.reading_time = post.reading_time_minutes;
    if (post.is_featured !== undefined) payload.is_featured = Boolean(post.is_featured);
    if (post.is_trending !== undefined) payload.is_trending = Boolean(post.is_trending);
    if (post.status !== undefined) payload.status = post.status;
    if (post.meta_title !== undefined) payload.seo_title = post.meta_title;
    if (post.meta_description !== undefined) payload.seo_description = post.meta_description;

    const { error } = await client.from('blog_posts').upsert(payload, { onConflict: 'id' });
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Exception during Supabase post save' };
  }
}

export async function deleteSupabasePost(id: string): Promise<SupabaseSyncResult> {
  try {
    const client = getSupabaseClient();
    if (!client) return { success: false, error: 'Supabase client unavailable' };
    const { error } = await client.from('blog_posts').delete().eq('id', id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

