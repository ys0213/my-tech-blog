import Link from 'next/link';
import { getAllTags } from '@/lib/posts';

export default async function TagListPage() {
  const tags = getAllTags();

  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">All Tags</h1>

      <ul className="flex flex-wrap justify-center gap-3">
        {tags.map((tag) => (
          <li key={tag}>
            <Link
              href={`/tags/${encodeURIComponent(tag)}`}
              className="inline-block bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 hover:from-blue-200 hover:to-blue-300 text-sm font-semibold px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200"
            >
              #{tag}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
