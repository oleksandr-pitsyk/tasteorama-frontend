'use client';

import css from './AuthNavigation.module.css';
import Link from 'next/link';
import UserBar from '../UserBar/UserBar';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
// import { logout } from '@/lib/api/clientApi';
interface AuthNavigationProps {
  onLinkClick?: () => void;
}

const AuthNavigation = ({ onLinkClick }: AuthNavigationProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();

  // Отримуємо метод очищення глобального стану
  // const clearIsAuthenticated = useAuthStore(state => state.clearIsAuthenticated);

  const handleLogout = async () => {
    router.push('/logout');
  };

  return isAuthenticated ? (
    <>
      <li className={css.navigationItem}>
        <Link
          onClick={onLinkClick}
          className={`${css.navigationLink} ${pathname.startsWith('/profile') ? css.activeLink : ''}`}
          href="/profile/own"
        >
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
            className={`${css.navigationLink} ${pathname === '/auth/login' ? css.activeLink : ''}`}
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
