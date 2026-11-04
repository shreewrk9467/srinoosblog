import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { syncWordPressArticles } from '@/lib/wordpress';
import { getWebsiteSettings, updateWebsiteSettings } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    let url = '';
    try {
      const body: any = await request.json();
      url = body?.url || '';
    } catch {
      // Empty body or webhook ping
    }

    // If no URL passed in body, use saved settings URL
    if (!url || !url.trim()) {
      const settings = getWebsiteSettings();
      url = settings.wordpress_url || '';
    }

    if (!url || !url.trim()) {
      return NextResponse.json({
        success: false,
        syncedCount: 0,
        syncedPosts: [],
        message: 'No WordPress URL provided or configured yet. Please enter your WordPress site address in the URL box and click Test Connection first.',
        error: 'No WordPress URL configured',
      }, { status: 400 });
    }

    const result = await syncWordPressArticles(url);

    // If successful, persist settings & bust cache
    if (result.success) {
      try {
        updateWebsiteSettings({
          wordpress_url: url.trim().replace(/\/$/, ''),
          wordpress_enabled: true,
          wordpress_last_synced: new Date().toISOString(),
        });
        revalidatePath('/', 'layout');
        revalidatePath('/blog');
        revalidatePath('/blog/[slug]', 'page');
        revalidatePath('/admin/blogs');
        revalidatePath('/admin/content');
      } catch { }
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      syncedCount: 0,
      syncedPosts: [],
      message: 'Failed to synchronize articles from WordPress',
      error: error?.message || 'Server error',
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // Allow simple GET webhook trigger from WordPress or cron jobs
  try {
    const settings = getWebsiteSettings();
    const url = settings.wordpress_url;
    if (!url || !url.trim()) {
      return NextResponse.json({
        success: false,
        syncedCount: 0,
        error: 'WordPress URL not configured. Configure in /admin/wordpress',
      }, { status: 400 });
    }

    const result = await syncWordPressArticles(url);

    if (result.success) {
      try {
        revalidatePath('/', 'layout');
        revalidatePath('/blog');
        revalidatePath('/blog/[slug]', 'page');
        revalidatePath('/admin/blogs');
        revalidatePath('/admin/content');
      } catch { }
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      syncedCount: 0,
      error: error?.message || 'Webhook sync failure',
    }, { status: 500 });
  }
}
