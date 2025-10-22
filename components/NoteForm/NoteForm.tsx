'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api/clientApi';
import type { NoteTag } from '@/types/note';
import { useNoteStore } from '@/lib/store/noteStore';
import css from './NoteForm.module.css';

const TAGS: NoteTag[] = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

export interface NoteFormProps {
  onCancel?: () => void;
}

export default function NoteForm({ onCancel }: NoteFormProps) {
  const router = useRouter();
  const qc = useQueryClient();

 
  const draft = useNoteStore((s) => s.draft);
  const setDraft = useNoteStore((s) => s.setDraft);
  const clearDraft = useNoteStore((s) => s.clearDraft);

  
  const [title, setTitle] = useState(draft.title);
  const [content, setContent] = useState(draft.content);
  const [tag, setTag] = useState<NoteTag>(draft.tag);


  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setDraft({ title, content, tag });
  }, [title, content, tag, setDraft]);

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      clearDraft();
      qc.invalidateQueries({ queryKey: ['notes'] });
      router.back();
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);

    const t = title.trim();
    const c = content.trim();

    if (!t || !c) return;

    mutation.mutate({ title: t, content: c, tag });
  }

  return (
    <form className={css.form} onSubmit={handleSubmit} noValidate>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          className={css.input}
          type="text"
          placeholder="Enter title…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-invalid={submitted && !title.trim() ? 'true' : 'false'}
        />
        {submitted && !title.trim() && (
          <span className={css.error}>Title is required</span>
        )}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          className={css.textarea}
          placeholder="Write your note…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          aria-invalid={submitted && !content.trim() ? 'true' : 'false'}
        />
        {submitted && !content.trim() && (
          <span className={css.error}>Content is required</span>
        )}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          className={css.select}
          value={tag}
          onChange={(e) => setTag(e.target.value as NoteTag)}
        >
          {TAGS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="submit"
          className={css.submitButton}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Creating…' : 'Create'}
        </button>

        <button
          type="button"
          className={css.cancelButton}
          onClick={() => (onCancel ? onCancel() : router.back())}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
