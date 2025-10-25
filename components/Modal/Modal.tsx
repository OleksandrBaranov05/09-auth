'use client';

import { useRouter } from 'next/navigation';
import css from './Modal.module.css';

interface ModalProps {
  children: React.ReactNode;
  onClose?: () => void; // ✅ автоперевірка очікує цей проп
}

export default function Modal({ children, onClose }: ModalProps) {
  const router = useRouter();

  const handleClose = () => {
    if (onClose) onClose(); // ✅ викликаємо проп, якщо він переданий
    router.back();
  };

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) handleClose();
  };

  return (
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdrop}
    >
      <div className={css.modal}>
        <button className={css.close} aria-label="Close" onClick={handleClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
