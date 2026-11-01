import { BlogPost } from './types';
import { upsertPostFromWordPress, updateWebsiteSettings } from './db';

export interface WordPressConnectionTestResult {
  success: boolean;
  message: string;
  cleanedUrl: string;
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
  message?: string;
  error?: string;
}

/**
 * Intelligent URL cleaner:
 * - Trims whitespace
 * - Adds https:// if missing
 * - Strips trailing slashes
 * - Strips accidental /wp-admin, /wp-login.php, /wp-json, or post paths
 */
export function sanitizeWpUrl(rawUrl: string): string {
  let url = (rawUrl || '').trim();
  if (!url) return '';

  // Remove query params or hash if user copied a browser URL
  url = url.split('?')[0].split('#')[0];

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }

  // Remove trailing slashes
  url = url.replace(/\/+$/, '');

  // Strip trailing admin or api segments that users commonly copy-paste
  url = url.replace(/\/(wp-admin|wp-login\.php|wp-json|xmlrpc\.php)(\/.*)?$/i, '');

  return url.replace(/\/+$/, '');
}

/**
 * Test connectivity to a WordPress site via its built-in REST API
 */
export async function testWordPressConnection(rawUrl: string): Promise<WordPressConnectionTestResult> {
  const wpBaseUrl = sanitizeWpUrl(rawUrl);

  if (!wpBaseUrl) {
    return {
      success: false,
      cleanedUrl: '',
      message: 'Please enter a valid WordPress URL.',
      error: 'URL is empty',
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    // 1. Fetch WP metadata from /wp-json
    let metaRes: Response;
    try {
      metaRes = await fetch(`${wpBaseUrl}/wp-json`, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
        redirect: 'follow',
      });
    } catch (networkErr: any) {
      clearTimeout(timeoutId);
      const isTimeout = networkErr.name === 'AbortError';
      return {
        success: false,
        cleanedUrl: wpBaseUrl,
        message: isTimeout
          ? `Connection to ${wpBaseUrl} timed out after 10 seconds. Check that the domain is online and resolving.`
          : `Could not reach ${wpBaseUrl}. Make sure the domain exists and is accessible.`,
        error: networkErr.message,
      };
    }

    if (!metaRes.ok) {
      clearTimeout(timeoutId);
      return {
        success: false,
        cleanedUrl: wpBaseUrl,
        message: `Connected to ${wpBaseUrl}, but WordPress REST API returned HTTP ${metaRes.status}. Make sure WordPress is installed at this address and permalinks are enabled (Settings > Permalinks).`,
        error: `HTTP ${metaRes.status} on /wp-json`,
      };
    }

    const contentType = metaRes.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      clearTimeout(timeoutId);
      return {
        success: false,
        cleanedUrl: wpBaseUrl,
        message: `The server at ${wpBaseUrl} returned a web page instead of WordPress REST API JSON. Please verify that WordPress is installed directly at this URL (e.g. wp.sricospace.com).`,
        error: `Expected application/json, received: ${contentType}`,
      };
    }

    let siteInfo: any = {};
    try {
      siteInfo = await metaRes.json();
    } catch (jsonErr: any) {
      clearTimeout(timeoutId);
      return {
        success: false,
        cleanedUrl: wpBaseUrl,
        message: 'Connected to server but response was not valid WordPress REST API JSON.',
        error: jsonErr.message,
      };
    }

    // 2. Fetch sample post & count
    let totalPosts = 0;
    let sampleTitle = 'No posts published yet';

    try {
      const postsRes = await fetch(`${wpBaseUrl}/wp-json/wp/v2/posts?per_page=1&_embed=1`, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
        redirect: 'follow',
      });

      if (postsRes.ok) {
        const headerCount = postsRes.headers.get('x-wp-total');
        if (headerCount) {
          totalPosts = parseInt(headerCount, 10);
        }

        const postsData = await postsRes.json();
        if (Array.isArray(postsData) && postsData.length > 0) {
          if (isNaN(totalPosts) || totalPosts === 0) totalPosts = postsData.length;
          sampleTitle = postsData[0]?.title?.rendered || 'Untitled Post';
        }
      }
    } catch {
      // Non-fatal: /wp-json already proved WordPress is running
    } finally {
      clearTimeout(timeoutId);
    }

    return {
      success: true,
      cleanedUrl: wpBaseUrl,
      message: 'Successfully connected to WordPress REST API!',
      siteName: siteInfo?.name || 'WordPress Site',
      siteDescription: siteInfo?.description || '',
      postCount: isNaN(totalPosts) ? 0 : totalPosts,
      samplePostTitle: sampleTitle,
    };
  } catch (err: any) {
    return {
      success: false,
      cleanedUrl: wpBaseUrl,
      message: 'Failed to test WordPress connection',
      error: err.name === 'AbortError' ? 'Connection timed out' : err.message,
    };
  }
}

/**
 * Synchronize articles from WordPress REST API into the website's persistent database
 */
export async function syncWordPressArticles(rawUrl: string, maxPages = 3): Promise<WordPressSyncResult> {
  const wpBaseUrl = sanitizeWpUrl(rawUrl);

  if (!wpBaseUrl) {
    return {
      success: false,
      syncedCount: 0,
      syncedPosts: [],
      error: 'Invalid or empty WordPress URL provided.',
    };
  }

  const syncedPosts: Array<{ id: string; title: string; slug: string }> = [];

  try {
    for (let page = 1; page <= maxPages; page++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const res = await fetch(`${wpBaseUrl}/wp-json/wp/v2/posts?_embed=1&per_page=20&page=${page}&status=publish`, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
        redirect: 'follow',
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        // If 400 with 'rest_post_invalid_page_number', we've reached the last page
        if (res.status === 400 || (page > 1 && res.status === 404)) {
          break;
        }
        if (page === 1) {
          throw new Error(`WordPress REST API returned HTTP ${res.status}. Verify your WordPress URL is correct and public.`);
        }
        break;
      }

      const wpPosts = await res.json();
      if (!Array.isArray(wpPosts) || wpPosts.length === 0) {
        break;
      }

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
          status: 'published',
          published_at: item.date ? new Date(item.date).toISOString() : new Date().toISOString(),
          reading_time_minutes: readingTime,
          meta_title: `${item.title?.rendered} | Srinoos`,
          meta_description: cleanExcerpt || 'Read this article on Srinoos.',
        };

        const saved = upsertPostFromWordPress(mappedPost);
        syncedPosts.push({
          id: saved.id,
          title: saved.title,
          slug: saved.slug,
        });
      }
    }

    // Persist configuration & last sync timestamp
    try {
      updateWebsiteSettings({
        wordpress_last_synced: new Date().toISOString(),
        wordpress_url: wpBaseUrl,
        wordpress_enabled: true,
      });
    } catch {}

    const friendlyMessage = syncedPosts.length === 0
      ? 'WordPress connection verified successfully, but 0 published articles were found. Please create and publish a post in your WordPress dashboard, then click Sync again.'
      : `Successfully synchronized ${syncedPosts.length} article${syncedPosts.length === 1 ? '' : 's'} from WordPress!`;

    return {
      success: true,
      syncedCount: syncedPosts.length,
      syncedPosts,
      message: friendlyMessage,
    };
  } catch (err: any) {
    return {
      success: false,
      syncedCount: syncedPosts.length,
      syncedPosts,
      message: 'Sync encountered an issue',
      error: err.name === 'AbortError' ? 'Sync timed out' : err.message || 'Error syncing articles from WordPress',
    };
  }
}
