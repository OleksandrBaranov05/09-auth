// app/@modal/(.)notes/[id]/page.tsx
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { sFetchNoteById } from '@/lib/api/serverApi';
import NotePreview from './NotePreview.client';

export default async function ModalNotePage(
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
      <NotePreview id={params.id} />
    </HydrationBoundary>
  );
}
