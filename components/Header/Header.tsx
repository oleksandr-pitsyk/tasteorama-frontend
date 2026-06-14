// Імпорт компонента Link з Next.js - Для створення посилань
import Link from 'next/link';

// Імпорт стилів з модуля стилів
import css from './Header.module.css';

// Імпорт компонента AuthNavigation
import AuthNavigation from '@/components/AuthNavigation/AuthNavigation';

const Header = () => {
  return (
    <header className={css.header}>
      <Link href="/" aria-label="Home" className={css.headerLink}>
        Tasteorama
      </Link>
      <nav aria-label="Main Navigation">
        <ul className={css.navigation}>
          <li className={css.navigationItem}>
            <Link href="/" className={css.navigationLink}>
              Home
            </Link>
          </li>

          {/* Навігація для авторизації та авторизованих користувачів */}
          <AuthNavigation />

          <li className={css.navigationItem}>
            <Link href="/about" className={css.navigationLink}>
              About
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
