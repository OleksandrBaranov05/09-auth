import type { Metadata } from 'next';
import { fetchNoteById } from '@/lib/api';

const SITE_URL = 'https://notehub.app'; // заміни на свій

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const note = await fetchNoteById(id);
    const title = `${note.title} | NoteHub`;
    const desc =
      note.content.length > 140
        ? `${note.content.slice(0, 137)}...`
        : note.content || 'Note details';

    return {
      title,
      description: desc,
      openGraph: {
        title,
        description: desc,
        url: `${SITE_URL}/notes/${id}`,
        images: [
          {
            url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
            width: 1200,
            height: 630,
            alt: 'NoteHub',
          },
        ],
      },
    };
  } catch {
    const title = 'Note | NoteHub';
    const desc = 'Note details';
    return {
      title,
      description: desc,
      openGraph: {
        title,
        description: desc,
        url: `${SITE_URL}/notes/${id}`,
        images: [
          {
            url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
            width: 1200,
            height: 630,
            alt: 'NoteHub',
          },
        ],
      },
    };
  }
}

export default function NotePage() {
  // можеш показати простий fallback або переадресувати на /notes/filter/All
  return null;
}
