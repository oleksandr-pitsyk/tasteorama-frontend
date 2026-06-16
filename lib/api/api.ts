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

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/api',
  withCredentials: true, // дозволяє axios працювати з cookie
});
// Створюємо інстанс axios
export const nextServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/api',
  withCredentials: true, // дозволяє axios працювати з cookie
});
