import { api } from './api';
import type { Note } from '@/types/note';
import type { User } from '@/types/user';

export async function fetchNotes(params: {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
}): Promise<{ notes: Note[]; totalPages: number }> {
  const { page, perPage, search, tag } = params;
  const qp = new URLSearchParams();
  qp.set('page', String(page));
  qp.set('perPage', String(perPage));
  if (search) qp.set('search', search);
  if (tag && tag !== 'All') qp.set('tag', tag);

  const { data } = await api.get<{ notes: Note[]; totalPages: number }>(`/notes?${qp.toString()}`);
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNote(body: Pick<Note, 'title' | 'content' | 'tag'>): Promise<Note> {
  const { data } = await api.post<Note>('/notes', body);
  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
}

export async function register(body: { email: string; password: string }): Promise<User> {
  const { data } = await api.post<User>('/auth/register', body);
  return data;
}

export async function login(body: { email: string; password: string }): Promise<User> {
  const { data } = await api.post<User>('/auth/login', body);
  return data;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}

export async function checkSession(): Promise<User | null> {
  const { data } = await api.get<User | null>('/auth/session');
  return data ?? null;
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>('/users/me');
  return data;
}

export async function updateMe(patch: Partial<Pick<User, 'username'>>): Promise<User> {
  const { data } = await api.patch<User>('/users/me', patch);
  return data;
}
