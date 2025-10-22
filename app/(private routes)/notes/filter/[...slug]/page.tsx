// app/(private routes)/notes/filter/[...slug]/page.tsx
import type { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { sFetchNotes } from '@/lib/api/serverApi';
import NotesClient from './Notes.client';

export async function generateMetadata(
  props: Promise<{ params: { slug?: string[] } }>
): Promise<Metadata> {
  const { params } = await props;
  const tag = params.slug?.[0] ?? 'All';
  return {
    title: `Notes — ${tag}`,
    description: `Browse notes filtered by ${tag}`,
    openGraph: {
      title: `Notes — ${tag}`,
      description: `Browse notes filtered by ${tag}`,
      url: `/notes/filter/${tag}`,
      images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
    },
  };
}

export default async function NotesPage(
  props: Promise<{ params: { slug?: string[] } }>
) {
  const { params } = await props;
  const tag = params.slug?.[0] ?? 'All';

  const qc = new QueryClient();
  const page = 1;
  const perPage = 12;
  const search = '';

  await qc.prefetchQuery({
    queryKey: ['notes', page, search, tag],
    queryFn: () => sFetchNotes({ page, perPage, search, tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
