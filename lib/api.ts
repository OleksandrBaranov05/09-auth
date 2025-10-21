import axios, { AxiosInstance } from 'axios';
import type { Note, NoteTag } from '@/types/note';

const BASE_URL = 'https://notehub-public.goit.study/api';

const http: AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

http.interceptors.request.use((config) => {
  const raw = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN as string | undefined;
  const token = raw ? raw.replace(/^['"]|['"]$/g, '').trim() : '';
  const headers = (config.headers ?? {}) as any;

  if (typeof (headers as any).set === 'function') {
    (headers as any).set('Authorization', `Bearer ${token}`);
    (headers as any).set('Content-Type', 'application/json');
  } else {
    (config as any).headers = {
      ...headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }
  return config;
});

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string; // ✅ нове поле
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
  page: number;
  perPage: number;
}

export interface CreateNoteBody {
  title: string;
  content: string;
  tag: NoteTag;
}

export async function fetchNotes(params: FetchNotesParams): Promise<FetchNotesResponse> {
  const { page = 1, perPage = 12, search, tag } = params;

  const query: Record<string, string | number> = {
    page,
    perPage,
  };

  if (search) query.search = search;
  if (tag && tag !== 'All') query.tag = tag; // ✅ фільтрація за тегом

  const res = await http.get<FetchNotesResponse>('/notes', { params: query });
  return res.data;
}

export async function createNote(body: CreateNoteBody): Promise<Note> {
  const res = await http.post<Note>('/notes', body);
  return res.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const res = await http.delete<Note>(`/notes/${id}`);
  return res.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const res = await http.get<Note>(`/notes/${id}`);
  return res.data;
}
