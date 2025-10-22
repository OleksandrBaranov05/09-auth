// app/(private routes)/notes/[id]/page.tsx
import type { Metadata } from 'next';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { QueryClient } from '@tanstack/react-query';
import NoteDetails from './NoteDetails.client';
import { sFetchNoteById } from '@/lib/api/serverApi';

type PageProps = {
  params: { id: string };
};

// ✅ generateMetadata можна залишити async, але params — НЕ Promise
export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const { id } = params;

  try {
    const note = await sFetchNoteById(id);
    return {
      title: `${note.title} — NoteHub`,
      description: note.content?.slice(0, 120) ?? 'Note details',
      openGraph: {
        title: `${note.title} — NoteHub`,
        description: note.content?.slice(0, 120) ?? 'Note details',
        url: `/notes/${id}`,
        images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
      },
    };
  } catch {
    return {
      title: 'Note — NoteHub',
      description: 'Note details',
      openGraph: {
        title: 'Note — NoteHub',
        description: 'Note details',
        url: `/notes/${id}`,
        images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
      },
    };
  }
}

// ✅ ГОЛОВНЕ ВИПРАВЛЕННЯ: тут теж params — НЕ Promise
export default async function NotePage({ params }: PageProps) {
  const { id } = params;

  const qc = new QueryClient();
  await qc.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => sFetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <NoteDetails />
    </HydrationBoundary>
  );
}
