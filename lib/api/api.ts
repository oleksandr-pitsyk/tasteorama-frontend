// lib/api/api.ts — для створення одного спільного екземпляра axios,
// з налаштуванням withCredentials: true для підтримки cookies;
// ==========================================================================================

// Імпорт бібліотеки axios
import axios from 'axios';

// Базова URL-адреса для всіх запитів, що надсилаються через цей інстанс
// Видаляємо стару логіку baseURL
// axios.defaults.baseURL = 'https://tasteorama-backend-jumn.onrender.com';
// axios.defaults.baseURL = 'http://localhost:3000/api';

// Створюємо інстанс axios
export const nextServer = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true, // дозволяє axios працювати з cookie
});
