'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import css from './SignInPage.module.css';

export default function SignInPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get('email') || '');
    const password = String(fd.get('password') || '');

    try {
      const user = await login({ email, password });
      setUser(user);
      router.replace('/profile');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed');
    }
  }

  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={onSubmit}>
        <h1 className={css.formTitle}>Sign in</h1>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" className={css.input} required />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" name="password" className={css.input} required />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>Log in</button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}
