import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getPostById, getPostByIdAsync, updatePost, deletePost } from '@/lib/db';
import { getSessionFromCookies } from '@/lib/auth';
import { isSupabaseConfigured, saveSupabasePost, deleteSupabasePost } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const post = (await getPostByIdAsync(params.id)) || getPostById(params.id);
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
        await saveSupabasePost(updated);
      } catch (err) {
        console.warn('Supabase post update sync notice:', err);
      }
    }

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/blog');
      revalidatePath(`/blog/${updated.slug}`);
      revalidatePath('/blog/[slug]', 'page');
      revalidatePath('/admin/blogs');
      revalidatePath('/admin/builder');
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
      await deleteSupabasePost(params.id);
    } catch (err) {
      console.warn('Supabase post delete sync notice:', err);
    }
  }

  try {
    revalidatePath('/', 'layout');
    revalidatePath('/blog');
    revalidatePath('/admin/blogs');
    revalidatePath('/admin/builder');
    revalidatePath('/admin/content');
  } catch {}

  return NextResponse.json({ success: true, message: 'Post deleted successfully' });
}
