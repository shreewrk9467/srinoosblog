import { NextRequest, NextResponse } from 'next/server';
import { syncWordPressArticles } from '@/lib/wordpress';
import { getWebsiteSettings } from '@/lib/db';
import { getSessionFromCookies } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    let url = '';
    try {
      const body = await request.json();
      url = body?.url || '';
    } catch {
      // Empty body or webhook ping
    }

    // If no URL passed in body, use saved settings URL
    if (!url) {
      const settings = getWebsiteSettings();
      url = settings.wordpress_url || '';
    }

    if (!url) {
      return NextResponse.json({
        error: 'No WordPress URL provided or configured in website settings',
      }, { status: 400 });
    }

    const result = await syncWordPressArticles(url);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || 'Failed to sync WordPress articles',
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // Allow simple GET webhook trigger from WordPress or cron
  try {
    const settings = getWebsiteSettings();
    const url = settings.wordpress_url;
    if (!url) {
      return NextResponse.json({ error: 'WordPress URL not configured' }, { status: 400 });
    }

    const result = await syncWordPressArticles(url);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

