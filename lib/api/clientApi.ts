import { api } from './api';
import type { Note } from '@/types/note';
import type { User } from '@/types/user';


export const register = async (email: string, password: string): Promise<User> => {
  const { data } = await api.post<User>('/auth/register', { email, password });
  return data;
};

export const login = async (email: string, password: string): Promise<User> => {
  const { data } = await api.post<User>('/auth/login', { email, password });
  return data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const checkSession = async (): Promise<User | null> => {
  const { data } = await api.get<User | null>('/auth/session');
  return data ?? null;
};

export const getMe = async (): Promise<User> => {
  const { data } = await api.get<User>('/users/me');
  return data;
};

export const updateMe = async (payload: { username: string }): Promise<User> => {
  const { data } = await api.patch<User>('/users/me', payload);
  return data;
};

export const fetchNotes = async (params: {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
}): Promise<{ notes: Note[]; totalPages: number }> => {
  const { page, perPage, search, tag } = params;
  const qp = new URLSearchParams();
  qp.set('page', String(page));
  qp.set('perPage', String(perPage));
  if (search) qp.set('search', search);
  if (tag && tag !== 'All') qp.set('tag', tag);

  const { data } = await api.get<{ notes: Note[]; totalPages: number }>(`/notes?${qp.toString()}`);
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};

export const createNote = async (payload: { title: string; content: string; tag: string }): Promise<Note> => {
  const { data } = await api.post<Note>('/notes', payload);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
};
