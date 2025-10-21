'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import css from './TagsMenu.module.css';

const TAGS = ['All', 'Todo', 'Work', 'Personal', 'Meeting', 'Shopping'] as const;

export default function TagsMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

 
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  return (
    <div ref={ref} className={css.menuContainer}>
      {}
      <button
        type="button"
        suppressHydrationWarning
        className={css.menuButton}
        onClick={() => setOpen(v => !v)}
      >
        Notes ▾
      </button>

      {open && (
        <ul className={css.menuList}>
          {TAGS.map(tag => (
            <li key={tag} className={css.menuItem}>
              <Link
                className={css.menuLink}
                href={tag === 'All' ? '/notes/filter/All' : `/notes/filter/${tag}`}
                onClick={() => setOpen(false)}
              >
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
