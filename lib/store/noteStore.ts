import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NoteTag } from '@/types/note';

export const initialDraft = {
  title: '',
  content: '',
  tag: 'Todo' as NoteTag,
};

type Draft = typeof initialDraft;

type NoteStore = {
  draft: Draft;
  setDraft: (patch: Partial<Draft>) => void;
  clearDraft: () => void;
};

export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (patch) =>
        set((state) => ({ draft: { ...state.draft, ...patch } })),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: 'notehub-draft',
      partialize: (state) => ({ draft: state.draft }),
    }
  )
);
