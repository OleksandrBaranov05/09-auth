'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/clientApi';
import Modal from '@/components/Modal/Modal';
import css from './modal-note.module.css';

export default function NotePreview({ id }: { id: string }) {
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  const close = () => router.back();

  return (
    <Modal onClose={close}>
      <div className={css.wrapper}>
        <button className={css.closeBtn} onClick={close} type="button">
          Close
        </button>

        {isLoading && <p>Loading…</p>}
        {isError && <p>Failed to load note.</p>}
        {data && (
          <article>
            <h2>{data.title}</h2>
            <p>{data.content}</p>
            <p><strong>Tag:</strong> {data.tag}</p>
          </article>
        )}
      </div>
    </Modal>
  );
}
