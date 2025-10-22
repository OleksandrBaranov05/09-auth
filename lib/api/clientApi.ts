import { api } from './api';
import type { Note } from '@/types/note';
import type { User } from '@/types/user';

// NOTES
export async function fetchNotes(params: { page: number; perPage: number; search?: string; tag?: string; }) {
  const res = await api.get<{ notes: Note[]; totalPages: number }>(
    '/notes',
    { params }
  );
  return res.data;
}

export async function fetchNoteById(id: string) {
  const res = await api.get<Note>(`/notes/${id}`);
  return res.data;
}

export async function createNote(body: { title: string; content: string; tag: Note['tag'] }) {
  const res = await api.post<Note>('/notes', body);
  return res.data;
}

export async function deleteNote(id: string) {
  const res = await api.delete<Note>(`/notes/${id}`);
  return res.data;
}

// AUTH + USER
export async function register(email: string, password: string) {
  const res = await api.post<User>('/auth/register', { email, password });
  return res.data;
}

export async function login(email: string, password: string) {
  const res = await api.post<User>('/auth/login', { email, password });
  return res.data;
}

export async function logout() {
  await api.post('/auth/logout');
}

export async function checkSession() {
  const res = await api.get<User | null>('/auth/session');
  return res.data ?? null;
}

export async function getMe() {
  const res = await api.get<User>('/users/me');
  return res.data;
}

export async function updateMe(body: Partial<User>) {
  const res = await api.patch<User>('/users/me', body);
  return res.data;
}
