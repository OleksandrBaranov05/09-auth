'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateMe, getMe } from '@/lib/api/clientApi';
import css from './EditProfilePage.module.css';

export default function EditProfilePage() {
  const router = useRouter();
  // мінімально: локальний стан
  const [username, setUsername] = useState('your_username');
  const [email] = useState('your_email@example.com');
  const [avatar] = useState('https://ac.goit.global/img/no-user.png');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await updateMe({ username });
      router.push('/profile');
    } catch (err) {
      console.error(err);
      // можна показати повідомлення
    }
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={avatar}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} onSubmit={onSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <p>Email: {email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>Save</button>
            <button type="button" className={css.cancelButton} onClick={() => router.back()}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
