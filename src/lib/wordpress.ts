import { BlogPost } from './types';
import { upsertPostFromWordPress, updateWebsiteSettings } from './db';

export interface WordPressConnectionTestResult {
  success: boolean;
  message: string;
  siteName?: string;
  siteDescription?: string;
  postCount?: number;
  samplePostTitle?: string;
  error?: string;
}

export interface WordPressSyncResult {
  success: boolean;
  syncedCount: number;
  syncedPosts: Array<{ id: string; title: string; slug: string }>;
  error?: string;
}

// Clean URL helper
function sanitizeWpUrl(rawUrl: string): string {
  let url = rawUrl.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  return url.replace(/\/$/, '');
}

/**
 * Test connectivity to a WordPress site via its built-in REST API
 */
export async function testWordPressConnection(rawUrl: string): Promise<WordPressConnectionTestResult> {
  const wpBaseUrl = sanitizeWpUrl(rawUrl);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    // 1. Fetch WP metadata from /wp-json
    const metaRes = await fetch(`${wpBaseUrl}/wp-json`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });

    if (!metaRes.ok) {
      clearTimeout(timeoutId);
      return {
        success: false,
        message: `Connected to server but WordPress REST API returned HTTP ${metaRes.status}. Ensure WordPress REST API is not blocked.`,
      };
    }

    const siteInfo = await metaRes.json();

    // 2. Fetch sample post & post count
    const postsRes = await fetch(`${wpBaseUrl}/wp-json/wp/v2/posts?per_page=1&_embed=1`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);

    const totalPosts = parseInt(postsRes.headers.get('x-wp-total') || '0', 10);
    const postsData = await postsRes.json();
    const sampleTitle = postsData?.[0]?.title?.rendered || 'No posts published yet';

    return {
      success: true,
      message: 'Successfully connected to WordPress REST API!',
      siteName: siteInfo?.name || 'WordPress Site',
      siteDescription: siteInfo?.description || '',
      postCount: isNaN(totalPosts) ? (Array.isArray(postsData) ? postsData.length : 0) : totalPosts,
      samplePostTitle: sampleTitle,
    };
  } catch (err: any) {
    return {
      success: false,
      message: 'Could not connect to WordPress site',
      error: err.name === 'AbortError' ? 'Connection timed out after 8 seconds' : err.message,
    };
  }
}

/**
 * Synchronize articles from WordPress REST API into the website's persistent database
 */
export async function syncWordPressArticles(rawUrl: string, maxPages = 3): Promise<WordPressSyncResult> {
  const wpBaseUrl = sanitizeWpUrl(rawUrl);
  const syncedPosts: Array<{ id: string; title: string; slug: string }> = [];

  try {
    for (let page = 1; page <= maxPages; page++) {
      const res = await fetch(`${wpBaseUrl}/wp-json/wp/v2/posts?_embed=1&per_page=20&page=${page}`, {
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) {
        if (page === 1) {
          throw new Error(`WordPress REST API error: HTTP ${res.status}`);
        }
        break; // No more pages
      }

      const wpPosts = await res.json();
      if (!Array.isArray(wpPosts) || wpPosts.length === 0) break;

      for (const item of wpPosts) {
        // Extract featured image
        let featuredImage = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80';
        try {
          const media = item._embedded?.['wp:featuredmedia']?.[0];
          if (media?.source_url) {
            featuredImage = media.source_url;
          }
        } catch {}

        // Extract author name
        let authorName = 'Srinoos Editorial Team';
        try {
          const author = item._embedded?.['author']?.[0];
          if (author?.name) {
            authorName = author.name;
          }
        } catch {}

        // Extract clean text from HTML excerpt
        const rawExcerpt = item.excerpt?.rendered || '';
        const cleanExcerpt = rawExcerpt.replace(/<[^>]+>/g, '').trim().slice(0, 240);

        // Word count estimate
        const wordCount = (item.content?.rendered || '').split(/\s+/).length;
        const readingTime = Math.max(1, Math.ceil(wordCount / 200));

        const mappedPost: Partial<BlogPost> = {
          id: `wp-${item.id}`,
          title: item.title?.rendered || 'Untitled WordPress Article',
          slug: item.slug || `wp-article-${item.id}`,
          excerpt: cleanExcerpt || 'Read this full article published via WordPress.',
          content: item.content?.rendered || '',
          featured_image: featuredImage,
          author_name: authorName,
          status: item.status === 'publish' ? 'published' : (item.status || 'draft'),
          published_at: item.date ? new Date(item.date).toISOString() : new Date().toISOString(),
          reading_time_minutes: readingTime,
          meta_title: `${item.title?.rendered} | Srinoos`,
          meta_description: cleanExcerpt,
        };

        const saved = upsertPostFromWordPress(mappedPost);
        syncedPosts.push({
          id: saved.id,
          title: saved.title,
          slug: saved.slug,
        });
      }
    }

    // Update settings with last sync time
    updateWebsiteSettings({
      wordpress_last_synced: new Date().toISOString(),
      wordpress_url: wpBaseUrl,
      wordpress_enabled: true,
    });

    return {
      success: true,
      syncedCount: syncedPosts.length,
      syncedPosts,
    };
  } catch (err: any) {
    return {
      success: false,
      syncedCount: syncedPosts.length,
      syncedPosts,
      error: err.message || 'Error syncing articles from WordPress',
    };
  }
}

