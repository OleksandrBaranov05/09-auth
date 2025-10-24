'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/clientApi';
import type { Note } from '@/types/note';
import Modal from '@/components/Modal/Modal';
import css from './modal-note.module.css';

export default function NotePreview({ id }: { id: string }) {
  const { data, isLoading, error } = useQuery<Note>({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  if (isLoading)
    return (
      <Modal>
        <p>Loading…</p>
      </Modal>
    );

  if (error || !data)
    return (
      <Modal>
        <p>Failed to load note.</p>
      </Modal>
    );

  return (
    <Modal>
      <div className={css.wrapper}>
        <article className={css.item}>
          <header className={css.header}>
            <h2>{data.title}</h2>
          </header>

          <p className={css.content}>{data.content}</p>

          <div className={css.footer}>
            <span className={css.tag}>Tag: {data.tag}</span>
          </div>
        </article>
      </div>
    </Modal>
  );
}
