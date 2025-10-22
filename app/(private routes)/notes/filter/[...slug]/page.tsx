import type { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/clientApi';
import NotesClient from './Notes.client';

const OG_IMAGE = 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg';

export async function generateMetadata(
  { params }: { params: { slug?: string[] } }
): Promise<Metadata> {
  const tag = params.slug?.[0] ?? 'All';

  return {
    title: `Notes – ${tag}`,
    description: `List of notes filtered by ${tag}.`,
    openGraph: {
      title: `Notes – ${tag}`,
      description: `List of notes filtered by ${tag}.`,
      url: `/notes/filter/${tag}`,
      images: [OG_IMAGE],
    },
  };
}

export default async function Page({
  params,
}: {
  params: { slug?: string[] };
}) {
  const tag = params.slug?.[0] ?? 'All';

  const qc = new QueryClient();
  await qc.prefetchQuery({
    queryKey: ['notes', 1, '', tag],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: 12,
        tag: tag !== 'All' ? tag : undefined,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
