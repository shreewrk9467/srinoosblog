import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { WebsiteSettings } from './types';

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

