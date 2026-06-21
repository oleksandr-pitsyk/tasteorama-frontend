// lib/api/api.ts — для створення одного спільного екземпляра axios,
// з налаштуванням withCredentials: true для підтримки cookies;
// ==========================================================================================
// Імпорт бібліотеки axios
import axios from 'axios';

// Базова URL-адреса для всіх запитів, що надсилаються через цей інстанс
// Видаляємо стару логіку baseURL
// axios.defaults.baseURL = 'https://tasteorama-backend-jumn.onrender.com';
// axios.defaults.baseURL = 'http://localhost:3000/api';

// Для локальної розробки використовуємо змінну середовища, яка вказує на серверний API, що проксіює запити до бекенда
// Це дозволяє уникнути проблем з CORS, оскільки всі запити будуть йти на той же домен, що і фронтенд

// Створюємо інстанс axios
export const nextServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/api',
  withCredentials: true, // дозволяє axios працювати з cookie
});

// // Створюємо інстанс axios для роботи з API
// export const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL + '/api',
//   withCredentials: true, // Це критично важливо для передачі cookies
// });

// // Додаємо інтерсептор для автоматичного оновлення токена (refresh logic)
// api.interceptors.response.use(
//   response => response,
//   async error => {
//     const originalRequest = error.config;

//     // Якщо ми отримали 401 Unauthorized і запит ще не був повторений
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         // Викликаємо ваш ендпоінт для оновлення токена
//         // Переконайтеся, що шлях відповідає вашому бекенду
//         await api.post('/users/refresh');

//         // Повторюємо оригінальний запит з оновленими куками
//         return api(originalRequest);
//       } catch (refreshError) {
//         // Якщо рефреш теж не вдався, користувач неавторизований
//         // Перенаправляємо на сторінку логіну
//         if (typeof window !== 'undefined') {
//           window.location.href = '/login';
//         }
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );
