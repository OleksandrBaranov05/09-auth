'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

export default function NotesPage() {
  const { user } = useAuthStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes'],
    queryFn: () => fetchNotes({ page: 1, perPage: 12 }),
  });

  if (isLoading) return <p>Loading notes...</p>;
  if (isError) return <p>Failed to load notes.</p>;

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Welcome, {user?.username || 'User'}!</h1>
      <h2>Your Notes:</h2>
      <ul>
        {data?.notes?.length ? (
          data.notes.map((note) => <li key={note.id}>{note.title}</li>)
        ) : (
          <p>No notes yet.</p>
        )}
      </ul>
    </main>
  );
}
