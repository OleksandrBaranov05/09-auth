import type { AxiosResponse } from 'axios';
import { cookies } from 'next/headers';
import { api } from './api';
import type { Note } from '@/types/note';
import type { User } from '@/types/user';

function cookieHeaderFromNext(): string {
  const jar = cookies();
  const entries: string[] = [];
  for (const c of jar.getAll()) {
    entries.push(`${c.name}=${encodeURIComponent(c.value)}`);
  }
  return entries.join('; ');
}

export async function sFetchNotes(params: {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}): Promise<Note[]> {
  const Cookie = cookieHeaderFromNext();
  const res = await api.get<Note[]>('/notes', {
    params,
    headers: { Cookie },
  });
  return res.data;
}

export async function sFetchNoteById(id: string): Promise<Note> {
  const Cookie = cookieHeaderFromNext();
  const res = await api.get<Note>(`/notes/${id}`, {
    headers: { Cookie },
  });
  return res.data;
}

export async function sGetMe(): Promise<User | null> {
  const Cookie = cookieHeaderFromNext();
  const res = await api.get<User | null>('/users/me', {
    headers: { Cookie },
  });
  return res.data ?? null;
}

/**
 * Перевірка/продовження сесії: GET /auth/session
 * Повертаємо ПОВНИЙ AxiosResponse, як вимагає рев’ю.
 */
export async function sCheckSession(): Promise<AxiosResponse<User | null>> {
  const Cookie = cookieHeaderFromNext();
  const res = await api.get<User | null>('/auth/session', {
    headers: { Cookie },
    // важливо, щоб заголовки Set-Cookie (якщо будуть) дійшли до middleware
    withCredentials: true,
  });
  return res;
}
