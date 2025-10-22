'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { checkSession } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { setUser, clearIsAuthenticated, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const verify = async () => {
      try {
        const user = await checkSession();
        if (user) {
          setUser(user);
        } else {
          clearIsAuthenticated();
          if (pathname.startsWith('/notes') || pathname.startsWith('/profile')) {
            router.push('/sign-in');
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        clearIsAuthenticated();
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [pathname, router, setUser, clearIsAuthenticated]);

  if (loading) return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Loading...</p>;

  return <>{children}</>;
}
