import { getSortedPostsData } from '@/lib/posts';
import Link from 'next/link';

type TagPageProps = {
  params: {
    tag: string;
    page: string;
  };
};

const POSTS_PER_PAGE = 5;
/* eslint-disable @typescript-eslint/no-explicit-any */
export default function TagPage({ params }: any) {
  const { tag, page } = params;
  const decodedTag = decodeURIComponent(tag);

  const allPosts = getSortedPostsData();
  const filteredPosts = allPosts.filter((post) => post.tags?.includes(decodedTag));

  const currentPage = parseInt(page, 10) || 1;
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIdx = (currentPage - 1) * POSTS_PER_PAGE;
  const currentPosts = filteredPosts.slice(startIdx, startIdx + POSTS_PER_PAGE);

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Posts tagged with &quot;{decodedTag}&quot;</h1>

      {currentPosts.length === 0 ? (
        <p className="text-gray-500">No posts found for this tag.</p>
      ) : (
        <>
          <ul className="space-y-6">
            {currentPosts.map(({ id, title, date, excerpt, tags }) => (
              <li key={id} className="border p-6 rounded-lg hover:shadow-lg transition-shadow">
                <Link href={`/posts/${id}`} className="text-2xl font-semibold text-blue-600 hover:underline">
                  {title}
                </Link>
                <p className="mt-1 text-gray-600 text-sm">{excerpt}</p>
                <div className="mt-2">
                  {tags?.map((tag) => (
                    <Link
                      key={tag}
                      href={`/tags/${encodeURIComponent(tag)}/page/1`}
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

          <div className="flex justify-between mt-10">
            {currentPage > 1 ? (
              <Link
                href={`/tags/${encodeURIComponent(decodedTag)}/page/${currentPage - 1}`}
                className="text-blue-500 hover:underline"
              >
                ← Previous
              </Link>
            ) : <div />}

            {currentPage < totalPages && (
              <Link
                href={`/tags/${encodeURIComponent(decodedTag)}/page/${currentPage + 1}`}
                className="text-blue-500 hover:underline ml-auto"
              >
                Next →
              </Link>
            )}
          </div>
        </>
      )}
    </main>
  );
}

export async function generateStaticParams() {
  const posts = getSortedPostsData();

  const tagPageParams: { tag: string; page: string }[] = [];

  const postsByTag: Record<string, typeof posts> = {};

  posts.forEach((post) => {
    post.tags?.forEach((tag) => {
      if (!postsByTag[tag]) postsByTag[tag] = [];
      postsByTag[tag].push(post);
    });
  });

  const POSTS_PER_PAGE = 5;

  for (const tag in postsByTag) {
    const totalPages = Math.ceil(postsByTag[tag].length / POSTS_PER_PAGE);
    for (let page = 1; page <= totalPages; page++) {
      tagPageParams.push({ tag, page: page.toString() });
    }
  }

  return tagPageParams.map(({ tag, page }) => ({
    tag: encodeURIComponent(tag),
    page,
  }));
}