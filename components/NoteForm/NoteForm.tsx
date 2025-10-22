'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api/clientApi';
import type { NoteTag } from '@/types/note';
import { useNoteStore } from '@/lib/store/noteStore';
import css from './NoteForm.module.css';

const TAGS: NoteTag[] = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

export default function NoteForm() {
  const router = useRouter();
  const qc = useQueryClient();

  const draft = useNoteStore((s) => s.draft);
  const setDraft = useNoteStore((s) => s.setDraft);
  const clearDraft = useNoteStore((s) => s.clearDraft);

  const [title, setTitle] = useState(draft.title);
  const [content, setContent] = useState(draft.content);
  const [tag, setTag] = useState<NoteTag>(draft.tag as NoteTag);

  // Ініціалізувати з draft лише один раз (не підписуємось на зміни draft)
  useEffect(() => {
    setTitle(draft.title);
    setContent(draft.content);
    setTag(draft.tag as NoteTag);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ← важливо!

  const mutate = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notes'] });
      clearDraft();
      router.back();
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate.mutate({ title, content, tag });
  };

  // оновлюємо draft лише у onChange — жодних ефектів, щоб не зациклити
  return (
    <form className={css.form} onSubmit={onSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          className={css.input}
          value={title}
          onChange={(e) => {
            const v = e.target.value;
            setTitle(v);
            setDraft({ title: v });
          }}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          className={css.textarea}
          value={content}
          onChange={(e) => {
            const v = e.target.value;
            setContent(v);
            setDraft({ content: v });
          }}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          className={css.select}
          value={tag}
          onChange={(e) => {
            const v = e.target.value as NoteTag;
            setTag(v);
            setDraft({ tag: v });
          }}
        >
          {TAGS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className={css.actions}>
        <button type="submit" className={css.submitButton} disabled={mutate.isPending}>
          Create
        </button>
        <button type="button" className={css.cancelButton} onClick={() => router.back()}>
          Cancel
        </button>
      </div>
    </form>
  );
}
