// ================================================================================
// lib/api/clientApi.ts — для функцій, які викликаються у клієнтських компонентах:
// ================================================================================
// register
// login
// checkSession
// getMe
// *********** НЕОБХОДИМО !!!
// updateMe
// **************************
// logout

// fetchNotes
// fetchNoteById
// createNote
// deleteNote

// ================================================================================

import { User } from '@/types/user';

import { nextServer } from '@/lib/api/api';

export interface NewUser {
  email: string;
  password: string;
}

export interface EditUser {
  email: string;
  username: string;
}

// ==========================================================================================
// register : реєстрація користувача (створення нового акаунта) на сервері.
// ==========================================================================================
export const register = async (newUser: NewUser) => {
  const response = await nextServer.post<User>('/auth/register', newUser);
  return response.data;
};
// ==========================================================================================

export interface LoginRequest {
  email: string;
  password: string;
}
// ==========================================================================================
// login : вход користувача (авторизація) на сервері.
// ==========================================================================================
export const login = async (loginData: LoginRequest) => {
  const response = await nextServer.post<User>('/auth/login', loginData);
  return response.data;
};
// ==========================================================================================

type CheckSessionRequest = {
  success: boolean;
};
// ==========================================================================================
// checkSession : перевірка сесії користувача на сервері.
// ==========================================================================================
export const checkSession = async () => {
  const response = await nextServer.get<CheckSessionRequest>('/auth/session');
  return response.data.success;
};

// ==========================================================================================
// getMe : отримання інформації про поточного користувача.
// ==========================================================================================
export const getMe = async () => {
  const { data } = await nextServer.get<User>('/users/me');
  return data;
};

// ==========================================================================================
// updateMe : оновлення інформації про поточного користувача.
// ==========================================================================================
export const updateMe = async (userData: EditUser) => {
  const { data } = await nextServer.patch<User>('/users/me', userData);
  return data;
};

// ==========================================================================================
// logout : вихід користувача з системи.
// ==========================================================================================
export const logout = async (): Promise<void> => {
  await nextServer.post('/auth/logout');
};

// ------------------------------------------------------------------------------------------
// fetchNotes : має виконувати запит для отримання колекції нотаток із сервера.
// Повинна підтримувати пагінацію (через параметр сторінки) та фільтрацію за ключовим словом (пошук);
// ------------------------------------------------------------------------------------------
// createNote: має виконувати запит для створення нової нотатки на сервері.
// Приймає вміст нової нотатки та повертає створену нотатку у відповіді;
// ------------------------------------------------------------------------------------------
// deleteNote: має виконувати запит для видалення нотатки за заданим ідентифікатором.
// Приймає ID нотатки та повертає інформацію про видалену нотатку у відповіді.
// ------------------------------------------------------------------------------------------

// Імпорт інтерфейсів
import type { Note, NoteFormValues } from '@/types/note';

// Типізація відповіді Get-запиту від Axios - згідно структури бекенда :
// https://notehub-public.goit.study/api/docs/#/Notes/getNote
interface GetNotesHttpResponse {
  notes: Note[]; // Відповідь містить масив нотаток у властивості results
  totalPages: number; // Загальна кількість сторінок результатів
}

// Типізація відповіді Get-запиту за id від Axios :
type GetNotesByIdHttpResponse = Note; // Відповідь містить нотатку

// Типізація відповіді Delete-запиту від Axios :
type DeleteNotesHttpResponse = Note; // Відповідь містить нотатку

// Типізація відповіді Post-запиту від Axios :
type PostNotesHttpResponse = Note; // Відповідь містить нотатку

// ==========================================================================================
// fetchNotes : виконуєзапит для отримання колекції нотаток із сервера.
// Підтримує пагінацію (через параметр сторінки) та фільтрацію за ключовим словом (пошук)
// ==========================================================================================
// Структура запиту :
// ------------------------------------------------------------------------------------------
// https://notehub-api.goit.study/notes?search=SEARCH&tag=Work&page=1&perPage=12&sortBy=created
// ------------------------------------------------------------------------------------------
// Базовий URL
// https://notehub-api.goit.study
// ------------------------------------------------------------------------------------------
// Search notes by title or content - Пошук нотаток по заголовку або контенту
// search=example_search
// ------------------------------------------------------------------------------------------
// Filter notes by tag - Фільтрація по тегу (не обов'язково !)
// tag=Work
// ------------------------------------------------------------------------------------------
// Page number - Номер сторінки для пагінації
// page=2
// ------------------------------------------------------------------------------------------
// Notes per page - Кількість нотаток на сторінці
// perPage=10
// ------------------------------------------------------------------------------------------
// Sort notes by created or updated field - Сортування за часом створення або оновлення
// (не обов'язково !)
// sortBy=updated
// ------------------------------------------------------------------------------------------

export async function fetchNotes(
  nameSearch: string,
  tag: string = 'all',
  pageCurrent: number = 1
): Promise<GetNotesHttpResponse> {
  let options;
  if (tag === 'all') {
    options = {
      // method: 'GET',
      // headers: {
      //   // axios автоматично встановлює заголовок Accept: application/json для запитів,
      //   // які очікують JSON-відповідь, тому його можна не вказувати явно.
      //   // accept: 'application/json',
      //   Authorization: myAuthorization,
      // },
      // Додаткові параметри запиту Get
      params: {
        search: nameSearch,
        page: pageCurrent,
        perPage: 12,
      },
    };
  } else {
    options = {
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
    // Виконуємо HTTP-запит
    const response = await nextServer.get<GetNotesByIdHttpResponse>(`/notes/${noteId}`);
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

// ==========================================================================================
// deleteNote: має виконувати запит для видалення нотатки за заданим ідентифікатором.
// Приймає ID нотатки та повертає інформацію про видалену нотатку у відповіді.
// ==========================================================================================
// Структура запиту :
// ------------------------------------------------------------------------------------------
// https://notehub-public.goit.study/api/notes/65ca67e7ae7f10c88b598384
// ------------------------------------------------------------------------------------------
// Базовий URL
// https://notehub-public.goit.study/api/notes
// ------------------------------------------------------------------------------------------
// Ідентифікатор запису для видалення
// "id": string    "65ca67e7ae7f10c88b598384"
// ------------------------------------------------------------------------------------------
export async function deleteNote(noteId: string): Promise<DeleteNotesHttpResponse> {
  if (noteId !== '') {
    // Виконуємо HTTP-запит на видалення запису
    const response = await nextServer.delete<DeleteNotesHttpResponse>(`/notes/${noteId}`);
    // console.log('Delete :');
    // console.log('response.data.note', response.data);

    // Повертаємо інформацію про видалену нотатку у відповіді
    return response.data;
  } else {
    throw new Error('Note ID is required for deletion');
  }
}
// ==========================================================================================

// ==========================================================================================
// createNote: має виконувати запит для створення нової нотатки на сервері.
// Приймає вміст нової нотатки та повертає створену нотатку у відповіді
// ==========================================================================================
// curl -X 'POST' \
//   'https://notehub-public.goit.study/api/notes' \
//   -H 'accept: application/json' \
//   -H 'Content-Type: application/json' \
//   -d '{
//      "title": "Sample Note",
//      "content": "",
//      "tag": "Todo"
//   }'
// ------------------------------------------------------------------------------------------
// Базовий URL
// https://notehub-public.goit.study/api/notes
// ------------------------------------------------------------------------------------------
export async function createNote(noteCreate: NoteFormValues): Promise<PostNotesHttpResponse> {
  // Виконуємо HTTP-запит на додавання нового запису
  const response = await nextServer.post<PostNotesHttpResponse>('/notes', noteCreate);
  // console.log('Add new - POST :');
  // console.log('response.data', response.data);

  // Повертаємо інформацію про видалену нотатку у відповіді
  return response.data;
}
// ==========================================================================================

// ******************************************************************
// Просто для інформації :

// Встановлюємо базовий URL для всіх запитів axios
// Для ДЗ-8
// axios.defaults.baseURL = 'https://notehub-public.goit.study/api';

// Отримуємо значення змінної оточення (з файлу .env)
// Не забуваємо додати .env в файл .gitignore !!!
// Додатково треба додати в Versel (Settings → Environment Variables)
// const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
// const myAuthorization = 'Bearer ' + myKey;
// Встановлюємо в header запиту - авторизацію
// axios.defaults.headers.common['Authorization'] = myAuthorization;

// Приклад дефолтного параметру
// axios.defaults.params = {
//   orientation: 'landscape',
// };
// ******************************************************************
