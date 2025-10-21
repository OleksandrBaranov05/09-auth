
import Link from 'next/link';
import AuthNavigation from '@/components/AuthNavigation/AuthNavigation';
import css from './Header.module.css';


export default function Header() {
  return (
    <header className={css.header}>
      <Link href="/" aria-label="Home">NoteHub</Link>

      <nav aria-label="Main Navigation">
        <ul className={css.navigation}>
          <li>
            <Link href="/" className={css.navigationLink}>Home</Link>
          </li>

          {}
          { }

          {}
          <AuthNavigation />
        </ul>
      </nav>
    </header>
  );
}
