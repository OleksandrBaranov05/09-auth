// app/(private routes)/profile/page.tsx
import type { Metadata } from 'next';
import Image from 'next/image';
import css from './page.module.css';

export const metadata: Metadata = {
  title: 'Profile — NoteHub',
  description: 'Your profile page',
  openGraph: {
    title: 'Profile — NoteHub',
    description: 'Your profile page',
    url: 'https://notehub.app/profile',
    images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
  },
};

export default function ProfilePage() {

  const username = 'your_username';
  const email = 'your_email@example.com';
  const avatar = 'https://ac.goit.global/img/no-user.png';

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <a href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </a>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={avatar}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
            priority
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {username}</p>
          <p>Email: {email}</p>
        </div>
      </div>
    </main>
  );
}
