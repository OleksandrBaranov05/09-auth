import { api } from './api';
import type { Note } from '@/types/note';
import type { User } from '@/types/user';

function withCookieHeader(cookie?: string) {
  return cookie ? { headers: { Cookie: cookie } } : undefined;
}

export async function sFetchNotes(
  params: { page: number; perPage: number; search?: string; tag?: string },
  cookie?: string
): Promise<{ notes: Note[]; totalPages: number }> {
  const { page, perPage, search, tag } = params;
  const qp = new URLSearchParams();
  qp.set('page', String(page));
  qp.set('perPage', String(perPage));
  if (search) qp.set('search', search);
  if (tag && tag !== 'All') qp.set('tag', tag);

  const { data } = await api.get<{ notes: Note[]; totalPages: number }>(
    `/notes?${qp.toString()}`, withCookieHeader(cookie)
  );
  return data;
}

export async function sFetchNoteById(id: string, cookie?: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`, withCookieHeader(cookie));
  return data;
}

export async function sGetMe(cookie?: string): Promise<User> {
  const { data } = await api.get<User>('/users/me', withCookieHeader(cookie));
  return data;
}

export async function sCheckSession(cookie?: string): Promise<User | null> {
  const { data } = await api.get<User | null>('/auth/session', withCookieHeader(cookie));
  return data ?? null;
}
