'use client';

import { useEffect, useState } from 'react';
import { checkSession, logout } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import { usePathname, useRouter } from 'next/navigation';

const PRIVATE_PREFIXES = ['/notes', '/profile'];
const PUBLIC_AUTH_PAGES = ['/sign-in', '/sign-up'];

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true);
  const setUser = useAuthStore((s) => s.setUser);
  const clearIsAuthenticated = useAuthStore((s) => s.clearIsAuthenticated);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const user = await checkSession();
        if (user) {
          if (!isMounted) return;
          setUser(user);

          // якщо ми на /sign-in | /sign-up і вже залогінені — в профіль
          if (PUBLIC_AUTH_PAGES.includes(pathname)) {
            router.replace('/profile');
          }
        } else {
          if (!isMounted) return;
          clearIsAuthenticated();

          // якщо ми на приватній сторінці — в логін
          if (PRIVATE_PREFIXES.some((p) => pathname.startsWith(p))) {
            await logout().catch(() => {});
            router.replace('/sign-in');
          }
        }
      } catch {
        // якщо помилка — вважаємо неавторизований
        clearIsAuthenticated();
        if (PRIVATE_PREFIXES.some((p) => pathname.startsWith(p))) {
          router.replace('/sign-in');
        }
      } finally {
        if (isMounted) setChecking(false);
      }
    })();

    return () => { isMounted = false; };
  }, [pathname, router, setUser, clearIsAuthenticated]);

  if (checking) return <p style={{ padding: 16 }}>Checking session...</p>;

  return <>{children}</>;
}
