import Head from 'next/head';
import { getPostData, getSortedPostsData } from '@/lib/posts';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({ slug: post.id }));
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostData(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <Head>
        <title>{post.title} | My Blog</title>
        <meta name="description" content={post.excerpt || post.title} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || post.title} />
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content={`https://yourdomain.com/posts/${post.id}`}
        />
      </Head>

      <main className="max-w-3xl mx-auto p-8">
        <article className="prose prose-lg prose-indigo dark:prose-invert">
          <h1 className="mb-4 font-extrabold text-4xl leading-tight">
            {post.title}
          </h1>
          <time
            dateTime={post.date}
            className="block mb-8 text-gray-500 text-sm tracking-wide"
          >
            {new Date(post.date).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          <section
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            className="mt-6"
          />
        </article>
      </main>
    </>
  );
}
