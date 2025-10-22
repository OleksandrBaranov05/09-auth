import { QueryClient, dehydrate } from '@tanstack/react-query';
import { HydrationBoundary } from '@tanstack/react-query';
import { sFetchNoteById } from '@/lib/api/serverApi';
import NotePreview from './NotePreview.client';

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
      <NotePreview id={params.id} />
    </HydrationBoundary>
  );
}
