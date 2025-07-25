import { NextRequest, NextResponse } from 'next/server';
import { getSortedPostsData } from '@/lib/posts';

const POSTS_PER_PAGE = 5;

export async function GET(req: NextRequest, context: { params: { page: string } }) {
  const page = parseInt(context.params.page, 10) || 1;
  const allPosts = getSortedPostsData();

  const startIdx = (page - 1) * POSTS_PER_PAGE;
  const pagedPosts = allPosts.slice(startIdx, startIdx + POSTS_PER_PAGE);

  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

  return NextResponse.json({
    posts: pagedPosts,
    page,
    totalPages,
  });
}
