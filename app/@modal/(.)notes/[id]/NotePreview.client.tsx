'use client';

import { useQuery } from '@tanstack/react-query';
import type { Note } from '@/types/note';
import { fetchNoteById } from '@/lib/api/clientApi';
import css from './modal-note.module.css';
import { useRouter } from 'next/navigation';

export default function NotePreview({ id }: { id: string }) {
  const { data, isLoading, error } = useQuery<Note>({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });
  const router = useRouter();

  if (isLoading) return <p>Loading…</p>;
  if (error || !data) return <p>Failed to load note</p>;

  return (
    <div className={css.wrapper}>
      <button onClick={() => router.back()} className={css.closeBtn}>
        ✕ Close
      </button>

      <article className={css.item}>
        <header className={css.header}>
          <h2>{data.title}</h2>
        </header>

        <div className={css.content}>{data.content}</div>

        <p className={css.date}>Tag: {data.tag}</p>
      </article>
    </div>
  );
}
