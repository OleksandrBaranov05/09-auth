import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { sFetchNoteById } from '@/lib/api/serverApi';
import NoteDetails from './NoteDetails.client';

export default async function NoteDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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
