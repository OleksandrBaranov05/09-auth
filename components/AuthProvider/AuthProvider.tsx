'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { checkSession, logout } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

const PRIVATE_PREFIXES = ['/notes', '/profile'];
const AUTH_PREFIXES = ['/sign-in', '/sign-up'];

function isPrivatePath(pathname: string) {
  return PRIVATE_PREFIXES.some((p) => pathname.startsWith(p));
}

function isAuthPath(pathname: string) {
  return AUTH_PREFIXES.some((p) => pathname.startsWith(p));
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const { user, isAuthenticated, setUser, setIsAuthenticated, clearAuth } = useAuthStore();

  const [checking, setChecking] = useState(true);
  const redirectedRef = useRef(false);
  const checkedOnceRef = useRef(false);

  // 1) Одноразова перевірка сесії при монтуванні
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const me = await checkSession(); // вертає User або null
        if (!mounted) return;

        if (me) {
          setUser(me);
          setIsAuthenticated(true);
        } else {
          clearAuth();
        }
      } catch {
        clearAuth();
      } finally {
        if (mounted) {
          setChecking(false);
          checkedOnceRef.current = true;
        }
      }
    })();

    return () => {
      mounted = false;
    };
    // важливо: стора-функції стабільні (Zustand), `[]` достатньо
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) Разова навігація після перевірки
  useEffect(() => {
    if (checking) return; // дочекайся завершення checkSession
    if (redirectedRef.current) return; // уже редіректили — не повторюємо

    // Неавторизований і намагається зайти на приватний маршрут?
    if (!isAuthenticated && isPrivatePath(pathname)) {
      redirectedRef.current = true;
      router.replace('/sign-in');
      return;
    }

    // Авторизований і зайшов на auth-сторінки?
    if (isAuthenticated && isAuthPath(pathname)) {
      redirectedRef.current = true;
      router.replace('/profile');
      return;
    }
  }, [checking, isAuthenticated, pathname, router]);

  // 3) Нічого не оновлюємо у тілі компоненту! Тільки рендер.
  // Можеш показувати лоадер поки йде перевірка
  if (checking && isPrivatePath(pathname)) {
    return <div style={{ padding: 24 }}>Checking session…</div>;
  }

  return <>{children}</>;
}
