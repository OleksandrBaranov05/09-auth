import type { Metadata } from 'next';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { HydrationBoundary } from '@tanstack/react-query';
import NotesClient from './Notes.client';
import { sFetchNotes } from '@/lib/api/serverApi';

const SITE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export async function generateMetadata(
  { params }: { params: { slug?: string[] } }
): Promise<Metadata> {
  const tag = params.slug?.[0] ?? 'All';
  const title = `Notes — ${tag}`;
  const description = `Browse notes filtered by tag: ${tag}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/notes/filter/${tag}`,
      images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
    },
  };
}

export default async function Page(
  { params }: { params: { slug?: string[] } }
) {
  const tag = params.slug?.[0] ?? 'All';

  const qc = new QueryClient();
  await qc.prefetchQuery({
    queryKey: ['notes', { page: 1, search: '', tag }],
    queryFn: () => sFetchNotes({ page: 1, perPage: 12, tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
