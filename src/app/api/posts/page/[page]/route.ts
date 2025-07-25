import { NextRequest, NextResponse } from 'next/server';
import { getSortedPostsData } from '@/lib/posts';

const POSTS_PER_PAGE = 5;
/* eslint-disable @typescript-eslint/no-explicit-any */
export async function GET(req: NextRequest, context: any) {
  const pageParam = context?.params?.page;
  const page = pageParam ? parseInt(pageParam, 10) : 1;

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
