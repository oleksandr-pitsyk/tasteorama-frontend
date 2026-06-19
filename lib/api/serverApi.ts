// ================================================================================
// lib/api/serverApi.ts — для функцій, які викликаються у серверних компонентах
// (до params потрібно додавати cookeis у headers):
// ================================================================================
// checkSessionServer
// getMeServer

// fetchNotes
// fetchNoteById
// ================================================================================

import { cookies } from 'next/headers';
import { nextServer } from './api';

import { User } from '@/types/user';

// ==========================================================================================
// checkSession : Перевірка сесії користувача (чи він авторизований)
// ==========================================================================================
type CheckSessionRequest = {
  success: boolean;
};

export const checkSessionServer = async () => {
  // Дістаємо поточні cookie
  const cookieStore = await cookies();
  const res = await nextServer.get<CheckSessionRequest>('/auth/session', {
    headers: {
      // передаємо кукі далі
      Cookie: cookieStore.toString(),
    },
  });
  return res;
};

// ==========================================================================================
// getMe : Отримання об’єкта користувача (профілю) для авторизованого користувача
// ==========================================================================================

export const getMeServer = async () => {
  // Дістаємо поточні cookie
  const cookieStore = await cookies();
  const res = await nextServer.get<User>('/auth/me', {
    headers: {
      // передаємо кукі далі
      Cookie: cookieStore.toString(),
    },
  });
  return res.data;
};
