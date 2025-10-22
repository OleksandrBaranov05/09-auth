'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/clientApi';
import Modal from '@/components/Modal/Modal';
import css from './NotePreview.module.css';

export default function NotePreview({ id }: { id: string }) {
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    retry: false,
    refetchOnMount: false,
  });

  return (
    <Modal onClose={() => router.back()}>
      {isLoading && <p>Loading…</p>}
      {isError && <p>Failed to load note.</p>}
      {data && (
        <article className={css.note}>
          <h2 className={css.title}>{data.title}</h2>
          <p className={css.content}>{data.content}</p>
        </article>
      )}
    </Modal>
  );
}
