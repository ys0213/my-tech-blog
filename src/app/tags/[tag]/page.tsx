import { redirect } from 'next/navigation';

export default async function RedirectToFirstPage({ params }: { params: { tag: string } }) {
  const { tag } = await params;
  redirect(`/tags/${encodeURIComponent(tag)}/page/1`);
}