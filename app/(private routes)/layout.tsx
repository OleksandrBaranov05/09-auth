// app/(private routes)/layout.tsx
import type { ReactNode } from 'react';

export default function PrivateLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
