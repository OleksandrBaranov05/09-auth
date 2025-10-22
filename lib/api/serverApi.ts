// lib/api/serverApi.ts
import { cookies } from 'next/headers';
import { api } from './api';
import type { Note } from '@/types/note';
import type { User } from '@/types/user';
import { isAxiosError } from 'axios';

/** Збираємо рядок Cookie з accessToken і refreshToken з Next SSR cookies */
function cookieHeaderFromNext(): string {
  const c = cookies();
  const access = c.get('accessToken')?.value;
  const refresh = c.get('refreshToken')?.value;
  const parts: string[] = [];
  if (access) parts.push(`accessToken=${access}`);
  if (refresh) parts.push(`refreshToken=${refresh}`);
  return parts.join('; ');
}

// -------- USERS ----------
export async function sGetMe(): Promise<User | null> {
  try {
    const Cookie = cookieHeaderFromNext();
    if (!Cookie) return null; // немає токенів — значить користувач неавторизований
    const res = await api.get<User>('/users/me', { headers: { Cookie } });
    return res.data ?? null;
  } catch (err) {
    if (isAxiosError(err) && err.response?.status === 401) {
      return null; // токен прострочений/недійсний — вважай, що неавторизований
    }
    throw err;
  }
}

// -------- NOTES ----------
export async function sFetchNotes(params: {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
}): Promise<{ notes: Note[]; totalPages: number }> {
  const { page, perPage, search, tag } = params;
  const Cookie = cookieHeaderFromNext();

  const qp = new URLSearchParams();
  qp.set('page', String(page));
  qp.set('perPage', String(perPage));
  if (search) qp.set('search', search);
  if (tag && tag !== 'All') qp.set('tag', tag);

  const res = await api.get<{ notes: Note[]; totalPages: number }>(`/notes?${qp.toString()}`, {
    headers: { Cookie },
  });
  return res.data;
}

export async function sFetchNoteById(id: string): Promise<Note> {
  const Cookie = cookieHeaderFromNext();
  const res = await api.get<Note>(`/notes/${id}`, { headers: { Cookie } });
  return res.data;
}
