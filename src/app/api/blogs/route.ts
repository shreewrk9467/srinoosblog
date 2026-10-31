import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts, createPost, getDailyPublishingProgress } from '@/lib/db';
import { getSessionFromCookies } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const status = searchParams.get('status') || undefined;
  const categoryId = searchParams.get('categoryId') || undefined;
  const search = searchParams.get('search') || undefined;
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

  const posts = getAllPosts({
    status,
    categoryId,
    search,
    limit,
  });

  const dailyProgress = getDailyPublishingProgress();

  return NextResponse.json({
    posts,
    dailyProgress,
    total: posts.length,
  });
}

export async function POST(request: NextRequest) {
  const session = getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Auto-generate slug if not provided
    let slug = body.slug;
    if (!slug) {
      slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    const newPost = createPost({
      ...body,
      slug,
      author_name: session.fullName || body.author_name || 'Srinoos Editorial Team',
    });

    return NextResponse.json({ success: true, post: newPost }, { status: 201 });
  } catch (error: any) {
    console.error('Create blog error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create blog post. Ensure slug is unique.' },
      { status: 500 }
    );
  }
}
