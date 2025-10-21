'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getMe, updateMe } from '@/lib/api/clientApi';
import type { User } from '@/types/user';
import css from './EditProfilePage.module.css';

export default function EditProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    (async () => {
      const me = await getMe();
      setUser(me);
      setUsername(me.username);
    })();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await updateMe({ username });
    router.replace('/profile');
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        {user && (
          <Image
            src={user.avatar}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        )}

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

          <p>Email: {user?.email || '...'}</p>

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
