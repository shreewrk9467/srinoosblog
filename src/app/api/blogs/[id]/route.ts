import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getPostById, updatePost, deletePost } from '@/lib/db';
import { getSessionFromCookies } from '@/lib/auth';

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
    const body = await request.json();
    const updated = updatePost(params.id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    try {
      revalidatePath('/', 'layout');
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

  try {
    revalidatePath('/', 'layout');
  } catch {}

  return NextResponse.json({ success: true, message: 'Post deleted successfully' });
}
