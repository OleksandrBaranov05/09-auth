'use client';

import { useRouter } from 'next/navigation';
import css from './Modal.module.css';

export default function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const onClose = () => router.back();

  const onBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={css.backdrop} role="dialog" aria-modal="true" onClick={onBackdrop}>
      <div className={css.modal}>
        <button className={css.close} aria-label="Close" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
}
