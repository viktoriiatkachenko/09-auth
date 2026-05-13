import Link from 'next/link';
import AuthNavigation from '../AuthNavigation/AuthNavigation';
import css from './Header.module.css';

export default function Header() {
  return (
    <header className={css.header}>
      <Link href="/" className={css.logo}>
        NoteHub
      </Link>

      <nav>
        <ul className={css.navigation}>
          <li className={css.navigationItem}>
            <Link href="/notes" className={css.navigationLink}>
              Notes
            </Link>
          </li>

          <AuthNavigation />
        </ul>
      </nav>
    </header>
  );
}