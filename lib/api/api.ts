import axios from 'axios';

// Створюємо інстанс axios для роботи з API
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/api',
  withCredentials: true, // Це критично важливо для передачі cookies
});

// Додаємо інтерсептор для автоматичного оновлення токена (refresh logic)
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Якщо ми отримали 401 Unauthorized і запит ще не був повторений
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Викликаємо ваш ендпоінт для оновлення токена
        // Переконайтеся, що шлях відповідає вашому бекенду
        await api.post('/users/refresh');

        // Повторюємо оригінальний запит з оновленими куками
        return api(originalRequest);
      } catch (refreshError) {
        // Якщо рефреш теж не вдався, користувач неавторизований
        // Перенаправляємо на сторінку логіну
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Інстанс для серверних операцій (якщо потрібно)
export const nextServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/api',
  withCredentials: true,
});
