'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal/Modal';
import { fetchNoteById } from '@/lib/api/clientApi';
import type { Note } from '@/types/note';
import css from './NotePreview.module.css';

export default function NotePreview({ id }: { id: string }) {
  const router = useRouter();

  const { data, isLoading, isError } = useQuery<Note>({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) {
    return (
      <Modal onClose={() => router.back()}>
        <p>Loading, please wait...</p>
      </Modal>
    );
  }

  if (isError || !data) {
    return (
      <Modal onClose={() => router.back()}>
        <p>Something went wrong.</p>
      </Modal>
    );
  }

  return (
    <Modal onClose={() => router.back()}>
      <div className={css.container}>
        <div className={css.item}>
          <div className={css.header}>
            <h2>{data.title}</h2>
          </div>
          <p className={css.content}>{data.content}</p>
          <p className={css.date}>{data.createdAt ? new Date(data.createdAt).toLocaleString() : ''}</p>
        </div>
      </div>
    </Modal>
  );
}
