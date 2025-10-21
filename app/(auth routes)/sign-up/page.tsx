'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { register } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import css from './SignUpPage.module.css';

export default function SignUpPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [error, setError] = useState<string>('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const form = new FormData(e.currentTarget);
    const email = String(form.get('email') || '');
    const password = String(form.get('password') || '');
    try {
      const user = await register({ email, password });
      setUser(user);
      router.replace('/profile');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed');
    }
  }

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>
      <form className={css.form} onSubmit={onSubmit}>
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" className={css.input} required />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" className={css.input} required />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>Register</button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}
