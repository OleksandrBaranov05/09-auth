'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { checkSession, logout } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

const PRIVATE_PREFIXES = ['/notes', '/profile'];
const AUTH_PREFIXES = ['/sign-in', '/sign-up'];

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { setUser, clearIsAuthenticated } = useAuthStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const user = await checkSession();
        if (user) {
          setUser(user);

          if (AUTH_PREFIXES.some((p) => pathname.startsWith(p))) {
            router.replace('/profile');
          }
        } else {
        
          if (PRIVATE_PREFIXES.some((p) => pathname.startsWith(p))) {
            clearIsAuthenticated();
            await logout().catch(() => {});
            router.replace('/sign-in');
          } else {
            clearIsAuthenticated();
          }
        }
      } finally {
        if (mounted) setChecking(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [pathname, router, setUser, clearIsAuthenticated]);

  if (checking) return <p style={{ padding: 16 }}>Checking session...</p>;

  return <>{children}</>;
}
