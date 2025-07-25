import { redirect } from 'next/navigation';

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function RedirectToFirstPage({ params }: any) {
  const { tag } = params;
  redirect(`/tags/${encodeURIComponent(tag)}/page/1`);
}