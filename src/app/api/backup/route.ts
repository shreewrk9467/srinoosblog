import { NextRequest, NextResponse } from 'next/server';
import {
  getWebsiteSettings,
  updateWebsiteSettings,
  getAllCategories,
  getAllPosts,
  getAllAdPlacements,
  getAllAffiliates,
  getDb,
  createPost,
} from '@/lib/db';
import { getSessionFromCookies } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// 1. Export entire website database as JSON
export async function GET() {
  const session = getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
  }

  const backupData = {
    backup_version: '1.0.0',
    site: 'Srinoos (sricospace.com)',
    exported_at: new Date().toISOString(),
    settings: getWebsiteSettings(),
    categories: getAllCategories(),
    posts: getAllPosts(),
    ad_placements: getAllAdPlacements(),
    affiliates: getAllAffiliates(),
  };

  return new NextResponse(JSON.stringify(backupData, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="srinoos_backup_${new Date().toISOString().slice(0, 10)}.json"`,
    },
  });
}

// 2. Import and restore website database from JSON
export async function POST(request: NextRequest) {
  const session = getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const db = getDb();

    // 1. Restore Website Settings
    if (data.settings) {
      updateWebsiteSettings(data.settings);
    }

    // 2. Restore Categories
    if (Array.isArray(data.categories)) {
      const insertCat = db.prepare(`
        INSERT OR REPLACE INTO categories (id, name, slug, description, icon, meta_title, meta_description, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const cat of data.categories) {
        insertCat.run(
          cat.id,
          cat.name,
          cat.slug,
          cat.description || '',
          cat.icon || 'Folder',
          cat.meta_title || '',
          cat.meta_description || '',
          cat.created_at || new Date().toISOString()
        );
      }
    }

    // 3. Restore Blog Posts
    if (Array.isArray(data.posts)) {
      const insertPost = db.prepare(`
        INSERT OR REPLACE INTO blog_posts (
          id, title, slug, excerpt, content, featured_image, image_caption,
          category_id, tags, status, is_featured, is_trending, reading_time_minutes,
          meta_title, meta_description, focus_keyword, faq_schema, scheduled_at,
          published_at, author_name, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const p of data.posts) {
        insertPost.run(
          p.id,
          p.title,
          p.slug,
          p.excerpt || '',
          p.content || '',
          p.featured_image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80',
          p.image_caption || '',
          p.category_id || 'cat-blogging-seo',
          p.tags || '',
          p.status || 'published',
          p.is_featured ? 1 : 0,
          p.is_trending ? 1 : 0,
          p.reading_time_minutes || 5,
          p.meta_title || p.title || '',
          p.meta_description || p.excerpt || '',
          p.focus_keyword || '',
          p.faq_schema || '[]',
          p.scheduled_at || null,
          p.published_at || new Date().toISOString(),
          p.author_name || 'Srinoos Editorial Team',
          p.created_at || new Date().toISOString(),
          p.updated_at || new Date().toISOString()
        );
      }
    }

    // 4. Restore Ad Placements
    if (Array.isArray(data.ad_placements)) {
      const insertAd = db.prepare(`
        INSERT OR REPLACE INTO ad_placements (
          id, name, location_zone, ad_type, ad_slot_id, format, dimensions,
          desktop_enabled, tablet_enabled, mobile_enabled, is_active, custom_html, affiliate_promo_id, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const a of data.ad_placements) {
        insertAd.run(
          a.id,
          a.name,
          a.location_zone,
          a.ad_type || 'adsense',
          a.ad_slot_id || '',
          a.format || 'responsive',
          a.dimensions || 'responsive',
          a.desktop_enabled ? 1 : 0,
          a.tablet_enabled ? 1 : 0,
          a.mobile_enabled ? 1 : 0,
          a.is_active ? 1 : 0,
          a.custom_html || '',
          a.affiliate_promo_id || '',
          new Date().toISOString()
        );
      }
    }

    // 5. Restore Affiliates
    if (Array.isArray(data.affiliates)) {
      const insertAff = db.prepare(`
        INSERT OR REPLACE INTO affiliate_promotions (
          id, title, banner_url, description, destination_url, tracking_slug, campaign_name, disclosure_text, total_clicks, is_active, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const aff of data.affiliates) {
        insertAff.run(
          aff.id,
          aff.title,
          aff.banner_url || '',
          aff.description || '',
          aff.destination_url,
          aff.tracking_slug,
          aff.campaign_name || 'Direct',
          aff.disclosure_text || 'Sponsored',
          aff.total_clicks || 0,
          aff.is_active ? 1 : 0,
          aff.created_at || new Date().toISOString()
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Website database restored successfully!',
      restored: {
        posts: data.posts?.length || 0,
        categories: data.categories?.length || 0,
        ad_placements: data.ad_placements?.length || 0,
        affiliates: data.affiliates?.length || 0,
      },
    });
  } catch (error: any) {
    console.error('Backup restore error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to restore database' }, { status: 500 });
  }
}

