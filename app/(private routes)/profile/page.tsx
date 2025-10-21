import type { Metadata } from 'next';
import css from './ProfilePage.module.css';

export const metadata: Metadata = {
  title: 'Profile — NoteHub',
  description: 'Your profile page.',
  openGraph: {
    title: 'Profile — NoteHub',
    description: 'Your profile page.',
    url: 'https://notehub.app/profile',
    images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
  },
};

export default function ProfilePage() {
  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <a href="/profile/edit" className={css.editProfileButton}>Edit Profile</a>
        </div>

        <div className={css.avatarWrapper}>
          <img
            src="https://ac.goit.global/img/no-user.png"
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: your_username</p>
          <p>Email: your_email@example.com</p>
        </div>
      </div>
    </main>
  );
}
