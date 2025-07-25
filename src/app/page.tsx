'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';

type Post = {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  tags?: string[];
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const loader = useRef<HTMLDivElement | null>(null);

  const fetchPosts = useCallback(async (pageNum: number) => {
    if (
      isLoading ||
      (totalPages !== null && pageNum > totalPages) ||
      pageNum <= page
    )
      return;

    setIsLoading(true);
    const res = await fetch(`/api/posts/page/${pageNum}`);
    if (!res.ok) {
      console.error('Failed to fetch posts');
      setIsLoading(false);
      return;
    }

    const data: { posts: Post[]; page: number; totalPages: number } = await res.json();

    setPosts((prev) => {
      if (pageNum === 1) return data.posts;

      const newPosts = data.posts.filter(
        (post) => !prev.some((p) => p.id === post.id)
      );

      return [...prev, ...newPosts];
    });
    setPage(data.page);
    setTotalPages(data.totalPages);
    setIsLoading(false);
  }, [isLoading, page, totalPages]);

  useEffect(() => {
    fetchPosts(1);
  }, [fetchPosts]);

  useEffect(() => {
    if (!loader.current || totalPages === null) return;

    const currentLoader = loader.current;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !isLoading && page < totalPages) {
          fetchPosts(page + 1);
        }
      },
      { root: null, rootMargin: '100px', threshold: 0.5 }
    );

    observer.observe(currentLoader);

    return () => {
      observer.unobserve(currentLoader);
    };
  }, [page, totalPages, isLoading, fetchPosts]);

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-5xl font-extrabold mb-10 text-center">My Tech Blog</h1>
      <div className="text-sm text-right mb-6">
        <Link href="/tags" className="text-blue-600 hover:underline">
          All Tags →
        </Link>
      </div>
      <ul className="space-y-6">
        {posts.map(({ id, title, date, excerpt, tags }) => (
          <li
            key={id}
            className="border p-6 rounded-lg hover:shadow-lg transition-shadow"
          >
            <Link
              href={`/posts/${id}`}
              className="text-2xl font-semibold text-blue-600 hover:underline"
            >
              {title}
            </Link>
            <p className="mt-1 text-gray-600 text-sm">{excerpt}</p>
            <div className="mt-2">
              {tags?.map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className="inline-block mr-2 mb-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs hover:bg-blue-200"
                >
                  #{tag}
                </Link>
              ))}
            </div>
            <p className="mt-2 text-gray-500 text-sm">
              {new Date(date).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </li>
        ))}
      </ul>
      <div ref={loader} className="h-10" />
    </main>
  );
}
