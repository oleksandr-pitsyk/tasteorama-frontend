// Імпорт компонента Link з Next.js - Для створення посилань
import Link from 'next/link';

// Імпорт стилів з модуля стилів
import css from './Header.module.css';

// Імпорт компонента AuthNavigation
// import AuthNavigation from '@/components/AuthNavigation/AuthNavigation';

const HeaderMy = () => {
  const recipeId = '6462a8f74c3d0ddd28897fbc'; // Приклад Id рецепту для посилання

  return (
    <header className={css.header}>
      <nav aria-label="Main Navigation">
        <ul className={css.navigation}>
          <li className={css.navigationItem}>
            <Link href="/" className={css.navigationLink}>
              Home
            </Link>
          </li>

          <li className={css.navigationItem}>
            {/* Приклад посилання на рецепт за Id */}
            {/* <Link href={`/notes/${item.id}`}>{item.title}</Link> */}
            <Link href={`/recipes/${recipeId}`}>Рецепт за Id {recipeId}</Link>
          </li>
          <li className={css.navigationItem}>
            <Link href={`/auth/register`}>Register-Modal</Link>
          </li>
          <li className={css.navigationItem}>
            <Link href={`/auth/login`}>Login-Modal</Link>
          </li>
          <li className={css.navigationItem}>
            <Link href={`/profile/own`}>Profile-Own</Link>
          </li>
          {/* Навігація для авторизації та авторизованих користувачів */}
          {/* <AuthNavigation /> */}
        </ul>
      </nav>
    </header>
  );
};

export default HeaderMy;
