import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseCredentials, isSupabaseConfigured, testSupabaseConnection, getSupabaseClient } from '@/lib/supabase';
import { getWebsiteSettings, updateWebsiteSettings, getAllCategories, getAllPosts, getAllAdPlacements, getAllAffiliates } from '@/lib/db';
import { getSessionFromCookies } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { url } = getSupabaseCredentials();
  const configured = isSupabaseConfigured();

  let test = null;
  if (configured) {
    test = await testSupabaseConnection();
  }

  return NextResponse.json({
    configured,
    url: url ? `${url.substring(0, 18)}...` : '',
    test,
  });
}

export async function POST(request: NextRequest) {
  const session = getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { url, anonKey, syncData } = body;

    if (!url || !anonKey) {
      return NextResponse.json({ error: 'URL and Anon Key are required' }, { status: 400 });
    }

    const test = await testSupabaseConnection(url, anonKey);
    if (!test.success) {
      return NextResponse.json({
        error: test.message,
        details: test.error,
      }, { status: 400 });
    }

    // Persist to website_settings
    updateWebsiteSettings({
      supabase_enabled: true,
      supabase_url: url.trim(),
      supabase_anon_key: anonKey.trim(),
      supabase_last_synced: new Date().toISOString(),
    });

    let syncStats = null;

    // Optional: Migrate existing SQLite data into Supabase
    if (syncData) {
      const client = getSupabaseClient();
      if (client) {
        try {
          const categories = getAllCategories();
          const posts = getAllPosts();
          const ads = getAllAdPlacements();
          const affiliates = getAllAffiliates();

          // 1. Sync Categories
          if (categories.length > 0) {
            await client.from('categories').upsert(
              categories.map((c) => ({
                id: c.id,
                name: c.name,
                slug: c.slug,
                description: c.description,
                icon: c.icon || 'Folder',
                meta_title: c.meta_title || '',
                meta_description: c.meta_description || '',
              }))
            );
          }

          // 2. Sync Posts
          if (posts.length > 0) {
            await client.from('blog_posts').upsert(
              posts.map((p) => ({
                id: p.id,
                title: p.title,
                slug: p.slug,
                excerpt: p.excerpt,
                content: p.content,
                featured_image: p.featured_image,
                category_id: p.category_id,
                status: p.status,
                is_featured: Boolean(p.is_featured),
                is_trending: Boolean(p.is_trending),
                reading_time_minutes: p.reading_time_minutes || 5,
                meta_title: p.meta_title || '',
                meta_description: p.meta_description || '',
                published_at: p.published_at,
                author_name: p.author_name,
              }))
            );
          }

          syncStats = {
            categoriesSynced: categories.length,
            postsSynced: posts.length,
          };
        } catch (syncErr: any) {
          console.warn('Sync to Supabase warning:', syncErr.message);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase successfully connected and configured!',
      test,
      syncStats,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to configure Supabase' }, { status: 500 });
  }
}
