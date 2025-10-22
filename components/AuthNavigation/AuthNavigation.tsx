'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import css from './AuthNavigation.module.css';

export default function AuthNavigation() {
  const router = useRouter();

  // ✅ беремо clearAuth з стора, а не clearIsAuthenticated
  const { isAuthenticated, user, clearAuth } = useAuthStore();

  const onLogout = async () => {
    try {
      await logout();
    } finally {
      clearAuth(); // тепер ця функція точно існує у сторі
      router.replace('/sign-in');
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <li className={css.navigationItem}>
          <Link href="/sign-in" className={css.navigationLink}>
            Login
          </Link>
        </li>
        <li className={css.navigationItem}>
          <Link href="/sign-up" className={css.navigationLink}>
            Sign up
          </Link>
        </li>
      </>
    );
  }

  return (
    <>
      <li className={css.navigationItem}>
        <Link href="/profile" className={css.navigationLink}>
          Profile
        </Link>
      </li>
      <li className={css.navigationItem}>
        <p className={css.userEmail}>{user?.email}</p>
        <button
          type="button"
          onClick={onLogout}
          className={css.logoutButton}
        >
          Logout
        </button>
      </li>
    </>
  );
}
