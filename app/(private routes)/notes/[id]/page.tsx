// app/(private routes)/notes/[id]/page.tsx
import type { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { sFetchNoteById } from '@/lib/api/serverApi';
import NoteDetailsClient from './NoteDetails.client';

export async function generateMetadata(
  props: Promise<{ params: { id: string } }>
): Promise<Metadata> {
  try {
    const { params } = await props;
    const note = await sFetchNoteById(params.id);
    return {
      title: `${note.title} — NoteHub`,
      description: note.content.slice(0, 120),
      openGraph: {
        title: `${note.title} — NoteHub`,
        description: note.content.slice(0, 120),
        url: `/notes/${params.id}`,
        images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
      },
    };
  } catch {
    return {
      title: 'Note — NoteHub',
      description: 'Note details',
    };
  }
}

export default async function NotePage(
  props: Promise<{ params: { id: string } }>
) {
  const { params } = await props;
  const qc = new QueryClient();

  await qc.prefetchQuery({
    queryKey: ['note', params.id],
    queryFn: () => sFetchNoteById(params.id),
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
