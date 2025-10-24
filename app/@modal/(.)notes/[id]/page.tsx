import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { sFetchNoteById } from '@/lib/api/serverApi';
import Modal from '@/components/Modal/Modal';
import NotePreview from './NotePreview.client';

export default async function ModalNotePage({
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
    <Modal>
      <HydrationBoundary state={dehydrate(qc)}>
        <NotePreview id={id} />
      </HydrationBoundary>
    </Modal>
  );
}
