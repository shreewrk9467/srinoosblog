import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getPostById, updatePost, deletePost } from '@/lib/db';
import { getSessionFromCookies } from '@/lib/auth';
import { isSupabaseConfigured, getSupabaseClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const post = getPostById(params.id);
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }
  return NextResponse.json({ post });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
  }

  try {
    const body: any = await request.json();
    const updated = updatePost(params.id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Sync to Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        const client = getSupabaseClient();
        if (client) {
          await client.from('blog_posts').upsert({
            id: updated.id,
            title: updated.title,
            slug: updated.slug,
            excerpt: updated.excerpt,
            content: updated.content,
            featured_image: updated.featured_image,
            category_id: updated.category_id,
            status: updated.status,
            is_featured: Boolean(updated.is_featured),
            is_trending: Boolean(updated.is_trending),
            reading_time_minutes: updated.reading_time_minutes,
            meta_title: updated.meta_title,
            meta_description: updated.meta_description,
            published_at: updated.published_at,
            author_name: updated.author_name,
            updated_at: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.warn('Supabase post update sync notice:', err);
      }
    }

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/blog');
      revalidatePath('/blog/[slug]', 'page');
      revalidatePath('/admin/blogs');
      revalidatePath('/admin/content');
    } catch {}

    return NextResponse.json({ success: true, post: updated });
  } catch (error: any) {
    console.error('Update blog error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
  }

  const success = deletePost(params.id);
  if (!success) {
    return NextResponse.json({ error: 'Post not found or could not be deleted' }, { status: 404 });
  }

  // Sync deletion to Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      const client = getSupabaseClient();
      if (client) {
        await client.from('blog_posts').delete().eq('id', params.id);
      }
    } catch (err) {
      console.warn('Supabase post delete sync notice:', err);
    }
  }

  try {
    revalidatePath('/', 'layout');
    revalidatePath('/blog');
    revalidatePath('/blog/[slug]', 'page');
    revalidatePath('/admin/blogs');
    revalidatePath('/admin/content');
  } catch {}

  return NextResponse.json({ success: true, message: 'Post deleted successfully' });
}
