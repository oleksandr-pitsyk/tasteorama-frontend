'use client';

import css from './AuthNavigation.module.css';
import Link from 'next/link';
import UserBar from '../UserBar/UserBar';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { logout } from '@/lib/api/clientApi';
interface AuthNavigationProps {
  onLinkClick?: () => void;
}

const AuthNavigation = ({ onLinkClick }: AuthNavigationProps) => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  // Отримуємо метод очищення глобального стану
  const clearIsAuthenticated = useAuthStore(state => state.clearIsAuthenticated);

  const handleLogout = async () => {
    // Викликаємо logout
    await logout();
    // Чистимо глобальний стан
    clearIsAuthenticated();
    // Виконуємо навігацію на сторінку авторизації
    router.push('/auth/login');
  };

  // Якщо є сесія - відображаємо кнопку Logout та інформацію про користувача
  // інакше - лінки для авторизації
  return isAuthenticated ? (
    <>
      <li className={css.navigationItem}>
        <Link onClick={onLinkClick} className={css.navigationLink} href="/profile/own">
          My Profile
        </Link>
      </li>
      <UserBar name={user?.name ?? ''} onLogout={handleLogout} />
      <li className={css.navigationItem}>
        <Link onClick={onLinkClick} className={css.akcentLink} href="/add-recipe" prefetch={false}>
          Add Recipe
        </Link>
      </li>
    </>
  ) : (
    <>
      <div className={css.notAuthUser}>
        <li>
          <Link
            onClick={onLinkClick}
            className={css.navigationLink}
            href="/auth/login"
            prefetch={false}
          >
            Log in
          </Link>
        </li>

        <li>
          <Link
            onClick={onLinkClick}
            className={css.akcentLink}
            href="/auth/register"
            prefetch={false}
          >
            Register
          </Link>
        </li>
      </div>
    </>
  );
};

export default AuthNavigation;
