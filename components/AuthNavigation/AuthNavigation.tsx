// ===================================================================
// Навігація по сторінкам AuthNavigation
// ===================================================================
// Щоб змінювати відображення кнопок у хедері залежно від статусу авторизації користувача,
// окремий компонент AuthNavigation, який буде містити логіку відображення
// різних пунктів меню для авторизованих та неавторизованих користувачів.
// ===================================================================
'use client';

// Імпорт стилів з модуля стилів
import css from './AuthNavigation.module.css';

// Імпорт компонента Link з Next.js - Для створення посилань
import Link from 'next/link';

// Імпорт компонента useRouter з Next.js - Для навігації
import { useRouter } from 'next/navigation';

// Імпорт глобального стану аутентифікації користувача
import { useAuthStore } from '@/lib/store/authStore';

// Імпорт функції виходу з клієнтського API
import { logout } from '@/lib/api/clientApi';

const AuthNavigation = () => {
  const router = useRouter();
  // Отримуємо поточну сесію та юзера
  const { isAuthenticated, user } = useAuthStore();
  console.log('AuthNavigation - isAuthenticated:', isAuthenticated, 'user:', user);
  // Отримуємо метод очищення глобального стану
  const clearIsAuthenticated = useAuthStore(state => state.clearIsAuthenticated);

  const handleLogout = async () => {
    // Викликаємо logout - функції виходу з клієнтського API
    await logout();
    // Чистимо глобальний стан
    clearIsAuthenticated();
    // Виконуємо навігацію на сторінку логіну після виходу
    router.push('/auth/login');
  };

  // Якщо є сесія - відображаємо Logout та інформацію про користувача
  // інакше - відображаємо посилання на логін та реєстрацію
  return isAuthenticated ? (
    <>
      <li className={css.navigationItem}>
        <Link href="/profile/own" prefetch={false} className={css.navigationLink}>
          Profile
        </Link>
      </li>

      <li className={css.navigationItem}>
        <p className={css.userEmail}>{user?.email}</p>
        <button className={css.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </li>
    </>
  ) : (
    <>
      <li className={css.navigationItem}>
        <Link href="/auth/login" prefetch={false} className={css.navigationLink}>
          Login
        </Link>
      </li>

      <li className={css.navigationItem}>
        <Link href="/auth/register" prefetch={false} className={css.navigationLink}>
          Register
        </Link>
      </li>
    </>
  );
};

export default AuthNavigation;
