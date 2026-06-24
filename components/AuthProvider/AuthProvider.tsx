// ===========================================================================
// Перевірка авторизації користувача - AuthProvider
// ===========================================================================
// Перевіряє, чи користувач авторизований,
// і при переході на приватну сторінку виконує повторну перевірку сесії.
// Якщо користувач неавторизований і намагається перейти на приватну сторінку,
// має виконуватися вихід і контент не відображатись.
// Під час перевірки показуйте лоедер.
// ===========================================================================
'use client';

import { checkSession, getMe } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

type Props = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  // const user = useAuthStore(state => state.user);
  const setUser = useAuthStore(state => state.setUser);
  const clearIsAuthenticated = useAuthStore(state => state.clearIsAuthenticated);
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      // Перевіряємо сесію
      const isAuthenticated = await checkSession();

      if (isAuthenticated) {
        // Якщо сесія валідна — отримуємо користувача
        const userCurrent = await getMe();

        if (userCurrent) setUser(userCurrent);
      } else {
        // Якщо сесія невалідна — чистимо стан
        clearIsAuthenticated();
      }
    };
    fetchUser();
  }, [pathname, setUser, clearIsAuthenticated]);

  return children;
};

export default AuthProvider;
