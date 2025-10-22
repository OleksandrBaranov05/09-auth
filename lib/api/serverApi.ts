import axios from 'axios';
import { cookies } from 'next/headers';
import type { Note } from '@/types/note';
import type { User } from '@/types/user';

// базовий URL бекенда (проксі на /api тут не підходить в SSG), але ми підемо теж через /api, додаючи cookie
const baseURL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

function authHeaders() {
  // Прокидаємо cookie з серверного контексту
  const cookieStore = cookies();
  const cookieHeader = cookieStore.toString();
  return {
    headers: {
      Cookie: cookieHeader,
    },
    withCredentials: true,
  };
}

// NOTES
export async function sFetchNotes(params: { page: number; perPage: number; search?: string; tag?: string; }) {
  const res = await axios.get<{ notes: Note[]; totalPages: number }>(
    `${baseURL}/notes`,
    { ...authHeaders(), params }
  );
  return res.data;
}

export async function sFetchNoteById(id: string) {
  const res = await axios.get<Note>(`${baseURL}/notes/${id}`, authHeaders());
  return res.data;
}

// USER / AUTH
export async function sGetMe() {
  const res = await axios.get<User>(`${baseURL}/users/me`, authHeaders());
  return res.data;
}

export async function sCheckSession() {
  const res = await axios.get<User | null>(`${baseURL}/auth/session`, authHeaders());
  return res.data ?? null;
}
