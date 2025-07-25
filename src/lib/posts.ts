import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'src', 'app', 'posts');

export function getSortedPostsData() {
  const fileNames = fs.readdirSync(postsDirectory);

  const allPostsData = fileNames
  .filter((fileName) => fs.lstatSync(path.join(postsDirectory, fileName)).isFile())
  .map((fileName) => {
    const id = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);
    const excerpt = matterResult.content.slice(0, 100).replace(/\n/g, ' ') + '...';

    return {
      id,
      excerpt,
      ...(matterResult.data as { date: string; title: string; tags?: string[] }),
    };
  });


  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostData(id: string) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  const processedContent = await remark().use(html).process(matterResult.content);
  const contentHtml = processedContent.toString();

  const excerpt = matterResult.content
    .split('\n')
    .find((line) => line.trim() !== '')
    ?.slice(0, 100);

  return {
    id,
    contentHtml,
    excerpt,
    ...(matterResult.data as { title: string; date: string }),
  };
}

export function getAllTags(): string[] {
  const posts = getSortedPostsData();
  const tagSet = new Set<string>();

  posts.forEach((post) => {
    post.tags?.forEach((tag) => tagSet.add(tag));
  });

  return Array.from(tagSet).sort((a, b) => a.localeCompare(b, 'ko'));
}
