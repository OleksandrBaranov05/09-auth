// components/Header/Header.tsx
import Link from 'next/link';
import AuthNavigation from '@/components/AuthNavigation/AuthNavigation';
import css from './Header.module.css';

export default function Header() {
  return (
    <header className={css.header}>
      <Link href="/" aria-label="Home" className={css.logo}>
        NoteHub
      </Link>

      <nav aria-label="Main Navigation">
        <ul className={css.navigation}>
          <li className={css.navigationItem}>
            <Link href="/" prefetch={false} className={css.navigationLink}>
              Home
            </Link>
          </li>

          {}
          <li className={css.navigationItem}>
            <Link
              href="/notes/filter/All"
              prefetch={false}
              className={css.navigationLink}
            >
              Notes
            </Link>
          </li>

          {}
          <li className={css.navigationItem}>
            <Link
              href="/notes/action/create"
              prefetch={false}
              className={css.createButton}
            >
              Create note +
            </Link>
          </li>

          {}
          <AuthNavigation />
        </ul>
      </nav>
    </header>
  );
}
