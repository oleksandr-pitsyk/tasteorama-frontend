// ================================================================================
// lib/api/serverApi.ts — для функцій, які викликаються у серверних компонентах
// (до params потрібно додавати cookeis у headers):
// ================================================================================
// checkSession
// getMe

// fetchNotes
// fetchNoteById
// ================================================================================

import { cookies } from 'next/headers';
import { nextServer } from './api';

import { User } from '@/types/user';

// ================================================================================
// Серверна перевірка сесії
// ================================================================================
export const checkSessionServer = async () => {
  // Дістаємо поточні cookie
  const cookieStore = await cookies();
  const res = await nextServer.get('/auth/session', {
    headers: {
      // передаємо кукі далі
      Cookie: cookieStore.toString(),
    },
  });
  // Повертаємо повний респонс, щоб proxy мав доступ до нових cookie
  return res;
};
// ================================================================================

// ================================================================================
// ================================================================================
export const getMeServer = async (): Promise<User> => {
  // Дістаємо поточні cookie
  const cookieStore = await cookies();
  const { data } = await nextServer.get('/users/me', {
    headers: {
      // передаємо кукі в заголовках запиту
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};
// ================================================================================

// *********************************************************************************
// Серверні функції для роботи з категоріями
// *********************************************************************************
// Імпорт інтерфейсів
import type { Category } from '@/types/category';

// Типізація відповіді Get-запиту від Axios - згідно структури бекенда :
interface GetCategoriesHttpResponse {
  data: Category[]; // Відповідь містить масив категорій у властивості data
}
// ==========================================================================================
// getCategories : виконує запит для отримання колекції категорій із сервера.
// ==========================================================================================
// Структура запиту :

export async function getCategories(): Promise<GetCategoriesHttpResponse> {
  // Виконуємо HTTP-запит
  const response = await nextServer.get<GetCategoriesHttpResponse>('/api/categories');
  // console.log('Fetch - GET :');
  console.log('response.data', response.data);
  // console.log('totalPages', response.data.totalPages);

  // Повертаємо значення notes та totalPages відповіді
  return response.data;
}

// ********************************************************************************
// Серверні функції для роботи з нотатками
// ********************************************************************************

// Імпорт інтерфейсів
import type { Note } from '@/types/note';

// Типізація відповіді Get-запиту від Axios - згідно структури бекенда :
// https://notehub-public.goit.study/api/docs/#/Notes/getNote
interface GetNotesHttpResponse {
  notes: Note[]; // Відповідь містить масив нотаток у властивості results
  totalPages: number; // Загальна кількість сторінок результатів
}

// Типізація відповіді Get-запиту за id від Axios :
type GetNotesByIdHttpResponse = Note; // Відповідь містить нотатку

// ==========================================================================================
// fetchNotes : виконуєзапит для отримання колекції нотаток із сервера.
// Підтримує пагінацію (через параметр сторінки) та фільтрацію за ключовим словом (пошук)
// ==========================================================================================

export async function fetchNotes(
  nameSearch: string,
  tag: string = 'all',
  pageCurrent: number = 1
): Promise<GetNotesHttpResponse> {
  let options;
  // Дістаємо поточні cookie
  const cookieStore = await cookies();

  if (tag === 'all') {
    options = {
      headers: {
        // передаємо кукі в заголовках запиту
        Cookie: cookieStore.toString(),
      },
      params: {
        search: nameSearch,
        page: pageCurrent,
        perPage: 12,
      },
    };
  } else {
    options = {
      headers: {
        // передаємо кукі в заголовках запиту
        Cookie: cookieStore.toString(),
      },
      params: {
        search: nameSearch,
        page: pageCurrent,
        tag: tag,
        perPage: 12,
      },
    };
  }

  // Виконуємо HTTP-запит
  const response = await nextServer.get<GetNotesHttpResponse>('/notes', options);
  // console.log('Fetch - GET :');
  // console.log('response.data.notes', response.data.notes);
  // console.log('totalPages', response.data.totalPages);

  // Повертаємо значення notes та totalPages відповіді
  return {
    notes: response.data.notes,
    totalPages: response.data.totalPages,
  };
}
// ==========================================================================================

// ==========================================================================================
// fetchNoteById : для отримання деталей однієї нотатки за її ідентифікатором..
// ==========================================================================================
export async function fetchNoteById(noteId: string): Promise<GetNotesByIdHttpResponse> {
  if (noteId !== '') {
    // Дістаємо поточні cookie
    const cookieStore = await cookies();
    // Виконуємо HTTP-запит
    const response = await nextServer.get<GetNotesByIdHttpResponse>(`/notes/${noteId}`, {
      headers: {
        // передаємо кукі в заголовках запиту
        Cookie: cookieStore.toString(),
      },
    });
    // console.log('FetchById - GET :');
    // console.log('response.data', response.data);

    // Повертаємо значення note відповіді - деталі однієї нотатки
    return response.data;
  } else {
    // Створюємо та викидаємо помилку, якщо noteId не передано або є порожнім рядком
    throw new Error('Note ID is required for deletion');
  }
}
// ==========================================================================================
