import { redirect } from 'next/navigation';

export default function RedirectToFirstPage({ params }: { params: { tag: string } }) {
  const { tag } = params;
  redirect(`/tags/${encodeURIComponent(tag)}/page/1`);
}