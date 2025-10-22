import type { Metadata } from 'next';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { HydrationBoundary } from '@tanstack/react-query';
import { sFetchNoteById } from '@/lib/api/serverApi';
import NoteDetails from './NoteDetails.client';

const SITE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  try {
    const note = await sFetchNoteById(params.id);
    const title = note ? `${note.title} — Note` : 'Note — Not found';
    const description = note
      ? (note.content?.slice(0, 120) || 'Note details')
      : 'The note was not found.';

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${SITE_URL}/notes/${params.id}`,
        images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
      },
    };
  } catch {
    return {
      title: 'Note — Error',
      description: 'Failed to load note.',
      openGraph: {
        title: 'Note — Error',
        description: 'Failed to load note.',
        url: `${SITE_URL}/notes/${params.id}`,
        images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
      },
    };
  }
}

export default async function Page(
  { params }: { params: { id: string } }
) {
  const qc = new QueryClient();
  await qc.prefetchQuery({
    queryKey: ['note', params.id],
    queryFn: () => sFetchNoteById(params.id),
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <NoteDetails />
    </HydrationBoundary>
  );
}
