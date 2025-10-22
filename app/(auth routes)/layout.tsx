'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthRoutesLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // Одноразовий refresh після монтування (не чіпай залежності!)
  useEffect(() => {
    router.refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}
